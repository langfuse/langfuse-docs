"use client";

import { SidebarProvider } from "fumadocs-ui/components/sidebar/base";
import type { ReactNode } from "react";

/**
 * Wraps docs layout so SidebarTrigger has a SidebarProvider.
 * Sidebar sticky top is handled via --fd-docs-row-1 override in overrides.css:
 *   calc(var(--fd-nav-height, 4rem) + var(--fd-banner-height, 0px))
 */
export function DocsLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="layout-wrapper">
      <SidebarProvider>{children}</SidebarProvider>
    </div>
  );
}
