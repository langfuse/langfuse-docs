/**
 * Shim for nextra/context so home and other components don't crash.
 * getPagesUnderRoute returns [] until those routes are migrated to App Router.
 */
import type React from "react";

export function getPagesUnderRoute(_route: string): Array<{
  name?: string;
  route?: string;
  title?: string;
  frontMatter?: Record<string, unknown>;
  children?: React.ReactNode;
}> {
  return [];
}
