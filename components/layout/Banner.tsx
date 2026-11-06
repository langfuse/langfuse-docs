import Link from "next/link";
import { Banner as FumadocsBanner } from "fumadocs-ui/components/banner";

export function Banner() {
  return (
    <FumadocsBanner
      height="2rem"
      className="bg-black px-2 text-white sm:px-4 [&_a]:text-white"
    >
      <Link href="/blog/introducing-gateway">
        <span className="sm:hidden">
          Langfuse launches AI Gateway ·{" "}
          <span className="underline underline-offset-2">Read more</span>
        </span>
        <span className="hidden sm:inline">
          Langfuse launches Open Source AI Gateway ·{" "}
          <span className="underline underline-offset-2">Read more</span>
        </span>
      </Link>
    </FumadocsBanner>
  );
}
