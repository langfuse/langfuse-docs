import { CircleHelp, Server } from "lucide-react";
import { FileCode } from "lucide-react";
import { LibraryBig } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export const MenuSwitcher = () => {
  const { asPath } = useRouter();
  return (
    <div className="-mx-2 hidden md:block">
      {[
        { title: "Docs", path: "/docs", Icon: LibraryBig },
        { title: "Self Hosting", path: "/self-hosting", Icon: Server },
        { title: "Guides", path: "/guides", Icon: FileCode },
        { title: "FAQ", path: "/faq", Icon: CircleHelp },
      ].map((item) =>
        asPath.startsWith(item.path) ? (
          <div
            key={item.path}
            className="group mb-3 flex flex-row items-center gap-3 _text-primary-800 dark:_text-primary-600"
          >
            <item.Icon className="w-7 h-7 p-1 border rounded _bg-primary-100 dark:_bg-primary-400/10" />
            {item.title}
          </div>
        ) : (
          <Link
            href={item.path}
            key={item.path}
            className="group mb-3 flex flex-row items-center gap-3 text-gray-500 hover:text-primary/100"
          >
            <item.Icon className="w-7 h-7 p-1 border rounded group-hover:bg-border/30" />
            {item.title}
          </Link>
        )
      )}
    </div>
  );
};
