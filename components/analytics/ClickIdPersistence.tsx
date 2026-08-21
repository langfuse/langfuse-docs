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

// Click ids are ad-click attribution data, so they fall under the CookieYes
// "advertisement" category — the same category that gates the Google Ads /
// LinkedIn / Reddit pixels. Unlike those, this is first-party inline code
// that CookieYes can't script-block, so consent is checked explicitly here.
//
// Three states, not a boolean: `getCkyConsent()` only returns real data once
// the CookieYes banner has finished loading, so an early read can look like a
// denial when the visitor has in fact consented. Treating that as "denied"
// would expire previously stored click ids (see `syncClickIdCookies`), and a
// return visit has no click-id params in the URL to rewrite them from.
// "unknown" therefore means "leave everything as it is".
type ConsentState = "granted" | "denied" | "unknown";

function readAdvertisementConsent(): ConsentState {
  // The live API wins whenever it can answer: it reflects in-session changes
  // — most importantly a revoke in the preference center — that the persisted
  // cookie may not have been rewritten with yet. Withdrawal must never be
  // masked by a stale grant, so a conclusive `false` here is a denial even if
  // the cookie still says yes.
  try {
    const advertisement = window.getCkyConsent?.()?.categories?.advertisement;
    if (typeof advertisement === "boolean")
      return advertisement ? "granted" : "denied";
  } catch {
    // an unavailable API is inconclusive, not a denial — fall through
  }

  // CookieYes has not loaded (or is blocked), so fall back to its persisted
  // cookie: the durable record of an earlier decision, which survives reloads
  // and is written in notice-only regions too, where the category is granted
  // by default. It enumerates every category, so its presence is conclusive.
  const consentCookie = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("cookieyes-consent="));
  if (consentCookie)
    return consentCookie.includes("advertisement:yes") ? "granted" : "denied";

  // Neither source could answer: leave any stored click ids untouched.
  return "unknown";
}

function syncClickIdCookies(clickIds: Partial<Record<string, string>>) {
  const { hostname, protocol } = window.location;
  const isLangfuseDomain =
    hostname === "langfuse.com" || hostname.endsWith(".langfuse.com");
  const cookieAttributes = [
    // scope to .langfuse.com so cloud.langfuse.com receives the cookies;
    // host-only elsewhere (previews, localhost)
    ...(isLangfuseDomain ? ["domain=.langfuse.com"] : []),
    "path=/",
    "samesite=lax",
    ...(protocol === "https:" ? ["secure"] : []),
  ];
  const consent = readAdvertisementConsent();

  // consent state not established yet (CookieYes still loading, or blocked):
  // do nothing, so click ids stored on an earlier consented visit survive
  if (consent === "unknown") return;

  for (const param of CLICK_ID_PARAMS) {
    if (consent === "denied") {
      // consent absent or revoked: expire any previously stored value —
      // CookieYes can't auto-clear custom cookies it doesn't know about
      document.cookie = [`lf_${param}=`, ...cookieAttributes, "max-age=0"].join(
        "; ",
      );
      continue;
    }

    const value = clickIds[param];
    if (!value || !CLICK_ID_FORMAT.test(value)) continue;

    document.cookie = [
      `lf_${param}=${value}`,
      ...cookieAttributes,
      `max-age=${NINETY_DAYS_IN_SECONDS}`,
    ].join("; ");
  }
}

// Persists ad-platform click ids from landing-page URLs in first-party
// `lf_<param>` cookies on `.langfuse.com` so that cloud.langfuse.com can
// attribute account signups to the ad click that led here (read by
// `getAdClickIdsFromRequest` in langfuse/langfuse and attached to the
// `cloud_signup_complete` analytics event). Last ad click wins; the 90-day
// lifetime matches the ad platforms' click-through conversion windows. Only
// stored with CookieYes "advertisement" consent — checked on mount, once
// CookieYes has loaded, and on every later consent change; revoking consent
// expires the cookies.
export function ClickIdPersistence() {
  useEffect(() => {
    // capture once at mount: this component lives in the root layout, so the
    // consent listener survives client-side navigations where the click ids
    // are no longer in the URL by the time the visitor answers the banner
    const params = new URLSearchParams(window.location.search);
    const clickIds = Object.fromEntries(
      CLICK_ID_PARAMS.map((param) => [param, params.get(param) ?? undefined]),
    );
    const sync = () => syncClickIdCookies(clickIds);

    sync();
    // `cookieyes_banner_load` is what makes the consent state readable at all
    // (getCkyConsent() returns nothing before it) and is the only signal in
    // notice-only regions, where the visitor never interacts with the banner.
    // `cookieyes_consent_update` covers answering the banner and later edits
    // in the preference center: grants persist the click, revocations clear it.
    document.addEventListener("cookieyes_banner_load", sync);
    document.addEventListener("cookieyes_consent_update", sync);
    return () => {
      document.removeEventListener("cookieyes_banner_load", sync);
      document.removeEventListener("cookieyes_consent_update", sync);
    };
  }, []);

  return null;
}
