import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { workshopSource } from "@/lib/source";
import { DocsChromePage } from "@/components/DocsChromePage";
import { buildSectionMetadata } from "@/lib/mdx-page";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

function redirectFolderIndexes(slug: string[]) {
  if (slug.length !== 1) return;
  if (slug[0] === "learner") redirect("/workshop/learner/00-setup");
  if (slug[0] === "instructor") redirect("/workshop/instructor/00-setup");
}

export default async function WorkshopPage({ params }: PageProps) {
  const { slug = [] } = await params;
  redirectFolderIndexes(slug);

  const page = workshopSource.getPage(slug);
  if (!page) notFound();
  return <DocsChromePage page={page} />;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const page = workshopSource.getPage(slug);
  if (!page) return { title: "Not Found" };
  return buildSectionMetadata(page, "workshop", "Workshop", slug);
}

export function generateStaticParams() {
  return workshopSource.generateParams();
}
