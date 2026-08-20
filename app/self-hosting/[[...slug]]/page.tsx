import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { selfHostingSource } from "@/lib/source";
import { DocsChromePage } from "@/components/DocsChromePage";
import SelfHostHelpFooter from "@/components-mdx/self-host-help-footer.mdx";
import { buildSectionMetadata } from "@/lib/mdx-page";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function SelfHostingPage({ params }: PageProps) {
  const { slug = [] } = await params;
  const page = selfHostingSource.getPage(slug);
  if (!page) notFound();
  // Self-hosting pages may carry `label` (e.g. "Version: v3") and `support`
  // (e.g. "Community") frontmatter fields that the docs chrome renders next to
  // the copy button.
  const { label, support } = page.data as { label?: string; support?: string };
  return (
    <DocsChromePage
      page={page}
      bodyChromeProps={{
        versionLabel: label ?? null,
        supportLabel: support ?? null,
      }}
      bottomSuffix={<SelfHostHelpFooter />}
    />
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const page = selfHostingSource.getPage(slug);
  if (!page) return { title: "Not Found" };
  return buildSectionMetadata(page, "self-hosting", "Self-hosting", slug);
}

export function generateStaticParams() {
  return selfHostingSource.generateParams();
}
