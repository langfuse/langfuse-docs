---
title: Langfuse for healthcare and life sciences
description: Observe and evaluate AI agents that handle patient data, on Langfuse's HIPAA-ready cloud region or your own infrastructure.
---

# Langfuse for healthcare and life sciences

Observe and evaluate AI agents that handle patient data. Use Langfuse's HIPAA-ready cloud region or your own infrastructure. For healthcare and life sciences teams.

[Get started](/cloud)

- **HIPAA-ready cloud region with a self-serve BAA:** Sign the ClickHouse BAA, then send PHI only to the dedicated US region.
- **Self-host so patient data never leaves your network:** Run Langfuse in your VPC or in an air-gapped environment.
- **Clinician or domain expert review in platform:** Send traces and dataset items to annotation queues for clinicians or domain experts to review, correct, and pinpoint failure modes.
- **Quality gates and evidence for audits:** Evaluate changes with datasets and experiments before going live, and keep traces and scores for review.
- **One platform for every AI team:** Orchestrate one platform for tracing, evals, and cost tracking across teams. Govern centrally across the org.

[ISO 27001](/security/iso27001) · [SOC 2](/security/soc2) · [GDPR](/security/gdpr) · [HIPAA](/security/hipaa) · [HIPAA-ready · BAA available](/security/hipaa) · [MIT · open source](/handbook/chapters/open-source) · [Security & compliance](/security)

## Talk to a healthcare and life sciences expert at Langfuse

Use the contact form on this page to talk to a healthcare and life sciences expert at Langfuse.

Used by **21** of the Fortune 50 · **90B+** observations/month · **100,000+** engineers building on Langfuse.

### [Merck Group](/users/merckgroup)

> “Generative AI will only earn enterprise trust when we can see what's happening under the hood. Langfuse enables us to track every prompt, response, cost, and latency in real time, turning black-box models into auditable, optimizable assets.”
>
> Walid Mehanna, Chief Data & AI Officer at Merck

- **200+** users, engineers, PMs and domain experts
- **80+** use cases built on Langfuse
- **1** central platform team

## Run Langfuse where patient data is allowed to live

1. **[HIPAA-ready cloud region](/security/hipaa).** A separate US region for healthcare and life sciences workloads. Sign the ClickHouse BAA before you send PHI.
2. **[Self-host or air-gap](/self-hosting).** Run Langfuse in your own network, including a deployment with no internet access. Patient data stays there.
3. **[Masking](/docs/observability/features/masking).** Remove or replace PHI in inputs, outputs, and metadata before it is stored.
4. **[Access controls](/docs/administration/rbac).** SSO and role-based access scoped to organizations and projects.
5. **[Audit logs](/docs/administration/audit-logs).** Record prompt changes, membership changes, and other admin actions, with the user or API key that made the change.

### [HIPAA cloud](/security/hipaa)

HIPAA-ready region in the US. BAA available.

- Region: US · Oregon
- Location: AWS us-west-2
- Agreement: BAA available
- Plans: Pro or higher

### [Self-host](/self-hosting)

Run Langfuse in your own network.

- Infra: Kubernetes · Docker
- Storage: ClickHouse · Postgres · S3
- Access: SSO · VPN-only
- Patient data: Stays in your network

### [Air-gapped](/self-hosting/security/networking)

No internet access. No vendor access.

- Outbound traffic: None
- Langfuse support access: None
- Users: Internal only, via VPN
- Updates: Offline image transfer

## Prove it works before patients are impacted by your agents

Evaluate agents or datasets before release. Have clinicians and domain experts review the results and check that your AI judges agree with those labels.

### Evaluate before release and in production

Offline evals, clinician or domain expert review, judge calibration, and production checks.

- **[Offline evals with release gates](/docs/evaluation/experiments/experiments-ci-cd):** Run a dataset experiment on each change. Fail the release when a score drops below your threshold.
- **[Clinician or domain expert review](/docs/evaluation/evaluation-methods/annotation-queues):** Annotation queues are an in-app review flow. Clinicians or domain experts label traces and can save a corrected output before a release.
- **[Calibrate AI judges](/docs/evaluation/scores/score-analytics):** Score Analytics compares AI judge scores with clinician or domain expert labels. Agreement metrics include Cohen's Kappa, F1, Pearson, and Spearman.
- **Compliance and quality checks on production traces:** Run compliance and quality checks with automated evaluators on production traces. [Code evaluators](/docs/evaluation/evaluation-methods/code-evaluators), [Decision model evaluators](/docs/evaluation/evaluation-methods/decision-models).

### Govern AI systems

Control prompts, protect data, and manage access.

- **[Prompt governance](/docs/prompt-management/features/prompt-version-control):** Keep immutable prompt versions. Use labels for staging and production, and protect the production label.
- **[Masking](/docs/observability/features/masking):** Mask inputs, outputs, and metadata in the SDK before trace data leaves your application.
- **[Access controls](/docs/administration/rbac):** Organizations and projects are the data boundary. Role-based access limits who can open a project.
- **[Retention](/docs/administration/data-retention):** Set a retention window per project. Export observations and scores to your own bucket when you need a longer archive.

