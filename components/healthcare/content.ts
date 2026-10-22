import type { FAQItem } from "@/components/shared/FAQAccordion";

// TODO(healthcare-review): Open items for marketing review. Do not resolve in this PR.
// (a) Which plan includes HIPAA? This page follows the HIPAA docs: "Pro plan or higher."
//     The Pro pricing card says "HIPAA-ready region". The pricing table rows "Data region"
//     and "HIPAA-ready region" currently include Pro and Enterprise. The pricing FAQ
//     "Where is the data stored?" still says Enterprise customers can choose a
//     HIPAA-compliant US region. Confirm one public answer.
// (b) Legal review before naming clinical use cases. See the medical information and
//     clinical documentation entries below.
// (c) Audit logs are Enterprise only on Cloud and Enterprise Edition when self-hosted
//     (docs and pricing table). The HIPAA region starts at Pro. Do not describe audit
//     logs as included with the HIPAA region.
// (d) Logo rights. This page uses Merck Group and Evolve only, from published stories.
//     Do not add other healthcare logos until rights are confirmed. Public /users
//     mentions that were not added: Bayer, Johns Hopkins University, Moderna, Sanofi.

export const healthcareReasons = [
  {
    title: "HIPAA-ready cloud region with a self-serve BAA",
    body: "Sign the ClickHouse BAA, then send PHI only to the dedicated US region.",
  },
  {
    title: "Self-host so patient data never leaves your network",
    body: "Run Langfuse in your VPC or in an air-gapped environment.",
  },
  {
    title: "Clinician or domain expert review before release",
    body: "Send traces and dataset items to annotation queues for clinicians or domain experts.",
  },
  {
    title: "Quality gates and evidence for audits",
    body: "Test changes on datasets, and keep traces and scores for review.",
  },
  {
    title: "One platform for every AI team",
    body: "Share traces, prompts, and evaluations across the teams that build agents.",
  },
] as const;

export const healthcareFeaturedStory = {
  company: "Merck Group",
  href: "/users/merckgroup",
  quote:
    "Generative AI will only earn enterprise trust when we can see what's happening under the hood. Langfuse enables us to track every prompt, response, cost, and latency in real time, turning black-box models into auditable, optimizable assets.",
  author: "Walid Mehanna",
  role: "Chief Data & AI Officer at Merck",
  stats: [
    {
      value: "200+",
      label: "users, engineers, PMs and domain experts",
    },
    { value: "80+", label: "use cases built on Langfuse" },
    { value: "1", label: "central platform team" },
  ],
} as const;

export const healthcareStoryCards = [
  {
    company: "Merck Group",
    route: "/users/merckgroup",
    category: "Life sciences",
    description:
      "How Merck Group serves 80+ AI teams on self-hosted Langfuse, including Generative Medical Insights.",
  },
  {
    company: "Evolve",
    route: "/users/evolve",
    category: "Health",
    description:
      "How Evolve traces and evaluates Rest, a voice-and-text sleep coach, on Langfuse.",
  },
] as const;

export const healthcareTrustPoints = [
  {
    title: "HIPAA-ready cloud region",
    body: "A separate US region for healthcare and life sciences workloads. Sign the ClickHouse BAA before you send PHI.",
    href: "/security/hipaa",
  },
  {
    title: "Self-host or air-gap",
    body: "Run Langfuse in your own network, including a deployment with no internet access. Patient data stays there.",
    href: "/self-hosting",
  },
  {
    title: "Masking",
    body: "Remove or replace PHI in inputs, outputs, and metadata before it is stored.",
    href: "/docs/observability/features/masking",
  },
  {
    title: "Access controls",
    body: "SSO and role-based access scoped to organizations and projects.",
    href: "/docs/administration/rbac",
  },
  {
    // TODO(healthcare-review): (c) Audit logs are Enterprise only. Do not claim they come with the HIPAA region.
    title: "Audit logs",
    body: "Record prompt changes, membership changes, and other admin actions, with the user or API key that made the change.",
    href: "/docs/administration/audit-logs",
  },
] as const;

