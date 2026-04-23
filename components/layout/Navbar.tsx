import { NavbarExtraContent } from "@/components/NavbarExtraContent";
import { NavLinks } from "@/components/NavLinks";
import { HiringBadge } from "@/components/HiringBadge";
import { type SectionNavData } from "@/lib/nav-tree";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import InkeepSearchBar from "@/components/inkeep/InkeepSearchBar";

export const sectionNavData: SectionNavData[] = [
  { name: "Docs", href: "/docs" },
  { name: "Self Hosting", href: "/self-hosting" },
  { name: "Guides", href: "/guides" },
  { name: "Integrations", href: "/integrations" },
  { name: "FAQ", href: "/faq" },
  { name: "Handbook", href: "/handbook" },
  { name: "Changelog", href: "/changelog" },
  { name: "Pricing", href: "/pricing" },
  { name: "Library", href: "/library" },
  { name: "Security & Compliance", href: "/security" },
];

const cornersStyle = cn('flex items-stretch flex-1 bg-line-structure p-px py-0')
const contentStyle = cn('flex items-center w-full bg-surface-1 lg:rounded-sm pl-3 pr-2.5 py-3')

export function Navbar() {
  return (
    <header
      className="sticky z-50 h-(--lf-nav-primary-height) bg-surface-1 backdrop-blur-md"
      style={{ top: "var(--fd-banner-height, 0px)" }}
    >
      <nav className="flex mx-auto h-full border-b max-w-360 border-line-structure">
        <div className={cn(cornersStyle, 'pr-0 lg:max-w-[240px] lg:pr-px')}>
          <div className={cn(contentStyle, 'rounded-r-none lg:rounded-r-sm')}>
            <Logo showAffiliation />
          </div>
        </div>
        <div className={cn(cornersStyle, 'hidden relative px-0 lg:flex')}>
          <div className="absolute bottom-[-6px] left-0 w-[6px] h-[5px] bg-left-corner" />
          <div className="absolute hidden wide:block bottom-[-6px] right-0 w-[6px] h-[5px] bg-right-corner" />
          <div className='flex flex-row-reverse flex-1 gap-2 px-2.5 py-3 rounded-sm md:flex-row md:items-center md:justify-center md:gap-4 bg-surface-1'>
            <InkeepSearchBar className="hidden" />
            <NavLinks sectionNavData={sectionNavData} />
            <HiringBadge />
          </div>
        </div>
        <div className={cn(cornersStyle, 'flex-1 justify-end pl-0 lg:justify-center lg:max-w-[240px] lg:pl-px')}>
          <div className={cn(contentStyle, 'justify-end rounded-l-none lg:justify-center lg:rounded-l-sm')}>
            <NavbarExtraContent sectionNavData={sectionNavData} />
          </div>
        </div>
      </nav>
    </header>
  );
}
