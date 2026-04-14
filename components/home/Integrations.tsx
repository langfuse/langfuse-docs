"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { HomeSection } from "./HomeSection";
import { Heading, TextHighlight, ChipCard } from "@/components/ui";
import { Text } from "@/components/ui/text";
import { IntegrationLabel } from "@/components/ui/integration-label";
import IconPython from "@/components/icons/python";
import IconTypescript from "@/components/icons/typescript";

// ─── Data ─────────────────────────────────────────────────────────────────────

const otelGroup = {
  title: "Any Language via OpenTelemetry",
  href: "/integrations",
  mainItems: [
    {
      label: "Python (Native SDKs)",
      icon: <IconPython className="w-[18px] h-[18px]" />,
    },
    {
      label: "TypeScript (Native SDKs)",
      icon: <IconTypescript className="w-[18px] h-[18px]" />,
    },
  ],
  textItems: ["Go", "Java", ".NET", "Ruby", "PHP", "Swift"],
};

const agentFrameworksGroup = {
  title: "Agent Frameworks",
  href: "/integrations/frameworks",
  items: [
    {
      label: "LangChain",
      icon: <Image src="/images/integrations/langchain_icon.png" alt="" width={18} height={18} />,
    },
    {
      label: "Vercel AI SDK",
      icon: <Image src="/images/integrations/vercel_ai_sdk_icon.png" alt="" width={18} height={18} />,
    },
    {
      label: "LiteLLM",
      icon: <Image src="/images/integrations/litellm_icon.png" alt="" width={18} height={18} />,
    },
    {
      label: "Pydantic AI",
      icon: <Image src="/images/integrations/pydantic_ai_icon.svg" alt="" width={18} height={18} />,
    },
    {
      label: "Google ADK",
      icon: <Image src="/images/integrations/google_adk_icon.png" alt="" width={18} height={18} />,
    },
    {
      label: "CrewAI",
      icon: <Image src="/images/integrations/crewai_icon.svg" alt="" width={18} height={18} />,
    },
    {
      label: "LiveKit",
      icon: <Image src="/images/integrations/livekit_icon.svg" alt="" width={18} height={18} />,
    },
  ],
};

const modelProvidersGroup = {
  title: "Model Providers",
  href: "/integrations/model-providers",
  items: [
    {
      label: "OpenAI",
      icon: <Image src="/images/integrations/openai_icon.svg" alt="" width={18} height={18} />,
    },
    {
      label: "Anthropic",
      icon: <Image src="/images/integrations/anthropic_icon.png" alt="" width={18} height={18} />,
    },
    {
      label: "Amazon Bedrock",
      icon: <Image src="/images/integrations/bedrock_icon.png" alt="" width={18} height={18} />,
    },
    {
      label: "Azure OpenAI",
      icon: <Image src="/images/integrations/microsoft_icon.svg" alt="" width={18} height={18} />,
    },
    {
      label: "Mistral AI",
      icon: <Image src="/images/integrations/mistral_icon.svg" alt="" width={18} height={18} />,
    },
    {
      label: "Google Gemini",
      icon: <Image src="/images/integrations/google_gemini_icon.svg" alt="" width={18} height={18} />,
    },
    {
      label: "xAI",
      icon: <Image src="/images/integrations/xai_icon.svg" alt="" width={18} height={18} />,
    },
    {
      label: "vLLM",
      icon: <Image src="/images/integrations/vllm_icon.svg" alt="" width={18} height={18} />,
    },
    {
      label: "Groq",
      icon: <Image src="/images/integrations/groq_icon.png" alt="" width={18} height={18} />,
    },
  ],
};

type MarqueeItem = { label: string; icon: string };

