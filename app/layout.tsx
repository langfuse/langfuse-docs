import type { Metadata } from "next";
import { RootProvider } from "fumadocs-ui/provider";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
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
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
