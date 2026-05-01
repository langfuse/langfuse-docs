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
      <div className="lg:hidden">
        <InkeepSearchButton />
      </div>
      <div className="hidden justify-between items-center sm:flex">
        <ToAppButton />
        <Button href='/talk-to-us' wrapperClassName="flex-1" variant="secondary" size="small" shortcutKey="g">
          Get Demo
        </Button>
      </div>
      <MobileMenu sectionNavData={sectionNavData} />
    </>
  );
}
