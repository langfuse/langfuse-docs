"use client";

import { getPagesUnderRoute } from "nextra/context";
import Link from "next/link";
import Image from "next/image";
import { type Page } from "nextra";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export const BlogIndex = ({
  maxItems,
  path = "/blog",
}: {
  maxItems?: number;
  path?: string;
}) => {
  const searchParams = useSearchParams();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Initialize selected tag from URL parameter
  useEffect(() => {
    const tag = searchParams.get("tag") ?? undefined;
    setSelectedTag(tag || null);
  }, [searchParams]);

  const posts = useMemo(
    () =>
      (getPagesUnderRoute(path) as Array<Page & { frontMatter: any }>)
        .filter((page) => page.frontMatter?.showInBlogIndex !== false)
        .sort(
          (a, b) =>
            new Date(b.frontMatter.date).getTime() -
            new Date(a.frontMatter.date).getTime()
        )
        .slice(0, maxItems),
    [maxItems, path]
  );

  // Function to normalize and split tags
  const normalizeTags = (tagString?: string) => {
    if (!tagString) return [];
    return tagString
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);
  };

  const filteredPosts = useMemo(
    () =>
      posts.filter((page) => {
        if (!selectedTag) return true;
        const postTags = normalizeTags(page.frontMatter?.tag);
        const selectedTags = normalizeTags(selectedTag);
        return selectedTags.some((tag) => postTags.includes(tag));
      }),
    [posts, selectedTag]
  );

  // Get unique tags
  const tags = useMemo(() => {
    const allTags = posts.flatMap((page) =>
      normalizeTags(page.frontMatter?.tag)
    );
    return Array.from(new Set(allTags));
  }, [posts]);

  const handleTagClick = (tag: string) => {
    const newTag = selectedTag === tag ? null : tag;
    setSelectedTag(newTag);

    // Update URL parameter
    const query = { ...router.query };
    if (newTag) {
      query.tag = newTag;
    } else {
      delete query.tag;
    }
    router.push({ pathname: router.pathname, query }, undefined, {
      shallow: true,
    });
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {tags.map((tag) => (
          <Button
            key={tag}
            onClick={() => handleTagClick(tag)}
            variant={
              selectedTag
                ?.toLowerCase()
                .split(",")
                .map((t) => t.trim())
                .includes(tag)
                ? "default"
                : "secondary"
            }
            size="pill"
          >
            {tag.charAt(0).toUpperCase() + tag.slice(1)}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-3">
        {filteredPosts.map((page) => (
          <Link key={page.route} href={page.route} className="block mb-8 group">
            {page.frontMatter?.ogImage ? (
              <div className="overflow-hidden relative mt-4 rounded aspect-video">
                <Image
                  src={page.frontMatter.ogImage}
                  className="object-cover transition-transform transform group-hover:scale-105"
                  alt={page.frontMatter?.title ?? "Blog post image"}
                  fill={true}
                  sizes="(min-width: 1024px) 33vw, 100vw"
                />
              </div>
            ) : null}
            <h2 className="block mt-8 font-mono text-2xl opacity-90 group-hover:opacity-100">
              {page.meta?.title || page.frontMatter?.title || page.name}
            </h2>
            <div className="mt-2 opacity-80 group-hover:opacity-100">
              {page.frontMatter?.description} <span>Read more →</span>
            </div>
            <div className="flex flex-wrap gap-2 items-baseline mt-3">
              {normalizeTags(page.frontMatter?.tag).map((tag, index) => (
                <Button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    handleTagClick(tag);
                  }}
                  variant={
                    selectedTag
                      ?.toLowerCase()
                      .split(",")
                      .map((t) => t.trim())
                      .includes(tag)
                      ? "secondary"
                      : "outline"
                  }
                  size="pill"
                  className="opacity-80 group-hover:opacity-100"
                >
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </Button>
              ))}
              {page.frontMatter?.date ? (
                <span className="text-sm opacity-60 group-hover:opacity-100">
                  {page.frontMatter.date}
                </span>
              ) : null}
              {page.frontMatter?.author ? (
                <span className="text-sm opacity-60 group-hover:opacity-100">
                  by {page.frontMatter.author}
                </span>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
