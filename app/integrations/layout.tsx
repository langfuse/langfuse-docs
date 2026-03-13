import { getIntegrationsPageTree } from "@/lib/source";
import { SharedDocsLayout } from "@/app/docs/SharedDocsLayout";

export default function IntegrationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SharedDocsLayout tree={getIntegrationsPageTree()}>{children}</SharedDocsLayout>;
}
