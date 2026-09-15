"use client";

import { useEffect } from "react";

/**
 * The `aria-hidden` package (used by Radix / focus layers) calls `console.error`
 * when a node to "keep visible" is not under `document.body` — e.g. nested
 * modals with portals (Fumadocs sidebar + Inkeep). It then does nothing harmful
 * ("Doing nothing"), but Next.js dev treats `console.error` as a full-screen overlay.
 *
 * Downgrade only that known message to `console.debug` in development.
 */
export function DevAriaHiddenConsoleFilter() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const orig = console.error.bind(console) as (...args: unknown[]) => void;
    console.error = (...args: unknown[]) => {
      const [a0, , a2] = args;
      if (
        a0 === "aria-hidden" &&
        typeof a2 === "string" &&
        a2.includes("not contained inside")
      ) {
        console.debug(...args);
        return;
      }
      orig(...args);
    };

    return () => {
      console.error = orig;
    };
  }, []);

  return null;
}
