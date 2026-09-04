"use client";

import { BlogStoryCard } from "./BlogStoryCard";
import type { BlogPageItem } from "./BlogIndex";

export function BlogCardGrid({ posts }: { posts: BlogPageItem[] }) {
  if (posts.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2">
      {posts.map((post, index) => (
        <BlogStoryCard
          key={post.route}
          post={post}
          withStripes={index % 3 === 1}
        />
      ))}
    </div>
  );
}
