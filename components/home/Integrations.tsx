"use client";

import Image from "next/image";
import { HomeSection } from "./HomeSection";
import { Heading, TextHighlight, ChipCard } from "@/components/ui";
import { Text } from "@/components/ui/text";
import IconPython from "@/components/icons/python";
import IconTypescript from "@/components/icons/typescript";
import IconOpenai from "@/components/icons/openai";

const groups = [
  {
    title: "LLM Providers",
    href: "/integrations/model-providers",
    items: [
      { label: "OpenAI", icon: <Image src="/images/integrations/openai_icon.svg" alt="" width={18} height={18} /> },
      { label: "Anthropic", icon: <Image src="/images/integrations/anthropic_icon.png" alt="" width={18} height={18} /> },
      { label: "Cohere", icon: <Image src="/images/integrations/cohere_icon.svg" alt="" width={18} height={18} /> },
      { label: "Google Gemini", icon: <Image src="/images/integrations/google_gemini_icon.svg" alt="" width={18} height={18} /> },
      { label: "Mistral AI", icon: <Image src="/images/integrations/mistral_icon.svg" alt="" width={18} height={18} /> },
      { label: "Meta Llama", icon: <Image src="/images/integrations/microsoft_icon.svg" alt="" width={18} height={18} /> },
      { label: "Azure OpenAI", icon: <Image src="/images/integrations/microsoft_icon.svg" alt="" width={18} height={18} /> },
      { label: "AWS Bedrock", icon: <Image src="/images/integrations/bedrock_icon.png" alt="" width={18} height={18} /> },
    ],
  },
  {
    title: "Agent Frameworks",
    href: "/integrations/frameworks",
    items: [
      { label: "LangChain", icon: <Image src="/images/integrations/langchain_icon.png" alt="" width={18} height={18} /> },
      { label: "LlamaIndex", icon: <Image src="/images/integrations/llamaindex_icon.png" alt="" width={18} height={18} /> },
      { label: "Vercel AI SDK", icon: <Image src="/images/integrations/vercel_ai_sdk_icon.png" alt="" width={18} height={18} /> },
      { label: "Haystack", icon: <Image src="/images/integrations/haystack_icon.png" alt="" width={18} height={18} /> },
      { label: "LiteLLM", icon: <Image src="/images/integrations/litellm_icon.png" alt="" width={18} height={18} /> },
      { label: "OpenAI SDK", icon: <Image src="/images/integrations/openai_icon.svg" alt="" width={18} height={18} /> },
      { label: "DSPy", icon: <Image src="/images/integrations/dspy_icon.png" alt="" width={18} height={18} /> },
      { label: "Anthropic SDK", icon: <Image src="/images/integrations/anthropic_icon.png" alt="" width={18} height={18} /> },
      { label: "LangGraph", icon: <Image src="/images/integrations/langchain_icon.png" alt="" width={18} height={18} /> },
      { label: "Instructor", icon: <Image src="/images/integrations/instructor_icon.svg" alt="" width={18} height={18} /> },
    ],
  },
  {
    title: "Vector DBs and Infrastructure",
    href: "/integrations",
    items: [
      { label: "Pinecone", icon: <Image src="/images/integrations/opentelemetry_icon.svg" alt="" width={18} height={18} /> },
      { label: "Weaviate", icon: <Image src="/images/integrations/milvus_icon.svg" alt="" width={18} height={18} /> },
      { label: "Qdrant", icon: <Image src="/images/integrations/opentelemetry_icon.svg" alt="" width={18} height={18} /> },
      { label: "Chroma", icon: <Image src="/images/integrations/opentelemetry_icon.svg" alt="" width={18} height={18} /> },
      { label: "Supabase", icon: <Image src="/images/integrations/opentelemetry_icon.svg" alt="" width={18} height={18} /> },
      { label: "PostgreSQL", icon: <Image src="/images/integrations/opentelemetry_icon.svg" alt="" width={18} height={18} /> },
    ],
  },
  {
    title: "Native Integrations",
    href: "/integrations",
    items: [
      { label: "Python", icon: <IconPython className="w-[18px] h-[18px]" /> },
      { label: "TypeScript", icon: <IconTypescript className="w-[18px] h-[18px]" /> },
      { label: "Next.js", icon: <IconOpenai className="w-[18px] h-[18px]" /> },
      { label: "Node.js", icon: <IconOpenai className="w-[18px] h-[18px]" /> },
      { label: "Flowise", icon: <Image src="/images/integrations/flowise_icon.svg" alt="" width={18} height={18} /> },
      { label: "Langflow", icon: <Image src="/images/integrations/langflow_icon.svg" alt="" width={18} height={18} /> },
    ],
  },
];

function IntegrationLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-[2px] px-1.5 py-1 border border-line-structure bg-surface-bg text-[13px] font-normal text-text-secondary leading-none whitespace-nowrap">
      <span className="shrink-0 w-[18px] h-[18px] flex items-center justify-center">
        {icon}
      </span>
      {label}
    </span>
  );
}

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
    <ChipCard tooltip="See all" href={href} className="flex flex-col gap-4 items-start p-5 -mt-px -ml-px first:ml-0">
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

export function Integrations() {
  return (
    <HomeSection id="integrations" className="pt-20">
      <div className="flex flex-col gap-4 items-start mb-10">
        <Heading>
          <TextHighlight>Framework agnostic.</TextHighlight> Works with your stack.
        </Heading>
        <Text className="text-left">
          80+ integrations. OpenTelemetry native. No framework lock-in.
        </Text>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {groups.map((group) => (
          <IntegrationGroup
            key={group.title}
            title={group.title}
            href={group.href}
            items={group.items}
          />
        ))}
      </div>
    </HomeSection>
  );
}
