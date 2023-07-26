import React from "react";
import { DocsThemeConfig, useConfig } from "nextra-theme-docs";
import { Logo } from "@/components/logo";
import { useRouter } from "next/router";
import Link from "next/link";

const footerNav = [
  { name: "Imprint", href: "/imprint" },
  { name: "Contact", href: "mailto:contact@langfuse.com" },
];

const config: DocsThemeConfig = {
  logo: <Logo />,
  darkMode: false,
  nextThemes: {
    defaultTheme: "dark",
    forcedTheme: "dark",
    storageKey: "nextra-theme-docs-color-mode",
  },
  project: {
    link: "https://github.com/langfuse/langfuse",
  },
  chat: {
    link: "https://discord.gg/7NXusRtqYU",
  },
  docsRepositoryBase: "https://github.com/langfuse/langfuse-docs/tree/main",
  footer: {
    text: (
      <div className="flex flex-col items-center md:items-start">
        <div className="mb-2">
          {footerNav.map((nav) => (
            <Link
              key={nav.name}
              href={nav.href}
              className="px-2 first-of-type:pl-0 border-l border-gray-500 first-of-type:border-l-0 rounded-none leading-6 hover:text-gray-100"
            >
              {nav.name}
            </Link>
          ))}
        </div>
        <span>MIT {new Date().getFullYear()} © Finto Technologies GmbH</span>
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