export const healthcareDeploymentModes = [
  {
    id: "hipaa" as const,
    label: "HIPAA cloud",
    title: "HIPAA-ready region in the US. BAA available.",
    href: "/security/hipaa",
    flow: ["Your app", "OTel SDK", "HIPAA region"],
    specs: [
      { k: "Region", v: "US · Oregon" },
      { k: "Location", v: "AWS us-west-2" },
      { k: "Agreement", v: "BAA available" },
      // TODO(healthcare-review): (a) "Pro or higher" follows the HIPAA docs. See the file-level note.
      { k: "Plans", v: "Pro or higher" },
    ],
  },
  {
    id: "self-host" as const,
    label: "Self-host",
    title: "Run Langfuse in your own network.",
    href: "/self-hosting",
    flow: ["Your app", "OTel SDK", "Langfuse · your network"],
    specs: [
      { k: "Infra", v: "Kubernetes · Docker" },
      { k: "Storage", v: "ClickHouse · Postgres · S3" },
      { k: "Access", v: "SSO · VPN-only" },
      { k: "Patient data", v: "Stays in your network" },
    ],
  },
  {
    id: "air-gapped" as const,
    label: "Air-gapped",
    title: "No internet access. No vendor access.",
    href: "/self-hosting/security/networking",
    flow: ["Your app", "OTel SDK", "Langfuse · isolated"],
    specs: [
      { k: "Outbound traffic", v: "None" },
      { k: "Langfuse support access", v: "None" },
      { k: "Users", v: "Internal only, via VPN" },
      { k: "Updates", v: "Offline image transfer" },
    ],
  },
];

export const healthcareEvalColumns = [
  {
    title: "Evaluate before release and in production",
    summary:
      "Offline evals, clinician or domain expert review, judge calibration, and production checks.",
    items: [
      {
        title: "Offline evals with release gates",
        body: "Run a dataset experiment on each change. Fail the release when a score drops below your threshold.",
        href: "/docs/evaluation/experiments/experiments-ci-cd",
      },
      {
        title: "Clinician or domain expert review",
        body: "Annotation queues are an in-app review flow. Clinicians or domain experts label traces and can save a corrected output before a release.",
        href: "/docs/evaluation/evaluation-methods/annotation-queues",
      },
      {
        title: "Calibrate AI judges",
        body: "Score Analytics compares AI judge scores with clinician or domain expert labels. Agreement metrics include Cohen's Kappa, F1, Pearson, and Spearman.",
        href: "/docs/evaluation/scores/score-analytics",
      },
      {
        title: "Compliance and quality checks on production traces",
        body: "Run compliance and quality checks with automated evaluators on production traces.",
        href: "/docs/evaluation/evaluation-methods/code-evaluators",
        links: [
          {
            href: "/docs/evaluation/evaluation-methods/code-evaluators",
            label: "Code evaluators",
          },
          {
            href: "/docs/evaluation/evaluation-methods/decision-models",
            label: "Decision model evaluators",
          },
        ],
      },
    ],
  },
  {
    title: "Govern AI systems",
    summary: "Control prompts, protect data, and manage access.",
    items: [
      {
        title: "Prompt governance",
        body: "Keep immutable prompt versions. Use labels for staging and production, and protect the production label.",
        href: "/docs/prompt-management/features/prompt-version-control",
      },
      {
        title: "Masking",
        body: "Mask inputs, outputs, and metadata in the SDK before trace data leaves your application.",
        href: "/docs/observability/features/masking",
      },
      {
        title: "Access controls",
        body: "Organizations and projects are the data boundary. Role-based access limits who can open a project.",
        href: "/docs/administration/rbac",
      },
      {
        title: "Retention",
        body: "Set a retention window per project. Export observations and scores to your own bucket when you need a longer archive.",
        href: "/docs/administration/data-retention",
      },
    ],
  },
] as const;

type HealthcareUseCase = {
  area: string;
  title: string;
  icon:
    | "messages-square"
    | "calendar"
    | "file-text"
    | "clipboard-pen"
    | "receipt"
    | "mic"
    | "users";
  description: string;
  proof?: string;
  featured?: boolean;
  href?: string;
};

