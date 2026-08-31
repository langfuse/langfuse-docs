"use client";

import { useEffect, useState } from "react";

/** Client-only matchMedia hook. Defaults to false (SSR / first paint) to avoid hydration mismatch. */
export function useMinWidth(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}

/** Tailwind `md` breakpoint (768px). */
export const MD_MIN_WIDTH_QUERY = "(min-width: 768px)";
