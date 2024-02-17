import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import {
  Box,
  GanttChart,
  GitPullRequestArrow,
  LineChart,
  ThumbsUp,
} from "lucide-react";
import { HomeSection } from "./components/HomeSection";
import HomeSubHeader from "./components/HomeSubHeader";
import bentoTracePng from "./img/bento_trace.png";
import bentoTraceDarkPng from "./img/bento_trace_dark.png";
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
      className="opacity-30 top-0 right-0 dark:hidden"
      style={{
        objectFit: "contain",
        objectPosition: "top right",
        maskImage: "linear-gradient(to top, rgba(0,0,0,0), rgba(0,0,0,1))",
      }}
      src={imgLight}
      fill
      alt={alt}
    />
    <Image
      className="opacity-30 top-0 right-0 hidden dark:block"
      style={{
        objectFit: "contain",
        objectPosition: "top right",
        maskImage: "linear-gradient(to top, rgba(0,0,0,0), rgba(0,0,0,1))",
      }}
      src={imgDark}
      fill
      alt={alt}
    />
  </>
);

const features = [
  {
    Icon: GanttChart,
    name: "Tracing",
    description: "Detailed production traces to debug LLM applications faster.",
    href: "/docs/tracing/overview",
    cta: "See docs",
    background: (
      <BentoBgImage
        imgLight={bentoTracePng}
        imgDark={bentoTraceDarkPng}
        alt="Tracing"
      />
    ),
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-2",
  },
  {
    Icon: GitPullRequestArrow,
    name: "Prompt Management",
    description:
      "Version and deploy prompts collaboratively and retrieve them with low latency.",
    href: "/docs/prompts",
    cta: "See docs",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: ThumbsUp,
    name: "Evaluation",
    description:
      "Collect user feedback and use manual and model-based evaluations.",
    href: "/docs/scores/overview",
    cta: "See docs",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: Box,
    name: "Datasets",
    description:
      "Derive datasets from production data to fine-tune models and test your LLM application.",
    href: "/docs/integrations/overview",
    cta: "See docs",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: LineChart,
    name: "Metrics",
    description: "Track cost, latency, and quality.",
    href: "/docs/analytics",
    cta: "See docs",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];

export function FeatureBento() {
  return (
    <HomeSection id="features">
      <HomeSubHeader
        title="Platform Overview"
        subtitle="Tools for the full development workflow"
        description="All Langfuse features are tightly integrated with Langfuse tracing."
        button={{ href: "/docs", text: "Explore docs" }}
      />
      <BentoGrid className="lg:grid-rows-3">
        {features.map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>
    </HomeSection>
  );
}
