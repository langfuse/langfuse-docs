"use client";

import { Server, LibraryBig, BookOpen, FileCode, Unplug } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
    <div className="hidden mb-2 md:block">
      {SECTIONS.map((item) =>
        pathname?.startsWith(item.path) ? (
          <div
            key={item.path}
            className="flex flex-row gap-3 items-center mb-3 group text-primary"
          >
            <item.Icon className="p-1 w-7 h-7 rounded border bg-primary/10" />
            {item.title}
          </div>
        ) : (
          <Link
            href={item.path}
            key={item.path}
            className="flex flex-row gap-3 items-center mb-3 group text-muted-foreground hover:text-foreground"
          >
            <item.Icon className="p-1 w-7 h-7 rounded border group-hover:bg-muted" />
            {item.title}
          </Link>
        )
      )}
    </div>
  );
};
