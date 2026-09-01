import Script from "next/script";
import { AppRootProvider } from "@/components/AppRootProvider";
import { GoogleTagManager } from "@next/third-parties/google";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import { DevAriaHiddenConsoleFilter } from "@/components/DevAriaHiddenConsoleFilter";
import { PostHogProvider } from "@/components/analytics/PostHogProvider";
import { AISearch } from "@/components/inkeep/search";
import { Hubspot } from "@/components/analytics/hubspot";
import { GoogleAds } from "@/components/analytics/google-ads";
import { LinkedInInsightTag } from "@/components/analytics/linkedin-ads";
import { RedditPixel } from "@/components/analytics/reddit-ads";
import { SpotifyPixel } from "@/components/analytics/spotify-ads";
import { TwitterPixel } from "@/components/analytics/twitter-ads";
import { ConversionTracker } from "@/components/analytics/ConversionTracker";
import { AdConsentGate } from "@/components/analytics/AdConsentGate";
import { ClickIdPersistence } from "@/components/analytics/ClickIdPersistence";
import { CommonRoom } from "@/components/analytics/common-room";
import { AhrefsAnalytics } from "@/components/analytics/ahrefs";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../style.css";
import "@vidstack/react/player/styles/base.css";
import "../src/overrides.css";

const interVariable = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geistMono = localFont({
  src: "../public/fonts/GeistMono-Medium.woff2",
  variable: "--font-geist-mono",
  display: "swap",
  weight: "500",
});

const f37Analog = localFont({
  src: "../public/fonts/F37Analog-Medium.woff2",
  variable: "--font-analog",
  display: "swap",
  weight: "500",
});

/**
 * The `<html>`/`<body>` shell shared by every root layout.
 *
 * Next.js only lets the root layout render `<html>`, and its attributes are
 * serialized before any child renders — so a single root layout cannot vary
 * `lang` by route. The app therefore has one root layout per document
 * language (`app/(en)` and `app/(ja)`), and both render this component so the
 * providers, fonts, and analytics stay in exactly one place.
 *
 * `lang` must agree with the self-referencing hreflang the pages under it
 * declare, otherwise crawlers report an hreflang/html-lang mismatch.
 */
export function RootDocument({
  lang,
  children,
}: Readonly<{ lang: "en" | "ja"; children: React.ReactNode }>) {
  return (
    <html
      lang={lang}
      dir="ltr"
      suppressHydrationWarning
      className={`${interVariable.variable} ${geistMono.variable} ${f37Analog.variable}`}
    >
      <body className="font-sans antialiased">
        {process.env.NODE_ENV === "development" && (
          <DevAriaHiddenConsoleFilter />
        )}
        <PostHogProvider>
          <AppRootProvider
            // Fumadocs UI locale stays "en": the app registers no Japanese
            // translation bundle, and switching it here would change search and
            // UI-string resolution. Only the document language varies by tree.
            i18n={{
              locale: "en",
              translations: {
                lastUpdate: "Last edited",
              },
            }}
          >
            <AISearch>{children}</AISearch>
          </AppRootProvider>
        </PostHogProvider>
        {process.env.NODE_ENV === "production" && (
          <>
            <GoogleTagManager gtmId="GTM-NGLK4TZX" />
            {/* Ad pixels require prior consent (CookieYes "advertisement"
                category). The gate keeps them from loading or setting cookies
                until it is granted; every conversion helper already no-ops
                when its tag is absent, so nothing else needs gating. */}
            <AdConsentGate>
              <GoogleAds />
              <LinkedInInsightTag />
              <RedditPixel />
              <SpotifyPixel />
              <TwitterPixel />
            </AdConsentGate>
            <ConversionTracker />
            <ClickIdPersistence />
            <Hubspot />
            <CommonRoom />
            <AhrefsAnalytics />
            <Script
              id="cookieyes"
              type="text/javascript"
              src="https://cdn-cookieyes.com/client_data/40247147630c6589ad01a874/script.js"
              strategy="beforeInteractive"
            />
          </>
        )}
        <SpeedInsights />
      </body>
    </html>
  );
}
