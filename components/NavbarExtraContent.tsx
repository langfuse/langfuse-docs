import { ToAppButton } from "@/components/ToAppButton";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "@/components/MobileMenu";
import type { SectionNavData } from "@/lib/nav-tree";

export function NavbarExtraContent({
  sectionNavData = [],
}: {
  sectionNavData?: SectionNavData[];
}) {
  return (
    <>
      <ToAppButton />
      <Button href='/talk-to-us' className="hidden sm:flex" variant="secondary" size="small" shortcutKey="g">
        Get Demo
      </Button>
      <MobileMenu sectionNavData={sectionNavData} />
    </>
  );
}
