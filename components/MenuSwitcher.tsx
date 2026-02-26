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
    <div className="-mx-2 mb-2 hidden md:block">
      {SECTIONS.map((item) =>
        pathname?.startsWith(item.path) ? (
          <div
            key={item.path}
            className="group mb-3 flex flex-row items-center gap-3 text-primary"
          >
            <item.Icon className="w-7 h-7 p-1 border rounded bg-primary/10" />
            {item.title}
          </div>
        ) : (
          <Link
            href={item.path}
            key={item.path}
            className="group mb-3 flex flex-row items-center gap-3 text-muted-foreground hover:text-foreground"
          >
            <item.Icon className="w-7 h-7 p-1 border rounded group-hover:bg-muted" />
            {item.title}
          </Link>
        )
      )}
    </div>
  );
};
