import Link from "next/link";
import { Banner as FumadocsBanner } from "fumadocs-ui/components/banner";

export function Banner() {
  return (
    <FumadocsBanner
      height="2rem"
      className="bg-black px-2 text-white sm:px-4 [&_a]:text-white"
    >
      <Link href="/blog/introducing-gateway">
        Langfuse launches AI Gateway <span aria-hidden>→</span>{" "}
        <span className="underline underline-offset-2">Learn more</span>
      </Link>
    </FumadocsBanner>
  );
}
