import React from "react";
import { DocsThemeConfig, useConfig } from "nextra-theme-docs";
import { Cards, Steps, Tabs, Callout } from "nextra/components";
import { useRouter } from "next/router";
import { MainContentWrapper } from "./components/MainContentWrapper";
import { Frame } from "./components/Frame";
import { NavbarLogo } from "./components/NavbarLogo";
import { NavbarExtraContent } from "./components/NavbarExtraContent";
import { DocsContributors } from "./components/DocsContributors";
import { COOKBOOK_ROUTE_MAPPING } from "./lib/cookbook_route_mapping";
import { GeistSans } from "geist/font/sans";
import FooterMenu from "./components/FooterMenu";
import Link from "next/link";
import { AvailabilityBanner } from "./components/availability";
import InkeepSearchBar from "./components/inkeep/InkeepSearchBar";
import { LangTabs } from "./components/LangTabs";
import { Video } from "./components/Video";
// import IconYoutube from "./components/icons/youtube";

const config: DocsThemeConfig = {
  logo: <NavbarLogo linkToHome={false} />,
  logoLink: false,
  main: MainContentWrapper,
  search: {
    component: <InkeepSearchBar />,
  },
  navbar: {
    extraContent: <NavbarExtraContent />,
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
    extraContent: <DocsContributors />,
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

    const title = frontMatter.seoTitle ?? frontMatter.title ?? pageTitle;

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
    const canonical: string | undefined = frontMatter.canonical
      ? frontMatter.canonical.startsWith("http")
        ? frontMatter.canonical
        : "https://langfuse.com" + frontMatter.canonical
      : cookbook?.canonicalPath
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
        : asPath.startsWith("/handbook/")
        ? "%s - Langfuse Handbook"
        : "%s - Langfuse";

    const isDev =
      typeof process !== "undefined" && process.env.NODE_ENV === "development";

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
          href={isDev ? "/favicon-32x32-dev.png" : "/favicon-32x32.png"}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={isDev ? "/favicon-16x16-dev.png" : "/favicon-16x16.png"}
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
    LangTabs, // with state management
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
    Video,
  },
  banner: {
    key: "joining-clickhouse",
    dismissible: true,
    content: (
      <Link href="/blog/joining-clickhouse">
        {/* mobile */}
        <span className="sm:hidden">Langfuse joins ClickHouse! →</span>
        {/* desktop */}
        <span className="hidden sm:inline">
          Langfuse joins ClickHouse! Learn more →
        </span>
      </Link>
    ),
  },
};

export default config;
