import { Logo } from "@/components/Logo";
import { NavbarExtraContent } from "@/components/NavbarExtraContent";
import InkeepSearchBar from "@/components/inkeep/InkeepSearchBar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { sectionNavData } from "./Navbar";

const cornersStyle = cn('flex items-stretch flex-1 bg-line-structure p-px py-0')
const contentStyle = cn('flex items-center w-full bg-surface-1 md:rounded-sm pl-3 pr-2.5 py-3')

export function NavbarDocs() {
  return (
    <header
      className="sticky z-50 h-[var(--lf-nav-primary-height)] bg-surface-1 backdrop-blur-md"
      style={{ top: "var(--fd-banner-height, 0px)" }}
    >
      <nav className="flex mx-auto h-full border-b max-w-360 border-line-structure">
        <div className={cn(cornersStyle, 'pr-0 lg:max-w-[240px] lg:pr-px')}>
          <div className={cn(contentStyle, 'rounded-r-none lg:rounded-r-sm')}>
            <div className="flex gap-1.5 sm:gap-2 items-center">
              <Link href="/" className="flex gap-2 items-center shrink-0">
                <Logo wrapInLink={false} />
                <span className="hidden text-sm font-medium text-text-tertiary md:inline">
                  Docs
                </span>
              </Link>
              <a
                href="https://clickhouse.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] sm:text-[11px] leading-none text-text-tertiary/60 hover:text-text-tertiary transition-colors whitespace-nowrap"
              >
                by ClickHouse
              </a>
            </div>
          </div>
        </div>
        <div className={cn(cornersStyle, 'hidden relative px-0 lg:flex')}>
          <div
            className="absolute left-0 w-[10px] h-[10px] bg-left-corner bgc-size-6"
            style={{
              bottom: `calc(-10px - var(--lf-nav-docs-secondary-height))`,
            }}
          />
          <div
            className="absolute hidden wide:block right-0 w-[10px] h-[10px] bg-right-corner bgc-size-6"
            style={{
              bottom: `calc(-10px - var(--lf-nav-docs-secondary-height))`,
            }}
          />
          <div className='flex flex-row-reverse flex-1 gap-2 px-2.5 py-3 lg:rounded-sm md:flex-row md:items-center md:justify-center md:gap-4 bg-surface-1'>
            <InkeepSearchBar className="hidden lg:block" />
          </div>
        </div>
        <div className={cn(cornersStyle, 'flex-1 justify-end pr-px pl-0 lg:justify-center lg:max-w-[240px] lg:pl-px')}>
          <div className={cn(contentStyle, 'justify-end rounded-l-none lg:justify-center lg:rounded-l-sm')}>
            <NavbarExtraContent sectionNavData={sectionNavData} />
          </div>
        </div>
      </nav>
    </header>
  );
}
