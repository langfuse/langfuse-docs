"use client";

import { SidebarTrigger } from "fumadocs-core/sidebar";
import { NavbarLogo } from "@/components/NavbarLogo";
import { NavbarExtraContent } from "@/components/NavbarExtraContent";
import InkeepSearchBar from "@/components/inkeep/InkeepSearchBar";
import { MenuIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Docs navbar: same logo + nav actions as Nextra (theme.config), plus sidebar toggle and search for Fumadocs. */
export function DocsNavbar() {
  return (
    <header
      className="sticky top-0 z-50 h-16 border-b border-foreground/10 bg-background/50 backdrop-blur-md"
    >
      <nav className="container flex h-full flex-row items-center gap-4">
        <SidebarTrigger
          aria-label="Toggle Sidebar"
          className={cn(
            "size-9 shrink-0 md:hidden",
            "inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <MenuIcon className="size-5" />
        </SidebarTrigger>

        <NavbarLogo />

        <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
          <div className="hidden min-w-0 max-w-[240px] flex-1 md:block lg:max-w-[280px]">
            <InkeepSearchBar />
          </div>

          <NavbarExtraContent />
        </div>
      </nav>
    </header>
  );
}
