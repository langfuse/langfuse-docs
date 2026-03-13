import { getSelfHostingPageTree } from "@/lib/source";
import { SharedDocsLayout } from "@/app/docs/SharedDocsLayout";

export default function SelfHostingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SharedDocsLayout tree={getSelfHostingPageTree()}>{children}</SharedDocsLayout>;
}
