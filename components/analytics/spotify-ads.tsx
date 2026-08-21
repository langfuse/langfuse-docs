import Script from "next/script";
import { SPOTIFY_PIXEL_ID, isSpotifyEnabled } from "@/lib/spotify-ads";

// Spotify Ad Analytics (SpAA) base pixel. Tracks the initial page view; because
// the docs site is a single-page app, subsequent client-side navigations are
// reported manually via `spotifyPageView` (see PostHogProvider). Conversions are
// reported via `reportSpotifyLead` (see lib/ad-conversions.ts).
export function SpotifyPixel() {
  if (!isSpotifyEnabled) return null;

  return (
    <Script id="spotify-pixel" strategy="afterInteractive">
      {`(function(w, d){
  var id='spdt-capture', n='script';
  if (!d.getElementById(id)) {
    w.spdt = w.spdt || function() { (w.spdt.q = w.spdt.q || []).push(arguments); };
    var e = d.createElement(n); e.id = id; e.async=1;
    e.src = 'https://pixel.byspotify.com/ping.min.js';
    var s = d.getElementsByTagName(n)[0];
    s.parentNode.insertBefore(e, s);
  }
  w.spdt('conf', { key: '${SPOTIFY_PIXEL_ID}' });
  w.spdt('view');
})(window, document);`}
    </Script>
  );
}
