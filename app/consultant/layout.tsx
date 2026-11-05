import { Banner } from "@/components/layout/Banner";
import { DocsSecondaryNav } from "@/components/layout/DocsSecondaryNav";
import { NavbarDocs } from "@/components/layout/NavbarDocs";

export default function ConsultantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="docs-chrome flex h-dvh flex-col overflow-hidden"
      style={
        {
          "--lf-nav-docs-secondary-height": "40px",
        } as React.CSSProperties
      }
    >
      <Banner />
      <NavbarDocs sectionLabel="Consultant" />
      <DocsSecondaryNav visibleOnMobile />
      <div className="flex min-h-0 w-full flex-1 flex-col">{children}</div>
    </div>
  );
}
