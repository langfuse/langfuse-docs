import type { ComponentProps, ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { DocsLayoutWrapper } from "./DocsLayoutWrapper";
import { NavbarDocs, DocsSecondaryNav } from "@/components/layout";
import { DocsPatternTracker } from "@/components/layout/DocsContentArea";
import { ThemeToggle } from "@/components/ThemeToggle";

/**
 * Shared wrapper used by all sidebar-based section layouts
 * (docs, guides, integrations, self-hosting, library).
 * Each layout only needs to pass the correct page tree.
 *
 * Renders two sticky headers:
 *  1. NavbarDocs    — h-14 (3.5rem) — logo + search + launch app
 *  2. DocsSecondaryNav — h-11 (2.75rem) — section tabs
 * Total header = 6.25rem → set as --fd-nav-height so fumadocs
 * calculates sidebar sticky-top and mobile drawer offset correctly.
 */
export function SharedDocsLayout({
  tree,
  children,
}: {
  tree: ComponentProps<typeof DocsLayout>["tree"];
  children: ReactNode;
}) {
  return (
    <div className="docs-chrome flex min-h-screen flex-col">
      <DocsPatternTracker />
      <NavbarDocs />
      <DocsSecondaryNav />
      <DocsLayoutWrapper>
        <DocsLayout
          tree={tree}
          githubUrl="https://github.com/langfuse/langfuse-docs"
          nav={{ enabled: false }}
          sidebar={{ enabled: true }}
          searchToggle={{ enabled: false }}
          themeSwitch={{ component: <div className="ms-auto"><ThemeToggle /></div> }}
        >
          {children}
        </DocsLayout>
      </DocsLayoutWrapper>
    </div>
  );
}
