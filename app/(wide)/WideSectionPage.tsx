import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SECTION_CONFIG, WIDE_SECTIONS } from "@/lib/sections";
import type { WideSectionSlug } from "@/lib/sections";
import { SectionDocBodyClient } from "@/app/[section]/SectionDocBodyClient";

export async function generateWideSectionMetadata(section: WideSectionSlug): Promise<Metadata> {
  const config = SECTION_CONFIG[section as keyof typeof SECTION_CONFIG];
  const page = config.source.getPage([section]);
  if (!page) return { title: "Not Found" };
  return {
    title: page.data.title,
    description: page.data.description ?? undefined,
  };
}

type Props = { section: WideSectionSlug };

export default async function WideSectionPage({ section }: Props) {
  if (!WIDE_SECTIONS.has(section)) notFound();
  const config = SECTION_CONFIG[section as keyof typeof SECTION_CONFIG];
  const page = config.source.getPage([section]);
  if (!page) notFound();

  return (
    <SectionDocBodyClient
      collection={config.collection}
      slugPromise={Promise.resolve({ slug: [section] })}
    />
  );
}
