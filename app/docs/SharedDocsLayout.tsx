import type { ComponentProps, ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { DocsLayoutWrapper } from "./DocsLayoutWrapper";
import { Layout } from "@/components/layout";
import { MenuSwitcher } from "@/components/MenuSwitcher";

/**
 * Shared wrapper used by all sidebar-based section layouts
 * (docs, guides, integrations, self-hosting, library).
 * Each layout only needs to pass the correct page tree.
 */
export function SharedDocsLayout({
  tree,
  children,
}: {
  tree: ComponentProps<typeof DocsLayout>["tree"];
  children: ReactNode;
}) {
  return (
    <Layout>
      <DocsLayoutWrapper>
        <DocsLayout
          tree={tree}
          githubUrl="https://github.com/langfuse/langfuse-docs"
          nav={{ enabled: false }}
          sidebar={{ banner: <MenuSwitcher /> }}
          searchToggle={{ enabled: false }}
        >
          {children}
        </DocsLayout>
      </DocsLayoutWrapper>
    </Layout>
  );
}
