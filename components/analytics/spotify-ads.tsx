import Script from "next/script";
import { SPOTIFY_PIXEL_ID, isSpotifyEnabled } from "@/lib/spotify-ads";

// Spotify Ad Analytics (SpAA) base pixel. ping.min.js patches the History API
// and reports client-side route changes on its own, so this must be the only
// source of `view` events — reporting SPA navigations manually as well doubles
// every pageview after the first. Conversions are reported via
// `reportSpotifyLead` (see lib/ad-conversions.ts).
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
