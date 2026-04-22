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
  const { setTheme } = useTheme();
  const previousTheme = useRef<string | undefined>();

  useEffect(() => {
    // Capture the real preference ONCE, directly from localStorage, before
    // setTheme("light") overwrites it. Reading it here (rather than from
    // useTheme) is important because:
    //  1. localStorage is the authoritative source next-themes reads on init.
    //  2. On React Strict Mode's second effect invocation the useTheme value
    //     may already reflect "light" (set during the first run), which would
    //     incorrectly record "light" as the previous theme and prevent restore.
    if (previousTheme.current === undefined) {
      previousTheme.current =
        localStorage.getItem("theme") ?? "system";
    }

    stripDarkFromDocument();
    setTheme("light");

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
      // Clear the inline colorScheme override immediately so next-themes can
      // manage it without a gap where the value lingers as "light" while the
      // React state has already been updated to the restored theme.
      document.documentElement.style.colorScheme = "";
      if (previousTheme.current && previousTheme.current !== "light") {
        setTheme(previousTheme.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
