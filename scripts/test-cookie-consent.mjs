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

test("readAnalyticsConsent handles returning visitors, live API revokes, and unknown states", () => {
  try {
    globalThis.window = {};
    globalThis.document = { cookie: "" };
    assert.equal(cookieConsent.readAnalyticsConsent(), "unknown");

    // Pre-answer cookie written by CookieYes before the visitor chooses
    globalThis.document.cookie =
      "cookieyes-consent=consentid:abc,consent:no,action:no,necessary:yes,analytics:no,advertisement:no";
    assert.equal(cookieConsent.readAnalyticsConsent(), "unknown");

    // Returning visitor who accepted earlier, before CookieYes script loads
    globalThis.document.cookie =
      "cookieyes-consent=consentid:abc,consent:yes,action:yes,necessary:yes,analytics:yes,advertisement:yes";
    assert.equal(cookieConsent.readAnalyticsConsent(), "granted");

    // Live API revocation wins over stale cookie
    globalThis.window.getCkyConsent = () => ({
      activeLaw: "gdpr",
      categories: { analytics: false, advertisement: false },
      isUserActionCompleted: true,
    });
    assert.equal(cookieConsent.readAnalyticsConsent(), "denied");

    // Live API before user action in opt-in region still reads "unknown" if cookie has no prior grant
    globalThis.document.cookie =
      "cookieyes-consent=consentid:abc,consent:no,action:no,necessary:yes,analytics:no";
    globalThis.window.getCkyConsent = () => ({
      activeLaw: "gdpr",
      categories: { analytics: false },
      isUserActionCompleted: false,
    });
    assert.equal(cookieConsent.readAnalyticsConsent(), "unknown");
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

test("PostHogProvider starts cookieless with pageviews only and transitions cleanly on grant and revoke", () => {
  const prevKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  process.env.NEXT_PUBLIC_POSTHOG_KEY = "phc_test_key";

  let consentState = "unknown";
  let optedIn = false;
  let explicitStatus = "pending";
  let initArgs = null;
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
      calls.push(["capture", name]);
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
    const mod = load(
      compile("components/analytics/PostHogProvider.tsx"),
      (name) => {
        if (name === "react") {
          return {
            useState: (v) => [v, () => {}],
            useRef: (v) => ({ current: v }),
            useEffect: (fn) => fn(),
          };
        }
        if (name === "react/jsx-runtime") {
          return {
            jsx: (type, props) => ({ type, props }),
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
          return { UseCaseAnalytics: () => null };
        }
        if (name === "@/lib/cookie-consent") {
          return { readAnalyticsConsent: () => consentState };
        }
        throw Error(name);
      },
    );

    mod.PostHogProvider({ children: null });

    assert.equal(initArgs.key, "phc_test_key");
    assert.equal(initArgs.options.cookieless_mode, "on_reject");
    assert.equal(initArgs.options.opt_out_capturing_by_default, true);
    assert.equal(initArgs.options.opt_out_persistence_by_default, true);
    assert.equal(initArgs.options.persistence, "cookie");
    assert.equal(initArgs.options.cross_subdomain_cookie, true);
    assert.equal(initArgs.options.disable_session_recording, true);
    assert.equal(initArgs.options.autocapture, false);
    assert.equal(initArgs.options.capture_heatmaps, false);
    assert.equal(initArgs.options.capture_dead_clicks, false);
    assert.equal(initArgs.options.capture_exceptions, false);
    assert.equal(initArgs.options.disable_surveys, true);

    // No opt_out_capturing() call on unknown/pending so __ph_opt_in_out_* is not written
    assert.deepEqual(calls, []);
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

    // Granting analytics consent opts in and enables extensions
    consentState = "granted";
    listeners.cookieyes_consent_update();
    assert.deepEqual(calls, [
      ["opt_in_capturing", { captureEventName: false }],
      [
        "set_config",
        {
          disable_session_recording: false,
          autocapture: true,
          capture_heatmaps: true,
          capture_dead_clicks: true,
          capture_exceptions: true,
          disable_surveys: false,
        },
      ],
    ]);
    assert.deepEqual(beforeSend({ event: "use_case:page_viewed" }), {
      event: "use_case:page_viewed",
    });
    assert.deepEqual(beforeSend({ event: "inkeep:user_message_submitted" }), {
      event: "inkeep:user_message_submitted",
    });

    // Revoking disables extensions, opts out, clears opt-in/out storage, and removes sessionStorage keys
    calls.length = 0;
    sessionStore.set("ph_phc_test_key_window_id", "win-2");
    sessionStore.set("ph_phc_test_key_primary_window_exists", "true");
    consentState = "denied";
    listeners.cookieyes_consent_update();
    assert.deepEqual(calls, [
      [
        "set_config",
        {
          disable_session_recording: true,
          autocapture: false,
          capture_heatmaps: false,
          capture_dead_clicks: false,
          capture_exceptions: false,
          disable_surveys: true,
        },
      ],
      ["opt_out_capturing"],
      ["clear_opt_in_out_capturing"],
    ]);
    assert.equal(sessionStore.size, 0);
  } finally {
    if (prevKey === undefined) delete process.env.NEXT_PUBLIC_POSTHOG_KEY;
    else process.env.NEXT_PUBLIC_POSTHOG_KEY = prevKey;
    delete globalThis.window;
    delete globalThis.document;
    delete globalThis.sessionStorage;
  }
});

test("PostHogProvider enables full tracking immediately on first load for a returning consented visitor", () => {
  const prevKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  process.env.NEXT_PUBLIC_POSTHOG_KEY = "phc_test_key";

  let optedIn = true;
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
      calls.push(["capture", name]);
    },
    debug() {},
  };

  globalThis.window = {};
  globalThis.document = {
    addEventListener: () => {},
    removeEventListener: () => {},
  };

  try {
    const mod = load(
      compile("components/analytics/PostHogProvider.tsx"),
      (name) => {
        if (name === "react") {
          return {
            useState: (v) => [v, () => {}],
            useRef: (v) => ({ current: v }),
            useEffect: (fn) => fn(),
          };
        }
        if (name === "react/jsx-runtime") {
          return {
            jsx: (type, props) => ({ type, props }),
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
          return { UseCaseAnalytics: () => null };
        }
        if (name === "@/lib/cookie-consent") {
          return { readAnalyticsConsent: () => "granted" };
        }
        throw Error(name);
      },
    );

    mod.PostHogProvider({ children: null });

    assert.deepEqual(calls, [
      [
        "set_config",
        {
          disable_session_recording: false,
          autocapture: true,
          capture_heatmaps: true,
          capture_dead_clicks: true,
          capture_exceptions: true,
          disable_surveys: false,
        },
      ],
    ]);
  } finally {
    if (prevKey === undefined) delete process.env.NEXT_PUBLIC_POSTHOG_KEY;
    else process.env.NEXT_PUBLIC_POSTHOG_KEY = prevKey;
    delete globalThis.window;
    delete globalThis.document;
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

test("Inkeep settings disable Google Fonts, opt out of analytical cookies before consent, and InkeepSearchBar preserves base theme settings", () => {
  const prevKey = process.env.NEXT_PUBLIC_INKEEP_API_KEY;
  process.env.NEXT_PUBLIC_INKEEP_API_KEY = "inkeep_test_key";
  let consentState = "unknown";
  let currentAnalyticsGranted = false;
  let rerender = 0;

  try {
    const useInkeepSettings = load(
      compile("components/inkeep/useInkeepSettings.ts"),
      (name) => {
        if (name === "react") {
          return {
            useState: (init) => {
              if (rerender === 0) {
                currentAnalyticsGranted =
                  typeof init === "function" ? init() : init;
              }
              return [
                currentAnalyticsGranted,
                (v) => {
                  currentAnalyticsGranted = v;
                },
              ];
            },
            useEffect: (fn) => fn(),
          };
        }
        if (name === "next-themes")
          return { useTheme: () => ({ resolvedTheme: "light" }) };
        if (name === "posthog-js/react")
          return { usePostHog: () => ({ capture: () => {} }) };
        if (name === "@/lib/cookie-consent") {
          return { readAnalyticsConsent: () => consentState };
        }
        throw Error(name);
      },
    ).default;

    globalThis.document = {
      addEventListener: () => {},
      removeEventListener: () => {},
    };

    const settings = useInkeepSettings();
    rerender += 1;
    assert.equal(settings.baseSettings.theme?.disableLoadingDefaultFont, true);
    assert.equal(
      settings.baseSettings.privacyPreferences?.optOutAnalyticalCookies,
      true,
    );
    assert.match(
      settings.baseSettings.theme?.fontFamily?.body ?? "",
      /var\(--font-inter\)/,
    );

    consentState = "granted";
    useInkeepSettings();
    const grantedSettings = useInkeepSettings();
    assert.equal(
      grantedSettings.baseSettings.privacyPreferences?.optOutAnalyticalCookies,
      false,
    );

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
          return { __esModule: true, default: useInkeepSettings };
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
