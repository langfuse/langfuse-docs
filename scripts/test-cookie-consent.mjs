import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
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
      effects[i] = { fn, deps, changed, cleanup: prev?.cleanup };
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
        if (typeof eff.cleanup === "function") eff.cleanup();
        eff.cleanup = eff.fn();
      }
    }
    return out;
  }

  function unmount() {
    for (const eff of effects) {
      if (typeof eff.cleanup === "function") {
        eff.cleanup();
        eff.cleanup = undefined;
      }
    }
  }

  return { hooks, render, unmount };
}

function createPostHogHarness(
  t,
  {
    initialConsent = "unknown",
    initialPath = "/docs",
    initialHref = "https://langfuse.com/docs",
    initialHost = "langfuse.com",
    initialReferrer = "https://google.com/",
    initialTitle = "Docs - Langfuse",
    now = new Date("2026-11-26T12:00:00.000Z"),
  } = {},
) {
  t.mock.timers.enable({ apis: ["setTimeout", "Date"], now });

  const prevKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  process.env.NEXT_PUBLIC_POSTHOG_KEY = "phc_test_key";

  let consentState = initialConsent;
  let currentPath = initialPath;
  let explicitStatus = initialConsent === "granted" ? "granted" : "pending";
  let initArgs = null;
  let useCaseReady = null;
  let visibilityState = "visible";
  const calls = [];
  const pageviews = [];
  const docListeners = new Map();
  const winListeners = new Map();
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
    has_opted_in_capturing() {
      return (
        this.config.cookieless_mode !== "always" && explicitStatus === "granted"
      );
    },
    get_explicit_consent_status: () => explicitStatus,
    opt_in_capturing(opts) {
      if (this.config.cookieless_mode === "always") {
        throw new Error(
          "opt_in_capturing() must not be called while cookieless_mode is always",
        );
      }
      calls.push(["opt_in_capturing", opts]);
      explicitStatus = "granted";
    },
    opt_out_capturing() {
      calls.push(["opt_out_capturing"]);
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
    capture(name, properties, options) {
      const cookieless =
        this.config.cookieless_mode === "always" ||
        explicitStatus !== "granted";
      // Mirror posthog-js calculateEventProperties overwriting `title` with
      // `document.title` on `$pageview`, followed by `before_send`.
      const computedProps = properties ? { ...properties } : {};
      if (name === "$pageview") {
        computedProps.title = globalThis.document.title;
      }
      const eventPayload = { event: name, properties: computedProps };
      const finalEvent = this.config.before_send
        ? this.config.before_send(eventPayload)
        : eventPayload;
      if (!finalEvent) return;
      const finalProps = finalEvent.properties;
      const record = {
        event: name,
        cookieless,
        properties: properties ? { ...finalProps } : undefined,
        options: options ? { ...options } : undefined,
        capturedAt: new Date(),
        url: finalProps.$current_url ?? globalThis.window.location.href,
        pathname: finalProps.$pathname ?? globalThis.window.location.pathname,
        title: finalProps.title,
        timestamp: options?.timestamp ?? new Date(),
      };
      calls.push(["capture", name, cookieless ? "cookieless" : "consented"]);
      if (name === "$pageview") pageviews.push(record);
    },
    debug() {},
  };

  globalThis.window = {
    location: {
      href: initialHref,
      pathname: initialPath,
      host: initialHost,
      hostname: initialHost,
      protocol: "https:",
    },
    addEventListener(type, fn) {
      if (!winListeners.has(type)) winListeners.set(type, new Set());
      winListeners.get(type).add(fn);
    },
    removeEventListener(type, fn) {
      winListeners.get(type)?.delete(fn);
    },
  };
  globalThis.document = {
    cookie: "",
    referrer: initialReferrer,
    title: initialTitle,
    get visibilityState() {
      return visibilityState;
    },
    addEventListener(type, fn) {
      if (!docListeners.has(type)) docListeners.set(type, new Set());
      docListeners.get(type).add(fn);
    },
    removeEventListener(type, fn) {
      docListeners.get(type)?.delete(fn);
    },
  };
  globalThis.sessionStorage = {
    removeItem: (k) => sessionStore.delete(k),
  };

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
        return { usePathname: () => currentPath };
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

  function render() {
    mini.render(() => mod.PostHogProvider({ children: null }));
  }

  function mount() {
    render();
    render();
  }

  function setConsent(next) {
    consentState = next;
  }

  function dispatchDoc(type) {
    for (const fn of [...(docListeners.get(type) ?? [])]) fn();
    render();
  }

  function dispatchWin(type) {
    for (const fn of [...(winListeners.get(type) ?? [])]) fn();
    render();
  }

  function navigate({ path, href, host, referrer, title }) {
    currentPath = path;
    globalThis.window.location.pathname = path;
    globalThis.window.location.href = href ?? `https://langfuse.com${path}`;
    if (host !== undefined) globalThis.window.location.host = host;
    if (referrer !== undefined) globalThis.document.referrer = referrer;
    if (title !== undefined) globalThis.document.title = title;
    render();
  }

  function setVisibility(state) {
    visibilityState = state;
    dispatchDoc("visibilitychange");
  }

  function cleanup() {
    mini.unmount();
    t.mock.timers.reset();
    if (prevKey === undefined) delete process.env.NEXT_PUBLIC_POSTHOG_KEY;
    else process.env.NEXT_PUBLIC_POSTHOG_KEY = prevKey;
    delete globalThis.window;
    delete globalThis.document;
    delete globalThis.sessionStorage;
  }

  return {
    mod,
    fakePosthog,
    calls,
    pageviews,
    sessionStore,
    docListeners,
    winListeners,
    get initArgs() {
      return initArgs;
    },
    get useCaseReady() {
      return useCaseReady;
    },
    get explicitStatus() {
      return explicitStatus;
    },
    mount,
    render,
    setConsent,
    dispatchDoc,
    dispatchWin,
    navigate,
    setVisibility,
    cleanup,
  };
}