const marqueeRow1: MarqueeItem[] = [
  { label: "LlamaIndex", icon: "/images/integrations/llamaindex_icon.png" },
  { label: "DSPy", icon: "/images/integrations/dspy_icon.png" },
  { label: "Haystack", icon: "/images/integrations/haystack_icon.png" },
  { label: "Flowise", icon: "/images/integrations/flowise_icon.svg" },
  { label: "Langflow", icon: "/images/integrations/langflow_icon.svg" },
  { label: "Instructor", icon: "/images/integrations/instructor_icon.svg" },
  { label: "Cohere", icon: "/images/integrations/cohere_icon.svg" },
  { label: "Ollama", icon: "/images/integrations/ollama_icon.svg" },
  { label: "DeepSeek", icon: "/images/integrations/deepseek_icon.svg" },
  { label: "OpenRouter", icon: "/images/integrations/openrouter_icon.svg" },
  { label: "BeeAI", icon: "/images/integrations/beeai_icon.png" },
  { label: "Mirascope", icon: "/images/integrations/mirascope_icon.svg" },
];

const marqueeRow2: MarqueeItem[] = [
  { label: "Databricks", icon: "/images/integrations/databricks_icon.svg" },
  { label: "Together AI", icon: "/images/integrations/togetherai_icon.svg" },
  { label: "Fireworks AI", icon: "/images/integrations/fireworks_ai_icon.svg" },
  { label: "n8n", icon: "/images/integrations/n8n_icon.svg" },
  { label: "Dify", icon: "/images/integrations/dify_icon.svg" },
  { label: "HuggingFace", icon: "/images/integrations/huggingface_icon.svg" },
  { label: "Portkey", icon: "/images/integrations/portkey_icon.svg" },
  { label: "Mastra", icon: "/images/integrations/mastra_icon.png" },
  { label: "AutoGen", icon: "/images/integrations/autogen_icon.svg" },
  { label: "Pipecat", icon: "/images/integrations/pipecat_icon.svg" },
  { label: "Ragas", icon: "/images/integrations/ragas_icon.svg" },
  { label: "PromptFoo", icon: "/images/integrations/promptfoo_icon.svg" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function IntegrationGroup({
  title,
  href,
  items,
}: {
  title: string;
  href: string;
  items: { label: string; icon: React.ReactNode }[];
}) {
  return (
    <ChipCard
      tooltip="See all"
      href={href}
      className="integration-group flex flex-col gap-3.5 items-start p-3 sm:p-4.5"
    >
      <Text size="s" className="font-medium text-left text-text-secondary">
        {title}
      </Text>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <IntegrationLabel key={item.label} icon={item.icon} label={item.label} />
        ))}
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
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden w-full mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <motion.div
        className="flex gap-2 w-max"
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <IntegrationLabel
            key={`${item.label}-${i}`}
            icon={<Image src={item.icon} alt="" width={18} height={18} />}
            label={item.label}
          />
        ))}
      </motion.div>
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
        <Text className="text-left max-w-[60ch]">
          Langfuse works with any language and framework supporting OTel
          instrumentation. Additionally, 80+ integrations make getting started
          even easier. No framework lock-in.
        </Text>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <ChipCard
          tooltip="See all"
          href={otelGroup.href}
          className="integration-group sm:col-span-2 flex flex-col gap-3.5 items-start p-3 sm:p-4.5"
        >
          <Text size="s" className="font-medium text-left text-text-secondary">
            {otelGroup.title}
          </Text>
          <div className="flex flex-wrap gap-2">
            {otelGroup.mainItems.map((item) => (
              <IntegrationLabel
                key={item.label}
                icon={item.icon}
                label={item.label}
              />
            ))}
            {otelGroup.textItems.map((label) => (
              <IntegrationLabel key={label} label={label} />
            ))}
          </div>
        </ChipCard>

        <IntegrationGroup
          title={agentFrameworksGroup.title}
          href={agentFrameworksGroup.href}
          items={agentFrameworksGroup.items}
        />
        <IntegrationGroup
          title={modelProvidersGroup.title}
          href={modelProvidersGroup.href}
          items={modelProvidersGroup.items}
        />

        <ChipCard
          href="/integrations"
          className="integration-group sm:col-span-2 flex flex-col gap-4 items-start p-3 sm:p-4.5"
        >
          <Text size="s" className="font-medium text-left text-text-secondary">
            80+ more integrations
          </Text>
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
