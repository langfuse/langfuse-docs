import { blogSource } from "@/lib/source";
import type { BlogPageItem } from "@/components/blog/BlogIndex";
import { computeTagCounts, type TagWithCount } from "@/components/blog/utils";

export function getBlogIndexPages(): BlogPageItem[] {
  return blogSource
    .getPages()
    .filter((p) => p.url !== "/blog" && p.data.showInBlogIndex !== false)
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
        tag: p.data.tag as string | undefined,
        ogImage: p.data.ogImage as string | undefined,
        author: p.data.author as string | undefined,
        showInBlogIndex: p.data.showInBlogIndex as boolean | undefined,
        highlight: p.data.highlight as boolean | undefined,
      },
    }));
}

export function getBlogTagCounts(): { tags: TagWithCount[]; total: number } {
  const pages = getBlogIndexPages();
  const tags = computeTagCounts(pages.map((p) => p.frontMatter?.tag));
  return { tags, total: pages.length };
}
