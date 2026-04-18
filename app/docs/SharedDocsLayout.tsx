import type { ComponentProps, ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { DocsLayoutWrapper } from "./DocsLayoutWrapper";
import { SidebarShortcutItem } from "./SidebarShortcutItem";
import { NavbarDocs, DocsSecondaryNav, DocsSecondaryNavMobile } from "@/components/layout";
import { DocsPatternTracker } from "@/components/layout/DocsContentArea";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AISearch, AISearchPanel, FloatingAskAIButton } from "@/components/inkeep/search";
import { SidebarProvider } from "fumadocs-ui/components/sidebar/base";

/**
 * Shared wrapper used by all sidebar-based section layouts
 * (docs, guides, integrations, self-hosting, library).
 * Each layout only needs to pass the correct page tree.
 *
 * Renders two sticky headers:
 *  1. NavbarDocs    — 60px — logo + search + launch app
 *  2. DocsSecondaryNav — 40px — section tabs
 * Total header height is `calc(var(--lf-nav-primary-height) + var(--lf-nav-docs-secondary-height))`
 * on `.docs-chrome` as `--fd-nav-height` (see `src/overrides.css`) so fumadocs sticky offsets stay correct.
 */
export function SharedDocsLayout({
  tree,
  children,
}: {
  tree: ComponentProps<typeof DocsLayout>["tree"];
  children: ReactNode;
}) {
  return (
    <AISearch>
      <SidebarProvider>
        <div className="docs-chrome flex min-h-screen flex-col">
          <DocsPatternTracker />
          <NavbarDocs />
          <DocsSecondaryNav />
          <DocsLayoutWrapper>
            <DocsLayout
              tree={tree}
              githubUrl="https://github.com/langfuse/langfuse-docs"
              nav={{ component: <DocsSecondaryNavMobile /> }}
              sidebar={{ enabled: true, collapsible: false, components: { Item: SidebarShortcutItem } }}
              searchToggle={{ enabled: false }}
              themeSwitch={{ component: <div className="ms-auto"><ThemeToggle /></div> }}
            >
              <AISearchPanel />
              {children}
            </DocsLayout>
          </DocsLayoutWrapper>
        </div>
        <FloatingAskAIButton />
      </SidebarProvider>
    </AISearch>
  );
}
