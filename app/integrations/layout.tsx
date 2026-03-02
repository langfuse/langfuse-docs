import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { integrationsSource } from "@/lib/source";
import { DocsLayoutWrapper } from "@/app/docs/DocsLayoutWrapper";
import { Layout } from "@/components/layout";
import { MenuSwitcher } from "@/components/MenuSwitcher";

export default function IntegrationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout>
      <DocsLayoutWrapper>
        <DocsLayout
          tree={integrationsSource.getPageTree()}
          githubUrl="https://github.com/langfuse/langfuse-docs"
          nav={{ enabled: false }}
          sidebar={{ banner: <MenuSwitcher /> }}
        >
          {children}
        </DocsLayout>
      </DocsLayoutWrapper>
    </Layout>
  );
}
