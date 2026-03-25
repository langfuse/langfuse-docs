"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LibraryBig,
  Unplug,
  Server,
  FileCode,
  BookOpen,
  Megaphone,
  FileText,
  Users,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";

const NAV_SECTIONS = [
  { title: "Docs", href: "/docs", Icon: LibraryBig },
  { title: "Integrations", href: "/integrations", Icon: Unplug },
  { title: "Self Hosting", href: "/self-hosting", Icon: Server },
  { title: "Guides", href: "/guides", Icon: FileCode },
  { title: "AI Engineering Library", href: "/library", Icon: BookOpen },
] as const;

const COMPANY_SECTIONS = [
  { title: "Blog", href: "/blog", Icon: FileText },
  { title: "Changelog", href: "/changelog", Icon: Megaphone },
  { title: "Customers", href: "/users", Icon: Users },
  { title: "Security", href: "/security", Icon: ShieldCheck },
  { title: "FAQ", href: "/faq", Icon: HelpCircle },
] as const;

export function HomeSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col border-r border-border/50 bg-background sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-4 w-[240px] shrink-0">
      <nav className="flex flex-col gap-1">
        <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          Product
        </p>
        {NAV_SECTIONS.map(({ title, href, Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
              pathname?.startsWith(href)
                ? "bg-accent text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {title}
          </Link>
        ))}

        <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-4 mb-1">
          Company
        </p>
        {COMPANY_SECTIONS.map(({ title, href, Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
              pathname?.startsWith(href)
                ? "bg-accent text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {title}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
