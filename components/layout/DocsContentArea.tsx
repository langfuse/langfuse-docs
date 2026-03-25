"use client";

import { useEffect } from "react";

/**
 * Headless component — renders nothing.
 * Attaches a window mousemove listener, finds fumadocs' #nd-page element
 * (the main content area between sidebar and TOC), and sets --cursor-x /
 * --cursor-y as element-relative percentages so the pattern-bg spotlight
 * follows the cursor only inside that column.
 */
export function DocsPatternTracker() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const page = document.getElementById("nd-page");
      if (!page) return;
      const rect = page.getBoundingClientRect();
      // Only update when cursor is inside the content area
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      )
        return;
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      page.style.setProperty("--cursor-x", `${x}%`);
      page.style.setProperty("--cursor-y", `${y}%`);
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return null;
}
