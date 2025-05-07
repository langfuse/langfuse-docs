import React from "react";
import { DocsThemeConfig, useConfig } from "nextra-theme-docs";
import { Cards, Steps, Tabs, Callout } from "nextra/components";
import { Logo } from "@/components/logo";
import { useRouter } from "next/router";
import { MainContentWrapper } from "./components/MainContentWrapper";
import { Frame } from "./components/Frame";
import { GithubMenuBadge } from "./components/GitHubBadge";
import { ToAppButton } from "./components/ToAppButton";
import { COOKBOOK_ROUTE_MAPPING } from "./lib/cookbook_route_mapping";
import { GeistSans } from "geist/font/sans";
import IconDiscord from "./components/icons/discord";
import FooterMenu from "./components/FooterMenu";
import Link from "next/link";
import { AvailabilityBanner } from "./components/availability";
import { CloudflareVideo, Video } from "./components/Video";
// import InkeepCustomTrigger from "./components/inkeep/InkeepCustomTrigger";
import InkeepSearchBar from "./components/inkeep/InkeepSearchBar";

const config: DocsThemeConfig = {
  logo: <Logo />,
  logoLink: false,
  main: MainContentWrapper,
  search: {
    // placeholder: "Search...",
    component: <InkeepSearchBar />,
  },
  navbar: {
    extraContent: (
      <>
        <a
          className="p-1 hidden lg:inline-block hover:opacity-80"
          target="_blank"
          href="https://discord.langfuse.com"
          aria-label="Langfuse Discord"
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
          <svg
            aria-label="X formerly known as Twitter"
            fill="currentColor"
            width="24"
            height="24"
            viewBox="0 0 24 22"
          >
            <path d="M16.99 0H20.298L13.071 8.26L21.573 19.5H14.916L9.702 12.683L3.736 19.5H0.426L8.156 10.665L0 0H6.826L11.539 6.231L16.99 0ZM15.829 17.52H17.662L5.83 1.876H3.863L15.829 17.52Z"></path>
          </svg>
        </a>

        <GithubMenuBadge />

        <ToAppButton />
      </>
    ),
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  editLink: {
    content: "Edit this page on GitHub",
  },
  toc: {
    backToTop: true,
  },
  docsRepositoryBase: "https://github.com/langfuse/langfuse-docs/tree/main",
  footer: {
    content: <FooterMenu />,
  },
  head: () => {
    const { asPath, defaultLocale, locale } = useRouter();
    const { frontMatter, title: pageTitle } = useConfig();
    const url =
      "https://langfuse.com" +
      (defaultLocale === locale ? asPath : `/${locale}${asPath}`);

    const description = frontMatter.description ?? "";

    const title = frontMatter.title ?? pageTitle;

    const section = asPath.startsWith("/docs")
      ? "Docs"
      : asPath.startsWith("/changelog/")
      ? "Changelog"
      : asPath.startsWith("/cookbook/")
      ? "Cookbook"
      : asPath.startsWith("/faq/")
      ? "FAQ"
      : "";

    const image = frontMatter.ogImage
      ? "https://langfuse.com" + frontMatter.ogImage
      : `https://langfuse.com/api/og?title=${encodeURIComponent(
          title
        )}&description=${encodeURIComponent(
          description
        )}&section=${encodeURIComponent(section)}`;

    const video = frontMatter.ogVideo
      ? "https://langfuse.com" + frontMatter.ogVideo
      : null;

    const cookbook = COOKBOOK_ROUTE_MAPPING.find(
      (cookbook) => cookbook.path === asPath
    );
    const canonical: string | undefined = cookbook?.canonicalPath
      ? "https://langfuse.com" + cookbook.canonicalPath
      : undefined;

    const noindex = frontMatter.noindex === true;

    const titleTemplate =
      asPath === "/"
        ? "Langfuse"
        : asPath.startsWith("/blog/")
        ? "%s - Langfuse Blog"
        : asPath.startsWith("/docs/guides/")
        ? "%s - Langfuse Guides"
        : "%s - Langfuse";

    return (
      <>
        <meta name="theme-color" content="#000" />
        <meta property="og:url" content={url} />
        <meta httpEquiv="Content-Language" content="en" />

        <meta name="description" content={description} />
        <meta property="og:description" content={description} />

        {video && <meta property="og:video" content={video} />}

        <meta property="og:image" content={image} />
        <meta property="twitter:image" content={image} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site:domain" content="langfuse.com" />
        <meta name="twitter:url" content="https://langfuse.com" />

        <style
          dangerouslySetInnerHTML={{
            __html: `html { --font-geist-sans: ${GeistSans.style.fontFamily}; }`,
          }}
        />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />

        {canonical && <link rel="canonical" href={canonical} />}
        {noindex && <meta name="robots" content="noindex" />}
        <title>{titleTemplate.replace("%s", title)}</title>
      </>
    );
  },
  components: {
    Frame,
    Tabs,
    Tab: ({
      children,
      ...props
    }: { children: React.ReactNode } & React.ComponentProps<
      typeof Tabs.Tab
    >) => (
      <Tabs.Tab {...props} style={{ marginTop: "1rem" }}>
        <div className="border rounded bg-background p-4">{children}</div>
      </Tabs.Tab>
    ),
    Steps,
    Card: Cards.Card,
    Cards,
    AvailabilityBanner,
    Callout,
    CloudflareVideo,
    Video,
  },
  banner: {
    key: "langfuse-sf-meetup",
    dismissible: true,
    content: (
      <Link href="https://lu.ma/eydxi5ry">
        {/* mobile */}
        <span className="sm:hidden">Monday in SF: Event w/ Samsara & Langfuse →</span>
        {/* desktop */}
        <span className="hidden sm:inline">
        Monday in SF: Bringing agents to production with Samsara and Langfuse →
        </span>
      </Link>
    ),
  },
};

export default config;
