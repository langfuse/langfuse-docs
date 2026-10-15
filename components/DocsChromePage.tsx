import "server-only";
import type { ComponentProps, ComponentType, ReactNode } from "react";
import { DocsPage } from "fumadocs-ui/page";
import type { TOCItemType } from "fumadocs-core/toc";

import { DocsTocFooter } from "@/components/DocsTocFooter";
import { DocBodyChrome } from "@/components/DocBodyChrome";
import { DocsAndPageFooter } from "@/components/DocsAndPageFooter";
import { DocsBreadcrumb } from "@/components/DocsBreadcrumb";
import { getMDXComponents } from "@/mdx-components";
import { CONTENT_DIR_TO_URL_PREFIX } from "@/lib/content-dir-map.js";

type BodyChromeProps = Omit<ComponentProps<typeof DocBodyChrome>, "children">;

type LoadedPage = { data: any; url?: string; path?: string };

/**
 * Content directory (e.g. `content/academy`) a page was loaded from, inferred
 * from its URL via the single source of truth in lib/content-dir-map.js.
 * Collections nested inside another directory (academy/japan) pass
 * `contentDir` explicitly instead.
 */
// Content directories that are not checked into this repository (see
// .gitignore), so no "Edit this page on GitHub" link can point at them.
const UNTRACKED_CONTENT_DIRS = new Set(["workshop"]);

const inferContentDir = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  let best: { dir: string; prefix: string } | undefined;
  for (const [dir, prefix] of Object.entries(CONTENT_DIR_TO_URL_PREFIX)) {
    if (!prefix || UNTRACKED_CONTENT_DIRS.has(dir)) continue;
    const base = `/${prefix}`;
    if (url !== base && !url.startsWith(`${base}/`)) continue;
    if (!best || prefix.length > best.prefix.length) best = { dir, prefix };
  }
  return best ? `content/${best.dir}` : undefined;
};

/**
 * Repo-relative source file of the page, e.g. `content/academy/experiments/index.mdx`.
 * Fumadocs exposes `page.path` relative to the collection directory, which is
 * what lets folder index pages resolve to their real file for the
 * "Edit this page on GitHub" link.
 */
const getRepoSourcePath = (
  page: LoadedPage,
  contentDir?: string,
): string | undefined => {
  const dir = contentDir ?? inferContentDir(page.url);
  if (!dir || !page.path) return undefined;
  return `${dir}/${page.path}`;
};

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
  contentDir,
  bodyChromeProps,
  topPrefix,
  bottomSuffix,
}: {
  page: LoadedPage;
  /** Collection directory override for collections nested in another one, e.g. `content/academy/japan`. */
  contentDir?: string;
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
  const sourcePath = getRepoSourcePath(page, contentDir);
  const MDX = loaded.body as ComponentType<{
    components?: Record<string, ComponentType>;
  }>;

  return (
    <DocsPage
      toc={toc}
      breadcrumb={{ component: <DocsBreadcrumb /> }}
      tableOfContent={{
        footer: (
          <DocsTocFooter lastModified={lastModified} sourcePath={sourcePath} />
        ),
      }}
      footer={{ component: <DocsAndPageFooter /> }}
    >
      <DocBodyChrome {...bodyChromeProps}>
        {topPrefix}
        <MDX components={getMDXComponents()} />
        {bottomSuffix}
      </DocBodyChrome>
    </DocsPage>
  );
}
