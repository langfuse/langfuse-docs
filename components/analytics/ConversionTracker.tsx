"use client";

import { useEffect } from "react";
import { LAUNCH_APP_CTA_SELECTOR } from "@/lib/google-ads";
import { reportLaunchAppConversionIfSignedOut } from "@/lib/ad-conversions";
import { startCloudRegionSignInProbe } from "@/lib/cloud-region-sign-in-store";

// Reports the "launch app" conversion (sign up) across every ad platform
// whenever a visitor who is not signed in to any cloud region clicks a CTA
// that navigates to the Langfuse cloud app. CTAs opt in via the
// `data-launch-app-cta` attribute, so incidental cloud.langfuse.com links
// (e.g. in docs/blog content) are not counted. A single delegated listener
// keeps this working for every marked CTA.
export function ConversionTracker() {
  useEffect(() => {
    // The header CTA and the /cloud region picker start the probe too, but
    // neither is on every page carrying a launch-app CTA. Starting it here as
    // well means the sign-in answer is in flight from page load, so it has
    // normally arrived by the time a CTA is clicked.
    startCloudRegionSignInProbe(true);

    // Capture phase runs before button onClick handlers, so CTAs that
    // preventDefault to navigate programmatically are still tracked.
    const handler = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest(LAUNCH_APP_CTA_SELECTOR)) return;
      reportLaunchAppConversionIfSignedOut();
    };

    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, []);

  return null;
}
