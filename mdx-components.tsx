import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { Frame } from "@/components/Frame";
import { Video } from "@/components/Video";
import { LangTabs } from "@/components/LangTabs";
import { FetchReadme } from "@/components/FetchReadme";
import { Callout, Tabs, Tab, Cards } from "@/lib/nextra-shim/components";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Frame,
    Video,
    LangTabs,
    Callout,
    Tabs,
    Tab,
    Cards,
    Card: Cards.Card,
    FetchReadme,
    ...components,
  };
}

export function useMDXComponents(components?: MDXComponents): MDXComponents {
  return getMDXComponents(components);
}
