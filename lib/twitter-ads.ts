// X (Twitter) Pixel + conversion tracking.
//
// Fill in the values below from X Ads → Tools → Events Manager:
//   - TWITTER_PIXEL_ID: the pixel ID (e.g. "oabc1")
//   - TWITTER_CONVERSIONS.*: the event ID for each conversion. The full tag X
//     expects is `tw-${TWITTER_PIXEL_ID}-${eventId}`.
//
// The pixel only loads when the pixel ID is set, and each conversion only fires
// when its event ID is set, so it is safe to ship before the IDs exist.
export const TWITTER_PIXEL_ID: string = ""; // e.g. "oabc1"

export const TWITTER_CONVERSIONS: {
  launchApp: string;
  talkToUs: string;
} = {
  launchApp: "", // sign up / sign in
  talkToUs: "", // talk-to-us form lead
};

export const isTwitterEnabled = TWITTER_PIXEL_ID !== "";

type TwitterEventOptions = {
  value?: number;
  currency?: string;
};

export function reportTwitterConversion(
  eventId: string,
  options: TwitterEventOptions = {},
) {
  if (
    !eventId ||
    !TWITTER_PIXEL_ID ||
    typeof window === "undefined" ||
    typeof window.twq !== "function"
  ) {
    return;
  }

  const params: Record<string, unknown> = {};
  if (options.value !== undefined) params.value = options.value;
  if (options.currency !== undefined) params.currency = options.currency;

  window.twq("event", `tw-${TWITTER_PIXEL_ID}-${eventId}`, params);
}