test("PostHogProvider: accept within 10s sends one identified $pageview with original timestamp and URL", (t) => {
  const loadTime = new Date("2026-11-26T12:00:00.000Z");
  const h = createPostHogHarness(t, {
    initialConsent: "unknown",
    initialPath: "/pricing",
    initialHref: "https://langfuse.com/pricing?utm=abc",
    initialHost: "langfuse.com",
    initialReferrer: "https://google.com/",
    initialTitle: "Pricing - Langfuse",
    now: loadTime,
  });

  try {
    h.mount();

    assert.equal(h.initArgs.key, "phc_test_key");
    assert.equal(h.initArgs.options.cookieless_mode, "always");
    assert.equal(h.initArgs.options.opt_out_capturing_by_default, true);
    assert.equal(h.initArgs.options.opt_out_persistence_by_default, true);
    assert.equal(h.initArgs.options.persistence, "memory");
    assert.equal(h.initArgs.options.cross_subdomain_cookie, true);
    assert.equal(h.initArgs.options.disable_session_recording, true);
    assert.equal(h.initArgs.options.autocapture, false);
    assert.equal(h.initArgs.options.capture_heatmaps, false);
    assert.equal(h.initArgs.options.capture_dead_clicks, false);
    assert.equal(h.initArgs.options.capture_exceptions, false);
    assert.equal(h.initArgs.options.disable_surveys, true);

    // Nothing sent while waiting; banner load with unknown keeps holding
    assert.equal(h.pageviews.length, 0);
    assert.equal(h.useCaseReady, false);
    assert.equal(h.sessionStore.size, 0);
    h.dispatchDoc("cookieyes_banner_load");
    assert.equal(h.pageviews.length, 0);

    // before_send drops non-pageview events while not granted
    const beforeSend = h.initArgs.options.before_send;
    for (const state of ["unknown", "denied"]) {
      h.setConsent(state);
      assert.deepEqual(beforeSend({ event: "$pageview" }), {
        event: "$pageview",
      });
      assert.equal(beforeSend({ event: "use_case:page_viewed" }), null);
      assert.equal(
        beforeSend({ event: "inkeep:user_message_submitted" }),
        null,
      );
      assert.equal(beforeSend({ event: "$autocapture" }), null);
    }

    // Accept at t=3s
    t.mock.timers.tick(3_000);
    h.setConsent("granted");
    h.dispatchDoc("cookieyes_consent_update");

    assert.equal(h.explicitStatus, "granted");
    assert.equal(h.fakePosthog.config.cookieless_mode, "on_reject");
    assert.equal(h.fakePosthog.config.persistence, "cookie");
    assert.equal("capture_heatmaps" in h.fakePosthog.config, false);
    assert.equal("capture_dead_clicks" in h.fakePosthog.config, false);
    assert.equal("capture_exceptions" in h.fakePosthog.config, false);
    assert.equal(h.useCaseReady, true);

    assert.equal(h.pageviews.length, 1);
    assert.equal(h.pageviews[0].cookieless, false);
    assert.deepEqual(h.pageviews[0].properties, {
      $current_url: "https://langfuse.com/pricing?utm=abc",
      $pathname: "/pricing",
      $host: "langfuse.com",
      $referrer: "https://google.com/",
      title: "Pricing - Langfuse",
    });
    assert.equal(
      h.pageviews[0].options.timestamp.getTime(),
      loadTime.getTime(),
    );

    // Timer and exit listeners were cleared; ticking past 10s sends nothing more
    assert.equal(h.docListeners.get("visibilitychange")?.size ?? 0, 0);
    assert.equal(h.winListeners.get("pagehide")?.size ?? 0, 0);
    t.mock.timers.tick(15_000);
    assert.equal(h.pageviews.length, 1);

    // before_send allows all events once granted
    assert.deepEqual(beforeSend({ event: "use_case:page_viewed" }), {
      event: "use_case:page_viewed",
    });
  } finally {
    h.cleanup();
  }
});

