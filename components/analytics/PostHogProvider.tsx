"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { crPageView } from "@/components/analytics/common-room";
import { UseCaseAnalytics } from "@/components/analytics/UseCaseAnalytics";
import { readAnalyticsConsent } from "@/lib/cookie-consent";

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();

const FULL_TRACKING_CONFIG = {
  disable_session_recording: false,
  autocapture: true,
  capture_heatmaps: true,
  capture_dead_clicks: true,
  capture_exceptions: true,
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

// PostHog starts opted out in cookieless mode (`cookieless_mode: "on_reject"`
// with `opt_out_capturing_by_default: true` and `opt_out_persistence_by_default:
// true`) and drops everything except `$pageview` in `before_send` until
// CookieYes "analytics" consent is granted. Granting opts in and enables the
// extensions; revoking returns to cookieless mode and clears PostHog storage.
function applyAnalyticsConsent() {
  const consent = readAnalyticsConsent();
  if (consent === "granted") {
    if (!posthog.has_opted_in_capturing()) {
      posthog.opt_in_capturing({ captureEventName: false });
    }
    if (posthog.config?.disable_session_recording) {
      posthog.set_config(FULL_TRACKING_CONFIG);
    }
    return;
  }

  if (posthog.config && !posthog.config.disable_session_recording) {
    posthog.set_config(COOKIELESS_ONLY_CONFIG);
  }
  if (posthog.has_opted_in_capturing()) {
    posthog.opt_out_capturing();
  }
  // opt_out_capturing() persists `__ph_opt_in_out_<key>` in localStorage;
  // clearing it keeps the visitor opted out via `opt_out_capturing_by_default`
  // without leaving PostHog storage behind on denial or revoke.
  if (posthog.get_explicit_consent_status() !== "pending") {
    posthog.clear_opt_in_out_capturing();
  }
  // posthog-js can keep the tab's window id in sessionStorage after opting out
  try {
    sessionStorage.removeItem(`ph_${posthogKey}_window_id`);
    sessionStorage.removeItem(`ph_${posthogKey}_primary_window_exists`);
  } catch {
    // storage unavailable: nothing was kept there either
  }
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isInitialPageView = useRef(true);
  const [ready, setReady] = useState(false);
  const lastCapturedPath = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!posthogKey) {
      console.warn("PostHog key is not set. PostHog will be disabled.");
      return;
    }

    posthog.init(posthogKey, {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.posthog.com",
      ui_host: "https://eu.posthog.com",
      persistence: "cookie",
      cross_subdomain_cookie: true,
      // Route changes are captured below, including the initial page exactly once.
      capture_pageview: false,
      // Fail closed: start opted out (cookieless capture, no client storage)
      // until CookieYes "analytics" consent is explicitly granted.
      cookieless_mode: "on_reject",
      opt_out_capturing_by_default: true,
      opt_out_persistence_by_default: true,
      ...COOKIELESS_ONLY_CONFIG,
      before_send: (event) => {
        if (!event) return null;
        if (readAnalyticsConsent() === "granted") return event;
        return event.event === "$pageview" ? event : null;
      },
      loaded: (ph) => {
        applyAnalyticsConsent();
        setReady(true);
        if (process.env.NODE_ENV === "development") ph.debug();
      },
    });

    document.addEventListener("cookieyes_banner_load", applyAnalyticsConsent);
    document.addEventListener(
      "cookieyes_consent_update",
      applyAnalyticsConsent,
    );
    return () => {
      document.removeEventListener(
        "cookieyes_banner_load",
        applyAnalyticsConsent,
      );
      document.removeEventListener(
        "cookieyes_consent_update",
        applyAnalyticsConsent,
      );
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
    if (ready && pathname && lastCapturedPath.current !== pathname) {
      lastCapturedPath.current = pathname;
      posthog.capture("$pageview");
    }
  }, [pathname, ready]);

  return (
    <PHProvider client={posthog}>
      <UseCaseAnalytics ready={ready} />
      {children}
    </PHProvider>
  );
}
