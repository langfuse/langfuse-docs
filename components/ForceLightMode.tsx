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
    previousTheme.current = theme;

    stripDarkFromDocument();
    if (theme !== "light") {
      setTheme("light");
    }

    // next-themes may re-add "dark" asynchronously after setTheme resolves.
    // The observer immediately strips it whenever it reappears while mounted.
    const observer = new MutationObserver(() => {
      if (
        document.documentElement.classList.contains("dark") ||
        document.body.classList.contains("dark")
      ) {
        stripDarkFromDocument();
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
      if (previousTheme.current && previousTheme.current !== "light") {
        setTheme(previousTheme.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
