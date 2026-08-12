import Script from "next/script";

// Common Room website visitor tracking ("Signals"). Loads the signals.js
// snippet, which auto-tracks the initial page view and form submissions that
// contain an email field. Because the docs site is a single-page app, the
// snippet only sees the first page load — subsequent client-side navigations
// are reported manually via `crPageView` (see PostHogProvider).
// https://www.commonroom.io/docs/signals/website-visitor-tracking/
const COMMON_ROOM_SITE_ID = "56cd5a2c-528f-44aa-8175-7aad9d06854a";

export function CommonRoom() {
  return (
    <Script id="common-room" strategy="afterInteractive">
      {`(function() {
  if (typeof window === 'undefined') return;
  if (typeof window.signals !== 'undefined') return;
  var script = document.createElement('script');
  script.src = 'https://cdn.cr-relay.com/v1/site/${COMMON_ROOM_SITE_ID}/signals.js';
  script.async = true;
  window.signals = Object.assign(
    [],
    { _opts: { apiHost: 'https://api.cr-relay.com' } },
    ['page', 'identify', 'form'].reduce(function (acc, method){
      acc[method] = function () {
        signals.push([method, arguments]);
        return signals;
      };
     return acc;
    }, {})
  );
  document.head.appendChild(script);
})();`}
    </Script>
  );
}

// Report a page view to Common Room. The snippet auto-tracks the initial page
// load, so this is only needed for SPA route changes.
export const crPageView = () => {
  if (typeof window !== "undefined" && window.signals) {
    window.signals.page();
  }
};
