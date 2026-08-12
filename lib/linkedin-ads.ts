// LinkedIn Insight Tag + conversion tracking.
//
// Fill in the values below from LinkedIn Campaign Manager:
//   - LINKEDIN_PARTNER_ID: Account Assets → Insight Tag (numeric partner ID)
//   - LINKEDIN_CONVERSIONS.*: Account Assets → Conversions (numeric conversion IDs)
//
// The Insight Tag only loads when a partner ID is set, and each conversion only
// fires when its ID is non-zero, so it is safe to ship before the IDs exist.
export const LINKEDIN_PARTNER_ID: string = "9239642";

export const LINKEDIN_CONVERSIONS: {
  launchApp: number;
  talkToUs: number;
} = {
  launchApp: 28126114, // "Launch App (Sign up)" conversion
  talkToUs: 28126122, // "Talk to Us (Lead)" conversion
};

export const isLinkedInEnabled = LINKEDIN_PARTNER_ID !== "";

export function reportLinkedInConversion(conversionId: number) {
  if (
    !conversionId ||
    typeof window === "undefined" ||
    typeof window.lintrk !== "function"
  ) {
    return;
  }

  window.lintrk("track", { conversion_id: conversionId });
}
