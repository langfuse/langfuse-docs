import { blogSource } from "@/lib/source";
import type { BlogPageItem } from "@/components/blog/BlogIndex";
import { computeTagCounts, type TagWithCount } from "@/components/blog/utils";

// Manually-injected blog index entries that link to dedicated app routes
// (e.g. the fancy /launch-week-5 marketing page) rather than to a backing
// MDX file in content/blog/. Sorted alongside the MDX-backed posts by date.
const EXTRA_BLOG_INDEX_PAGES: BlogPageItem[] = [
  {
    route: "/launch-week-5",
    name: "Langfuse Launch Week #5",
    title: "Langfuse Launch Week #5",
    frontMatter: {
      title: "Langfuse Launch Week #5",
      description:
        "Five days, five feature drops, May 25–29, 2026. New building blocks for taking AI from prototype to production — unveiled live at ClickHouse OpenHouse.",
      date: "2026/05/25",
      tag: "launchweek",
      highlight: true,
    },
  },
];

export function getBlogIndexPages(): BlogPageItem[] {
  const mdxPages: BlogPageItem[] = blogSource
    .getPages()
    .filter((p) => p.url !== "/blog" && p.data.showInBlogIndex !== false)
    .map((p) => ({
      route: p.url,
      name: p.data.title,
      title: p.data.title,
      frontMatter: {
        title: p.data.title,
        description: p.data.description as string | undefined,
        date: p.data.date as string | undefined,
        tag: p.data.tag as string | undefined,
        ogImage: p.data.ogImage as string | undefined,
        author: p.data.author as string | undefined,
        showInBlogIndex: p.data.showInBlogIndex as boolean | undefined,
        highlight: p.data.highlight as boolean | undefined,
      },
    }));

  return [...EXTRA_BLOG_INDEX_PAGES, ...mdxPages].sort(
    (a, b) =>
      new Date(b.frontMatter?.date ?? 0).getTime() -
      new Date(a.frontMatter?.date ?? 0).getTime(),
  );
}

export function getBlogTagCounts(): { tags: TagWithCount[]; total: number } {
  const pages = getBlogIndexPages();
  const tags = computeTagCounts(pages.map((p) => p.frontMatter?.tag));
  return { tags, total: pages.length };
}
