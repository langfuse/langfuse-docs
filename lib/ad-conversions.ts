import {
  getCloudRegionSignInSnapshot,
  isSignedInToAnyCloudRegion,
} from "@/lib/cloud-region-sign-in-store";
import {
  GOOGLE_ADS_CONVERSIONS,
  reportGoogleAdsConversion,
} from "@/lib/google-ads";
import {
  LINKEDIN_CONVERSIONS,
  reportLinkedInConversion,
} from "@/lib/linkedin-ads";
import { REDDIT_EVENTS, reportRedditConversion } from "@/lib/reddit-ads";
import { SPOTIFY_LEAD_CATEGORIES, reportSpotifyLead } from "@/lib/spotify-ads";
import {
  TWITTER_CONVERSIONS,
  reportTwitterConversion,
} from "@/lib/twitter-ads";

// Central dispatch for the two conversions we track across every ad platform.
// Each platform's helper no-ops when its tag is not loaded or not configured,
// so calling these is always safe.

// "Launch app" — sign up / sign in. Fired when a user navigates to the cloud app.
export function reportLaunchAppConversion() {
  reportGoogleAdsConversion(GOOGLE_ADS_CONVERSIONS.launchApp, {
    value: 1.0,
    currency: "USD",
  });
  reportLinkedInConversion(LINKEDIN_CONVERSIONS.launchApp);
  reportRedditConversion(REDDIT_EVENTS.launchApp);
  reportSpotifyLead(SPOTIFY_LEAD_CATEGORIES.launchApp);
  reportTwitterConversion(TWITTER_CONVERSIONS.launchApp, {
    value: 1.0,
    currency: "USD",
  });
}

// Same conversion, but only for a visitor who is not signed in to any cloud
// region — i.e. a plausible sign up rather than a returning user signing in.
// Every launch-app CTA reaches the app through /cloud or a region URL, so
// without this gate the conversion counts both.
//
// A visitor who has an account but is signed out in this browser still counts:
// only the app itself can tell those apart, which is what the app-side signup
// conversion (fired with the persisted click ids) is for. This removes the
// sign-ins the website *can* recognize.
export function reportLaunchAppConversionIfSignedOut() {
  const snapshot = getCloudRegionSignInSnapshot();

  // Not every region has answered yet, so "no region signed in" is not yet a
  // fact. Staying silent under-counts the rare very fast click; reporting
  // would reintroduce exactly the over-counting this gate removes.
  if (!snapshot.resolved) return;
  if (isSignedInToAnyCloudRegion(snapshot)) return;

  reportLaunchAppConversion();
}

// "Talk to us" — lead. Fired on a successful talk-to-us form submission.
export function reportTalkToUsConversion() {
  reportGoogleAdsConversion(GOOGLE_ADS_CONVERSIONS.talkToUsFormSubmit);
  reportLinkedInConversion(LINKEDIN_CONVERSIONS.talkToUs);
  reportRedditConversion(REDDIT_EVENTS.talkToUs);
  reportSpotifyLead(SPOTIFY_LEAD_CATEGORIES.talkToUs);
  reportTwitterConversion(TWITTER_CONVERSIONS.talkToUs);
}