test("PostHogProvider: reject within 10s sends one cookieless $pageview with no opt-out flag", (t) => {
  const loadTime = new Date("2026-11-26T12:00:00.000Z");
  const h = createPostHogHarness(t, {
    initialConsent: "unknown",
    initialPath: "/docs",
    initialHref: "https://langfuse.com/docs",
    now: loadTime,
  });

  try {
    h.mount();
    assert.equal(h.pageviews.length, 0);

    t.mock.timers.tick(2_000);
    h.setConsent("denied");
    h.dispatchDoc("cookieyes_consent_update");

    assert.equal(h.explicitStatus, "pending");
    assert.equal(h.fakePosthog.config.cookieless_mode, "always");
    assert.equal(h.fakePosthog.config.persistence, "memory");
    assert.equal(h.pageviews.length, 1);
    assert.equal(h.pageviews[0].cookieless, true);
    assert.equal(h.pageviews[0].url, "https://langfuse.com/docs");
    assert.equal(
      h.pageviews[0].options.timestamp.getTime(),
      loadTime.getTime(),
    );

    // Timer cleared; no duplicate at 10s
    t.mock.timers.tick(10_000);
    assert.equal(h.pageviews.length, 1);
  } finally {
    h.cleanup();
  }
});

test("PostHogProvider: no answer and CookieYes blocked flush one cookieless $pageview at 10s", (t) => {
  for (const bannerLoaded of [true, false]) {
    const loadTime = new Date("2026-11-26T12:00:00.000Z");
    const h = createPostHogHarness(t, {
      initialConsent: "unknown",
      initialPath: "/docs",
      initialHref: "https://langfuse.com/docs",
      now: loadTime,
    });

    try {
      h.mount();
      if (bannerLoaded) h.dispatchDoc("cookieyes_banner_load");

      t.mock.timers.tick(9_999);
      assert.equal(h.pageviews.length, 0);

      t.mock.timers.tick(1);
      assert.equal(h.pageviews.length, 1);
      assert.equal(h.pageviews[0].cookieless, true);
      assert.equal(h.pageviews[0].url, "https://langfuse.com/docs");
      assert.equal(
        h.pageviews[0].options.timestamp.getTime(),
        loadTime.getTime(),
      );
      assert.equal(
        h.pageviews[0].capturedAt.getTime() - loadTime.getTime(),
        10_000,
      );
      assert.equal(h.docListeners.get("visibilitychange")?.size ?? 0, 0);
      assert.equal(h.winListeners.get("pagehide")?.size ?? 0, 0);
    } finally {
      h.cleanup();
    }
  }
});

