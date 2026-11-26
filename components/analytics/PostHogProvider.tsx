"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { crPageView } from "@/components/analytics/common-room";
import { UseCaseAnalytics } from "@/components/analytics/UseCaseAnalytics";
import { type ConsentState, readAnalyticsConsent } from "@/lib/cookie-consent";

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

// PostHog uses `cookieless_mode: "on_reject"` with `opt_out_persistence_by_default:
// true` (without `opt_out_capturing_by_default`):
// - "unknown": leave PostHog in "pending" with "memory" persistence (sends nothing,
//   stores nothing).
// - "denied": call `opt_out_capturing()` with "memory" persistence (sends cookieless
//   `$pageview`s only via `before_send`; stores only PostHog's opt-out flag).
// - "granted": switch to "cookie" persistence, opt in, and restore remote-config
//   extension defaults.
function applyAnalyticsConsent(): ConsentState {
  const consent = readAnalyticsConsent();
  if (consent === "granted") {
    if (posthog.config?.persistence !== "cookie") {
      // Switch from "memory" to "cookie" while persistence is still disabled
      // so any existing cross-subdomain cookie is preserved before opt-in.
      posthog.set_config({ persistence: "cookie" });
    }
    if (!posthog.has_opted_in_capturing()) {
      posthog.opt_in_capturing({ captureEventName: false });
    }
    if (posthog.config?.disable_session_recording) {
      // Restore remote-config defaults for extensions the SDK leaves undefined:
      // `posthog.set_config` ignores `undefined` values when merging, then
      // unconditionally re-runs `heatmaps.startIfEnabled()`,
      // `deadClicksAutocapture.startIfEnabledOrStop()`, and
      // `exceptionObserver.onConfigChange()` / `startIfEnabledOrStop()` against
      // `posthog.config`, which falls back to remote config when unset.
      delete posthog.config.capture_heatmaps;
      delete posthog.config.capture_dead_clicks;
      delete posthog.config.capture_exceptions;
      posthog.set_config(FULL_TRACKING_CONFIG);
    }
    return "granted";
  }

  if (consent === "denied") {
    // Opt out while persistence is still "cookie" (on a granted -> denied
    // transition) so posthog-js deletes `ph_<key>_posthog` and enters
    // cookieless mode with its refusal flag recorded.
    if (posthog.get_explicit_consent_status() !== "denied") {
      posthog.opt_out_capturing();
    }
    if (
      posthog.config &&
      (!posthog.config.disable_session_recording ||
        posthog.config.persistence !== "memory")
    ) {
      posthog.set_config({ ...COOKIELESS_ONLY_CONFIG, persistence: "memory" });
    }
    clearStalePostHogCookie();
    clearPostHogSessionStorage();
    return "denied";
  }

  // "unknown": if PostHog was opted in (consent withdrawn without a "denied"
  // reading), opt out first so the cookie is deleted, then clear back to
  // "pending". Never write an opt-out flag for a visitor who never refused.
  if (posthog.has_opted_in_capturing()) {
    posthog.opt_out_capturing();
    posthog.clear_opt_in_out_capturing();
  } else if (posthog.get_explicit_consent_status() !== "pending") {
    posthog.clear_opt_in_out_capturing();
  }
  if (
    posthog.config &&
    (!posthog.config.disable_session_recording ||
      posthog.config.persistence !== "memory")
  ) {
    posthog.set_config({ ...COOKIELESS_ONLY_CONFIG, persistence: "memory" });
  }
  clearStalePostHogCookie();
  clearPostHogSessionStorage();
  return "unknown";
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isInitialPageView = useRef(true);
  const [ready, setReady] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] =
    useState<ConsentState>("unknown");
  const lastCaptured = useRef<{
    path: string;
    consent: "denied" | "granted";
  } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!posthogKey) {
      console.warn("PostHog key is not set. PostHog will be disabled.");
      return;
    }

    const syncConsent = () => {
      setAnalyticsConsent(applyAnalyticsConsent());
    };

    const initialGranted = readAnalyticsConsent() === "granted";

    posthog.init(posthogKey, {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.posthog.com",
      ui_host: "https://eu.posthog.com",
      // Start in "memory" when analytics consent is not already granted so
      // posthog-js does not write `__ph_cookie_support_<uuid>` or `dmn_chk_*`
      // probe cookies during init.
      persistence: initialGranted ? "cookie" : "memory",
      cross_subdomain_cookie: true,
      // Route changes are captured below, including the initial page exactly once.
      capture_pageview: false,
      // Fail closed: start pending (sends nothing, stores nothing) until the
      // visitor answers. On rejection (`opt_out_capturing()`), capture
      // cookieless `$pageview`s only.
      cookieless_mode: "on_reject",
      opt_out_persistence_by_default: true,
      ...COOKIELESS_ONLY_CONFIG,
      before_send: (event) => {
        if (!event) return null;
        const consent = readAnalyticsConsent();
        if (consent === "granted") return event;
        if (consent === "denied") {
          return event.event === "$pageview" ? event : null;
        }
        return null;
      },
      loaded: (ph) => {
        syncConsent();
        setReady(true);
        if (
          process.env.NODE_ENV === "development" &&
          readAnalyticsConsent() === "granted"
        ) {
          ph.debug();
        }
      },
    });

    document.addEventListener("cookieyes_banner_load", syncConsent);
    document.addEventListener("cookieyes_consent_update", syncConsent);
    return () => {
      document.removeEventListener("cookieyes_banner_load", syncConsent);
      document.removeEventListener("cookieyes_consent_update", syncConsent);
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
    if (analyticsConsent === "unknown") {
      if (lastCaptured.current?.path === pathname) {
        lastCaptured.current = null;
      }
      return;
    }
    const samePath = lastCaptured.current?.path === pathname;
    if (analyticsConsent === "denied") {
      if (samePath) {
        // Record denied state so a later re-grant on the same page recaptures
        // a consented $pageview, without emitting a second pageview on revoke.
        lastCaptured.current = { path: pathname, consent: "denied" };
        return;
      }
    } else if (samePath && lastCaptured.current?.consent === "granted") {
      return;
    }
    lastCaptured.current = { path: pathname, consent: analyticsConsent };
    posthog.capture("$pageview");
  }, [pathname, ready, analyticsConsent]);

  return (
    <PHProvider client={posthog}>
      <UseCaseAnalytics ready={ready && analyticsConsent === "granted"} />
      {children}
    </PHProvider>
  );
}
