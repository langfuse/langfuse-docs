import Link from "next/link";
import { Banner as FumadocsBanner } from "fumadocs-ui/components/banner";

export function Banner() {
  return (
    <FumadocsBanner
      id="fd-top-banner-town-hall-2026-08"
      height="2rem"
      className="bg-black text-white [&_a]:text-white [&_button]:text-white"
    >
      <Link href="https://luma.com/qahlxt9n">
        <span className="sm:hidden">
          [Virtual] Langfuse Town Hall · Aug 12 →
        </span>
        <span className="hidden sm:inline">
          [Virtual] Langfuse Town Hall · Aug 12, 9am PT: New features and
          roadmap →
        </span>
      </Link>
    </FumadocsBanner>
  );
}
