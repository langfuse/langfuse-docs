import type { Metadata } from "next";
import Script from "next/script";
import { RootProvider } from "fumadocs-ui/provider/next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { DevAriaHiddenConsoleFilter } from "@/components/DevAriaHiddenConsoleFilter";
import { PostHogProvider } from "@/components/analytics/PostHogProvider";
import { Hubspot } from "@/components/analytics/hubspot";
import "../style.css";
import "@vidstack/react/player/styles/base.css";
import "../src/overrides.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://langfuse.com"),
  title: { default: "Langfuse", template: "%s - Langfuse" },
  description:
    "Traces, evals, prompt management and metrics to debug and improve your LLM application.",
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
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="font-sans antialiased">
        {process.env.NODE_ENV === "development" && <DevAriaHiddenConsoleFilter />}
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
