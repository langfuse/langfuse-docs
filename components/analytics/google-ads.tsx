"use client";

import { useEffect } from "react";
import Script from "next/script";
import {
  GOOGLE_ADS_CONVERSIONS,
  GOOGLE_ADS_ID,
  LAUNCH_APP_CTA_SELECTOR,
  reportGoogleAdsConversion,
} from "@/lib/google-ads";

// Loads the Google Ads global site tag and reports the "launch app" conversion
// (sign ups / sign ins) whenever a user clicks a CTA that navigates to the
// Langfuse cloud app. CTAs opt in via the `data-launch-app-cta` attribute, so
// incidental cloud.langfuse.com links (e.g. in docs/blog content) are not
// counted as conversions. A delegated listener keeps this working for every
// marked CTA without touching each button.
export function GoogleAds() {
  useEffect(() => {
    // Capture phase runs before button onClick handlers, so CTAs that
    // preventDefault to navigate programmatically are still tracked.
    const handler = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest(LAUNCH_APP_CTA_SELECTOR)) return;
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
