"use client";

import { Suspense, type ReactNode } from "react";
import { BlogFilterProvider } from "./BlogFilterContext";
import type { BlogPageItem } from "./BlogIndex";

/**
 * Client wrapper that provides BlogFilterContext so both the sidebar
 * and main content share filter state (tags, search query).
 * The actual layout is composed by the server page component.
 */
export function BlogPageClient({
  pages,
  children,
}: {
  pages: BlogPageItem[];
  children: ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[400px] animate-pulse rounded-[2px] bg-surface-bg/50" />
      }
    >
      <BlogFilterProvider pages={pages}>{children}</BlogFilterProvider>
    </Suspense>
  );
}
