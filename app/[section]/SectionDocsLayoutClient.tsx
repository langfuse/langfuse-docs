"use client";

import { DocsLayout } from "fumadocs-ui/layouts/flux";
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

export function SectionDocsLayoutClient({ tree, section, children }: Props) {
  const isMarketing = MARKETING_SECTION_SLUGS.has(
    section as Parameters<typeof MARKETING_SECTION_SLUGS.has>[0]
  );
  return (
    <DocsLayout
      tree={tree}
      nav={{ enabled: false }}
      sidebar={
        isMarketing
          ? { enabled: false }
          : { banner: <MenuSwitcher /> }
      }
    >
      <div
        className={`mx-auto w-full ${WIDE_SECTIONS.has(section) ? "max-w-7xl" : "max-w-4xl"}`}
      >
        <MainContentWrapper>{children}</MainContentWrapper>
      </div>
    </DocsLayout>
  );
}
