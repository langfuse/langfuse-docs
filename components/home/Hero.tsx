import Link from "next/link";
import { YCLogo } from "./img/ycLogo";
import { Button } from "../ui/button";
import Image from "next/image";
import phLight from "./img/ph_product_of_the_day_light.png";
import phDark from "./img/ph_product_of_the_day_dark.png";
import { CloudflareVideo } from "../Video";
import GoldenKittyAwardSVG from "./img/ph_gke_ai_infra.svg";
import GoldenKittyAwardSVGWhite from "./img/ph_gke_ai_infra_white.svg";
import { HomeSection } from "./components/HomeSection";

export function Hero() {
  return (
    <HomeSection>
      {/* HERO */}
      <div className="flex flex-col items-start justify-center pt-5 gap-3 md:min-h-[calc(60vh-100px)]">
        <h1 className="text-5xl sm:text-7xl lg:text-8xl">
          Open Source
          <br />
          LLM Engineering Platform
        </h1>
        <span className="mt-2 text-primary/70 text-2xl sm:text-3xl lg:text-4xl md:text-balance font-semibold tracking-wide">
          <span className="underline">Traces</span>,{" "}
          <span className="underline">evals</span>,{" "}
          <span className="underline">prompt management</span> and{" "}
          <span className="underline">metrics</span> to debug and improve your
          LLM application.
        </span>

        <div className="flex gap-4 flex-wrap items-center justify-center my-4">
          <Button size="lg" variant="cta" asChild>
            <Link href="/docs/demo">Try demo</Link>
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <Link href="/docs/get-started">View docs</Link>
          </Button>
        </div>
      </div>
      {/* Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-4 items-center justify-items-center my-10 flex-wrap">
        <Link href="https://github.com/langfuse/langfuse">
          <img
            alt="Langfuse Github stars"
            src="https://img.shields.io/github/stars/langfuse/langfuse?label=langfuse&style=social"
          />
        </Link>
        <a
          href="https://www.ycombinator.com/companies/langfuse"
          className="flex flex-col sm:flex-row items-center gap-x-2 gap-y-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="text-primary/70 text-sm">Backed by</div>
          <YCLogo />
        </a>
        <a
          href="https://www.producthunt.com/golden-kitty-awards/hall-of-fame"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={GoldenKittyAwardSVG}
            alt="Langfuse won #1 Golden Kitty in AI Infra Category"
            className="block dark:hidden"
          />
          <Image
            src={GoldenKittyAwardSVGWhite}
            alt="Langfuse won #1 Golden Kitty in AI Infra Category"
            className="hidden dark:block"
          />
        </a>
        <div className="max-w-full w-52 px-1">
          <ProductHuntBadge />
        </div>
      </div>
      {/* <div className="aspect-video bg-blue-200"></div> */}
      <CloudflareVideo
        videoId="ff57153dd945da86f7549c1f30daaea2"
        aspectRatio={1.71}
      />
    </HomeSection>
  );
}

const ProductHuntBadge = () => (
  <a
    href="https://www.producthunt.com/posts/langfuse?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-langfuse"
    target="_blank"
  >
    <Image
      src={phLight}
      alt="Product Hunt - Product of the Day"
      width={250}
      height={54}
      className="block dark:hidden"
    />
    <Image
      src={phDark}
      alt="Product Hunt - Product of the Day"
      width={250}
      height={54}
      className="hidden dark:block"
    />
  </a>
);
