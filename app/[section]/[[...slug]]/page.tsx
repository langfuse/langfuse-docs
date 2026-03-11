import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsPage, DocsBody } from "fumadocs-ui/page";
import type { TOCItemType } from "fumadocs-core/toc";
import { SECTION_CONFIG, SECTION_SLUGS, MARKETING_SECTION_SLUGS, WIDE_SECTIONS, DOCS_STYLE_APP_SECTIONS, POST_SECTIONS, CHANGELOG_SECTIONS } from "@/lib/sections";
import type { SectionSlug } from "@/lib/sections";
import { MARKETING_SLUGS } from "@/lib/source";
import { buildOgImageUrl } from "@/lib/og-url";
import { SectionDocBodyClient } from "../SectionDocBodyClient";
import { DocsContributors } from "@/components/DocsContributors";
import { FaqPreview } from "@/components/faq/FaqPreview";
import { formatTag } from "@/components/faq/FaqIndex";

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

  // Special case: /faq/tag/[tag] pages without dedicated content files
  if (!page && section === "faq" && slug.length === 2 && slug[0] === "tag") {
    const tag = decodeURIComponent(slug[1]);
    return (
      <DocsPage
        toc={[]}
        breadcrumb={{ includePage: true, includeRoot: true }}
        tableOfContent={{ footer: undefined }}
      >
        <DocsBody>
          <h1>FAQ: {formatTag(tag)}</h1>
          <FaqPreview tags={[tag]} />
        </DocsBody>
      </DocsPage>
    );
  }

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
      tableOfContent={isMarketing || isChangelog || isCollectionIndex ? { enabled: false } : { footer: <DocsContributors pageTitle={page.data.title} /> }}
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

  // Metadata for dynamic /faq/tag/[tag] pages
  if (!page && section === "faq" && slug.length === 2 && slug[0] === "tag") {
    const tag = decodeURIComponent(slug[1]);
    const title = `FAQ: ${formatTag(tag)}`;
    return { title, description: `Frequently asked questions about ${formatTag(tag)}.` };
  }

  if (!page) return { title: "Not Found" };
  const pageData = page.data as typeof page.data & {
    ogImage?: string | null;
    ogVideo?: string | null;
  };
  const ogImage = buildOgImageUrl({
    title: page.data.title,
    description: page.data.description,
    section: config.title,
    staticOgImage: pageData.ogImage,
  });
  return {
    title: page.data.title,
    description: page.data.description ?? undefined,
    openGraph: {
      images: [{ url: ogImage }],
      ...(pageData.ogVideo ? { videos: [{ url: "https://langfuse.com" + pageData.ogVideo }] } : {}),
    },
    twitter: { images: [{ url: ogImage }] },
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

  // Add dynamic /faq/tag/[tag] pages for tags without dedicated content files
  const faqConfig = SECTION_CONFIG["faq"];
  const allTags = new Set<string>();
  for (const p of faqConfig.source.getPages()) {
    const tags = ((p.data as unknown as Record<string, unknown>).tags as string[] | undefined) ?? [];
    for (const t of tags) allTags.add(t);
  }
  for (const tag of Array.from(allTags)) {
    if (!faqConfig.source.getPage(["tag", tag])) {
      params.push({ section: "faq", slug: ["tag", tag] });
    }
  }

  return params;
}
