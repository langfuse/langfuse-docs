import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  SECTION_CONFIG,
  DEDICATED_APP_SECTIONS,
  MARKETING_SLUGS,
  SECTION_SLUGS,
  MARKETING_SECTIONS,
} from "@/lib/section-registry";
import { loadPage, buildSectionMetadata, primitiveOnly } from "@/lib/mdx-page";
import { getMDXComponents } from "@/mdx-components";
import { WrappedDataProvider } from "@/components/wrapped/WrappedDataContext";
import { DocBodyChrome } from "@/components/DocBodyChrome";
import { usersSource, changelogSource } from "@/lib/source";
import { sortCustomerStoriesByMetaOrder } from "@/lib/sortCustomerStoriesByMeta";
import { cn } from "@/lib/utils";
import {
  resolveContentWidthClasses,
  type ContentWidthType,
} from "@/lib/content-width";

type PageProps = {
  params: Promise<{ section: string; slug?: string[] }>;
};

export default async function SectionDocPage(props: PageProps) {
  const params = await props.params;
  const { section, slug: slugParam } = params;
  const slug = slugParam ?? [];
  const isMarketing = MARKETING_SECTIONS.has(section as (typeof MARKETING_SLUGS)[number]);
  const effectiveSlug = isMarketing ? [section] : slug;

  if (!SECTION_SLUGS.includes(section)) notFound();
  if (DEDICATED_APP_SECTIONS.has(section)) notFound();

  const config = SECTION_CONFIG[section as keyof typeof SECTION_CONFIG];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await loadPage(config.source, effectiveSlug);
  if (!result) notFound();
  const { MDX, page } = result;

  const contentWidth = (page.data as Record<string, unknown>)
    .contentWidth as ContentWidthType | undefined;

  let bodyClient = <MDX components={getMDXComponents()} />;

  if (section === "wrapped") {
    bodyClient = (
      <WrappedDataProvider
        data={{
          usersPages: sortCustomerStoriesByMetaOrder(
            usersSource.getPages().map((p) => ({
              route: p.url,
              name: p.data.title,
              title: p.data.title,
              frontMatter: primitiveOnly(p.data as unknown as Record<string, unknown>),
            })),
          ),
          changelogPages: changelogSource.getPages().map((p) => ({
            route: p.url,
            name: p.data.title,
            title: p.data.title,
            frontMatter: primitiveOnly(p.data as unknown as Record<string, unknown>),
          })),
        }}
      >
        {bodyClient}
      </WrappedDataProvider>
    );
  }

  return (
    <div
      className={cn(
        "mx-auto w-full py-10 md:py-16",
        resolveContentWidthClasses(contentWidth)
      )}
      data-content-width={contentWidth}
    >
      <DocBodyChrome withProse>{bodyClient}</DocBodyChrome>
    </div>
  );
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const { section, slug: slugParam } = params;
  const slug = slugParam ?? [];
  const isMarketing = MARKETING_SECTIONS.has(section);
  const effectiveSlug = isMarketing ? [section] : slug;

  if (!SECTION_SLUGS.includes(section)) {
    return { title: "Not Found" };
  }
  const config = SECTION_CONFIG[section];
  const page = config.source.getPage(effectiveSlug);

  if (!page) return { title: "Not Found" };
  return buildSectionMetadata(page as any, section, config.title, effectiveSlug);
}

export function generateStaticParams() {
  const params: { section: string; slug?: string[] }[] = [];
  for (const section of SECTION_SLUGS) {
    if (DEDICATED_APP_SECTIONS.has(section)) continue;
    const config = SECTION_CONFIG[section];
    const isMarketing = MARKETING_SECTIONS.has(section);
    if (isMarketing) {
      params.push({ section });
    } else {
      const slugs = config.source.generateParams();
      for (const { slug } of slugs) {
        params.push(slug.length > 0 ? { section, slug } : { section });
      }
    }
  }

  return params;
}
