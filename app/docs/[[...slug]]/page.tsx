import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { source } from "@/lib/source";
import { DocsChromePage } from "@/components/DocsChromePage";
import { buildSectionMetadata } from "@/lib/mdx-page";
import GatewayUpdateSignup from "@/components-mdx/gateway-update-signup.mdx";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function DocPage({ params }: PageProps) {
  const { slug = [] } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();
  // The gateway overview embeds the signup below its beta callout instead.
  const showGatewaySignup =
    slug[0] === "gateway" && slug.join("/") !== "gateway/overview";
  return (
    <DocsChromePage
      page={page}
      bottomSuffix={showGatewaySignup ? <GatewayUpdateSignup /> : undefined}
    />
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const page = source.getPage(slug);
  if (!page) return { title: "Not Found" };
  return buildSectionMetadata(page, "docs", "Docs", slug);
}

export function generateStaticParams() {
  return source.generateParams();
}
