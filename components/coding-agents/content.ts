import type { InsightItem } from "@/components/chat-agents/ValueInsightsAccordion";
import type { IntegrationGroup } from "@/components/chat-agents/RelevantIntegrations";

export const codingAgentsGatewayInsights: InsightItem[] = [
  {
    id: "budgets",
    title: "Allocate budgets centrally",
    imageSrc: "/images/coding-agents/gateway-budget-allocation.png",
    imageAlt:
      "Organization budget of $40,000 per month allocated across four teams, with each team's spend shown against its budget",
    description:
      "Give teams and departments a spend envelope on the gateway, then see what actually landed in Langfuse. A developer cannot disable a gateway the way they can a local hook.",
    href: "/resources/engineering/llm-gateway",
    ctaLabel: "What is an LLM gateway?",
  },
  {
    id: "dashboards",
    title: "See spend by department and use case",
    imageSrc: "/images/coding-agents/gateway-spend-breakdown.png",
    imageAlt:
      "Platform team spend of $14,600 with daily costs, an alert threshold, and a breakdown by debugging, feature implementation, code review, and planning",
    description:
      "Trace every coding-agent LLM call into Langfuse. Build dashboards for cost per team, repository, model, and use case, then set alerts before a spike becomes a surprise.",
    href: "/docs/observability/features/token-and-cost-tracking",
    ctaLabel: "Cost tracking",
  },
  {
    id: "skills",
    title: "Improve token efficiency with shared skills",
    imageSrc: "/images/coding-agents/gateway-shared-skills.png",
    imageAlt:
      "Repeated tasks consolidated into a shared skill, reducing tokens per run from 14.2k to 8.6k",
    description:
      "Use traces to find repeated context, failed tool loops, and prompts that should become org- or team-wide skills. Roll those skills out once and measure whether token spend actually drops.",
    href: "/blog/2026-02-26-evaluate-ai-agent-skills",
    ctaLabel: "Evaluating AI agent skills",
  },
];

export const codingAgentsHooksInsights: InsightItem[] = [
  {
    id: "execution",
    title: "Trace the full coding-agent session",
    imageSrc: "/images/coding-agents/hooks-session-trace.png",
    imageAlt:
      "Coding-agent session trace showing model turns, tool calls, approval waits, token usage, and cost",
    description:
      "Log tool calls, retries, skill usage, and model turns. Reconstruct what the agent did so you can debug loops, bloated context, and skills that need a rewrite.",
    href: "/resources/engineering/coding-agent-tracing",
    ctaLabel: "Tracing coding agents",
  },
  {
    id: "attribution",
    title: "Attribute spend to developers and projects",
    imageSrc: "/images/coding-agents/hooks-tokens-per-user.png",
    imageAlt:
      "Tokens per user dashboard showing total token consumption grouped by individual users",
    description:
      "Hook integrations attach a user identifier, so dashboards can break down cost per person or per repo. Find who is burning tokens and which workflows are worth optimizing.",
    href: "/docs/observability/features/token-and-cost-tracking",
    ctaLabel: "Cost tracking",
  },
  {
    id: "optimize",
    title: "Optimize skills, tools, and context",
    imageSrc: "/images/coding-agents/hooks-skill-evaluation.png",
    imageAlt:
      "Skill evaluation comparison showing reference-file selection and task-completion scores for coding-agent tasks",
    description:
      "Compare sessions to find unused tools, repeated file reads, and prompts that should be shorter. Test skill changes and inspect agent context for maximum efficiency.",
    href: "/blog/2026-03-24-optimizing-ai-skill-with-autoresearch",
    ctaLabel: "Optimizing an AI skill",
  },
];

export const codingAgentsGatewayIntegrationGroups: IntegrationGroup[] = [
  {
    title: "LLM gateways",
    items: [
      { label: "LiteLLM", href: "/integrations/gateways/litellm" },
      { label: "OpenRouter", href: "/integrations/gateways/openrouter" },
      {
        label: "Langfuse Gateway (coming soon)",
        href: "/docs/roadmap#langfuse-gateway",
      },
    ],
  },
];

export const codingAgentsHooksIntegrationGroups: IntegrationGroup[] = [
  {
    title: "Coding agents",
    items: [
      {
        label: "Claude Code",
        href: "/integrations/developer-tools/claude-code",
      },
      { label: "Codex", href: "/integrations/developer-tools/codex" },
      { label: "OpenCode", href: "/integrations/developer-tools/opencode" },
      { label: "Cursor", href: "/integrations/developer-tools/cursor" },
      {
        label: "GitHub Copilot",
        href: "/integrations/developer-tools/github-copilot",
      },
      {
        label: "More coding agents",
        href: "/integrations#developer-tools",
      },
    ],
  },
];
