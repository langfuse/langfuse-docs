"use client";

import { cn } from "@/lib/utils";
import { useBlogFilter } from "./BlogFilterContext";
import { BLOG_VIEWS, BLOG_VIEW_LABELS, type BlogView } from "./blog-view";

export function BlogViewSwitcher({ className }: { className?: string }) {
  const { view, setView } = useBlogFilter();

  return (
    <div
      role="radiogroup"
      aria-label="Blog layout"
      className={cn("flex items-center gap-1", className)}
    >
      {BLOG_VIEWS.map((option) => {
        const selected = view === option;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setView(option as BlogView)}
            className={cn(
              "px-2 py-1 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors",
              selected
                ? "bg-text-primary text-surface-bg"
                : "text-text-tertiary hover:text-text-primary",
            )}
          >
            {BLOG_VIEW_LABELS[option]}
          </button>
        );
      })}
    </div>
  );
}
