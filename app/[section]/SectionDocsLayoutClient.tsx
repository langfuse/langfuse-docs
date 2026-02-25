"use client";

import { DocsLayout } from "fumadocs-ui/layouts/flux";
import { MainContentWrapper } from "@/components/MainContentWrapper";
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
  return (
    <DocsLayout
      tree={tree}
      nav={{ enabled: false }}
      sidebar={{ enabled: false }}
      renderNavigationPanel={() => null}
    >
      <div
        className={`mx-auto ${WIDE_SECTIONS.has(section) ? "max-w-7xl" : "max-w-4xl"}`}
      >
        <MainContentWrapper>{children}</MainContentWrapper>
      </div>
    </DocsLayout>
  );
}
