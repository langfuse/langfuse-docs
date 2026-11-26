import { cn } from "@/lib/utils";
import styles from "./Gateway.module.css";
import { heroMoreProviders, heroProviders, type ProviderIcon } from "./content";

// Compact request flow for the /gateway landing page, in the visual language
// of the gateway diagrams in the Langfuse app. Same logic as
// AiGatewayOverviewDiagram: clients call the AI Gateway inside Langfuse, which
// authorizes the gateway key, maps the model to a provider request, calls the
// provider and traces the call. Keep the labels in sync with the figure text in
// md-override/gateway.md.

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

const LINE = "var(--text-disabled)";
const CHIP_FILL = "hsl(var(--card))";
const mono = { fontFamily: "var(--font-mono)" } as const;
const sans = { fontFamily: "var(--font-sans)" } as const;

type Point = { x: number; y: number };

function Chip({
  x,
  y,
  w,
  h,
  label,
  provider,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  provider?: ProviderIcon;
}) {
  const icon = 16;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={8}
        fill={CHIP_FILL}
        stroke="var(--line-structure)"
        className={styles.flowChip}
      />
      {provider && (
        <ProviderImage
          provider={provider}
          x={x + 14}
          y={y + (h - icon) / 2}
          size={icon}
        />
      )}
      <text
        x={x + (provider ? 14 + icon + 10 : 16)}
        y={y + h / 2}
        dominantBaseline="central"
        fontSize={14}
        style={mono}
        fill="var(--text-secondary)"
      >
        {label}
      </text>
    </g>
  );
}

function ProviderImage({
  provider,
  x,
  y,
  size,
}: {
  provider: ProviderIcon;
  x: number;
  y: number;
  size: number;
}) {
  return (
    <image
      href={provider.icon}
      x={x}
      y={y}
      width={size}
      height={size}
      preserveAspectRatio="xMidYMid meet"
      className={cn(provider.monochrome && "dark:brightness-0 dark:invert")}
    />
  );
}

function MoreProviders({ x, y, h }: { x: number; y: number; h: number }) {
  const r = h / 2;
  const step = h * 0.78;
  return (
    <g>
      {moreProviders.map((provider, i) => {
        const cx = x + r + i * step;
        const cy = y + r;
        return (
          <g key={provider.name}>
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill={CHIP_FILL}
              stroke="var(--line-structure)"
              className={styles.flowChip}
            />
            <ProviderImage
              provider={provider}
              x={cx - 8}
              y={cy - 8}
              size={16}
            />
          </g>
        );
      })}
      <text
        x={x + 2 * r + (moreProviders.length - 1) * step + 12}
        y={y + r}
        dominantBaseline="central"
        fontSize={14}
        style={mono}
        fill="var(--text-tertiary)"
      >
        and more
      </text>
    </g>
  );
}

/** Dashed boundary for everything that runs inside Langfuse. */
function LangfuseBoundary({
  x,
  y,
  w,
  h,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={12}
        fill="var(--surface-1)"
        fillOpacity={0.6}
        stroke="var(--text-disabled)"
        strokeDasharray="4 4"
      />
      <image
        href="/langfuse-icon.svg"
        x={x + 14}
        y={y + 13}
        width={22}
        height={14}
      />
      <text
        x={x + 44}
        y={y + 20}
        dominantBaseline="central"
        fontSize={13}
        style={sans}
        fill="var(--text-tertiary)"
      >
        Langfuse
      </text>
    </g>
  );
}

function GatewayCard({ x, y, w }: { x: number; y: number; w: number }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={100}
        rx={10}
        fill={CHIP_FILL}
        stroke="var(--text-disabled)"
        className={styles.flowChip}
      />
      <rect
        x={x + 14}
        y={y + 14}
        width={96}
        height={26}
        fill="var(--surface-cta-primary)"
      />
      <text
        x={x + 21}
        y={y + 27}
        dominantBaseline="central"
        fontSize={15}
        fontWeight={500}
        style={sans}
        fill="var(--text-primary)"
      >
        AI Gateway
      </text>
      {gatewaySteps.map((step, i) => (
        <text
          key={step}
          x={x + 16}
          y={y + 58 + i * 22}
          dominantBaseline="central"
          fontSize={13}
          style={sans}
          fill="var(--text-secondary)"
        >
          <tspan fill="var(--text-disabled)">{"– "}</tspan>
          {step}
        </text>
      ))}
    </g>
  );
}

function TracingCard({ x, y, w }: { x: number; y: number; w: number }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={56}
        rx={10}
        fill={CHIP_FILL}
        stroke="var(--line-structure)"
        className={styles.flowChip}
      />
      <text
        x={x + 16}
        y={y + 19}
        dominantBaseline="central"
        fontSize={14}
        fontWeight={500}
        style={sans}
        fill="var(--text-primary)"
      >
        Langfuse tracing
      </text>
      <text
        x={x + 16}
        y={y + 39}
        dominantBaseline="central"
        fontSize={13}
        style={sans}
        fill="var(--text-tertiary)"
      >
        Captures every request
      </text>
    </g>
  );
}

/** A traffic dot travelling along a copy of the line. */
function Traffic({ d, delay }: { d: string; delay: number }) {
  return (
    <path
      d={d}
      pathLength={100}
      fill="none"
      stroke="var(--text-tertiary)"
      strokeWidth={3}
      strokeLinecap="round"
      className={styles.flowPulse}
      style={{ animationDelay: `${delay}s` }}
    />
  );
}

function Connector({ from, to }: { from: Point; to: Point }) {
  return (
    <g>
      <path
        d={`M${from.x} ${from.y}V${to.y - 6}`}
        stroke={LINE}
        strokeWidth={1.25}
      />
      <path
        d={`M${to.x - 4} ${to.y - 7}L${to.x} ${to.y - 1}L${to.x + 4} ${to.y - 7}`}
        fill="none"
        stroke={LINE}
        strokeWidth={1.25}
      />
    </g>
  );
}

