import Spline from "@splinetool/react-spline";
import Link from "next/link";
import { YCLogo } from "./img/ycLogo";
import ShimmerButton from "@/components/magicui/shimmer-button";
import { Button } from "../ui/button";
import Image from "next/image";
import phLight from "./img/ph_product_of_the_day_light.png";
import phDark from "./img/ph_product_of_the_day_dark.png";

export function Hero() {
  return (
    <section className="lg:min-h-[calc(100vh-64px)] flex flex-col items-center text-md sm:text-xl justify-center text-center gap-3">
      <div className="h-64 lg:h-96 lg:max-h-[50vh]">
        <Spline
          scene="https://prod.spline.design/6kMV8Amtvu7CwUZJ/scene.splinecode"
          onLoad={(spline) => {
            spline.setZoom(3);
          }}
          className="h-full w-full"
        />
      </div>
      <h1>
        Open Source Observability <br className="hidden sm:inline xl:hidden" />&
        Analytics for LLM Apps
      </h1>
      <span className="mt-3 text-primary/70">
        Detailed production traces and a granular view on quality, cost and
        latency
      </span>
      <div className="flex gap-4 flex-wrap items-center justify-center my-2 lg:my-5">
        <Link href="/docs/demo">
          <ShimmerButton borderRadius="8px">
            <span className="whitespace-pre-wrap bg-gradient-to-b from-white from-30% to-gray-300/70 bg-clip-text text-center text-md font-semibold leading-none tracking-tight text-transparent">
              Live demo
            </span>
          </ShimmerButton>
        </Link>
        <Button variant="ghost" size="lg" asChild>
          <Link href="https://cloud.langfuse.com">Create account</Link>
        </Button>
      </div>

      <div className="flex gap-2 items-center mt-5 lg:mt-10">
        <span className="text-primary/70">Backed by</span>
        <YCLogo />
      </div>
      <div className="flex gap-3 items-center">
        <span className="text-primary/70">
          Star us on <span className="hidden sm:inline">GitHub</span>
        </span>
        <Link href="https://github.com/langfuse/langfuse">
          <img
            alt="Langfuse Github stars"
            src="https://img.shields.io/github/stars/langfuse/langfuse?label=langfuse&style=social"
          />
        </Link>
      </div>
      <div className="mt-2">
        <ProductHuntBadge />
      </div>
    </section>
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
