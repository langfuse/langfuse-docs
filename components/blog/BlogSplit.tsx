"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BlogIndexBar } from "./BlogIndexBar";
import { BlogStoryCard } from "./BlogStoryCard";
import { postTitle } from "./BlogPostMeta";
import { formatShortDate, primaryTag } from "./utils";
import type { BlogPageItem } from "./BlogIndex";

const PAGE_SIZE = 9;

export function BlogSplit({
  featured,
  posts,
  showBar = true,
}: {
  featured?: BlogPageItem;
  posts: BlogPageItem[];
  showBar?: boolean;
}) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visible = posts.slice(0, visibleCount);
  const hasMore = visibleCount < posts.length;

  if (!featured && posts.length === 0) return null;

  return (
    <section className="border-y border-line-structure bg-surface-bg">
      {showBar ? (
        <div className="px-6 py-8 sm:px-8">
          <BlogIndexBar className="mb-0" />
        </div>
      ) : null}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
        {featured ? (
          <div className="lg:sticky lg:top-20 lg:self-start">
            <BlogStoryCard post={featured} featured withStripes flush />
          </div>
        ) : null}
        <div className="flex min-w-0 flex-col border-t border-line-structure lg:border-t-0 lg:border-l">
          <div className="flex items-center justify-between gap-3 border-b border-line-structure px-5 py-3">
            <h2 className="m-0 font-analog text-[16px] font-medium text-text-primary">
              All posts
            </h2>
            <p className="m-0 font-mono text-[11px] uppercase tracking-[0.12em] text-text-tertiary">
              {Math.min(visibleCount, posts.length)} of {posts.length}
            </p>
          </div>
          <ul className="m-0 flex list-none flex-col p-0">
            {visible.map((post) => {
              const tag = primaryTag(post.frontMatter?.tag);
              return (
                <li
                  key={post.route}
                  className="border-b border-line-structure last:border-b-0"
                >
                  <Link
                    href={post.route}
                    className="group flex flex-col gap-1 px-5 py-4 no-underline transition-colors hover:bg-surface-1"
                  >
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
                      <span>{formatShortDate(post.frontMatter?.date)}</span>
                      {tag ? (
                        <>
                          <span aria-hidden>·</span>
                          <span>{tag}</span>
                        </>
                      ) : null}
                    </div>
                    <span className="font-analog text-[17px] font-medium leading-[1.25] tracking-tight text-text-primary">
                      {postTitle(post)}
                    </span>
                    {post.frontMatter?.author ? (
                      <span className="text-[12px] text-text-tertiary">
                        {post.frontMatter.author}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
          {hasMore ? (
            <div className="flex justify-center px-5 py-4">
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
      </div>
    </section>
  );
}
