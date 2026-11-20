import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Boxes,
  ChartColumn,
  Cloud,
  Code,
  Filter,
  GitBranch,
  Globe,
  KeyRound,
  Layers,
  ListTree,
  MessageCircle,
  Rocket,
  Route,
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
  | { kind: "chat"; question: string; answer: string };

export type AdventDoor = {
  day: number;
  title: string;
  description: string;
  icon: LucideIcon;
  link: { type: "changelog" | "docs"; href: string };
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
    title: "The Langfuse AI Gateway",
    description:
      "Send your OpenAI and Anthropic requests to Langfuse instead of the provider. The gateway forwards them with a credential your organization stores in Langfuse and records every call. You only change the base URL and the API key.",
    icon: Rocket,
    link: {
      type: "changelog",
      href: "/changelog/2026-11-04-ai-gateway-public-beta",
    },
    animation: {
      kind: "route",
      from: ["Your app"],
      to: ["OpenAI", "Anthropic"],
    },
  },
  {
    day: 2,
    title: "One base URL, no code changes",
    description:
      "Point any client at the gateway by swapping its base URL and key. No SDK to install and no code to change: requests look exactly like requests to the provider.",
    icon: Code,
    link: { type: "docs", href: "/docs/gateway/get-started/first-request" },
    animation: {
      kind: "terminal",
      lines: [
        "$ export OPENAI_BASE_URL=https://gateway.cloud.langfuse.com/openai/v1",
        "$ export OPENAI_API_KEY=<your gateway key>",
        "$ python app.py",
        "✓ traced in Langfuse",
      ],
    },
  },
  {
    day: 3,
    title: "Gateway keys, not provider keys",
    description:
      "Everyone gets their own gateway key, and the provider key never leaves Langfuse. User keys belong to a person, service account keys to CI and shared services.",
    icon: KeyRound,
    link: { type: "docs", href: "/docs/gateway/features/api-keys#key-types" },
    animation: { kind: "keys" },
  },
  {
    day: 4,
    title: "Claude Code through the gateway",
    description:
      "Give your team Claude Code without sharing an Anthropic key. Every session lands in Langfuse with cost, tokens, and the full conversation.",
    icon: SquareTerminal,
    link: {
      type: "docs",
      href: "/integrations/developer-tools/claude-code-gateway",
    },
    animation: {
      kind: "terminal",
      lines: [
        "$ export ANTHROPIC_BASE_URL=https://gateway.cloud.langfuse.com/anthropic",
        "$ export ANTHROPIC_AUTH_TOKEN=<your gateway key>",
        "$ claude",
        "✓ session traced in Langfuse",
      ],
    },
  },
  {
    day: 5,
    title: "Codex through the gateway",
    description:
      "Run Codex with a gateway key and see what every session costs, which tools it called, and what it changed.",
    icon: SquareTerminal,
    link: { type: "docs", href: "/integrations/developer-tools/codex-gateway" },
    animation: {
      kind: "terminal",
      lines: [
        "# ~/.codex/config.toml",
        'model_provider = "langfuse"',
        "[model_providers.langfuse]",
        'base_url = "https://gateway.cloud.langfuse.com/openai/v1"',
        "$ codex",
        "✓ session traced in Langfuse",
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
  changelog: "Read the changelog",
  docs: "Read the docs",
};
