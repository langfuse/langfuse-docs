import Link from "next/link";
import { Banner as FumadocsBanner } from "fumadocs-ui/components/banner";

export function Banner() {
  return (
    <FumadocsBanner
      id="fd-top-banner-academy"
      height="2rem"
      className="bg-black text-white [&_a]:text-white [&_button]:text-white"
    >
      <Link href="/changelog/2026-05-14-langfuse-academy">
        <span className="sm:hidden">The Langfuse Academy is here →</span>
        <span className="hidden sm:inline">
          The Langfuse Academy is here →
        </span>
      </Link>
    </FumadocsBanner>
  );
}
