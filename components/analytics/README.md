# Analytics, ads and consent

langfuse.com uses CookieYes for consent. Every optional script must respect it, and must not run if CookieYes fails to load.

## Where tags live

| Vendor                              | Purpose                         | Lives in                       | Consent category           | Gate                                                                  |
| ----------------------------------- | ------------------------------- | ------------------------------ | -------------------------- | --------------------------------------------------------------------- |
| CookieYes                           | Consent manager                 | GTM (CookieYes CMP template)   | n/a                        | n/a                                                                   |
| Google Ads conversions              | Ad conversions                  | GTM                            | advertisement              | Consent Mode (basic) + additional `ad_storage` check                  |
| Google Ads base tag (gtag)          | Ads, remarketing                | Code: `google-ads.tsx`         | advertisement              | `AdConsentGate`                                                       |
| LinkedIn, Reddit, Spotify, X pixels | Ads                             | Code: `*-ads.tsx`              | advertisement              | `AdConsentGate`                                                       |
| Click-ID cookies (`lf_*`)           | Ad attribution in the cloud app | Code: `ClickIdPersistence.tsx` | advertisement              | `readAdvertisementConsent`                                            |
| PostHog                             | Product analytics               | Code: `PostHogProvider.tsx`    | analytics                  | Full with consent; cookieless `$pageview` only otherwise (no storage) |
| Common Room                         | Visitor identification          | Code: `common-room.tsx`        | analytics                  | `AnalyticsConsentGate`                                                |
| Reo.dev                             | Visitor identification          | Code: `reo.tsx`                | analytics                  | `AnalyticsConsentGate`                                                |
| Ahrefs Web Analytics                | Cookieless SEO analytics        | Code: `ahrefs.tsx`             | none (legitimate interest) | none                                                                  |
| Vercel Speed Insights               | Performance, cookieless         | Code: `app/layout.tsx`         | none                       | none                                                                  |

GTM is only for the CMP and Google Ads conversions. Everything else goes in code, so it is reviewed in a PR and uses the gates above.

## Rules

1. No vendor is loaded from both GTM and code.
2. Fail closed: a script may only run before consent if it stores nothing on the device and is listed above as "none".
3. Gate on "granted" only. "unknown" (no answer yet, or CookieYes blocked) is treated like "denied".
4. Every new cookie or storage key is added to CookieYes (category, description, script URL pattern) before release.
5. New GTM tags need Additional Consent Checks, and a GTM version note naming the CookieYes category.

## Adding a vendor

1. Decide the category (advertisement or analytics).
2. Add a component in this folder and render it inside `AdConsentGate` or `AnalyticsConsentGate` in `app/layout.tsx`.
3. Add its cookies to CookieYes, and ask legal whether the cookie policy needs an update.
4. Test in a clean profile: no choice, Reject, Accept, and with `cdn-cookieyes.com` blocked.
