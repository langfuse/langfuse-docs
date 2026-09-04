"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import type { BlogPageItem } from "./BlogIndex";
import { postTitle } from "./BlogPostMeta";
import { formatShortDate, primaryTag } from "./utils";
import { useBlogFilter } from "./BlogFilterContext";

const PAGE_SIZE = 9;

export function BlogArchive({ posts }: { posts: BlogPageItem[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const { searchQuery } = useBlogFilter();

  if (posts.length === 0) return null;

  const visible = posts.slice(0, visibleCount);
  const hasMore = visibleCount < posts.length;

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-end justify-between gap-4">
        <h2 className="m-0 font-analog text-[16px] font-medium text-text-primary">
          Archive
        </h2>
        <p className="m-0 font-mono text-[11px] uppercase tracking-[0.12em] text-text-tertiary">
          {Math.min(visibleCount, posts.length)} of {posts.length}
        </p>
      </div>
      <div className="overflow-hidden border border-line-structure bg-surface-bg">
        {visible.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <Text size="s" className="text-[13px] text-text-tertiary">
              No posts found{searchQuery ? ` for “${searchQuery}”` : ""}.
            </Text>
          </div>
        ) : (
          <ul className="m-0 list-none divide-y divide-line-structure p-0">
            {visible.map((post) => {
              const tag = primaryTag(post.frontMatter?.tag);
              return (
                <li key={post.route}>
                  <Link
                    href={post.route}
                    className="group grid grid-cols-1 gap-1 px-4 py-3 no-underline transition-colors hover:bg-surface-1 sm:grid-cols-[7.5rem_minmax(0,1fr)_auto] sm:items-baseline sm:gap-6"
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
                      {formatShortDate(post.frontMatter?.date)}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-analog text-[16px] font-medium leading-snug text-text-primary">
                        {postTitle(post)}
                      </span>
                      {tag ? (
                        <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
                          {tag}
                        </span>
                      ) : null}
                    </span>
                    <span className="hidden font-mono text-[11px] uppercase tracking-[0.1em] text-text-tertiary transition-colors group-hover:text-text-primary sm:inline">
                      {post.frontMatter?.author ?? "Read"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
        {hasMore ? (
          <div className="flex justify-center border-t border-line-structure py-4">
            <Button
              variant="secondary"
              size="default"
              className="w-auto min-w-[160px]"
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            >
              Load {Math.min(PAGE_SIZE, posts.length - visibleCount)} more
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
