"use client";

import { usePathname } from "next/navigation";
import {
  SidebarItem as SidebarItemBase,
  useFolderDepth,
} from "fumadocs-ui/components/sidebar/base";
import type * as PageTree from "fumadocs-core/page-tree";

/**
 * Custom sidebar Item renderer used with `sidebar.components` in DocsLayout.
 *
 * Nodes transformed to `type: "link"` by `shortcutLinkTransformer` are link
 * shortcuts that may share a URL with a real page elsewhere in the tree.
 * We never show these shortcuts as visually active — the real page node (which
 * causes its ancestor folder to expand) is the canonical active item.
 */

const ITEM_CLASS =
  "relative flex flex-row items-center gap-2 rounded-lg p-2 text-start text-text-tertiary wrap-anywhere [&_svg]:size-4 [&_svg]:shrink-0 transition-colors hover:text-text-primary/80 hover:transition-none";

export function SidebarShortcutItem({
  item,
}: {
  item: PageTree.Item & { type: string };
}) {
  const pathname = usePathname();
  const depth = useFolderDepth();

  // Normalise trailing slash the same way fumadocs-ui's isActive() does
  const normalize = (p: string) =>
    p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p;

  const active =
    (item.type as string) !== "link" && normalize(item.url) === normalize(pathname);

  return (
    <SidebarItemBase
      href={item.url}
      external={item.external}
      active={active}
      icon={item.icon}
      className={ITEM_CLASS}
      style={{ paddingInlineStart: `calc(${2 + 3 * depth} * var(--spacing))` }}
    >
      {item.name}
    </SidebarItemBase>
  );
}
