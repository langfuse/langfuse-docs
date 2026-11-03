import type { CustomerStory } from "./CustomerCarousel";

export function storyCtaLabel(ctaLabel?: string | null): string {
  return ctaLabel === "Watch" ? "Watch the video" : "Read the story";
}

export function companyName(story: CustomerStory): string {
  return (
    story.frontMatter.quoteCompany ??
    story.frontMatter.title?.split(" ")[0] ??
    "Customer"
  );
}
