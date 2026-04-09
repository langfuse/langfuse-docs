"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

/**
 * Forces light mode while mounted. Restores the user's previous
 * theme preference on unmount (e.g. when navigating away).
 */
export function ForceLightMode() {
  const { theme, setTheme } = useTheme();
  const previousTheme = useRef<string | undefined>();

  useEffect(() => {
    // Capture whatever the user had selected before we override
    if (previousTheme.current === undefined) {
      previousTheme.current = theme;
    }
    if (theme !== "light") {
      setTheme("light");
    }

    return () => {
      // Restore when leaving the home page
      if (previousTheme.current && previousTheme.current !== "light") {
        setTheme(previousTheme.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
