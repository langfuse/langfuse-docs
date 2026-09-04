import "server-only";
import type { ComponentProps, ComponentType, ReactNode } from "react";
import { DocsPage } from "fumadocs-ui/page";
import type { TOCItemType } from "fumadocs-core/toc";

import { DocsTocFooter } from "@/components/DocsTocFooter";
import { DocBodyChrome } from "@/components/DocBodyChrome";
import { DocsAndPageFooter } from "@/components/DocsAndPageFooter";
import { DocsBreadcrumb } from "@/components/DocsBreadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListJsonLd, softwareApplicationJsonLd } from "@/lib/json-ld";
import { getGithubEditUrl } from "@/lib/github-edit-url";
import { getMDXComponents } from "@/mdx-components";

type BodyChromeProps = Omit<ComponentProps<typeof DocBodyChrome>, "children">;

type LoadedPage = { data: any; url?: string };

const getIsoDate = (value: unknown): string | undefined => {
  if (value == null) return undefined;

  const date = new Date(value as string | number | Date);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

/**
 * Shared `<DocsPage>` chrome for every sidebar-based section — resolves the
 * page body (supporting Fumadocs' async MDX `data.load()` path as well as the
 * legacy sync `data.body`), renders breadcrumb + TOC footer + page footer, and
 * forwards the MDX through `DocBodyChrome`.
 *
 * Routes stay explicit: they fetch their own page, `notFound()` when missing,
 * and render `<DocsChromePage page={page} />` — matching Fumadocs' idiomatic
 * one-file-per-route pattern with the duplication factored out.
 */
export async function DocsChromePage({
  page,
  bodyChromeProps,
  topPrefix,
  bottomSuffix,
}: {
  page: LoadedPage;
  /** Extra props forwarded to `DocBodyChrome` (e.g. `versionLabel` on self-hosting). */
  bodyChromeProps?: BodyChromeProps;
  /** Optional node rendered inside DocBodyChrome, before the MDX body. */
  topPrefix?: ReactNode;
  /** Optional node rendered inside DocBodyChrome, after the MDX body. */
  bottomSuffix?: ReactNode;
}) {
  const data = page.data;
  const loaded =
    typeof data.load === "function"
      ? await data.load()
      : { body: data.body, toc: data.toc ?? [] };

  const toc: TOCItemType[] = loaded.toc ?? [];
  const lastModified = getIsoDate(data.lastModified);
  const MDX = loaded.body as ComponentType<{
    components?: Record<string, ComponentType>;
  }>;
  const pageUrl = typeof page.url === "string" ? page.url : undefined;
  const breadcrumbJsonLd = pageUrl ? breadcrumbListJsonLd(pageUrl) : null;

  return (
    <DocsPage
      toc={toc}
      lastUpdate={lastModified}
      breadcrumb={{ component: <DocsBreadcrumb /> }}
      tableOfContent={{
        footer: (
          <DocsTocFooter
            pageTitle={data.title}
            lastModified={lastModified}
            editUrl={pageUrl ? getGithubEditUrl(pageUrl) : null}
          />
        ),
      }}
      footer={{ component: <DocsAndPageFooter /> }}
    >
      <DocBodyChrome {...bodyChromeProps}>
        {breadcrumbJsonLd ? <JsonLd data={breadcrumbJsonLd} /> : null}
        {pageUrl === "/docs" ? (
          <JsonLd data={softwareApplicationJsonLd()} />
        ) : null}
        {topPrefix}
        <MDX components={getMDXComponents()} />
        {bottomSuffix}
      </DocBodyChrome>
    </DocsPage>
  );
}
