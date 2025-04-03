import { getPagesUnderRoute } from "nextra/context";
import Link from "next/link";
import Image from "next/image";
import { type Page } from "nextra";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";

export const BlogIndex = ({ maxItems }: { maxItems?: number }) => {
  const router = useRouter();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Initialize selected tag from URL parameter
  useEffect(() => {
    const tag = router.query.tag as string | undefined;
    setSelectedTag(tag || null);
  }, [router.query.tag]);

  const posts = useMemo(
    () =>
      (getPagesUnderRoute("/blog") as Array<Page & { frontMatter: any }>)
        .filter((page) => page.frontMatter?.showInBlogIndex !== false)
        .sort(
          (a, b) =>
            new Date(b.frontMatter.date).getTime() -
            new Date(a.frontMatter.date).getTime()
        )
        .slice(0, maxItems),
    [maxItems]
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
      <div className="flex gap-2 flex-wrap mb-8 justify-center">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`text-sm py-1 px-3 rounded-full transition-colors ${
              selectedTag
                ?.toLowerCase()
                .split(",")
                .map((t) => t.trim())
                .includes(tag)
                ? "bg-gray-900 text-white dark:bg-white dark:text-black"
                : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            }`}
          >
            {tag.charAt(0).toUpperCase() + tag.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
        {filteredPosts.map((page) => (
          <Link key={page.route} href={page.route} className="block mb-8 group">
            {page.frontMatter?.ogImage ? (
              <div className="mt-4 rounded relative aspect-video overflow-hidden">
                <Image
                  src={page.frontMatter.ogImage}
                  className="object-cover transform group-hover:scale-105 transition-transform"
                  alt={page.frontMatter?.title ?? "Blog post image"}
                  fill={true}
                  sizes="(min-width: 1024px) 33vw, 100vw"
                />
              </div>
            ) : null}
            <h2 className="block font-mono mt-8 text-2xl opacity-90 group-hover:opacity-100">
              {page.meta?.title || page.frontMatter?.title || page.name}
            </h2>
            <div className="opacity-80 mt-2 group-hover:opacity-100">
              {page.frontMatter?.description} <span>Read more →</span>
            </div>
            <div className="flex gap-2 flex-wrap mt-3 items-baseline">
              {normalizeTags(page.frontMatter?.tag).map((tag, index) => (
                <span
                  key={index}
                  className="opacity-80 text-xs py-1 px-2 ring-1 ring-gray-300 rounded group-hover:opacity-100"
                >
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </span>
              ))}
              {page.frontMatter?.date ? (
                <span className="opacity-60 text-sm group-hover:opacity-100">
                  {page.frontMatter.date}
                </span>
              ) : null}
              {page.frontMatter?.author ? (
                <span className="opacity-60 text-sm group-hover:opacity-100">
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
