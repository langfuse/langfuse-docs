import Link from "next/link";
import { Banner as FumadocsBanner } from "fumadocs-ui/components/banner";

export function Banner() {
  return (
    <FumadocsBanner
      id="fd-top-banner-japan"
      className="bg-black text-white [&_a]:text-white [&_button]:text-white"
    >
      <Link href="/japan">
        <span className="sm:hidden">Langfuse Cloud Japan is live →</span>
        <span className="hidden sm:inline">
          Langfuse Cloud Japan is live – data stays in Tokyo →
        </span>
      </Link>
    </FumadocsBanner>
  );
}
