import Image from "next/image";
import type { ReactNode } from "react";
import { MonoLabel } from "@/components/home/academy-loop/shared";
import { HArrow, VArrow } from "@/components/home/diagram-arrows";
import { CornerBox } from "@/components/ui";
import { cn } from "@/lib/utils";
import { heroMoreProviders, heroProviders, type ProviderIcon } from "./content";

// Request flow on /gateway, built from the homepage diagram pieces.
// Keep the labels in sync with the figure text in md-override/gateway.md.

const CLIENTS_CAPTION = "Coding agents and apps";
const PROVIDERS_CAPTION = "Model providers";
const clients = ["Claude Code", "Codex", "OpenCode", "Your apps"];
const providers = heroProviders.slice(0, 4);
const moreProviders: ProviderIcon[] = [
  heroProviders[4],
  ...heroMoreProviders.slice(0, 2),
];
const gatewaySteps = [
  "Authorizes the gateway key",
  "Maps the model to a provider",
];

function Title({ children }: { children: ReactNode }) {
  return (
    <span className="text-[15px] font-medium leading-tight text-text-primary">
      {children}
    </span>
  );
}

const DETAIL =
  "text-left text-[13px] leading-snug tracking-[-0.2px] text-text-tertiary";

function IconTile({
  provider,
  decorative,
}: {
  provider: ProviderIcon;
  decorative?: boolean;
}) {
  return (
    <span
      title={decorative ? undefined : provider.name}
      className="flex h-6 w-6 shrink-0 items-center justify-center border border-line-structure bg-surface-1"
    >
      <Image
        src={provider.icon}
        alt={decorative ? "" : provider.name}
        width={14}
        height={14}
        className={cn(
          "h-3.5 w-3.5 object-contain",
          provider.monochrome && "dark:brightness-0 dark:invert",
        )}
      />
    </span>
  );
}

function ClientsPanel({ className }: { className?: string }) {
  return (
    <CornerBox className={cn("flex flex-col gap-2 p-4", className)}>
      <MonoLabel className="lowercase">{CLIENTS_CAPTION}</MonoLabel>
      <ul className="flex flex-wrap gap-1.5">
        {clients.map((client) => (
          <li
            key={client}
            className="block border border-line-structure px-2 py-1 text-[13px] leading-none text-text-secondary"
          >
            {client}
          </li>
        ))}
      </ul>
    </CornerBox>
  );
}

function ProvidersPanel({ className }: { className?: string }) {
  return (
    <CornerBox className={cn("flex flex-col gap-2 p-4", className)}>
      <MonoLabel className="lowercase">{PROVIDERS_CAPTION}</MonoLabel>
      {/* One provider per row from md, two columns below it. */}
      <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 md:grid-cols-1">
        {providers.map((provider) => (
          <li key={provider.name} className="flex items-center gap-2">
            <IconTile provider={provider} decorative />
            <span className="text-[13px] leading-none text-text-secondary">
              {provider.name}
            </span>
          </li>
        ))}
        <li className="col-span-2 flex items-center gap-1.5 md:col-span-1">
          {moreProviders.map((provider) => (
            <IconTile key={provider.name} provider={provider} />
          ))}
          <MonoLabel className="ml-0.5">and more</MonoLabel>
        </li>
      </ul>
    </CornerBox>
  );
}

/** Name of the panel that holds everything running inside Langfuse. */
function LangfuseLabel({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-[14px] font-medium text-text-primary",
        className,
      )}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-line-structure bg-surface-1">
        {/* The mark fills 78% of its file, so 18px draws it 14px wide. */}
        <Image src="/langfuse-icon.svg" alt="" width={18} height={18} />
      </span>
      Langfuse
    </div>
  );
}

function GatewayCard({ className }: { className?: string }) {
  return (
    <CornerBox className={cn("flex flex-col gap-2 p-3 sm:p-4", className)}>
      <Title>AI Gateway</Title>
      <ul className="flex flex-col gap-1">
        {gatewaySteps.map((step) => (
          <li key={step} className={cn("flex gap-1.5", DETAIL)}>
            <span aria-hidden className="text-text-disabled">
              –
            </span>
            {step}
          </li>
        ))}
      </ul>
    </CornerBox>
  );
}

function TracingCard({ className }: { className?: string }) {
  return (
    <CornerBox className={cn("flex flex-col gap-2 p-3 sm:p-4", className)}>
      <Title>Langfuse tracing</Title>
      <p className={DETAIL}>Captures every request</p>
    </CornerBox>
  );
}

/** Gateway to tracing: a 24px gutter between the two cards. */
function CardArrow() {
  return (
    <div className="flex h-6 justify-center" aria-hidden="true">
      <VArrow />
    </div>
  );
}

function PanelArrow({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center", className)} aria-hidden="true">
      <HArrow />
    </div>
  );
}

// Centers a side panel on the arrow line; -mb-13 is the label row's height.
const SIDE_PANEL = "row-span-2 row-start-1 -mb-13 self-center";

// The Langfuse panel is a subgrid over all three rows, so the arrows sit on
// the gateway card's center line.
function WideFlow() {
  return (
    <div className="hidden grid-cols-[minmax(172px,0.7fr)_44px_minmax(0,1fr)_44px_minmax(172px,0.7fr)] md:grid">
      <ClientsPanel className={cn("col-start-1", SIDE_PANEL)} />
      <PanelArrow className="col-start-2 row-start-2" />
      <CornerBox className="col-start-3 row-span-3 row-start-1 grid grid-rows-subgrid p-4">
        <LangfuseLabel className="pb-3" />
        <GatewayCard />
        <div className="flex flex-col">
          <CardArrow />
          <TracingCard />
        </div>
      </CornerBox>
      <PanelArrow className="col-start-4 row-start-2" />
      <ProvidersPanel className={cn("col-start-5", SIDE_PANEL)} />
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

function CompactFlow() {
  return (
    <div className="flex flex-col md:hidden">
      <ClientsPanel />
      <DownArrow />
      <CornerBox className="flex flex-col p-4">
        <LangfuseLabel className="pb-3" />
        <GatewayCard />
        <CardArrow />
        <TracingCard />
      </CornerBox>
      <DownArrow />
      <ProvidersPanel />
    </div>
  );
}

export function GatewayFlowDiagram() {
  return (
    <figure className="not-prose m-0 text-left">
      <WideFlow />
      <CompactFlow />
      <figcaption className="sr-only">
        Coding agents such as Claude Code, Codex and OpenCode, and your own
        apps, send requests to the AI Gateway inside Langfuse. The gateway
        authorizes the gateway key, maps the model to a provider and calls the
        model provider, such as Anthropic, OpenAI, Google AI or Bedrock.
        Langfuse tracing captures every request.
      </figcaption>
    </figure>
  );
}
