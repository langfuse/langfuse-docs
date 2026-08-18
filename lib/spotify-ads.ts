// Spotify Ad Analytics (SpAA) pixel + conversion tracking.
//
// Used to attribute podcast/audio ad campaigns (e.g. "Last Week in AI") to
// activity on langfuse.com. Fill in the pixel ID from the Spotify Ad Analytics
// dashboard under Manage → Your Pixels.
//
// Spotify only supports a fixed set of conversion events (alias, lead, product,
// addtocart, checkout, purchase). Sign ups and contact-sales requests both map
// to `lead`, differentiated via the optional `type` / `category` fields.
// We deliberately do not send a `value`: Spotify recommends only populating it
// when the lead itself is worth revenue, otherwise it inflates reported value.
// https://help.adanalytics.spotify.com/technical-pixel-docs
//
// The pixel only loads when the pixel ID is set, so it is safe to ship before
// the ID exists.
export const SPOTIFY_PIXEL_ID: string = "";

export const SPOTIFY_LEADS: {
  launchApp: SpotifyLead;
  talkToUs: SpotifyLead;
} = {
  launchApp: { type: "signup", category: "cloud_signup" },
  talkToUs: { type: "contact_sales", category: "talk_to_us" },
};

export const isSpotifyEnabled = SPOTIFY_PIXEL_ID !== "";

type SpotifyLead = {
  type: string;
  category: string;
};

function isSpotifyReady() {
  return (
    isSpotifyEnabled &&
    typeof window !== "undefined" &&
    typeof window.spdt === "function"
  );
}

export function reportSpotifyLead(lead: SpotifyLead) {
  if (!isSpotifyReady()) return;

  window.spdt("lead", { type: lead.type, category: lead.category });
}

// Report a page view to Spotify. The base snippet auto-tracks the initial page
// load, so this is only needed for SPA route changes.
export function spotifyPageView() {
  if (!isSpotifyReady()) return;

  window.spdt("view");
}
