import { selfHostingSource } from "@/lib/source";
import { SharedDocsLayout } from "@/components/layout";

export default function SelfHostingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SharedDocsLayout tree={selfHostingSource.getPageTree()}>{children}</SharedDocsLayout>;
}
