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

export const MenuSwitcher = () => {
  const pathname = usePathname();
  return (
    <div className="hidden my-2 md:block">
      {SECTIONS.map((item) => {
        const isActive = pathname?.startsWith(item.path);
        return (
          <Link
            href={item.path}
            key={item.path}
            className={cn(
              "flex flex-row gap-3 items-center mb-1.5 group",
              isActive
                ? "text-muted-blue"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.Icon
              className={cn(
                "p-1 w-7 h-7 rounded border",
                isActive
                  ? "bg-muted-blue/10 text-muted-blue"
                  : "group-hover:bg-muted"
              )}
            />
            {item.title}
          </Link>
        );
      })}
    </div>
  );
};
