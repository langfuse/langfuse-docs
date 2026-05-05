"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
  useFolderDepth,
} from "fumadocs-ui/components/sidebar/base";
import { useTreePath } from "fumadocs-ui/contexts/tree";
import { isActive } from "fumadocs-ui/utils/urls";
import type * as PageTree from "fumadocs-core/page-tree";

import { cn } from "@/lib/utils";

export const SIDEBAR_NAV_ROW_CLASS =
  "relative flex w-full max-w-[calc(100%-16px)] mx-auto flex-row items-center gap-2 rounded-lg p-2 text-start text-text-tertiary wrap-anywhere [&_svg]:size-4 [&_svg]:shrink-0 transition-colors hover:text-text-primary/80 hover:transition-none";

export function sidebarNavPaddingInlineStart(depth: number) {
  return `calc(${2 * depth} * var(--spacing) + 6px)`;
}

/**
 * Depth is read inside `SidebarFolder`’s `FolderContext` (same as fumadocs-ui docs `SidebarFolderContent`).
 */
function SidebarFolderBody({ children }: { children: ReactNode }) {
  const depth = useFolderDepth();
  return (
    <SidebarFolderContent
      className={cn(
        "relative",
        depth === 1 &&
        "before:absolute before:inset-y-1 before:start-3 before:w-px before:bg-[var(--line-structure)] before:content-['']",
      )}
      style={
        {
          ["--sidebar-label-left" as string]: sidebarNavPaddingInlineStart(depth),
        }
      }
    >
      {children}
    </SidebarFolderContent>
  );
}

/**
 * Custom `Folder` renderer for `sidebar.components` — collapsible groups (“dropdown” rows) in the nav tree.
 * Composes the same primitives as Fumadocs’ default page-tree folder, with `SidebarItem`-aligned styling.
 */
export function SidebarFolderItem({
  item,
  children,
}: {
  item: PageTree.Folder;
  children: ReactNode;
}) {
  const path = useTreePath();
  const pathname = usePathname();
  /** Parent depth: folder row aligns with `SidebarItem` at the same tree level. */
  const depth = useFolderDepth();

  const rowStyle = { paddingInlineStart: sidebarNavPaddingInlineStart(depth) };

  return (
    <SidebarFolder
      collapsible={item.collapsible}
      active={path.includes(item)}
      defaultOpen={item.defaultOpen}
    >
      {item.index ? (
        <SidebarFolderLink
          href={item.index.url}
          external={item.index.external}
          active={isActive(item.index.url, pathname)}
          className={SIDEBAR_NAV_ROW_CLASS}
          style={rowStyle}
        >
          {item.icon}
          {item.name}
        </SidebarFolderLink>
      ) : (
        <SidebarFolderTrigger className={SIDEBAR_NAV_ROW_CLASS} style={rowStyle}>
          {item.icon}
          {item.name}
        </SidebarFolderTrigger>
      )}
      <SidebarFolderBody>{children}</SidebarFolderBody>
    </SidebarFolder>
  );
}
