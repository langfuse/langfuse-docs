"use client";

import { use } from "react";
import { usePathname } from "next/navigation";
import { DocsBody } from "fumadocs-ui/page";
import { getMDXComponents } from "@/mdx-components";
import { getSectionDocLoader } from "@/lib/section-loaders.generated";
import { notFound } from "next/navigation";
import { CopyMarkdownButton, DocsFeedback, DocsSupport } from "@/components/MainContentWrapper";
import { NotebookBanner } from "@/components/NotebookBanner";
import { COOKBOOK_ROUTE_MAPPING } from "@/lib/cookbook_route_mapping";

type Props = {
  collection: string;
  slugPromise: Promise<{ slug?: string[] }>;
  /** Optional version label (e.g. "Version: v3") shown next to Copy page. Used by self-hosting. */
  versionLabel?: string | null;
};

const loaderPromiseCache = new Map<
  string,
  ReturnType<NonNullable<ReturnType<typeof getSectionDocLoader>>>
>();

function getCachedLoaderPromise(
  collection: string,
  slug: string[],
  loader: NonNullable<ReturnType<typeof getSectionDocLoader>>
) {
  const key = `${collection}:${slug.length === 0 ? "" : slug.join("/")}`;
  let p = loaderPromiseCache.get(key);
  if (!p) {
    p = loader();
    loaderPromiseCache.set(key, p);
  }
  return p;
}

/**
 * Renders section doc body in DocsBody (same as docs DocBodyClient).
 * Use in app/integrations, app/self-hosting, app/guides, app/library.
 */
export function SectionDocBodyClientWithDocsBody({
  collection,
  slugPromise,
  versionLabel,
}: Props) {
  const params = use(slugPromise);
  const slug = params.slug ?? [];
  const loader = getSectionDocLoader(collection, slug);
  if (!loader) notFound();

  const mod = use(getCachedLoaderPromise(collection, slug, loader));
  const MDX = mod.default;
  const pathname = usePathname();
  const cookbook = COOKBOOK_ROUTE_MAPPING.find((c) => c.path === pathname);

  return (
    <DocsBody>
      <div className="mb-4 flex flex-wrap gap-2 items-center">
        {versionLabel != null && versionLabel !== "" && (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-secondary text-secondary-foreground">
            {versionLabel}
          </span>
        )}
        <CopyMarkdownButton key={pathname} />
      </div>
      {cookbook && <NotebookBanner src={cookbook.ipynbPath} className="mb-4" />}
      <MDX components={getMDXComponents()} />
      <hr className="my-4 border-t dark:border-neutral-800" />
      <div className="flex flex-wrap gap-6 justify-between items-center py-6" id="docs-feedback">
        <DocsFeedback key={pathname} />
        <DocsSupport />
      </div>
    </DocsBody>
  );
}
