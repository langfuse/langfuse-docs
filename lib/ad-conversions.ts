import {
  GOOGLE_ADS_CONVERSIONS,
  reportGoogleAdsConversion,
} from "@/lib/google-ads";
import {
  LINKEDIN_CONVERSIONS,
  reportLinkedInConversion,
} from "@/lib/linkedin-ads";
import { REDDIT_EVENTS, reportRedditConversion } from "@/lib/reddit-ads";
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
  reportTwitterConversion(TWITTER_CONVERSIONS.launchApp, {
    value: 1.0,
    currency: "USD",
  });
}

// "Talk to us" — lead. Fired on a successful talk-to-us form submission.
export function reportTalkToUsConversion() {
  reportGoogleAdsConversion(GOOGLE_ADS_CONVERSIONS.talkToUsFormSubmit);
  reportLinkedInConversion(LINKEDIN_CONVERSIONS.talkToUs);
  reportRedditConversion(REDDIT_EVENTS.talkToUs);
  reportTwitterConversion(TWITTER_CONVERSIONS.talkToUs);
}
