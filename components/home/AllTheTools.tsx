"use client";

import { HomeSection } from "./HomeSection";
import { Heading, TextHighlight, ChipCard } from "@/components/ui";
import { Text } from "@/components/ui/text";
import { FeaturedCustomers } from "./FeaturedCustomers";

const tools = [
  {
    title: "Observability",
    description:
      "Hierarchical traces capture every LLM call, tool invocation, and retrieval step. Filter by user, session, cost, latency, or custom metadata.",
    href: "/docs/tracing",
    tooltip: "Read more",
    span: "col-span-1",
  },
  {
    title: "Prompt Management",
    description:
      "Version-controlled prompts with instant deployment. Update production prompts without code changes. One-click rollback.",
    href: "/docs/prompts",
    tooltip: "Read more",
    span: "col-span-1",
  },
  {
    title: "Evaluation",
    description:
      "LLM-as-a-judge, heuristic functions, or human review. Run evaluators on production traces or datasets.",
    href: "/docs/scores",
    tooltip: "Read more",
    span: "col-span-1",
  },
  {
    title: "Playground",
    description:
      "Test prompts on real production inputs and compare models side-by-side.",
    href: "/docs/playground",
    tooltip: "Read more",
    span: "col-span-1",
  },
  {
    title: "Experiments",
    description:
      "Run experiments on datasets, compare prompts and configs with statistics.",
    href: "/docs/experimentation",
    tooltip: "Read more",
    span: "col-span-1",
  },
  {
    title: "Human Annotation",
    description:
      "Queue traces for review and turn feedback into labeled datasets.",
    href: "/docs/human-feedback",
    tooltip: "Read more",
    span: "col-span-1",
  },
  {
    title: "Metrics & Alerts",
    description:
      "Monitor cost, latency, and quality with dashboards and automated alerts.",
    href: "/docs/analytics",
    tooltip: "Read more",
    span: "col-span-1",
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
          <div className="grid grid-cols-3 gap-2">
            {tools.slice(0, 3).map((tool) => (
              <ChipCard
                key={tool.title}
                href={tool.href}
                tooltip={tool.tooltip}
                className="flex flex-col gap-3 p-5 -mt-px -ml-px first:ml-0 items-start min-h-[220px]"
              >
                <Text size="s" className="font-medium text-left text-text-secondary">
                  {tool.title}
                </Text>
                <Text size="s" className="text-left">
                  {tool.description}
                </Text>
                <div className="flex-1 w-full" />
              </ChipCard>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {tools.slice(3).map((tool) => (
              <ChipCard
                key={tool.title}
                href={tool.href}
                tooltip={tool.tooltip}
                className="flex flex-col gap-3 p-5 -mt-px -ml-px first:ml-0 items-start min-h-[220px]"
              >
                <Text size="s" className="font-medium text-left text-text-secondary">
                  {tool.title}
                </Text>
                <Text size="s" className="text-left">
                  {tool.description}
                </Text>
                <div className="flex-1 w-full" />
              </ChipCard>
            ))}
          </div>
        </div>
        <FeaturedCustomers />
      </div>
    </HomeSection>
  );
}
