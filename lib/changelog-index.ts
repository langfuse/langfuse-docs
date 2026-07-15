import { changelogSource } from "@/lib/source";

export type ChangelogPageItem = {
  route: string;
  name?: string;
  title?: string;
  frontMatter?: {
    date?: string;
    title?: string;
    description?: string;
    badge?: string;
    ogVideo?: string;
    ogImage?: string;
    gif?: string;
    [key: string]: unknown;
  };
};

export const CHANGELOG_ITEMS_PER_PAGE = 50;

export function getChangelogIndexItems(): ChangelogPageItem[] {
  return changelogSource
    .getPages()
    .filter((p) => p.url !== "/changelog")
    .sort(
      (a, b) =>
        new Date((b.data.date as string) ?? 0).getTime() -
        new Date((a.data.date as string) ?? 0).getTime(),
    )
    .map((p) => ({
      route: p.url,
      name: p.data.title,
      title: p.data.title,
      frontMatter: {
        title: p.data.title,
        description: p.data.description as string | undefined,
        date: p.data.date as string | undefined,
        ogImage: p.data.ogImage as string | undefined,
        ogVideo: p.data.ogVideo as string | undefined,
        gif: p.data.gif as string | undefined,
        badge: p.data.badge as string | undefined,
      },
    }));
}

export function parseChangelogPageParam(
  raw: string | undefined,
  totalPages: number,
): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(Math.floor(n), Math.max(1, totalPages));
}

/** SEO-friendly path for page `page` (1-based). Undefined if out of range. */
export function changelogPageHref(
  page: number,
  totalPages: number,
): string | undefined {
  if (page < 1 || page > totalPages) return undefined;
  if (page === 1) return "/changelog";
  return `/changelog?page=${page}`;
}
