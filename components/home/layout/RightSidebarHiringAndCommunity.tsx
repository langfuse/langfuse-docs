"use client";

import TocCommunity from "@/components/TocCommunity";

type RightSidebarHiringAndCommunityProps = {
  /**
   * When the block is not under a previous section with `pb-px bg-line-structure`
   * (e.g. blog right aside: spacer + footer), a full-width top rule is needed so
   * the community row does not look flush next to the main nav surface. Home
   * `HomeAside` already gets a 1px rule from the TOC block above, so keep false.
   */
  withTopRule?: boolean;
};

/**
 * Community strip for marketing right sidebars (HomeLayout + PageChrome).
 * The hiring badge lives in the marketing `Navbar` (left of Product); docs
 * layouts use `NavbarDocs` instead and should not render this block.
 */
export function RightSidebarHiringAndCommunity({
  withTopRule = false,
}: RightSidebarHiringAndCommunityProps) {
  return (
    <>
      {withTopRule && (
        <div className="h-px w-full bg-line-structure shrink-0" aria-hidden />
      )}
      <div className="bg-line-structure">
        <div className="rounded-sm bg-surface-1">
          <TocCommunity />
        </div>
      </div>
    </>
  );
}
