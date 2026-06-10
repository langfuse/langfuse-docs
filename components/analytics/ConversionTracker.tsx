"use client";

import { useEffect } from "react";
import { LAUNCH_APP_CTA_SELECTOR } from "@/lib/google-ads";
import { reportLaunchAppConversion } from "@/lib/ad-conversions";

// Reports the "launch app" conversion (sign up / sign in) across every ad
// platform whenever a user clicks a CTA that navigates to the Langfuse cloud
// app. CTAs opt in via the `data-launch-app-cta` attribute, so incidental
// cloud.langfuse.com links (e.g. in docs/blog content) are not counted. A
// single delegated listener keeps this working for every marked CTA.
export function ConversionTracker() {
  useEffect(() => {
    // Capture phase runs before button onClick handlers, so CTAs that
    // preventDefault to navigate programmatically are still tracked.
    const handler = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest(LAUNCH_APP_CTA_SELECTOR)) return;
      reportLaunchAppConversion();
    };

    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, []);

  return null;
}
