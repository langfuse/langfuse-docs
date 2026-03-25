"use client";

import { useCallback, useRef, type ReactNode } from "react";

/**
 * Center content area for HomeLayout.
 * Applies cursor-following grid spotlight (pattern-bg) and tracks
 * mouse position relative to this element.
 */
export function HomeMainArea({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--cursor-x", `${x}%`);
    el.style.setProperty("--cursor-y", `${y}%`);
  }, []);

  return (
    <main
      ref={ref}
      className="pattern-bg flex-1 min-w-0"
      onMouseMove={handleMouseMove}
    >
      <div className="relative">{children}</div>
    </main>
  );
}
