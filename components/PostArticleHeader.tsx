"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CopyMarkdownButton } from "@/components/MainContentWrapper";
import { cn } from "@/lib/utils";
import type { PostCrumb } from "@/lib/post-crumbs";

/**
 * Docs-style breadcrumb row with the copy-page control on the right.
 * Used by post-chrome sections (compare, resources) that have no docs sidebar.
 */
export function PostArticleHeader({ items }: { items: PostCrumb[] }) {
  if (items.length === 0) return null;

  return (
    <div className="not-prose mb-6 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
      <nav className="min-w-0 flex-1" aria-label="Breadcrumb">
        <ol className="flex min-w-0 items-center gap-1.5 text-sm text-text-tertiary">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li
                key={`${item.label}-${index}`}
                className="flex min-w-0 items-center gap-1.5"
              >
                {index !== 0 && (
                  <ChevronRight className="size-3.5 shrink-0" aria-hidden />
                )}
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="truncate no-underline transition-colors hover:text-text-primary hover:no-underline"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      "truncate",
                      isLast && "font-medium text-text-primary",
                    )}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <CopyMarkdownButton />
    </div>
  );
}
