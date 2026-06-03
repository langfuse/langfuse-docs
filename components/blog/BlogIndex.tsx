"use client";

import { useBlogFilter } from "./BlogFilterContext";
import { BlogHighlightCards } from "./BlogHighlightCards";
import { BlogPostList } from "./BlogPostList";
import { BlogMobileFilters } from "@/components/blog/BlogMobileFilters";

export type BlogPageItem = {
  route: string;
  name?: string;
  title?: string;
  frontMatter?: {
    title?: string;
    description?: string;
    date?: string;
    tag?: string;
    ogImage?: string;
    author?: string;
    showInBlogIndex?: boolean;
    highlight?: boolean;
    [key: string]: unknown;
  };
};

export function BlogIndex() {
  const { highlightPosts, listPosts } = useBlogFilter();

  return (
    <div className="flex flex-col gap-8">
      <BlogMobileFilters />
      <BlogHighlightCards posts={highlightPosts} />
      <BlogPostList posts={listPosts} />
    </div>
  );
}
