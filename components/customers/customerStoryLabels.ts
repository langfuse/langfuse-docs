import type { CustomerStory } from "./CustomerCarousel";

export function companyName(story: CustomerStory): string {
  return (
    story.frontMatter.quoteCompany ??
    story.frontMatter.title?.split(" ")[0] ??
    "Customer"
  );
}

/** Short card / hero headline derived from the story title. */
export function storyHeadline(story: CustomerStory): string {
  const title = story.frontMatter.title ?? "";
  if (title.toLowerCase().startsWith("how ")) {
    return title.replace(/^How\s+/i, "").replace(/\s+using Langfuse$/i, "");
  }
  return title;
}
