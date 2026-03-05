import { Suspense } from "react";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { Header } from "@/components/Header";
import { ProductUpdateSignup } from "@/components/productUpdateSignup";
import Link from "next/link";
import { getPagesForRoute } from "@/lib/source";
import type { BlogPageItem } from "@/components/blog/BlogIndex";

/** Serializable blog page for client (no functions/non-serializable fields). */
function toSerializableBlogPage(
  p: ReturnType<typeof getPagesForRoute>[number]
): BlogPageItem {
  const fm = p.frontMatter ?? {};
  return {
    route: p.route ?? "",
    name: p.name ?? p.title,
    title: p.title,
    frontMatter: {
      title: typeof fm.title === "string" ? fm.title : undefined,
      description: typeof fm.description === "string" ? fm.description : undefined,
      date: typeof fm.date === "string" ? fm.date : undefined,
      tag: typeof fm.tag === "string" ? fm.tag : undefined,
      ogImage: typeof fm.ogImage === "string" ? fm.ogImage : undefined,
      author: typeof fm.author === "string" ? fm.author : undefined,
      showInBlogIndex:
        typeof fm.showInBlogIndex === "boolean" ? fm.showInBlogIndex : undefined,
    },
  };
}

export default function BlogIndexPage() {
  const rawPages = getPagesForRoute("/blog");
  const pages: BlogPageItem[] = rawPages
    .filter((p) => p.route !== "/blog" && p.frontMatter?.showInBlogIndex !== false)
    .sort(
      (a, b) =>
        new Date((b.frontMatter?.date as string) ?? 0).getTime() -
        new Date((a.frontMatter?.date as string) ?? 0).getTime()
    )
    .map(toSerializableBlogPage);

  return (
    <div className="mx-auto max-w-360 pl-[max(env(safe-area-inset-left),1.5rem)] pr-[max(env(safe-area-inset-right),1.5rem)]">
      <div className="flex flex-col content-center items-center my-10 text-center">
        <Header
          title="Blog"
          description={
            <>
              The latest updates from Langfuse. See{" "}
              <Link href="/changelog" className="underline">
                Changelog
              </Link>{" "}
              for more product updates.
            </>
          }
          className="mb-8"
          h="h1"
        />
        <div className="mb-8">
          <ProductUpdateSignup source="blog" />
        </div>
      </div>
      <Suspense fallback={<div className="min-h-[400px] animate-pulse rounded-md bg-muted/50" />}>
        <BlogIndex path="/blog" pages={pages} />
      </Suspense>
    </div>
  );
}
