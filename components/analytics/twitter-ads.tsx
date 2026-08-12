import Script from "next/script";
import { TWITTER_PIXEL_ID, isTwitterEnabled } from "@/lib/twitter-ads";

// X (Twitter) Pixel base script (universal website tag). Conversions are
// reported via `reportTwitterConversion` (see lib/ad-conversions.ts).
export function TwitterPixel() {
  if (!isTwitterEnabled) return null;

  return (
    <Script id="twitter-pixel" strategy="afterInteractive">
      {`!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');twq('config','${TWITTER_PIXEL_ID}');`}
    </Script>
  );
}
