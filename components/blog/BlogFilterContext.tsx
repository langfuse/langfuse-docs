"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { BlogPageItem } from "./BlogIndex";
import { computeTagCounts, normalizeTags, type TagWithCount } from "./utils";
import { DEFAULT_BLOG_VIEW, parseBlogView, type BlogView } from "./blog-view";

type BlogFilterState = {
  selectedTag: string | null;
  searchQuery: string;
  setSelectedTag: (tag: string | null) => void;
  setSearchQuery: (q: string) => void;
  view: BlogView;
  setView: (view: BlogView) => void;
  tags: TagWithCount[];
  allPosts: BlogPageItem[];
  filteredPosts: BlogPageItem[];
  highlightPosts: BlogPageItem[];
  listPosts: BlogPageItem[];
  isFiltered: boolean;
};

const BlogFilterContext = createContext<BlogFilterState | null>(null);

export function useBlogFilter() {
  const ctx = useContext(BlogFilterContext);
  if (!ctx)
    throw new Error("useBlogFilter must be used inside BlogFilterProvider");
  return ctx;
}

const HIGHLIGHT_COUNT = 3;

function replaceQuery(
  pathname: string,
  searchParams: URLSearchParams,
  mutate: (params: URLSearchParams) => void,
) {
  const params = new URLSearchParams(searchParams.toString());
  mutate(params);
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function BlogFilterProvider({
  pages,
  children,
}: {
  pages: BlogPageItem[];
  children: ReactNode;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [selectedTag, setSelectedTagLocal] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setViewLocal] = useState<BlogView>(DEFAULT_BLOG_VIEW);

  useEffect(() => {
    const tag = searchParams.get("tag") ?? null;
    setSelectedTagLocal(tag || null);
    setViewLocal(parseBlogView(searchParams.get("view")));
  }, [searchParams]);

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
    const hasImage = (p: BlogPageItem) => Boolean(p.frontMatter?.ogImage);
    const marked = allPosts.filter((p) => p.frontMatter?.highlight === true);
    const markedWithImage = marked.filter(hasImage);
    const othersWithImage = allPosts.filter(
      (p) => hasImage(p) && !marked.includes(p),
    );
    const visual = [...markedWithImage, ...othersWithImage];
    if (visual.length >= HIGHLIGHT_COUNT)
      return visual.slice(0, HIGHLIGHT_COUNT);
    const remaining = allPosts.filter((p) => !visual.includes(p));
    return [...visual, ...remaining].slice(0, HIGHLIGHT_COUNT);
  }, [allPosts]);

  const listPosts = useMemo(() => {
    const highlightRoutes = new Set(highlightPosts.map((p) => p.route));
    return filteredPosts.filter((p) => !highlightRoutes.has(p.route));
  }, [filteredPosts, highlightPosts]);

  const isFiltered = Boolean(selectedTag) || Boolean(searchQuery.trim());

  const setSelectedTag = (tag: string | null) => {
    setSelectedTagLocal(tag);
    router.replace(
      replaceQuery(pathname, searchParams, (params) => {
        if (tag) params.set("tag", tag);
        else params.delete("tag");
      }),
    );
  };

  const setView = (next: BlogView) => {
    setViewLocal(next);
    router.replace(
      replaceQuery(pathname, searchParams, (params) => {
        if (next === DEFAULT_BLOG_VIEW) params.delete("view");
        else params.set("view", next);
      }),
    );
  };

  return (
    <BlogFilterContext.Provider
      value={{
        selectedTag,
        searchQuery,
        setSelectedTag,
        setSearchQuery,
        view,
        setView,
        tags,
        allPosts,
        filteredPosts,
        highlightPosts,
        listPosts,
        isFiltered,
      }}
    >
      {children}
    </BlogFilterContext.Provider>
  );
}
