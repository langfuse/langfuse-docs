import { use } from "react";
import { notFound } from "next/navigation";
import { HomeLayout } from "@/components/layout";
import {
  SECTION_SLUGS,
  DEDICATED_APP_SECTIONS,
} from "@/lib/section-registry";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ section: string }>;
};

/**
 * Catch-all section layout.
 * Handles non-dedicated sections that still route through app/[section]
 * (e.g. handbook + marketing MDX pages). Dedicated sections have their
 * own app routes and are excluded here.
 */
export default function SectionLayout({ children, params }: LayoutProps) {
  const { section } = use(params);

  if (!SECTION_SLUGS.includes(section)) {
    notFound();
  }
  if (DEDICATED_APP_SECTIONS.has(section)) {
    notFound();
  }

  return <HomeLayout>{children}</HomeLayout>;
}
