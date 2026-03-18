import { librarySource, getPageTreeWithShortTitles } from "@/lib/source";
import { SharedDocsLayout } from "@/app/docs/SharedDocsLayout";

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SharedDocsLayout tree={getPageTreeWithShortTitles(librarySource, "/library")}>{children}</SharedDocsLayout>;
}
