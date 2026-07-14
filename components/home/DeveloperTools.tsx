"use client";

import { HomeSection } from "@/components/home/HomeSection";
import { CornerBox, Heading, Link, TextHighlight } from "@/components/ui";
import { Text } from "@/components/ui/text";

const ASSISTANT_VIDEO_SRC =
  "https://static.langfuse.com/docs-videos/in-app-agent.mp4";

const ASSISTANT_HREF = "/docs/langfuse-assistant";

type ToolItem = {
  title: string;
  description: string;
  href: string;
  action: string;
  eyebrow: string;
};

const TOOL_ITEMS: ToolItem[] = [
  {
    title: "SKILL.md",
    description:
      "A ready-made skill for managing prompts, traces, and evals through natural language.",
    href: "/docs/api-and-data-platform/features/agent-skill",
    action: "Install the skill",
    eyebrow: "Coding agents",
  },
  {
    title: "Langfuse CLI",
    description:
      "Full API access from the terminal for agent workflows, scripts, and CI/CD.",
    href: "/docs/api-and-data-platform/features/cli",
    action: "Configure the CLI",
    eyebrow: "Terminal",
  },
  {
    title: "Platform MCP Server",
    description:
      "Structured access for IDE agents to manage prompts, query traces, and use Langfuse data.",
    href: "/docs/api-and-data-platform/features/mcp-server",
    action: "Configure MCP",
    eyebrow: "IDE agents",
  },
];

const ASSISTANT_USE_CASES = [
  {
    title: "Debug traces",
    detail: "Find failed generations and traces with high latency",
  },
  {
    title: "Optimize spend",
    detail: "Break down token spend, cost, and latency",
  },
  {
    title: "Build evals",
    detail: "Create regression datasets and score configs",
  },
];

function ToolCard({ tool, index }: { tool: ToolItem; index: number }) {
  return (
    <CornerBox
      hoverStripes
      className="flex h-full min-h-[180px] flex-col gap-4 p-4 sm:p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] tracking-[-0.2px] text-text-tertiary">
          0{index + 1}
        </span>
        <span className="rounded-[2px] border border-line-structure bg-surface-1 px-2 py-0.5 font-sans text-[11px] text-text-tertiary">
          {tool.eyebrow}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <Link
          href={tool.href}
          className="text-left text-[17px] font-medium text-text-primary"
        >
          {tool.title}
        </Link>
        <Text size="s" className="max-w-[38ch] text-left">
          {tool.description}
        </Text>
      </div>

      <Link
        href={tool.href}
        className="mt-auto inline-flex w-fit items-center gap-1 font-sans text-[12px] font-medium text-text-secondary no-underline transition-colors hover:text-text-primary"
      >
        {tool.action} <span aria-hidden>→</span>
      </Link>
    </CornerBox>
  );
}

function AssistantFeature() {
  return (
    <CornerBox className="flex flex-col overflow-hidden">
      <div className="flex flex-col gap-5 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[10px] tracking-[-0.2px] text-text-tertiary">
            00
          </span>
          <span className="rounded-[2px] border border-line-structure bg-surface-1 px-2 py-0.5 font-sans text-[11px] text-text-tertiary">
            In-app
          </span>
        </div>

        <div className="flex max-w-[58ch] flex-col gap-3">
          <h3 className="text-left font-sans text-[17px] font-medium text-text-primary">
            Langfuse Assistant
          </h3>
          <Text className="text-left">
            Automate the AI engineering loop: investigate production data,
            understand what happened, and turn findings into approved actions
            without leaving Langfuse.
          </Text>
        </div>

        <div className="grid border-y border-line-structure sm:grid-cols-3 sm:divide-x sm:divide-line-structure">
          {ASSISTANT_USE_CASES.map((useCase, index) => (
            <div
              key={useCase.title}
              className="flex flex-col gap-1 border-b border-line-structure py-3 last:border-b-0 sm:block sm:border-b-0 sm:px-4 sm:first:pl-0 sm:last:pr-0"
            >
              <Text
                size="s"
                className="font-medium text-left text-text-secondary"
              >
                {useCase.title}
              </Text>
              <Text size="s" className="text-left sm:mt-1">
                {useCase.detail}
              </Text>
              <span className="sr-only">Step {index + 1}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={ASSISTANT_HREF}
            className="inline-flex w-fit items-center gap-1 font-sans text-[12px] font-medium text-text-secondary no-underline transition-colors hover:text-text-primary"
          >
            View documentation <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      <div className="border-t border-line-structure bg-surface-1 p-3 sm:p-4">
        <video
          src={ASSISTANT_VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          aria-label="The Langfuse Assistant investigating project data in the Langfuse app"
          className="aspect-video h-auto w-full rounded-[2px] border border-line-structure object-cover shadow-sm"
        />
      </div>
    </CornerBox>
  );
}

export const DeveloperTools = () => {
  return (
    <HomeSection id="developers-agents" className="pt-[120px]">
      <div className="flex relative flex-col gap-8 md:gap-10">
        <div className="flex max-w-[58ch] flex-col gap-4">
          <Heading className="text-left max-w-[16ch] sm:max-w-none">
            Made for{" "}
            <span className="whitespace-nowrap">
              <TextHighlight>developers</TextHighlight>,
            </span>{" "}
            loved by{" "}
            <span className="whitespace-nowrap">
              <TextHighlight>agents</TextHighlight>.
            </span>
          </Heading>
          <Text className="max-w-[56ch] text-left">
            Work in the app or from your IDE. The Assistant investigates
            production and takes approved actions; SKILL.md, CLI, and MCP
            connect coding agents to Langfuse.
          </Text>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <AssistantFeature />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:col-span-4 lg:grid-cols-1 lg:grid-rows-3">
            {TOOL_ITEMS.map((tool, index) => (
              <div
                key={tool.title}
                className={
                  index === 0
                    ? "-mt-px lg:mt-0 lg:-ml-px"
                    : "-mt-px sm:-ml-px lg:-ml-px"
                }
              >
                <ToolCard tool={tool} index={index} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </HomeSection>
  );
};
