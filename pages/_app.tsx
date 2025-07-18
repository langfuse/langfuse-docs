import "../style.css";
import "vidstack/styles/base.css";
import "../src/overrides.css";
import Script from "next/script";
import { useEffect } from "react";
import { useRouter } from "next/router";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { PlainChat } from "@/components/supportChat";
import { Hubspot, hsPageView } from "@/components/analytics/hubspot";
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
    
    // Style separators based on text content (both desktop and mobile)
    const styleSeparators = () => {
      const separators = document.querySelectorAll('li._font-semibold');
      separators.forEach((separator) => {
        const text = separator.textContent?.trim();
        if (text === 'Core' || text === 'Advanced') {
          separator.classList.add('separator-enhanced');
        }
      });
    };

    // Create MutationObserver to watch for DOM changes
    const observer = new MutationObserver((mutations) => {
      // Check if any mutations involved navigation elements
      const hasNavigationChanges = mutations.some(mutation => 
        mutation.addedNodes.length > 0 || 
        (mutation.target as Element)?.querySelector?.('li._font-semibold')
      );
      
      if (hasNavigationChanges) {
        styleSeparators();
      }
    });

    // Start observing navigation changes
    const handleNavigationObserving = () => {
      // Start observing the document for changes
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false
      });
      
      // Also run immediately in case elements are already present
      styleSeparators();
    };
    
    router.events.on("routeChangeComplete", handleNavigationObserving);
    handleNavigationObserving(); // Run on initial load
    
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
      router.events.off("routeChangeComplete", handleNavigationObserving);
      observer.disconnect();
    };
  }, []);
  return (
    <div className={`${GeistSans.variable} font-sans ${GeistMono.variable}`}>
      <PostHogProvider client={posthog}>
        <Component {...pageProps} />
        <PlainChat />
      </PostHogProvider>
      <Hubspot />
      <Script
        id="cookieyes"
        type="text/javascript"
        src="https://cdn-cookieyes.com/client_data/40247147630c6589ad01a874/script.js"
        strategy="beforeInteractive"
      />
    </div>
  );
}
