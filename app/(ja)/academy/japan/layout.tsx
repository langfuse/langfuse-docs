import { academyJaSource } from "@/lib/source";
import { SharedDocsLayout } from "@/components/layout";

export default function JaAcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SharedDocsLayout tree={academyJaSource.getPageTree()}>
      {children}
    </SharedDocsLayout>
  );
}
