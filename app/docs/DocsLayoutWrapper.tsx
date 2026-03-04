"use client";

import { SidebarProvider } from "fumadocs-ui/components/sidebar/base";
import type { ReactNode } from "react";

/**
 * Wraps docs layout so SidebarTrigger in DocsNavbar has a provider (fixes "Missing sidebar provider").
 * Sets --fd-banner-height so the sticky sidebar (and header) use top: 63px, clearing the main navbar.
 */
export function DocsLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="layout-wrapper" style={{ ["--fd-banner-height" as string]: "63px" }}>
      <SidebarProvider>{children}</SidebarProvider>
    </div>
  );
}
