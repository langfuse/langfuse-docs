/**
 * Reusable content-width abstraction for page layouts.
 *
 * Frontmatter `contentWidth` is optional. When omitted, the main column uses
 * the standard marketing width (680px / 840px responsive).
 *
 * When set in MDX (see `source.config.ts`):
 * - `"docs"` — same reading width as docs (680px), and footer aligns via CSS.
 * - `"full"` — no max-width on the content column.
 *
 * "default" is an internal-only fallback for pages that don't set
 * contentWidth in frontmatter — it is NOT a valid frontmatter value.
 */
export type ContentWidthType = "docs" | "full";

/** Internal type including the code-side fallback. */
export type ResolvedContentWidth = ContentWidthType | "default";

export const contentWidthClasses: Record<ResolvedContentWidth, string> = {
  docs: "px-4 sm:px-8 md:px-0 md:max-w-[680px]",
  default: "px-4 sm:px-8 md:px-0 md:max-w-[680px] xl:max-w-[840px]",
  full: "px-4 sm:px-6 md:px-8",
};
