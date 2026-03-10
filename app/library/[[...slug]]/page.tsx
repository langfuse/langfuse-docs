import type { Metadata } from "next";
import { librarySource } from "@/lib/source";
import { buildOgImageUrl } from "@/lib/og-url";
import { DocsPage } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { SectionDocBodyClientWithDocsBody } from "@/components/SectionDocBodyClientWithDocsBody";
import { DocsContributors } from "@/components/DocsContributors";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

const COLLECTION = "library";
const CONTENT_DIR = "content/library";

export default async function LibraryPage(props: PageProps) {
  const params = await props.params;
  const slug = params.slug ?? [];
  const page = librarySource.getPage(slug);

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
  const page = librarySource.getPage(slug);
  if (!page)
    return {
      title: "Not Found",
    };
  const ogImage = buildOgImageUrl({
    title: page.data.title,
    description: page.data.description,
    section: "Library",
  });
  return {
    title: page.data.title,
    description: page.data.description ?? undefined,
    openGraph: { images: [{ url: ogImage }] },
    twitter: { images: [{ url: ogImage }] },
  };
}

export function generateStaticParams() {
  return librarySource.generateParams();
}
