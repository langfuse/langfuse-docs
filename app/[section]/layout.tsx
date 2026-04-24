import { use } from "react";
import { notFound } from "next/navigation";
import { HomeLayout } from "@/components/layout";
import {
  SECTION_CONFIG,
  SECTION_SLUGS,
  DEDICATED_APP_SECTIONS,
  type SectionLayout,
} from "@/lib/section-registry";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ section: string }>;
};

// All sections reaching this catch-all have layout "marketing" — sections with
// other layouts (docs/post/changelog) have hasOwnRoute:true and are excluded
// below. This map makes that assumption explicit and enforced.
const LAYOUT_WRAPPERS: Record<SectionLayout, React.ComponentType<{ children: React.ReactNode }>> = {
  marketing: HomeLayout,
  // These are never reached via the catch-all (all have hasOwnRoute: true),
  // but are listed so TypeScript catches any new layout value added to the type.
  docs: HomeLayout,
  post: HomeLayout,
  changelog: HomeLayout,
};

/**
 * Catch-all section layout.
 * Handles non-dedicated sections that still route through app/[section]
 * (marketing MDX pages). Dedicated sections have their own app routes and
 * are excluded here. Layout wrapper is driven by SectionMeta.layout from
 * section-registry — the single source of truth.
 */
export default function SectionLayout({ children, params }: LayoutProps) {
  const { section } = use(params);

  if (!SECTION_SLUGS.includes(section)) notFound();
  if (DEDICATED_APP_SECTIONS.has(section)) notFound();

  const Wrapper = LAYOUT_WRAPPERS[SECTION_CONFIG[section].layout];
  return <Wrapper>{children}</Wrapper>;
}
