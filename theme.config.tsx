import React from "react";
import {
  DocsThemeConfig,
  Tabs,
  Tab,
  useConfig,
  Steps,
  Card,
  Cards,
} from "nextra-theme-docs";
import { Logo } from "@/components/logo";
import { useRouter } from "next/router";
import { MainContentWrapper } from "./components/MainContentWrapper";
import { Frame } from "./components/Frame";
import { GithubMenuBadge } from "./components/GitHubBadge";
import { ToAppButton } from "./components/ToAppButton";
import { COOKBOOK_ROUTE_MAPPING } from "./lib/cookbook_route_mapping";
import { GeistSans } from "geist/font/sans";
import IconDiscord from "./components/icons/discord";

const footerMenu = [
  {
    heading: "Platform",
    items: [
      {
        name: "LLM Tracing",
        href: "/docs/tracing/overview",
      },
      {
        name: "Prompt Management",
        href: "/docs/prompts/get-started",
      },
      {
        name: "Evaluation",
        href: "/docs/scores/overview",
      },
      {
        name: "Datasets",
        href: "/docs/datasets/overview",
      },
      {
        name: "Metrics",
        href: "/docs/analytics",
      },
    ],
  },
  {
    heading: "Integrations",
    items: [
      {
        name: "Python SDK",
        href: "/docs/sdk/python",
      },
      {
        name: "JS/TS SDK",
        href: "/docs/sdk/typescript",
      },
      {
        name: "OpenAI SDK",
        href: "/docs/integrations/openai/get-started",
      },
      {
        name: "Langchain",
        href: "/docs/integrations/langchain/tracing",
      },
      {
        name: "Llama-Index",
        href: "/docs/integrations/llama-index/get-started",
      },
      {
        name: "Litellm",
        href: "/docs/integrations/litellm",
      },
      {
        name: "Flowise",
        href: "/docs/integrations/flowise",
      },
      {
        name: "Langflow",
        href: "/docs/integrations/langflow",
      },
      {
        name: "API",
        href: "https://api.reference.langfuse.com/",
      },
    ],
  },
  {
    heading: "Resources",
    items: [
      { name: "Documentation", href: "/docs" },
      {
        name: "Changelog",
        href: "/changelog",
      },
      {
        name: "Interactive Demo",
        href: "/demo",
      },
      {
        name: "Pricing",
        href: "/pricing",
      },
      {
        name: "Status",
        href: "https://status.langfuse.com",
      },
      {
        name: "Self-hosting",
        href: "/docs/deployment/self-host",
      },
      {
        name: "Open Source",
        href: "/docs/open-source",
      },
    ],
  },
  {
    heading: "About",
    items: [
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "mailto:support@langfuse.com" },
      {
        name: "Schedule Demo",
        href: "/schedule-demo",
      },
      {
        name: "OSS Friends",
        href: "/oss-friends",
      },
    ],
  },

  {
    heading: "Legal",
    items: [
      { name: "Security", href: "/security" },
      { name: "Imprint", href: "/imprint" },
      {
        name: "Terms",
        href: "/tos",
      },
      {
        name: "Privacy",
        href: "/privacy",
      },
    ],
  },
];

const config: DocsThemeConfig = {
  logo: <Logo />,
  main: MainContentWrapper,
  search: {
    placeholder: "Search...",
  },
  navbar: {
    extraContent: (
      <>
        <a
          className="p-1 hidden sm:inline-block hover:opacity-80"
          target="_blank"
          href="https://langfuse.com/discord"
          aria-label="Langfuse Discord"
          rel="nofollow noreferrer"
        >
          <IconDiscord className="h-7 w-7" />
        </a>

        <a
          className="p-1 hidden sm:inline-block hover:opacity-80"
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
    text: "Edit this page on GitHub",
  },
  toc: {
    backToTop: true,
  },
  docsRepositoryBase: "https://github.com/langfuse/langfuse-docs/tree/main",
  footer: {
    text: (
      <div className="w-full">
        <div className="grid grid-cols-2 md:grid-cols-5 text-base gap-y-8 gap-x-2">
          {footerMenu.map((menu) => (
            <div key={menu.heading}>
              <p className="pb-2 font-mono font-bold text-primary">
                {menu.heading}
              </p>
              <ul className="flex flex-col gap-2">
                {menu.items.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-sm leading-tight hover:text-primary/80"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div />
        </div>
        <div className="my-8 font-mono text-sm">
          © 2022-{new Date().getFullYear()} Finto Technologies
        </div>
      </div>
    ),
  },
  useNextSeoProps() {
    const { asPath } = useRouter();
    const cookbook = COOKBOOK_ROUTE_MAPPING.find(
      (cookbook) => cookbook.path === asPath
    );
    const canonical: string | undefined = cookbook?.canonicalPath
      ? "https://langfuse.com" + cookbook.canonicalPath
      : undefined;

    return {
      titleTemplate:
        asPath === "/"
          ? "Langfuse"
          : asPath.startsWith("/blog/")
          ? "%s - Langfuse Blog"
          : asPath.startsWith("/docs/guides/")
          ? "%s - Langfuse Guides"
          : "%s - Langfuse",
      canonical,
    };
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
      </>
    );
  },
  components: {
    Frame,
    Tabs,
    Tab,
    Steps,
    Card,
    Cards,
  },
  // banner: {
  //   key: "golden-kitty-banner",
  //   dismissible: true,
  //   text: (
  //     <Link href="https://www.producthunt.com/golden-kitty-awards/hall-of-fame">
  //       {/* mobile */}
  //       <span className="sm:hidden">Langfuse won a Golden Kitty Award →</span>
  //       {/* desktop */}
  //       <span className="hidden sm:inline">
  //         Langfuse won a Golden Kitty Award in AI Infra →
  //       </span>
  //     </Link>
  //   ),
  // },
};

export default config;
