import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import {
  Award,
  Box,
  GanttChart,
  GitPullRequestArrow,
  LineChart,
} from "lucide-react";
import { HomeSection } from "./components/HomeSection";
import HomeSubHeader from "./components/HomeSubHeader";

const features = [
  {
    Icon: GanttChart,
    name: "Tracing",
    description: "Detailed production traces to debug LLM applications faster.",
    href: "/docs/tracing/overview",
    cta: "See docs",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
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
    Icon: Award,
    name: "Evaluation",
    description:
      "Understand what works with manual/user feedback & model-based evaluation.",
    href: "/docs/scores/overview",
    cta: "See docs",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: LineChart,
    name: "Metrics",
    description: "Track cost, latency, and quality.",
    href: "/docs/analytics",
    cta: "See docs",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: Box,
    name: "Interoperable integrations",
    description:
      "Interoperable integrations for Python, JS, OpenAI SDK, Langchain and more.",
    href: "/docs/integrations/overview",
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
      />
      <BentoGrid className="lg:grid-rows-3">
        {features.map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>
    </HomeSection>
  );
}
