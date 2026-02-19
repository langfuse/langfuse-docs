import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsPage } from "fumadocs-ui/page";
import { SECTION_CONFIG, SECTION_SLUGS, MARKETING_SECTION_SLUGS } from "@/lib/sections";
import { SectionDocBodyClient } from "../SectionDocBodyClient";

type PageProps = {
  params: Promise<{ section: string; slug?: string[] }>;
};

export default async function SectionDocPage(props: PageProps) {
  const params = await props.params;
  const { section, slug: slugParam } = params;
  const slug = slugParam ?? [];
  const isMarketing = MARKETING_SECTION_SLUGS.has(section);
  const effectiveSlug = isMarketing ? [section] : slug;

  if (!SECTION_SLUGS.includes(section as (typeof SECTION_SLUGS)[number])) {
    notFound();
  }
  const config = SECTION_CONFIG[section as keyof typeof SECTION_CONFIG];
  const page = config.source.getPage(effectiveSlug);

  if (!page) notFound();

  const loaded =
    typeof page.data.load === "function"
      ? await page.data.load()
      : { body: page.data.body, toc: page.data.toc };
  const { toc } = loaded;

  return (
    <DocsPage toc={toc}>
      <h1 className="mb-2 text-4xl font-bold tracking-tight">
        {page.data.title}
      </h1>
      {page.data.description && (
        <p className="mb-6 text-lg text-fd-muted-foreground">
          {page.data.description}
        </p>
      )}
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
  const isMarketing = MARKETING_SECTION_SLUGS.has(section);
  const effectiveSlug = isMarketing ? [section] : slug;

  if (!SECTION_SLUGS.includes(section as (typeof SECTION_SLUGS)[number])) {
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
    const config = SECTION_CONFIG[section as keyof typeof SECTION_CONFIG];
    const isMarketing = MARKETING_SECTION_SLUGS.has(section);
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
