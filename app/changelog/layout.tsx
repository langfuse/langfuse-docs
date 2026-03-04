import { DocsLayout } from "fumadocs-ui/layouts/flux";
import { changelogSource } from "@/lib/source";
import { Layout } from "@/components/layout";

export default function ChangelogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout>
      <DocsLayout
        tree={changelogSource.getPageTree()}
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
