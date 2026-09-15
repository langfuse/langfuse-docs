import Script from "next/script";
import { GOOGLE_ADS_ID } from "@/lib/google-ads";

// Google Ads global site tag (gtag.js). Conversions are reported via
// `reportGoogleAdsConversion` (see lib/ad-conversions.ts), and launch-app CTA
// clicks are tracked by the shared ConversionTracker.
export function GoogleAds() {
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
