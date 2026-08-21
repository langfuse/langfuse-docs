"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { hsPageView } from "@/components/analytics/hubspot";
import { crPageView } from "@/components/analytics/common-room";
import { spotifyPageView } from "@/lib/spotify-ads";

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isInitialPageView = useRef(true);

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
      loaded: (ph) => {
        if (process.env.NODE_ENV === "development") ph.debug();
      },
    });
  }, []);

  useEffect(() => {
    if (pathname) {
      posthog.capture("$pageview");
      hsPageView(pathname);
      // The Common Room and Spotify snippets auto-track the first page load, so
      // only report subsequent client-side navigations to avoid double counting.
      if (isInitialPageView.current) {
        isInitialPageView.current = false;
      } else {
        crPageView();
        spotifyPageView();
      }
    }
  }, [pathname]);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
