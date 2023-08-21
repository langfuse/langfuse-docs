import Spline from "@splinetool/react-spline";
import Link from "next/link";
import { YCLogo } from "./ycLogo";
import ShimmerButton from "@/components/magicui/shimmer-button";
import { Button } from "../ui/button";

export function Hero() {
  return (
    <section className="lg:min-h-[calc(100vh-64px)] flex flex-col items-center text-xl justify-center text-center gap-3">
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
      <div className="flex gap-2 items-center mt-5 lg:mt-20">
        <span>Backed by</span>
        <YCLogo />
      </div>
      <div className="flex gap-3 items-center">
        <span>Star us on GitHub</span>
        <Link href="https://github.com/langfuse/langfuse">
          <img
            alt="Langfuse Github stars"
            src="https://img.shields.io/github/stars/langfuse/langfuse?label=langfuse&style=social"
          />
        </Link>
      </div>
    </section>
  );
}
