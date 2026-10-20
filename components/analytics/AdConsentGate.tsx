"use client";

import { useEffect, useState } from "react";
import { readAdvertisementConsent } from "@/lib/cookie-consent";

// Renders its children (the ad pixels) only once the CookieYes "advertisement"
// category is granted, so no ad tag loads or sets cookies before consent.
// CookieYes's own script-blocking does not catch these tags (they are injected
// dynamically via next/script), which is why the gate exists in code.
//
// Consent is detected the same way as in ClickIdPersistence:
//  - an initial check on mount (returning visitors with stored consent),
//  - `cookieyes_banner_load`, which makes the consent state readable at all
//    and is the only signal in notice-only regions where the category is
//    granted without any banner interaction,
//  - `cookieyes_consent_update`, when the visitor answers the banner or edits
//    their choices in the preference center.
//
// Once granted, the gate stays open for the lifetime of the page: loaded
// scripts cannot be un-executed, so revoking consent takes effect on the next
// page load, when the gate starts closed again.
export function AdConsentGate({ children }: { children: React.ReactNode }) {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    const check = () => {
      if (readAdvertisementConsent() === "granted") setGranted(true);
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
