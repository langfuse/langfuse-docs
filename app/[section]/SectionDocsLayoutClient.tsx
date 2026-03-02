"use client";

import { DocsLayout as DocsLayoutFlux } from "fumadocs-ui/layouts/flux";
import { DocsLayout as DocsLayoutDocs } from "fumadocs-ui/layouts/docs";
import { SidebarProvider } from "fumadocs-ui/components/sidebar/base";
import { MainContentWrapper } from "@/components/MainContentWrapper";
import { MenuSwitcher } from "@/components/MenuSwitcher";
import { MARKETING_SECTION_SLUGS, WIDE_SECTIONS } from "@/lib/sections";
import type { ReactNode } from "react";
import type * as PageTree from "fumadocs-core/page-tree";

type Props = {
  tree: PageTree.Root;
  section: string;
  children: ReactNode;
};

const contentWrapperClass = (section: string) =>
  `mx-auto w-full ${WIDE_SECTIONS.has(section) ? "max-w-7xl" : "max-w-4xl"}`;

/** Layout for sections under [section]. Integrations, self-hosting, guides, library use their own app routes (same as docs). */
export function SectionDocsLayoutClient({ tree, section, children }: Props) {
  const isWide = WIDE_SECTIONS.has(section);
  const isMarketing = MARKETING_SECTION_SLUGS.has(
    section as Parameters<typeof MARKETING_SECTION_SLUGS.has>[0]
  );

  // Marketing: docs layout for consistent styling, no sidebar, no TOC (TOC disabled in page).
  // Full-width wrapper + centered content so it matches docs grid (centered main column).
  if (isMarketing) {
    return (
      <div style={{ ["--fd-banner-height" as string]: "63px" }}>
        <SidebarProvider>
          <DocsLayoutDocs
            tree={tree}
            githubUrl="https://github.com/langfuse/langfuse-docs"
            nav={{ enabled: false }}
            sidebar={{ enabled: false }}
          >
            <div className="w-full min-w-0 flex justify-center [grid-area:main]">
              <div className={contentWrapperClass(section)}>
                <MainContentWrapper>{children}</MainContentWrapper>
              </div>
            </div>
          </DocsLayoutDocs>
        </SidebarProvider>
      </div>
    );
  }

  return (
    <DocsLayoutFlux
      tree={tree}
      nav={{ enabled: false }}
      sidebar={isWide ? { enabled: false } : { banner: <MenuSwitcher /> }}
      renderNavigationPanel={isWide ? () => null : undefined}
    >
      <div className={contentWrapperClass(section)}>
        <MainContentWrapper>{children}</MainContentWrapper>
      </div>
    </DocsLayoutFlux>
  );
}
