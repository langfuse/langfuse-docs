export const GOOGLE_ADS_ID = "AW-10855791654";

export const GOOGLE_ADS_CONVERSIONS = {
  talkToUsFormSubmit: `${GOOGLE_ADS_ID}/VoyuCIjvmKkcEKb4uLgo`,
  launchApp: `${GOOGLE_ADS_ID}/Lb8RCKvkmqkcEKb4uLgo`,
} as const;

// Mark a CTA that navigates to the cloud app so the delegated click listener
// in components/analytics/google-ads.tsx fires the "launch app" conversion.
// Scoped to explicit CTAs to avoid counting incidental cloud.langfuse.com links
// (e.g. links in docs/blog content) as conversions.
export const LAUNCH_APP_CTA_ATTR = "data-launch-app-cta";
export const LAUNCH_APP_CTA_SELECTOR = `[${LAUNCH_APP_CTA_ATTR}]`;

// Matches the Langfuse cloud app on any region subdomain, e.g.
// cloud.langfuse.com, us.cloud.langfuse.com, hipaa.cloud.langfuse.com.
const CLOUD_APP_HOST = /(^|\.)cloud\.langfuse\.com$/i;

// Returns true if the href points to the cloud app, either via the internal
// `/cloud` route or an external region URL. SSR-safe (does not read `window`),
// so it can be used at render time to decide whether to mark a CTA.
export function isCloudAppHref(href: string): boolean {
  if (href.startsWith("/")) {
    return href === "/cloud" || href.startsWith("/cloud/");
  }
  try {
    return CLOUD_APP_HOST.test(new URL(href).hostname);
  } catch {
    return false;
  }
}

type ConversionOptions = {
  value?: number;
  currency?: string;
};

export function reportGoogleAdsConversion(
  sendTo: string,
  options: ConversionOptions = {},
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  // Use the beacon transport so the conversion ping survives a full-page
  // navigation (e.g. clicking a CTA that sets window.location to an external
  // cloud region URL) instead of being cancelled on unload.
  const params: Record<string, unknown> = {
    send_to: sendTo,
    transport_type: "beacon",
  };
  if (options.value !== undefined) params.value = options.value;
  if (options.currency !== undefined) params.currency = options.currency;

  window.gtag("event", "conversion", params);
}
