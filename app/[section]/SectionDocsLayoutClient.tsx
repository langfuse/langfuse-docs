"use client";

import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { MainContentWrapper } from "@/components/MainContentWrapper";
import { MenuSwitcher } from "@/components/MenuSwitcher";
import { MARKETING_SECTION_SLUGS } from "@/lib/sections";
import type { ReactNode } from "react";
import type * as PageTree from "fumadocs-core/page-tree";

const WIDE_SECTIONS = new Set([
  "pricing",
  "pricing-self-host",
  "talk-to-us",
  "enterprise",
  "startups",
]);

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
      renderNavigationPanel={isMarketing ? () => null : undefined}
    >
      <div
        className={`mx-auto ${WIDE_SECTIONS.has(section) ? "max-w-7xl" : "max-w-4xl"}`}
      >
        <MainContentWrapper>{children}</MainContentWrapper>
      </div>
    </DocsLayout>
  );
}
