import type { Metadata } from "next";
import { getBlogIndexPages } from "@/lib/blog-index";
import { ContentColumns } from "@/components/layout";
import { BlogPageClient } from "@/components/blog/BlogPageClient";
import { BlogIndex } from "@/components/blog/BlogIndex";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "The latest updates from Langfuse: product announcements, engineering deep dives, and guides for building LLM applications.",
  // Self-referencing canonical so filtered views (e.g. /blog?tag=...) consolidate to /blog
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogIndexPage() {
  const pages = getBlogIndexPages();

  return (
    <BlogPageClient pages={pages}>
      <ContentColumns
        className="min-h-screen"
        footerClassName="md:max-w-none xl:max-w-none px-6 sm:px-6 md:px-6"
      >
        <div className="relative z-1 mx-auto w-full">
          <BlogIndex />
        </div>
      </ContentColumns>
    </BlogPageClient>
  );
}
