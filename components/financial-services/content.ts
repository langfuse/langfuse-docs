import type { InsightItem } from "@/components/chat-agents/ValueInsightsAccordion";

export const financialServicesReasons = [
  {
    title: "Standardize observability and evals across teams",
    body: "Bring agents across frameworks, models, and gateways into a shared view of traces and evaluations.",
  },
  {
    title: "Ship reliable agents with deployment quality gates",
    body: "Evaluate model and agent changes against datasets before release.",
  },
  {
    title: "Retain execution history",
    body: "Keep traces of AI executions as evidence for supervisory and regulatory reviews.",
  },
  {
    title: "Flag potential policy violations",
    body: "Score outputs against your policies and regulations with evaluators.",
  },
  {
    title: "Self-host or air-gap",
    body: "Deploy with no internet access and lock access to internal users via VPN.",
  },
] as const;

export const financialServicesInsights: InsightItem[] = [
  {
    id: "gates",
    title: "Ship reliable agents through deployment quality gates",
    description:
      "Replay prompt, model, and tool changes against golden datasets. Fail the release when accuracy, policy, or hallucination scores regress — before a client sees a wrong figure.",
    href: "/blog/2026-07-15-llm-certification-financial-services",
    ctaLabel: "Deployment gates in financial services",
    imageSrc:
      "/images/blog/2026-07-15-llm-certification-financial-services/benchmark-results.png",
    imageAlt:
      "Gate results comparing Claude models on FinanceBench with pass and fail scores",
  },
  {
    id: "production",
    title: "Trace production executions and react to usage shifts",
    description:
      "See load, behavior, and cost as they change. Inspect every tool call and reasoning step so platform and risk teams know what the system is handling.",
    href: "/docs/observability/overview",
    ctaLabel: "Tracing overview",
    imageSrc: "/images/workflow-automation/execution-trace.png",
    imageAlt:
      "Agent execution trace showing model turns, tool calls, and nested steps",
  },
  {
    id: "compliance",
    title: "Cover compliance with audit trails and PII redaction",
    description:
      "Mask sensitive fields before data leaves your application. Keep execution history and developer actions for internal and supervisory review, with SSO and project-level RBAC.",
    href: "/docs/observability/features/masking",
    ctaLabel: "Masking and redaction",
    imageSrc: "/images/workflow-automation/human-review.png",
    imageAlt:
      "Human annotation of an incorrect agent step with a written explanation",
  },
];

export const financialServicesQuoteRoutes = [
  "/users/sumup",
  "/users/ramp",
  "/users/trade-republic",
] as const;

export const financialServicesLogoNames = [
  "Ramp",
  "Intuit",
  "SumUp",
  "Rocket Money",
] as const;

export const financialServicesDeploymentModes = [
  {
    id: "cloud" as const,
    label: "Cloud",
    title: "Managed cloud in the EU, US, or Japan.",
    flow: ["Your app", "OTel SDK", "Langfuse Cloud"],
    specs: [
      { k: "Regions", v: "EU · US · JP" },
      { k: "Certifications", v: "SOC 2 Type II · ISO 27001" },
      { k: "Data residency", v: "Pinned to region" },
      { k: "Support", v: "Enterprise SLA" },
    ],
  },
  {
    id: "self-host" as const,
    label: "Self-host",
    title: "Run Langfuse in your own VPC.",
    flow: ["Your app", "OTel SDK", "Langfuse · your VPC"],
    specs: [
      { k: "Infra", v: "Kubernetes · Docker" },
      { k: "Storage", v: "ClickHouse · Postgres · S3" },
      { k: "Access", v: "SSO · VPN-only" },
      { k: "License", v: "MIT core + Enterprise" },
    ],
  },
  {
    id: "air-gapped" as const,
    label: "Air-gapped",
    title: "No internet access. No vendor access.",
    flow: ["Your app", "OTel SDK", "Langfuse · isolated"],
    specs: [
      { k: "Outbound traffic", v: "None" },
      { k: "Langfuse support access", v: "None" },
      { k: "Users", v: "Internal only, via VPN" },
      { k: "Updates", v: "Offline image transfer" },
    ],
  },
];

export type FinancialServicesDeploymentModeId =
  (typeof financialServicesDeploymentModes)[number]["id"];

