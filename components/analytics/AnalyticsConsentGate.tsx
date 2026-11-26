"use client";

import { useEffect, useState } from "react";
import { readAnalyticsConsent } from "@/lib/cookie-consent";

// Renders its children (analytics / visitor-identification scripts) only once
// the CookieYes "analytics" category is granted, so nothing optional loads
// before consent or when CookieYes fails to load.
//
// Consent is detected the same way as in AdConsentGate:
//  - an initial check on mount (returning visitors with stored consent),
//  - `cookieyes_banner_load`, which makes the consent state readable at all
//    and is the only signal in notice-only regions where the category is
//    granted without any banner interaction,
//  - `cookieyes_consent_update`, when the visitor answers the banner or edits
//    their choices in the preference center.
//
// Once granted, the gate stays open for the lifetime of the page: loaded
// scripts cannot be un-executed, so revoking stops loading them on the next
// page load (manual SPA helpers like `crPageView` re-check consent directly).
export function AnalyticsConsentGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    const check = () => {
      if (readAnalyticsConsent() === "granted") setGranted(true);
    };

    check();
    document.addEventListener("cookieyes_banner_load", check);
    document.addEventListener("cookieyes_consent_update", check);
    return () => {
      document.removeEventListener("cookieyes_banner_load", check);
      document.removeEventListener("cookieyes_consent_update", check);
    };
  }, []);

  return granted ? <>{children}</> : null;
}
