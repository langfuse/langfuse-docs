import Link from "next/link";
import { ToAppButton } from "@/components/ToAppButton";
import { Button } from "@/components/ui/button";

export function NavbarExtraContent() {
  return (
    <>
      <ToAppButton />
      <Button href='/talk-to-us' variant="secondary" size="small" shortcutKey="g">
        Get Demo
      </Button>
    </>
  );
}
