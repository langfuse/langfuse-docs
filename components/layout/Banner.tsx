import Link from "next/link";
import { Banner as FumadocsBanner } from "fumadocs-ui/components/banner";

export function Banner() {
  return (
    <FumadocsBanner
      id="fd-top-banner-town-hall-2026-q2"
      height="2rem"
      className="bg-black text-white [&_a]:text-white [&_button]:text-white"
    >
      <Link href="https://luma.com/7dny2x72">
        <span className="sm:hidden">
          [Virtual] Langfuse Town Hall - Register →
        </span>
        <span className="hidden sm:inline">
          [Virtual] Langfuse Town Hall: ClickHouse, V4, Latest Releases, Roadmap
          - Register →
        </span>
      </Link>
    </FumadocsBanner>
  );
}
