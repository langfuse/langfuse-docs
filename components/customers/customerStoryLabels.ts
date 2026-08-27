import type { CustomerStory } from "./CustomerCarousel";

export function companyName(story: CustomerStory): string {
  return (
    story.frontMatter.quoteCompany ??
    story.frontMatter.title?.split(" ")[0] ??
    "Customer"
  );
}
