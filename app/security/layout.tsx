import { securitySource } from "@/lib/source";
import { SharedDocsLayout } from "@/components/layout";

export default function SecurityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SharedDocsLayout tree={securitySource.getPageTree()} showSecondaryNav={false}>
      {children}
    </SharedDocsLayout>
  );
}
