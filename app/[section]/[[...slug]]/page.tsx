import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsPage } from "fumadocs-ui/page";
import type { TOCItemType } from "fumadocs-core/toc";
import { SECTION_CONFIG, SECTION_SLUGS, MARKETING_SECTION_SLUGS, WIDE_SECTIONS, DOCS_STYLE_APP_SECTIONS, POST_SECTIONS, CHANGELOG_SECTIONS } from "@/lib/sections";
import type { SectionSlug } from "@/lib/sections";
import { MARKETING_SLUGS } from "@/lib/source";
import { SectionDocBodyClient } from "../SectionDocBodyClient";
import { DocsContributors } from "@/components/DocsContributors";

type PageProps = {
  params: Promise<{ section: string; slug?: string[] }>;
};

export default async function SectionDocPage(props: PageProps) {
  const params = await props.params;
  const { section, slug: slugParam } = params;
  const slug = slugParam ?? [];
  const isMarketing = MARKETING_SECTION_SLUGS.has(section as (typeof MARKETING_SLUGS)[number]);
  const isPost = POST_SECTIONS.has(section);
  const isChangelog = CHANGELOG_SECTIONS.has(section);
  const isCollectionIndex = section === "users" && slug.length === 0;
  const effectiveSlug = isMarketing ? [section] : slug;

  if (!SECTION_SLUGS.includes(section as SectionSlug)) {
    notFound();
  }
  if (WIDE_SECTIONS.has(section)) {
    notFound(); /* wide sections are served by app/(wide)/<section>/page.tsx */
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
    <DocsPage
      toc={isMarketing || isChangelog || isCollectionIndex ? undefined : toc}
      full={isCollectionIndex}
      className={isPost && !isChangelog && !isCollectionIndex ? "max-w-3xl" : "max-w-full"}
      breadcrumb={{ includePage: !isMarketing && !isPost }}
      footer={isMarketing || isPost ? { enabled: false } : undefined}
      tableOfContent={isMarketing || isChangelog || isCollectionIndex ? { enabled: false } : { footer: <DocsContributors /> }}
      tableOfContentPopover={{ enabled: false }}
    >
      <SectionDocBodyClient
        collection={config.collection}
        slugPromise={Promise.resolve({ slug: effectiveSlug })}
        withProse
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

  if (!SECTION_SLUGS.includes(section as SectionSlug) || WIDE_SECTIONS.has(section)) {
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
    if (DOCS_STYLE_APP_SECTIONS.has(section)) continue;
    if (WIDE_SECTIONS.has(section)) continue; /* handled by app/(wide)/<section>/page.tsx */
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
