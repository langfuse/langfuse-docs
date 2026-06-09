// Reddit Pixel + conversion tracking.
//
// Fill in the pixel ID from Reddit Ads Manager (Events Manager → Pixel →
// "Install the Pixel"). It is the `pixel_id` / `rdt('init', …)` value and uses
// the "a2_" prefix (e.g. "a2_xxxxxxxxx") — not the "t2_" account-ID prefix.
//
// Reddit uses standard event names (no per-conversion ID needed). The pixel
// only loads when the ID is set, so it is safe to ship before the ID exists.
export const REDDIT_PIXEL_ID: string = "a2_j57h34zw84n1";

export const REDDIT_EVENTS: {
  launchApp: string;
  talkToUs: string;
} = {
  launchApp: "SignUp", // sign up / sign in
  talkToUs: "Lead", // talk-to-us form lead
};

export const isRedditEnabled = REDDIT_PIXEL_ID !== "";

export function reportRedditConversion(eventName: string) {
  if (
    !eventName ||
    !REDDIT_PIXEL_ID ||
    typeof window === "undefined" ||
    typeof window.rdt !== "function"
  ) {
    return;
  }

  window.rdt("track", eventName);
}
