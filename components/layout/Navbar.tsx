import { NavbarLogo } from "@/components/NavbarLogo";
import { NavbarExtraContent } from "@/components/NavbarExtraContent";
import { NavLinks } from "@/components/NavLinks";
import InkeepSearchBar from "@/components/inkeep/InkeepSearchBar";
import {
  source,
  getSelfHostingPageTree,
  guidesSource,
  getIntegrationsPageTree,
  faqSource,
  handbookSource,
  librarySource,
  securitySource,
} from "@/lib/source";
import { serializePageTree, type SectionNavData } from "@/lib/nav-tree";

const sectionNavData: SectionNavData[] = [
  { name: "Docs", href: "/docs", children: serializePageTree(source.getPageTree()) },
  { name: "Self Hosting", href: "/self-hosting", children: serializePageTree(getSelfHostingPageTree()) },
  { name: "Guides", href: "/guides", children: serializePageTree(guidesSource.getPageTree()) },
  { name: "Integrations", href: "/integrations", children: serializePageTree(getIntegrationsPageTree()) },
  { name: "FAQ", href: "/faq", children: serializePageTree(faqSource.getPageTree()) },
  { name: "Handbook", href: "/handbook", children: serializePageTree(handbookSource.getPageTree()) },
  { name: "Changelog", href: "/changelog", children: [] },
  { name: "Pricing", href: "/pricing", children: [] },
  { name: "Library", href: "/library", children: serializePageTree(librarySource.getPageTree()) },
  { name: "Security & Compliance", href: "/security", children: serializePageTree(securitySource.getPageTree()) },
];

export function Navbar() {
  return (
    <header className="sticky z-50 h-16 border-b backdrop-blur-md border-foreground/10 bg-background/50" style={{ top: 'var(--fd-banner-height, 0px)' }}>
      <nav className="mx-auto flex h-full max-w-360 items-center justify-end gap-4 pl-[max(env(safe-area-inset-left),1.5rem)] pr-[max(env(safe-area-inset-right),1.5rem)]">
        <div className="flex flex-1">
          <NavbarLogo />
        </div>
        <div className="flex flex-row-reverse md:flex-row flex-1 md:gap-4 gap-2">
          <NavLinks sectionNavData={sectionNavData} />
          <div className="flex gap-2 justify-end items-center lg:gap-4">
            <div className="min-w-0 max-w-9 h-9 flex-1 block xl:max-w-[280px]">
              <InkeepSearchBar />
            </div>
            <NavbarExtraContent />
          </div>
        </div>
      </nav>
    </header>
  );
}
