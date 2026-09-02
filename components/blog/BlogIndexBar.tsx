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
        "flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between",
        className,
      )}
    >
      <h1 className="m-0 font-mono text-[11px] font-normal uppercase tracking-[0.14em] text-text-tertiary">
        Blog
      </h1>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        {extra ? <div className="hidden sm:flex">{extra}</div> : null}
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
