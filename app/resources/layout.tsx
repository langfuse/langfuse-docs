import { PageChrome } from "@/components/layout";

// SEO/GEO resources hub (e.g. /resources/engineering). Styled like customer
// stories: marketing chrome, no docs sidebar. Reachable mainly via search.
export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageChrome>{children}</PageChrome>;
}
