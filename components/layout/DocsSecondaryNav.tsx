"use client";

import { Server, LibraryBig, BookOpen, FileCode, Unplug } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { title: "Docs", path: "/docs", Icon: LibraryBig },
  { title: "Integrations", path: "/integrations", Icon: Unplug },
  { title: "Self Hosting", path: "/self-hosting", Icon: Server },
  { title: "Guides", path: "/guides", Icon: FileCode },
  { title: "AI Engineering Library", path: "/library", Icon: BookOpen },
] as const;

export function DocsSecondaryNav() {
  const pathname = usePathname();
  return (
    <div className="overflow-x-auto overflow-y-hidden sticky z-40 bg-surface-1" style={{ top: "60px" }}>
      <nav className="px-px mx-auto max-w-360 bg-line-structure">
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
                    ? "font-medium border-text-primary text-text-primary"
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
