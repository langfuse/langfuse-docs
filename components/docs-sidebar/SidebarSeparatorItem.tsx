"use client";

import type { CSSProperties } from "react";
import {
  SidebarSeparator as SidebarSeparatorBase,
  useFolderDepth,
} from "fumadocs-ui/components/sidebar/base";
import type * as PageTree from "fumadocs-core/page-tree";
import { cn } from "@/lib/utils";

/** Matches `getItemOffset` in fumadocs-ui’s docs sidebar layout. */
function getItemOffset(depth: number) {
  return `calc(${2 * depth} * var(--spacing) + 14px)`;
}

/**
 * Custom separator (page-tree `type: "separator"`) — Fumadocs renders these as `<p>` via
 * `SidebarSeparator`. Use with `sidebar.components.Separator` on `DocsLayout`, same pattern as `Item`.
 */
export function SidebarSeparatorItem({
  item,
}: {
  item: PageTree.Separator;
}) {
  const depth = useFolderDepth();
  const labelLeft = `calc(${3 * depth} * var(--spacing) + 4px)`;

  return (
    <SidebarSeparatorBase
      className={cn(
        "[&_svg]:size-4 [&_svg]:shrink-0",
        depth === 0 ? "w-full" : "max-w-[calc(100%-16px)] mx-auto",
        "relative w-full pb-1.5 font-[580] text-text-primary",
        "after:pointer-events-none after:absolute after:right-0 after:h-px after:content-['']",
        // depth 0: 1px line at the TOP of the separator
        depth === 0 &&
        "pt-3 mt-2 after:top-0 after:left-0 after:bg-[var(--line-structure)]",
        // depth > 0: 1px underline beneath the label
        depth > 0 &&
        "mt-3 text-text-tertiary after:bottom-0 after:left-[calc(var(--sidebar-label-left)_+_2px)] after:bg-[var(--line-structure)]",
      )}
      style={
        {
          paddingInlineStart: getItemOffset(depth),
          ["--sidebar-label-left" as string]: labelLeft,
        } as CSSProperties
      }
    >
      {depth === 0 && (
        <>
          {/*
           * Anti-rounded corner decorators framing the top 1px line at each of its 4 corners.
           */}
          <span
            aria-hidden
            className="hidden md:block pointer-events-none absolute left-0 top-[-3px] h-[3px] w-[3px] bg-left-corner -scale-y-100"
          />
          <span
            aria-hidden
            className="hidden md:block pointer-events-none absolute right-0 top-[-3px] h-[3px] w-[3px] bg-right-corner -scale-y-100"
          />
          <span
            aria-hidden
            className="hidden md:block pointer-events-none absolute left-0 top-[1px] h-[3px] w-[3px] bg-left-corner"
          />
          <span
            aria-hidden
            className="hidden md:block pointer-events-none absolute right-0 top-[1px] h-[3px] w-[3px] bg-right-corner"
          />
        </>
      )}
      {item.icon}
      {item.name}
    </SidebarSeparatorBase>
  );
}
