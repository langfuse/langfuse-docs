"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function HomeSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col bg-line-structure sticky top-16 h-[calc(100vh-4rem)] p-px pt-0 w-[240px] shrink-0">
      <nav className="flex flex-col flex-1 gap-1 rounded-sm bg-surface-1">
      </nav>
    </aside>
  );
}
