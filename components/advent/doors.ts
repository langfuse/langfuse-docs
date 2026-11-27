import type { LucideIcon } from "lucide-react";
import {
  Boxes,
  Cpu,
  KeyRound,
  Regex,
  Rocket,
  Server,
  ShieldCheck,
  Wallet,
} from "lucide-react";

export const ADVENT_YEAR = 2026;
export const ADVENT_URL = "https://langfuse.com/advent";
const ADVENT_UTM =
  "utm_source=langfuse&utm_medium=event&utm_campaign=202612-advent";
const GUARDRAILS_CHANGELOG = `/changelog/2026-11-27-ai-gateway-guardrails?${ADVENT_UTM}`;

export type DoorAnimation =
  | { kind: "route"; from: string[]; to: string[] }
  | { kind: "terminal"; lines: string[] }
  | { kind: "keys" }
  | { kind: "providers"; highlight: string[] }
  | { kind: "trace"; rows: { label: string; start: number; width: number }[] }
  | { kind: "modes" }
  | { kind: "headers"; headers: [string, string][] }
  | { kind: "chart" }
  | { kind: "alert" }
  | { kind: "toggles" }
  | { kind: "patterns"; pattern: string }
  | { kind: "chat"; question: string; answer: string }
  | { kind: "gateway" }
  | { kind: "providerTour" }
  | { kind: "budget"; limit: number; owner: string }
  | {
      kind: "guardrail";
      active: GuardrailTemplate;
      action: "redact" | "block";
      prompt: string;
      match: string;
      label?: string;
    }
  | {
      kind: "benchmark";
      /** Values are for Rust, Node.js, and Python, in that order. */
      metrics: { label: string; unit: string; values: number[] }[];
    };

export type GuardrailTemplate =
  | "pii"
  | "secrets"
  | "injection"
  | "keyword"
  | "regex";

export type AdventDoor = {
  day: number;
  title: string;
  description: string;
  icon: LucideIcon;
  link: { type: "blog" | "changelog" | "docs"; href: string };
  /** URL of the social post announcing this door. Add it once the post is live. */
  socialUrl?: string;
  animation: DoorAnimation;
};

export const ALL_PROVIDERS = [
  "OpenAI",
  "Anthropic",
  "Amazon Bedrock",
  "OpenRouter",
  "Vercel AI Gateway",
  "xAI",
  "Microsoft Azure",
  "Google AI Studio",
  "Google Vertex AI",
];

