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
    <div className="sticky z-40 border-b border-foreground/10 bg-background/80 backdrop-blur-md overflow-x-auto" style={{ top: "60px" }}>
      <nav className="mx-auto flex max-w-360 items-stretch gap-0 pl-[max(env(safe-area-inset-left),0.5rem)] pr-[max(env(safe-area-inset-right),0.5rem)]">
        {SECTIONS.map((item) => {
          const isActive = pathname?.startsWith(item.path);
          return (
            <Link
              href={item.path}
              key={item.path}
              className={cn(
                "flex items-center gap-2 px-3 h-[40px] text-sm whitespace-nowrap border-b-2 -mb-px transition-colors shrink-0",
                isActive
                  ? "border-foreground text-foreground font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-foreground/40"
              )}
            >
              <item.Icon className="h-4 w-4 shrink-0" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