test("PostHogProvider: page hidden or pagehide before 10s flushes cookieless via sendBeacon", (t) => {
  for (const trigger of ["visibilitychange", "pagehide"]) {
    const loadTime = new Date("2026-11-26T12:00:00.000Z");
    const h = createPostHogHarness(t, {
      initialConsent: "unknown",
      initialPath: "/docs",
      initialHref: "https://langfuse.com/docs",
      now: loadTime,
    });

    try {
      h.mount();
      t.mock.timers.tick(2_500);
      assert.equal(h.pageviews.length, 0);

      if (trigger === "visibilitychange") {
        // Staying visible must not flush
        h.setVisibility("visible");
        assert.equal(h.pageviews.length, 0);
        h.setVisibility("hidden");
      } else {
        h.dispatchWin("pagehide");
      }

      assert.equal(h.pageviews.length, 1);
      assert.equal(h.pageviews[0].cookieless, true);
      assert.equal(h.pageviews[0].url, "https://langfuse.com/docs");
      assert.equal(
        h.pageviews[0].options.timestamp.getTime(),
        loadTime.getTime(),
      );
      assert.equal(h.pageviews[0].options.transport, "sendBeacon");
      assert.equal(h.pageviews[0].options.send_instantly, true);

      // Exit listeners and timer cleared; neither subsequent pagehide nor 10s tick re-sends
      assert.equal(h.docListeners.get("visibilitychange")?.size ?? 0, 0);
      assert.equal(h.winListeners.get("pagehide")?.size ?? 0, 0);
      h.dispatchWin("pagehide");
      t.mock.timers.tick(10_000);
      assert.equal(h.pageviews.length, 1);
    } finally {
      h.cleanup();
    }
  }
});

test("PostHogProvider: client-side navigation during wait then accept sends both identified pageviews in order", (t) => {
  const t0 = new Date("2026-11-26T12:00:00.000Z");
  const h = createPostHogHarness(t, {
    initialConsent: "unknown",
    initialPath: "/docs",
    initialHref: "https://langfuse.com/docs",
    initialTitle: "Docs",
    now: t0,
  });

  try {
    h.mount();
    assert.equal(h.pageviews.length, 0);

    t.mock.timers.tick(3_000);
    const t1 = new Date(t0.getTime() + 3_000);
    h.navigate({
      path: "/pricing",
      href: "https://langfuse.com/pricing",
      title: "Pricing",
    });
    assert.equal(h.pageviews.length, 0);

    t.mock.timers.tick(2_000);
    h.setConsent("granted");
    h.dispatchDoc("cookieyes_consent_update");

    assert.equal(h.pageviews.length, 2);
    assert.equal(h.pageviews[0].cookieless, false);
    assert.equal(h.pageviews[0].url, "https://langfuse.com/docs");
    assert.equal(h.pageviews[0].pathname, "/docs");
    assert.equal(h.pageviews[0].properties.title, "Docs");
    assert.equal(h.pageviews[0].options.timestamp.getTime(), t0.getTime());

    assert.equal(h.pageviews[1].cookieless, false);
    assert.equal(h.pageviews[1].url, "https://langfuse.com/pricing");
    assert.equal(h.pageviews[1].pathname, "/pricing");
    assert.equal(h.pageviews[1].properties.title, "Pricing");
    assert.equal(h.pageviews[1].options.timestamp.getTime(), t1.getTime());
  } finally {
    h.cleanup();
  }
});

test("PostHogProvider: accept after timeout does not resend current page; next navigation is identified", (t) => {
  const t0 = new Date("2026-11-26T12:00:00.000Z");
  const h = createPostHogHarness(t, {
    initialConsent: "unknown",
    initialPath: "/docs",
    initialHref: "https://langfuse.com/docs",
    now: t0,
  });

  try {
    h.mount();
    t.mock.timers.tick(10_000);
    assert.equal(h.pageviews.length, 1);
    assert.equal(h.pageviews[0].cookieless, true);
    assert.equal(h.pageviews[0].url, "https://langfuse.com/docs");

    // Accept at t=12s: no second pageview for /docs
    t.mock.timers.tick(2_000);
    h.setConsent("granted");
    h.dispatchDoc("cookieyes_consent_update");
    assert.equal(h.pageviews.length, 1);
    assert.equal(h.useCaseReady, true);

    // Next navigation sends an identified pageview immediately
    t.mock.timers.tick(1_000);
    h.navigate({ path: "/pricing", href: "https://langfuse.com/pricing" });
    assert.equal(h.pageviews.length, 2);
    assert.equal(h.pageviews[1].cookieless, false);
    assert.equal(h.pageviews[1].url, "https://langfuse.com/pricing");
  } finally {
    h.cleanup();
  }
});

