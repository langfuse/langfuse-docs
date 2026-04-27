"use client";

import { useBlogFilter } from "./BlogFilterContext";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Inline filter row for mobile / tablet screens where the sidebar is hidden.
 * Renders a horizontal scrollable tag bar + search input.
 */
export function BlogMobileFilters() {
  const {
    selectedTag,
    setSelectedTag,
    searchQuery,
    setSearchQuery,
    tags,
    allPosts,
  } = useBlogFilter();

  return (
    <div className="flex flex-col gap-3 lg:hidden">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-text-tertiary pointer-events-none" />
        <Input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 text-[13px]"
        />
      </div>

      {/* Tag pills */}
      {tags.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 [scrollbar-width:none]">
          <button
            onClick={() => setSelectedTag(null)}
            className={cn(
              "shrink-0 px-3 py-1 rounded-full text-[12px] font-[430] transition-colors border",
              !selectedTag
                ? "bg-text-primary text-surface-bg border-text-primary"
                : "bg-surface-bg text-text-secondary border-line-structure hover:border-text-tertiary"
            )}
          >
            All ({allPosts.length})
          </button>
          {tags.map((tag) => (
            <button
              key={tag.name}
              onClick={() =>
                setSelectedTag(selectedTag === tag.name ? null : tag.name)
              }
              className={cn(
                "shrink-0 px-3 py-1 rounded-full text-[12px] font-[430] transition-colors border capitalize",
                selectedTag === tag.name
                  ? "bg-text-primary text-surface-bg border-text-primary"
                  : "bg-surface-bg text-text-secondary border-line-structure hover:border-text-tertiary"
              )}
            >
              {tag.name} ({tag.count})
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
