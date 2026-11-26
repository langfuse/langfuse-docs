import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { transformSync } from "esbuild";

const compile = (path) =>
  transformSync(readFileSync(new URL("../" + path, import.meta.url), "utf8"), {
    loader: path.endsWith(".tsx") ? "tsx" : "ts",
    format: "cjs",
    target: "es2022",
    jsx: "automatic",
  }).code;

function load(source, requireFn) {
  const module = { exports: {} };
  new Function("require", "module", "exports", source)(
    requireFn,
    module,
    module.exports,
  );
  return module.exports;
}

const cookieConsent = load(compile("lib/cookie-consent.ts"), () => {
  throw Error("Unexpected import");
});

test("readAnalyticsConsent and readFunctionalConsent handle returning visitors, live API revokes, and unknown states", () => {
  try {
    globalThis.window = {};
    globalThis.document = { cookie: "" };
    assert.equal(cookieConsent.readAnalyticsConsent(), "unknown");
    assert.equal(cookieConsent.readFunctionalConsent(), "unknown");

    // Pre-answer cookie written by CookieYes before the visitor chooses
    globalThis.document.cookie =
      "cookieyes-consent=consentid:abc,consent:no,action:no,necessary:yes,functional:no,analytics:no,advertisement:no";
    assert.equal(cookieConsent.readAnalyticsConsent(), "unknown");
    assert.equal(cookieConsent.readFunctionalConsent(), "unknown");

    // Returning visitor who accepted earlier, before CookieYes script loads
    globalThis.document.cookie =
      "cookieyes-consent=consentid:abc,consent:yes,action:yes,necessary:yes,functional:yes,analytics:yes,advertisement:yes";
    assert.equal(cookieConsent.readAnalyticsConsent(), "granted");
    assert.equal(cookieConsent.readFunctionalConsent(), "granted");

    // Independent category answers from persisted cookie
    globalThis.document.cookie =
      "cookieyes-consent=consentid:abc,consent:yes,action:yes,necessary:yes,functional:yes,analytics:no,advertisement:no";
    assert.equal(cookieConsent.readAnalyticsConsent(), "denied");
    assert.equal(cookieConsent.readFunctionalConsent(), "granted");

    // Live API revocation wins over stale cookie
    globalThis.window.getCkyConsent = () => ({
      activeLaw: "gdpr",
      categories: { functional: false, analytics: false, advertisement: false },
      isUserActionCompleted: true,
    });
    assert.equal(cookieConsent.readAnalyticsConsent(), "denied");
    assert.equal(cookieConsent.readFunctionalConsent(), "denied");

    // Live API before user action in opt-in region still reads "unknown" if cookie has no prior grant
    globalThis.document.cookie =
      "cookieyes-consent=consentid:abc,consent:no,action:no,necessary:yes,functional:no,analytics:no";
    globalThis.window.getCkyConsent = () => ({
      activeLaw: "gdpr",
      categories: { functional: false, analytics: false },
      isUserActionCompleted: false,
    });
    assert.equal(cookieConsent.readAnalyticsConsent(), "unknown");
    assert.equal(cookieConsent.readFunctionalConsent(), "unknown");
  } finally {
    delete globalThis.window;
    delete globalThis.document;
  }
});

