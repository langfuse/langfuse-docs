import { workshopSource } from "@/lib/source";
import { SharedDocsLayout } from "@/components/layout";

export default function WorkshopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SharedDocsLayout
      tree={workshopSource.getPageTree()}
      sectionLabel="Workshop"
    >
      {children}
    </SharedDocsLayout>
  );
}
