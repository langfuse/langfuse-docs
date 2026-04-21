import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import React from "react";
import dynamic from "next/dynamic";
import { Mermaid } from "@/components/Mermaid";
import { Image } from "@/components/ui/image";
import { Frame } from "@/components/Frame";
import { LangTab, LangTabs, LangTabsWithTab } from "@/components/LangTabs";
import { FetchReadme } from "@/components/FetchReadme";
import { Cards, Card, Steps, FileTree, FileTreeFile, FileTreeFolder, Playground } from "@/components/docs";
import { AvailabilityBanner } from "@/components/Availability";
import { Link as MdxLink, type LinkProps } from "@/components/ui/link";
import { Callout } from "@/components/ui/callout";
import { Table } from "@/components/ui/table";

// Lazy-load Video so @vidstack/react (~800 KB) is NOT bundled on every MDX page.
// It only downloads on pages that actually render a <Video> tag.
const Video = dynamic(() => import("@/components/Video").then((m) => ({ default: m.Video })));

const BLOCK_TAGS = new Set([
  "div", "details", "summary", "figure", "pre", "table",
  "ul", "ol", "blockquote", "section", "article",
]);

function MdxParagraph({ children, ...props }: React.HTMLAttributes<HTMLElement>) {
  const childrenArray = React.Children.toArray(children);

  const hasBlock = childrenArray.some(
    (child) =>
      React.isValidElement(child) &&
      typeof child.type === "string" &&
      BLOCK_TAGS.has(child.type)
  );
  if (hasBlock) {
    return <div {...props}>{children}</div>;
  }
  return <p {...props}>{children}</p>;
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    a: (props: LinkProps) => <MdxLink variant="underline" {...props} />,
    img: Image,
    p: MdxParagraph,
    Frame,
    Video,
    LangTabs,
    Callout,
    Tabs: LangTabsWithTab,
    Tab: LangTab,
    table: Table,
    Cards,
    Card,
    "Cards.Card": Card,
    Steps,
    FileTree,
    "FileTree.File": FileTreeFile,
    "FileTree.Folder": FileTreeFolder,
    FetchReadme,
    AvailabilityBanner,
    Mermaid,
    Playground,
    ...components,
  };
}

export function useMDXComponents(components?: MDXComponents): MDXComponents {
  return getMDXComponents(components);
}
