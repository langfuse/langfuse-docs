"use client";

import { useEffect } from "react";

// gclids are opaque tokens (typically ~60-120 chars); cap length and charset
// so arbitrary strings can't be persisted into the cookie
const GCLID_FORMAT = /^[A-Za-z0-9_-]{1,512}$/;
const NINETY_DAYS_IN_SECONDS = 90 * 24 * 60 * 60;

// Persists the Google Ads click id (`?gclid=...` on ad landing pages) in a
// first-party cookie on `.langfuse.com` so that cloud.langfuse.com can
// attribute account signups to the ad click that led here (read by
// `getGclidFromRequest` in langfuse/langfuse and attached to the
// `cloud_signup_complete` analytics event). Last ad click wins; the 90-day
// lifetime matches the conversion action's click-through window in Google
// Ads. Unlike gtag's `_gcl_aw` cookie this also works when ad scripts are
// blocked, and unlike the PostHog cookie it captures returning visitors'
// most recent ad click, not only their first touch.
export function GclidPersistence() {
  useEffect(() => {
    const gclid = new URLSearchParams(window.location.search).get("gclid");
    if (!gclid || !GCLID_FORMAT.test(gclid)) return;

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
  }, []);

  return null;
}
