"use client";

import { useEffect } from "react";

// Ad-platform click-id URL params appended to landing pages by ad clicks.
const CLICK_ID_PARAMS = [
  "gclid", // Google Ads
  "li_fat_id", // LinkedIn Ads
  "rdt_cid", // Reddit Ads
  "twclid", // X (Twitter) Ads
] as const;

// click ids are opaque tokens (typically ~60-120 chars); cap length and
// charset so arbitrary strings can't be persisted into the cookies
const CLICK_ID_FORMAT = /^[A-Za-z0-9_.-]{1,512}$/;
const NINETY_DAYS_IN_SECONDS = 90 * 24 * 60 * 60;

// Persists ad-platform click ids from landing-page URLs in first-party
// `lf_<param>` cookies on `.langfuse.com` so that cloud.langfuse.com can
// attribute account signups to the ad click that led here (read by
// `getAdClickIdsFromRequest` in langfuse/langfuse and attached to the
// `cloud_signup_complete` analytics event). Last ad click wins; the 90-day
// lifetime matches the click-through conversion windows of the ad platforms.
// Unlike the platform pixels' own cookies this also works when ad scripts
// are blocked, and unlike the PostHog cookie it captures returning visitors'
// most recent ad click, not only their first touch.
export function ClickIdPersistence() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const { hostname, protocol } = window.location;
    const isLangfuseDomain =
      hostname === "langfuse.com" || hostname.endsWith(".langfuse.com");

    for (const param of CLICK_ID_PARAMS) {
      const value = params.get(param);
      if (!value || !CLICK_ID_FORMAT.test(value)) continue;

      document.cookie = [
        `lf_${param}=${value}`,
        // scope to .langfuse.com so cloud.langfuse.com receives the cookie;
        // host-only elsewhere (previews, localhost)
        ...(isLangfuseDomain ? ["domain=.langfuse.com"] : []),
        "path=/",
        `max-age=${NINETY_DAYS_IN_SECONDS}`,
        "samesite=lax",
        ...(protocol === "https:" ? ["secure"] : []),
      ].join("; ");
    }
  }, []);

  return null;
}
