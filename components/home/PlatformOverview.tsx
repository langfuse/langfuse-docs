import Image from "next/image";
import NextLink from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Bot } from "lucide-react";
import { HomeSection } from "@/components/home/HomeSection";
import { ArrowHead, VArrow } from "@/components/home/diagram-arrows";
import { CornerBox, Heading, Link, TextHighlight } from "@/components/ui";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

const AI_GATEWAY_HREF = "/docs/gateway/overview";
const INTEGRATIONS_HREF = "/integrations";
const SDK_HREF = "/docs/observability/get-started";

// Same hover treatment as the bento cards in `AllTheTools`.
const CARD_HOVER =
  "corner-box-hover-stripes transition-[background] duration-180 ease-out";

const USE_CASES: {
  title: string;
  detail: string;
  icons: { src: string; alt: string }[];
}[] = [
  {
    title: "Personal agents",
    detail: "Coding and desktop assistants",
    icons: [
      { src: "/images/integrations/claude_icon.png", alt: "Claude Code" },
      { src: "/images/integrations/openai_icon.svg", alt: "Codex" },
      { src: "/images/integrations/cursor_icon.png", alt: "Cursor" },
      {
        src: "/images/integrations/github_copilot_icon.svg",
        alt: "GitHub Copilot",
      },
    ],
  },
  {
    title: "Custom agents",
    detail: "Support, voice, RAG, workflows",
    icons: [
      { src: "/images/integrations/langchain_icon.svg", alt: "LangChain" },
      {
        src: "/images/integrations/vercel_ai_sdk_icon.svg",
        alt: "Vercel AI SDK",
      },
      { src: "/images/integrations/livekit_icon.svg", alt: "LiveKit" },
      { src: "/images/integrations/pydantic_ai_icon.svg", alt: "Pydantic AI" },
      { src: "/images/integrations/crewai_icon.svg", alt: "CrewAI" },
      { src: "/images/integrations/google_adk_icon.png", alt: "Google ADK" },
    ],
  },
  {
    title: "Copilots & no-code",
    detail: "Low-code and workflow builders",
    icons: [
      { src: "/images/integrations/microsoft_icon.svg", alt: "Copilot Studio" },
      { src: "/images/integrations/n8n_icon.svg", alt: "n8n" },
      { src: "/images/integrations/dify_icon.svg", alt: "Dify" },
      { src: "/images/integrations/flowise_icon.svg", alt: "Flowise" },
    ],
  },
];

const FEATURE_GROUPS: {
  title: string;
  features: { label: string; href: string }[];
}[] = [
  {
    title: "observe",
    features: [
      { label: "Tracing", href: "/docs/observability/overview" },
      {
        label: "Dashboards",
        href: "/docs/metrics/features/custom-dashboards",
      },
      { label: "Alerts", href: "/docs/observability/features/alerts" },
    ],
  },
  {
    title: "manage",
    features: [
      { label: "Prompts", href: "/docs/prompt-management/overview" },
      { label: "Skills", href: "/docs/skill-management/overview" },
    ],
  },
  {
    title: "evaluate",
    features: [
      { label: "Evals", href: "/docs/evaluation/overview" },
      { label: "Datasets", href: "/docs/evaluation/experiments/datasets" },
      {
        label: "Experiments",
        href: "/docs/evaluation/experiments/experiments-via-sdk",
      },
    ],
  },
];

const ACCESS = [
  { label: "MCP", href: "/docs/api-and-data-platform/features/mcp-server" },
  { label: "CLI", href: "/docs/api-and-data-platform/features/cli" },
  { label: "API", href: "/docs/api-and-data-platform/features/public-api" },
  { label: "SDKs", href: "/docs/observability/sdk/overview" },
];

function Wordmark({
  width,
  height,
  className,
}: {
  width: number;
  height: number;
  className?: string;
}) {
  return (
    <>
      <Image
        src="/brand-assets/wordmark/light/langfuse-by-clickhouse.svg"
        alt="Langfuse by ClickHouse"
        width={width}
        height={height}
        className={cn("dark:hidden", className)}
      />
      <Image
        src="/brand-assets/wordmark/dark/langfuse-by-clickhouse-white.svg"
        alt="Langfuse by ClickHouse"
        width={width}
        height={height}
        className={cn("hidden dark:block", className)}
      />
    </>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono text-[10px] leading-none text-text-tertiary">
      {children}
    </span>
  );
}

function Title({ children }: { children: ReactNode }) {
  return (
    <span className="text-[15px] font-medium leading-tight text-text-primary">
      {children}
    </span>
  );
}

function Detail({ children }: { children: ReactNode }) {
  return (
    <p className="text-left text-[13px] leading-snug tracking-[-0.2px] text-text-tertiary">
      {children}
    </p>
  );
}