test("AnalyticsConsentGate opens only on granted and stays open for the page lifetime", () => {
  const listeners = {};
  let consentState = "unknown";
  let currentState = false;
  let rerenderCount = 0;

  globalThis.document = {
    addEventListener: (type, fn) => {
      listeners[type] = fn;
    },
    removeEventListener: () => {},
  };

  try {
    const mod = load(
      compile("components/analytics/AnalyticsConsentGate.tsx"),
      (name) => {
        if (name === "react") {
          return {
            useState: (initial) => {
              if (rerenderCount === 0) currentState = initial;
              return [
                currentState,
                (next) => {
                  currentState = next;
                },
              ];
            },
            useEffect: (fn) => {
              if (rerenderCount === 0) fn();
            },
          };
        }
        if (name === "react/jsx-runtime") {
          return {
            Fragment: Symbol.for("react.fragment"),
            jsx: (type, props) => ({ type, props }),
          };
        }
        if (name === "@/lib/cookie-consent") {
          return { readAnalyticsConsent: () => consentState };
        }
        throw Error(name);
      },
    );

    const render = () => {
      const out = mod.AnalyticsConsentGate({ children: "CHILD" });
      rerenderCount += 1;
      return out;
    };

    assert.equal(render(), null);
    assert.equal(currentState, false);

    consentState = "denied";
    listeners.cookieyes_banner_load();
    assert.equal(currentState, false);
    assert.equal(render(), null);

    consentState = "granted";
    listeners.cookieyes_consent_update();
    assert.equal(currentState, true);
    assert.equal(render()?.props?.children, "CHILD");

    // Revoking later does not close the gate during the same page lifetime
    consentState = "denied";
    listeners.cookieyes_consent_update();
    assert.equal(currentState, true);
  } finally {
    delete globalThis.document;
  }
});

function createMiniReact() {
  const states = [];
  const refs = [];
  const effects = [];
  let stateIdx = 0;
  let refIdx = 0;
  let effectIdx = 0;

  const hooks = {
    useState(initial) {
      const i = stateIdx++;
      if (i >= states.length) {
        states.push(typeof initial === "function" ? initial() : initial);
      }
      const setState = (next) => {
        states[i] = typeof next === "function" ? next(states[i]) : next;
      };
      return [states[i], setState];
    },
    useRef(initial) {
      const i = refIdx++;
      if (i >= refs.length) refs.push({ current: initial });
      return refs[i];
    },
    useEffect(fn, deps) {
      const i = effectIdx++;
      const prev = effects[i];
      const changed =
        !prev ||
        !deps ||
        !prev.deps ||
        deps.length !== prev.deps.length ||
        deps.some((d, idx) => !Object.is(d, prev.deps[idx]));
      effects[i] = { fn, deps, changed };
    },
  };

  function render(fn) {
    stateIdx = 0;
    refIdx = 0;
    effectIdx = 0;
    const out = fn();
    for (const eff of effects) {
      if (eff.changed) {
        eff.changed = false;
        eff.fn();
      }
    }
    return out;
  }

  return { hooks, render };
}

