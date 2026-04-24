"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import type { BlogPageItem } from "./BlogIndex";
import { BlogCategoryDropdown } from "./BlogCategoryDropdown";
import { useBlogFilter } from "./BlogFilterContext";
import { formatDate, normalizeTags } from "./utils";
import { HoverPostRow } from "@/components/lists/HoverPostRow";

const PAGE_SIZE = 15;

export function BlogPostList({ posts }: { posts: BlogPageItem[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const { searchQuery, setSearchQuery } = useBlogFilter();

  const visible = posts.slice(0, visibleCount);
  const hasMore = visibleCount < posts.length;

  return (
    <section className="rounded-[2px] border border-line-structure bg-surface-bg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-line-structure">
        <h2 className="text-left font-analog font-medium text-[16px] text-text-primary shrink-0">
          All Posts
        </h2>
        <div className="flex items-center gap-2 ml-auto">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3 text-text-tertiary pointer-events-none" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-6 pr-2 h-[26px] w-[140px] text-[12px]"
            />
          </div>
          <BlogCategoryDropdown />
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="px-4 py-8 text-center">
          <Text size="s" className="text-[13px] text-text-tertiary">
            No posts found{searchQuery ? ` for "${searchQuery}"` : ""}.
          </Text>
        </div>
      ) : (
        <>
          {/* Rows */}
          <div className="divide-y divide-line-structure">
            {visible.map((post) => (
              <HoverPostRow
                key={post.route}
                href={post.route}
                tags={normalizeTags(post.frontMatter?.tag)}
                title={post.frontMatter?.title || post.name || ""}
                description={post.frontMatter?.description}
                previewOnHover
                previewImage={post.frontMatter?.ogImage ?? null}
                metaRight={
                  <>
                    <Text
                      size="s"
                      className="text-left md:text-right text-[12px] text-text-tertiary whitespace-nowrap"
                    >
                      {formatDate(post.frontMatter?.date)}
                    </Text>
                    {post.frontMatter?.author && (
                      <>
                        <span className="text-[12px] text-text-tertiary md:hidden">·</span>
                        <Text
                          size="s"
                          className="text-left md:text-right text-[12px] text-text-tertiary"
                        >
                          {post.frontMatter.author}
                        </Text>
                      </>
                    )}
                  </>
                }
              />
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="flex justify-center py-4 border-t border-line-structure">
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="text-[13px] text-text-secondary underline underline-offset-2 hover:text-text-primary transition-colors cursor-pointer"
              >
                Load {Math.min(PAGE_SIZE, posts.length - visibleCount)} more
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
