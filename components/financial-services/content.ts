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
    title: "Never in the inference path",
    body: "Langfuse observes your model and tool calls; it does not proxy them.",
  },
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
  label: "credit-onboarding",
  outcome: "Application referred to an underwriter",
  detail: "Bureau score 642 · Summary: refer · Human review queued",
  spans: [
    {
      name: "credit-onboarding-agent",
      type: "agent" as const,
      indent: false,
      offset: "0%",
      width: "100%",
      highlight: false,
    },
    {
      name: "identity.verify",
      type: "tool" as const,
      indent: true,
      offset: "2%",
      width: "16%",
      highlight: false,
    },
    {
      name: "fraud.screen",
      type: "tool" as const,
      indent: true,
      offset: "18%",
      width: "22%",
      highlight: false,
    },
    {
      name: "credit_bureau.lookup",
      type: "tool" as const,
      indent: true,
      offset: "20%",
      width: "40%",
      highlight: false,
    },
    {
      name: "risk-summary",
      type: "llm" as const,
      indent: true,
      offset: "62%",
      width: "28%",
      highlight: true,
    },
    {
      name: "policy-compliance",
      type: "eval" as const,
      indent: true,
      offset: "90%",
      width: "10%",
      highlight: false,
    },
  ],
};

export const financialServicesEvalCapabilities = [
  {
    title: "Offline evaluation",
    body: "golden datasets built from production traces, versioned experiments with baseline comparison, and a release gate that fails the pull request on regression.",
  },
  {
    title: "Online evaluation",
    body: "deterministic sampling of live traffic, LLM-as-judge and code evaluators, and threshold alerts to Slack, webhooks, or GitHub Actions when quality drifts.",
  },
  {
    title: "Human review",
    body: "annotation queues for subject-matter experts, corrected outputs, and one-click promotion of failures into a permanent regression set.",
  },
  {
    title: "Judge calibration",
    body: "Score Analytics measures agreement between human labels and model judges (Cohen's Kappa, F1, Pearson, Spearman) so you can defend the judge to model risk.",
  },
  {
    title: "Prompt governance",
    body: "immutable versions, staging and production labels, protected labels for separation of duties, and full audit history.",
  },
  {
    title: "Gateway and model integration",
    body: "OTLP ingest from your AI gateway, judge models pinned to your own Bedrock, Azure OpenAI, Vertex, or OpenAI connection.",
  },
  {
    title: "Redaction",
    body: "masking in the SDK before data leaves your application, with trace structure preserved for debugging.",
  },
  {
    title: "Administration",
    body: "organizations and projects as the data boundary, project-level RBAC, OIDC SSO with domain enforcement, SCIM provisioning, audit logs, and a metrics API for chargebacks.",
  },
  {
    title: "Dashboards as code",
    body: "dashboards and widgets managed through the API and CLI, versioned in Git, deployed identically to dev, staging, and prod.",
  },
  {
    title: "Operations",
    body: "documented self-hosting on AWS with Terraform and Helm, a published release cadence, and autoscaling guidance.",
  },
] as const;

export const financialServicesUseCases = [
  {
    area: "Compliance",
    title: "Compliance monitoring",
    icon: "shield-check" as const,
    description:
      "Run evals that check AI outputs against loaded regulations and policies. Catch non-compliant responses across back-office and customer-facing flows before they ship.",
  },
  {
    area: "Compliance",
    title: "AML (anti-money laundering)",
    icon: "search" as const,
    description:
      "Support anomaly detection and investigation workflows — reduce cost of service and risk with better observability of agent/tool behavior.",
  },
  {
    area: "Investing",
    title: "AI-powered advisory",
    icon: "line-chart" as const,
    description:
      "Observe and improve multi-step advisory flows, score outcomes, and keep an audit trail suitable for model risk review. Evaluate your system on representative cases before it runs in production.",
  },
  {
    area: "Risk",
    title: "Credit onboarding & underwriting",
    icon: "clipboard-check" as const,
    description:
      "Trace agents that combine identity, fraud and credit-bureau checks into a risk summary. Score decisions, flag drift, and keep the auditable trail that credit and model risk teams require.",
    featured: true,
  },
  {
    area: "Support",
    title: "Customer support agents in Financial Services",
    icon: "messages-square" as const,
    description:
      "Raise autonomy rate of AI support agents: the share of cases resolved without human intervention. Trace edge cases, score good/bad runs, and iterate so agents cover more of the long tail safely.",
    proof: "DKB · 20,000 conversations / day",
    featured: true,
  },
  {
    area: "Engineering",
    title: "Govern coding agents across the whole engineering organization",
    icon: "code-2" as const,
    description:
      "Trace Claude Code, Codex, Cursor, OpenCode, and GitHub Copilot with per-developer setup in minutes and no proxy or gateway in the way. See cost per developer, project, and model, analyze which tools run, fail, or precede abandoned sessions, reconstruct any session end to end, and search across sessions.",
    href: "/coding-agents",
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