function Caption({ x, y, children }: Point & { children: string }) {
  return (
    <text x={x} y={y} fontSize={12} style={mono} fill="var(--text-tertiary)">
      {children}
    </text>
  );
}

function DesktopFlow() {
  const chip = { w: 170, h: 40 };
  const clientY = [52, 104, 156, 208];
  const boundary = { x: 300, y: 40, w: 340, h: 260 };
  const gateway = { x: 320, y: 80, w: 300 };
  const hub = { x: gateway.x, y: gateway.y + 50 };
  const out = { x: gateway.x + gateway.w, y: hub.y };
  const tracing = { x: 320, y: 224, w: 300 };
  const provider = { x: 784, w: 176, h: 40 };
  const providerY = [32, 80, 128, 176];
  const moreY = 228;

  const inLine = (y: number) =>
    `M${chip.w} ${y}C${chip.w + 70} ${y} ${hub.x - 70} ${hub.y} ${hub.x} ${hub.y}`;
  const outLine = (y: number) =>
    `M${out.x} ${out.y}C${out.x + 80} ${out.y} ${provider.x - 80} ${y} ${provider.x} ${y}`;

  return (
    <svg viewBox="0 0 960 300" className="block h-auto w-full" aria-hidden>
      <Caption x={0} y={30}>
        Coding agents and apps
      </Caption>
      <Caption x={provider.x} y={18}>
        Model providers
      </Caption>
      <LangfuseBoundary {...boundary} />
      {clientY.map((y, i) => (
        <g key={y}>
          <path
            d={inLine(y + chip.h / 2)}
            fill="none"
            stroke={LINE}
            strokeWidth={1.25}
          />
          <Traffic d={inLine(y + chip.h / 2)} delay={i * -1.1} />
        </g>
      ))}
      {[...providerY.map((y) => y + provider.h / 2), moreY + 18].map((y) => (
        <path
          key={y}
          d={outLine(y)}
          fill="none"
          stroke={LINE}
          strokeWidth={1.25}
          strokeDasharray="4 4"
        />
      ))}
      {clients.map((label, i) => (
        <Chip key={label} x={0} y={clientY[i]} {...chip} label={label} />
      ))}
      {providers.map((p, i) => (
        <Chip
          key={p.name}
          x={provider.x}
          y={providerY[i]}
          w={provider.w}
          h={provider.h}
          label={p.name}
          provider={p}
        />
      ))}
      <MoreProviders x={provider.x} y={moreY} h={36} />
      <GatewayCard {...gateway} />
      <Connector
        from={{ x: gateway.x + gateway.w / 2, y: gateway.y + 100 }}
        to={{ x: gateway.x + gateway.w / 2, y: tracing.y }}
      />
      <TracingCard {...tracing} />
    </svg>
  );
}

function MobileFlow() {
  const chip = { w: 170, h: 40 };
  const col = [0, 190];
  const clientRows = [24, 72];
  const boundary = { x: 0, y: 150, w: 360, h: 260 };
  const gateway = { x: 16, y: 190, w: 328 };
  const tracing = { x: 16, y: 334, w: 328 };
  const top = { x: 180, y: gateway.y };
  const providerRows = [464, 512];
  const moreY = 562;
  const fanX = [60, 140, 220, 300];

  const inLine = (x: number) =>
    `M${x} 112C${x} 150 ${top.x} 150 ${top.x} ${top.y}`;

  return (
    <svg viewBox="0 0 360 600" className="block h-auto w-full" aria-hidden>
      <Caption x={0} y={12}>
        Coding agents and apps
      </Caption>
      {fanX.map((x, i) => (
        <g key={x}>
          <path d={inLine(x)} fill="none" stroke={LINE} strokeWidth={1.25} />
          <Traffic d={inLine(x)} delay={i * -1.1} />
        </g>
      ))}
      {clients.map((label, i) => (
        <Chip
          key={label}
          x={col[i % 2]}
          y={clientRows[Math.floor(i / 2)]}
          {...chip}
          label={label}
        />
      ))}
      <LangfuseBoundary {...boundary} />
      <GatewayCard {...gateway} />
      <Connector
        from={{ x: top.x, y: gateway.y + 100 }}
        to={{ x: top.x, y: tracing.y }}
      />
      <TracingCard {...tracing} />
      <Connector
        from={{ x: top.x, y: boundary.y + boundary.h }}
        to={{ x: top.x, y: providerRows[0] }}
      />
      <Caption x={0} y={448}>
        Model providers
      </Caption>
      {providers.map((p, i) => (
        <Chip
          key={p.name}
          x={col[i % 2]}
          y={providerRows[Math.floor(i / 2)]}
          {...chip}
          label={p.name}
          provider={p}
        />
      ))}
      <MoreProviders x={0} y={moreY} h={36} />
    </svg>
  );
}

export function GatewayFlowDiagram() {
  return (
    <figure className="@container/flow m-0">
      <figcaption className="sr-only">
        Coding agents such as Claude Code, Codex and OpenCode, and your own
        apps, send requests to the AI Gateway inside Langfuse. The gateway
        authorizes the gateway key, maps the model to a provider and calls the
        model provider, such as Anthropic, OpenAI, Google AI or Bedrock.
        Langfuse tracing captures every request.
      </figcaption>
      <div className="hidden @2xl/flow:block">
        <DesktopFlow />
      </div>
      <div className="mx-auto max-w-[420px] @2xl/flow:hidden">
        <MobileFlow />
      </div>
    </figure>
  );
}
