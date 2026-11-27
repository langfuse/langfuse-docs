import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Boxes,
  ChartColumn,
  Cloud,
  Cpu,
  Filter,
  GitBranch,
  Globe,
  KeyRound,
  Layers,
  ListTree,
  MessageCircle,
  Regex,
  Rocket,
  Route,
  ShieldCheck,
  Sparkles,
  SquareTerminal,
  Tag,
  Tags,
  ToggleRight,
  Waypoints,
  Workflow,
  Zap,
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
    title: "GitHub Copilot through the gateway",
    description:
      "Bring your own model to GitHub Copilot via the gateway, so Copilot usage shows up next to all your other AI traffic.",
    icon: GitBranch,
    link: {
      type: "docs",
      href: "/integrations/developer-tools/github-copilot-gateway",
    },
    animation: {
      kind: "route",
      from: ["GitHub Copilot"],
      to: ["OpenAI", "Anthropic", "OpenRouter"],
    },
  },
  {
    day: 7,
    title: "Amazon Bedrock",
    description:
      "Connect Amazon Bedrock and call its models through the gateway, next to OpenAI and Anthropic.",
    icon: Cloud,
    link: {
      type: "changelog",
      href: "/changelog/2026-11-10-ai-gateway-bedrock",
    },
    animation: { kind: "providers", highlight: ["Amazon Bedrock"] },
  },
  {
    day: 8,
    title: "OpenRouter, Vercel AI Gateway, and xAI",
    description:
      "Add OpenRouter, Vercel AI Gateway, and xAI connections to reach even more models with a single gateway key.",
    icon: Boxes,
    link: {
      type: "changelog",
      href: "/changelog/2026-11-10-ai-gateway-openrouter-vercel-xai",
    },
    animation: {
      kind: "providers",
      highlight: ["OpenRouter", "Vercel AI Gateway", "xAI"],
    },
  },
  {
    day: 9,
    title: "Microsoft Azure and Google AI Studio",
    description:
      "Use Microsoft Azure (Foundry) models and Gemini models from Google AI Studio through the gateway.",
    icon: Globe,
    link: {
      type: "changelog",
      href: "/changelog/2026-11-12-ai-gateway-azure-google-ai-studio",
    },
    animation: {
      kind: "providers",
      highlight: ["Microsoft Azure", "Google AI Studio"],
    },
  },
  {
    day: 10,
    title: "Google Vertex AI",
    description:
      "Connect Google Vertex AI and use Gemini and the open models Google hosts through the gateway.",
    icon: Cloud,
    link: {
      type: "changelog",
      href: "/changelog/2026-11-13-ai-gateway-vertex-ai",
    },
    animation: { kind: "providers", highlight: ["Google Vertex AI"] },
  },
  {
    day: 11,
    title: "Every call becomes a trace",
    description:
      "The gateway records every model call as a Langfuse generation. Filter, evaluate, and chart gateway traces like traces from the SDKs.",
    icon: ListTree,
    link: { type: "docs", href: "/docs/gateway/features/tracing" },
    animation: {
      kind: "trace",
      rows: [
        { label: "session", start: 0, width: 100 },
        { label: "generation", start: 4, width: 30 },
        { label: "generation", start: 38, width: 22 },
        { label: "generation", start: 64, width: 34 },
      ],
    },
  },
  {
    day: 12,
    title: "Choose what gets recorded",
    description:
      "Record everything, including prompts and responses, with FULL mode. Or keep only cost, usage, and an audit trail with USAGE mode when prompts must not be stored.",
    icon: Layers,
    link: {
      type: "docs",
      href: "/docs/gateway/features/tracing#ingestion-modes",
    },
    animation: { kind: "modes" },
  },
  {
    day: 13,
    title: "Enrich traces with headers",
    description:
      "Add a user, session, environment, tags, or metadata to gateway traces with optional request headers. They work with any client.",
    icon: Tags,
    link: { type: "docs", href: "/docs/gateway/features/tracing#headers" },
    animation: {
      kind: "headers",
      headers: [
        ["langfuse-user-id", "jane@example.com"],
        ["langfuse-environment", "ci"],
        ["langfuse-tags", "claude-code,platform-team"],
        ["langfuse-metadata", "repo:langfuse-docs"],
      ],
    },
  },
  {
    day: 14,
    title: "Nest gateway calls in your traces",
    description:
      "Send a traceparent header and the gateway records its generation inside your existing trace, next to the retrieval and tool steps your SDK instrumentation captures.",
    icon: Waypoints,
    link: {
      type: "docs",
      href: "/docs/gateway/features/tracing#trace-context",
    },
    animation: {
      kind: "trace",
      rows: [
        { label: "agent run (SDK)", start: 0, width: 100 },
        { label: "retrieval (SDK)", start: 4, width: 24 },
        { label: "generation (gateway)", start: 30, width: 40 },
        { label: "tool call (SDK)", start: 72, width: 24 },
      ],
    },
  },
  {
    day: 15,
    title: "Your AI spend dashboard",
    description:
      "See total cost, requests, and tokens across all gateway traffic, broken down by user, key, and model.",
    icon: ChartColumn,
    link: { type: "docs", href: "/docs/gateway/features/analytics" },
    animation: { kind: "chart" },
  },
  {
    day: 16,
    title: "Key metadata for teams and cost centers",
    description:
      "Attach metadata such as a team or cost center to a gateway key. Every generation recorded with the key carries it, so spend breaks down the way your company is organized.",
    icon: Tag,
    link: {
      type: "docs",
      href: "/docs/gateway/features/api-keys#key-metadata",
    },
    animation: {
      kind: "headers",
      headers: [
        ["team", "platform"],
        ["cost_center", "4711"],
        ["environment", "production"],
      ],
    },
  },
  {
    day: 17,
    title: "Alerts on gateway spend",
    description:
      "Get notified when cost or request count crosses a threshold. Filter alerts by user, model, gateway key, or key metadata.",
    icon: Bell,
    link: { type: "docs", href: "/docs/gateway/features/analytics#alerts" },
    animation: { kind: "alert" },
  },
  {
    day: 18,
    title: "Approve models centrally",
    description:
      "Turn models on or off per provider connection, so expensive or unvetted models don't creep in unnoticed.",
    icon: ToggleRight,
    link: { type: "docs", href: "/docs/gateway/features/models#manage-models" },
    animation: { kind: "toggles" },
  },
  {
    day: 19,
    title: "Restrict models per key",
    description:
      "Decide per gateway key which models it can call, with patterns such as openai-prod:* or -openrouter:*.",
    icon: Filter,
    link: {
      type: "changelog",
      href: "/changelog/2026-11-13-ai-gateway-key-model-restrictions",
    },
    animation: { kind: "patterns", pattern: "openai-prod:*" },
  },
  {
    day: 20,
    title: "Route through your own endpoint",
    description:
      "Send OpenAI and Anthropic connections to a custom base URL, such as an internal LLM proxy, and attach extra headers to every request.",
    icon: Route,
    link: {
      type: "changelog",
      href: "/changelog/2026-11-11-ai-gateway-custom-base-url",
    },
    animation: {
      kind: "route",
      from: ["Your app"],
      to: ["llm.example.com", "Internal proxy"],
    },
  },
  {
    day: 21,
    title: "Embeddings through the gateway",
    description:
      "Create embeddings through the gateway with OpenAI, OpenRouter, or Vercel AI Gateway connections.",
    icon: Sparkles,
    link: {
      type: "changelog",
      href: "/changelog/2026-11-11-ai-gateway-openai-embeddings",
    },
    animation: {
      kind: "terminal",
      lines: [
        "$ curl $GATEWAY/openai/v1/embeddings \\",
        '    -d \'{"model": "openai-prod:<model>", "input": "Merry Christmas"}\'',
        "[0.0123, -0.0456, 0.0789, ...]",
        "✓ traced in Langfuse",
      ],
    },
  },
  {
    day: 22,
    title: "Decision models through the gateway",
    description:
      "Send OpenAI Decisions requests through the gateway. Each call is traced as a generation, like Responses and Chat Completions calls.",
    icon: Zap,
    link: {
      type: "changelog",
      href: "/changelog/2026-11-11-ai-gateway-openai-decisions",
    },
    animation: {
      kind: "terminal",
      lines: [
        "$ curl $GATEWAY/openai/v1/decisions \\",
        "    -H 'Authorization: Bearer <your gateway key>' -d @request.json",
        "200 OK",
        "✓ traced as a generation",
      ],
    },
  },
  {
    day: 23,
    title: "OpenCode, Pi, and the Vercel AI SDK",
    description:
      "Connect more coding agents and frameworks to the gateway. Each guide shows the minimal configuration and how calls are grouped into traces and sessions.",
    icon: Workflow,
    link: {
      type: "docs",
      href: "/integrations/developer-tools/opencode-gateway",
    },
    animation: {
      kind: "route",
      from: ["OpenCode", "Pi", "Vercel AI SDK"],
      to: ["OpenAI", "Anthropic"],
    },
  },
  {
    day: 24,
    title: "Ask Halo about your AI usage",
    description:
      "Every gateway call is a full Langfuse trace, so you can ask Halo questions about your AI usage in plain language.",
    icon: MessageCircle,
    link: {
      type: "docs",
      href: "/docs/api-and-data-platform/features/halo",
    },
    animation: {
      kind: "chat",
      question: "What does the platform team use Claude Code for?",
      answer:
        "Mostly code review and migrations: 62% of sessions touched the billing service this week.",
    },
  },
];

export const LINK_LABELS: Record<AdventDoor["link"]["type"], string> = {
  blog: "Read the blog post",
  changelog: "Read the changelog",
  docs: "Read the docs",
};
