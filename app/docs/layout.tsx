import { source } from "@/lib/source";
import { SharedDocsLayout } from "./SharedDocsLayout";

export default function DocsPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SharedDocsLayout tree={source.getPageTree()}>{children}</SharedDocsLayout>;
}