test("PostHogProvider starts cookieless with pageviews only, recaptures landing page on grant, and cleans up on revoke", () => {
  const prevKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  process.env.NEXT_PUBLIC_POSTHOG_KEY = "phc_test_key";

  let consentState = "unknown";
  let optedIn = false;
  let explicitStatus = "pending";
  let initArgs = null;
  let useCaseReady = null;
  const calls = [];
  const listeners = {};
  const sessionStore = new Map([
    ["ph_phc_test_key_window_id", "win-1"],
    ["ph_phc_test_key_primary_window_exists", "true"],
  ]);

  const fakePosthog = {
    config: {},
    init(key, options) {
      initArgs = { key, options };
      this.config = { ...options };
      options.loaded(this);
    },
    has_opted_in_capturing: () => optedIn,
    get_explicit_consent_status: () => explicitStatus,
    opt_in_capturing(opts) {
      calls.push(["opt_in_capturing", opts]);
      optedIn = true;
      explicitStatus = "granted";
    },
    opt_out_capturing() {
      calls.push(["opt_out_capturing"]);
      optedIn = false;
      explicitStatus = "denied";
    },
    clear_opt_in_out_capturing() {
      calls.push(["clear_opt_in_out_capturing"]);
      explicitStatus = "pending";
    },
    set_config(cfg) {
      calls.push(["set_config", cfg]);
      Object.assign(this.config, cfg);
    },
    capture(name) {
      calls.push(["capture", name, optedIn ? "consented" : "cookieless"]);
    },
    debug() {},
  };

  globalThis.window = {};
  globalThis.document = {
    addEventListener: (type, fn) => {
      listeners[type] = fn;
    },
    removeEventListener: () => {},
  };
  globalThis.sessionStorage = {
    removeItem: (k) => sessionStore.delete(k),
  };

  try {
    const mini = createMiniReact();
    const mod = load(
      compile("components/analytics/PostHogProvider.tsx"),
      (name) => {
        if (name === "react") return mini.hooks;
        if (name === "react/jsx-runtime") {
          return {
            jsx: (type, props) => {
              if (type?.name === "UseCaseAnalytics") useCaseReady = props.ready;
              return { type, props };
            },
            jsxs: (type, props) => ({ type, props }),
          };
        }
        if (name === "next/navigation") {
          return { usePathname: () => "/pricing" };
        }
        if (name === "posthog-js") return fakePosthog;
        if (name === "posthog-js/react") {
          return { PostHogProvider: () => null };
        }
        if (name === "@/components/analytics/common-room") {
          return { crPageView: () => {} };
        }
        if (name === "@/components/analytics/UseCaseAnalytics") {
          return {
            UseCaseAnalytics: function UseCaseAnalytics() {
              return null;
            },
          };
        }
        if (name === "@/lib/cookie-consent") {
          return { readAnalyticsConsent: () => consentState };
        }
        throw Error(name);
      },
    );

    // Mount -> loaded() sets ready=true, then re-render fires initial cookieless $pageview
    mini.render(() => mod.PostHogProvider({ children: null }));
    mini.render(() => mod.PostHogProvider({ children: null }));

    assert.equal(initArgs.key, "phc_test_key");
    assert.equal(initArgs.options.cookieless_mode, "on_reject");
    assert.equal(initArgs.options.opt_out_capturing_by_default, true);
    assert.equal(initArgs.options.opt_out_persistence_by_default, true);
    assert.equal(initArgs.options.persistence, "memory");
    assert.equal(initArgs.options.cross_subdomain_cookie, true);
    assert.equal(initArgs.options.disable_session_recording, true);
    assert.equal(initArgs.options.autocapture, false);
    assert.equal(initArgs.options.capture_heatmaps, false);
    assert.equal(initArgs.options.capture_dead_clicks, false);
    assert.equal(initArgs.options.capture_exceptions, false);
    assert.equal(initArgs.options.disable_surveys, true);

    // No opt_out_capturing() call on unknown/pending so __ph_opt_in_out_* is not written;
    // one cookieless $pageview fires and UseCaseAnalytics stays inactive before consent.
    assert.deepEqual(calls, [["capture", "$pageview", "cookieless"]]);
    assert.equal(useCaseReady, false);
    assert.equal(sessionStore.size, 0);

    // before_send allows only $pageview while consent is unknown or denied
    const beforeSend = initArgs.options.before_send;
    for (const state of ["unknown", "denied"]) {
      consentState = state;
      assert.deepEqual(beforeSend({ event: "$pageview" }), {
        event: "$pageview",
      });
      assert.equal(beforeSend({ event: "use_case:page_viewed" }), null);
      assert.equal(
        beforeSend({ event: "inkeep:user_message_submitted" }),
        null,
      );
      assert.equal(beforeSend({ event: "$autocapture" }), null);
      assert.equal(beforeSend({ event: "$exception" }), null);
      assert.equal(beforeSend({ event: "$dead_click" }), null);
      assert.equal(beforeSend({ event: "survey shown" }), null);
    }

    // Granting analytics consent switches persistence to cookie before opting in,
    // restores remote-config defaults (without forcing heatmaps/dead-clicks/exceptions true),
    // recaptures landing $pageview, and activates UseCaseAnalytics.
    calls.length = 0;
    consentState = "granted";
    listeners.cookieyes_consent_update();
    mini.render(() => mod.PostHogProvider({ children: null }));
    assert.deepEqual(calls, [
      ["set_config", { persistence: "cookie" }],
      ["opt_in_capturing", { captureEventName: false }],
      [
        "set_config",
        {
          disable_session_recording: false,
          autocapture: true,
          disable_surveys: false,
        },
      ],
      ["capture", "$pageview", "consented"],
    ]);
    assert.equal(fakePosthog.config.persistence, "cookie");
    assert.equal("capture_heatmaps" in fakePosthog.config, false);
    assert.equal("capture_dead_clicks" in fakePosthog.config, false);
    assert.equal("capture_exceptions" in fakePosthog.config, false);
    assert.equal(useCaseReady, true);

    // Repeated consent update while still granted does not double-capture $pageview
    calls.length = 0;
    listeners.cookieyes_consent_update();
    mini.render(() => mod.PostHogProvider({ children: null }));
    assert.deepEqual(calls, []);

    assert.deepEqual(beforeSend({ event: "use_case:page_viewed" }), {
      event: "use_case:page_viewed",
    });
    assert.deepEqual(beforeSend({ event: "inkeep:user_message_submitted" }), {
      event: "inkeep:user_message_submitted",
    });

    // Revoking opts out while persistence is still cookie, clears opt-in/out storage,
    // switches back to memory + disabled extensions, removes sessionStorage keys,
    // deactivates UseCaseAnalytics, and does not re-capture $pageview for the same page.
    calls.length = 0;
    sessionStore.set("ph_phc_test_key_window_id", "win-2");
    sessionStore.set("ph_phc_test_key_primary_window_exists", "true");
    consentState = "denied";
    listeners.cookieyes_consent_update();
    mini.render(() => mod.PostHogProvider({ children: null }));
    assert.deepEqual(calls, [
      ["opt_out_capturing"],
      ["clear_opt_in_out_capturing"],
      [
        "set_config",
        {
          disable_session_recording: true,
          autocapture: false,
          capture_heatmaps: false,
          capture_dead_clicks: false,
          capture_exceptions: false,
          disable_surveys: true,
          persistence: "memory",
        },
      ],
    ]);
    assert.equal(fakePosthog.config.persistence, "memory");
    assert.equal(useCaseReady, false);
    assert.equal(sessionStore.size, 0);

    // Re-granting on the same page recaptures a consented $pageview for the new identity
    calls.length = 0;
    consentState = "granted";
    listeners.cookieyes_consent_update();
    mini.render(() => mod.PostHogProvider({ children: null }));
    assert.deepEqual(calls, [
      ["set_config", { persistence: "cookie" }],
      ["opt_in_capturing", { captureEventName: false }],
      [
        "set_config",
        {
          disable_session_recording: false,
          autocapture: true,
          disable_surveys: false,
        },
      ],
      ["capture", "$pageview", "consented"],
    ]);
    assert.equal(useCaseReady, true);
  } finally {
    if (prevKey === undefined) delete process.env.NEXT_PUBLIC_POSTHOG_KEY;
    else process.env.NEXT_PUBLIC_POSTHOG_KEY = prevKey;
    delete globalThis.window;
    delete globalThis.document;
    delete globalThis.sessionStorage;
  }
});

