"use client";

import { useBlogFilter } from "./BlogFilterContext";
import { BlogHero } from "./BlogHero";
import { BlogTopicStrip } from "./BlogTopicStrip";
import { BlogCardGrid } from "./BlogCardGrid";
import { BlogArchive } from "./BlogArchive";
import { BlogSubscribe } from "./BlogSubscribe";
import { BlogIndexBar } from "./BlogIndexBar";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

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

const GRID_COUNT = 8;

export function BlogIndex() {
  const {
    isFiltered,
    highlightPosts,
    listPosts,
    filteredPosts,
    selectedTag,
    searchQuery,
  } = useBlogFilter();

  const rest = isFiltered ? filteredPosts : listPosts;
  const gridPosts = rest.slice(0, GRID_COUNT);
  const archivePosts = rest.slice(GRID_COUNT);
  const hasMatches = rest.length > 0;

  return (
    <div>
      {!isFiltered ? <BlogHero posts={highlightPosts} /> : null}

      {isFiltered ? (
        <div className="border-b border-line-structure px-6 py-8 sm:px-8">
          <BlogIndexBar className="mb-6" />
          <Heading as="h2" size="normal" className="max-w-[24ch] text-left">
            {selectedTag
              ? `Posts in ${selectedTag}`
              : `Results for “${searchQuery.trim()}”`}
          </Heading>
        </div>
      ) : null}

      <div className="px-6 py-12 sm:px-8">
        <BlogTopicStrip />
        {!isFiltered ? (
          <div className="mt-10 mb-6 flex flex-col gap-2">
            <Heading as="h2" size="normal" className="max-w-[20ch] text-left">
              Latest from the team
            </Heading>
            <Text className="max-w-[52ch] text-left">
              Deep dives, launch notes, and the thinking behind what we ship.
            </Text>
          </div>
        ) : (
          <div className="mt-8" />
        )}
        {!hasMatches ? (
          <p className="m-0 py-10 text-center text-[13px] text-text-tertiary">
            No posts found
            {searchQuery.trim() ? ` for “${searchQuery.trim()}”` : ""}.
          </p>
        ) : (
          <>
            <BlogCardGrid posts={gridPosts} />
            <BlogArchive posts={archivePosts} />
          </>
        )}
        <BlogSubscribe />
      </div>
    </div>
  );
}
