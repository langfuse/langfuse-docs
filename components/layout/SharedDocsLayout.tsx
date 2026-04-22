import type { ComponentProps, ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { DocsLayoutWrapper } from "./DocsLayoutWrapper";
import { NavbarDocs } from "./NavbarDocs";
import { DocsSecondaryNav, DocsSecondaryNavMobile } from "./DocsSecondaryNav";
import { DocsPatternTracker } from "./DocsContentArea";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AISearch, AISearchPanel, FloatingAskAIButton } from "@/components/inkeep/search";
import { SidebarFolderItem } from "@/components/docs-sidebar/SidebarFolderItem";
import { SidebarItem } from "@/components/docs-sidebar/SidebarItem";
import { SidebarSeparatorItem } from "@/components/docs-sidebar/SidebarSeparatorItem";

/**
 * Shared wrapper used by all sidebar-based section layouts
 * (docs, guides, integrations, self-hosting, library, handbook, security).
 * Each layout only needs to pass the correct page tree.
 *
 * Renders two sticky headers by default:
 *  1. NavbarDocs        — 60px — logo + search + launch app
 *  2. DocsSecondaryNav  — 40px — section tabs
 * Total header height is `calc(var(--lf-nav-primary-height) + var(--lf-nav-docs-secondary-height))`
 * on `.docs-chrome` as `--fd-nav-height` (see `src/overrides.css`) so fumadocs sticky offsets stay correct.
 *
 * Pass `showSecondaryNav={false}` for sections that aren't in the DocsSecondaryNav
 * tabs (e.g. handbook, security). The root gets a `docs-chrome-compact` modifier
 * that resets `--fd-nav-height` back to the primary bar only.
 */
export function SharedDocsLayout({
  tree,
  children,
  showSecondaryNav = true,
}: {
  tree: ComponentProps<typeof DocsLayout>["tree"];
  children: ReactNode;
  showSecondaryNav?: boolean;
}) {
  return (
    <AISearch>
      <div
        className={
          showSecondaryNav
            ? "docs-chrome flex min-h-screen flex-col"
            : "docs-chrome docs-chrome-compact flex min-h-screen flex-col"
        }
        style={
          showSecondaryNav
            ? ({ "--lf-nav-docs-secondary-height": "40px" } as React.CSSProperties)
            : undefined
        }
      >
        <DocsPatternTracker />
        <NavbarDocs />
        {showSecondaryNav && <DocsSecondaryNav />}
        <DocsLayoutWrapper>
          <DocsLayout
            tree={tree}
            githubUrl="https://github.com/langfuse/langfuse-docs"
            nav={{ component: <DocsSecondaryNavMobile /> }}
            sidebar={{
              enabled: true,
              collapsible: false,
              components: { Item: SidebarItem, Separator: SidebarSeparatorItem, Folder: SidebarFolderItem },
            }}
            searchToggle={{ enabled: false }}
            themeSwitch={{ component: <div className="ms-auto"><ThemeToggle /></div> }}
          >
            <AISearchPanel />
            {children}
          </DocsLayout>
        </DocsLayoutWrapper>
      </div>
      <FloatingAskAIButton />
    </AISearch>
  );
}
