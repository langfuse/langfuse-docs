"use client";

import { usePathname } from "next/navigation";
import { DocsBody } from "fumadocs-ui/page";
import {
  CopyMarkdownButton,
  DocsFeedback,
  DocsSupport,
} from "@/components/MainContentWrapper";
import { NotebookBanner } from "@/components/NotebookBanner";
import { COOKBOOK_ROUTE_MAPPING } from "@/lib/cookbook_route_mapping";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /**
   * When false, renders a plain flex-1 div without prose chrome.
   * Used by wide/marketing sections (pricing, etc.).
   */
  withProse?: boolean;
  /**
   * Optional version label (e.g. "Version: v3") shown next to the copy button.
   * Used by self-hosting pages.
   */
  versionLabel?: string | null;
};

/**
 * Thin "use client" wrapper that adds interactive chrome (copy button, feedback,
 * support, notebook banner) around server-rendered MDX content passed as children.
 *
 * The MDX itself is rendered on the server; only this shell runs on the client.
 */
export function DocBodyChrome({
  children,
  withProse = true,
  versionLabel,
}: Props) {
  const pathname = usePathname();
  const cookbook = withProse
    ? COOKBOOK_ROUTE_MAPPING.find((c) => c.path === pathname)
    : undefined;

  if (!withProse) {
    return <div className="flex-1">{children}</div>;
  }

  return (
    <DocsBody className="flex-1">
      <div className="mb-4 flex flex-wrap gap-2 items-center">
        {versionLabel != null && versionLabel !== "" && (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-secondary text-secondary-foreground">
            {versionLabel}
          </span>
        )}
        <CopyMarkdownButton key={pathname} />
      </div>
      {cookbook && (
        <NotebookBanner src={cookbook.ipynbPath} className="mb-4" />
      )}
      {children}
      <hr className="my-4 border-t dark:border-neutral-800" />
      <div
        className="flex flex-wrap gap-6 justify-between items-center py-6"
        id="docs-feedback"
      >
        <DocsFeedback key={pathname} />
        <DocsSupport />
      </div>
    </DocsBody>
  );
}
