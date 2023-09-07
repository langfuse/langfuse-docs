import React from "react";
import { DocsThemeConfig, useConfig } from "nextra-theme-docs";
import { Logo } from "@/components/logo";
import { useRouter } from "next/router";
import Link from "next/link";
import { MainContentWrapper } from "./components/MainContentWrapper";

const footerNav = [
  { name: "Contact", href: "mailto:contact@langfuse.com" },
  { name: "Imprint", href: "/imprint" },
  {
    name: "Terms",
    href: "https://app.termly.io/document/terms-of-service/baf80a2e-dc67-46de-9ca8-2f7457179c32",
  },
  {
    name: "Privacy",
    href: "https://app.termly.io/document/privacy-policy/47905712-56e1-4ad0-9bb7-8958f3263f90",
  },
];

const config: DocsThemeConfig = {
  logo: <Logo />,
  feedback: {
    content: null,
  },
  main: MainContentWrapper,
  project: {
    link: "https://github.com/langfuse/langfuse",
    icon: (
      <img
        alt="Langfuse Github stars"
        src="https://img.shields.io/github/stars/langfuse/langfuse?label=langfuse&style=social"
      />
    ),
  },
  chat: {
    link: "https://langfuse.com/discord",
  },
  search: {
    placeholder: "Search...",
  },
  navbar: {
    extraContent: (
      <a
        className="p-2"
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
    ),
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  docsRepositoryBase: "https://github.com/langfuse/langfuse-docs/tree/main",
  footer: {
    text: (
      <div className="flex justify-between flex-1 flex-wrap gap-2 text-sm">
        <span className="text-primary/80">
          MIT {new Date().getFullYear()} © Finto Technologies GmbH
        </span>
        <span>
          {footerNav.map((nav) => (
            <Link
              key={nav.name}
              href={nav.href}
              className="inline px-2 first-of-type:pl-0 border-l first-of-type:border-l-0 rounded-none leading-6 text-primary/80 hover:text-primary"
            >
              {nav.name}
            </Link>
          ))}
          <a
            href="#"
            onClick={() => (window as any).displayPreferenceModal()}
            className="inline px-2 first-of-type:pl-0 border-l first-of-type:border-l-0 rounded-none leading-6 text-primary/80 hover:text-primary"
            id="termly-consent-preferences"
          >
            Cookie Preferences
          </a>
        </span>
      </div>
    ),
  },
  useNextSeoProps() {
    const { asPath } = useRouter();
    return {
      titleTemplate:
        asPath === "/"
          ? "Langfuse"
          : asPath.startsWith("/blog/")
          ? "%s - Langfuse Blog"
          : asPath.startsWith("/docs/guides/")
          ? "%s - Langfuse Guides"
          : "%s - Langfuse",
    };
  },
  head: () => {
    const { asPath, defaultLocale, locale } = useRouter();
    const { frontMatter } = useConfig();
    const url =
      "https://langfuse.com" +
      (defaultLocale === locale ? asPath : `/${locale}${asPath}`);

    const description =
      frontMatter.description ?? "Open source analytics for LLM applications";

    const image = frontMatter.ogImage
      ? "https://langfuse.com" + frontMatter.ogImage
      : "https://langfuse.com/og.png";

    return (
      <>
        <meta name="theme-color" content="#000" />
        <meta property="og:url" content={url} />
        <meta httpEquiv="Content-Language" content="en" />

        <meta name="description" content={description} />
        <meta property="og:description" content={description} />

        <meta property="og:image" content={image} />
        <meta property="twitter:image" content={image} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site:domain" content="langfuse.com" />
        <meta name="twitter:url" content="https://langfuse.com" />
      </>
    );
  },
  // Fix formatting for lists; remote mt-6
  components: {
    ul: (props: { children: React.ReactNode }) => (
      <ul className="list-disc ltr:ml-6 rtl:mr-6">{props.children}</ul>
    ),
    ol: (props: { children: React.ReactNode }) => (
      <ol className="list-decimal ltr:ml-6 rtl:mr-6">{props.children}</ol>
    ),
  },
  faviconGlyph: "🪢",
  banner: {
    key: "demo",
    dismissible: true,
    text: (
      <Link href="/docs/demo">
        <span className="sm:hidden">Check out live demo →</span>
        <span className="hidden sm:inline">
          Want to see Langfuse in action? Check out the live demo →
        </span>
      </Link>
    ),
  },
};

export default config;
