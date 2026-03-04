import { use } from "react";
import { notFound } from "next/navigation";
import { Layout } from "@/components/layout";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import {
  SECTION_CONFIG,
  SECTION_SLUGS,
  DOCS_STYLE_APP_SECTIONS,
  MARKETING_SECTION_SLUGS,
  WIDE_SECTIONS,
  POST_SECTIONS,
  CHANGELOG_SECTIONS,
} from "@/lib/sections";
import { MenuSwitcher } from "@/components/MenuSwitcher";
import { MainContentWrapper } from "@/components/MainContentWrapper";
import { SectionLayoutWrapper } from "./SectionLayoutWrapper";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ section: string }>;
};

const contentWrapperClass = "mx-auto w-full max-w-4xl";

// Synchronous server component — keeps the same RSC context-propagation behaviour
// as app/docs/layout.tsx (which is also sync). Using React.use() to unwrap the
// Next.js 15 params Promise without making the component async.
export default function SectionLayout({ children, params }: LayoutProps) {
  const { section } = use(params);

  if (!SECTION_SLUGS.includes(section as (typeof SECTION_SLUGS)[number])) {
    notFound();
  }
  if (DOCS_STYLE_APP_SECTIONS.has(section)) {
    notFound();
  }
  if (WIDE_SECTIONS.has(section)) {
    notFound(); /* wide sections are served by app/(wide)/<section>/page.tsx */
  }

  const config = SECTION_CONFIG[section as keyof typeof SECTION_CONFIG];
  const tree = config.source.getPageTree();

  const isMarketing = MARKETING_SECTION_SLUGS.has(
    section as Parameters<typeof MARKETING_SECTION_SLUGS.has>[0]
  );
  const isPost = POST_SECTIONS.has(section);
  const isChangelog = CHANGELOG_SECTIONS.has(section);

  // Render DocsLayout from the server component so its LayoutContextProvider
  // correctly propagates context to DocsPage in the page component.
  // SectionLayoutWrapper is a thin "use client" wrapper for SidebarProvider only.
  return (
    <Layout>
      <SectionLayoutWrapper>
        <DocsLayout
          tree={tree}
          githubUrl="https://github.com/langfuse/langfuse-docs"
          nav={{ enabled: false }}
          sidebar={
            isMarketing || isPost ? { enabled: false } : { banner: <MenuSwitcher /> }
          }
          containerProps={
            isMarketing || isChangelog
              ? // Force --fd-toc-width:0 so the docs grid doesn't reserve a phantom
                // 268px TOC column (written to the grid by DocsPage's article via CSS :has()).
                ({ style: { "--fd-toc-width": "0px" } } as React.ComponentProps<
                  typeof DocsLayout
                >["containerProps"])
              : undefined
          }
        >
          {isMarketing || isChangelog ? (
            <div className="w-full min-w-0 flex justify-center [grid-area:main]">
              <div className={contentWrapperClass}>
                <MainContentWrapper>{children}</MainContentWrapper>
              </div>
            </div>
          ) : (
            children
          )}
        </DocsLayout>
      </SectionLayoutWrapper>
    </Layout>
  );
}
