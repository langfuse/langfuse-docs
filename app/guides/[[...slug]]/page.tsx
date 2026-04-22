import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { guidesSource } from "@/lib/source";
import { DocsChromePage } from "@/components/DocsChromePage";
import { buildSectionMetadata } from "@/lib/mdx-page";
import { buildPageUrl } from "@/lib/og-url";
import { COOKBOOK_ROUTE_MAPPING } from "@/lib/cookbook_route_mapping";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function GuidesPage({ params }: PageProps) {
  const { slug = [] } = await params;
  const page = guidesSource.getPage(slug);
  if (!page) notFound();
  return <DocsChromePage page={page} />;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const page = guidesSource.getPage(slug);
  if (!page) return { title: "Not Found" };

  // Guides generated from cookbook notebooks can point their canonical URL at
  // the corresponding docs page via COOKBOOK_ROUTE_MAPPING. An explicit
  // `canonical` field in frontmatter still wins.
  const pagePath = `/guides${slug.length > 0 ? `/${slug.join("/")}` : ""}`;
  const mapping = COOKBOOK_ROUTE_MAPPING.find(
    (r) => r.path === pagePath && r.canonicalPath,
  );
  const canonicalFallback = mapping?.canonicalPath
    ? buildPageUrl(mapping.canonicalPath)
    : null;

  return buildSectionMetadata(page, "guides", "Guides", slug, {
    canonicalFallback,
  });
}

export function generateStaticParams() {
  return guidesSource.generateParams();
}
