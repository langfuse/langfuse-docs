import type { Metadata } from "next";
import Script from "next/script";
import { RootProvider } from "fumadocs-ui/provider/next";
import localFont from "next/font/local";
import { PostHogProvider } from "@/components/analytics/PostHogProvider";

const interVariable = localFont({
  src: "../public/fonts/InterVariable.ttf",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../public/fonts/GeistMono-Medium.ttf",
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

export const metadata: Metadata = {
  metadataBase: new URL("https://langfuse.com"),
  title: { default: "Langfuse", template: "%s - Langfuse" },
  description:
    "Traces, evals, prompt management and metrics to debug and improve your LLM application.",
  openGraph: {
    images: [{ url: "https://langfuse.com/og.png" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "langfuse.com",
    images: [{ url: "https://langfuse.com/og.png" }],
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
        <PostHogProvider>
          <RootProvider>{children}</RootProvider>
        </PostHogProvider>
        {process.env.NODE_ENV === "production" && (
          <>
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
