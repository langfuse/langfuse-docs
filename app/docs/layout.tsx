import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { source } from "@/lib/source";
import { DocsLayoutWrapper } from "./DocsLayoutWrapper";
import { Layout } from "@/components/layout";
import { MenuSwitcher } from "@/components/MenuSwitcher";

export default function DoscPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout>
      <DocsLayoutWrapper>
        <DocsLayout
          tree={source.getPageTree()}
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
