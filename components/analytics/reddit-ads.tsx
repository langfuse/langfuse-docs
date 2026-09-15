import Script from "next/script";
import { REDDIT_PIXEL_ID, isRedditEnabled } from "@/lib/reddit-ads";

// Reddit Pixel base script (initializes the pixel and tracks PageVisit).
// Conversions are reported via `reportRedditConversion` (see lib/ad-conversions.ts).
export function RedditPixel() {
  if (!isRedditEnabled) return null;

  return (
    <Script id="reddit-pixel" strategy="afterInteractive">
      {`!function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);rdt('init','${REDDIT_PIXEL_ID}');rdt('track','PageVisit');`}
    </Script>
  );
}
