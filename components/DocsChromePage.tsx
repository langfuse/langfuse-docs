import "server-only";
import type { ComponentProps, ComponentType } from "react";
import { DocsPage } from "fumadocs-ui/layouts/docs/page";
import type { TOCItemType } from "fumadocs-core/toc";

import { DocsTocFooter } from "@/components/DocsTocFooter";
import { DocBodyChrome } from "@/components/DocBodyChrome";
import { DocsAndPageFooter } from "@/components/DocsAndPageFooter";
import { getMDXComponents } from "@/mdx-components";

type BodyChromeProps = Omit<ComponentProps<typeof DocBodyChrome>, "children">;

/* eslint-disable @typescript-eslint/no-explicit-any */
type LoadedPage = { data: any };
/* eslint-enable @typescript-eslint/no-explicit-any */

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
}: {
  page: LoadedPage;
  /** Extra props forwarded to `DocBodyChrome` (e.g. `versionLabel` on self-hosting). */
  bodyChromeProps?: BodyChromeProps;
}) {
  const data = page.data;
  const loaded =
    typeof data.load === "function"
      ? await data.load()
      : { body: data.body, toc: data.toc ?? [] };

  const toc: TOCItemType[] = loaded.toc ?? [];
  const MDX = loaded.body as ComponentType<{
    components?: Record<string, ComponentType>;
  }>;

  return (
    <DocsPage
      toc={toc}
      breadcrumb={{ includePage: true, includeRoot: true }}
      tableOfContent={{ footer: <DocsTocFooter pageTitle={data.title} /> }}
      footer={{ component: <DocsAndPageFooter /> }}
    >
      <DocBodyChrome {...bodyChromeProps}>
        <MDX components={getMDXComponents()} />
      </DocBodyChrome>
    </DocsPage>
  );
}
