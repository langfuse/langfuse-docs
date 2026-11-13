"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { hsPageView } from "@/components/analytics/hubspot";
import { crPageView } from "@/components/analytics/common-room";
import { UseCaseAnalytics } from "@/components/analytics/UseCaseAnalytics";
import { readAnalyticsConsent } from "@/lib/cookie-consent";

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();

// Once a visitor rejects analytics in the CookieYes banner, PostHog runs
// cookieless (the mode the Tag Manager copy is configured with): no cookie and
// no stored id. A visitor PostHog has on record as opted out stays cookieless
// while the banner's answer is unknown. Accepting later turns the cookie back
// on, with a new id. Other visitors who haven't answered are unchanged.
function applyAnalyticsConsent() {
  const consent = readAnalyticsConsent();
  const recorded = posthog.get_explicit_consent_status();
  if (
    consent === "denied" ||
    (consent === "unknown" && recorded === "denied")
  ) {
    // cookieless first, so opting out drops the id instead of keeping it
    if (posthog.config.cookieless_mode !== "on_reject")
      posthog.set_config({ cookieless_mode: "on_reject" });
    posthog.opt_out_capturing();
    // posthog-js (key format read from 1.442.0) keeps the tab's window id in
    // sessionStorage after opting out
    try {
      sessionStorage.removeItem(`ph_${posthogKey}_window_id`);
      sessionStorage.removeItem(`ph_${posthogKey}_primary_window_exists`);
    } catch {
      // storage unavailable: nothing was kept there either
    }
  } else if (consent === "granted" && recorded === "denied") {
    posthog.opt_in_capturing({ captureEventName: false });
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
      // no cookie for a visitor PostHog has on record as opted out, even when
      // the CookieYes answer can't be read yet; others are unaffected
      opt_out_persistence_by_default: true,
      // a visitor who rejected earlier is cookieless from the first event
      ...(readAnalyticsConsent() === "denied" && {
        cookieless_mode: "on_reject",
        opt_out_capturing_by_default: true,
      }),
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
      hsPageView(pathname);
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
