import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { DocsLayoutWrapper } from "./DocsLayoutWrapper";
import { NavbarDocs } from "./NavbarDocs";
import { DocsSecondaryNav, DocsSecondaryNavMobile } from "./DocsSecondaryNav";
import { DocsPatternTracker } from "./DocsContentArea";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  AISearch,
  AISearchPanel,
  FloatingAskAI,
} from "@/components/inkeep/search";
import { SidebarFolderItem } from "@/components/docs-sidebar/SidebarFolderItem";
import { SidebarFolderDeepLinkHandler } from "@/components/docs-sidebar/SidebarFolderDeepLinkHandler";
import { SidebarItem } from "@/components/docs-sidebar/SidebarItem";
import { SidebarSeparatorItem } from "@/components/docs-sidebar/SidebarSeparatorItem";
import { Banner } from "./Banner";

/**
 * Fumadocs' docs container sets `--fd-docs-row-1` inline to
 * `var(--fd-banner-height, 0px)` (chrome above the layout). Our primary +
 * secondary bars also sit above `#nd-docs-layout`, so we replace that value
 * via `containerProps` — the same API Fumadocs already spreads onto the
 * layout root after its defaults.
 *
 * `--fd-nav-height` is owned by `.docs-chrome` (see `src/overrides.css`).
 */
const docsLayoutTokens = {
  "--fd-docs-row-1":
    "calc(var(--fd-nav-height) + var(--fd-banner-height, 0px))",
} as CSSProperties;

/**
 * Shared wrapper used by all sidebar-based section layouts
 * (docs, guides, integrations, self-hosting, library, handbook, security).
 * Each layout only needs to pass the correct page tree.
 *
 * Renders two sticky headers by default:
 *  1. NavbarDocs        — 60px — logo + search + launch app
 *  2. DocsSecondaryNav  — 40px — section tabs
 * Total header height is `--fd-nav-height` on `.docs-chrome`, then mapped
 * into Fumadocs as `--fd-docs-row-1` so sidebar / TOC sticky offsets match.
 *
 * Pass `showSecondaryNav={false}` for sections that aren't in the DocsSecondaryNav
 * tabs (e.g. handbook, security). The root gets a `docs-chrome-compact` modifier
 * that collapses `--fd-nav-height` to the primary bar on desktop. The mobile
 * hamburger / breadcrumb bar still renders via `nav.component`.
 */
export function SharedDocsLayout({
  tree,
  children,
  showSecondaryNav = true,
  sectionLabel,
}: {
  tree: ComponentProps<typeof DocsLayout>["tree"];
  children: ReactNode;
  showSecondaryNav?: boolean;
  sectionLabel?: string;
}) {
  return (
    <AISearch>
      <div
        className={
          showSecondaryNav
            ? "docs-chrome flex min-h-screen flex-col"
            : "docs-chrome docs-chrome-compact flex min-h-screen flex-col"
        }
      >
        <SidebarFolderDeepLinkHandler />
        <DocsPatternTracker />
        <Banner />
        <NavbarDocs sectionLabel={sectionLabel} />
        {showSecondaryNav && <DocsSecondaryNav />}
        <DocsLayoutWrapper>
          <DocsLayout
            tree={tree}
            githubUrl="https://github.com/langfuse/langfuse-docs"
            containerProps={{ style: docsLayoutTokens }}
            nav={{ component: <DocsSecondaryNavMobile /> }}
            sidebar={{
              enabled: true,
              collapsible: false,
              components: {
                Item: SidebarItem,
                Separator: SidebarSeparatorItem,
                Folder: SidebarFolderItem,
              },
            }}
            searchToggle={{ enabled: false }}
            themeSwitch={{
              component: (
                <div className="ms-auto">
                  <ThemeToggle />
                </div>
              ),
            }}
          >
            <AISearchPanel />
            {children}
          </DocsLayout>
        </DocsLayoutWrapper>
      </div>
      <FloatingAskAI />
    </AISearch>
  );
}
