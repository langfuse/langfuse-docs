"use client";

import { use } from "react";
import { DocsBody } from "fumadocs-ui/page";
import { getMDXComponents } from "@/mdx-components";
import { getSectionDocLoader } from "@/lib/section-loaders.generated";
import { notFound } from "next/navigation";

type Props = {
  collection: string;
  slugPromise: Promise<{ slug?: string[] }>;
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
}: Props) {
  const params = use(slugPromise);
  const slug = params.slug ?? [];
  const loader = getSectionDocLoader(collection, slug);
  if (!loader) notFound();

  const mod = use(getCachedLoaderPromise(collection, slug, loader));
  const MDX = mod.default;

  return (
    <DocsBody>
      <MDX components={getMDXComponents()} />
    </DocsBody>
  );
}
