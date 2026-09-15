import { PageChrome } from "@/components/layout";

// Competitive comparison pages. Styled like customer stories: marketing
// chrome, no docs sidebar. Linked from the site footer as /compare.
export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageChrome>{children}</PageChrome>;
}
