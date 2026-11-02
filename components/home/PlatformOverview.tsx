import Image from "next/image";
import type { ReactNode } from "react";
import { HomeSection } from "@/components/home/HomeSection";
import {
  HorizontalArrow,
  VerticalArrow,
} from "@/components/blog/diagram-primitives";
import { CornerBox, Heading, Link, TextHighlight } from "@/components/ui";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

const AI_GATEWAY_HREF = "/docs/ai-gateway/overview";

const USE_CASES: {
  title: string;
  detail: string;
  href: string;
  icons: { src: string; alt: string }[];
}[] = [
  {
    title: "Personal agents",
    detail: "Claude Code, Codex, Cursor",
    href: "/docs/ai-gateway/coding-agents",
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
    detail: "Support, voice, RAG, workflows, any harness or framework",
    href: "/integrations",
    icons: [
      { src: "/images/integrations/langchain_icon.png", alt: "LangChain" },
      {
        src: "/images/integrations/vercel_ai_sdk_icon.png",
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
    detail: "Copilot Studio, n8n, Dify, Flowise",
    href: "/integrations",
    icons: [
      { src: "/images/integrations/microsoft_icon.svg", alt: "Copilot Studio" },
      { src: "/images/integrations/n8n_icon.svg", alt: "n8n" },
      { src: "/images/integrations/dify_icon.svg", alt: "Dify" },
      { src: "/images/integrations/flowise_icon.svg", alt: "Flowise" },
    ],
  },
];

const FEATURES = [
  { label: "Tracing", href: "/docs/observability/overview" },
  { label: "Prompts", href: "/docs/prompt-management/overview" },
  { label: "Evals", href: "/docs/evaluation/overview" },
  { label: "Datasets", href: "/docs/evaluation/experiments/datasets" },
  {
    label: "Experiments",
    href: "/docs/evaluation/experiments/experiments-via-sdk",
  },
  { label: "Dashboards", href: "/docs/metrics/features/custom-dashboards" },
];

const ACCESS = [
  { label: "MCP", href: "/docs/api-and-data-platform/features/mcp-server" },
  { label: "CLI", href: "/docs/api-and-data-platform/features/cli" },
  { label: "API", href: "/docs/api-and-data-platform/features/public-api" },
  { label: "SDKs", href: "/docs/observability/sdk/overview" },
];

const WAREHOUSES = [
  "ClickHouse",
  "Snowflake",
  "BigQuery",
  "Databricks",
  "S3 / GCS / Azure",
];

function Detail({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <p
      className={cn(
        "text-left text-[13px] leading-snug tracking-[-0.2px] text-text-tertiary",
        className,
      )}
    >
      {children}
    </p>
  );
}

function ArrowLabel({ children }: { children: ReactNode }) {
  return (
    <span className="whitespace-nowrap font-mono text-[10px] leading-none text-text-tertiary">
      {children}
    </span>
  );
}

function UpstreamNode({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 border border-dashed border-line-divider-dash bg-surface-bg p-3",
        className,
      )}
    >
      <span className="text-[17px] font-medium leading-tight text-text-primary">
        AI Inference APIs
      </span>
    </div>
  );
}

