import type { Metadata } from "next";
import Script from "next/script";
import { RootProvider } from "fumadocs-ui/provider/next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { PostHogProvider } from "@/components/analytics/PostHogProvider";
import { Hubspot } from "@/components/analytics/hubspot";
import "../style.css";
import "@vidstack/react/player/styles/base.css";
import "../src/overrides.css";

export const metadata: Metadata = {
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
      className={`${GeistSans.variable} ${GeistMono.variable}`}
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
