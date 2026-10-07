import type { FAQItem } from "@/components/shared/FAQAccordion";

export const financialServicesReasons = [
  {
    title: "Standardize observability and evals across teams",
    body: "Bring agents across frameworks, models, and gateways into a shared view of traces and evaluations.",
  },
  {
    title: "Ship reliable agents with clear deployment quality gates",
    body: "evaluate model and agent changes against datasets before release.",
  },
  {
    title: "Retain execution history",
    body: "keep traces of AI executions as evidence for supervisory and regulatory reviews.",
  },
  {
    title: "Flag potential policy violations",
    body: "with evals that score outputs against your policies and regulations.",
  },
  {
    title: "Self-host or air-gap",
    body: "deploy with no internet access, lock to internal users via VPN to cater for data sensitivity needs.",
  },
] as const;

export const financialServicesLogoNames = [
  "Trade Republic",
  "SumUp",
  "Ramp",
  "Merck",
] as const;

export const financialServicesFeaturedStory = {
  company: "Merck",
  href: "/users/merckgroup",
  quote:
    "Generative AI will only earn enterprise trust when we can see what's happening under the hood. Langfuse enables us to track every prompt, response, cost, and latency in real time, turning black-box models into auditable, optimizable assets.",
  author: "Walid Mehanna",
  role: "Chief Data & AI Officer at Merck",
  stats: [
    { value: "80+", label: "use cases" },
    { value: "200+", label: "builders" },
    {
      value: "API",
      label:
        "provisioning automated against the Langfuse API from an internal portal",
    },
  ],
} as const;

export const financialServicesStoryCards = [
  {
    company: "Trade Republic",
    route: "/users/trade-republic",
    category: "Self-hosted",
    description:
      "How a European neobroker runs self-hosted Langfuse in production.",
  },
  {
    company: "Ramp",
    route: "/users/ramp",
    category: "Spend management",
    description: "How Ramp auto-improves agents on Langfuse.",
  },
  {
    company: "DKB",
    route: "/users/dkb",
    category: "Banking",
    description: "How DKB automates 20,000 customer conversations daily.",
    logo: "/images/customers/dkb/dkb-light.svg",
    logoDark: "/images/customers/dkb/dkb-dark.svg",
    published: false,
  },
] as const;

export const financialServicesTrustPoints = [
  {
    title: "Deployment where your data must stay",
    body: "Langfuse Cloud in the EU, US or Japan, self-hosted in your VPC, or fully air-gapped.",
  },
  {
    title: "Multiple layers of data redaction",
    body: "Client-side and server-side PII protections before anything is stored.",
  },
  {
    title: "Enterprise access controls",
    body: "SSO and role-based access control scoped to organizations and projects.",
  },
  {
    title: "Audit logs",
    body: "Record both LLM activity and developer actions for internal and supervisory review.",
  },
] as const;