## What healthcare and life sciences teams build on Langfuse.

### Patient support and intake

Write, trace, and monitor agents that answer patient questions and collect intake data. Score answers and review cases. Clinicians and domain experts review cases to build ground truth.

### Appointment booking

Observe agents that book and change appointments. Catch failed tool calls and wrong bookings, and test them on representative cases before they go live.

### [Medical information](/users/merckgroup)

Companies like Merck Group build agents that use medical insights to draft answers, and trace them on Langfuse. Merck Group does this with Generative Medical Insights.

Merck Group · Generative Medical Insights

### Clinical documentation

Observe and improve agents that draft clinical notes from visits and conversations.

### Payer and claims workflows

Catch failing executions in production and evaluate changes before they go live. Keep traces for audit.

### [Voice agents](/users/evolve)

Trace and evaluate voice agents across speech, transcripts, and model calls. Companies like Evolve trace assistive agents such as Rest, and improve them in annotation queues.

Evolve · Rest sleep coach

### [Internal platform teams](/users/merckgroup)

Companies like Merck Group give AI teams one platform for traces, prompts, and evaluations. Merck Group's platform team serves 80+ use cases on Langfuse.

Merck Group · 80+ use cases

## Learn how to ship reliable agents in healthcare and life sciences

Start with datasets and release gates. Then read how Merck Group and Evolve use Langfuse.

- [Building deployment gates for LLMs](/blog/2026-07-15-llm-certification-financial-services): Evaluate model and prompt changes against datasets before release.
- [Academy: designing datasets](/academy/datasets/designing-great-datasets): Design ground-truth datasets with clear inputs, expected outputs, and a review rubric.
- [Merck Group customer story](/users/merckgroup): How Merck Group serves 80+ AI teams on self-hosted Langfuse.
- [Evolve customer story](/users/evolve): How Evolve traces and evaluates Rest, a voice-and-text sleep coach.

## FAQ [#faq]

### How do I get a BAA with Langfuse?

Create a fresh Langfuse Cloud account in the HIPAA-ready region. The region runs in Oregon (AWS us-west-2) at [hipaa.cloud.langfuse.com](https://hipaa.cloud.langfuse.com). Subscribe to the [Pro plan or higher](/pricing). [Complete and sign the ClickHouse Business Associate Agreement via Ironclad](https://ironcladapp.com/public-launch/6aa89377853bdf7f289e7139) before you process PHI. That form is the ClickHouse BAA for Langfuse HIPAA Cloud. It asks for your Langfuse organization ID. [Where to find the organization ID](https://clickhouse.com/legal/how-to-find-langfuseorgid). Send HIPAA-regulated data only to that region. It is separate from the EU, US, and Japan regions. In a self-hosted deployment, Langfuse does not receive or process your data, so no BAA with Langfuse is involved. You implement the HIPAA safeguards in your own environment. [HIPAA docs](/security/hipaa).

### How do I keep PHI out of traces?

Configure SDK masking to remove or replace sensitive inputs, outputs, and metadata before trace data leaves your application. You can also apply masking in an OpenTelemetry Collector inside your infrastructure. Self-hosted Enterprise can mask again during ingestion. [SDK masking](/docs/observability/features/masking), [server-side masking](/self-hosting/security/data-masking).

### Which plan includes HIPAA?

Eligible plans are the Pro plan or higher, in the HIPAA-ready region. Customers on those plans can sign a BAA before they process PHI. [HIPAA docs](/security/hipaa), [Cloud pricing](/pricing).

### Is Langfuse in the inference path?

Langfuse's observability integrations collect and export traces in the background while your application continues to call its model provider or gateway. You do not need to route model requests through Langfuse to use observability. If you also use prompt management, SDK caching and fallback prompts help keep your application resilient to connectivity issues. [Background export](/docs/observability/features/queuing-batching), [prompt availability](/docs/prompt-management/features/guaranteed-availability).

### Can AI judges run on models inside our network?

Yes, on a self-hosted deployment. LLM-as-a-judge calls the model in an LLM connection. Point that connection at a model endpoint inside your network, and allow the host in the self-hosted LLM connection settings. On Langfuse Cloud, the connection base URL has to be a public HTTPS endpoint. [LLM connections](/docs/administration/llm-connection), [self-hosted LLM API](/self-hosting/deployment/infrastructure/llm-api).

[Ask anything else](/docs/ask-ai)

## Working on AI in healthcare and life sciences?

Talk through the HIPAA-ready region, self-hosting, and how Merck Group and Evolve use Langfuse.

- [Start free](/cloud)
- [Documentation](/docs)
- [Talk to an expert](/talk-to-us)
