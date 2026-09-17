"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  Suspense,
  type ReactNode,
} from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { BlogPageItem } from "./BlogIndex";
import { computeTagCounts, normalizeTags, type TagWithCount } from "./utils";

type BlogFilterState = {
  selectedTag: string | null;
  searchQuery: string;
  setSelectedTag: (tag: string | null) => void;
  setSearchQuery: (q: string) => void;
  tags: TagWithCount[];
  allPosts: BlogPageItem[];
  filteredPosts: BlogPageItem[];
  highlightPosts: BlogPageItem[];
  listPosts: BlogPageItem[];
};

const BlogFilterContext = createContext<BlogFilterState | null>(null);

export function useBlogFilter() {
  const ctx = useContext(BlogFilterContext);
  if (!ctx)
    throw new Error("useBlogFilter must be used inside BlogFilterProvider");
  return ctx;
}

const HIGHLIGHT_COUNT = 3;

function tagFromSearchParams(searchParams: {
  get: (key: string) => string | null;
}): string | null {
  return searchParams.get("tag") || null;
}

/**
 * Reads `?tag=` without blocking the blog index HTML.
 * Must stay in its own Suspense boundary — `useSearchParams()` would
 * otherwise replace the whole page with a fallback during static render.
 */
function BlogUrlTagSync({
  onTagFromUrl,
}: {
  onTagFromUrl: (tag: string | null) => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    onTagFromUrl(tagFromSearchParams(searchParams));
  }, [searchParams, onTagFromUrl]);

  return null;
}

export function BlogFilterProvider({
  pages,
  children,
}: {
  pages: BlogPageItem[];
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedTag, setSelectedTagLocal] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const syncTagFromUrl = useCallback((tag: string | null) => {
    setSelectedTagLocal((current) => (current === tag ? current : tag));
  }, []);

  const allPosts = useMemo(() => {
    return pages
      .filter((p) => p.frontMatter?.showInBlogIndex !== false)
      .sort(
        (a, b) =>
          (new Date(b.frontMatter?.date ?? 0).getTime() || 0) -
          (new Date(a.frontMatter?.date ?? 0).getTime() || 0),
      );
  }, [pages]);

  const tags = useMemo<TagWithCount[]>(
    () => computeTagCounts(allPosts.map((p) => p.frontMatter?.tag)),
    [allPosts],
  );

  const filteredPosts = useMemo(() => {
    return allPosts.filter((page) => {
      if (selectedTag) {
        const postTags = normalizeTags(page.frontMatter?.tag);
        if (!postTags.includes(selectedTag.toLowerCase())) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const title = (page.frontMatter?.title ?? "").toLowerCase();
        const desc = (page.frontMatter?.description ?? "").toLowerCase();
        if (!title.includes(q) && !desc.includes(q)) return false;
      }
      return true;
    });
  }, [allPosts, selectedTag, searchQuery]);

  const highlightPosts = useMemo(() => {
    const marked = allPosts.filter((p) => p.frontMatter?.highlight === true);
    if (marked.length >= HIGHLIGHT_COUNT)
      return marked.slice(0, HIGHLIGHT_COUNT);
    const remaining = allPosts.filter((p) => !marked.includes(p));
    return [...marked, ...remaining].slice(0, HIGHLIGHT_COUNT);
  }, [allPosts]);

  const listPosts = useMemo(() => {
    const highlightRoutes = new Set(highlightPosts.map((p) => p.route));
    return filteredPosts.filter((p) => !highlightRoutes.has(p.route));
  }, [filteredPosts, highlightPosts]);

  const setSelectedTag = (tag: string | null) => {
    setSelectedTagLocal(tag);
    const params = new URLSearchParams(
      typeof window !== "undefined" ? window.location.search : "",
    );
    if (tag) {
      params.set("tag", tag);
    } else {
      params.delete("tag");
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  return (
    <BlogFilterContext.Provider
      value={{
        selectedTag,
        searchQuery,
        setSelectedTag,
        setSearchQuery,
        tags,
        allPosts,
        filteredPosts,
        highlightPosts,
        listPosts,
      }}
    >
      <Suspense fallback={null}>
        <BlogUrlTagSync onTagFromUrl={syncTagFromUrl} />
      </Suspense>
      {children}
    </BlogFilterContext.Provider>
  );
}
