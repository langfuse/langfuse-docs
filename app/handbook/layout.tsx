import { handbookSource } from "@/lib/source";
import { SharedDocsLayout } from "@/components/layout";

export default function HandbookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SharedDocsLayout tree={handbookSource.getPageTree()} showSecondaryNav={false}>
      {children}
    </SharedDocsLayout>
  );
}
