export const invoiceIntakeTrace = {
  title: "trace · invoice-intake",
  summary: "9 steps · $0.092",
  insight: "one retry step · 66% of run cost",
  steps: [
    { name: "ingest_pdf", indent: false, offset: "6%", width: "16%" },
    { name: "ocr_pages ×14", indent: true, offset: "18%", width: "20%" },
    { name: "extract_fields", indent: true, offset: "32%", width: "14%" },
    {
      name: "reconcile_retry ×3",
      indent: true,
      offset: "40%",
      width: "40%",
      highlight: true,
      cost: "$0.061",
    },
    { name: "post_to_erp", indent: false, offset: "78%", width: "12%" },
  ],
} as const;

export const workflowAutomationInsights = [
  {
    id: "debug",
    title: "Easily debug your agent executions",
    description:
      "Trace every step, tool call, and input and output your agent produces. Find failure modes and bottlenecks across executions, then prioritize issues by how often they happen so you fix what actually matters.",
    href: "/docs/observability/overview",
    ctaLabel: "Tracing overview",
  },
  {
    id: "cost",
    title: "Get a full view on cost at every step",
    description:
      "See the cost of an execution as a whole and a granular view of each sub-step. Swap models and inspect quality so you can manage the cost of the system without guessing.",
    href: "/docs/observability/features/token-and-cost-tracking",
    ctaLabel: "Cost tracking",
  },
  {
    id: "human-expertise",
    title: "Leverage human expertise to improve your system",
    description:
      "Let engineers and domain experts annotate data in Langfuse and mark when the system went wrong. Log corrections from human-in-the-loop setups to build ground-truth data at scale.",
    href: "/docs/evaluation/evaluation-methods/annotation-queues",
    ctaLabel: "Annotation queues",
  },
];

export const workflowAutomationQuoteRoutes = [
  "/users/hugging-face",
  "/users/ravenna",
  "/users/merckgroup",
] as const;

export const workflowAutomationIntegrationGroups = [
  {
    title: "Workflow platforms",
    items: [
      { label: "n8n", href: "/integrations/no-code/n8n" },
      { label: "Temporal", href: "/integrations/frameworks/temporal" },
      { label: "Restate", href: "/integrations/frameworks/restate" },
      { label: "Zapier", href: "/integrations/other/zapier" },
    ],
  },
  {
    title: "Agent frameworks",
    items: [
      { label: "LangGraph", href: "/integrations/frameworks/langgraph" },
      { label: "LangChain", href: "/integrations/frameworks/langchain" },
      { label: "CrewAI", href: "/integrations/frameworks/crewai" },
      {
        label: "OpenAI Agents",
        href: "/integrations/frameworks/openai-agents",
      },
    ],
  },
  {
    title: "No-code builders",
    items: [
      { label: "Dify", href: "/integrations/no-code/dify" },
      { label: "Flowise", href: "/integrations/no-code/flowise" },
      { label: "Langflow", href: "/integrations/no-code/langflow" },
    ],
  },
];
