import type React from "react";

/**
 * Shim for nextra Page type
 */
export type Page = {
  name?: string;
  // route is always present on real Nextra/fumadocs pages returned by
  // getPagesUnderRoute / getPagesForRoute; making it required here prevents
  // downstream type errors when callers require a non-optional route.
  route: string;
  title?: string;
  frontMatter?: Record<string, unknown>;
  children?: React.ReactNode;
};
