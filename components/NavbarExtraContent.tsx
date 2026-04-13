import { ToAppButton } from "@/components/ToAppButton";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "@/components/MobileMenu";
import type { SectionNavData } from "@/lib/nav-tree";
import { InkeepSearchButton } from "./inkeep/InkeepSearchBar";

export function NavbarExtraContent({
  sectionNavData = [],
}: {
  sectionNavData?: SectionNavData[];
}) {
  return (
    <>
      <InkeepSearchButton className="lg:hidden" />
      <ToAppButton />
      <Button href='/talk-to-us' className="hidden sm:flex" variant="secondary" size="small" shortcutKey="g">
        Get Demo
      </Button>
      <MobileMenu sectionNavData={sectionNavData} />
    </>
  );
}
