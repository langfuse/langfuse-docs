import type { ReactNode } from "react";
import IconPython from "@/components/icons/python";
import IconTypescript from "@/components/icons/typescript";
import Link from "next/link";
import { IntegrationLabel } from "@/components/ui/integration-label";
import { integrationsSource } from "@/lib/source";
import { cn } from "@/lib/utils";

const agentFrameworks = [
  { label: "LangChain", href: "/integrations/frameworks/langchain" },
  { label: "LangGraph", href: "/integrations/frameworks/langgraph" },
  {
    label: "OpenAI Agents",
    href: "/integrations/frameworks/openai-agents",
  },
  {
    label: "Vercel AI SDK",
    href: "/integrations/frameworks/vercel-ai-sdk",
  },
  { label: "Pydantic AI", href: "/integrations/frameworks/pydantic-ai" },
  { label: "CrewAI", href: "/integrations/frameworks/crewai" },
  { label: "Mastra", href: "/integrations/frameworks/mastra" },
] as const;

const modelProviders = [
  { label: "OpenAI", href: "/integrations/model-providers/openai-py" },
  { label: "Anthropic", href: "/integrations/model-providers/anthropic" },
  {
    label: "Google Gemini",
    href: "/integrations/model-providers/google-gemini",
  },
  {
    label: "Amazon Bedrock",
    href: "/integrations/model-providers/amazon-bedrock",
  },
  {
    label: "Azure OpenAI",
    href: "/integrations/model-providers/openai-py",
    logo: "/images/integrations/microsoft_icon.svg",
  },
  { label: "LiteLLM", href: "/integrations/frameworks/litellm-sdk" },
] as const;

const languagesAndTelemetry = [
  { label: "Python", href: "/docs/observability/sdk/overview", icon: "python" },
  {
    label: "TypeScript",
    href: "/docs/observability/sdk/overview",
    icon: "typescript",
  },
  { label: "OpenTelemetry", href: "/integrations/native/opentelemetry" },
  {
    label: "REST API",
    href: "/docs/api-and-data-platform/features/public-api",
  },
] as const;

export type IntegrationItem = {
  label: string;
  href: string;
  icon?: "python" | "typescript";
  logo?: string;
  logoAppearance?: "light" | "dark" | "both";
};

export type IntegrationGroup = {
  title: string;
  items: readonly IntegrationItem[];
};

const DEFAULT_GROUPS: IntegrationGroup[] = [
  { title: "Agent frameworks", items: agentFrameworks },
  { title: "Model providers", items: modelProviders },
  { title: "Languages & telemetry", items: languagesAndTelemetry },
];

function integrationSlugFromHref(href: string): string[] | undefined {
  const path = href.split("#")[0];
  if (!path.startsWith("/integrations/")) return undefined;
  return path
    .replace(/^\/integrations\//, "")
    .split("/")
    .filter(Boolean);
}

function resolveChipIcon(item: IntegrationItem): ReactNode {
  if (item.icon === "python") {
    return <IconPython className="h-[12px] w-[12px]" />;
  }
  if (item.icon === "typescript") {
    return <IconTypescript className="h-[12px] w-[12px]" />;
  }

  const slug = integrationSlugFromHref(item.href);
  const page = slug ? integrationsSource.getPage(slug) : undefined;
  const data = page?.data as
    | { logo?: string; logoAppearance?: "light" | "dark" | "both" }
    | undefined;
  const logo = item.logo ?? data?.logo;
  if (!logo) return undefined;

  const appearance = item.logo
    ? item.logoAppearance
    : (item.logoAppearance ?? data?.logoAppearance);

  return (
    <img
      src={logo}
      alt=""
      aria-hidden
      className={cn(
        "h-full w-full object-contain",
        appearance === "dark" && "dark:brightness-0 dark:invert",
        appearance === "light" && "invert dark:invert-0",
      )}
    />
  );
}

function IntegrationRow({
  title,
  items,
}: {
  title: string;
  items: readonly IntegrationItem[];
}) {
  return (
    <div className="grid gap-3 border-b border-line-structure py-4 md:grid-cols-[170px_1fr] md:gap-6 md:py-5">
      <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-text-tertiary md:pt-1">
        {title}
      </p>
      <div className="flex flex-wrap gap-1.5 md:gap-2">
        {items.map((item) => (
          <IntegrationLabel
            key={item.label}
            href={item.href}
            label={item.label}
            icon={resolveChipIcon(item)}
          />
        ))}
      </div>
    </div>
  );
}

export function RelevantIntegrations({
  headingLine1 = "Any model,",
  headingLine2 = "any framework",
  description = "Based on OpenTelemetry. Two lines in your handler, or point an existing OTel exporter at Langfuse — nothing else in your stack changes.",
  groups = DEFAULT_GROUPS,
  browseLabel = "Need another framework?",
  browseHref = "/integrations",
  browseCta = "Browse all 80+ integrations →",
}: {
  headingLine1?: string;
  headingLine2?: string;
  description?: string;
  groups?: readonly IntegrationGroup[];
  browseLabel?: string;
  browseHref?: string;
  browseCta?: string;
} = {}) {
  return (
    <div>
      <div className="grid gap-4 border-b border-line-structure pb-5 md:grid-cols-[1fr_1fr] md:items-center md:gap-8">
        <h3 className="text-[34px] leading-[0.95] text-text-primary sm:text-[48px]">
          <span className="block">{headingLine1}</span>
          <span className="block">{headingLine2}</span>
        </h3>
        <p className="max-w-[58ch] text-[13px] leading-[1.45] text-text-secondary md:justify-self-end">
          {description}
        </p>
      </div>

      {groups.map((group) => (
        <IntegrationRow
          key={group.title}
          title={group.title}
          items={group.items}
        />
      ))}

      <div className="pt-4 text-right text-[12px] text-text-tertiary">
        {browseLabel}{" "}
        <Link
          href={browseHref}
          className="text-text-secondary underline underline-offset-2 hover:text-text-primary"
        >
          {browseCta}
        </Link>
      </div>
    </div>
  );
}
