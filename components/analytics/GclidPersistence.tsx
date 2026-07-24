"use client";

import { useEffect } from "react";

// gclids are opaque tokens (typically ~60-120 chars); cap length and charset
// so arbitrary strings can't be persisted into the cookie
const GCLID_FORMAT = /^[A-Za-z0-9_-]{1,512}$/;
const NINETY_DAYS_IN_SECONDS = 90 * 24 * 60 * 60;

type CkyConsent = {
  categories?: {
    advertisement?: boolean;
  };
};

declare global {
  interface Window {
    getCkyConsent?: () => CkyConsent;
  }
}

// The gclid is ad-click attribution data, so it falls under the CookieYes
// "advertisement" category — the same category that gates the Google Ads /
// LinkedIn / Reddit pixels. Unlike those, this is first-party inline code
// that CookieYes can't script-block, so consent is checked explicitly here.
// For visitors under opt-in laws (GDPR) this is false until they accept; in
// notice-only regions CookieYes reports the category as granted by default.
// If CookieYes is unavailable (e.g. blocked), we conservatively treat that
// as no consent.
function hasAdvertisementConsent(): boolean {
  try {
    const consent = window.getCkyConsent?.();
    if (consent) return consent.categories?.advertisement === true;
  } catch {
    // fall through to the cookie check
  }
  // Fallback: CookieYes persists granted categories in its own cookie
  const consentCookie = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("cookieyes-consent="));
  return consentCookie?.includes("advertisement:yes") ?? false;
}

function persistGclid() {
  const gclid = new URLSearchParams(window.location.search).get("gclid");
  if (!gclid || !GCLID_FORMAT.test(gclid)) return;
  if (!hasAdvertisementConsent()) return;

  const { hostname, protocol } = window.location;
  const isLangfuseDomain =
    hostname === "langfuse.com" || hostname.endsWith(".langfuse.com");

  document.cookie = [
    `lf_gclid=${gclid}`,
    // scope to .langfuse.com so cloud.langfuse.com receives the cookie;
    // host-only elsewhere (previews, localhost)
    ...(isLangfuseDomain ? ["domain=.langfuse.com"] : []),
    "path=/",
    `max-age=${NINETY_DAYS_IN_SECONDS}`,
    "samesite=lax",
    ...(protocol === "https:" ? ["secure"] : []),
  ].join("; ");
}

// Persists the Google Ads click id (`?gclid=...` on ad landing pages) in a
// first-party cookie on `.langfuse.com` so that cloud.langfuse.com can
// attribute account signups to the ad click that led here (read by
// `getGclidFromRequest` in langfuse/langfuse and attached to the
// `cloud_signup_complete` analytics event). Last ad click wins; the 90-day
// lifetime matches the conversion action's click-through window in Google
// Ads. Only stored with CookieYes "advertisement" consent — checked on mount
// and again when the visitor answers the consent banner after landing.
export function GclidPersistence() {
  useEffect(() => {
    persistGclid();
    // the consent banner is usually answered on the landing page itself,
    // while the gclid is still in the URL — persist as soon as consent lands
    document.addEventListener("cookieyes_consent_update", persistGclid);
    return () =>
      document.removeEventListener("cookieyes_consent_update", persistGclid);
  }, []);

  return null;
}
