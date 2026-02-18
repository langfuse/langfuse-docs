import type React from "react";

/**
 * Shim for nextra Page type
 */
export type Page = {
  name?: string;
  route?: string;
  title?: string;
  frontMatter?: Record<string, unknown>;
  children?: React.ReactNode;
};
