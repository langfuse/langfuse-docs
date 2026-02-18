import Link from "next/link";
import { Logo } from "@/components/logo";
import { HiringBadge } from "@/components/HiringBadge";

/** Shared logo + hiring badge used in Nextra theme.config and docs navbar. Avoid nesting links: only Logo is wrapped when linkToHome. */
export function NavbarLogo({ linkToHome = true }: { linkToHome?: boolean }) {
  return (
    <div className="flex shrink-0 items-center gap-4">
      {linkToHome ? (
        <Link href="/" className="flex items-center gap-4">
          <Logo wrapInLink={false} />
        </Link>
      ) : (
        <Logo wrapInLink={true} />
      )}
      <HiringBadge />
    </div>
  );
}
