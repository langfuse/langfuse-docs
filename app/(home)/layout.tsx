import { NavbarLogo } from "@/components/NavbarLogo";
import { NavbarExtraContent } from "@/components/NavbarExtraContent";
import { NavLinks } from "@/components/NavLinks";
import FooterMenu from "@/components/FooterMenu";
import InkeepSearchBar from "@/components/inkeep/InkeepSearchBar";
import Link from "next/link";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="max-md:_sticky top-0 z-20 flex items-center h-[2.5rem] [body.nextra-banner-hidden_&amp;]:hidden text-slate-50 dark:text-white bg-neutral-900 dark:bg-[linear-gradient(1deg,#383838,#212121)] px-2 ps-10 print:hidden">
        <div className="w-full text-sm font-medium text-center truncate">
          <Link href="/blog/joining-clickhouse">
            <span className="sm:hidden">Langfuse joins ClickHouse! →</span>
            <span className="hidden sm:inline">Langfuse joins ClickHouse! Learn more →</span>
          </Link>
        </div>
        <button className="p-2 opacity-80 transition" aria-label="Dismiss banner" type="button" data-headlessui-state="">
          <svg viewBox="0 0 20 20" fill="currentColor" height="16">
            <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path>
          </svg>
        </button>
      </div>
      <header className="sticky top-0 z-50 h-16 border-b backdrop-blur-md border-foreground/10 bg-background/50">
        <nav className="container flex flex-row items-center h-full">
          <div className="flex flex-1">
            <NavbarLogo />
          </div>
          <NavLinks />
          <div className="flex flex-1 gap-2 justify-end items-center md:gap-4">
            <div className="hidden min-w-0 max-w-[240px] flex-1 md:block lg:max-w-[280px]">
              <InkeepSearchBar />
            </div>

            <NavbarExtraContent />
          </div>
        </nav>
      </header>
      {children}
      <footer className="border-t border-border/50 bg-muted/30">
        <div className="container py-10">
          <FooterMenu />
        </div>
      </footer>
    </>
  );
}
