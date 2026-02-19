"use client";

import { use } from "react";
import { DocsBody } from "fumadocs-ui/page";
import { getMDXComponents } from "@/mdx-components";
import { getSectionDocLoader } from "@/lib/section-loaders.generated";
import { notFound } from "next/navigation";

type SectionDocBodyClientProps = {
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

export function SectionDocBodyClient({
  collection,
  slugPromise,
}: SectionDocBodyClientProps) {
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
