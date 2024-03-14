import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import {
  Box,
  GanttChart,
  GitPullRequestArrow,
  LineChart,
  ThumbsUp,
} from "lucide-react";
import { HomeSection } from "./components/HomeSection";
import { Header } from "../Header";
import bentoTracePng from "./img/bento_trace.png";
import bentoTraceDarkPng from "./img/bento_trace_dark.png";
import bentoMetricsPng from "./img/bento_metrics.png";
import bentoMetricsDarkPng from "./img/bento_metrics_dark.png";
import bentoPromptPng from "./img/bento_prompt_management.png";
import bentoPromptDarkPng from "./img/bento_prompt_management_dark.png";
import Image, { type StaticImageData } from "next/image";

const BentoBgImage = ({
  imgLight,
  imgDark,
  alt,
}: {
  imgLight: StaticImageData;
  imgDark: StaticImageData;
  alt: string;
}) => (
  <>
    <Image
      className="opacity-30 top-0 right-0 dark:hidden hidden md:block"
      style={{
        objectFit: "contain",
        objectPosition: "top right",
        maskImage: "linear-gradient(to top, rgba(0,0,0,0) 15%, rgba(0,0,0,1))",
      }}
      src={imgLight}
      fill
      alt={alt}
      sizes="(min-width: 1024px) 33vw, 100vw"
    />
    <Image
      className="opacity-30 top-0 right-0 hidden dark:md:block"
      style={{
        objectFit: "contain",
        objectPosition: "top right",
        maskImage: "linear-gradient(to top, rgba(0,0,0,0) 15%, rgba(0,0,0,1))",
      }}
      src={imgDark}
      fill
      alt={alt}
      sizes="(min-width: 1024px) 33vw, 100vw"
    />
  </>
);

const features = [
  {
    Icon: GanttChart,
    name: "Tracing",
    description: "Detailed production traces to debug LLM applications faster.",
    href: "/docs/tracing/overview",
    cta: "Learn more",
    background: (
      <BentoBgImage
        imgLight={bentoTracePng}
        imgDark={bentoTraceDarkPng}
        alt="Tracing"
      />
    ),
    className: "md:row-start-1 md:row-end-4 md:col-start-2 md:col-end-2",
  },
  {
    Icon: GitPullRequestArrow,
    name: "Prompt Management",
    description:
      "Version and deploy prompts collaboratively and retrieve them with low latency.",
    href: "/docs/prompts/get-started",
    cta: "Learn more",
    background: (
      <BentoBgImage
        imgLight={bentoPromptPng}
        imgDark={bentoPromptDarkPng}
        alt="Prompt Management"
      />
    ),
    className: "md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-3",
  },
  {
    Icon: ThumbsUp,
    name: "Evaluation",
    description:
      "Collect user feedback and use manual and model-based evaluations.",
    href: "/docs/scores/overview",
    cta: "Learn more",
    background: null,
    className: "md:col-start-1 md:col-end-2 md:row-start-3 md:row-end-4",
  },
  {
    Icon: Box,
    name: "Datasets",
    description:
      "Derive datasets from production data to fine-tune models and test your LLM application.",
    href: "/docs/datasets/overview",
    cta: "Learn more",
    background: null,
    className: "md:col-start-3 md:col-end-3 md:row-start-1 md:row-end-2",
  },
  {
    Icon: LineChart,
    name: "Metrics",
    description: "Track cost, latency, and quality.",
    href: "/docs/analytics",
    cta: "Learn more",
    background: (
      <BentoBgImage
        imgLight={bentoMetricsPng}
        imgDark={bentoMetricsDarkPng}
        alt="Metrics"
      />
    ),
    className: "md:col-start-3 md:col-end-3 md:row-start-2 md:row-end-4",
  },
];

export default function FeatureBento() {
  return (
    <HomeSection id="features">
      <Header
        title="Tools for the full development workflow"
        description="All Langfuse features are tightly integrated with Langfuse tracing."
        button={{ href: "/docs", text: "Explore docs" }}
      />
      <BentoGrid>
        {features.map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>
    </HomeSection>
  );
}
