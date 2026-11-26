# Analytics, ads and consent

langfuse.com uses CookieYes for consent. Every optional script must respect it, and must not run if CookieYes fails to load.

## Where tags live

| Vendor                              | Purpose                         | Lives in                                                | Consent category           | Gate                                                                                                                                                  |
| ----------------------------------- | ------------------------------- | ------------------------------------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| CookieYes                           | Consent manager                 | Code: `app/layout.tsx` (with Consent Mode defaults)     | n/a                        | n/a                                                                                                                                                   |
| Google Ads conversions              | Ad conversions                  | Code: `ConversionTracker.tsx` / `lib/ad-conversions.ts` | advertisement              | `AdConsentGate` (gtag not loaded without consent)                                                                                                     |
| Google Ads base tag (gtag)          | Ads, remarketing                | Code: `google-ads.tsx`                                  | advertisement              | `AdConsentGate`                                                                                                                                       |
| LinkedIn, Reddit, Spotify, X pixels | Ads                             | Code: `*-ads.tsx`                                       | advertisement              | `AdConsentGate`                                                                                                                                       |
| Click-ID cookies (`lf_*`)           | Ad attribution in the cloud app | Code: `ClickIdPersistence.tsx`                          | advertisement              | `readAdvertisementConsent`                                                                                                                            |
| PostHog                             | Product analytics               | Code: `PostHogProvider.tsx`                             | analytics                  | Full with consent; cookieless `$pageview` only otherwise (no storage); pageviews are held up to 10s until the consent choice is known, then sent once |
| Common Room                         | Visitor identification          | Code: `common-room.tsx`                                 | analytics                  | `AnalyticsConsentGate`                                                                                                                                |
| Reo.dev                             | Visitor identification          | Code: `reo.tsx`                                         | analytics                  | `AnalyticsConsentGate`                                                                                                                                |
| Ahrefs Web Analytics                | Cookieless SEO analytics        | Code: `ahrefs.tsx`                                      | none (legitimate interest) | none                                                                                                                                                  |
| Vercel Speed Insights               | Performance, cookieless         | Code: `app/layout.tsx`                                  | none                       | none                                                                                                                                                  |

There is no tag manager. Every tag lives in code and is added through a PR.

## Rules

1. Fail closed: a script may only run before consent if it stores nothing on the device and is listed above as "none".
2. Gate on "granted" only. "unknown" (no answer yet, or CookieYes blocked) is treated like "denied".
3. Every new cookie or storage key is added to CookieYes (category, description, script URL pattern) before release.

## Adding a vendor

1. Decide the category (advertisement or analytics).
2. Add a component in this folder and render it inside `AdConsentGate` or `AnalyticsConsentGate` in `app/layout.tsx`.
3. Add its cookies to CookieYes, and ask legal whether the cookie policy needs an update.
4. Test in a clean profile: no choice, Reject, Accept, and with `cdn-cookieyes.com` blocked.
