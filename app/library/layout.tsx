import { librarySource } from "@/lib/source";
import { SharedDocsLayout } from "@/components/layout";

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SharedDocsLayout tree={librarySource.getPageTree()}>{children}</SharedDocsLayout>;
}
