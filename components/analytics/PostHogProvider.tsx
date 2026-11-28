"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { crPageView } from "@/components/analytics/common-room";
import { UseCaseAnalytics } from "@/components/analytics/UseCaseAnalytics";
import { readAnalyticsConsent } from "@/lib/cookie-consent";

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();
const posthogCookieName = posthogKey
  ? `ph_${posthogKey.replace(/\+/g, "PL").replace(/\//g, "SL").replace(/=/g, "EQ")}_posthog`
  : "";

const FULL_TRACKING_CONFIG = {
  disable_session_recording: false,
  autocapture: true,
  disable_surveys: false,
};

const COOKIELESS_ONLY_CONFIG = {
  disable_session_recording: true,
  autocapture: false,
  capture_heatmaps: false,
  capture_dead_clicks: false,
  capture_exceptions: false,
  disable_surveys: true,
};

// When PostHog starts in "memory" persistence (to avoid pre-consent
// `__ph_cookie_support_*` probe cookies), `opt_out_capturing()` only clears
// in-memory state. If a leftover `ph_<key>_posthog` cookie from a prior grant
// exists while analytics consent is not granted (e.g. after consent withdrawal
// or CookieYes consent renewal), expire it directly without writing any probe
// cookie on clean visits.
function clearStalePostHogCookie() {
  if (!posthogCookieName || typeof document === "undefined") return;
  const prefix = `${posthogCookieName}=`;
  const hasCookie = (document.cookie ?? "")
    .split(";")
    .some((entry) => entry.trim().startsWith(prefix));
  if (!hasCookie) return;

  const secure =
    typeof window !== "undefined" && window.location?.protocol === "https:"
      ? "; Secure"
      : "";
  document.cookie = `${posthogCookieName}=; Max-Age=0; Path=/; SameSite=Lax${secure}`;

  const hostname =
    typeof window !== "undefined" ? (window.location?.hostname ?? "") : "";
  if (
    !hostname ||
    hostname === "localhost" ||
    /^\d+(\.\d+){3}$/.test(hostname)
  ) {
    return;
  }
  const parts = hostname.split(".");
  for (let i = 0; i <= parts.length - 2; i++) {
    const domain = parts.slice(i).join(".");
    document.cookie = `${posthogCookieName}=; Max-Age=0; Path=/; Domain=.${domain}; SameSite=Lax${secure}`;
  }
}

function clearPostHogSessionStorage() {
  // posthog-js can keep the tab's window id in sessionStorage after opting out
  try {
    sessionStorage.removeItem(`ph_${posthogKey}_window_id`);
    sessionStorage.removeItem(`ph_${posthogKey}_primary_window_exists`);
  } catch {
    // storage unavailable: nothing was kept there either
  }
}

