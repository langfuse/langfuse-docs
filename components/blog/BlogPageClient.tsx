"use client";

import type { ReactNode } from "react";
import { BlogFilterProvider } from "./BlogFilterContext";
import type { BlogPageItem } from "./BlogIndex";

/**
 * Client wrapper that provides BlogFilterContext so both the sidebar
 * and main content share filter state (tags, search query).
 *
 * Do not wrap this tree in a Suspense fallback — `useSearchParams()`
 * lives in a nested boundary so the index HTML can render on the server.
 */
export function BlogPageClient({
  pages,
  children,
}: {
  pages: BlogPageItem[];
  children: ReactNode;
}) {
  return <BlogFilterProvider pages={pages}>{children}</BlogFilterProvider>;
}
