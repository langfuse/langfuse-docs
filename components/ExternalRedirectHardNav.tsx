"use client";

import { useEffect } from "react";
import { resolveExternalRedirect } from "@/lib/external-redirects";

/**
 * Capture-phase click interceptor for same-origin shortlinks that redirect
 * off-site. Covers callers that bypass `@/components/ui/link` (raw next/link,
 * fumadocs-core/link, Cards, etc.) so soft-nav never RSC-fetches discord.gg /
 * clickhouse.com / github.com and blanks the page.
 */
export function ExternalRedirectHardNav() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      // Only plain left-clicks (no modified open-in-new-tab)
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!anchor) return;

      // Respect explicit new-tab / download
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) {
        return;
      }

      const href = anchor.getAttribute("href");
      const external = resolveExternalRedirect(href);
      if (!external) return;

      event.preventDefault();
      event.stopPropagation();
      window.location.assign(external);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
