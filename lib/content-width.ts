/**
 * Reusable content-width abstraction for page layouts.
 *
 * - "docs"    — matches the docs reading column width (680px, same as .docs-chrome #nd-page)
 * - "default" — current marketing/section default (680/840 responsive)
 * - "full"    — no max-width constraint (full container width)
 */
export type ContentWidthType = "docs" | "default" | "full";

export const contentWidthClasses: Record<ContentWidthType, string> = {
  docs: "px-4 sm:px-8 md:px-0 md:max-w-[680px]",
  default: "px-4 sm:px-8 md:px-0 md:max-w-[680px] xl:max-w-[840px]",
  full: "px-4 sm:px-6 md:px-8",
};
