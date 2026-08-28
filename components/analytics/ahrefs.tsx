import Script from "next/script";

// Ahrefs Web Analytics — privacy-friendly, cookieless traffic analytics used
// for SEO reporting. Loaded site-wide in production via next/script (the
// idiomatic equivalent of dropping the async <script> into <head>). The
// `data-key` identifies the Langfuse property in Ahrefs.
const AHREFS_ANALYTICS_KEY = "Mex/bWanRRREdWiopW2rdA";

export function AhrefsAnalytics() {
  return (
    <Script
      id="ahrefs-analytics"
      src="https://analytics.ahrefs.com/analytics.js"
      data-key={AHREFS_ANALYTICS_KEY}
      strategy="afterInteractive"
    />
  );
}
