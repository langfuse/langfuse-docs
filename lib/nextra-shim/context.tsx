/**
 * Shim for nextra/context. Uses Fumadocs sources so index components get real data
 * when routes are served from App Router (content/*).
 */
import type React from "react";
import { getPagesForRoute } from "@/lib/source";

export function getPagesUnderRoute(route: string): Array<{
  name?: string;
  route?: string;
  title?: string;
  frontMatter?: Record<string, unknown>;
  children?: React.ReactNode;
}> {
  const pages = getPagesForRoute(route);
  return pages.map((p) => ({
    name: p.name,
    route: p.route,
    title: p.title,
    frontMatter: p.frontMatter,
  }));
}