test("PostHogProvider enables full tracking immediately on first load for a returning consented visitor without double pageviews", () => {
  const prevKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  process.env.NEXT_PUBLIC_POSTHOG_KEY = "phc_test_key";

  let optedIn = true;
  let useCaseReady = null;
  const calls = [];

  const fakePosthog = {
    config: {},
    init(_key, options) {
      this.config = { ...options };
      options.loaded(this);
    },
    has_opted_in_capturing: () => optedIn,
    get_explicit_consent_status: () => "granted",
    opt_in_capturing(opts) {
      calls.push(["opt_in_capturing", opts]);
      optedIn = true;
    },
    opt_out_capturing() {
      calls.push(["opt_out_capturing"]);
    },
    clear_opt_in_out_capturing() {
      calls.push(["clear_opt_in_out_capturing"]);
    },
    set_config(cfg) {
      calls.push(["set_config", cfg]);
      Object.assign(this.config, cfg);
    },
    capture(name) {
      calls.push(["capture", name, optedIn ? "consented" : "cookieless"]);
    },
    debug() {},
  };

  globalThis.window = {};
  globalThis.document = {
    addEventListener: () => {},
    removeEventListener: () => {},
  };

  try {
    const mini = createMiniReact();
    const mod = load(
      compile("components/analytics/PostHogProvider.tsx"),
      (name) => {
        if (name === "react") return mini.hooks;
        if (name === "react/jsx-runtime") {
          return {
            jsx: (type, props) => {
              if (type?.name === "UseCaseAnalytics") useCaseReady = props.ready;
              return { type, props };
            },
            jsxs: (type, props) => ({ type, props }),
          };
        }
        if (name === "next/navigation") {
          return { usePathname: () => "/" };
        }
        if (name === "posthog-js") return fakePosthog;
        if (name === "posthog-js/react") {
          return { PostHogProvider: () => null };
        }
        if (name === "@/components/analytics/common-room") {
          return { crPageView: () => {} };
        }
        if (name === "@/components/analytics/UseCaseAnalytics") {
          return {
            UseCaseAnalytics: function UseCaseAnalytics() {
              return null;
            },
          };
        }
        if (name === "@/lib/cookie-consent") {
          return { readAnalyticsConsent: () => "granted" };
        }
        throw Error(name);
      },
    );

    mini.render(() => mod.PostHogProvider({ children: null }));
    mini.render(() => mod.PostHogProvider({ children: null }));

    assert.equal(fakePosthog.config.persistence, "cookie");
    assert.deepEqual(calls, [
      [
        "set_config",
        {
          disable_session_recording: false,
          autocapture: true,
          disable_surveys: false,
        },
      ],
      ["capture", "$pageview", "consented"],
    ]);
    assert.equal("capture_heatmaps" in fakePosthog.config, false);
    assert.equal("capture_dead_clicks" in fakePosthog.config, false);
    assert.equal("capture_exceptions" in fakePosthog.config, false);
    assert.equal(useCaseReady, true);
  } finally {
    if (prevKey === undefined) delete process.env.NEXT_PUBLIC_POSTHOG_KEY;
    else process.env.NEXT_PUBLIC_POSTHOG_KEY = prevKey;
    delete globalThis.window;
    delete globalThis.document;
  }
});

