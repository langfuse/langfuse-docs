"use client";

import { use } from "react";
import { DocsBody } from "fumadocs-ui/page";
import { getMDXComponents } from "../../../mdx-components";
import { getDocLoader } from "./doc-loaders.client";
import { notFound } from "next/navigation";

type DocBodyClientProps = {
  slugPromise: Promise<{ slug?: string[] }>;
};

// Cache loader promises by slug so use() receives a stable promise (required by React)
const loaderPromiseCache = new Map<string, ReturnType<ReturnType<typeof getDocLoader>>>();

function getCachedLoaderPromise(slug: string[], loader: NonNullable<ReturnType<typeof getDocLoader>>) {
  const key = slug.length === 0 ? "" : slug.join("/");
  let p = loaderPromiseCache.get(key);
  if (!p) {
    p = loader();
    loaderPromiseCache.set(key, p);
  }
  return p;
}

/**
 * Renders doc body on the client via dynamic imports (doc-loaders.client).
 * Avoids passing MDX component functions from server and avoids importing lib/source (no fs in client).
 */
export function DocBodyClient({ slugPromise }: DocBodyClientProps) {
  const params = use(slugPromise);
  const slug = params.slug ?? [];
  const loader = getDocLoader(slug);
  if (!loader) notFound();

  const mod = use(getCachedLoaderPromise(slug, loader));
  const MDX = mod.default;

  return (
    <DocsBody>
      <MDX components={getMDXComponents()} />
    </DocsBody>
  );
}
