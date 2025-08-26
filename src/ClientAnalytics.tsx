"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { PlainChat } from "@/components/supportChat";
import { Hubspot, hsPageView } from "@/components/analytics/hubspot";
import Script from "next/script";

export function ClientAnalytics({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.posthog.com",
      ui_host: "https://eu.posthog.com",
      loaded: (ph) => {
        if (process.env.NODE_ENV === "development") ph.debug();
      },
    });
  }, []);

  useEffect(() => {
    // Track navigation changes
    posthog.capture("$pageview");
    hsPageView(pathname + (searchParams?.toString() ? `?${searchParams}` : ""));
  }, [pathname, searchParams]);

  return (
    <PostHogProvider client={posthog}>
      {children}
      <PlainChat />
      <Hubspot />
      <Script
        id="cookieyes"
        type="text/javascript"
        src="https://cdn-cookieyes.com/client_data/40247147630c6589ad01a874/script.js"
        strategy="beforeInteractive"
      />
    </PostHogProvider>
  );
}

