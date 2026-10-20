"use client";

import { useEffect } from "react";

/**
 * Sets `<html lang>` for a subtree of the app.
 *
 * Next.js only lets the root layout render `<html>`, and its attributes are
 * serialized before any child renders, so a single root layout cannot vary
 * `lang` by route. Rather than split the app into per-language root layouts,
 * routes that serve another language mount this component: the inline script
 * applies the attribute while the browser is still parsing the document, and
 * the effect restores the site default when the user navigates back out via
 * client-side routing.
 *
 * `<html>` already carries `suppressHydrationWarning`, so mutating the
 * attribute does not trip React.
 */
export function DocumentLanguage({
  lang,
  fallback = "en",
}: {
  lang: string;
  fallback?: string;
}) {
  useEffect(() => {
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = fallback;
    };
  }, [lang, fallback]);

  return (
    <script
      // Runs during HTML parse, before first paint, so the attribute is
      // correct for screen readers and browser translation immediately.
      dangerouslySetInnerHTML={{
        __html: `document.documentElement.lang=${JSON.stringify(lang)}`,
      }}
    />
  );
}
