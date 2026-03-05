import { changelogSource } from "@/lib/source";
import { Layout } from "@/components/layout";
import { FluxLayoutNoPanel } from "@/components/layout/FluxLayoutNoPanel";

export default function ChangelogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout>
      <FluxLayoutNoPanel
        tree={changelogSource.getPageTree()}
        nav={{ enabled: false }}
        sidebar={{ enabled: false }}
        themeSwitch={{ enabled: false }}
        searchToggle={{ enabled: false }}
      >
        {children}
      </FluxLayoutNoPanel>
    </Layout>
  );
}
