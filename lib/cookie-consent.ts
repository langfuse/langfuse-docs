// CookieYes "advertisement"-category consent, read client-side. Shared by the
// AdConsentGate (which keeps ad pixels from loading pre-consent) and
// ClickIdPersistence (which stores/expires first-party click-id cookies).
//
// Three states, not a boolean: `getCkyConsent()` only returns real data once
// the CookieYes banner has finished loading, so an early read can look like a
// denial when the visitor has in fact consented. Callers that must not act on
// a wrong "denied" (like ClickIdPersistence, which would expire previously
// stored click ids) treat "unknown" as "leave everything as it is"; callers
// that gate script loading simply keep the gate closed until "granted".
export type ConsentState = "granted" | "denied" | "unknown";

export function readAdvertisementConsent(): ConsentState {
  if (typeof window === "undefined") return "unknown";

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

  // Neither source could answer.
  return "unknown";
}

function readCategoryConsent(
  category: "analytics" | "functional",
): ConsentState {
  if (typeof window === "undefined") return "unknown";

  // The live API wins once it is conclusive, so an in-session revoke counts at
  // once; before the banner has loaded it reads as "not answered".
  try {
    const consent = window.getCkyConsent?.();
    if (consent?.categories?.[category] === true) return "granted";
    if (
      consent?.categories?.[category] === false &&
      consent.isUserActionCompleted
    )
      return "denied";
  } catch {
    // an unavailable API is inconclusive — fall through
  }

  // The persisted cookie is the durable record of an earlier answer.
  const consentCookie = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("cookieyes-consent="));
  if (!consentCookie) return "unknown";
  if (consentCookie.includes(`${category}:yes`)) return "granted";
  return consentCookie.includes("action:yes") ? "denied" : "unknown";
}

// CookieYes "analytics"-category consent as the visitor answered it, shared by
// PostHogProvider, AnalyticsConsentGate, and Inkeep. Returns "granted" as soon
// as either the live API or the persisted cookie records analytics consent,
// "denied" once the visitor has answered negatively, and "unknown" before an
// answer or when CookieYes fails to load. Callers fail closed and only enable
// full tracking or analytics scripts on "granted".
export function readAnalyticsConsent(): ConsentState {
  return readCategoryConsent("analytics");
}

// CookieYes "functional"-category consent, mirroring readAnalyticsConsent.
export function readFunctionalConsent(): ConsentState {
  return readCategoryConsent("functional");
}