test("PostHogProvider: returning visitor with stored consent sends identified pageview immediately, and revoke switches next nav to cookieless without resend", (t) => {
  const t0 = new Date("2026-11-26T12:00:00.000Z");
  const h = createPostHogHarness(t, {
    initialConsent: "granted",
    initialPath: "/docs",
    initialHref: "https://langfuse.com/docs",
    now: t0,
  });

  try {
    h.mount();

    assert.equal(h.fakePosthog.config.cookieless_mode, "on_reject");
    assert.equal(h.fakePosthog.config.persistence, "cookie");
    assert.equal("capture_heatmaps" in h.fakePosthog.config, false);
    assert.equal("capture_dead_clicks" in h.fakePosthog.config, false);
    assert.equal("capture_exceptions" in h.fakePosthog.config, false);
    assert.equal(h.useCaseReady, true);

    // Immediate identified pageview at t=0, no exit listeners or wait timer
    assert.equal(h.pageviews.length, 1);
    assert.equal(h.pageviews[0].cookieless, false);
    assert.equal(h.pageviews[0].capturedAt.getTime(), t0.getTime());
    assert.equal(h.docListeners.get("visibilitychange")?.size ?? 0, 0);
    assert.equal(h.winListeners.get("pagehide")?.size ?? 0, 0);

    // Revoke after granting: cleans up storage, no resend for /docs
    h.sessionStore.set("ph_phc_test_key_window_id", "win-2");
    h.sessionStore.set("ph_phc_test_key_primary_window_exists", "true");
    h.calls.length = 0;
    h.setConsent("denied");
    h.dispatchDoc("cookieyes_consent_update");

    assert.equal(h.explicitStatus, "pending");
    assert.equal(h.fakePosthog.config.cookieless_mode, "always");
    assert.equal(h.fakePosthog.config.persistence, "memory");
    assert.equal(h.useCaseReady, false);
    assert.equal(h.sessionStore.size, 0);
    assert.equal(h.pageviews.length, 1);
    assert.deepEqual(h.calls, [
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
          cookieless_mode: "always",
          persistence: "memory",
        },
      ],
    ]);

    // Next navigation is cookieless immediately
    h.navigate({ path: "/pricing", href: "https://langfuse.com/pricing" });
    assert.equal(h.pageviews.length, 2);
    assert.equal(h.pageviews[1].cookieless, true);
    assert.equal(h.pageviews[1].url, "https://langfuse.com/pricing");
  } finally {
    h.cleanup();
  }
});

