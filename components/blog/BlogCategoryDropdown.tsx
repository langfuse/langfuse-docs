"use client";

import { useBlogFilter } from "./BlogFilterContext";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

export function BlogCategoryDropdown() {
  const { selectedTag, setSelectedTag, tags, allPosts } = useBlogFilter();

  const currentLabel = selectedTag ?? "All";
  const currentCount = selectedTag
    ? tags.find((t) => t.name === selectedTag)?.count ?? 0
    : allPosts.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1 text-text-tertiary hover:text-text-primary transition-colors">
          <ChevronDown className="size-3.5" />
          <span className="text-[12px] font-sans font-[430] capitalize">
            {currentLabel} [{currentCount}]
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px] p-0">
        <DropdownMenuRadioGroup
          value={selectedTag ?? ""}
          onValueChange={(v) => setSelectedTag(v || null)}
        >
          <DropdownMenuRadioItem value="" className="px-3 py-1.5 capitalize">
            <span className="flex-1">All</span>
            <span className="tabular-nums ml-3 text-text-tertiary">{allPosts.length}</span>
          </DropdownMenuRadioItem>
          {tags.map((tag) => (
            <DropdownMenuRadioItem key={tag.name} value={tag.name} className="px-3 py-1.5 capitalize">
              <span className="flex-1">{tag.name}</span>
              <span className="tabular-nums ml-3 text-text-tertiary">{tag.count}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
