"use client";

import {
  createPatternSpotlightState,
  disposePatternSpotlight,
  updatePatternSpotlightTarget,
} from "@/lib/patternSpotlight";
import { useCallback, useEffect, useMemo, useRef, type ReactNode } from "react";

/**
 * Center content area for HomeLayout.
 * Applies cursor-following grid spotlight (pattern-bg) and tracks
 * mouse position relative to this element.
 */
export function HomeMainArea({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const spotlightState = useMemo(() => createPatternSpotlightState(), []);

  useEffect(() => () => disposePatternSpotlight(spotlightState), [spotlightState]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      updatePatternSpotlightTarget(() => ref.current, spotlightState, x, y);
    },
    [spotlightState]
  );

  return (
    <main
      ref={ref}
      className="flex-1 min-w-0 rounded-sm pattern-bg"
      onMouseMove={handleMouseMove}
      id="home-main-area"
    >
      <div className="relative z-1">{children}</div>
    </main>
  );
}
