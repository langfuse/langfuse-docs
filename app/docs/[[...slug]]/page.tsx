import type { Metadata } from "next";
import { source } from "@/lib/source";
import { DocsPage } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { DocBodyClient } from "./DocBodyClient";
import { DocsContributors } from "@/components/DocsContributors";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function DocPage(props: PageProps) {
  const params = await props.params;
  const slug = params.slug ?? [];
  const page = source.getPage(slug);

  if (!page) notFound();

  const { toc } = page.data;

  const filePath = `content/docs/${slug.length === 0 ? "index" : slug.join("/")}.mdx`;

  return (
    <DocsPage
      toc={toc}
      breadcrumb={{ includePage: true, includeRoot: true }}
      tableOfContent={{ footer: <DocsContributors /> }}
      editOnGithub={{
        owner: "langfuse",
        repo: "langfuse-docs",
        sha: "main",
        path: filePath,
      }}
    >
      <DocBodyClient slugPromise={props.params} />
    </DocsPage>
  );
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug ?? [];
  const page = source.getPage(slug);
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
  return source.generateParams();
}