export const financialServicesTrace = {
  outcome: "Application referred to an underwriter. Human review queued.",
  traceId: "tr_8f2c41e9",
  duration: "8.42s",
  cost: "$0.031",
  tokens: "14.2k tokens",
  reasons: [
    { label: "Bureau score 642 < 650", span: 4 },
    { label: "1 delinquency in 24m", span: 3 },
    { label: "Summary: refer", span: 4 },
    { label: "Policy check: pass", span: 5 },
  ],
  scores: [
    { k: "policy_compliance", v: "PASS · 1.00" },
    { k: "pii_redacted", v: "PASS" },
    { k: "decision_drift_7d", v: "0.04" },
    { k: "human_review", v: "queued" },
  ],
  audit: [
    { t: "09:14:02", e: "trace ingested" },
    { t: "09:14:03", e: "eval policy-compliance → PASS" },
    { t: "09:14:03", e: "eval pii-redaction → PASS" },
    { t: "09:20:41", e: "risk viewed trace" },
    { t: "09:22:10", e: 'annotation: "refer confirmed"' },
  ],
  spans: [
    {
      name: "credit-onboarding-agent",
      type: "agent",
      dur: "8.42s",
      indent: false,
      highlight: false,
      io: 'input:  { applicant_id: "ap_20931", product: "consumer_credit" }\noutput: { decision: "refer", risk_band: "B2" }',
    },
    {
      name: "identity.verify",
      type: "tool",
      dur: "1.31s",
      indent: true,
      highlight: false,
      io: "input:  { name: <REDACTED:NAME>, iban: <REDACTED:IBAN> }\noutput: { kyc_status: verified }",
    },
    {
      name: "fraud.screen",
      type: "tool",
      dur: "1.86s",
      indent: true,
      highlight: false,
      io: "input:  { device_id: <REDACTED>, ip_geo: DE }\noutput: { fraud_score: 0.08 }",
    },
    {
      name: "credit_bureau.lookup",
      type: "tool",
      dur: "3.54s",
      indent: true,
      highlight: true,
      io: "input:  { applicant_ref: <REDACTED:ID> }\noutput: { bureau_score: 642, delinquencies_24m: 1 }",
    },
    {
      name: "risk-summary",
      type: "llm",
      dur: "2.37s",
      indent: true,
      highlight: false,
      io: "model: gpt-4.1 · prompt: risk-summary@v14\noutput: Refer to underwriter. Bureau score below auto-approve threshold.",
    },
    {
      name: "policy-compliance",
      type: "eval",
      dur: "0.61s",
      indent: true,
      highlight: false,
      io: "policy: consumer-credit-policy-2026.pdf\nresult: PASS: decision cites adverse factors.",
    },
  ],
};

export const financialServicesEvalCapabilities = [
  {
    title: "Offline evaluation",
    body: "Golden datasets from production traces, versioned experiments with baseline comparison, and a release gate that fails the pull request on regression.",
  },
  {
    title: "Online evaluation",
    body: "Sampling of live traffic, LLM-as-a-judge and code evaluators, and threshold alerts when quality drifts.",
  },
  {
    title: "Human review",
    body: "Annotation queues for subject-matter experts, corrected outputs, and promotion of failures into a regression set.",
  },
  {
    title: "Judge calibration",
    body: "Score Analytics measures agreement between human labels and model judges so you can defend the judge to model risk.",
  },
  {
    title: "Prompt governance",
    body: "Immutable versions, staging and production labels, protected labels for separation of duties, and full audit history.",
  },
  {
    title: "Redaction and administration",
    body: "Masking in the SDK before data leaves your application, project-level RBAC, OIDC SSO, SCIM, and audit logs.",
  },
] as const;

export const financialServicesUseCases = [
  {
    area: "Support",
    title: "Customer support agents",
    workflow:
      "An agent resolves merchant and customer requests, escalating edge cases to humans.",
    inspect:
      "Autonomy rate, good and bad runs scored by evals and reviewers, and the long-tail cases to fix next.",
    proof: "SumUp · 50% deflection",
    href: "/users/sumup",
  },
  {
    area: "Risk",
    title: "Credit onboarding and underwriting",
    workflow:
      "An agent combines identity, fraud, and bureau checks into a risk summary and decision.",
    inspect:
      "Why an application was approved or referred, decision drift over time, and eval scores per prompt version.",
  },
  {
    area: "Compliance",
    title: "AML investigations",
    workflow:
      "An agent gathers transaction history and drafts a case summary for an analyst.",
    inspect:
      "Which tools ran, what data they returned, and how cost and latency vary per case.",
  },
  {
    area: "Investing",
    title: "AI-powered advisory",
    workflow:
      "A multi-step agent turns client goals and holdings into a portfolio recommendation.",
    inspect:
      "Each reasoning step and tool call, scored for suitability, with history kept for model risk review.",
  },
  {
    area: "Compliance",
    title: "Compliance monitoring",
    workflow:
      "An agent drafts customer replies and back-office summaries that must follow internal policy.",
    inspect:
      "Policy evals on every output, with potential violations flagged for review before release.",
  },
  {
    area: "Engineering",
    title: "Coding agents across engineering",
    workflow:
      "Developers use Claude Code, Codex, Cursor, and Copilot across teams and repositories.",
    inspect:
      "Cost per developer and model, failing tools, and full session replays.",
    href: "/coding-agents",
  },
] as const;
