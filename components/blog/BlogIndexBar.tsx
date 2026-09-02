"use client";

import Link from "next/link";
import { BlogViewSwitcher } from "./BlogViewSwitcher";
import { cn } from "@/lib/utils";

export function BlogIndexBar({
  extra,
  className,
}: {
  extra?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-x-4 gap-y-3",
        className,
      )}
    >
      <h1 className="m-0 font-mono text-[11px] font-normal uppercase tracking-[0.14em] text-text-tertiary">
        Blog
      </h1>
      <div className="flex flex-wrap items-center gap-3">
        {extra}
        <Link
          href="/changelog"
          className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary no-underline transition-colors hover:text-text-primary"
        >
          Changelog
        </Link>
        <span className="hidden text-text-disabled sm:inline" aria-hidden>
          ·
        </span>
        <BlogViewSwitcher />
      </div>
    </div>
  );
}
