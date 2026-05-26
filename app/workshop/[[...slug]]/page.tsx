import type { Metadata } from "next";
import { DocsBody, DocsPage } from "fumadocs-ui/page";
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

function hasWorkshopContent() {
  return workshopSource.getPages().length > 0;
}

function WorkshopContentUnavailablePage() {
  return (
    <DocsPage
      toc={[]}
      tableOfContent={{ enabled: false }}
      footer={{ enabled: false }}
    >
      <DocsBody className="flex-1">
        <h1>Workshop content is not available</h1>
        <p>
          Workshop pages are generated locally from the public{" "}
          <code>langfuse/langfuse-workshop</code> repository and are not checked
          into this repository.
        </p>
        <p>Run this command, then refresh the page:</p>
        <pre>
          <code>pnpm workshop:sync</code>
        </pre>
      </DocsBody>
    </DocsPage>
  );
}

export default async function WorkshopPage({ params }: PageProps) {
  const { slug = [] } = await params;
  if (!hasWorkshopContent()) return <WorkshopContentUnavailablePage />;

  redirectFolderIndexes(slug);

  const page = workshopSource.getPage(slug);
  if (!page) notFound();
  return <DocsChromePage page={page} />;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  if (!hasWorkshopContent()) {
    return {
      title: "Workshop content is not available",
      description: "Run pnpm workshop:sync to generate workshop pages locally.",
    };
  }

  const page = workshopSource.getPage(slug);
  if (!page) return { title: "Not Found" };
  return buildSectionMetadata(page, "workshop", "Workshop", slug);
}

export function generateStaticParams() {
  return workshopSource.generateParams();
}
