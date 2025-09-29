import Link from "next/link";
import { YCLogo } from "./img/ycLogo";
import { Button } from "../ui/button";
import Image from "next/image";
import phLight from "./img/ph_product_of_the_day_light.png";
import phDark from "./img/ph_product_of_the_day_dark.png";
import GoldenKittyAwardSVG from "./img/ph_gke_ai_infra.svg";
import GoldenKittyAwardSVGWhite from "./img/ph_gke_ai_infra_white.svg";
import { HomeSection } from "./components/HomeSection";

export function Hero() {
  return (
    <HomeSection className="py-0 pt-0 lg:py-0 lg:pt-0 pb-0 lg:pb-0 first:pt-4">
      {/* HERO */}
      <div className="flex flex-col items-center justify-center gap-5 md:min-h-[calc(min(calc(60vh-100px),60vw))] pb-10 lg:pt-10 2xl:pt-20">
        {/* Badges */}
        <div className="flex flex-row gap-10 items-center justify-start scale-[80%] flex-wrap">
          <div className="max-w-full w-52 px-1">
            <ProductHuntBadge />
          </div>
          <a
            href="https://www.producthunt.com/golden-kitty-awards/hall-of-fame"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={GoldenKittyAwardSVG}
              alt="Langfuse won #1 Golden Kitty in AI Infra Category"
              className="block dark:hidden"
              width={80}
            />
            <Image
              src={GoldenKittyAwardSVGWhite}
              alt="Langfuse won #1 Golden Kitty in AI Infra Category"
              className="hidden dark:block"
              width={80}
            />
          </a>
          <a
            href="https://www.ycombinator.com/companies/langfuse"
            className="flex flex-col sm:flex-row items-center gap-x-2 gap-y-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="text-primary/70 text-sm">Backed by</div>
            <YCLogo />
          </a>
        </div>
        <h1 className="text-2xl sm:text-6xl lg:text-8xl font-bold font-mono text-center">
          Open Source LLM Engineering Platform
        </h1>
        <span className="mt-2 text-primary/70 text-xl sm:text-xl lg:text-2xl md:text-balance font-semibold max-w-screen-lg text-center">
          <Link href="/docs/observability/overview" className="underline">
            Traces
          </Link>
          ,{" "}
          <Link href="/docs/evaluation/overview" className="underline">
            evals
          </Link>
          ,{" "}
          <Link href="/docs/prompt-management/overview" className="underline">
            prompt management
          </Link>{" "}
          and{" "}
          <Link href="/docs/metrics/overview" className="underline">
            metrics
          </Link>{" "}
          to debug and improve your LLM application.
        </span>

        <div className="flex gap-4 flex-wrap items-center justify-center my-4">
          <Button size="lg" variant="cta" asChild>
            <Link href="/watch-demo">Watch Demo</Link>
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <Link href="/docs">View docs</Link>
          </Button>
        </div>
      </div>

      {/* <div className="aspect-video bg-blue-200"></div>
      <Video
        src="https://static.langfuse.com/docs-videos/langfuse-10min-demo-4k-60fps.mp4"
        aspectRatio={16 / 9}
        title="Langfuse Walkthrough"
        posterStartTime={86}
      /> */}
    </HomeSection>
  );
}

const ProductHuntBadge = () => (
  <a
    href="https://www.producthunt.com/posts/langfuse-2-0?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-langfuse"
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
