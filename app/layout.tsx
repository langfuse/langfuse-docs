import type { Metadata } from "next";
import Script from "next/script";
import { RootProvider } from "fumadocs-ui/provider/next";
import { Banner } from "fumadocs-ui/components/banner";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { PostHogProvider } from "@/components/analytics/PostHogProvider";
import { Hubspot } from "@/components/analytics/hubspot";
import Link from "next/link";
import "../style.css";
import "@vidstack/react/player/styles/base.css";
import "../src/overrides.css";

export const metadata: Metadata = {
  title: { default: "Langfuse", template: "%s - Langfuse" },
  description:
    "Traces, evals, prompt management and metrics to debug and improve your LLM application.",
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
        <Banner id="joining-clickhouse">
          <Link href="/blog/joining-clickhouse">
            <span className="sm:hidden">Langfuse joins ClickHouse! →</span>
            <span className="hidden sm:inline">
              Langfuse joins ClickHouse! Learn more →
            </span>
          </Link>
        </Banner>
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
