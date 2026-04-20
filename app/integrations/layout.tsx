import { integrationsSource } from "@/lib/source";
import { SharedDocsLayout } from "@/components/layout";

export default function IntegrationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SharedDocsLayout tree={integrationsSource.getPageTree()}>{children}</SharedDocsLayout>;
}
