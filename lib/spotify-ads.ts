// Spotify Ad Analytics (SpAA) pixel + conversion tracking.
//
// Used to attribute podcast/audio ad campaigns (e.g. "Last Week in AI") to
// activity on langfuse.com. The pixel ID comes from the Spotify Ad Analytics
// dashboard under Manage → Your Pixels.
//
// Spotify only supports a fixed set of conversion events (alias, lead, product,
// addtocart, checkout, purchase), so both of our conversions are `lead` events
// and are distinguished by `category`. The category strings below are taken
// verbatim from the snippets Ad Analytics generated for this pixel — SpAA groups
// conversions by that string in reporting, so they must match exactly.
//
// `type`, `value` and `currency` are intentionally omitted rather than sent
// empty: neither conversion is worth a fixed amount of revenue, and Spotify
// recommends only populating value when the lead itself is, otherwise it
// inflates reported value.
// https://help.adanalytics.spotify.com/technical-pixel-docs
//
// The pixel only loads when the pixel ID is set, so it is safe to ship without.
export const SPOTIFY_PIXEL_ID: string = "4c74bba7652e4bb0bf3e1bca5e56f0d1";

export const SPOTIFY_LEAD_CATEGORIES = {
  launchApp: "Sign Up",
  talkToUs: "Demo Request",
} as const;

export const isSpotifyEnabled = SPOTIFY_PIXEL_ID !== "";

function isSpotifyReady() {
  return (
    isSpotifyEnabled &&
    typeof window !== "undefined" &&
    typeof window.spdt === "function"
  );
}

export function reportSpotifyLead(category: string) {
  if (!category || !isSpotifyReady()) return;

  window.spdt("lead", { category });
}
