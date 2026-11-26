import { cn } from "@/lib/utils";
import { heroMoreProviders, heroProviders, type ProviderIcon } from "./content";

// Fan-in / fan-out figure for the /gateway hero: many clients converge on the
// gateway, which routes to the providers. Drawn on a 1006×614 grid; text and
// chips use container query units so they scale with the figure.
const VIEW_W = 1006;
const VIEW_H = 614;
const HUB_Y = 320;
const INCOMING_Y = [75, 145, 212, 280, 352, 428, 495, 565];
const CARD_TOP = [13.5, 26.7, 39.9, 53.3, 66.4];
const OUTGOING_Y = [117, 198, 279, 361, 442, 524];

function ProviderLogo({
  provider,
  className,
}: {
  provider: ProviderIcon;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={provider.icon}
      alt=""
      aria-hidden
      className={cn(
        "block shrink-0 object-contain",
        provider.monochrome && "dark:brightness-0 dark:invert",
        className,
      )}
    />
  );
}

export function GatewayHeroVisual({ className }: { className?: string }) {
  return (
    <figure
      className={cn(
        "@container relative mx-auto aspect-[1006/614] w-full max-w-[760px] min-w-0",
        // On phones, crop the fading incoming lines so the provider labels stay readable.
        "max-sm:-ml-[64%] max-sm:w-[170%] max-sm:max-w-none",
        className,
      )}
      aria-label="Model calls from many clients converge on the Langfuse AI Gateway, which routes them to Anthropic, OpenAI, Google AI, Bedrock, Azure, OpenRouter, xAI, Vercel AI Gateway, Google Vertex AI and more."
    >
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="absolute inset-0 block size-full"
        aria-hidden
      >
        <defs>
          <linearGradient
            id="gateway-hero-in"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="478"
            y2="0"
          >
            <stop offset="0" stopColor="var(--text-disabled)" stopOpacity="0" />
            <stop
              offset=".3"
              stopColor="var(--text-disabled)"
              stopOpacity=".5"
            />
            <stop
              offset="1"
              stopColor="var(--text-tertiary)"
              stopOpacity=".7"
            />
          </linearGradient>
        </defs>
        {INCOMING_Y.map((y) => (
          <path
            key={y}
            d={`M0 ${y}C250 ${y},330 ${HUB_Y},478 ${HUB_Y}`}
            fill="none"
            stroke="url(#gateway-hero-in)"
            strokeWidth="2"
          />
        ))}
        <path
          d={`M0 ${HUB_Y}H478`}
          fill="none"
          stroke="url(#gateway-hero-in)"
          strokeWidth="2"
        />
        {OUTGOING_Y.map((y) => (
          <path
            key={y}
            d={`M552 ${HUB_Y}C612 ${HUB_Y},620 ${y},684 ${y}`}
            fill="none"
            stroke="var(--text-disabled)"
            strokeWidth="1.6"
            strokeDasharray="5 5"
          />
        ))}
        <circle cx="565" cy={HUB_Y} r="3.5" fill="var(--text-disabled)" />
      </svg>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/langfuse-icon.svg"
        alt=""
        aria-hidden
        className="absolute left-[48.4%] top-[52.1%] block w-[5.6%] -translate-y-1/2"
      />

      {heroProviders.map((provider, i) => (
        <div
          key={provider.name}
          className="absolute left-[68.1%] flex h-[11.1%] w-[26.4%] items-center gap-[2.2cqw] whitespace-nowrap rounded-[0.9cqw] border border-line-structure bg-card px-[2.4cqw] font-mono text-[2.2cqw] leading-none text-text-primary shadow-[0_0.5cqw_1.8cqw_rgba(0,0,0,0.06),0_0.1cqw_0.3cqw_rgba(0,0,0,0.05)]"
          style={{ top: `${CARD_TOP[i]}%` }}
        >
          <ProviderLogo provider={provider} className="size-[2.8cqw]" />
          <span>{provider.name}</span>
        </div>
      ))}

      {heroMoreProviders.map((provider, i) => (
        <span
          key={provider.name}
          title={provider.name}
          className="absolute top-[80.9%] flex size-[5.4cqw] items-center justify-center rounded-full border border-line-structure bg-card shadow-[0_0.4cqw_1.4cqw_rgba(0,0,0,0.08)]"
          style={{ left: `${67.4 + i * 4.1}%` }}
        >
          <ProviderLogo provider={provider} className="size-[2.4cqw]" />
        </span>
      ))}
      <span className="absolute left-[87%] top-[85.3%] -translate-y-1/2 whitespace-nowrap font-mono text-[2.1cqw] leading-none text-text-secondary">
        and more
      </span>
    </figure>
  );
}
