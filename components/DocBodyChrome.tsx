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
  const isEnterprisePage = pathname === "/enterprise";
  const isCustomerStory = (pathname ?? "").startsWith("/users/");
  const cookbook = withProse
    ? COOKBOOK_ROUTE_MAPPING.find((c) => c.path === pathname)
    : undefined;

  if (!withProse) {
    return <div className="flex-1">{children}</div>;
  }

  return (
    <DocsBody className="flex-1">
      <div className="mx-auto w-full">
        <div
          className={
            isEnterprisePage
              ? "mb-4 flex w-full flex-wrap justify-end gap-2 items-center"
              : "mb-4 flex flex-wrap gap-2 items-center sm:absolute sm:max-w-[15rem] sm:justify-end right-0 top-[-62px]"
          }
        >
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
        {!isCustomerStory && (
          <>
            <hr className="mt-12 mb-0 border-t border-line-structure" />
            <div
              className="flex flex-col gap-2 py-6"
              id="docs-feedback"
            >
              <span className="text-sm font-medium">Was this page helpful?</span>
              <div className="flex items-center justify-between gap-2">
                <DocsFeedback key={pathname} />
                <DocsSupport />
              </div>
            </div>
            <hr className="mt-0 mb-4 border-t border-line-structure" />
          </>
        )}
      </div>
    </DocsBody>
  );
}