export const healthcareUseCases: readonly HealthcareUseCase[] = [
  {
    area: "Support",
    title: "Patient support and intake",
    icon: "messages-square",
    description:
      "Trace agents that answer patient questions and collect intake details. Score answers, and review the cases a clinician or domain expert flags.",
  },
  {
    area: "Access",
    title: "Appointment booking",
    icon: "calendar",
    description:
      "Trace agents that book and change appointments. Test them on representative requests before they go live.",
  },
  {
    // TODO(healthcare-review): (b) Legal review of the name "medical information" before publish.
    area: "Life sciences",
    title: "Medical information",
    icon: "file-text",
    description:
      "Help medical information teams draft answers to questions from healthcare professionals. Merck Group uses Generative Medical Insights on Langfuse for this work.",
    proof: "Merck Group · Generative Medical Insights",
    href: "/users/merckgroup",
  },
  {
    // TODO(healthcare-review): (b) Legal review of the name "clinical documentation" before publish.
    area: "Care delivery",
    title: "Clinical documentation",
    icon: "clipboard-pen",
    description:
      "Trace agents that draft clinical notes from visits and conversations. Review samples with clinicians or domain experts before release.",
  },
  {
    area: "Payers",
    title: "Payer and claims workflows",
    icon: "receipt",
    description:
      "Observe agents in claims and utilization workflows. Score the outputs and keep traces for audit.",
  },
  {
    area: "Voice",
    title: "Voice agents",
    icon: "mic",
    description:
      "Trace voice agents across speech, transcription, and the model call. Evolve traces its Rest sleep coach this way.",
    proof: "Evolve · Rest sleep coach",
    href: "/users/evolve",
    featured: true,
  },
  {
    area: "Platform",
    title: "Internal platform teams",
    icon: "users",
    description:
      "One platform for traces, prompts, and evaluations across AI teams. Merck Group's platform team serves 80+ use cases on Langfuse.",
    proof: "Merck Group · 80+ use cases",
    href: "/users/merckgroup",
    featured: true,
  },
];

export const healthcareFaqs: FAQItem[] = [
  {
    question: "How do I get a BAA with Langfuse?",
    answer:
      "Create a fresh Langfuse Cloud account in the HIPAA-ready region. The region runs in Oregon (AWS us-west-2) at [hipaa.cloud.langfuse.com](https://hipaa.cloud.langfuse.com). Subscribe to the [Pro plan or higher](/pricing). [Complete and sign the ClickHouse Business Associate Agreement via Ironclad](https://ironcladapp.com/public-launch/6aa89377853bdf7f289e7139) before you process PHI. That form is the ClickHouse BAA for Langfuse HIPAA Cloud. It asks for your Langfuse organization ID. [Where to find the organization ID](https://clickhouse.com/legal/how-to-find-langfuseorgid). Send HIPAA-regulated data only to that region. It is separate from the EU, US, and Japan regions. In a self-hosted deployment, Langfuse does not receive or process your data, so no BAA with Langfuse is involved. You implement the HIPAA safeguards in your own environment. [HIPAA docs](/security/hipaa).",
  },
  {
    question: "How do I keep PHI out of traces?",
    answer:
      "Configure SDK masking to remove or replace sensitive inputs, outputs, and metadata before trace data leaves your application. You can also apply masking in an OpenTelemetry Collector inside your infrastructure. Self-hosted Enterprise can mask again during ingestion. [SDK masking](/docs/observability/features/masking), [server-side masking](/self-hosting/security/data-masking).",
  },
  {
    // TODO(healthcare-review): (a) Answer follows the HIPAA docs. Pricing FAQ still says Enterprise. See the file-level note.
    question: "Which plan includes HIPAA?",
    answer:
      "Eligible plans are the Pro plan or higher, in the HIPAA-ready region. Customers on those plans can sign a BAA before they process PHI. [HIPAA docs](/security/hipaa), [Cloud pricing](/pricing).",
  },
  {
    question: "Is Langfuse in the inference path?",
    answer:
      "Langfuse's observability integrations collect and export traces in the background while your application continues to call its model provider or gateway. You do not need to route model requests through Langfuse to use observability. If you also use prompt management, SDK caching and fallback prompts help keep your application resilient to connectivity issues. [Background export](/docs/observability/features/queuing-batching), [prompt availability](/docs/prompt-management/features/guaranteed-availability).",
  },
  {
    question: "Can AI judges run on models inside our network?",
    answer:
      "Yes, on a self-hosted deployment. LLM-as-a-judge calls the model in an LLM connection. Point that connection at a model endpoint inside your network, and allow the host in the self-hosted LLM connection settings. On Langfuse Cloud, the connection base URL has to be a public HTTPS endpoint. [LLM connections](/docs/administration/llm-connection), [self-hosted LLM API](/self-hosting/deployment/infrastructure/llm-api).",
  },
];