// PostHog runs in two states:
// - Not "granted" ("unknown" or "denied"): `cookieless_mode: "always"` with
//   "memory" persistence and `COOKIELESS_ONLY_CONFIG` (cookieless `$pageview`s
//   only via `before_send`; no cookies, localStorage, or sessionStorage).
// - "granted": switches to `cookieless_mode: "on_reject"`, "cookie"
//   persistence, and `FULL_TRACKING_CONFIG`, then opts in.
function applyAnalyticsConsent(): boolean {
  if (readAnalyticsConsent() === "granted") {
    if (
      posthog.config &&
      (posthog.config.cookieless_mode !== "on_reject" ||
        posthog.config.persistence !== "cookie" ||
        posthog.config.disable_session_recording)
    ) {
      // Restore remote-config defaults for extensions the SDK leaves undefined:
      // `posthog.set_config` ignores `undefined` values when merging, then
      // unconditionally re-runs `heatmaps.startIfEnabled()`,
      // `deadClicksAutocapture.startIfEnabledOrStop()`, and
      // `exceptionObserver.onConfigChange()` / `startIfEnabledOrStop()` against
      // `posthog.config`, which falls back to remote config when unset.
      delete posthog.config.capture_heatmaps;
      delete posthog.config.capture_dead_clicks;
      delete posthog.config.capture_exceptions;
      posthog.set_config({
        cookieless_mode: "on_reject",
        persistence: "cookie",
        ...FULL_TRACKING_CONFIG,
      });
    }
    if (!posthog.has_opted_in_capturing()) {
      posthog.opt_in_capturing({ captureEventName: false });
    }
    return true;
  }

  // Opt out while persistence is still "cookie" so posthog-js deletes
  // `ph_<key>_posthog`, then clear the opt-out flag so nothing stays in
  // localStorage, and switch back to `cookieless_mode: "always"` + "memory".
  if (posthog.has_opted_in_capturing()) {
    posthog.opt_out_capturing();
  }
  if (posthog.get_explicit_consent_status() !== "pending") {
    posthog.clear_opt_in_out_capturing();
  }
  if (
    posthog.config &&
    (posthog.config.cookieless_mode !== "always" ||
      posthog.config.persistence !== "memory" ||
      !posthog.config.disable_session_recording)
  ) {
    posthog.set_config({
      ...COOKIELESS_ONLY_CONFIG,
      cookieless_mode: "always",
      persistence: "memory",
      ...(posthog.config.debug ? { debug: false } : {}),
    });
  }
  clearStalePostHogCookie();
  clearPostHogSessionStorage();
  return false;
}

export const CONSENT_WAIT_MS = 10_000;

type QueuedPageView = {
  timestamp: Date;
  properties: {
    $current_url: string;
    $pathname: string;
    $host: string;
    $referrer: string;
    title: string;
  };
};

