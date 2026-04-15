import { faqSource, getPageTreeWithShortTitles } from "@/lib/source";
import { SharedDocsLayout } from "@/app/docs/SharedDocsLayout";

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SharedDocsLayout tree={getPageTreeWithShortTitles(faqSource, "/faq")}>{children}</SharedDocsLayout>;
}
