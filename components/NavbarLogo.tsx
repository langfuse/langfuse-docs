import Link from "next/link";
import { Logo } from "@/components/logo";
// import { HiringBadge } from "@/components/HiringBadge";

export function NavbarLogo({ linkToHome = true }: { linkToHome?: boolean }) {
  return (
    <div className="flex gap-4 items-center shrink-0">
      <Logo wrapInLink={linkToHome} />
      {/* <HiringBadge /> */}
    </div>
  );
}
