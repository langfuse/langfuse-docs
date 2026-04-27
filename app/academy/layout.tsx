import { academySource } from "@/lib/source";
import { SharedDocsLayout } from "@/components/layout";

export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SharedDocsLayout tree={academySource.getPageTree()}>{children}</SharedDocsLayout>;
}