function AgentsNode({ className }: { className?: string }) {
  return (
    <NextLink href={INTEGRATIONS_HREF} className={cn("flex", className)}>
      <CornerBox hoverStripes className="flex flex-1 flex-col">
        <ul className="flex flex-1 flex-col justify-between divide-y divide-line-structure p-4">
          {USE_CASES.map((useCase) => (
            <li
              key={useCase.title}
              className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0"
            >
              <Title>{useCase.title}</Title>
              <Detail>{useCase.detail}</Detail>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {useCase.icons.map((icon) => (
                  <span
                    key={icon.alt}
                    title={icon.alt}
                    className="flex h-6 w-6 items-center justify-center border border-line-structure bg-surface-1"
                  >
                    <Image
                      src={icon.src}
                      alt={icon.alt}
                      width={14}
                      height={14}
                    />
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between gap-2 border-t border-line-structure px-4 py-3 text-text-tertiary">
          <Eyebrow>100+ integrations</Eyebrow>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </div>
      </CornerBox>
    </NextLink>
  );
}

function SdkNode({ className }: { className?: string }) {
  return (
    <NextLink href={SDK_HREF} className={cn("flex", className)}>
      <CornerBox hoverStripes className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <Title>SDKs / OpenTelemetry</Title>
        <Detail>
          Instrument your agents with the Langfuse SDKs or any OpenTelemetry
          exporter.
        </Detail>
      </CornerBox>
    </NextLink>
  );
}

function GatewayNode({ className }: { className?: string }) {
  return (
    <NextLink href={AI_GATEWAY_HREF} className={cn("flex", className)}>
      <CornerBox hoverStripes className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2">
          <Wordmark width={105} height={28} className="h-7 w-auto" />
          <span className="bg-surface-cta-primary px-1.5 py-0.5 font-mono text-[10px] leading-none text-text-primary">
            new
          </span>
        </div>
        <Title>AI Gateway</Title>
        <Detail>
          Gateway keys, model access, and cost per user for OpenAI and Anthropic
          calls, all traced automatically. Or bring your own gateway.
        </Detail>
      </CornerBox>
    </NextLink>
  );
}

function LangfuseSection({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Eyebrow>{title}</Eyebrow>
      {children}
    </div>
  );
}

function LangfuseNode({ className }: { className?: string }) {
  return (
    <CornerBox
      className={cn(
        "flex flex-col divide-y divide-line-structure bg-surface-bg",
        className,
      )}
    >
      <div className="flex flex-1 flex-col gap-3.5 p-4">
        <Wordmark width={120} height={32} className="h-8 w-auto self-start" />
        {FEATURE_GROUPS.map((group) => (
          <LangfuseSection key={group.title} title={group.title}>
            <ul className="flex flex-wrap gap-1.5">
              {group.features.map((feature) => (
                <li key={feature.label}>
                  <NextLink
                    href={feature.href}
                    className={cn(
                      "block border border-line-structure px-2 py-1 text-[13px] leading-none text-text-secondary hover:text-text-primary",
                      CARD_HOVER,
                    )}
                  >
                    {feature.label}
                  </NextLink>
                </li>
              ))}
            </ul>
          </LangfuseSection>
        ))}
      </div>

      <LangfuseSection title="in-app agent" className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <Link
            href="/docs/api-and-data-platform/features/halo"
            className="flex items-center gap-2 text-[14px] font-medium text-text-primary no-underline hover:text-text-secondary"
          >
            <span className="flex h-6 w-6 items-center justify-center border border-line-structure bg-surface-cta-primary">
              <Bot className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            Halo
          </Link>
          <Link
            href="/docs/api-and-data-platform/features/agent-skill"
            className="text-[13px] text-text-tertiary no-underline hover:text-text-primary"
          >
            or bring your own agent
          </Link>
        </div>
      </LangfuseSection>

      <LangfuseSection title="every feature via" className="p-4">
        <ul className="grid grid-cols-4 gap-1.5">
          {ACCESS.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="block bg-surface-code py-1.5 text-center font-mono text-[12px] font-medium text-text-code-secondary no-underline transition-colors hover:text-surface-bg dark:hover:text-text-primary"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </LangfuseSection>
    </CornerBox>
  );
}

/**
 * Right-angle connectors between a single node and the two stacked middle
 * nodes. The middle column is two equal rows with a 16px gap, so each middle
 * node's center sits at 25% - 4px and 75% + 4px. Lines are 1px boxes offset by
 * half a pixel so they stay centered on those points, and the elbows sit at the
 * column's horizontal center.
 */
const ROW_TOP = "top-[calc(25%-4.5px)]";
const ROW_BOTTOM = "bottom-[calc(25%-4.5px)]";
const MID = "top-[calc(50%-0.5px)]";

function Line({ className }: { className: string }) {
  return <span className={cn("absolute bg-line-cta", className)} />;
}

function Spine() {
  return (
    <Line className={cn("left-[calc(50%-0.5px)] w-px", ROW_TOP, ROW_BOTTOM)} />
  );
}

function Junction() {
  return (
    <span className="absolute -left-[2.5px] top-1/2 h-[5px] w-[5px] -translate-y-1/2 bg-line-cta" />
  );
}

function ConnectorHead({ className }: { className: string }) {
  return (
    <span className={cn("absolute right-0", className)}>
      <ArrowHead direction="right" />
    </span>
  );
}

function SplitConnector() {
  return (
    <div className="relative h-full" aria-hidden="true">
      <Junction />
      <Line className={cn("left-0 h-px w-1/2", MID)} />
      <Spine />
      <Line className={cn("left-1/2 right-0 h-px", ROW_TOP)} />
      <Line className={cn("left-1/2 right-0 h-px", ROW_BOTTOM)} />
      <ConnectorHead className="top-[calc(25%-8px)]" />
      <ConnectorHead className="bottom-[calc(25%-8px)]" />
    </div>
  );
}

function MergeConnector() {
  return (
    <div className="relative h-full" aria-hidden="true">
      <Line className={cn("left-0 h-px w-1/2", ROW_TOP)} />
      <Line className={cn("left-0 h-px w-1/2", ROW_BOTTOM)} />
      <Spine />
      <Line className={cn("left-1/2 right-0 h-px", MID)} />
      <ConnectorHead className="top-[calc(50%-4px)]" />
    </div>
  );
}

const DIAGRAM_GRID =
  "grid-cols-[minmax(0,1fr)_44px_minmax(0,1fr)_44px_minmax(0,1.2fr)]";

function DiagramColumns() {
  return (
    <>
      <AgentsNode />
      <SplitConnector />
      <div className="grid grid-rows-2 gap-4">
        <SdkNode />
        <GatewayNode />
      </div>
      <MergeConnector />
      <LangfuseNode />
    </>
  );
}

/**
 * Between md and xl the section is a fixed 680px wide, so the 840px desktop
 * layout is zoomed to fit; `zoom` (unlike `transform`) also shrinks the
 * layout box.
 */
function WideDiagram() {
  return (
    <div
      className={cn(
        "hidden md:grid md:max-xl:w-[840px] md:max-xl:[zoom:calc(680/840)]",
        DIAGRAM_GRID,
      )}
    >
      <DiagramColumns />
    </div>
  );
}

function DownArrow() {
  return (
    <div className="flex h-8 justify-center" aria-hidden="true">
      <VArrow />
    </div>
  );
}

function PairedDownArrows() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <DownArrow />
      <DownArrow />
    </div>
  );
}

const DIAGRAM_CAPTION =
  "Personal agents, custom agents, and copilots reach Langfuse either directly, instrumented with the Langfuse SDKs or any OpenTelemetry exporter, or through the Langfuse AI Gateway or your own gateway. In Langfuse you observe with tracing, dashboards, and alerts, manage prompts and skills, and evaluate with evals, datasets, and experiments. The in-app agent Halo, or your own agent, works with this data, and every feature is available via MCP, CLI, API, and SDKs.";

function CompactDiagram() {
  return (
    <div className="flex flex-col md:hidden">
      <AgentsNode />
      <PairedDownArrows />
      <div className="grid grid-cols-2 gap-2">
        <SdkNode />
        <GatewayNode />
      </div>
      <PairedDownArrows />
      <LangfuseNode />
    </div>
  );
}

export const PlatformOverview = () => {
  return (
    <HomeSection id="every-ai-call" className="pt-[120px]">
      <div className="mb-10 flex flex-col items-start gap-4">
        <Heading className="max-w-[14ch] text-left sm:max-w-none">
          <TextHighlight>Every AI call.</TextHighlight> One platform.
        </Heading>
        <Text className="max-w-[60ch] text-left">
          Instrument your agents with the SDKs or OpenTelemetry, or route model
          calls through the{" "}
          <Link href={AI_GATEWAY_HREF}>Langfuse AI Gateway</Link> without
          changing code. Every call lands in Langfuse for tracing, evals, and
          cost tracking, and you can export it to your warehouse.
        </Text>
      </div>

      <figure
        aria-label="How AI calls flow through Langfuse"
        className="not-prose text-left"
      >
        <WideDiagram />
        <CompactDiagram />
        <figcaption className="sr-only">{DIAGRAM_CAPTION}</figcaption>
      </figure>
    </HomeSection>
  );
};