function createQueuedPageView(pathname: string): QueuedPageView {
  const loc = typeof window !== "undefined" ? window.location : undefined;
  const doc = typeof document !== "undefined" ? document : undefined;
  return {
    timestamp: new Date(),
    properties: {
      $current_url: loc?.href ?? pathname,
      $pathname: loc?.pathname ?? pathname,
      $host: loc?.host ?? "",
      $referrer: doc?.referrer || "$direct",
      title: doc?.title ?? "",
    },
  };
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isInitialPageView = useRef(true);
  const [ready, setReady] = useState(false);
  const [analyticsGranted, setAnalyticsGranted] = useState(false);
  const initializedRef = useRef(false);
  const lastCapturedPath = useRef<string | null>(null);
  const holdingRef = useRef(false);
  const queueRef = useRef<QueuedPageView[]>([]);
  const flushingTitleRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!posthogKey) {
      console.warn("PostHog key is not set. PostHog will be disabled.");
      return;
    }

    let waitTimer: ReturnType<typeof setTimeout> | null = null;
    let exitListenersAttached = false;

    const clearHoldHooks = () => {
      if (waitTimer !== null) {
        clearTimeout(waitTimer);
        waitTimer = null;
      }
      if (exitListenersAttached) {
        document.removeEventListener("visibilitychange", onVisibilityChange);
        window.removeEventListener("pagehide", onPageHide);
        exitListenersAttached = false;
      }
    };

    const flushQueue = (extraOptions?: {
      transport: "sendBeacon";
      send_instantly: true;
    }) => {
      holdingRef.current = false;
      clearHoldHooks();
      const queued = queueRef.current;
      if (queued.length === 0) return;
      queueRef.current = [];
      for (const entry of queued) {
        flushingTitleRef.current = entry.properties.title;
        try {
          posthog.capture("$pageview", entry.properties, {
            timestamp: entry.timestamp,
            ...extraOptions,
          });
        } finally {
          flushingTitleRef.current = null;
        }
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        flushQueue({ transport: "sendBeacon", send_instantly: true });
      }
    };

    const onPageHide = () => {
      flushQueue({ transport: "sendBeacon", send_instantly: true });
    };

    const startHolding = () => {
      holdingRef.current = true;
      clearHoldHooks();
      waitTimer = setTimeout(() => {
        waitTimer = null;
        flushQueue();
      }, CONSENT_WAIT_MS);
      document.addEventListener("visibilitychange", onVisibilityChange);
      window.addEventListener("pagehide", onPageHide);
      exitListenersAttached = true;
    };

    const onBannerLoad = () => {
      const granted = applyAnalyticsConsent();
      setAnalyticsGranted(granted);
      if (holdingRef.current && readAnalyticsConsent() !== "unknown") {
        flushQueue();
      }
    };

    const onConsentUpdate = () => {
      const granted = applyAnalyticsConsent();
      setAnalyticsGranted(granted);
      if (holdingRef.current) {
        flushQueue();
      }
    };

    if (initializedRef.current) {
      // Re-arm wait hooks after React StrictMode dev remount if still holding.
      const consent = readAnalyticsConsent();
      setAnalyticsGranted(applyAnalyticsConsent());
      if (holdingRef.current) {
        if (consent === "unknown") {
          startHolding();
        } else {
          flushQueue();
        }
      }
      setReady(true);
    } else {
      const initialGranted = readAnalyticsConsent() === "granted";

      posthog.init(posthogKey, {
        api_host:
          process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.posthog.com",
        ui_host: "https://eu.posthog.com",
        // Start in `cookieless_mode: "always"` with "memory" persistence when
        // analytics consent is not already granted so no cookies, localStorage,
        // or sessionStorage keys (including `__ph_cookie_support_*`) are written.
        // `opt_out_capturing_by_default: true` also ensures that switching to
        // `cookieless_mode: "on_reject"` before `opt_in_capturing()` keeps
        // posthog-js in cookieless/persistence-disabled state until opt-in runs
        // so SessionIdManager and SessionRecording are initialized on grant.
        cookieless_mode: initialGranted ? "on_reject" : "always",
        persistence: initialGranted ? "cookie" : "memory",
        cross_subdomain_cookie: true,
        // Route changes are captured below, including the initial page exactly once.
        capture_pageview: false,
        opt_out_capturing_by_default: true,
        opt_out_persistence_by_default: true,
        ...COOKIELESS_ONLY_CONFIG,
        before_send: (event) => {
          if (!event) return null;
          if (
            readAnalyticsConsent() !== "granted" &&
            event.event !== "$pageview"
          ) {
            return null;
          }
          // posthog-js overwrites `title` with `document.title` at send time
          // inside `calculateEventProperties`; restore the queued view's title.
          if (
            event.event === "$pageview" &&
            flushingTitleRef.current !== null &&
            event.properties
          ) {
            event.properties.title = flushingTitleRef.current;
          }
          return event;
        },
        loaded: (ph) => {
          initializedRef.current = true;
          const consent = readAnalyticsConsent();
          setAnalyticsGranted(applyAnalyticsConsent());
          if (consent === "unknown") {
            startHolding();
          } else {
            holdingRef.current = false;
          }
          setReady(true);
          if (process.env.NODE_ENV === "development" && consent === "granted") {
            ph.debug();
          }
        },
      });
    }

    document.addEventListener("cookieyes_banner_load", onBannerLoad);
    document.addEventListener("cookieyes_consent_update", onConsentUpdate);
    return () => {
      clearHoldHooks();
      document.removeEventListener("cookieyes_banner_load", onBannerLoad);
      document.removeEventListener("cookieyes_consent_update", onConsentUpdate);
    };
  }, []);

  useEffect(() => {
    if (pathname) {
      // Common Room's snippet auto-tracks the first page load, so only report
      // subsequent client-side navigations to avoid double counting.
      if (isInitialPageView.current) {
        isInitialPageView.current = false;
      } else {
        crPageView();
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (!ready || !pathname) return;
    if (lastCapturedPath.current === pathname) return;
    lastCapturedPath.current = pathname;

    if (holdingRef.current) {
      queueRef.current.push(createQueuedPageView(pathname));
    } else {
      posthog.capture("$pageview");
    }
  }, [pathname, ready]);

  return (
    <PHProvider client={posthog}>
      <UseCaseAnalytics ready={ready && analyticsGranted} />
      {children}
    </PHProvider>
  );
}