test("PostHogProvider expires a leftover ph_*_posthog cookie when starting in memory mode without consent", () => {
  const prevKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  process.env.NEXT_PUBLIC_POSTHOG_KEY = "phc_test_key";
  const cookieWrites = [];

  try {
    let cookieValue =
      "ph_phc_test_key_posthog=%7B%22distinct_id%22%3A%22old%22%7D";
    globalThis.window = {
      location: { hostname: "docs.langfuse.com", protocol: "https:" },
    };
    globalThis.document = {
      get cookie() {
        return cookieValue;
      },
      set cookie(v) {
        cookieWrites.push(v);
      },
      addEventListener: () => {},
      removeEventListener: () => {},
    };
    globalThis.sessionStorage = { removeItem: () => {} };

    const mini = createMiniReact();
    const fakePosthog = {
      config: null,
      init: (_key, options) => {
        fakePosthog.config = { ...options };
        options.loaded(fakePosthog);
      },
      has_opted_in_capturing: () => false,
      get_explicit_consent_status: () => "pending",
      opt_in_capturing: () => {},
      opt_out_capturing: () => {},
      clear_opt_in_out_capturing: () => {},
      set_config: () => {},
      capture: () => {},
      debug: () => {},
    };

    const mod = load(
      compile("components/analytics/PostHogProvider.tsx"),
      (name) => {
        if (name === "react") return mini.hooks;
        if (name === "react/jsx-runtime")
          return {
            jsx: (type, props) => ({ type, props }),
            jsxs: (type, props) => ({ type, props }),
          };
        if (name === "next/navigation") return { usePathname: () => "/docs" };
        if (name === "posthog-js")
          return { __esModule: true, default: fakePosthog };
        if (name === "posthog-js/react")
          return { PostHogProvider: ({ children }) => children };
        if (name === "@/components/analytics/common-room")
          return { crPageView: () => {} };
        if (name === "@/components/analytics/UseCaseAnalytics")
          return { UseCaseAnalytics: () => null };
        if (name === "@/lib/cookie-consent")
          return { readAnalyticsConsent: () => "denied" };
        throw Error(name);
      },
    );

    mini.render(() => mod.PostHogProvider({ children: null }));
    assert.equal(fakePosthog.config.persistence, "memory");
    assert.deepEqual(cookieWrites, [
      "ph_phc_test_key_posthog=; Max-Age=0; Path=/; SameSite=Lax; Secure",
      "ph_phc_test_key_posthog=; Max-Age=0; Path=/; Domain=.docs.langfuse.com; SameSite=Lax; Secure",
      "ph_phc_test_key_posthog=; Max-Age=0; Path=/; Domain=.langfuse.com; SameSite=Lax; Secure",
    ]);

    // When no ph_*_posthog cookie exists, zero cookie writes occur
    cookieWrites.length = 0;
    cookieValue = "cookieyes-consent=action:no,analytics:no";
    const miniClean = createMiniReact();
    const modClean = load(
      compile("components/analytics/PostHogProvider.tsx"),
      (name) => {
        if (name === "react") return miniClean.hooks;
        if (name === "react/jsx-runtime")
          return {
            jsx: (type, props) => ({ type, props }),
            jsxs: (type, props) => ({ type, props }),
          };
        if (name === "next/navigation") return { usePathname: () => "/docs" };
        if (name === "posthog-js")
          return { __esModule: true, default: fakePosthog };
        if (name === "posthog-js/react")
          return { PostHogProvider: ({ children }) => children };
        if (name === "@/components/analytics/common-room")
          return { crPageView: () => {} };
        if (name === "@/components/analytics/UseCaseAnalytics")
          return { UseCaseAnalytics: () => null };
        if (name === "@/lib/cookie-consent")
          return { readAnalyticsConsent: () => "unknown" };
        throw Error(name);
      },
    );
    miniClean.render(() => modClean.PostHogProvider({ children: null }));
    assert.deepEqual(cookieWrites, []);
  } finally {
    delete globalThis.window;
    delete globalThis.document;
    delete globalThis.sessionStorage;
    if (prevKey === undefined) delete process.env.NEXT_PUBLIC_POSTHOG_KEY;
    else process.env.NEXT_PUBLIC_POSTHOG_KEY = prevKey;
  }
});

