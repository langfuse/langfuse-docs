"use client";

import { SidebarProvider } from "fumadocs-ui/components/sidebar/base";
import type { ReactNode } from "react";

/**
 * Wraps docs layout so SidebarTrigger has a SidebarProvider.
 * Pattern-bg is applied to #nd-page directly via CSS + DocsPatternTracker.
 */
export function DocsLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="layout-wrapper flex-1">
      <SidebarProvider>{children}</SidebarProvider>
    </div>
  );
}
