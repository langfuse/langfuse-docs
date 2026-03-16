import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import React from "react";
import dynamic from "next/dynamic";
import { Mermaid } from "@/components/Mermaid";
import NextImage from "next/image";
import { Frame } from "@/components/Frame";
import { LangTabs } from "@/components/LangTabs";
import { FetchReadme } from "@/components/FetchReadme";
import { Callout, Tabs, Tab, Cards, Card, Steps, FileTree, FileTreeFile, FileTreeFolder } from "@/lib/nextra-shim/components";
import { MdxDetails, MdxSummary } from "@/components/MdxDetails";
import { AvailabilityBanner } from "@/components/availability";

// Lazy-load Video so @vidstack/react (~800 KB) is NOT bundled on every MDX page.
// It only downloads on pages that actually render a <Video> tag.
const Video = dynamic(() => import("@/components/Video").then((m) => ({ default: m.Video })));

const BLOCK_TAGS = new Set([
  "div", "details", "summary", "figure", "pre", "table",
  "ul", "ol", "blockquote", "section", "article",
]);

function MdxParagraph({ children, ...props }: React.HTMLAttributes<HTMLElement>) {
  const childrenArray = React.Children.toArray(children);

  // If children contain MdxSummary, render without any wrapping element.
  // <summary> MUST be a direct child of <details> for the browser to recognize it
  // as the disclosure widget. React does not auto-correct invalid DOM nesting
  // the way the HTML parser does, so a <p> or <div> wrapping <summary> keeps it trapped.
  const hasSummary = childrenArray.some(
    (child) => React.isValidElement(child) && child.type === MdxSummary
  );
  if (hasSummary) {
    return <>{children}</>;
  }

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

function MdxImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const { src, alt, width, height, ...rest } = props;
  if (!src) return null;
  if (width && height) {
    return (
      <NextImage
        src={src}
        alt={alt ?? ""}
        width={Number(width)}
        height={Number(height)}
        {...(rest as object)}
      />
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt ?? ""} {...rest} />;
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    img: MdxImage,
    p: MdxParagraph,
    Frame,
    Video,
    LangTabs,
    Callout,
    Tabs,
    Tab,
    "Tabs.Tab": Tab,
    Cards,
    Card,
    "Cards.Card": Card,
    Steps,
    FileTree,
    "FileTree.File": FileTreeFile,
    "FileTree.Folder": FileTreeFolder,
    FetchReadme,
    details: MdxDetails,
    summary: MdxSummary,
    AvailabilityBanner,
    Mermaid,
    ...components,
  };
}

export function useMDXComponents(components?: MDXComponents): MDXComponents {
  return getMDXComponents(components);
}
