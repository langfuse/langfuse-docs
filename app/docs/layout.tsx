import { source } from "@/lib/source";
import { SharedDocsLayout } from "@/components/layout";

export default function DocsPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SharedDocsLayout tree={source.getPageTree()}>{children}</SharedDocsLayout>;
}
