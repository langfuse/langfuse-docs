// Copy and mock data for the AI Gateway landing page (/gateway).
// Markdown for agents and .md consumers lives in md-override/gateway.md.
// Keep user-facing copy in both files in sync.

export type ProviderIcon = {
  name: string;
  icon: string;
  /** Black logomark that needs inverting in dark mode. */
  monochrome?: boolean;
};

export const heroProviders: ProviderIcon[] = [
  {
    name: "Anthropic",
    icon: "/images/integrations/anthropic_icon.png",
    monochrome: true,
  },
  {
    name: "OpenAI",
    icon: "/images/integrations/openai_icon.svg",
    monochrome: true,
  },
  { name: "Google AI", icon: "/images/integrations/google_gemini_icon.svg" },
  { name: "Bedrock", icon: "/images/integrations/bedrock_icon.svg" },
  { name: "Azure", icon: "/images/integrations/microsoft_icon.svg" },
];

export const heroMoreProviders: ProviderIcon[] = [
  {
    name: "OpenRouter",
    icon: "/images/integrations/openrouter_icon.svg",
    monochrome: true,
  },
  { name: "xAI", icon: "/images/integrations/xai_icon.svg", monochrome: true },
  {
    name: "Vercel AI Gateway",
    icon: "/images/integrations/vercel_ai_gateway_icon.svg",
    monochrome: true,
  },
  { name: "Google Vertex AI", icon: "/images/integrations/vertexai_icon.png" },
];

export const customerLogoNames = [
  "Ramp",
  "Canva",
  "Expedia Group",
  "Pigment",
  "Khan Academy",
  "Hugging Face",
  "Intuit",
  "SumUp",
] as const;

export type ValueProp = {
  title: string;
  body: string;
  /** UI path shown in the product panel title bar. */
  crumb: string;
  panel: "spend" | "budgets" | "models" | "trace";
  features: { label: string; text: string }[];
};

export const valueProps: ValueProp[] = [
  {
    title: "See all spend",
    body: "Know what AI costs and who’s spending it.",
    crumb: "AI Gateway → Overview → Analytics",
    panel: "spend",
    features: [
      {
        label: "Spend dashboard:",
        text: "cost by model, provider, user and gateway key.",
      },
      {
        label: "Attribution by person, service or team:",
        text: "keys for people or services, labels for teams or cost centers.",
      },
    ],
  },
  {
    title: "Cap model costs",
    body: "Set budgets and enforce limits across the organization.",
    crumb: "AI Gateway → Budgets",
    panel: "budgets",
    features: [
      {
        label: "Budgets:",
        text: "reset daily, weekly or monthly. Requests stop once a budget runs out.",
      },
      {
        label: "Warnings and resets:",
        text: "email warnings at 85% and 95%, and a one-click reset that sets spend back to zero.",
      },
    ],
  },
  {
    title: "Control access",
    body: "Allow or block models centrally or individually.",
    crumb: "AI Gateway → Connections & Models",
    panel: "models",
    features: [
      {
        label: "Model controls:",
        text: "approve models centrally and limit each gateway key to the models it needs.",
      },
      {
        label: "Revocable keys:",
        text: "revoke any gateway key immediately. User keys stop working when the person loses access.",
      },
    ],
  },
  {
    title: "Improve AI usage",
    body: "See what AI is used for and improve it.",
    crumb: "Tracing → Sessions",
    panel: "trace",
    features: [
      {
        label: "Automatic tracing:",
        text: "every call becomes a Langfuse trace, with full content or usage only.",
      },
      {
        label: "Evals and analysis:",
        text: "run evals, topics and alerts, or tell Halo what’s on your mind.",
      },
    ],
  },
];

// Mock data for the product panels. Names, models and amounts are invented.
export const spendStats = [
  { label: "Total cost", value: "$18,204" },
  { label: "Requests", value: "1.24M" },
  { label: "Tokens", value: "9.8B" },
];

export const spendBars = Array.from({ length: 30 }, (_, i) => {
  const v = 28 + 22 * Math.abs(Math.sin(i * 0.9)) + i * 1.1;
  return { a: Math.round(v * 0.35), b: Math.round(v * 0.65) };
});

export const topModels = [
  { name: "claude-opus", pct: 92, cost: "$8,410" },
  { name: "gpt-codex", pct: 58, cost: "$5,302" },
  { name: "claude-sonnet", pct: 34, cost: "$3,118" },
];

export const budgetRows = [
  { team: "platform", cc: "4711", pct: 78, label: "$3,900 / $5,000" },
  { team: "support", cc: "5102", pct: 94, label: "$2,340 / $2,500" },
  { team: "growth", cc: "4720", pct: 49, label: "$986 / $2,000" },
  { team: "data", cc: "4802", pct: 20, label: "$305 / $1,500" },
];

export const connections = [
  {
    name: "anthropic-prod",
    provider: "Anthropic",
    models: [
      { name: "claude-opus", on: true },
      { name: "claude-sonnet", on: true },
      { name: "claude-haiku", on: false },
    ],
  },
  {
    name: "openai-prod",
    provider: "OpenAI",
    models: [
      { name: "gpt-5", on: true },
      { name: "gpt-codex", on: true },
      { name: "gpt-pro", on: false },
    ],
  },
];

