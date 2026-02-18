/**
 * Shim for nextra-theme-docs useConfig
 */
import type React from "react";

export function useConfig(): {
  frontMatter: Record<string, unknown>;
  title?: string;
} {
  return { frontMatter: {}, title: undefined };
}

export function useTheme(): { resolvedTheme?: string; setTheme?: (t: string) => void } {
  return { resolvedTheme: "light" };
}
