import type { PageFooterNavItem } from "@/components/PageFooterNav";

export function getPageFooterItems<TPage extends { url: string }>(
  pages: TPage[],
  currentUrl: string,
  options: {
    getDate: (page: TPage) => string | undefined;
    getTitle: (page: TPage) => string | undefined;
  },
): {
  previous?: PageFooterNavItem;
  next?: PageFooterNavItem;
} | undefined {
  const footerPages = [...pages]
    .sort(
      (a, b) =>
        new Date(options.getDate(a) ?? 0).getTime() -
        new Date(options.getDate(b) ?? 0).getTime(),
    )
    .map((page) => ({
      name: options.getTitle(page) ?? "",
      url: page.url,
    }));

  const currentIndex = footerPages.findIndex((page) => page.url === currentUrl);

  if (currentIndex === -1) return undefined;

  return {
    previous: footerPages[currentIndex - 1],
    next: footerPages[currentIndex + 1],
  };
}
