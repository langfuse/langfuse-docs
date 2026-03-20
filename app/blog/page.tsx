import { Suspense } from "react";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { Header } from "@/components/Header";
import { ProductUpdateSignup } from "@/components/productUpdateSignup";
import Link from "next/link";
import { blogSource } from "@/lib/source";
import type { BlogPageItem } from "@/components/blog/BlogIndex";

export default function BlogIndexPage() {
  const pages: BlogPageItem[] = blogSource
    .getPages()
    .filter((p) => p.url !== "/blog" && p.data.showInBlogIndex !== false)
    .sort(
      (a, b) =>
        new Date((b.data.date as string) ?? 0).getTime() -
        new Date((a.data.date as string) ?? 0).getTime()
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
      },
    }));

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
