"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useAISearchContext } from "@/components/inkeep/search";

/**
 * Shared outer shell for right sidebars (aside) in HomeLayout.
 * Provides the sticky positioning, fixed width, and AI-search-aware
 * visibility that all right sidebars share.
 */
export function AsideShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { open: aiOpen } = useAISearchContext();

  return (
    <aside
      data-ai-open={aiOpen || undefined}
      className={cn(
        "hidden wide:flex wide:data-ai-open:hidden flex-col bg-line-structure sticky p-px pt-0 w-[240px] shrink-0",
        className,
      )}
      style={{
        top: "calc(var(--fd-banner-height, 0px) + var(--lf-nav-primary-height))",
        height: "calc(100vh - var(--fd-banner-height, 0px) - var(--lf-nav-primary-height))",
      }}
    >
      <nav className="flex overflow-y-auto overflow-x-hidden flex-col flex-1 rounded-sm bg-surface-1">
        {children}
      </nav>
    </aside>
  );
}
