/* eslint-env node */
import React from "react";
import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";
import "../style.css";
import "vidstack/styles/base.css";
import "../src/overrides.css";

import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import { Logo } from "@/components/logo";
import IconDiscord from "@/components/icons/discord";
import { GithubMenuBadge } from "@/components/GitHubBadge";
import { ToAppButton } from "@/components/ToAppButton";
import FooterMenu from "@/components/FooterMenu";
import InkeepSearchBar from "@/components/inkeep/InkeepSearchBar";
import { DocsContributors } from "@/components/DocsContributors";
import { ClientAnalytics } from "@/src/ClientAnalytics";

export const metadata = {
  metadataBase: new URL("https://langfuse.com"),
  title: {
    template: "%s - Langfuse",
  },
  description: "Langfuse documentation and resources.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const navbar = (
    <Navbar
      logo={<Logo />}
      logoLink={false}
      chatLink="https://discord.langfuse.com"
    >
      {/* Extra content on the right */}
      <a
        className="p-1 hidden lg:inline-block hover:opacity-80"
        target="_blank"
        href="https://discord.langfuse.com"
        aria-label="Langfuse Discord"
        rel="noreferrer"
      >
        <IconDiscord className="h-7 w-7" />
      </a>
      <a
        className="p-1 hidden lg:inline-block hover:opacity-80"
        target="_blank"
        href="https://x.com/langfuse"
        aria-label="Langfuse X formerly known as Twitter"
        rel="nofollow noreferrer"
      >
        <svg aria-label="X formerly known as Twitter" fill="currentColor" width="24" height="24" viewBox="0 0 24 22">
          <path d="M16.99 0H20.298L13.071 8.26L21.573 19.5H14.916L9.702 12.683L3.736 19.5H0.426L8.156 10.665L0 0H6.826L11.539 6.231L16.99 0ZM15.829 17.52H17.662L5.83 1.876H3.863L15.829 17.52Z"></path>
        </svg>
      </a>
      <GithubMenuBadge />
      <ToAppButton />
    </Navbar>
  );

  const pageMap = await getPageMap();

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body className={`${GeistSans.variable} font-sans ${GeistMono.variable}`}>
        <Layout
          navbar={navbar}
          footer={<Footer><FooterMenu /></Footer>}
          search={<InkeepSearchBar />}
          editLink="Edit this page on GitHub"
          docsRepositoryBase="https://github.com/langfuse/langfuse-docs/tree/main"
          sidebar={{ defaultMenuCollapseLevel: 1, toggleButton: true }}
          toc={{ backToTop: true, extraContent: <DocsContributors /> }}
          pageMap={pageMap}
        >
          <ClientAnalytics>{children}</ClientAnalytics>
        </Layout>
      </body>
    </html>
  );
}

