"use client";

import { useEffect } from "react";
import Script from "next/script";
import {
  GOOGLE_ADS_CONVERSIONS,
  GOOGLE_ADS_ID,
  reportGoogleAdsConversion,
} from "@/lib/google-ads";

// Matches the Langfuse cloud app on any region subdomain, e.g.
// cloud.langfuse.com, us.cloud.langfuse.com, hipaa.cloud.langfuse.com.
const CLOUD_APP_HOST = /(^|\.)cloud\.langfuse\.com$/i;

function isCloudAppHref(href: string): boolean {
  try {
    const url = new URL(href, window.location.origin);
    if (url.origin === window.location.origin) {
      return url.pathname === "/cloud" || url.pathname.startsWith("/cloud/");
    }
    return CLOUD_APP_HOST.test(url.hostname);
  } catch {
    return false;
  }
}

// Loads the Google Ads global site tag and reports the "launch app" conversion
// (sign ups / sign ins) whenever a user clicks any CTA that navigates to the
// Langfuse cloud app. A delegated listener keeps this working for every current
// and future cloud CTA without touching each button.
export function GoogleAds() {
  useEffect(() => {
    // Capture phase runs before button onClick handlers, so CTAs that
    // preventDefault to navigate programmatically are still tracked.
    const handler = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest("a[href]");
      const href = anchor?.getAttribute("href");
      if (!href || !isCloudAppHref(href)) return;
      reportGoogleAdsConversion(GOOGLE_ADS_CONVERSIONS.launchApp, {
        value: 1.0,
        currency: "USD",
      });
    };

    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, []);

  return (
    <>
      <Script
        id="google-ads-gtag"
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ADS_ID}');
        `}
      </Script>
    </>
  );
}
