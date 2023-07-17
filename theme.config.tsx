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
    defaultTheme: "light",
    forcedTheme: "light",
    storageKey: "nextra-theme-docs-color-mode",
  },
  project: {
    link: "https://github.com/finto-technologies/langfuse",
  },
  chat: {
    link: "https://discord.gg/7NXusRtqYU",
  },
  docsRepositoryBase:
    "https://github.com/finto-technologies/langfuse-docs/tree/main",
  footer: {
    text: (
      <div>
        <div className="mb-2">
          {footerNav.map((nav) => (
            <Link
              key={nav.name}
              href={nav.href}
              className="px-2 first-of-type:pl-0 border-l border-gray-500 first-of-type:border-l-0 rounded-none leading-6 text-gray-600 hover:text-gray-900"
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
      titleTemplate: asPath !== "/" ? "%s - langfuse" : "langfuse",
    };
  },
  head: () => {
    const { asPath, defaultLocale, locale } = useRouter();
    const { frontMatter } = useConfig();
    const url =
      "https://langfuse.com" +
      (defaultLocale === locale ? asPath : `/${locale}${asPath}`);

    return (
      <>
        <meta property="og:url" content={url} />
        <meta
          property="og:description"
          content={
            frontMatter.description ?? asPath !== "/"
              ? "langfuse documentation"
              : "Open-source observability for LLM applications"
          }
        />
        <meta property="og:image" content="https://langfuse.com/og.png" />
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
