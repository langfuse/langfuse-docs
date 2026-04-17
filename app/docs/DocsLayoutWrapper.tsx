"use client";

import type { ReactNode } from "react";

/**
 * Pattern-bg is applied to #nd-page directly via CSS + DocsPatternTracker.
 */
export function DocsLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="layout-wrapper flex-1">
      {children}
    </div>
  );
}
