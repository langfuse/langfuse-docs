import Image from "next/image";
import Link from "next/link";
import { IntegrationLabel } from "@/components/ui/integration-label";
import IconPython from "@/components/icons/python";
import IconTypescript from "@/components/icons/typescript";

const agentFrameworks = [
  {
    label: "LangChain",
    href: "/integrations/frameworks/langchain",
    icon: "/images/integrations/langchain_icon.png",
  },
  {
    label: "LangGraph",
    href: "/integrations/frameworks/langgraph",
    icon: "/images/integrations/langgraph_icon.svg",
  },
  {
    label: "OpenAI Agents",
    href: "/integrations/frameworks/openai-agents",
    icon: "/images/integrations/openai_icon.svg",
  },
  {
    label: "Vercel AI SDK",
    href: "/integrations/frameworks/vercel-ai-sdk",
    icon: "/images/integrations/vercel_ai_sdk_icon.png",
  },
  {
    label: "Pydantic AI",
    href: "/integrations/frameworks/pydantic-ai",
    icon: "/images/integrations/pydantic_ai_icon.svg",
  },
  {
    label: "CrewAI",
    href: "/integrations/frameworks/crewai",
    icon: "/images/integrations/crewai_icon.svg",
  },
] as const;

const modelProviders = [
  {
    label: "OpenAI",
    href: "/integrations/model-providers/openai-py",
    icon: "/images/integrations/openai_icon.svg",
  },
  {
    label: "Anthropic",
    href: "/integrations/model-providers/anthropic",
    icon: "/images/integrations/anthropic_icon.png",
  },
  {
    label: "Google Gemini",
    href: "/integrations/model-providers/google-gemini",
    icon: "/images/integrations/google_gemini_icon.svg",
  },
  {
    label: "Amazon Bedrock",
    href: "/integrations/model-providers/amazon-bedrock",
    icon: "/images/integrations/bedrock_icon.png",
  },
] as const;

function IntegrationGroup({
  title,
  items,
}: {
  title: string;
  items: readonly { label: string; href: string; icon: string }[];
}) {
  return (
    <div className="border border-line-structure bg-surface-bg p-4">
      <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-text-tertiary">
        {title}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <IntegrationLabel
            key={item.label}
            href={item.href}
            label={item.label}
            icon={<Image src={item.icon} alt="" width={18} height={18} />}
          />
        ))}
      </div>
    </div>
  );
}

export function RelevantIntegrations() {
  return (
    <div className="mt-8 grid gap-2 lg:grid-cols-3">
      <IntegrationGroup title="Agent frameworks" items={agentFrameworks} />
      <IntegrationGroup title="Model providers" items={modelProviders} />
      <div className="border border-line-structure bg-surface-bg p-4">
        <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-text-tertiary">
          Languages and telemetry
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <IntegrationLabel
            href="/docs/observability/sdk/overview"
            label="Python"
            icon={<IconPython className="h-[18px] w-[18px]" />}
          />
          <IntegrationLabel
            href="/docs/observability/sdk/overview"
            label="TypeScript"
            icon={<IconTypescript className="h-[18px] w-[18px]" />}
          />
          <IntegrationLabel
            href="/integrations/native/opentelemetry"
            label="OpenTelemetry"
          />
        </div>
        <p className="mt-4 text-[12px] text-text-tertiary">
          Need another framework?{" "}
          <Link
            href="/integrations"
            className="text-text-secondary underline underline-offset-2 hover:text-text-primary"
          >
            Browse all integrations →
          </Link>
        </p>
      </div>
    </div>
  );
}
