import { Logo } from "@/components/Logo";
import InkeepSearchBar from "@/components/inkeep/InkeepSearchBar";
import { NavbarExtraContent } from "@/components/NavbarExtraContent";
import Link from "next/link";
import { cn } from "@/lib/utils";

const cornersStyle = cn('flex items-stretch flex-1 bg-line-structure p-px py-0')
const contentStyle = cn('flex items-center w-full bg-surface-1 rounded-sm px-2.5 py-3')

export function NavbarDocs() {
  return (
    <header
      className="sticky z-50 h-[60px]  bg-surface-1 backdrop-blur-md"
      style={{ top: "var(--fd-banner-height, 0px)" }}
    >
      <nav className="flex mx-auto h-full border-b max-w-360 border-line-structure">
        <div className={cn(cornersStyle, 'max-w-[240px]')}>
          <div className={contentStyle}>
            <Link href="/" className="flex gap-2 items-center shrink-0">
              <Logo wrapInLink={false} />
              <span className="hidden text-sm font-medium text-text-tertiary sm:inline">
                Docs
              </span>
            </Link>
          </div>
        </div>
        <div className={cn(cornersStyle, 'px-0')}>
          <div className='flex flex-row-reverse flex-1 gap-2 px-2.5 py-3 rounded-sm md:flex-row md:items-center md:justify-center md:gap-4 bg-surface-1'>
            <InkeepSearchBar />
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
