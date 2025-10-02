import Link from "next/link";
import { Button } from "../ui/button";
import { HomeSection } from "./components/HomeSection";

export function Hero() {
  return (
    <HomeSection className="py-0 pt-0 lg:py-0 lg:pt-0 pb-0 lg:pb-0 first:pt-4">
      {/* HERO */}
      <div className="flex flex-col items-center justify-center gap-5 md:min-h-[calc(min(calc(60vh-100px),60vw))] pb-10 pt-5 lg:pt-10 2xl:pt-20">
        <h1 className="text-4xl sm:text-7xl lg:text-8xl font-bold font-mono text-center text-balance lg:text-wrap">
          Open Source LLM&nbsp;Engineering Platform
        </h1>
        <span className="mt-2 text-primary/70 text-base sm:text-xl lg:text-3xl md:text-balance font-semibold max-w-screen-lg text-center px-4">
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