export const financialServicesDeploymentModes = [
  {
    id: "cloud" as const,
    label: "Cloud",
    title: "Managed cloud in the EU, US or Japan.",
    flow: ["Your app", "OTel SDK", "Langfuse Cloud · EU"],
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
  path: "credit-onboarding / traces /",
  duration: "8.42s",
  cost: "$0.031",
  tokens: "14.2k tokens",
  reasons: [
    { label: "Bureau score 642 < 650", span: 3 },
    { label: "1 delinquency in 24m", span: 3 },
    { label: "Summary: refer", span: 4 },
    { label: "Policy check: pass", span: 5 },
  ],
  scores: [
    { k: "policy_compliance", v: "PASS · 1.00", tone: "success" as const },
    { k: "pii_redacted", v: "PASS", tone: "success" as const },
    { k: "decision_drift_7d", v: "0.04", tone: "neutral" as const },
    { k: "human_review", v: "queued", tone: "warning" as const },
  ],
  audit: [
    { t: "09:14:02", e: "trace tr_8f2c41e9 ingested" },
    { t: "09:14:03", e: "eval policy-compliance → PASS" },
    { t: "09:14:03", e: "eval pii-redaction → PASS" },
    { t: "09:20:41", e: "m.weber (risk) viewed trace" },
    { t: "09:22:10", e: 'annotation added: "refer confirmed"' },
  ],
  spans: [
    {
      name: "credit-onboarding-agent",
      type: "agent",
      label: "trace",
      dur: "8.42s",
      indent: 0,
      left: 0,
      width: 100,
      io: 'input:  { applicant_id: "ap_20931", product: "consumer_credit", amount_eur: 12000 }\noutput: { decision: "refer", risk_band: "B2", reasons: 3 }',
    },
    {
      name: "identity.verify",
      type: "tool",
      label: "tool call",
      dur: "1.31s",
      indent: 14,
      left: 1,
      width: 15,
      io: 'input:  { name: "<REDACTED:NAME>", iban: "<REDACTED:IBAN>" }\noutput: { kyc_status: "verified", confidence: 0.97 }',
    },
    {
      name: "fraud.screen",
      type: "tool",
      label: "tool call",
      dur: "1.86s",
      indent: 14,
      left: 16,
      width: 22,
      io: 'input:  { device_id: "<REDACTED>", ip_geo: "DE" }\noutput: { fraud_score: 0.08, flags: [] }',
    },
    {
      name: "credit_bureau.lookup",
      type: "tool",
      label: "tool call",
      dur: "3.54s",
      indent: 14,
      left: 18,
      width: 42,
      io: 'input:  { applicant_ref: "<REDACTED:ID>" }\noutput: { bureau_score: 642, open_lines: 4, delinquencies_24m: 1 }',
    },
    {
      name: "risk-summary",
      type: "llm",
      label: "generation · prompt v14 · production",
      dur: "2.37s",
      indent: 14,
      left: 60,
      width: 28,
      io: 'model:  gpt-4.1  ·  prompt: risk-summary@v14\noutput: "Refer to underwriter. Bureau score below auto-approve\n         threshold (650); one delinquency in 24m; KYC verified."',
    },
    {
      name: "policy-compliance",
      type: "eval",
      label: "llm-as-a-judge",
      dur: "0.61s",
      indent: 28,
      left: 88,
      width: 8,
      io: "policy: consumer-credit-policy-2026.pdf  ·  §4.2 adverse factors\nresult: PASS: decision cites adverse factors, no protected\n        attributes referenced.",
    },
    {
      name: "pii-redaction",
      type: "eval",
      label: "deterministic check",
      dur: "0.04s",
      indent: 28,
      left: 96,
      width: 4,
      io: "masked: 4 fields (name, iban, device_id, applicant_ref)\nresult: PASS: no raw PII in stored trace.",
    },
  ],
};

export const financialServicesEvalWorkflows = [
  {
    title: "Offline evaluation",
    body: "Fail the pull request when a change regresses against your golden dataset.",
    href: "/docs/evaluation/get-started/offline",
  },
  {
    title: "Online evaluation",
    body: "Score live traffic and alert Slack or GitHub when quality drifts.",
    href: "/docs/evaluation/get-started/online",
  },
  {
    title: "Human review",
    body: "Send failures to domain experts and fold them into the regression set.",
    href: "/docs/evaluation/evaluation-methods/annotation-queues",
  },
] as const;

export const financialServicesEvalSupporting = [
  {
    title: "Judge calibration",
    href: "/docs/evaluation/scores/score-analytics",
  },
  {
    title: "prompt governance",
    href: "/docs/prompt-management/features/prompt-version-control",
  },
  {
    title: "redaction",
    href: "/docs/observability/features/masking",
  },
  {
    title: "access controls",
    href: "/docs/administration/rbac",
  },
  {
    title: "self-hosting",
    href: "/self-hosting",
  },
] as const;

export const financialServicesUseCases = [
  {
    area: "Compliance",
    title: "Compliance monitoring",
    description:
      "Run evals that check AI outputs against loaded regulations and policies. Catch non-compliant responses across back-office and customer-facing flows before they ship.",
  },
  {
    area: "Compliance",
    title: "AML (anti-money laundering)",
    description:
      "Support anomaly detection and investigation workflows — reduce cost of service and risk with better observability of agent/tool behavior.",
  },
  {
    area: "Investing",
    title: "AI-powered advisory",
    description:
      "Observe multi-step advisory flows, score outcomes, and keep an audit trail suitable for model risk review.",
  },
  {
    area: "Risk",
    title: "Credit onboarding & underwriting",
    description:
      "Trace agents that combine identity, fraud and credit-bureau checks into a risk summary. Score decisions, flag drift, and keep the auditable trail that credit and model risk teams require.",
    featured: true,
  },
  {
    area: "Support",
    title: "Customer support agents in Financial Services",
    description:
      "Raise autonomy rate of AI support agents: the share of cases resolved without human intervention. Trace edge cases, score good/bad runs, and iterate so agents cover more of the long tail safely.",
    proof: "DKB · 20,000 conversations / day",
    featured: true,
  },
  {
    area: "Support",
    title: "Voice AI / customer intake",
    description:
      "Use Langfuse to decrease latency and monitor voice agent quality and resolution.",
  },
  {
    area: "Engineering",
    title: "Govern coding agents across the whole engineering organization",
    description:
      "Trace Claude Code, Codex, Cursor, GitHub Copilot, and the OpenAI Agents SDK with per-developer setup in minutes and no proxy or gateway in the way. See cost per developer, project, and model, analyze which tools run, fail, or precede abandoned sessions, reconstruct any session end to end, and search across sessions to find who used a given API or pattern.",
    href: "/coding-agents",
  },
  {
    area: "Research",
    title: "Research & enterprise knowledge search",
    description:
      "Build long-running agents for stock/portfolio research and B2B knowledge work. Optimize tool selection, knowledge-base coverage, and output quality: speed up, quality up, cost down.",
  },
  {
    area: "Operations",
    title: "Internal process optimization",
    description:
      "Instrument internal copilots and workflow agents so operations teams can improve quality while controlling cost and risk.",
  },
] as const;

export const financialServicesFaqs: FAQItem[] = [
  {
    question:
      "Can we deploy Langfuse in our own cloud or an air-gapped environment?",
    answer:
      "Yes. You can deploy Langfuse in your own cloud, VPC, or on-premises infrastructure. Langfuse supports deployments without public internet access (air-gapped); features such as LLM-as-a-judge evaluations need a model endpoint reachable within your environment. Our team can help you assess the setup for your deployment and security requirements. [Self-hosting](/self-hosting), [networking documentation](/self-hosting/security/networking).",
  },
  {
    question: "How can we prevent sensitive data from reaching Langfuse?",
    answer:
      "Configure SDK masking to remove or replace sensitive inputs, outputs, and metadata before trace data leaves your application. You can also apply masking centrally through an OpenTelemetry Collector within your infrastructure. Combine these controls with project separation and role-based access to determine which teams can access the data you choose to retain. [Masking](/docs/observability/features/masking), [access controls](/docs/administration/rbac).",
  },
  {
    question: "Does Langfuse sit in the inference path?",
    answer:
      "Langfuse's observability integrations collect and export traces in the background while your application continues to call its model provider or gateway. You do not need to route model requests through Langfuse to use observability. If you also use prompt management, SDK caching and fallback prompts help keep your application resilient to connectivity issues. [Background export](/docs/observability/features/queuing-batching), [prompt availability](/docs/prompt-management/features/guaranteed-availability).",
  },
  {
    question:
      "How does Langfuse work with our AI gateway and existing observability tools?",
    answer:
      "Langfuse integrates with gateways such as Kong and LiteLLM to capture model calls, token usage, cost, and latency. Its OpenTelemetry support lets you add AI tracing and evaluation alongside your existing observability stack. [Gateway integrations](/integrations/gateways/kong-ai-plugin), [LiteLLM](/integrations/gateways/litellm), [existing OpenTelemetry setups](/faq/all/existing-otel-setup). We're also working on our own Langfuse Gateway, bringing model access controls together with tracing and cost tracking. It is currently in development; follow our [roadmap](/docs/roadmap) for updates.",
  },
  {
    question: "How do retention and exports support our evidence requirements?",
    answer:
      "Configure retention policies per project and schedule exports of observations and evaluation scores to your own Amazon S3, Google Cloud Storage, or Azure Blob Storage. This lets you preserve exported records under your institution's storage and retention policies. Set up exports before data expires, as data deleted by retention policies cannot be recovered. [Data retention](/docs/administration/data-retention), [scheduled exports](/docs/api-and-data-platform/features/export-to-blob-storage).",
  },
  {
    question:
      "How do Langfuse Cloud and Self-Hosted Enterprise differ in pricing and features?",
    answer:
      "Langfuse Cloud is fully managed, with subscription plans and usage-based pricing. Self-Hosted Enterprise runs in your infrastructure, with enterprise administration features and support under a custom commercial agreement; your team operates the deployment. Both Enterprise options include unlimited users. Talk to us to compare features, support, and total costs for your requirements. [Cloud pricing](/pricing), [Self-Hosted Enterprise pricing](/pricing-self-host).",
  },
];
