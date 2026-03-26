import Link from "next/link";
import { ToAppButton } from "@/components/ToAppButton";
import { Button } from "@/components/ui/button";

export function NavbarExtraContent() {
  return (
    <>
      <ToAppButton />
      <Button size="xs" asChild className="whitespace-nowrap" variant="outline">
        <Link href="/talk-to-us">Get Demo</Link>
      </Button>
    </>
  );
}
