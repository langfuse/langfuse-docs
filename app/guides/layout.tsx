import { guidesSource } from "@/lib/source";
import { SharedDocsLayout } from "@/components/layout";

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SharedDocsLayout tree={guidesSource.getPageTree()}>{children}</SharedDocsLayout>;
}
