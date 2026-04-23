/**
 * Reusable content-width abstraction for page layouts.
 *
 * Frontmatter `contentWidth` is optional. When omitted, the main column uses
 * the standard marketing width (680px / 840px responsive).
 *
 * When set in MDX (see `source.config.ts`):
 * - `"docs"` — same reading width as docs (680px), and footer aligns via CSS.
 * - `"full"` — no max-width on the content column.
 */
export type ContentWidthType = "docs" | "full";

/** Classes when `contentWidth` is not set in frontmatter. */
const marketingContentWidthClasses =
  "px-4 sm:px-8 md:px-0 md:max-w-[680px] xl:max-w-[840px]";

const contentWidthByFrontmatter: Record<ContentWidthType, string> = {
  docs: "px-4 sm:px-8 md:px-0 md:max-w-[680px]",
  full: "px-4 sm:px-6 md:px-8",
};

/**
 * Tailwind classes for the section page main column. `undefined` / `null` means
 * no frontmatter override — use the standard marketing width.
 */
export function resolveContentWidthClasses(
  value: ContentWidthType | null | undefined
): string {
  if (value == null) return marketingContentWidthClasses;
  return contentWidthByFrontmatter[value];
}
