"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useBlogFilter } from "./BlogFilterContext";

export function BlogTopicStrip() {
  const {
    selectedTag,
    setSelectedTag,
    searchQuery,
    setSearchQuery,
    tags,
    allPosts,
    filteredPosts,
    isFiltered,
  } = useBlogFilter();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => setSelectedTag(null)}
            className={cn(
              "shrink-0 rounded-sm border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.06em] transition-colors",
              !selectedTag
                ? "border-line-cta bg-surface-bg text-text-primary"
                : "border-line-structure text-text-tertiary hover:text-text-primary",
            )}
          >
            All [{allPosts.length}]
          </button>
          {tags.map((tag) => {
            const active = selectedTag === tag.name;
            return (
              <button
                key={tag.name}
                type="button"
                onClick={() => setSelectedTag(active ? null : tag.name)}
                className={cn(
                  "shrink-0 rounded-sm border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.06em] transition-colors",
                  active
                    ? "border-line-cta bg-surface-bg text-text-primary"
                    : "border-line-structure text-text-tertiary hover:text-text-primary",
                )}
              >
                {tag.name} [{tag.count}]
              </button>
            );
          })}
        </div>
        <div className="relative w-full sm:w-[200px] sm:shrink-0">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-text-tertiary" />
          <Input
            type="search"
            placeholder="Search posts"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-[32px] pl-8 text-[13px]"
            aria-label="Search posts"
          />
        </div>
      </div>
      {isFiltered ? (
        <p className="m-0 font-mono text-[11px] uppercase tracking-[0.12em] text-text-tertiary">
          {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
          {selectedTag ? ` in ${selectedTag}` : ""}
          {searchQuery.trim() ? ` matching “${searchQuery.trim()}”` : ""}
        </p>
      ) : null}
    </div>
  );
}
