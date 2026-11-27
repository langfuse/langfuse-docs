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
  panel: "spend" | "budgets" | "models" | "trace";
  features: { label: string; text: string }[];
};

export const valueProps: ValueProp[] = [
  {
    title: "See all spend",
    body: "Know what AI costs and who’s spending it.",
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
  { label: "Total cost", value: "$1,366.92" },
  { label: "Requests", value: "19.23K" },
];

// Daily cost in dollars, Oct 5 to Nov 2.
export const spendBars = [
  59, 38, 50, 68, 58, 8, 0, 73, 81, 60, 80, 64, 1, 1, 53, 63, 40, 54, 78, 16, 0,
  80, 56, 68, 70, 72, 14, 14, 24,
];

export const spendBarLabels = [
  { text: "Oct 5", index: 0 },
  { text: "Oct 15", index: 10 },
  { text: "Oct 25", index: 20 },
  { text: "Nov 2", index: 28 },
];

export const topModels = [
  { name: "claude-sonnet", cost: 452.02 },
  { name: "claude-opus", cost: 434.49 },
  { name: "gpt-5.6", cost: 300.76 },
  { name: "gpt-5.3-codex", cost: 85.5 },
  { name: "gpt-5.6-terra", cost: 72.14 },
];

// One team's daily spend from Nov 1 to Nov 27, in relative units.
export const budgetChart = {
  team: "support",
  spent: 2340,
  budget: 2500,
  warnAt: 0.85,
  daily: [
    62, 48, 95, 110, 104, 30, 22, 96, 118, 101, 92, 88, 26, 18, 99, 112, 124,
    97, 90, 24, 20, 104, 131, 120, 95, 30, 61,
  ],
};

export const budgetRows = [
  { team: "support", spent: 2340, budget: 2500, highlight: true },
  { team: "platform", spent: 3900, budget: 5000 },
  { team: "growth", spent: 986, budget: 2000 },
  { team: "data", spent: 305, budget: 1500 },
];

export const keyStats = [
  { label: "Active keys", value: "46" },
  { label: "Shared provider keys", value: "0" },
];

export const gatewayKeys = [
  { name: "Priya – Claude Code", models: "anthropic-prod:*", revoked: false },
  {
    name: "support-bot",
    models: "anthropic-prod:claude-haiku*",
    revoked: false,
  },
  {
    name: "Amara – agents",
    models: "anthropic-prod:claude-sonnet*",
    revoked: false,
  },
  { name: "ci-release", models: "openai-prod:gpt-5*", revoked: false },
  { name: "Lukas – Claude Code", models: "anthropic-prod:*", revoked: true },
  {
    name: "contractor-q4",
    models: "anthropic-prod:claude-sonnet*",
    revoked: true,
  },
];

export const session = {
  name: "refactor-billing-export",
  user: "anna",
  // Cost of each model call in dollars, in order.
  calls: [0.42, 0.06, 0.38, 0.04, 0.61, 0.4, 0.01, 0.22, 0.05, 0.31],
  rows: [
    { name: "fix-failing-test", model: "claude-opus", cost: "$0.61" },
    { name: "plan-changes", model: "claude-opus", cost: "$0.42" },
    { name: "summarize-diff", model: "claude-opus", cost: "$0.40" },
    { name: "edit-export.ts", model: "claude-opus", cost: "$0.38" },
    { name: "read-files", model: "claude-sonnet", cost: "$0.06" },
  ],
};

export type SketchTone = "ok" | "warn" | "error";

// What each feature-card drawing shows; the layout lives in GatewayFeatureSketch.
export type FeatureSketch =
  | {
      kind: "keys";
      group: string;
      heading: string;
      rows: { label: string; value: string; tone?: SketchTone }[];
    }
  | {
      kind: "budget";
      label: string;
      usedPercent: number;
      warnAtPercent: [number, number];
      warning: string;
    }
  | { kind: "spend"; points: number[]; highlight: number; tag: string[] }
  | { kind: "models"; rows: { label: string; on: boolean }[] }
  | { kind: "agents"; agents: string[]; result: string }
  | { kind: "tracing"; spans: { label: string; cost: string }[] }
  | { kind: "hosting"; options: { label: string; detail: string }[] };

export type FeatureCard = {
  title: string;
  description: string;
  href: string;
  sketch: FeatureSketch;
};

export const providerCard = {
  title: "Your providers, one endpoint",
  description:
    "Connect your own provider accounts, with no markup on tokens. Each provider keeps its own API format. Change one URL to switch over.",
  href: "/docs/gateway/features/models#supported-providers",
  hub: "AI Gateway",
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
      kind: "keys",
      group: "platform",
      heading: "Gateway keys",
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
    sketch: {
      kind: "budget",
      label: "platform",
      usedPercent: 86,
      warnAtPercent: [85, 95],
      warning: "warning",
    },
  },
  {
    title: "Spend dashboard",
    description:
      "Spend by model, provider, user and key, with alerts on cost or request count and export to your data lake.",
    href: "/docs/gateway/features/analytics",
    sketch: {
      kind: "spend",
      points: [30, 42, 36, 55, 48, 66, 60, 78, 72, 90, 84, 100],
      highlight: 9,
      tag: ["30d cost", "$18,204"],
    },
  },
];

export const featureCardsBottom: FeatureCard[] = [
  {
    title: "Model controls",
    description:
      "Turn models on or off per provider connection and limit each gateway key to certain models.",
    href: "/docs/gateway/features/models",
    sketch: {
      kind: "models",
      rows: [
        { label: "openai:*", on: true },
        { label: "anthropic:*", on: true },
        { label: "openrouter:*", on: false },
      ],
    },
  },
  {
    title: "Coding agents",
    description:
      "Point Claude Code, Codex and other coding agents at the gateway. Their sessions are grouped automatically.",
    href: "/docs/gateway/get-started/first-request",
    sketch: {
      kind: "agents",
      agents: ["claude-code", "codex", "opencode"],
      result: "traced",
    },
  },
  {
    title: "Tracing and insights",
    description:
      "Every call becomes a Langfuse trace, with no code changes. Run evals, search, or ask Halo what teams use AI for.",
    href: "/docs/gateway/features/tracing",
    sketch: {
      kind: "tracing",
      spans: [
        { label: "opus", cost: "$4.2k" },
        { label: "sonnet", cost: "$1.1k" },
        { label: "gpt-5", cost: "$0.8k" },
      ],
    },
  },
  {
    title: "Open source",
    description:
      "Self-host the gateway as a single small Docker image, or use it on Langfuse Cloud.",
    href: "/self-hosting/configuration/ai-gateway",
    sketch: {
      kind: "hosting",
      options: [
        { label: "Cloud", detail: "managed" },
        { label: "Self-hosted", detail: "Docker" },
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
