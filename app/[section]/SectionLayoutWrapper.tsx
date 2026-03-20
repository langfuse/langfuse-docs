"use client";

import { SidebarProvider } from "fumadocs-ui/components/sidebar/base";
import type { ReactNode } from "react";

/**
 * Thin client wrapper that provides SidebarProvider.
 * DocsLayout is passed as {children} (from the server layout), so it runs in the
 * server context and its LayoutContextProvider propagates correctly to DocsPage.
 */
export function SectionLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="layout-wrapper">
      <SidebarProvider>{children}</SidebarProvider>
    </div>
  );
}
