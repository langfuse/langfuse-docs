"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { HomeSection } from "./HomeSection";
import { Heading, TextHighlight, ChipCard } from "@/components/ui";
import { Text } from "@/components/ui/text";
import { IntegrationLabel } from "@/components/ui/integration-label";
import IconPython from "@/components/icons/python";
import IconTypescript from "@/components/icons/typescript";
import { cn } from "@/lib/utils";

// ─── Data (paths per homepage integration spec) ─────────────────────────────

const languagesGroup = {
  title: "Languages (via OTel)",
  items: [
    {
      label: "Python (Native SDK)",
      href: "/docs/observability/sdk/overview",
      icon: <IconPython className="w-[18px] h-[18px]" />,
    },
    {
      label: "TypeScript (Native SDK)",
      href: "/docs/observability/sdk/overview",
      icon: <IconTypescript className="w-[18px] h-[18px]" />,
    },
    { label: "Go", href: "/integrations/native/opentelemetry" },
    { label: "Java", href: "/integrations/native/opentelemetry" },
    { label: ".NET", href: "/integrations/native/opentelemetry" },
    { label: "Ruby", href: "/integrations/native/opentelemetry" },
    { label: "PHP", href: "/integrations/native/opentelemetry" },
    { label: "Swift", href: "/integrations/native/opentelemetry" },
  ],
};

const agentFrameworksGroup = {
  title: "Agent Frameworks",
  items: [
    {
      label: "LangChain",
      href: "/integrations/frameworks/langchain",
      icon: <Image src="/images/integrations/langchain_icon.png" alt="" width={18} height={18} />,
    },
    {
      label: "Vercel AI SDK",
      href: "/integrations/frameworks/vercel-ai-sdk",
      icon: <Image src="/images/integrations/vercel_ai_sdk_icon.png" alt="" width={18} height={18} />,
    },
    {
      label: "LiteLLM",
      href: "/integrations/frameworks/litellm-sdk",
      icon: <Image src="/images/integrations/litellm_icon.png" alt="" width={18} height={18} />,
    },
    {
      label: "Pydantic AI",
      href: "/integrations/frameworks/pydantic-ai",
      icon: <Image src="/images/integrations/pydantic_ai_icon.svg" alt="" width={18} height={18} />,
    },
    {
      label: "Google ADK",
      href: "/integrations/frameworks/google-adk",
      icon: <Image src="/images/integrations/google_adk_icon.png" alt="" width={18} height={18} />,
    },
    {
      label: "CrewAI",
      href: "/integrations/frameworks/crewai",
      icon: <Image src="/images/integrations/crewai_icon.svg" alt="" width={18} height={18} />,
    },
    {
      label: "LiveKit",
      href: "/integrations/frameworks/livekit",
      icon: <Image src="/images/integrations/livekit_icon.svg" alt="" width={18} height={18} />,
    },
  ],
};

const modelProvidersGroup = {
  title: "Model Providers",
  items: [
    {
      label: "OpenAI",
      href: "/integrations/model-providers/openai-py",
      icon: <Image src="/images/integrations/openai_icon.svg" alt="" width={18} height={18} />,
    },
    {
      label: "Anthropic",
      href: "/integrations/model-providers/anthropic",
      icon: <Image src="/images/integrations/anthropic_icon.png" alt="" width={18} height={18} />,
    },
    {
      label: "Amazon Bedrock",
      href: "/integrations/model-providers/amazon-bedrock",
      icon: <Image src="/images/integrations/bedrock_icon.png" alt="" width={18} height={18} />,
    },
    {
      label: "Azure OpenAI",
      href: "/integrations/model-providers/openai-py",
      icon: <Image src="/images/integrations/microsoft_icon.svg" alt="" width={18} height={18} />,
    },
    {
      label: "Mistral AI",
      href: "/integrations/model-providers/mistral-sdk",
      icon: <Image src="/images/integrations/mistral_icon.svg" alt="" width={18} height={18} />,
    },
    {
      label: "Google Gemini",
      href: "/integrations/model-providers/google-gemini",
      icon: <Image src="/images/integrations/google_gemini_icon.svg" alt="" width={18} height={18} />,
    },
    {
      label: "xAI",
      href: "/integrations/model-providers/xai-grok",
      icon: <Image src="/images/integrations/xai_icon.svg" alt="" width={18} height={18} />,
    },
    {
      label: "vLLM",
      href: "/integrations/model-providers/vllm",
      icon: <Image src="/images/integrations/vllm_icon.svg" alt="" width={18} height={18} />,
    },
    {
      label: "Groq",
      href: "/integrations/model-providers/groq",
      icon: <Image src="/images/integrations/groq_icon.png" alt="" width={18} height={18} />,
    },
  ],
};

