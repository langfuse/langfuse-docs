import Link from "next/link";
import { Banner as FumadocsBanner } from "fumadocs-ui/components/banner";

export function Banner() {
  return (
    <FumadocsBanner
      height="2rem"
      className="bg-black text-white [&_a]:text-white"
    >
      <Link href="/docs/v4">
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
