import type { Metadata } from "next";
import Script from "next/script";
import { RootProvider } from "fumadocs-ui/provider/next";
import { GoogleTagManager } from '@next/third-parties/google';
import localFont from "next/font/local";
import { Inter } from 'next/font/google'
import { DevAriaHiddenConsoleFilter } from "@/components/DevAriaHiddenConsoleFilter";
import {
  buildDefaultSiteOgImageUrl,
  SITE_DEFAULT_OG_DESCRIPTION,
} from "@/lib/og-url";
import { PostHogProvider } from "@/components/analytics/PostHogProvider";

const interVariable = Inter({
  subsets: ['latin'],
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
import { Hubspot } from "@/components/analytics/hubspot";
import "../style.css";
import "@vidstack/react/player/styles/base.css";
import "../src/overrides.css";

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
      <body className="font-sans antialiased">
        {process.env.NODE_ENV === "development" && <DevAriaHiddenConsoleFilter />}
        <PostHogProvider>
          <RootProvider>{children}</RootProvider>
        </PostHogProvider>
        {process.env.NODE_ENV === "production" && (
          <>
            <GoogleTagManager gtmId="GTM-NGLK4TZX" />
            <Hubspot />
            <Script
              id="cookieyes"
              type="text/javascript"
              src="https://cdn-cookieyes.com/client_data/40247147630c6589ad01a874/script.js"
              strategy="beforeInteractive"
            />
          </>
        )}
      </body>
    </html>
  );
}
