"use client";

import {
  Server,
  LibraryBig,
  BookOpen,
  FileCode,
  Unplug,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "fumadocs-ui/components/sidebar/base";
import { useTreePath } from "fumadocs-ui/contexts/tree";

const SECTIONS = [
  { title: "Docs", path: "/docs", Icon: LibraryBig },
  { title: "Integrations", path: "/integrations", Icon: Unplug },
  { title: "Self Hosting", path: "/self-hosting", Icon: Server },
  { title: "Guides", path: "/guides", Icon: FileCode },
  { title: "AI Engineering Library", path: "/library", Icon: BookOpen },
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
 * Must be rendered inside SidebarProvider (i.e. inside DocsLayoutWrapper).
 */
export function DocsSecondaryNavMobile() {
  const pathname = usePathname();
  const { open, setOpen } = useSidebar();
  const treePath = useTreePath();

  const activeSection = SECTIONS.find((s) => pathname?.startsWith(s.path));

  // Prefer tree path for page name (gives the authored title), fall back to slug
  const treeNode = treePath.length > 0 ? treePath[treePath.length - 1] : null;
  const pageName =
    (treeNode && "name" in treeNode ? treeNode.name : null) ??
    pageNameFromPath(pathname);

  // Don't show breadcrumb arrow if we're on the section root
  const isRoot = activeSection && pathname === activeSection.path;

  return (
    <div className="flex items-center h-[40px] px-3 gap-2 md:hidden sticky z-41 bg-surface-1 border-b border-line-structure [grid-area:header]" style={{ top: "60px" }}>
      <button
        aria-label={open ? "Close Sidebar" : "Open Sidebar"}
        onClick={() => setOpen((prev) => !prev)}
        className="text-text-secondary"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      {activeSection && (
        <span className="text-sm text-text-tertiary">{activeSection.title}</span>
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
    <div className="hidden overflow-x-auto overflow-y-hidden sticky z-40 md:block bg-surface-1" style={{ top: "60px" }}>
      <nav className="px-px mx-auto border-b max-w-360 bg-line-structure border-line-structure">
        <div className="flex gap-0 items-stretch rounded-sm bg-surface-1">
          {SECTIONS.map((item) => {
            const isActive = pathname?.startsWith(item.path);
            return (
              <Link
                href={item.path}
                key={item.path}
                className={cn(
                  "flex gap-2 items-center px-3 -mb-px text-sm whitespace-nowrap border-b-2 transition-colors h-[40px] shrink-0",
                  isActive
                    ? "font-medium with-stripes-alt border-text-primary text-text-primary"
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
