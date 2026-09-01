import { resourcesSource } from "@/lib/source";
import { SharedDocsLayout } from "@/components/layout";

// SEO/GEO resources hub (e.g. /resources/engineering). Reachable mainly via
// search, so it uses the compact docs chrome (no section tabs) rather than
// appearing in the primary DocsSecondaryNav navigation.
export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SharedDocsLayout
      tree={resourcesSource.getPageTree()}
      showSecondaryNav={false}
      sectionLabel="Resources"
    >
      {children}
    </SharedDocsLayout>
  );
}
