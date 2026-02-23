import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsPage } from "fumadocs-ui/layouts/flux/page";
import type { TOCItemType } from "fumadocs-core/toc";
import { SECTION_CONFIG, SECTION_SLUGS, MARKETING_SECTION_SLUGS } from "@/lib/sections";
import type { SectionSlug } from "@/lib/sections";
import { MARKETING_SLUGS } from "@/lib/source";
import { SectionDocBodyClient } from "../SectionDocBodyClient";

type PageProps = {
  params: Promise<{ section: string; slug?: string[] }>;
};

export default async function SectionDocPage(props: PageProps) {
  const params = await props.params;
  const { section, slug: slugParam } = params;
  const slug = slugParam ?? [];
  const isMarketing = MARKETING_SECTION_SLUGS.has(section as (typeof MARKETING_SLUGS)[number]);
  const effectiveSlug = isMarketing ? [section] : slug;

  if (!SECTION_SLUGS.includes(section as SectionSlug)) {
    notFound();
  }
  const config = SECTION_CONFIG[section as keyof typeof SECTION_CONFIG];
  const page = config.source.getPage(effectiveSlug);

  if (!page) notFound();

  const data = page.data as typeof page.data & {
    load?: () => Promise<{ body: unknown; toc: TOCItemType[] }>;
    toc?: TOCItemType[];
  };
  const loaded =
    typeof data.load === "function"
      ? await data.load()
      : { body: data.body, toc: data.toc ?? [] };
  const toc: TOCItemType[] = loaded.toc ?? [];

  return (
    <DocsPage toc={toc} className="max-w-full">
      <SectionDocBodyClient
        collection={config.collection}
        slugPromise={Promise.resolve({ slug: effectiveSlug })}
      />
    </DocsPage>
  );
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const { section, slug: slugParam } = params;
  const slug = slugParam ?? [];
  const isMarketing = MARKETING_SECTION_SLUGS.has(section as (typeof MARKETING_SLUGS)[number]);
  const effectiveSlug = isMarketing ? [section] : slug;

  if (!SECTION_SLUGS.includes(section as SectionSlug)) {
    return { title: "Not Found" };
  }
  const config = SECTION_CONFIG[section as keyof typeof SECTION_CONFIG];
  const page = config.source.getPage(effectiveSlug);
  if (!page) return { title: "Not Found" };
  return {
    title: page.data.title,
    description: page.data.description ?? undefined,
  };
}

export function generateStaticParams() {
  const params: { section: string; slug?: string[] }[] = [];
  for (const section of SECTION_SLUGS) {
    const config = SECTION_CONFIG[section];
    const isMarketing = MARKETING_SECTION_SLUGS.has(section as (typeof MARKETING_SLUGS)[number]);
    if (isMarketing) {
      params.push({ section });
    } else {
      const slugs = config.source.generateParams();
      for (const { slug } of slugs) {
        params.push(slug.length > 0 ? { section, slug } : { section });
      }
    }
  }
  return params;
}
