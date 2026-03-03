"use client";

import { use } from "react";
import { usePathname } from "next/navigation";
import { DocsBody } from "fumadocs-ui/page";
import { getMDXComponents } from "@/mdx-components";
import { getSectionDocLoader } from "@/lib/section-loaders.generated";
import { notFound } from "next/navigation";
import { CopyMarkdownButton } from "@/components/MainContentWrapper";

type SectionDocBodyClientProps = {
  collection: string;
  slugPromise: Promise<{ slug?: string[] }>;
  /** When true, wrap in DocsBody (prose) for typography. Use for marketing/docs; false for wide sections (pricing, etc.). */
  withProse?: boolean;
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
  withProse = false,
}: SectionDocBodyClientProps) {
  const params = use(slugPromise);
  const slug = params.slug ?? [];
  const loader = getSectionDocLoader(collection, slug);
  if (!loader) notFound();

  const mod = use(getCachedLoaderPromise(collection, slug, loader));
  const MDX = mod.default;
  const pathname = usePathname();

  const content = <MDX components={getMDXComponents()} />;
  if (withProse) {
    return (
      <DocsBody className="flex-1">
        <div className="mb-4">
          <CopyMarkdownButton key={pathname} />
        </div>
        {content}
      </DocsBody>
    );
  }
  return <div className="flex-1">{content}</div>;
}
