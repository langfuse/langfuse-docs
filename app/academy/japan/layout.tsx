import { academyJaSource } from "@/lib/source";
import { SharedDocsLayout } from "@/components/layout";
import { DocumentLanguage } from "@/components/DocumentLanguage";

export default function JaAcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SharedDocsLayout tree={academyJaSource.getPageTree()}>
      <DocumentLanguage lang="ja" />
      {children}
    </SharedDocsLayout>
  );
}
