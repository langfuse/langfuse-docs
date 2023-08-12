import Spline from "@splinetool/react-spline";
import Link from "next/link";
import { YCLogo } from "./ycLogo";

export function Hero() {
  return (
    <section className="h-[calc(100vh-64px)] flex flex-col items-center text-xl justify-center overflow-hidden">
      <div className="max-h-96">
        <Spline
          scene="https://prod.spline.design/6kMV8Amtvu7CwUZJ/scene.splinecode"
          onLoad={(spline) => {
            spline.setZoom(3);
          }}
          className="h-full w-full"
        />
      </div>
      <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary/70">
        Open-source Analytics for LLM Apps
      </h1>
      <span className="mt-3">
        Detailed production traces and a granular view on quality, cost and
        latency
      </span>
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
