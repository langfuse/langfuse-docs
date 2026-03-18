import { guidesSource, getPageTreeWithShortTitles } from "@/lib/source";
import { SharedDocsLayout } from "@/app/docs/SharedDocsLayout";

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SharedDocsLayout tree={getPageTreeWithShortTitles(guidesSource, "/guides")}>{children}</SharedDocsLayout>;
}
