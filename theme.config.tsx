import React from "react";
import { DocsThemeConfig, useConfig } from "nextra-theme-docs";
import { Logo } from "./components/logo";
import { useRouter } from "next/router";

const config: DocsThemeConfig = {
  logo: <Logo />,
  project: {
    link: "https://github.com/finto-technologies/langfuse",
  },
  chat: {
    link: "https://discord.com/invite/DNDAarxE",
  },
  docsRepositoryBase:
    "https://github.com/finto-technologies/langfuse-docs/tree/main",
  footer: {
    text: "langfuse",
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
              : "open-source tracing and feedback collection for LLM applications"
          }
        />
        <meta property="og:image" content="https://langfuse.com/og.png" />
        <script
          async
          defer
          data-website-id="39e22d92-2b6d-480d-bbba-28549a348027"
          src="https://umami.langfuse.com/umm.js"
        ></script>
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
};

export default config;
