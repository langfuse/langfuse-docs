"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

/** Keep DOM in sync with forced light (covers html + body class targets). */
function stripDarkFromDocument() {
  document.documentElement.classList.remove("dark");
  document.body.classList.remove("dark");
  document.documentElement.style.colorScheme = "light";
}

/**
 * Forces light mode while mounted. Restores the user's previous
 * theme preference on unmount (e.g. when navigating to docs).
 *
 * Use only under {@link HomeLayout} (marketing / home — not SharedDocsLayout).
 */
export function ForceLightMode() {
  const { theme, setTheme } = useTheme();
  const previousTheme = useRef<string | undefined>();

  useEffect(() => {
    if (previousTheme.current === undefined) {
      previousTheme.current = theme;
    }
    stripDarkFromDocument();
    if (theme !== "light") {
      setTheme("light");
    }

    return () => {
      if (previousTheme.current && previousTheme.current !== "light") {
        setTheme(previousTheme.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
