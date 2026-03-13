import type { Metadata } from "next";
import { librarySource } from "@/lib/source";
import { buildOgImageUrl, buildPageUrl } from "@/lib/og-url";
import { DocsPage } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { DocsContributors } from "@/components/DocsContributors";
import { DocBodyChrome } from "@/components/DocBodyChrome";
import { getMDXComponents } from "@/mdx-components";
import type { ComponentType } from "react";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function LibraryPage(props: PageProps) {
  const params = await props.params;
  const slug = params.slug ?? [];
  const page = librarySource.getPage(slug);

  if (!page) notFound();

  const { toc } = page.data;
  const MDX = page.data.body as ComponentType<{ components?: Record<string, ComponentType> }>;

  return (
    <DocsPage
      toc={toc}
      breadcrumb={{ includePage: true, includeRoot: true }}
      tableOfContent={{ footer: <DocsContributors pageTitle={page.data.title} /> }}
    >
      <DocBodyChrome>
        <MDX components={getMDXComponents()} />
      </DocBodyChrome>
    </DocsPage>
  );
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug ?? [];
  const page = librarySource.getPage(slug);
  if (!page)
    return {
      title: "Not Found",
    };
  const pageData = page.data as typeof page.data & {
    canonical?: string | null;
    seoTitle?: string | null;
  };
  const pagePath = `/library${slug.length > 0 ? `/${slug.join("/")}` : ""}`;
  const canonicalUrl = pageData.canonical ?? buildPageUrl(pagePath);
  const seoTitle = pageData.seoTitle || page.data.title;
  const ogImage = buildOgImageUrl({
    title: seoTitle,
    description: page.data.description,
    section: "Library",
  });
  return {
    title: seoTitle,
    description: page.data.description ?? undefined,
    alternates: { canonical: canonicalUrl },
    openGraph: { images: [{ url: ogImage }], url: canonicalUrl },
    twitter: { images: [{ url: ogImage }] },
  };
}

export function generateStaticParams() {
  return librarySource.generateParams();
}