export const ADVENT_DOORS: AdventDoor[] = [
  {
    day: 1,
    title: "Introducing the Langfuse AI Gateway",
    description:
      "This December, we're launching 24 features to introduce the Langfuse AI Gateway, the biggest product expansion in Langfuse history. It's one open source entry point for all AI usage in your company. Every model call becomes a full Langfuse trace, with who made it and what it cost.",
    icon: Rocket,
    link: {
      type: "blog",
      href: `/blog/introducing-gateway?${ADVENT_UTM}`,
    },
    animation: { kind: "gateway" },
  },
  {
    day: 2,
    title: "Redact PII with guardrails",
    description:
      "Guardrails are now live on the AI Gateway, and PII is the first of them. When someone pastes a customer's email into a coding agent, the gateway redacts it before the request reaches the provider or your traces. More guardrails are behind the next doors.",
    icon: ShieldCheck,
    link: { type: "changelog", href: GUARDRAILS_CHANGELOG },
    animation: {
      kind: "guardrail",
      active: "pii",
      action: "redact",
      prompt: "Draft a reply to dana@example.com about her refund.",
      match: "dana@example.com",
      label: "[REDACTED]",
    },
  },
  {
    day: 3,
    title: "Block leaked secrets and API keys",
    description:
      "Coding agents read .env files and paste stack traces, so keys end up in prompts. The secrets guardrail detects common provider keys, tokens, JWTs, private keys, and your own key prefixes, and blocks the request before it reaches the provider.",
    icon: KeyRound,
    link: { type: "changelog", href: GUARDRAILS_CHANGELOG },
    animation: {
      kind: "guardrail",
      active: "secrets",
      action: "block",
      prompt: 'Why does this fail? OpenAI(api_key="sk-proj-4f9a8c2e…")',
      match: "sk-proj-4f9a8c2e…",
    },
  },
  {
    day: 4,
    title: "Custom regex guardrails",
    description:
      "Built-in rules can't know your internal identifiers. Write a regular expression for customer numbers, contract IDs, or patient record numbers, test it against sample text, and block, redact, or log every match.",
    icon: Regex,
    link: { type: "changelog", href: GUARDRAILS_CHANGELOG },
    animation: {
      kind: "guardrail",
      active: "regex",
      action: "redact",
      prompt: "Summarize every ticket from customer CUST-482913.",
      match: "CUST-482913",
      label: "[CUSTOMER_ID]",
    },
  },
  {
    day: 5,
    title: "How we designed the AI Gateway",
    description:
      "Hassieb and Tobias explain why we built the gateway in Rust and why it passes provider APIs through without translating them. In their benchmark on two vCPUs, it sustained 964 streaming requests per second and added 3.2 ms to the median time to first token.",
    icon: Cpu,
    link: {
      type: "blog",
      href: `/blog/2026-11-11-building-the-langfuse-ai-gateway?${ADVENT_UTM}`,
    },
    animation: {
      kind: "benchmark",
      metrics: [
        {
          label: "Streaming requests per second",
          unit: "",
          values: [964, 127, 100],
        },
        {
          label: "Added time to first token (median)",
          unit: " ms",
          values: [3.2, 734, 729],
        },
      ],
    },
  },
  {
    day: 6,
    title: "Cap spend with budgets",
    description:
      "A coding agent stuck in a loop can spend a month's budget in an afternoon. Set budgets per gateway key, per user, or for the whole organization, and get an email at 85% and 95%. Once a budget is reached, the gateway rejects requests until it resets.",
    icon: Wallet,
    link: {
      type: "changelog",
      href: `/changelog/2026-11-19-ai-gateway-budgets?${ADVENT_UTM}`,
    },
    animation: { kind: "budget", limit: 10, owner: "Jane's Claude Code" },
  },
  {
    day: 7,
    title: "Self-host the AI Gateway",
    description:
      "The gateway is open source and runs as one small, stateless container next to your self-hosted Langfuse. Deploy it with the same Helm chart or Docker Compose setup, and keep provider keys and traces in your own infrastructure.",
    icon: Server,
    link: {
      type: "docs",
      href: `/self-hosting/configuration/ai-gateway?${ADVENT_UTM}`,
    },
    animation: {
      kind: "terminal",
      lines: [
        "# values.yaml",
        "langfuse:",
        "  gateway:",
        "    enabled: true",
        "$ helm upgrade langfuse langfuse/langfuse -f values.yaml",
        "$ curl https://gateway.langfuse.example.com/health",
        '✓ {"status":"ok"}',
      ],
    },
  },
  {
    day: 8,
    title: "Nine providers, your own contracts",
    description:
      "Connect nine model providers with your own keys, from OpenAI and Anthropic to Amazon Bedrock, Vertex AI, and Azure. You keep your rates and agreements, such as zero data retention. We don't resell tokens or add a markup.",
    icon: Boxes,
    link: {
      type: "docs",
      href: `/docs/gateway/features/models?${ADVENT_UTM}#supported-providers`,
    },
    animation: { kind: "providerTour" },
  },
];

/**
 * Doors only exist for days whose feature is ready. Days without one stay
 * locked, whatever the date, until a door is added for them.
 */
export function getAdventDoor(day: number): AdventDoor | undefined {
  return ADVENT_DOORS.find((door) => door.day === day);
}

/** The last day that has a door. */
export const LAST_ADVENT_DAY = Math.max(...ADVENT_DOORS.map((d) => d.day));

export const LINK_LABELS: Record<AdventDoor["link"]["type"], string> = {
  blog: "Read the blog post",
  changelog: "Read the changelog",
  docs: "Read the docs",
};
