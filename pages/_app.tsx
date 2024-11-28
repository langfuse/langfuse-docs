import "../style.css";
import "vidstack/styles/base.css";
import "../src/overrides.css";
import Script from "next/script";
import { useEffect } from "react";
import { useRouter } from "next/router";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { CrispWidget } from "@/components/supportChat";
import { Hubspot, hsPageView } from "@/components/analytics/hubspot";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    // Initialize PostHog
    if (typeof window !== "undefined") {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host:
          process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.posthog.com",
        ui_host: "https://eu.posthog.com",
        // Enable debug mode in development
        loaded: (posthog) => {
          if (process.env.NODE_ENV === "development") posthog.debug();
        },
      });
    }
    // Track page views
    const handleRouteChange = (path) => {
      posthog.capture("$pageview");
      hsPageView(path);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);
  return (
    <div className={`${GeistSans.variable} font-sans ${GeistMono.variable}`}>
      <PostHogProvider client={posthog}>
        <Component {...pageProps} />
        {process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID ? <CrispWidget /> : null}
      </PostHogProvider>
      <Hubspot />
      <SpeedInsights />
      <Script
        src="https://app.termly.io/resource-blocker/488cc3b0-ed5a-4e9d-81f2-76014dcae784?autoBlock=on"
        strategy="beforeInteractive"
        type="text/javascript"
      />
    </div>
  );
}