test("PostHogProvider: returning visitor who rejected earlier sends cookieless pageview immediately with no delay or opt-out flag", (t) => {
  const t0 = new Date("2026-11-26T12:00:00.000Z");
  const h = createPostHogHarness(t, {
    initialConsent: "denied",
    initialPath: "/docs",
    initialHref: "https://langfuse.com/docs",
    now: t0,
  });

  try {
    h.mount();

    assert.equal(h.fakePosthog.config.cookieless_mode, "always");
    assert.equal(h.fakePosthog.config.persistence, "memory");
    assert.equal(h.explicitStatus, "pending");
    assert.equal(h.pageviews.length, 1);
    assert.equal(h.pageviews[0].cookieless, true);
    assert.equal(h.pageviews[0].capturedAt.getTime(), t0.getTime());
    assert.equal(h.docListeners.get("visibilitychange")?.size ?? 0, 0);
    assert.equal(h.winListeners.get("pagehide")?.size ?? 0, 0);
  } finally {
    h.cleanup();
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
      addEventListener: () => {},
      removeEventListener: () => {},
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
    miniClean.unmount();
    mini.unmount();
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

test("reportGoogleAdsConversion requires advertisement consent even when window.gtag is defined pre-consent", () => {
  let adConsent = "unknown";
  const gtagCalls = [];

  globalThis.window = {
    gtag: (...args) => gtagCalls.push(args),
  };

  try {
    const mod = load(compile("lib/google-ads.ts"), (name) => {
      if (name === "@/lib/cookie-consent") {
        return { readAdvertisementConsent: () => adConsent };
      }
      throw Error(name);
    });

    mod.reportGoogleAdsConversion(mod.GOOGLE_ADS_CONVERSIONS.launchApp, {
      value: 1,
      currency: "USD",
    });
    assert.deepEqual(gtagCalls, []);

    adConsent = "denied";
    mod.reportGoogleAdsConversion(mod.GOOGLE_ADS_CONVERSIONS.launchApp, {
      value: 1,
      currency: "USD",
    });
    assert.deepEqual(gtagCalls, []);

    adConsent = "granted";
    mod.reportGoogleAdsConversion(mod.GOOGLE_ADS_CONVERSIONS.launchApp, {
      value: 1,
      currency: "USD",
    });
    assert.deepEqual(gtagCalls, [
      [
        "event",
        "conversion",
        {
          send_to: "AW-10855791654/Lb8RCKvkmqkcEKb4uLgo",
          transport_type: "beacon",
          value: 1,
          currency: "USD",
        },
      ],
    ]);

    // Revoking advertisement consent suppresses subsequent conversions
    adConsent = "denied";
    mod.reportGoogleAdsConversion(
      mod.GOOGLE_ADS_CONVERSIONS.talkToUsFormSubmit,
    );
    assert.equal(gtagCalls.length, 1);
  } finally {
    delete globalThis.window;
  }
});

test("RootLayout renders Consent Mode defaults before CookieYes in <head> in production and removes GTM", () => {
  const layoutSource = readFileSync(
    new URL("../app/layout.tsx", import.meta.url),
    "utf8",
  );
  const pkgSource = readFileSync(
    new URL("../package.json", import.meta.url),
    "utf8",
  );
  assert.equal(layoutSource.includes("GTM-NGLK4TZX"), false);
  assert.equal(layoutSource.includes("googletagmanager.com/gtm.js"), false);
  assert.equal(layoutSource.includes("GoogleTagManager"), false);
  assert.equal(layoutSource.includes("@next/third-parties"), false);
  assert.equal(pkgSource.includes("@next/third-parties"), false);

  const prevNodeEnv = process.env.NODE_ENV;
  const noop = () => null;
  const loadLayout = () =>
    load(compile("app/layout.tsx"), (name) => {
      if (name === "react/jsx-runtime") {
        return {
          Fragment: Symbol.for("react.fragment"),
          jsx: (type, props) => ({ type, props }),
          jsxs: (type, props) => ({ type, props }),
        };
      }
      if (name === "next/font/local" || name === "next/font/google") {
        return {
          __esModule: true,
          default: () => ({ variable: "" }),
          Inter: () => ({ variable: "" }),
        };
      }
      if (name === "@/lib/og-url") {
        return {
          buildDefaultSiteOgImageUrl: () => "https://langfuse.com/og.png",
          SITE_DEFAULT_OG_DESCRIPTION: "Langfuse",
        };
      }
      if (name.endsWith(".css")) return {};
      return new Proxy({}, { get: () => noop });
    });

  const collectScripts = (node, out = []) => {
    if (!node || typeof node !== "object") return out;
    if (Array.isArray(node)) {
      for (const item of node) collectScripts(item, out);
      return out;
    }
    if (node.type === "script") out.push(node);
    if (node.props?.children) collectScripts(node.props.children, out);
    return out;
  };

  try {
    process.env.NODE_ENV = "production";
    const prodTree = loadLayout().default({ children: null });
    const headNode = prodTree.props.children.find((el) => el?.type === "head");
    assert.ok(headNode, "Expected <head> element in RootLayout");

    const headScripts = collectScripts(headNode);
    assert.equal(headScripts.length, 2);
    assert.equal(headScripts[0].props.id, "consent-defaults");
    assert.equal(headScripts[1].props.id, "cookieyes");
    assert.equal(
      headScripts[1].props.src,
      "https://cdn-cookieyes.com/client_data/40247147630c6589ad01a874/script.js",
    );
    assert.equal(headScripts[1].props.defer, undefined);
    assert.equal(headScripts[1].props.async, undefined);

    // Execute the inline consent-defaults script in an isolated browser-like global
    const sandbox = {};
    sandbox.window = sandbox;
    vm.runInNewContext(
      headScripts[0].props.dangerouslySetInnerHTML.__html,
      sandbox,
    );
    assert.equal(typeof sandbox.gtag, "function");
    const entries = JSON.parse(
      JSON.stringify(sandbox.dataLayer.map((args) => Array.from(args))),
    );
    assert.deepEqual(entries, [
      [
        "consent",
        "default",
        {
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
          analytics_storage: "denied",
          functionality_storage: "denied",
          personalization_storage: "denied",
          security_storage: "granted",
          wait_for_update: 2000,
        },
      ],
      ["set", "url_passthrough", true],
    ]);

    process.env.NODE_ENV = "development";
    const devTree = loadLayout().default({ children: null });
    const devHead = devTree.props.children.find((el) => el?.type === "head");
    assert.deepEqual(collectScripts(devHead), []);
  } finally {
    if (prevNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = prevNodeEnv;
  }
});
