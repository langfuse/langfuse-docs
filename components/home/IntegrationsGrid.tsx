import { cn } from "@/lib/utils";
import { ArrowUpRightFromSquare, Code, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import IconPython from "../icons/python";
import IconTypescript from "../icons/typescript";
import IconOpenai from "../icons/openai";
import { HomeSection } from "./components/HomeSection";
import { Header } from "../Header";
import React from "react";

interface IntegrationTileProps {
  title: string;
  href: string;
  icon: ReactNode;
}

const integrations: IntegrationTileProps[] = [
  {
    title: "Python SDK",
    href: "/docs/sdk/python",
    icon: <IconPython className="h-9 w-9" />,
  },
  {
    title: "JS/TS SDK",
    href: "/docs/sdk/typescript/guide",
    icon: <IconTypescript className="h-7 w-7" />,
  },
  {
    title: "API",
    href: "/docs/api",
    icon: <Code className="h-6 w-6" />,
  },
  {
    title: "Open\u200BTelemetry",
    href: "/docs/opentelemetry/get-started",
    icon: (
      <Image
        src="/images/integrations/opentelemetry_icon.svg"
        alt="OpenTelemetry Icon"
        width={36}
        height={36}
      />
    ),
  },
  {
    title: "OpenAI SDK",
    href: "/docs/integrations/openai/get-started",
    icon: <IconOpenai className="h-7 w-7" />,
  },
  {
    title: "LangChain, LangGraph",
    href: "/docs/integrations/langchain/tracing",
    icon: (
      <Image
        src="/images/integrations/langchain_icon.png"
        alt="Langchain Icon"
        width={40}
        height={40}
        className="dark:invert dark:saturate-0 dark:brightness-0"
      />
    ),
  },
  {
    title: "Llama-Index",
    href: "/docs/integrations/llama-index/get-started",
    icon: (
      <Image
        src="/images/integrations/llamaindex_icon.png"
        alt="Llama-index Icon"
        width={35}
        height={35}
      />
    ),
  },
  {
    title: "CrewAI",
    href: "/docs/integrations/crewai",
    icon: (
      <Image
        src="/images/integrations/crewai_icon.svg"
        alt="CrewAI Icon"
        width={60}
        height={40}
      />
    ),
  },
  {
    title: "LiteLLM",
    href: "/docs/integrations/litellm/tracing",
    icon: (
      <Image
        src="/images/integrations/litellm_icon.png"
        alt="LiteLLM Icon"
        width={40}
        height={40}
      />
    ),
  },
  {
    title: "AI SDK",
    href: "/docs/integrations/vercel-ai-sdk",
    icon: (
      <span className="text-sm font-medium whitespace-nowrap font-mono">
        npm i ai
      </span>
    ),
  },
  {
    title: "Haystack",
    href: "/docs/integrations/haystack",
    icon: (
      <Image
        src="/images/integrations/haystack_icon.png"
        alt="Haystack Icon"
        width={28}
        height={28}
      />
    ),
  },
  {
    title: "Instructor",
    href: "/docs/integrations/instructor",
    icon: (
      <Image
        src="/images/integrations/instructor_icon.svg"
        alt="Instructor Icon"
        width={36}
        height={36}
        className="dark:invert"
      />
    ),
  },
  {
    title: "Semantic Kernel",
    href: "/docs/integrations/semantic-kernel",
    icon: (
      <Image
        src="/images/integrations/microsoft_icon.svg"
        alt="Semantic Kernel Icon"
        width={36}
        height={36}
      />
    ),
  },
  {
    title: "DSPy",
    href: "/docs/integrations/dspy",
    icon: (
      <Image
        src="/images/integrations/dspy_icon.png"
        alt="DSPy Icon"
        width={36}
        height={36}
      />
    ),
  },
  {
    title: "Smolagents",
    href: "/docs/integrations/smolagents",
    icon: (
      <Image
        src="/images/integrations/huggingface_icon.svg"
        alt="Smolagents Icon"
        width={36}
        height={36}
      />
    ),
  },
  {
    title: "Pydantic AI",
    href: "/docs/integrations/pydantic-ai",
    icon: (
      <Image
        src="/images/integrations/pydantic_ai_icon.svg"
        alt="Pydantic AI Icon"
        width={36}
        height={36}
      />
    ),
  },
  {
    title: "AutoGen",
    href: "/docs/integrations/autogen",
    icon: (
      <Image
        src="/images/integrations/autogen_icon.svg"
        alt="AutoGen Icon"
        width={36}
        height={36}
      />
    ),
  },
  {
    title: "Amazon Bedrock",
    href: "/docs/integrations/amazon-bedrock",
    icon: (
      <Image
        src="/images/integrations/bedrock_icon.png"
        alt="Bedrock Icon"
        width={36}
        height={36}
      />
    ),
  },
  {
    title: "Google Vertex/Gemini",
    href: "/docs/integrations/google-vertex-ai",
    icon: (
      <Image
        src="/images/integrations/google_gemini_icon.svg"
        alt="Google Gemini Icon"
        width={36}
        height={36}
      />
    ),
  },
  {
    title: "Ollama",
    href: "/docs/integrations/ollama",
    icon: (
      <Image
        src="/images/integrations/ollama_icon.png"
        alt="Ollama Icon"
        width={30}
        height={30}
        className="dark:invert"
      />
    ),
  },
  {
    title: "Flowise",
    href: "/docs/integrations/flowise",
    icon: (
      <Image
        src="/images/integrations/flowise_logo.png"
        alt="Flowise Logo"
        width={50}
        height={36}
      />
    ),
  },
  {
    title: "Langflow",
    href: "/docs/integrations/langflow",
    icon: (
      <Image
        src="/images/integrations/langflow_icon.svg"
        alt="Langflow Icon"
        width={36}
        height={36}
        className="dark:invert"
      />
    ),
  },
  {
    title: "Dify",
    href: "/docs/integrations/dify",
    icon: (
      <Image
        src="/images/integrations/dify_icon.png"
        alt="Dify Icon"
        width={36}
        height={36}
      />
    ),
  },
  {
    title: "OpenWeb UI",
    href: "/docs/integrations/openwebui",
    icon: (
      <Image
        src="/images/integrations/openwebui_icon.png"
        alt="OpenWeb UI Icon"
        width={36}
        height={36}
        className="dark:invert"
      />
    ),
  },
  {
    title: "More",
    href: "/docs/integrations/overview",
    icon: <MoreHorizontal className="h-5 w-5" />,
  },
];

function IntegrationTile({ title, href, icon }: IntegrationTileProps) {
  return (
    <Link href={href} className="group relative aspect-square w-full">
      <div className="flex h-full flex-col items-center justify-center gap-y-1 sm:gap-y-2 p-2 sm:p-4">
        <div className="size-8 sm:size-12 flex items-center justify-center perspective-1000">
          <div className="relative w-full h-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
            {/* Front */}
            <div className="absolute inset-0 flex items-center justify-center [backface-visibility:hidden] scale-75 sm:scale-100">
              {icon}
            </div>
            {/* Back */}
            <div className="absolute inset-0 flex items-center justify-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
              <ArrowUpRightFromSquare className="size-4 sm:size-6" />
            </div>
          </div>
        </div>
        <span className="text-center text-xs sm:text-sm text-muted-foreground line-clamp-2">
          {title}
        </span>
      </div>
    </Link>
  );
}

export default function IntegrationsGrid() {
  return (
    <HomeSection>
      <Header
        title="Works with any LLM app and model"
        description="SDKs for Python & JS/TS, native integrations for popular libraries and support for OpenTelemetry"
        buttons={[
          {
            href: "/docs/integrations/overview",
            text: "Integration overview",
          },
          {
            href: "/ideas",
            text: "Request new integration",
          },
        ]}
      />
      <div className="relative w-full mx-auto max-w-2xl rounded border bg-card overflow-hidden">
        <div className="grid grid-cols-5 divide-x divide-y divide-border [&>*:nth-child(-n+5)]:border-t [&>*:nth-child(5n+1)]:border-l">
          {integrations.map((integration) => (
            <div
              key={integration.title}
              className="relative flex items-center justify-center"
            >
              <IntegrationTile {...integration} />
            </div>
          ))}
        </div>
      </div>
    </HomeSection>
  );
}
