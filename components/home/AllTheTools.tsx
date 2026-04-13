"use client";

import Image from "next/image";
import { HomeSection } from "./HomeSection";
import { Heading, TextHighlight, ChipCard } from "@/components/ui";
import { Text } from "@/components/ui/text";
import { FeaturedCustomers } from "./FeaturedCustomers";
import observabilityVisual from "./img/tools/observability.svg";
import promptManagementVisual from "./img/tools/prompt.svg";
import evaluationVisual from "./img/tools/evaluation.svg";
import playgroundVisual from "./img/tools/playground.svg";
import experimentsVisual from "./img/tools/experiments.svg";
import humanAnnotationVisual from "./img/tools/human.svg";
import metricsAlertsVisual from "./img/tools/metrics.svg";

/** Chip tool card body copy (Figma: 14 / 400 / 150% / -0.07px). */
const toolDescriptionClassName =
  "text-left sm:text-[14px] font-normal not-italic leading-[150%] tracking-[-0.07px] text-text-tertiary";

const tools = [
  {
    title: "Observability",
    description:
      "Hierarchical traces capture every LLM call, tool invocation, and retrieval step. Filter by user, session, cost, latency, or custom metadata.",
    href: "/docs/tracing",
    tooltip: "Read more",
    span: "col-span-1",
    visual: observabilityVisual,
  },
  {
    title: "Evaluation",
    description:
      "LLM-as-a-judge, heuristic functions, or human review. Run evaluators on production data or during experiments.",
    href: "/docs/scores",
    tooltip: "Read more",
    span: "col-span-1",
    visual: evaluationVisual,
  },
  {
    title: "Prompt Management",
    description:
      "Separate prompts from code with one-click deployments and rollbacks. Turn improving your production prompts a team sport.",
    href: "/docs/prompts",
    tooltip: "Read more",
    span: "col-span-1",
    visual: promptManagementVisual,
  },
  {
    title: "Cost & Latency",
    description:
      "Monitor cost, latency, and quality using customizable dashboards and reports.",
    href: "/docs/analytics",
    tooltip: "Read more",
    span: "col-span-1",
    visual: metricsAlertsVisual,
  },
  {
    title: "Playground",
    description:
      "Test prompts on real production inputs and compare models side-by-side.",
    href: "/docs/playground",
    tooltip: "Read more",
    span: "col-span-1",
    visual: playgroundVisual,
  },
  {
    title: "Experiments",
    description:
      "Define test cases and run experiments. Compare results side by side.",
    href: "/docs/experimentation",
    tooltip: "Read more",
    span: "col-span-1",
    visual: experimentsVisual,
  },
  {
    title: "Human Annotation",
    description:
      "Collaborative Human-in the-Loop workflows to review traces and create golden datasets.",
    href: "/docs/human-feedback",
    tooltip: "Read more",
    span: "col-span-1",
    visual: humanAnnotationVisual,
  },
];

export function AllTheTools() {
  return (
    <HomeSection id="all-the-tools" className="pt-20">
      <div className="flex flex-col gap-4 items-start mb-10">
        <Heading>
          All the tools, <TextHighlight>one integrated platform.</TextHighlight>
        </Heading>
        <Text className="text-left max-w-[48ch]">
          One integrated platform to trace, manage prompts, evaluate,
          and experiment from prototype to production scale.
        </Text>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-1 gap-2 xl:grid-cols-3">
            {tools.slice(0, 3).map((tool, index) => (
              <ChipCard
                key={tool.title}
                href={tool.href}
                tooltip={tool.tooltip}
                className='p-0'
              >
                <div className="flex flex-col sm:flex-row xl:flex-col gap-0 p-0 -mt-px -ml-px first:ml-0 items-start min-h-0 overflow-hidden sm:max-h-[200px] xl:max-h-[337px] h-full">
                  <div className="flex flex-col flex-1 gap-1 p-4 pb-2.5 min-h-0 shrink-0 h-full">
                    <Text size="s" className="font-medium text-left text-text-secondary">
                      {tool.title}
                    </Text>
                    <Text size="s" className={toolDescriptionClassName}>
                      {tool.description}
                    </Text>
                  </div>
                  <div className="flex-1 w-full overflow-clip">
                    <Image
                      src={tool.visual}
                      alt={tool.title}
                      width={100}
                      height={100}
                      className="object-contain w-full h-full sm:-translate-y-[40px] xl:translate-y-0"
                      quality={100} />
                  </div>
                </div>
              </ChipCard>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
            {tools.slice(3).map((tool) => (
              <ChipCard
                key={tool.title}
                href={tool.href}
                tooltip={tool.tooltip}
                className="p-0"
              >
                <div className="flex flex-col gap-0 p-0 -mt-px -ml-px first:ml-0 items-start xl:min-h-[277px] xl:max-h-[277px] overflow-hidden h-full">
                  <div className="flex flex-col gap-1 p-2 pb-2.5 sm:p-4 h-full">
                    <Text size="s" className="font-medium text-left text-text-secondary">
                      {tool.title}
                    </Text>
                    <Text size="s" className={toolDescriptionClassName}>
                      {tool.description}
                    </Text>
                  </div>
                  <div className="hidden flex-1 w-full overflow-clip xl:flex">
                    <Image
                      src={tool.visual}
                      alt={tool.title}
                      width={100}
                      height={100}
                      className="object-contain w-full h-full -translate-y-[20px]"
                      quality={100} />
                  </div>
                </div>
              </ChipCard>
            ))}
          </div>
        </div>
        <FeaturedCustomers corners={{ tl: false, tr: false, bl: false, br: false }} />
      </div>
    </HomeSection>
  );
}
