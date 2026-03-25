import { source, getPageTreeWithShortTitles } from "@/lib/source";
import { SharedDocsLayout } from "./SharedDocsLayout";

export default function DocsPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SharedDocsLayout tree={getPageTreeWithShortTitles(source, "/docs")}>{children}</SharedDocsLayout>;
}
