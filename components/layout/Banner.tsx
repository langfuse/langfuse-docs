import Link from "next/link";
import { Banner as FumadocsBanner } from "fumadocs-ui/components/banner";

export function Banner() {
  return (
    <FumadocsBanner
      id="fd-top-banner-langfuse-v4"
      height="2rem"
      className="bg-black text-white [&_a]:text-white [&_button]:text-white"
    >
      <Link href="/changelog/2026-08-13-langfuse-v4">
        <span className="sm:hidden">
          Langfuse v4: up to 165× faster ·{" "}
          <span className="underline underline-offset-2">Read more</span>
        </span>
        <span className="hidden sm:inline">
          Langfuse v4 is here: real-time, up to 165× faster ·{" "}
          <span className="underline underline-offset-2">Read more</span>
        </span>
      </Link>
    </FumadocsBanner>
  );
}
