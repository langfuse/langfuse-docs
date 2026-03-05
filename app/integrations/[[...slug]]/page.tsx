import type { Metadata } from "next";
import { integrationsSource } from "@/lib/source";
import { DocsPage } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { SectionDocBodyClientWithDocsBody } from "@/components/SectionDocBodyClientWithDocsBody";
import { DocsContributors } from "@/components/DocsContributors";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

const COLLECTION = "integrations";
const CONTENT_DIR = "content/integrations";

export default async function IntegrationsPage(props: PageProps) {
  const params = await props.params;
  const slug = params.slug ?? [];
  const page = integrationsSource.getPage(slug);

  if (!page) notFound();

  const { toc } = page.data;
  const filePath = `${CONTENT_DIR}/${slug.length === 0 ? "index" : slug.join("/")}.mdx`;

  return (
    <DocsPage
      toc={toc}
      breadcrumb={{ includePage: true, includeRoot: true }}
      tableOfContent={{ footer: <DocsContributors pageTitle={page.data.title} /> }}
      editOnGithub={{
        owner: "langfuse",
        repo: "langfuse-docs",
        sha: "main",
        path: filePath,
      }}
    >
      <SectionDocBodyClientWithDocsBody
        collection={COLLECTION}
        slugPromise={props.params}
      />
    </DocsPage>
  );
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug ?? [];
  const page = integrationsSource.getPage(slug);
  if (!page)
    return {
      title: "Not Found",
    };
  return {
    title: page.data.title,
    description: page.data.description ?? undefined,
  };
}

export function generateStaticParams() {
  return integrationsSource.generateParams();
}
