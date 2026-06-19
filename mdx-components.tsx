import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import React from "react";
import dynamic from "next/dynamic";
import { Mermaid } from "@/components/Mermaid";
import { Image } from "@/components/ui/image";
import { Frame } from "@/components/Frame";
import { LangTab, LangTabs, LangTabsWithTab } from "@/components/LangTabs";
import { FetchReadme } from "@/components/FetchReadme";
import {
  Cards,
  Card,
  Steps,
  FileTree,
  FileTreeFile,
  FileTreeFolder,
  Playground,
} from "@/components/docs";
import { AvailabilityBanner } from "@/components/Availability";
import { Link as MdxLink, type LinkProps } from "@/components/ui/link";
import { Callout } from "@/components/ui/callout";
import { Table } from "@/components/ui/table";
import { LoopDiagram } from "@/components/academy/LoopDiagram";
import { OnlineLoop, OfflineLoop } from "@/components/academy/LoopSubset";
import { EvaluationEvolutionDiagram } from "@/components/academy/EvaluationEvolutionDiagram";
import { TracingHierarchyDiagram } from "@/components/academy/TracingHierarchyDiagram";
import { RagTraceViewDiagram } from "@/components/academy/RagTraceViewDiagram";
import { DatasetFieldsDiagram } from "@/components/academy/DatasetFieldsDiagram";
import { ErrorAnalysisProcessDiagram } from "@/components/academy/ErrorAnalysisProcessDiagram";
import { AnnotatedLoop } from "@/components/academy/AnnotatedLoop";
import { DatasetBlock } from "@/components/academy/DatasetBlock";
import { EvaluatorBlock } from "@/components/academy/EvaluatorBlock";
import { TraceViewDiagram } from "@/components/academy/TraceViewDiagram";
import { AgentPromptCallout } from "@/components/academy/AgentPromptCallout";
import { ManualGuideCallout } from "@/components/academy/ManualGuideCallout";
import { ManualGuideList } from "@/components/academy/ManualGuideList";
import { LoopDiagram as LoopDiagramJa } from "@/components/academy/japan/LoopDiagram";
import {
  OnlineLoop as OnlineLoopJa,
  OfflineLoop as OfflineLoopJa,
} from "@/components/academy/japan/LoopSubset";
import { EvaluationEvolutionDiagram as EvaluationEvolutionDiagramJa } from "@/components/academy/japan/EvaluationEvolutionDiagram";
import { TracingHierarchyDiagram as TracingHierarchyDiagramJa } from "@/components/academy/japan/TracingHierarchyDiagram";
import { RagTraceViewDiagram as RagTraceViewDiagramJa } from "@/components/academy/japan/RagTraceViewDiagram";
import { DatasetFieldsDiagram as DatasetFieldsDiagramJa } from "@/components/academy/japan/DatasetFieldsDiagram";
import { ErrorAnalysisProcessDiagram as ErrorAnalysisProcessDiagramJa } from "@/components/academy/japan/ErrorAnalysisProcessDiagram";
import { AgentPromptCallout as AgentPromptCalloutJa } from "@/components/academy/japan/AgentPromptCallout";
import { ManualGuideCallout as ManualGuideCalloutJa } from "@/components/academy/japan/ManualGuideCallout";
import { Details, Summary } from "@/components/Details";

// Lazy-load Video so @vidstack/react (~800 KB) is NOT bundled on every MDX page.
// It only downloads on pages that actually render a <Video> tag.
const Video = dynamic(() =>
  import("@/components/Video").then((m) => ({ default: m.Video })),
);

const BLOCK_TAGS = new Set([
  "div",
  "details",
  "summary",
  "figure",
  "pre",
  "table",
  "ul",
  "ol",
  "blockquote",
  "section",
  "article",
]);

function MdxParagraph({
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const childrenArray = React.Children.toArray(children);

  const hasBlock = childrenArray.some(
    (child) =>
      React.isValidElement(child) &&
      typeof child.type === "string" &&
      BLOCK_TAGS.has(child.type),
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
    LoopDiagram,
    OnlineLoop,
    OfflineLoop,
    EvaluationEvolutionDiagram,
    TracingHierarchyDiagram,
    RagTraceViewDiagram,
    DatasetFieldsDiagram,
    ErrorAnalysisProcessDiagram,
    AnnotatedLoop,
    DatasetBlock,
    EvaluatorBlock,
    TraceViewDiagram,
    AgentPromptCallout,
    ManualGuideCallout,
    ManualGuideList,
    LoopDiagramJa,
    OnlineLoopJa,
    OfflineLoopJa,
    EvaluationEvolutionDiagramJa,
    TracingHierarchyDiagramJa,
    RagTraceViewDiagramJa,
    DatasetFieldsDiagramJa,
    ErrorAnalysisProcessDiagramJa,
    AgentPromptCalloutJa,
    ManualGuideCalloutJa,
    details: Details,
    summary: Summary,
    ...components,
  };
}

export function useMDXComponents(components?: MDXComponents): MDXComponents {
  return getMDXComponents(components);
}
