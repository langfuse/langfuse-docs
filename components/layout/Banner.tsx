import Link from "next/link";
import { Banner as FumadocsBanner } from "fumadocs-ui/components/banner";

export function Banner() {
  return (
    <FumadocsBanner
      id="fd-top-banner-launch-week-5-day-2"
      height="2rem"
      className="bg-black text-white [&_a]:text-white [&_button]:text-white"
    >
      <Link href="/launch">
        <span className="sm:hidden">
          Launch Week 5 · Day 2: Langfuse agent skill →
        </span>
        <span className="hidden sm:inline">
          Langfuse Launch Week 5 · Day 2: Langfuse agent skill →
        </span>
      </Link>
    </FumadocsBanner>
  );
}
