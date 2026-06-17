"use client";

import { Fragment, type ReactNode, useMemo } from "react";
import Link from "fumadocs-core/link";
import type * as PageTree from "fumadocs-core/page-tree";
import { useTreeContext, useTreePath } from "fumadocs-ui/contexts/tree";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

type AnyNode = PageTree.Node | PageTree.Root | PageTree.Folder;
type Crumb = { name: ReactNode; url?: string };

/**
 * Resolve a link target for a tree node:
 * - a page links to itself (unless it's an external link),
 * - a folder links to its index page when it has one,
 * - otherwise we fall back to the first linkable descendant page.
 *
 * The fallback is what makes section/folder crumbs clickable even when the
 * folder has no dedicated index page (e.g. "Observability", whose landing
 * page is `overview` rather than `index`).
 */
function resolveFirstUrl(node: AnyNode): string | undefined {
  if ("type" in node && node.type === "page") {
    return node.external ? undefined : node.url;
  }
  if ("type" in node && node.type === "folder" && node.index?.url) {
    return node.index.url;
  }
  const children = "children" in node ? node.children : undefined;
  if (children) {
    for (const child of children) {
      const url = resolveFirstUrl(child);
      if (url) return url;
    }
  }
  return undefined;
}

/**
 * Link target for the leading (section) crumb. Prefer the section's landing
 * page — the shallowest internal child page, e.g. `/docs` over `/docs/demo` —
 * so the root crumb points at the section index regardless of `meta.json`
 * ordering. Falls back to the first linkable descendant.
 */
function resolveSectionUrl(
  root: PageTree.Root | PageTree.Folder,
): string | undefined {
  let best: string | undefined;
  for (const child of root.children) {
    if (child.type !== "page" || child.external) continue;
    if (
      best === undefined ||
      child.url.split("/").length < best.split("/").length
    ) {
      best = child.url;
    }
  }
  return best ?? resolveFirstUrl(root);
}

/**
 * Drop-in replacement for Fumadocs' `PageBreadcrumb` that renders the same
 * markup and styling but resolves a URL for every crumb — including the section
 * root and intermediate folders that lack an index page — so the full
 * breadcrumb trail is clickable.
 *
 * Mirrors Fumadocs' `getBreadcrumbItemsFromPath` with `{ includeRoot: true,
 * includePage: true }`; the only addition is the `resolveFirstUrl` fallback.
 */
export function DocsBreadcrumb() {
  const path = useTreePath();
  const { root } = useTreeContext();

  const items = useMemo<Crumb[]>(() => {
    const result: Crumb[] = [];

    for (let i = 0; i < path.length; i++) {
      const node = path[i];
      if (node.type === "page") {
        result.push({ name: node.name, url: node.url });
      } else if (node.type === "folder") {
        // The active root folder is rendered as the leading crumb below.
        if (node.root) continue;
        // Fumadocs collapses a folder and its index page into a single crumb.
        if (i === path.length - 1 || node.index !== path[i + 1]) {
          result.push({
            name: node.name,
            url: node.index?.url ?? resolveFirstUrl(node),
          });
        }
      }
    }

    result.unshift({ name: root.name, url: resolveSectionUrl(root) });
    return result;
  }, [path, root]);

  if (items.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5 text-sm text-fd-muted-foreground">
      {items.map((item, i) => {
        const className = cn(
          "truncate",
          i === items.length - 1 && "text-fd-primary font-medium",
        );
        return (
          <Fragment key={i}>
            {i !== 0 && <ChevronRight className="size-3.5 shrink-0" />}
            {item.url ? (
              <Link
                href={item.url}
                className={cn(className, "transition-opacity hover:opacity-80")}
              >
                {item.name}
              </Link>
            ) : (
              <span className={className}>{item.name}</span>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
