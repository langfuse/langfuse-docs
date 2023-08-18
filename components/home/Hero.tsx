import Spline from "@splinetool/react-spline";
import Link from "next/link";
import { YCLogo } from "./ycLogo";
import ShimmerButton from "@/components/magicui/shimmer-button";
import { Button } from "../ui/button";

export function Hero() {
  return (
    <section className="h-[calc(100vh-64px)] flex flex-col items-center text-xl justify-center text-center gap-2">
      <div className="max-h-96">
        <Spline
          scene="https://prod.spline.design/6kMV8Amtvu7CwUZJ/scene.splinecode"
          onLoad={(spline) => {
            spline.setZoom(3);
          }}
          className="h-full w-full"
        />
      </div>
      <h1>Open source Observability & Analytics for LLM Apps</h1>
      <span className="mt-3">
        Detailed production traces and a granular view on quality, cost and
        latency
      </span>
      <div className="flex gap-4 flex-wrap items-center my-5">
        <ShimmerButton borderRadius="8px">
          <span className="whitespace-pre-wrap bg-gradient-to-b from-white from-30% to-gray-300/70 bg-clip-text text-center text-md font-semibold leading-none tracking-tight text-transparent">
            Live demo
          </span>
        </ShimmerButton>
        <Button variant="ghost" size="lg">
          Create account
        </Button>
      </div>
      <div className="flex gap-3 items-center">
        <span>Star us on</span>
        <Link href="https://github.com/langfuse/langfuse">
          <img
            alt="Langfuse Github stars"
            src="https://img.shields.io/github/stars/langfuse/langfuse?label=langfuse&style=social"
          />
        </Link>
      </div>
      <div className="flex gap-2 items-center">
        <span>Backed by</span>
        <YCLogo />
      </div>
    </section>
  );
}
