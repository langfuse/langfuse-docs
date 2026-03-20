import Link from "next/link";
import { Banner as FumadocsBanner } from "fumadocs-ui/components/banner";

export function Banner() {
  return (
    <FumadocsBanner
      id="fd-top-banner"
      className="bg-black text-white [&_a]:text-white [&_button]:text-white"
    >
      <Link href="/docs/v4">
        <span className="sm:hidden">Langfuse just got faster →</span>
        <span className="hidden sm:inline">
          Langfuse just got faster – read about Fast Preview (v4) →
        </span>
      </Link>
    </FumadocsBanner>
  );
}
