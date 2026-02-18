"use client";

import { SidebarProvider } from "fumadocs-core/sidebar";
import type { ReactNode } from "react";

/** Wraps docs layout so SidebarTrigger in DocsNavbar has a provider (fixes "Missing sidebar provider"). */
export function DocsLayoutWrapper({ children }: { children: ReactNode }) {
  return <SidebarProvider>{children}</SidebarProvider>;
}
