import { DocsLayout } from "fumadocs-ui/layouts/flux";
import { blogSource } from "@/lib/source";
import { Layout } from "@/components/layout";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout>
      <DocsLayout
        tree={blogSource.getPageTree()}
        nav={{ enabled: false }}
        sidebar={{ enabled: false }}
        themeSwitch={{ enabled: false }}
        searchToggle={{ enabled: false }}
      >
        {children}
      </DocsLayout>
    </Layout>
  );
}
