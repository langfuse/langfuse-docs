import { notFound } from "next/navigation";
import { DocsLayout } from "fumadocs-ui/layouts/flux";
import { Layout } from "@/components/layout";
import { SECTION_CONFIG, SECTION_SLUGS } from "@/lib/sections";
import { MainContentWrapper } from "@/components/MainContentWrapper";

// Marketing pages that need a wider container than the default max-w-4xl
const WIDE_SECTIONS = new Set([
  "pricing",
  "pricing-self-host",
  "talk-to-us",
  "enterprise",
  "startups",
]);

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ section: string }>;
};

export default async function SectionLayout({ children, params }: LayoutProps) {
  const { section } = await params;
  if (!SECTION_SLUGS.includes(section as (typeof SECTION_SLUGS)[number])) {
    notFound();
  }
  const config = SECTION_CONFIG[section as keyof typeof SECTION_CONFIG];
  const tree = config.source.getPageTree();

  return (
    <Layout>
      <DocsLayout
        tree={tree}
        nav={{ enabled: false }}
        sidebar={{ enabled: false }}
      >
        <div className={`mx-auto ${WIDE_SECTIONS.has(section) ? "max-w-7xl" : "max-w-4xl"}`}>
          <MainContentWrapper>
            {children}
          </MainContentWrapper>
        </div>
      </DocsLayout>
    </Layout>
  );
}
