"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { hsPageView } from "@/components/analytics/hubspot";
import { crPageView } from "@/components/analytics/common-room";
import { UseCaseAnalytics } from "@/components/analytics/UseCaseAnalytics";

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();

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
      loaded: (ph) => {
        setReady(true);
        if (process.env.NODE_ENV === "development") ph.debug();
      },
    });
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