type MarqueeItem = { label: string; href: string; icon: string };

/** Other integration pages (ranked by views), split across two rows */
const marqueeRow1: MarqueeItem[] = [
  { label: "Claude Code", href: "/integrations/other/claude-code", icon: "/images/integrations/anthropic_icon.png" },
  {
    label: "LiteLLM (Proxy/Gateway)",
    href: "/integrations/gateways/litellm",
    icon: "/images/integrations/litellm_icon.png",
  },
  { label: "OpenClaw", href: "/integrations/other/openclaw", icon: "/images/integrations/openclaw_icon.svg" },
  {
    label: "Claude Agent SDK (Python)",
    href: "/integrations/frameworks/claude-agent-sdk",
    icon: "/images/integrations/claude_icon.png",
  },
  {
    label: "LangChain DeepAgents",
    href: "/integrations/frameworks/langchain-deepagents",
    icon: "/images/integrations/langchain_icon.png",
  },
  { label: "OpenWebUI", href: "/integrations/no-code/openwebui", icon: "/images/integrations/openwebui_icon.png" },
  { label: "Ollama", href: "/integrations/model-providers/ollama", icon: "/images/integrations/ollama_icon.svg" },
  {
    label: "OpenAI Agents SDK",
    href: "/integrations/frameworks/openai-agents",
    icon: "/images/integrations/openai_icon.svg",
  },
  { label: "Dify", href: "/integrations/no-code/dify", icon: "/images/integrations/dify_icon.svg" },
  { label: "Langflow", href: "/integrations/no-code/langflow", icon: "/images/integrations/langflow_icon.svg" },
  { label: "OpenRouter", href: "/integrations/gateways/openrouter", icon: "/images/integrations/openrouter_icon.svg" },
  { label: "n8n", href: "/integrations/no-code/n8n", icon: "/images/integrations/n8n_icon.svg" },
  { label: "Spring AI", href: "/integrations/frameworks/spring-ai", icon: "/images/integrations/spring_icon.svg" },
  { label: "Cursor", href: "/integrations/other/cursor", icon: "/images/integrations/cursor_icon.png" },
  { label: "PostHog", href: "/integrations/analytics/posthog", icon: "/images/integrations/posthog_icon.svg" },
];

