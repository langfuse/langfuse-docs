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
  return `calc(${3 * depth} * var(--spacing) + 6px)`;
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
        "after:pointer-events-none after:absolute after:bottom-0 after:right-0 after:h-px after:content-['']",
        "after:left-[var(--sidebar-label-left)]",
        depth > 0 && "after:bg-[var(--line-structure)]",
        depth > 0 && "text-text-tertiary mt-3",
      )}
      style={
        {
          paddingInlineStart: getItemOffset(depth),
          ["--sidebar-label-left" as string]: labelLeft,
        } as CSSProperties
      }
    >
      {item.icon}
      {item.name}
    </SidebarSeparatorBase>
  );
}
