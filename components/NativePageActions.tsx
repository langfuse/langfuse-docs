"use client";

import { usePathname } from "next/navigation";
import {
  MarkdownCopyButton,
  ViewOptionsPopover,
} from "@/components/fumadocs/page-actions";
import { usePostHogClientCapture } from "@/src/usePostHogClientCapture";
import { getGithubEditUrl } from "@/components/DocsTocFooter";

/** Same prefixes as CopyMarkdownButton in MainContentWrapper. */
const pathsWithCopyAsMarkdownButton = [
  "/docs",
  "/self-hosting",
  "/guide",
  "/faq",
  "/integrations",
  "/handbook",
  "/security",
  "/library",
  "/enterprise",
  "/resources",
  "/academy",
];

/**
 * Experiment: Fumadocs 16.15 native copy/open page actions.
 * Replaces CopyMarkdownButton on DocBodyChrome surfaces for comparison.
 */
function getMarkdownUrl(pathname: string): string {
  let basePath = pathname ?? "";
  if (basePath.startsWith("/")) basePath = basePath.substring(1);
  if (basePath.endsWith("/")) basePath = basePath.slice(0, -1);
  if (!basePath) basePath = "index";
  return `/${basePath}.md`;
}

function captureTypeFromAnchor(
  href: string,
): "chatgpt" | "claude" | "mcp" | undefined {
  if (href.includes("chatgpt.com")) return "chatgpt";
  if (href.includes("claude.ai")) return "claude";
  if (href.includes("/docs/docs-mcp")) return "mcp";
  return undefined;
}

export function NativePageActions() {
  const pathname = usePathname() ?? "";
  const capture = usePostHogClientCapture();

  const shouldShow = pathsWithCopyAsMarkdownButton.some((prefix) =>
    pathname.startsWith(prefix),
  );
  if (!shouldShow) return null;

  const markdownUrl = getMarkdownUrl(pathname);
  const githubUrl = getGithubEditUrl(pathname) ?? undefined;

  return (
    <div
      className="flex items-center gap-1.5"
      onClick={(event) => {
        const anchor = (event.target as Element | null)?.closest?.("a");
        if (!anchor) return;
        const type = captureTypeFromAnchor(anchor.getAttribute("href") ?? "");
        if (type) capture("copy_page", { type });
      }}
    >
      <MarkdownCopyButton
        markdownUrl={markdownUrl}
        onPointerDown={() => {
          capture("copy_page", { type: "copy" });
        }}
      />
      <ViewOptionsPopover markdownUrl={markdownUrl} githubUrl={githubUrl} />
    </div>
  );
}
