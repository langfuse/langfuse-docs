"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { hsPageView } from "@/components/analytics/hubspot";

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
    }
  }, [pathname]);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
