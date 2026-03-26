import { NavbarLogo } from "@/components/NavbarLogo";
import { NavbarExtraContent } from "@/components/NavbarExtraContent";
import { NavLinks } from "@/components/NavLinks";
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
import { cn } from "@/lib/utils";

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

const cornersStyle = cn('flex items-stretch flex-1 bg-line-structure p-px pb-0')
const contentStyle = cn('flex items-center w-full bg-surface-1 rounded-sm px-2.5 py-3')

export function Navbar() {
  return (
    <header className="sticky z-50 h-16 border-b backdrop-blur-md bg-surface-1 border-line-structure" style={{ top: 'var(--fd-banner-height, 0px)' }}>
      <nav className="flex mx-auto h-full max-w-360">
        <div className={cn(cornersStyle, 'max-w-[240px]')}>
          <div className={contentStyle}>
            <NavbarLogo />
          </div>
        </div>
        <div className={cn(cornersStyle, 'px-0')}>
          <div className='flex flex-row-reverse flex-1 gap-2 px-2.5 py-3 rounded-sm md:flex-row md:gap-4 bg-surface-1'>
            <NavLinks sectionNavData={sectionNavData} />
          </div>
        </div>
        <div className={cn(cornersStyle, 'max-w-[240px]')}>
          <div className={contentStyle}>
            <NavbarExtraContent />
          </div>
        </div>
      </nav>
    </header>
  );
}
