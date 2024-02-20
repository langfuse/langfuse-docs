'use client'

import React, { useEffect } from "react";
import {
  DocsThemeConfig,
  Tabs,
  Tab,
  useConfig,
  Steps,
  Card,
  Cards,
  Navbar,
} from "nextra-theme-docs";
import { useRouter } from "next/router";
import Link from "next/link";
import { MainContentWrapper } from "./components/MainContentWrapper";
import { Frame } from "./components/Frame";
import { BsDiscord } from "react-icons/bs";
import { ToAppButton } from "./components/ToAppButton";
import { AssistMeLogo } from "./components/AssistMeLogo";
import { useSearchParams } from "next/navigation";
import { PageItem } from "nextra/normalize-pages";

const footerNav = [
  { name: "Contact", href: "mailto:contact@assistme.chat" },
  // {
  //   name: "Schedule Demo",
  //   href: "/schedule-demo",
  // },
  // {
  //   name: "Status",
  //   href: "https://status.assistme.com",
  // },
];

const footerLegalNav = [
  // { name: "Imprint", href: "/imprint" },
  {
    name: "Terms",
    href: "/tos",
  },
  {
    name: "Privacy",
    href: "/privacy",
  },
];

const Docs: PageItem = {
  title: "Docs",
  type: "page",
  href: "docs",
  kind: 'MdxPage',
  name: 'Docs',
  route: '/docs'
}

const CheckHeaderParamsComponent = () => {
  const params = useSearchParams();
  const navbarVisible = params.get('navbarVisible');

  if (navbarVisible === 'false') {
    return (
      <></>
    )
  } else {
    return (
      <><Navbar flatDirectories={[]} items={[Docs,
      ]} /></>
    )
  }
}

const CheckFooterParamsComponent = () => {
  const params = useSearchParams();
  const footerVisible = params.get('footerVisible');

  if (footerVisible === 'false') {
    return (
      <></>
    )
  } else {
    return (
      <div className="flex md:justify-between md:flex-row flex-col px-14 py-10 border-2 border-[#F2F3F5] items-center flex-1 flex-wrap gap-2 text-sm">
        <div className="md:order-last flex flex-col lg:flex-row gap-y-1 gap-x-4">
          <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center md:justify-end">
            {footerNav.map((nav) => (
              <Link
                key={nav.name}
                href={nav.href}
                className="inline rounded-none leading-6 text-primary/80 hover:text-primary whitespace-nowrap"
              >
                {nav.name}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center md:justify-end">
            {footerLegalNav.map((nav) => (
              <Link
                key={nav.name}
                href={nav.href}
                className="inline rounded-none leading-6 text-primary/80 hover:text-primary whitespace-nowrap"
              >
                {nav.name}
              </Link>
            ))}
            <a
              href="#"
              onClick={() => (window as any).displayPreferenceModal()}
              className="inline rounded-none leading-6 text-primary/80 hover:text-primary"
              id="termly-consent-preferences"
            >
              Cookie Preferences
            </a>
          </div>
        </div>
        <span className="text-primary/80">
          {new Date().getFullYear()} © Cloud Flow Inc
        </span>
      </div>
    )
  }
}

const config: DocsThemeConfig = {
  logo: <AssistMeLogo />,
  feedback: {
    content: null,
  },
  main: MainContentWrapper,
  search: {
    placeholder: "Search...",
  },
  navbar: {
    component: <CheckHeaderParamsComponent />,
    extraContent: (
      <>
        <a
          className="p-1 hidden sm:inline-block hover:opacity-80"
          target="_blank"
          href="https://discord.gg/mvdPxf9e"
          aria-label="AssistMe Discord"
          rel="nofollow noreferrer"
        >
          <BsDiscord size={24} />
        </a>

        <a
          className="p-1 hidden sm:inline-block hover:opacity-80"
          target="_blank"
          href="https://x.com/assistmeai"
          aria-label="AssistMe X formerly known as Twitter"
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

        {/* <ToAppButton /> */}
      </>
    ),
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  footer: {
    component: <CheckFooterParamsComponent />
  },
  useNextSeoProps() {
    const { asPath } = useRouter();
    return {
      titleTemplate:
        asPath === "/"
          ? "AssistMe"
          : asPath.startsWith("/blog/")
            ? "%s - AssistMe Blog"
            : asPath.startsWith("/docs/guides/")
              ? "%s - AssistMe Guides"
              : "%s - AssistMe",
    };
  },
  head: () => {
    const { asPath, defaultLocale, locale } = useRouter();
    const { frontMatter, title: pageTitle } = useConfig();
    const url =
      "https://assistme.com" +
      (defaultLocale === locale ? asPath : `/${locale}${asPath}`);

    const description = frontMatter.description ?? "";

    const title = frontMatter.title ?? pageTitle;

    const section = asPath.startsWith("/docs")
      ? "Docs"
      : asPath.startsWith("/changelog/")
        ? "Changelog"
        : "";

    const image = frontMatter.ogImage
      ? "https://assistme.com" + frontMatter.ogImage
      : `https://assistme.com/api/og?title=${encodeURIComponent(
        title
      )}&description=${encodeURIComponent(
        description
      )}&section=${encodeURIComponent(section)}`;

    const video = frontMatter.ogVideo
      ? "https://assistme.com" + frontMatter.ogVideo
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
        <meta name="twitter:site:domain" content="AssistMe.com" />
        <meta name="twitter:url" content="https://AssistMe.com" />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        {/* <link
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
        /> */}
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
  //       <span className="sm:hidden">AssistMe won a Golden Kitty Award →</span>
  //       {/* desktop */}
  //       <span className="hidden sm:inline">
  //         AssistMe won a Golden Kitty Award in AI Infra →
  //       </span>
  //     </Link>
  //   ),
  // },
};

export default config;