test("crPageView only reports SPA pageviews while analytics consent is granted", () => {
  let consentState = "granted";
  let pageCalls = 0;

  globalThis.window = {
    signals: {
      page: () => {
        pageCalls += 1;
      },
    },
  };

  try {
    const mod = load(
      compile("components/analytics/common-room.tsx"),
      (name) => {
        if (name === "next/script") return { default: "Script" };
        if (name === "react/jsx-runtime") {
          return { jsx: (type, props) => ({ type, props }) };
        }
        if (name === "@/lib/cookie-consent") {
          return { readAnalyticsConsent: () => consentState };
        }
        throw Error(name);
      },
    );

    mod.crPageView();
    assert.equal(pageCalls, 1);

    consentState = "denied";
    mod.crPageView();
    assert.equal(pageCalls, 1);

    consentState = "unknown";
    mod.crPageView();
    assert.equal(pageCalls, 1);
  } finally {
    delete globalThis.window;
  }
});

test("ClickIdPersistence removes _gcl_ls and li_adsId on denied and leaves storage untouched on unknown", () => {
  let consentState = "unknown";
  const listeners = {};
  const cookiesWritten = [];
  const localStore = new Map([
    ["_gcl_ls", "google-click"],
    ["li_adsId", "linkedin-id"],
    ["unrelated", "keep"],
  ]);

  globalThis.window = {
    location: {
      hostname: "langfuse.com",
      protocol: "https:",
      search: "?gclid=abc123",
    },
  };
  globalThis.document = {
    addEventListener: (type, fn) => {
      listeners[type] = fn;
    },
    removeEventListener: () => {},
    set cookie(v) {
      cookiesWritten.push(v);
    },
  };
  globalThis.localStorage = {
    removeItem: (k) => localStore.delete(k),
  };

  try {
    const mod = load(
      compile("components/analytics/ClickIdPersistence.tsx"),
      (name) => {
        if (name === "react") return { useEffect: (fn) => fn() };
        if (name === "@/lib/cookie-consent") {
          return { readAdvertisementConsent: () => consentState };
        }
        throw Error(name);
      },
    );

    mod.ClickIdPersistence();
    assert.equal(cookiesWritten.length, 0);
    assert.equal(localStore.has("_gcl_ls"), true);
    assert.equal(localStore.has("li_adsId"), true);

    consentState = "denied";
    listeners.cookieyes_consent_update();
    assert.equal(localStore.has("_gcl_ls"), false);
    assert.equal(localStore.has("li_adsId"), false);
    assert.equal(localStore.get("unrelated"), "keep");
    assert.ok(cookiesWritten.some((c) => c.startsWith("lf_gclid=;")));

    // Storage errors are swallowed
    globalThis.localStorage = {
      removeItem() {
        throw Error("blocked");
      },
    };
    assert.doesNotThrow(() => listeners.cookieyes_consent_update());
  } finally {
    delete globalThis.window;
    delete globalThis.document;
    delete globalThis.localStorage;
  }
});

