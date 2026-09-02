"use client";

import { BlogIndexBar } from "./BlogIndexBar";
import { BlogStoryCard } from "./BlogStoryCard";
import type { BlogPageItem } from "./BlogIndex";

export function BlogMosaic({ posts }: { posts: BlogPageItem[] }) {
  if (posts.length === 0) return null;

  const [lead, ...rest] = posts;

  return (
    <section className="border-y border-line-structure bg-surface-bg">
      <div className="px-6 py-8 sm:px-8">
        <BlogIndexBar className="mb-8" />
        <p className="m-0 max-w-[48ch] text-left font-analog text-[22px] font-medium leading-[1.2] tracking-tight text-text-primary sm:text-[28px]">
          Product announcements, engineering deep dives, and guides for building
          LLM applications.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <BlogStoryCard
          post={lead}
          featured
          withStripes
          className="sm:row-span-2 sm:min-h-full"
        />
        {rest.map((post, index) => (
          <BlogStoryCard
            key={post.route}
            post={post}
            withStripes={index % 2 === 1}
          />
        ))}
      </div>
    </section>
  );
}
