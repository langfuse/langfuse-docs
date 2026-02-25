import { notFound } from "next/navigation";
import { Layout } from "@/components/layout";
import { SECTION_CONFIG, SECTION_SLUGS } from "@/lib/sections";
import { SectionDocsLayoutClient } from "./SectionDocsLayoutClient";

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
      <SectionDocsLayoutClient tree={tree} section={section}>
        {children}
      </SectionDocsLayoutClient>
    </Layout>
  );
}
