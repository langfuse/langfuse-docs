import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resourcesSource } from "@/lib/source";
import { DocsChromePage } from "@/components/DocsChromePage";
import { buildSectionMetadata } from "@/lib/mdx-page";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function ResourcesPage({ params }: PageProps) {
  const { slug = [] } = await params;
  const page = resourcesSource.getPage(slug);
  if (!page) notFound();
  return <DocsChromePage page={page} />;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const page = resourcesSource.getPage(slug);
  if (!page) return { title: "Not Found" };
  return buildSectionMetadata(page, "resources", "Resources", slug);
}

export function generateStaticParams() {
  return resourcesSource.generateParams();
}
