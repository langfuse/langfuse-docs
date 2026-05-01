import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { selfHostingSource } from "@/lib/source";
import { DocsChromePage } from "@/components/DocsChromePage";
import { buildSectionMetadata } from "@/lib/mdx-page";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function SelfHostingPage({ params }: PageProps) {
  const { slug = [] } = await params;
  const page = selfHostingSource.getPage(slug);
  if (!page) notFound();
  // Self-hosting pages may carry a `label` frontmatter field (e.g. "Version: v3")
  // that the docs chrome renders next to the copy button.
  const versionLabel = (page.data as { label?: string }).label ?? null;
  return <DocsChromePage page={page} bodyChromeProps={{ versionLabel }} />;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const page = selfHostingSource.getPage(slug);
  if (!page) return { title: "Not Found" };
  return buildSectionMetadata(page, "self-hosting", "Self-hosting", slug);
}

export function generateStaticParams() {
  return selfHostingSource.generateParams();
}
