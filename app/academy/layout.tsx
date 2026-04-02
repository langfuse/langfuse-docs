import { academySource, getPageTreeWithShortTitles } from "@/lib/source";
import { SharedDocsLayout } from "@/app/docs/SharedDocsLayout";

export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SharedDocsLayout tree={getPageTreeWithShortTitles(academySource, "/academy")}>{children}</SharedDocsLayout>;
}
