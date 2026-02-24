"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

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
    [key: string]: unknown;
  };
};

export const BlogIndex = ({
  maxItems,
  path = "/blog",
  pages: initialPages,
}: {
  maxItems?: number;
  path?: string;
  pages?: BlogPageItem[];
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Initialize selected tag from URL parameter
  useEffect(() => {
    const tag = searchParams.get("tag") ?? undefined;
    setSelectedTag(tag || null);
  }, [searchParams]);

  const posts = useMemo(() => {
    const list = initialPages ?? [];
    return list
      .filter((page) => page.frontMatter?.showInBlogIndex !== false)
      .sort(
        (a, b) =>
          new Date((b.frontMatter?.date ?? "") as string).getTime() -
          new Date((a.frontMatter?.date ?? "") as string).getTime()
      )
      .slice(0, maxItems);
  }, [initialPages, path, maxItems]);

  const normalizeTags = (tagString?: string): string[] => {
    if (tagString == null || typeof tagString !== "string") return [];
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

  // Get unique tags, sorted alphabetically for consistent category row
  const tags = useMemo(() => {
    const allTags: string[] = posts.flatMap((page) =>
      normalizeTags(page.frontMatter?.tag as string)
    );
    return Array.from(new Set(allTags)).sort((a, b) => a.localeCompare(b));
  }, [posts]);

  const handleTagClick = (tag: string) => {
    const newTag = selectedTag === tag ? null : tag;
    setSelectedTag(newTag ?? null);

    const params = new URLSearchParams(searchParams.toString());
    if (newTag) {
      params.set("tag", newTag);
    } else {
      params.delete("tag");
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div>
      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2 justify-center mb-10 mt-2">
          <Button
            onClick={() => handleTagClick("")}
            variant={selectedTag ? "secondary" : "default"}
            size="pill"
          >
            All
          </Button>
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
      ) : null}

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
              {page.frontMatter?.title || page.name}
            </h2>
            <div className="mt-2 opacity-80 group-hover:opacity-100">
              {page.frontMatter?.description} <span>Read more →</span>
            </div>
            <div className="flex flex-wrap gap-2 items-baseline mt-3">
              {normalizeTags(page.frontMatter?.tag as string).map((tag, index) => (
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
