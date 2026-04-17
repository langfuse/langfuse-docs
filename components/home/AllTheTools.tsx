"use client";

import Image, { type StaticImageData } from "next/image";
import { HomeSection } from "./HomeSection";
import { Heading, TextHighlight, ChipCard } from "@/components/ui";
import { Text } from "@/components/ui/text";
import { FeaturedCustomers } from "./FeaturedCustomers";
import observabilityVisual from "./img/tools/observability.png";
import promptManagementVisual from "./img/tools/prompt.png";
import evaluationVisual from "./img/tools/evaluation.png";
import playgroundVisual from "./img/tools/playground.png";
import experimentsVisual from "./img/tools/experiments.png";
import humanAnnotationVisual from "./img/tools/human.png";
import metricsAlertsVisual from "./img/tools/metrics.png";

const toolDescriptionClassName =
  "text-left sm:text-[14px] font-normal not-italic leading-[150%] tracking-[-0.07px] text-text-tertiary";

type ToolEntry = {
  title: string;
  description: string;
  href: string;
  tooltip: string;
  span: string;
  visual: StaticImageData;
};

const tools: ToolEntry[] = [
  {
    title: "Observability",
    description:
      "Hierarchical traces capture every LLM call, tool invocation, and retrieval step. Filter by user, session, cost, latency, or custom metadata.",
    href: "/docs/tracing",
    tooltip: "Read more",
    span: "col-span-1",
    visual: observabilityVisual as StaticImageData,
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
    visual: promptManagementVisual as StaticImageData,
  },
  {
    title: "Playground",
    description:
      "Test prompts on real production inputs and compare models side-by-side.",
    href: "/docs/playground",
    tooltip: "Read more",
    span: "col-span-1",
    visual: playgroundVisual as StaticImageData,
  },
  {
    title: "Experiments",
    description:
      "Define test cases and run experiments. Compare results side by side.",
    href: "/docs/experimentation",
    tooltip: "Read more",
    span: "col-span-1",
    visual: experimentsVisual as StaticImageData,
  },
  {
    title: "Human Annotation",
    description:
      "Collaborative Human-in the-Loop workflows to review traces and create golden datasets.",
    href: "/docs/human-feedback",
    tooltip: "Read more",
    span: "col-span-1",
    visual: humanAnnotationVisual as StaticImageData,
  },
  {
    title: "Cost & Latency",
    description:
      "Monitor cost, latency, and quality with dashboards and automated alerts.",
    href: "/docs/analytics",
    tooltip: "Read more",
    span: "col-span-1",
    visual: metricsAlertsVisual as StaticImageData,
  },
];

export function AllTheTools() {
  return (
    <HomeSection id="platform-features" className="pt-[120px]">
      <div className="flex flex-col gap-4 items-start mb-10">
        <Heading className="sm:max-w-none max-w-[24ch]">
          All the tools, <TextHighlight className="sm:pr-1.5">one</TextHighlight><TextHighlight>integrated platform.</TextHighlight>
        </Heading>
        <Text className="text-left max-w-[46ch]">
          One integrated platform to trace, manage prompts, evaluate,
          and experiment from prototype to production scale.
        </Text>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-1 gap-2 xl:grid-cols-3">
            {tools.slice(0, 3).map((tool) => (
              <ChipCard
                key={tool.title}
                href={tool.href}
                tooltip={tool.tooltip}
                className="flex flex-col items-stretch p-0 w-full min-w-0 h-full"
              >
                <div className="flex h-full min-h-0 min-w-0 w-full flex-col overflow-hidden sm:max-h-[200px] sm:flex-row xl:max-h-[337px] xl:flex-col">
                  <div className="flex flex-1 flex-col gap-1 p-4 pb-1 sm:pb-2.5 z-1">
                    <Text size="s" className="font-medium text-left text-text-secondary">
                      {tool.title}
                    </Text>
                    <Text size="s" className={toolDescriptionClassName}>
                      {tool.description}
                    </Text>
                  </div>
                  <div className="flex-1 w-full overflow-clip -mt-[12%] sm:mt-0 pointer-events-none">
                    <Image
                      src={tool.visual}
                      alt={tool.title}
                      width={100}
                      height={100}
                      className="object-contain w-full h-full"
                      quality={100}
                      unoptimized
                    />
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
                className="flex flex-col items-stretch p-0 w-full min-w-0 h-full"
              >
                <div className="flex h-full min-h-0 min-w-0 w-full flex-col overflow-hidden xl:min-h-[277px] lg:max-h-[277px]">
                  <div className="flex flex-col gap-1 p-2 pb-2.5 sm:p-4">
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
                      quality={100}
                      unoptimized
                    />
                  </div>
                </div>
              </ChipCard>
            ))}
          </div>
        </div>
        <FeaturedCustomers />
      </div>
    </HomeSection>
  );
}
