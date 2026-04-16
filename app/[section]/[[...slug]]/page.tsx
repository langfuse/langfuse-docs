import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsPage } from "fumadocs-ui/page";
import type { TOCItemType } from "fumadocs-core/toc";
import {
  SECTION_CONFIG,
  SECTION_SLUGS,
  MARKETING_SECTIONS,
  DOCS_STYLE_APP_SECTIONS,
  POST_SECTIONS,
  CHANGELOG_SECTIONS,
} from "@/lib/section-registry";
import { usersSource, changelogSource } from "@/lib/source";
import { sortCustomerStoriesByMetaOrder } from "@/lib/sortCustomerStoriesByMeta";
import { buildOgImageUrl, buildPageUrl } from "@/lib/og-url";
import { DocsTocFooter } from "@/components/DocsTocFooter";
import { DocBodyChrome } from "@/components/DocBodyChrome";
import { getMDXComponents } from "@/mdx-components";
import type { ComponentType } from "react";
import { ChangelogFrontMatterProvider } from "@/components/changelog/ChangelogFrontMatterContext";
import type { ChangelogFrontMatter } from "@/components/changelog/ChangelogFrontMatterContext";
import { WrappedDataProvider } from "@/components/wrapped/WrappedDataContext";
import { DocsAndPageFooter } from "@/components/DocsAndPageFooter";

type PageProps = {
  params: Promise<{ section: string; slug?: string[] }>;
};

export default async function SectionDocPage(props: PageProps) {
  const params = await props.params;
  const { section, slug: slugParam } = params;
  const slug = slugParam ?? [];
  const isMarketing = MARKETING_SECTIONS.has(section);
  const isPost = POST_SECTIONS.has(section);
  const isChangelog = CHANGELOG_SECTIONS.has(section);
  const isCollectionIndex = section === "users" && slug.length === 0;
  const effectiveSlug = isMarketing ? [section] : slug;

  if (!SECTION_SLUGS.includes(section)) {
    notFound();
  }
  const config = SECTION_CONFIG[section];
  const page = config.source.getPage(effectiveSlug);

  if (!page) notFound();

  const data = page.data as typeof page.data & {
    load?: () => Promise<{ body: unknown; toc: TOCItemType[] }>;
    body?: unknown;
    toc?: TOCItemType[];
  };
  const loaded =
    typeof data.load === "function"
      ? await data.load()
      : { body: data.body, toc: data.toc ?? [] };
  const toc: TOCItemType[] = loaded.toc ?? [];

  const MDX = loaded.body as ComponentType<{ components?: Record<string, ComponentType> }>;
  const bodyClient = (
    <DocBodyChrome withProse>
      <MDX components={getMDXComponents()} />
    </DocBodyChrome>
  );

  // Strip functions and non-serializable objects from page.data / frontMatter
  // before passing to client component context providers.
  function primitiveOnly(obj: Record<string, unknown>): Record<string, unknown> {
    return Object.fromEntries(
      Object.entries(obj).filter(([, v]) =>
        v === null ||
        typeof v === "string" ||
        typeof v === "number" ||
        typeof v === "boolean" ||
        (Array.isArray(v) && v.every((item) => typeof item !== "function"))
      )
    );
  }

  // Wrap with context providers so client components in MDX can receive
  // server-fetched data without importing lib/source themselves.
  const bodyWithContext = isChangelog ? (
    <ChangelogFrontMatterProvider
      frontMatter={primitiveOnly(page.data as unknown as Record<string, unknown>) as ChangelogFrontMatter}
    >
      {bodyClient}
    </ChangelogFrontMatterProvider>
  ) : section === "wrapped" ? (
    <WrappedDataProvider
      data={{
        usersPages: sortCustomerStoriesByMetaOrder(
          usersSource.getPages().map((p) => ({
            route: p.url,
            name: p.data.title,
            title: p.data.title,
            frontMatter: primitiveOnly(p.data as unknown as Record<string, unknown>),
          })),
        ),
        changelogPages: changelogSource.getPages().map((p) => ({
          route: p.url,
          name: p.data.title,
          title: p.data.title,
          frontMatter: primitiveOnly(p.data as unknown as Record<string, unknown>),
        })),
      }}
    >
      {bodyClient}
    </WrappedDataProvider>
  ) : (
    bodyClient
  );

  if (isMarketing) {
    return (
      <div className="mx-auto w-full px-4 sm:px-8 md:px-0 md:max-w-[680px] xl:max-w-[840px] py-10 md:py-16">
        {bodyWithContext}
      </div>
    );
  }

  return (
    <DocsPage
      toc={isChangelog || isCollectionIndex ? undefined : toc}
      full={isCollectionIndex}
      className={
        isPost && !isChangelog && !isCollectionIndex
          ? "max-w-3xl post-page"
          : isChangelog
            ? "max-w-full changelog-page post-page"
            : "max-w-full"
      }
      breadcrumb={{ includePage: !isPost }}
      footer={isPost ? { enabled: false } : { component: <DocsAndPageFooter /> }}
      tableOfContent={isChangelog || isCollectionIndex ? { enabled: false } : { footer: <DocsTocFooter pageTitle={page.data.title} /> }}
    >
      {bodyWithContext}
    </DocsPage>
  );
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const { section, slug: slugParam } = params;
  const slug = slugParam ?? [];
  const isMarketing = MARKETING_SECTIONS.has(section);
  const effectiveSlug = isMarketing ? [section] : slug;

  if (!SECTION_SLUGS.includes(section)) {
    return { title: "Not Found" };
  }
  const config = SECTION_CONFIG[section];
  const page = config.source.getPage(effectiveSlug);

  if (!page) return { title: "Not Found" };
  const pageData = page.data as typeof page.data & {
    canonical?: string | null;
    noindex?: boolean | null;
    seoTitle?: string | null;
    ogImage?: string | null;
    ogVideo?: string | null;
  };
  const pagePath = isMarketing
    ? `/${section}`
    : `/${section}${slug.length > 0 ? `/${slug.join("/")}` : ""}`;
  const canonicalUrl = pageData.canonical ?? buildPageUrl(pagePath);
  const seoTitle = pageData.seoTitle || page.data.title;
  const ogImage = buildOgImageUrl({
    title: seoTitle,
    description: page.data.description,
    section: config.title,
    staticOgImage: pageData.ogImage,
  });
  // ogVideo may be an absolute URL (https://...) or a site-relative path (/images/...)
  const ogVideoUrl = pageData.ogVideo
    ? pageData.ogVideo.startsWith("http")
      ? pageData.ogVideo
      : buildPageUrl(pageData.ogVideo)
    : null;
  return {
    title: seoTitle,
    description: page.data.description ?? undefined,
    alternates: { canonical: canonicalUrl },
    ...(pageData.noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      images: [{ url: ogImage }],
      url: canonicalUrl,
      ...(ogVideoUrl ? { videos: [{ url: ogVideoUrl }] } : {}),
    },
    twitter: { images: [{ url: ogImage }] },
  };
}

export function generateStaticParams() {
  const params: { section: string; slug?: string[] }[] = [];
  for (const section of SECTION_SLUGS) {
    if (DOCS_STYLE_APP_SECTIONS.has(section)) continue;
    const config = SECTION_CONFIG[section];
    const isMarketing = MARKETING_SECTIONS.has(section);
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