test("CookieSettingsButton invokes revisitCkyConsent or falls back to /cookie-policy", () => {
  const pushed = [];
  let revisitCalls = 0;

  const mod = load(
    compile("components/layout/CookieSettingsButton.tsx"),
    (name) => {
      if (name === "next/navigation") {
        return { useRouter: () => ({ push: (href) => pushed.push(href) }) };
      }
      if (name === "react/jsx-runtime") {
        return { jsx: (type, props) => ({ type, props }) };
      }
      if (name === "@/components/ui/text") return { Text: "span" };
      if (name === "@/lib/utils") {
        return { cn: (...parts) => parts.filter(Boolean).join(" ") };
      }
      throw Error(name);
    },
  );

  try {
    globalThis.window = {};
    const el = mod.CookieSettingsButton({});
    assert.equal(el.type, "button");
    assert.equal(el.props.type, "button");

    // CookieYes unavailable -> navigate to /cookie-policy
    el.props.onClick();
    assert.deepEqual(pushed, ["/cookie-policy"]);

    // CookieYes available -> call revisitCkyConsent
    globalThis.window.revisitCkyConsent = () => {
      revisitCalls += 1;
    };
    el.props.onClick();
    assert.equal(revisitCalls, 1);
    assert.deepEqual(pushed, ["/cookie-policy"]);
  } finally {
    delete globalThis.window;
  }
});

