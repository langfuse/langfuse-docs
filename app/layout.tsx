import type { Metadata } from "next";
import { AppRootProvider } from "@/components/AppRootProvider";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import { DevAriaHiddenConsoleFilter } from "@/components/DevAriaHiddenConsoleFilter";
import {
  buildDefaultSiteOgImageUrl,
  SITE_DEFAULT_OG_DESCRIPTION,
} from "@/lib/og-url";
import { PostHogProvider } from "@/components/analytics/PostHogProvider";
import { WebMcpDocsTools } from "@/components/WebMcpDocsTools";
import { AISearch } from "@/components/inkeep/search";
import { GoogleAds } from "@/components/analytics/google-ads";
import { LinkedInInsightTag } from "@/components/analytics/linkedin-ads";
import { RedditPixel } from "@/components/analytics/reddit-ads";
import { SpotifyPixel } from "@/components/analytics/spotify-ads";
import { TwitterPixel } from "@/components/analytics/twitter-ads";
import { ConversionTracker } from "@/components/analytics/ConversionTracker";
import { AdConsentGate } from "@/components/analytics/AdConsentGate";
import { AnalyticsConsentGate } from "@/components/analytics/AnalyticsConsentGate";
import { ClickIdPersistence } from "@/components/analytics/ClickIdPersistence";
import { CommonRoom } from "@/components/analytics/common-room";
import { Reo } from "@/components/analytics/reo";
import { AhrefsAnalytics } from "@/components/analytics/ahrefs";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../style.css";
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

const defaultOgImageUrl = buildDefaultSiteOgImageUrl();

export const metadata: Metadata = {
  metadataBase: new URL("https://langfuse.com"),
  title: { default: "Langfuse", template: "%s - Langfuse" },
  description: SITE_DEFAULT_OG_DESCRIPTION,
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    type: "website",
    images: [{ url: defaultOgImageUrl }],
  },
  twitter: {
    card: "summary_large_image",
    site: "langfuse.com",
    images: [{ url: defaultOgImageUrl }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${interVariable.variable} ${geistMono.variable} ${f37Analog.variable}`}
    >
      <head>
        {process.env.NODE_ENV === "production" && (
          <>
            <script
              id="consent-defaults"
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'denied',
  personalization_storage: 'denied',
  security_storage: 'granted',
  wait_for_update: 2000
});
gtag('set', 'url_passthrough', true);`,
              }}
            />
            <script
              id="cookieyes"
              type="text/javascript"
              src="https://cdn-cookieyes.com/client_data/40247147630c6589ad01a874/script.js"
            />
          </>
        )}
      </head>
      <body className="font-sans antialiased">
        {process.env.NODE_ENV === "development" && (
          <DevAriaHiddenConsoleFilter />
        )}
        <PostHogProvider>
          <WebMcpDocsTools />
          <AppRootProvider i18n={{ locale: "en" }}>
            <AISearch>{children}</AISearch>
          </AppRootProvider>
        </PostHogProvider>
        {process.env.NODE_ENV === "production" && (
          <>
            {/* Ad pixels require prior consent (CookieYes "advertisement"
                category). The gate keeps them from loading or setting cookies
                until it is granted; reportGoogleAdsConversion also checks ad
                consent because consent-defaults defines window.gtag before
                consent, and the other conversion helpers no-op when their tag
                is absent. */}
            <AdConsentGate>
              <GoogleAds />
              <LinkedInInsightTag />
              <RedditPixel />
              <SpotifyPixel />
              <TwitterPixel />
            </AdConsentGate>
            <ConversionTracker />
            <ClickIdPersistence />
            {/* Visitor identification scripts require prior consent (CookieYes
                "analytics" category). */}
            <AnalyticsConsentGate>
              <CommonRoom />
              <Reo />
            </AnalyticsConsentGate>
            <AhrefsAnalytics />
          </>
        )}
        <SpeedInsights sampleRate={0.1} />
      </body>
    </html>
  );
}
