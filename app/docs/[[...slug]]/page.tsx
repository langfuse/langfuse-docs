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

  return (
    <DocsPage toc={toc} tableOfContent={{ footer: <DocsContributors /> }}>
      <h1 className="mb-2 text-4xl font-bold tracking-tight">
        {page.data.title}
      </h1>
      {page.data.description && (
        <p className="mb-6 text-lg text-fd-muted-foreground">
          {page.data.description}
        </p>
      )}
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