test("Inkeep settings disable Google Fonts, gate functional and analytical privacy preferences on consent, and InkeepSearchBar preserves base theme settings", () => {
  const prevKey = process.env.NEXT_PUBLIC_INKEEP_API_KEY;
  process.env.NEXT_PUBLIC_INKEEP_API_KEY = "inkeep_test_key";
  let analyticsState = "unknown";
  let functionalState = "unknown";
  const listeners = {};

  try {
    const mini = createMiniReact();
    const useInkeepSettings = load(
      compile("components/inkeep/useInkeepSettings.ts"),
      (name) => {
        if (name === "react") return mini.hooks;
        if (name === "next-themes")
          return { useTheme: () => ({ resolvedTheme: "light" }) };
        if (name === "posthog-js/react")
          return { usePostHog: () => ({ capture: () => {} }) };
        if (name === "@/lib/cookie-consent") {
          return {
            readAnalyticsConsent: () => analyticsState,
            readFunctionalConsent: () => functionalState,
          };
        }
        throw Error(name);
      },
    ).default;

    globalThis.document = {
      addEventListener: (type, fn) => {
        listeners[type] = fn;
      },
      removeEventListener: () => {},
    };

    const settings = mini.render(() => useInkeepSettings());
    assert.equal(settings.baseSettings.theme?.disableLoadingDefaultFont, true);
    assert.deepEqual(settings.baseSettings.privacyPreferences, {
      optOutFunctionalCookies: true,
      optOutAnalyticalCookies: true,
      optOutAllAnalytics: true,
    });
    assert.match(
      settings.baseSettings.theme?.fontFamily?.body ?? "",
      /var\(--font-inter\)/,
    );

    // Granting only functional enables functional cookies while keeping analytics opted out
    functionalState = "granted";
    listeners.cookieyes_consent_update();
    const functionalOnly = mini.render(() => useInkeepSettings());
    assert.deepEqual(functionalOnly.baseSettings.privacyPreferences, {
      optOutFunctionalCookies: false,
      optOutAnalyticalCookies: true,
      optOutAllAnalytics: true,
    });

    // Granting analytics as well enables analytical cookies and Inkeep analytics
    analyticsState = "granted";
    listeners.cookieyes_consent_update();
    const bothGranted = mini.render(() => useInkeepSettings());
    assert.deepEqual(bothGranted.baseSettings.privacyPreferences, {
      optOutFunctionalCookies: false,
      optOutAnalyticalCookies: false,
      optOutAllAnalytics: false,
    });

    let capturedSearchBarProps = null;
    const searchBarMod = load(
      compile("components/inkeep/InkeepSearchBar.tsx"),
      (name) => {
        if (name === "next/dynamic") {
          return () => (props) => {
            capturedSearchBarProps = props;
            return null;
          };
        }
        if (name === "react/jsx-runtime") {
          return {
            jsx: (type, props) => {
              if (typeof type === "function") type(props);
              return { type, props };
            },
          };
        }
        if (name === "./useInkeepSettings") {
          return {
            __esModule: true,
            default: () => mini.render(() => useInkeepSettings()),
          };
        }
        if (name === "@/components/ui/button") return { Button: () => null };
        if (name === "lucide-react") return { Search: () => null };
        throw Error(name);
      },
    );

    searchBarMod.default({});
    assert.equal(
      capturedSearchBarProps.baseSettings.theme.disableLoadingDefaultFont,
      true,
    );
    assert.match(
      capturedSearchBarProps.baseSettings.theme.fontFamily.body,
      /var\(--font-inter\)/,
    );
    assert.ok(Array.isArray(capturedSearchBarProps.baseSettings.theme.styles));
  } finally {
    delete globalThis.document;
    if (prevKey === undefined) delete process.env.NEXT_PUBLIC_INKEEP_API_KEY;
    else process.env.NEXT_PUBLIC_INKEEP_API_KEY = prevKey;
  }
});

test("Reo component loads static.reo.dev and initializes with the Langfuse client ID", () => {
  const inits = [];
  globalThis.window = {
    Reo: {
      init: (cfg) => inits.push(cfg),
    },
  };

  try {
    const mod = load(compile("components/analytics/reo.tsx"), (name) => {
      if (name === "next/script") return { default: "Script" };
      if (name === "react/jsx-runtime") {
        return { jsx: (type, props) => ({ type, props }) };
      }
      throw Error(name);
    });

    const el = mod.Reo();
    assert.equal(el.props.id, "reo");
    assert.equal(el.props.src, "https://static.reo.dev/myreo786/reo.js");
    assert.equal(el.props.strategy, "afterInteractive");
    el.props.onLoad();
    assert.deepEqual(inits, [{ clientID: "38b2e79cdb32fa7" }]);
  } finally {
    delete globalThis.window;
  }
});
