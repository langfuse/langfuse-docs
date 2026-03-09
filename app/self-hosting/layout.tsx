import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { getSelfHostingPageTree } from "@/lib/source";
import { DocsLayoutWrapper } from "@/app/docs/DocsLayoutWrapper";
import { Layout } from "@/components/layout";
import { MenuSwitcher } from "@/components/MenuSwitcher";

export default function SelfHostingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout>
      <DocsLayoutWrapper>
        <DocsLayout
          tree={getSelfHostingPageTree()}
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