const marqueeRow2: MarqueeItem[] = [
  { label: "DSPy", href: "/integrations/frameworks/dspy", icon: "/images/integrations/dspy_icon.png" },
  {
    label: "Amazon AgentCore",
    href: "/integrations/frameworks/amazon-agentcore",
    icon: "/images/integrations/bedrock_icon.png",
  },
  {
    label: "Strands Agents",
    href: "/integrations/frameworks/strands-agents",
    icon: "/images/integrations/strands_agents_icon.svg",
  },
  {
    label: "LlamaIndex",
    href: "/integrations/frameworks/llamaindex",
    icon: "/images/integrations/llamaindex_icon.png",
  },
  { label: "Agno Agents", href: "/integrations/frameworks/agno-agents", icon: "/images/integrations/agno_icon.jpg" },
  { label: "Temporal", href: "/integrations/frameworks/temporal", icon: "/images/integrations/temporal.svg" },
  {
    label: "Agentic Data Stack",
    href: "/integrations/agentic-data-stack",
    icon: "/images/integrations/opentelemetry_icon.svg",
  },
  { label: "Mastra", href: "/integrations/frameworks/mastra", icon: "/images/integrations/mastra_icon.png" },
  {
    label: "Claude Agent SDK (JS)",
    href: "/integrations/frameworks/claude-agent-sdk-js",
    icon: "/images/integrations/anthropic_icon.png",
  },
  { label: "Promptfoo", href: "/integrations/other/promptfoo", icon: "/images/integrations/promptfoo_icon.svg" },
  {
    label: "Microsoft Agent Framework",
    href: "/integrations/frameworks/microsoft-agent-framework",
    icon: "/images/integrations/microsoft_icon.svg",
  },
  {
    label: "Google Vertex AI",
    href: "/integrations/model-providers/google-vertex-ai",
    icon: "/images/integrations/vertexai_icon.png",
  },
  { label: "Ragas", href: "/integrations/frameworks/ragas", icon: "/images/integrations/ragas_icon.svg" },
  { label: "AutoGen", href: "/integrations/frameworks/autogen", icon: "/images/integrations/autogen_icon.svg" },
  { label: "RAGflow", href: "/integrations/no-code/ragflow", icon: "/images/integrations/ragflow_icon.svg" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function IntegrationGroupCard({
  title,
  items,
  className,
  showMoreLabel,
}: {
  title: string;
  items: { label: string; href: string; icon?: React.ReactNode }[];
  className?: string;
  showMoreLabel?: boolean;
}) {
  return (
    <ChipCard
      className={cn(
        "integration-group flex flex-col gap-3.5 items-start p-3 sm:p-4.5",
        className
      )}
    >
      <div className="flex flex-row flex-wrap gap-y-1 gap-x-3 justify-between items-baseline w-full">
        <Text size="m" className="font-medium text-left text-text-secondary">
          {title}
        </Text>
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        {items.map((item) => (
          <IntegrationLabel
            key={item.label}
            href={item.href}
            icon={item.icon}
            label={item.label}
          />
        ))}
        {showMoreLabel && (
          <span className="text-[13px] text-text-tertiary ml-1">
            and many more…
          </span>
        )}
      </div>
    </ChipCard>
  );
}

function MarqueeRow({
  items,
  direction = "left",
  duration = 40,
}: {
  items: MarqueeItem[];
  direction?: "left" | "right";
  duration?: number;
}) {
  const [paused, setPaused] = React.useState(false);
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden w-full mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div
        className={cn(
          "flex gap-2 w-max",
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
        )}
        style={{
          animationDuration: `${duration}s`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {doubled.map((item, i) => (
          <IntegrationLabel
            key={`${item.label}-${i}`}
            href={item.href}
            icon={<Image src={item.icon} alt="" width={18} height={18} />}
            label={item.label}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function Integrations() {
  return (
    <HomeSection id="integrations" className="pt-[120px]">
      <div className="flex flex-col gap-4 items-start mb-10">
        <Heading className="text-left max-w-[16ch] sm:max-w-none">
          Works with <TextHighlight>any stack.</TextHighlight>
        </Heading>
        <Text className="text-left max-w-[52ch]">
          Langfuse works with any language and framework supporting OTel
          instrumentation. Additionally, 80+ integrations make getting started
          even easier. No framework lock-in.
        </Text>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <IntegrationGroupCard
          className="sm:col-span-2"
          title={languagesGroup.title}
          items={languagesGroup.items}
        />

        <IntegrationGroupCard
          title={agentFrameworksGroup.title}
          items={agentFrameworksGroup.items}
          showMoreLabel
        />
        <IntegrationGroupCard
          title={modelProvidersGroup.title}
          items={modelProvidersGroup.items}
          showMoreLabel
        />

        <ChipCard className="integration-group sm:col-span-2 flex flex-col gap-4 items-start p-3 sm:p-4.5">
          <div className="flex flex-row flex-wrap gap-y-1 gap-x-3 justify-between items-baseline w-full">
            <Text size="m" className="font-medium text-left text-text-secondary">
              80+ more integrations
            </Text>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <MarqueeRow items={marqueeRow1} direction="left" duration={40} />
            <MarqueeRow items={marqueeRow2} direction="right" duration={48} />
          </div>
        </ChipCard>
      </div>
      <div className="mt-4">
        <Link
          href="/integrations"
          className="text-[13px] text-text-secondary hover:text-text-primary transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          Don&apos;t find your integration? Request it →
        </Link>
      </div>
    </HomeSection>
  );
}
