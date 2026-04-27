"use client";

import {
  Menu,
  X,
  ChevronRight,
  Unplug,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "fumadocs-ui/components/sidebar/base";
import { useTreePath } from "fumadocs-ui/contexts/tree";
import IconBook from "@/components/icons/book";
import IconBookBookmark from "@/components/icons/book-bookmark";
import IconDesktopTower from "@/components/icons/desktop-tower";
import IconCompass from "@/components/icons/compass";

const SECTIONS = [
  { title: "Docs", path: "/docs", Icon: IconBook },
  { title: "Integrations", path: "/integrations", Icon: Unplug },
  { title: "Self Hosting", path: "/self-hosting", Icon: IconDesktopTower },
  { title: "Guides", path: "/guides", Icon: IconCompass },
  { title: "AI Engineering Library", path: "/library", Icon: IconBookBookmark },
] as const;

/** Derive a human-readable page name from the last pathname segment. */
function pageNameFromPath(pathname: string | null): string | null {
  if (!pathname) return null;
  const slug = pathname.split("/").filter(Boolean).pop();
  if (!slug) return null;
  // "get-started" → "Get Started"
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Mobile breadcrumb bar with hamburger to open the Fumadocs sidebar drawer.
 */
export function DocsSecondaryNavMobile() {
  const pathname = usePathname();
  const { open, setOpen } = useSidebar();
  const treePath = useTreePath();

  const activeSection = SECTIONS.find((s) => pathname?.startsWith(s.path));

  const sectionTitle =
    activeSection?.title ?? pageNameFromPath("/" + (pathname?.split("/")[1] ?? ""));

  // Prefer tree path for page name (gives the authored title), fall back to slug
  const treeNode = treePath.length > 0 ? treePath[treePath.length - 1] : null;
  const pageName =
    (treeNode && "name" in treeNode ? treeNode.name : null) ??
    pageNameFromPath(pathname);

  const isRoot =
    (activeSection && pathname === activeSection.path) ||
    (!activeSection && pathname?.split("/").filter(Boolean).length === 1);

  return (
    <div
      className="flex items-center px-3 gap-2 md:hidden sticky z-41 bg-surface-1 border-b border-line-structure [grid-area:header] h-[var(--lf-nav-docs-secondary-height)]"
      style={{ top: "var(--lf-nav-primary-height)" }}
    >
      <button
        aria-label={open ? "Close Sidebar" : "Open Sidebar"}
        onClick={() => setOpen((prev) => !prev)}
        className="text-text-secondary"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      {sectionTitle && (
        <span className="text-sm text-text-tertiary">{sectionTitle}</span>
      )}
      {pageName && !isRoot && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
          <span className="text-sm font-medium truncate text-text-primary">
            {pageName}
          </span>
        </>
      )}
    </div>
  );
}

export function DocsSecondaryNav() {
  const pathname = usePathname();
  return (
    <div
      className="hidden overflow-x-auto overflow-y-hidden sticky z-40 md:block bg-surface-1"
      style={{ top: "var(--lf-nav-primary-height)" }}
    >
      <nav className="px-px mx-auto border-b max-w-360 bg-line-structure border-line-structure">
        <div className="flex gap-0 items-stretch rounded-sm bg-surface-1">
          {SECTIONS.map((item) => {
            const isActive = pathname?.startsWith(item.path);
            return (
              <Link
                href={item.path}
                key={item.path}
                className={cn(
                  "flex h-[var(--lf-nav-docs-secondary-height)] shrink-0 gap-2 items-center px-4 -mb-px text-sm whitespace-nowrap border-b-2 transition-colors",
                  isActive
                    ? "font-medium with-stripes-alt border-line-cta text-text-primary"
                    : "border-transparent text-text-tertiary hover:border-line-structure hover:text-text-secondary"
                )}
              >
                <item.Icon className="w-4 h-4 shrink-0" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