export const sessionSpans = [
  { name: "refactor billing export", cost: "$1.92", child: false },
  { name: "claude-opus", cost: "$0.42", child: true, selected: true },
  { name: "claude-opus", cost: "$0.38", child: true },
  { name: "claude-sonnet", cost: "$0.11", child: true },
  { name: "claude-opus", cost: "$0.61", child: true },
  { name: "claude-opus", cost: "$0.40", child: true },
];

export const spanDetails = [
  { k: "in", v: "18.4k" },
  { k: "out", v: "1.2k" },
  { k: "cached", v: "14.9k" },
  { k: "cost", v: "$0.42" },
  { k: "latency", v: "6.8s" },
  { k: "ttft", v: "0.9s" },
  { k: "user", v: "anna" },
  { k: "key", v: "anna-laptop" },
];

export type SketchRow = {
  label: string;
  value?: string;
  tone?: "ok" | "warn" | "error";
  toggle?: boolean;
};

export type FeatureCard = {
  title: string;
  description: string;
  href: string;
  sketch:
    | { kind: "rows"; rows: SketchRow[] }
    | { kind: "budget" }
    | { kind: "bars" };
};

export const providerCard = {
  title: "Your providers, one endpoint",
  description:
    "Connect your own provider accounts, with no markup on tokens. Each provider keeps its own API format. Change one URL to switch over.",
  href: "/docs/gateway/features/models#supported-providers",
  chips: [
    "OpenAI",
    "Anthropic",
    "Amazon Bedrock",
    "Google AI Studio",
    "Google Vertex AI",
    "Microsoft Azure (Foundry)",
    "OpenRouter",
    "Vercel AI Gateway",
    "xAI",
  ],
};

export const featureCardsTop: FeatureCard[] = [
  {
    title: "Gateway keys",
    description:
      "Keys for people and for services, labelled by team or cost center. They expire, can be revoked, and stop working when their owner loses access.",
    href: "/docs/gateway/features/api-keys",
    sketch: {
      kind: "rows",
      rows: [
        { label: "maria", value: "active", tone: "ok" },
        { label: "ci-release", value: "service" },
        { label: "alex", value: "revoked", tone: "error" },
      ],
    },
  },
  {
    title: "Budgets",
    description:
      "Per key, per user, a default for everyone, or for the whole organization. Email warnings at 85%, 95% and 100%.",
    href: "/docs/gateway/features/budgets",
    sketch: { kind: "budget" },
  },
  {
    title: "Spend dashboard",
    description:
      "Spend by model, provider, user and key, with alerts on cost or request count and export to your data lake.",
    href: "/docs/gateway/features/analytics",
    sketch: { kind: "bars" },
  },
];

export const featureCardsBottom: FeatureCard[] = [
  {
    title: "Model controls",
    description:
      "Turn models on or off per provider connection and limit each gateway key to certain models.",
    href: "/docs/gateway/features/models",
    sketch: {
      kind: "rows",
      rows: [
        { label: "openai:*", toggle: true },
        { label: "anthropic:*", toggle: true },
        { label: "openrouter:*", toggle: false },
      ],
    },
  },
  {
    title: "Coding agents",
    description:
      "Point Claude Code, Codex and other coding agents at the gateway. Their sessions are grouped automatically.",
    href: "/docs/gateway/get-started/first-request",
    sketch: {
      kind: "rows",
      rows: [
        { label: "claude-code", value: "traced", tone: "ok" },
        { label: "codex", value: "traced" },
        { label: "opencode", value: "traced" },
      ],
    },
  },
  {
    title: "Tracing and insights",
    description:
      "Every call becomes a Langfuse trace, with no code changes. Run evals, search, or ask Halo what teams use AI for.",
    href: "/docs/gateway/features/tracing",
    sketch: {
      kind: "rows",
      rows: [
        { label: "opus", value: "$0.42" },
        { label: "sonnet", value: "$0.11" },
        { label: "gpt-5", value: "$0.08" },
      ],
    },
  },
  {
    title: "Open source",
    description:
      "Self-host the gateway as a single small Docker image, or use it on Langfuse Cloud.",
    href: "/self-hosting/configuration/ai-gateway",
    sketch: {
      kind: "rows",
      rows: [
        { label: "Cloud", value: "managed" },
        { label: "Self-hosted", value: "Docker" },
      ],
    },
  },
];

export const steps = {
  connect: {
    title: "Connect your providers",
    body: "Add your own OpenAI, Anthropic, Bedrock, Vertex, Azure or other provider accounts. Your keys stay in the gateway, and you keep your own contracts and pricing with no markup.",
    href: "/docs/gateway/features/models",
  },
  keys: {
    title: "Hand out gateway keys",
    body: "Give each person or service its own gateway key instead of a provider key. Each key carries who it belongs to, which models it can use and its budget, and you can revoke it anytime.",
    href: "/docs/gateway/features/api-keys",
  },
  url: {
    title: "Change one URL",
    body: "Point your apps and coding agents at the gateway. Requests keep each provider’s native format, so nothing else changes. From then on, every call is costed, checked against your budgets, and recorded in Langfuse.",
    href: "/docs/gateway/get-started/first-request",
  },
};
