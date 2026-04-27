"use client";

import { HiringBadge } from "@/components/HiringBadge";
import TocCommunity from "@/components/TocCommunity";

type RightSidebarHiringAndCommunityProps = {
  /**
   * When the block is not under a previous section with `pb-px bg-line-structure`
   * (e.g. blog right aside: spacer + footer), a full-width top rule is needed so
   * the hiring row does not look flush/buggy next to the main nav surface. Home
   * `HomeAside` already gets a 1px rule from the TOC block above, so keep false.
   */
  withTopRule?: boolean;
};

/**
 * Hiring + community strip for marketing right sidebars (HomeLayout + PageChrome).
 * The marketing `Navbar` has no hiring badge; `NavbarDocs` shows it in the top
 * bar — so docs layouts should not render this block (they use fumadocs TOC only).
 */
export function RightSidebarHiringAndCommunity({
  withTopRule = false,
}: RightSidebarHiringAndCommunityProps) {
  return (
    <>
      {withTopRule && (
        <div
          className="h-px w-full bg-line-structure shrink-0"
          aria-hidden
        />
      )}
      <div className="pb-px bg-line-structure">
        <div className="px-3 py-3 rounded-sm bg-surface-1">
          <HiringBadge />
        </div>
      </div>
      <div className="bg-line-structure">
        <div className="rounded-sm bg-surface-1">
          <TocCommunity />
        </div>
      </div>
    </>
  );
}
