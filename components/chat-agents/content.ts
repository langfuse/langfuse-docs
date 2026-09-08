import type { InsightItem } from "@/components/chat-agents/ValueInsightsAccordion";

export const chatAgentsInsights: InsightItem[] = [
  {
    id: "sessions",
    title: "Identify where conversations go sideways",
    description:
      "See deep insights into user inputs and agent responses. Dive deep into every step the agent takes in between. Inspect the overall user session as a whole and follow the conversation flow as your users did.",
    href: "/docs/observability/features/sessions",
    ctaLabel: "Session tracing",
    imageSrc: "/images/chat-agents/conversation-trace.png",
    imageAlt:
      "Chatbot trace with agent steps, tool calls, and a highlighted user disagreement score",
  },
  {
    id: "cost",
    title: "Track detailed cost of interactions",
    description:
      "Context grows with every turn and so does your bill. Break cost and token usage by turn, session, model, and release. Build dashboards and set alerts to stay on top of your spend.",
    href: "/docs/observability/features/token-and-cost-tracking",
    ctaLabel: "Cost tracking",
    imageSrc: "/images/chat-agents/interaction-cost.png",
    // Clip the black capture border at the screenshot's left edge.
    imageClassName: "object-left-top [clip-path:inset(0_0_0_1px)]",
    imageAlt:
      "Chatbot interaction showing the breakdown of input, cached input, output, and total cost",
  },
  {
    id: "evals",
    title: "Measure and improve quality of your chat agent",
    description:
      "Run LLM as a judge on production data to detect frustration, follow-ups, or other user signals that are worth investigating. Promote happy paths from production into datasets to measure and improve quality.",
    href: "/docs/evaluation/overview",
    ctaLabel: "Evaluations",
    imageSrc: "/images/chat-agents/quality-experiments.png",
    imageAlt:
      "General QA chatbot dataset experiments comparing evaluation scores, latency, and cost",
  },
];
