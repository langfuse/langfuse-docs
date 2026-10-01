type FaqEntry = { url: string; data: { tags?: unknown } };

export function isFaqArticle(page: FaqEntry): boolean {
  return page.url.startsWith("/faq/all/");
}

export function getFaqTags(page: FaqEntry): string[] {
  const tags = page.data.tags as string[] | undefined;
  return tags?.length ? tags : ["Other"];
}

export function getAllFaqTags(pages: FaqEntry[]): string[] {
  return Array.from(new Set(pages.filter(isFaqArticle).flatMap(getFaqTags)));
}