function UseCasesNode({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border border-line-structure bg-surface-bg p-3",
        className,
      )}
    >
      <ul className="flex flex-col divide-y divide-line-structure">
        {USE_CASES.map((useCase) => (
          <li
            key={useCase.title}
            className="flex flex-col gap-1.5 py-2.5 first:pt-0 last:pb-0"
          >
            <Link
              href={useCase.href}
              className="w-fit text-[15px] font-medium text-text-primary"
            >
              {useCase.title}
            </Link>
            <Detail>{useCase.detail}</Detail>
            <div className="mt-0.5 flex flex-wrap gap-1.5">
              {useCase.icons.map((icon) => (
                <span
                  key={icon.alt}
                  title={icon.alt}
                  className="flex h-5 w-5 items-center justify-center border border-line-structure bg-surface-1"
                >
                  <Image src={icon.src} alt={icon.alt} width={12} height={12} />
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function GatewayNode({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 border border-dashed border-line-cta bg-surface-bg p-3",
        className,
      )}
    >
      <Image
        src="/brand-assets/wordmark/Langfuse/light/langfuse-wordart.svg"
        alt="Langfuse"
        width={86}
        height={20}
        className="h-5 w-auto self-start"
      />
      <Link
        href={AI_GATEWAY_HREF}
        className="w-fit text-[17px] font-medium leading-tight text-text-primary"
      >
        AI Gateway
      </Link>
      <Detail>
        Virtual keys, budgets, provisioning, and governance for every model
        call. No code changes.
      </Detail>
      <Detail>Or bring your own gateway.</Detail>
      <span className="mt-auto w-fit rounded-[2px] border border-line-structure bg-surface-1 px-1.5 py-0.5 font-sans text-[11px] leading-none text-text-tertiary">
        Optional
      </span>
    </div>
  );
}

function LangfuseNode({ className }: { className?: string }) {
  return (
    <CornerBox
      className={cn("flex flex-col gap-4 bg-surface-bg p-3 sm:p-4", className)}
    >
      <Image
        src="/brand-assets/wordmark/Langfuse/light/langfuse-wordart.svg"
        alt="Langfuse"
        width={103}
        height={24}
        className="h-6 w-auto self-start"
      />

      <ul className="grid grid-cols-2 border-l border-t border-line-structure">
        {FEATURES.map((feature) => (
          <li
            key={feature.label}
            className="border-b border-r border-line-structure"
          >
            <Link
              href={feature.href}
              className="block px-2.5 py-2 text-[13px] text-text-secondary hover:text-text-primary"
            >
              {feature.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-2">
        <span className="font-mono text-[10px] leading-none text-text-tertiary">
          agent-native, every feature via
        </span>
        <ul className="grid grid-cols-4 gap-1.5">
          {ACCESS.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="block bg-surface-code py-1.5 text-center font-mono text-[12px] font-medium text-text-code-secondary no-underline transition-colors hover:text-surface-bg"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        <Link
          href="/docs/api-and-data-platform/features/halo"
          className="flex flex-col gap-1.5 border border-line-structure bg-surface-cta-primary p-2.5 no-underline"
        >
          <span className="font-mono text-[10px] uppercase leading-none tracking-[0.04em] text-text-secondary">
            In-app agent
          </span>
          <span className="text-[13px] leading-snug text-text-primary">
            Halo debugs traces, writes evals, and iterates on prompts in
            Langfuse
          </span>
        </Link>
        <Link
          href="/docs/api-and-data-platform/features/agent-skill"
          className="flex flex-col gap-1.5 border border-line-structure bg-surface-1 p-2.5 no-underline"
        >
          <span className="font-mono text-[10px] uppercase leading-none tracking-[0.04em] text-text-tertiary">
            Bring your own
          </span>
          <span className="text-[13px] leading-snug text-text-secondary">
            Claude Code, Cursor, Codex, or internal agents
          </span>
        </Link>
      </div>
    </CornerBox>
  );
}

function WarehouseNode({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border border-dashed border-line-divider-dash bg-surface-bg p-3",
        className,
      )}
    >
      <span className="text-[17px] font-medium leading-tight text-text-primary">
        Warehouse
      </span>
      <ul className="flex flex-col divide-y divide-line-structure">
        {WAREHOUSES.map((warehouse) => (
          <li
            key={warehouse}
            className="py-1.5 text-[13px] text-text-secondary first:pt-0"
          >
            {warehouse}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Cell({
  column,
  row,
  className,
  decorative,
  children,
}: {
  column: string | number;
  row: string | number;
  className?: string;
  decorative?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn("flex min-w-0 flex-col", className)}
      style={{ gridColumn: column, gridRow: row }}
      aria-hidden={decorative || undefined}
    >
      {children}
    </div>
  );
}

function ModelCallsArrow() {
  return (
    <div className="relative h-full">
      <div className="absolute inset-y-0 left-1/2">
        <VerticalArrow direction="up" />
      </div>
      <div className="absolute left-[calc(50%+8px)] top-1/2 -translate-y-1/2">
        <ArrowLabel>model calls</ArrowLabel>
      </div>
    </div>
  );
}

/**
 * Horizontal flow, mirroring the left-to-right data path. Between md and xl
 * the section is a fixed 680px wide, so the 840px desktop layout is zoomed to
 * fit; `zoom` (unlike `transform`) also shrinks the layout box.
 */
function WideDiagram() {
  return (
    <div
      className="hidden md:grid md:max-xl:w-[840px] md:max-xl:[zoom:calc(680/840)]"
      style={{
        gridTemplateColumns: "188px 28px 152px 28px minmax(0,1fr) 40px 140px",
        gridTemplateRows: "auto 44px auto auto",
      }}
    >
      <Cell column="1 / 4" row={1}>
        <UpstreamNode />
      </Cell>
      <Cell column={1} row={2} decorative>
        <ModelCallsArrow />
      </Cell>
      <Cell column={3} row={2} decorative>
        <ModelCallsArrow />
      </Cell>

      <Cell column={1} row="3 / 5">
        <UseCasesNode className="flex-1" />
      </Cell>
      <Cell column={2} row={3} className="justify-center" decorative>
        <HorizontalArrow />
      </Cell>
      <Cell column={3} row={3}>
        <GatewayNode className="flex-1" />
      </Cell>
      <Cell column={4} row={3} className="justify-center" decorative>
        <HorizontalArrow />
      </Cell>
      <Cell
        column="2 / 5"
        row={4}
        className="justify-end gap-1.5 pb-8 pt-6"
        decorative
      >
        <div className="text-center">
          <ArrowLabel>direct, SDK / OpenTelemetry</ArrowLabel>
        </div>
        <HorizontalArrow />
      </Cell>

      <Cell column={5} row="1 / 5">
        <LangfuseNode className="flex-1 justify-between" />
      </Cell>
      <Cell
        column={6}
        row="1 / 5"
        className="justify-center gap-1.5"
        decorative
      >
        <div className="text-center">
          <ArrowLabel>export</ArrowLabel>
        </div>
        <HorizontalArrow />
      </Cell>
      <Cell column={7} row="1 / 5">
        <WarehouseNode className="flex-1" />
      </Cell>
    </div>
  );
}

function DownArrowCell({ label }: { label?: string }) {
  return (
    <div className="relative h-full min-h-9">
      <div className="absolute inset-y-0 left-1/2">
        <VerticalArrow />
      </div>
      {label && (
        <div className="absolute left-[calc(50%+8px)] top-1/2 -translate-y-1/2">
          <ArrowLabel>{label}</ArrowLabel>
        </div>
      )}
    </div>
  );
}

function ModelCallsSideArrow() {
  return (
    <div className="flex h-full flex-col justify-center gap-1.5 px-1">
      <span className="text-center font-mono text-[10px] leading-tight text-text-tertiary">
        model calls
      </span>
      <HorizontalArrow />
    </div>
  );
}

/**
 * Phones: the desktop flow rotated 90 degrees so it runs top to bottom. The
 * inference APIs move from the top row to the right column and the direct
 * SDK / OpenTelemetry path from the bottom row to the left column.
 */
function CompactDiagram() {
  return (
    <div
      className="grid md:hidden"
      style={{
        gridTemplateColumns: "36px minmax(0,1fr) 52px 36px",
        gridTemplateRows: "auto 40px auto 40px auto 48px auto",
      }}
    >
      <Cell column="1 / 3" row={1}>
        <div className="flex flex-col gap-2.5 border border-line-structure bg-surface-bg p-3">
          <span className="text-[15px] font-medium leading-tight text-text-primary">
            Your agents and apps
          </span>
          <ul className="flex flex-col divide-y divide-line-structure">
            {USE_CASES.map((useCase) => (
              <li
                key={useCase.title}
                className="flex flex-wrap items-center justify-between gap-1.5 py-2 first:pt-0 last:pb-0"
              >
                <Link
                  href={useCase.href}
                  className="w-fit text-[13px] font-medium text-text-primary"
                >
                  {useCase.title}
                </Link>
                <div className="flex gap-1">
                  {useCase.icons.slice(0, 3).map((icon) => (
                    <span
                      key={icon.alt}
                      title={icon.alt}
                      className="flex h-5 w-5 items-center justify-center border border-line-structure bg-surface-1"
                    >
                      <Image
                        src={icon.src}
                        alt={icon.alt}
                        width={12}
                        height={12}
                      />
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Cell>
      <Cell column={3} row={1} decorative>
        <ModelCallsSideArrow />
      </Cell>
      <Cell column={4} row="1 / 4">
        <div className="flex flex-1 items-center justify-center border border-dashed border-line-divider-dash bg-surface-bg py-3">
          <span className="whitespace-nowrap text-[13px] font-medium leading-none text-text-primary [writing-mode:vertical-rl]">
            AI Inference APIs
          </span>
        </div>
      </Cell>

      <Cell column={1} row="2 / 5" decorative>
        <div className="relative h-full">
          <div className="absolute inset-y-0 left-1/2">
            <VerticalArrow />
          </div>
          <span className="absolute right-[calc(50%+6px)] top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[10px] leading-none text-text-tertiary [writing-mode:vertical-rl] rotate-180">
            direct, SDK / OpenTelemetry
          </span>
        </div>
      </Cell>
      <Cell column={2} row={2} decorative>
        <DownArrowCell />
      </Cell>
      <Cell column={2} row={3}>
        <div className="flex flex-col gap-1.5 border border-dashed border-line-cta bg-surface-bg p-3">
          <div className="flex items-center justify-between gap-2">
            <Image
              src="/brand-assets/wordmark/Langfuse/light/langfuse-wordart.svg"
              alt="Langfuse"
              width={69}
              height={16}
              className="h-4 w-auto"
            />
            <span className="rounded-[2px] border border-line-structure bg-surface-1 px-1.5 py-0.5 font-sans text-[11px] leading-none text-text-tertiary">
              Optional
            </span>
          </div>
          <Link
            href={AI_GATEWAY_HREF}
            className="w-fit text-[15px] font-medium leading-tight text-text-primary"
          >
            AI Gateway
          </Link>
          <Detail>Virtual keys, budgets, and governance</Detail>
        </div>
      </Cell>
      <Cell column={3} row={3} decorative>
        <ModelCallsSideArrow />
      </Cell>
      <Cell column={2} row={4} decorative>
        <DownArrowCell />
      </Cell>

      <Cell column="1 / 5" row={5}>
        <CornerBox className="flex flex-col gap-3 bg-surface-bg p-3">
          <Image
            src="/brand-assets/wordmark/Langfuse/light/langfuse-wordart.svg"
            alt="Langfuse"
            width={86}
            height={20}
            className="h-5 w-auto self-start"
          />
          <ul className="grid grid-cols-3 border-l border-t border-line-structure">
            {FEATURES.map((feature) => (
              <li
                key={feature.label}
                className="border-b border-r border-line-structure"
              >
                <Link
                  href={feature.href}
                  className="block px-2 py-1.5 text-[12px] text-text-secondary hover:text-text-primary"
                >
                  {feature.label}
                </Link>
              </li>
            ))}
          </ul>
        </CornerBox>
      </Cell>

      <Cell column="1 / 5" row={6} decorative>
        <DownArrowCell label="export" />
      </Cell>

      <Cell column="1 / 5" row={7}>
        <div className="flex flex-col gap-1.5 border border-dashed border-line-divider-dash bg-surface-bg p-3">
          <span className="text-[15px] font-medium leading-tight text-text-primary">
            Warehouse
          </span>
          <Detail>{WAREHOUSES.join(", ")}</Detail>
        </div>
      </Cell>
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
        <figcaption className="sr-only">
          Personal agents, custom agents, and copilots call inference APIs such
          as OpenAI and Anthropic, either directly or through an optional
          gateway such as the Langfuse AI Gateway. Calls reach Langfuse through
          the gateway or directly via SDKs and OpenTelemetry. Langfuse provides
          tracing, prompts, evals, datasets, experiments, and dashboards, all
          available via MCP, CLI, API, and SDKs, and exports data to warehouses
          such as ClickHouse, Snowflake, BigQuery, Databricks, and blob storage.
        </figcaption>
      </figure>
    </HomeSection>
  );
};
