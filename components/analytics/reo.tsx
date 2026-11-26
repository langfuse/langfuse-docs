"use client";

import Script from "next/script";

const REO_CLIENT_ID = "38b2e79cdb32fa7";

// Reo.dev visitor identification script. Rendered inside AnalyticsConsentGate
// in app/layout.tsx so it only loads after CookieYes "analytics" consent.
export function Reo() {
  return (
    <Script
      id="reo"
      src="https://static.reo.dev/myreo786/reo.js"
      strategy="afterInteractive"
      onLoad={() => {
        window.Reo?.init({ clientID: REO_CLIENT_ID });
      }}
    />
  );
}
