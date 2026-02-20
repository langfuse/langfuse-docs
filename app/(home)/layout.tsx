import { NavbarLogo } from "@/components/NavbarLogo";
import { NavbarExtraContent } from "@/components/NavbarExtraContent";
import FooterMenu from "@/components/FooterMenu";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="sticky top-0 z-50 h-16 border-b border-foreground/10 bg-background/50 backdrop-blur-md">
        <nav className="container flex h-full flex-row items-center">
          <NavbarLogo />
          <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
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
