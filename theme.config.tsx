import React from "react";
import { DocsThemeConfig, useConfig } from "nextra-theme-docs";
import { Logo } from "@/components/logo";
import { useRouter } from "next/router";
import Link from "next/link";
import { MainContentWrapper } from "./components/MainContentWrapper";

const footerNav = [
  { name: "Imprint", href: "/imprint" },
  { name: "Contact", href: "mailto:contact@langfuse.com" },
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
    link: "https://discord.gg/7NXusRtqYU",
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
    component: () => (
      <div className="flex justify-between flex-1 flex-wrap gap-2 max-w-[90rem] mx-auto text-sm py-8 px-6 border-t dark:border-t-neutral-800">
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
      frontMatter.description ?? "Open-source analytics for LLM applications";

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
  // banner: {
  //   key: "analytics",
  //   dismissible: false,
  //   text: (
  //     <a href="/analytics" target="_blank">
  //       <span className="sm:hidden">Soon: 📈 LLM Analytics →</span>
  //       <span className="hidden sm:inline">
  //         Coming soon: 📈 Langfuse LLM Analytics →
  //       </span>
  //     </a>
  //   ),
  // },
};

export default config;
