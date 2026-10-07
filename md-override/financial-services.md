---
title: Langfuse for financial services
description: Observe and evaluate AI agents across banks, brokers, and fintechs. Deployment gates, production traces, audit trails, and self-hosting for regulated teams.
---

# Langfuse for Financial Services

Observe and evaluate AI agents across your institution. Give engineering, platform, and risk teams visibility into production behavior, with deployment in Langfuse Cloud or your own infrastructure.

[Get started](/cloud)

- **Standardize observability and evals across teams:** Bring agents across frameworks, models, and gateways into a shared view of traces and evaluations.
- **Ship reliable agents with clear deployment quality gates:** evaluate model and agent changes against datasets before release.
- **Retain execution history:** keep traces of AI executions as evidence for supervisory and regulatory reviews.
- **Flag potential policy violations:** with evals that score outputs against your policies and regulations.
- **Self-host or air-gap:** deploy with no internet access, lock to internal users via VPN to cater for data sensitivity needs.

[ISO 27001](/security/iso27001) · [SOC 2](/security/soc2) · [GDPR](/security/gdpr) · [MIT · open source](/handbook/chapters/open-source) · [Government (available in Q4 2026)](/self-hosting/configuration/hardening#hardening-for-government) · [Security & compliance](/security)

## Talk to a financial services expert at Langfuse

Use the contact form on this page to talk to a financial services expert at Langfuse.

### [Merck](/users/merckgroup)

> “Generative AI will only earn enterprise trust when we can see what's happening under the hood. Langfuse enables us to track every prompt, response, cost, and latency in real time, turning black-box models into auditable, optimizable assets.”
>
> — Walid Mehanna, Chief Data & AI Officer at Merck

- **1** central platform team
- **80+** use cases built on Langfuse
- **200+** users, engineers, PMs and domain experts

### [How a European neobroker runs self-hosted Langfuse in production.](/users/trade-republic)

Customer story · Self-hosted. [Read story](/users/trade-republic)

### [How Ramp auto-improves agents on Langfuse.](/users/ramp)

Customer story · Spend management. [Read story](/users/ramp)

### How DKB automates 20,000 customer conversations daily.

Customer story · Banking. Coming soon

## Run Langfuse where your data is allowed to live

1. **[Never in the inference path](/docs/observability/features/queuing-batching).** Langfuse observes your model and tool calls; it does not proxy them.
2. **[Deployment where your data must stay](/security/data-regions).** Langfuse Cloud in the EU, US or Japan, self-hosted in your VPC, or fully air-gapped.
3. **[Multiple layers of data redaction](/docs/observability/features/masking).** Client-side and server-side PII protections before anything is stored.
4. **[Enterprise access controls](/docs/administration/rbac).** SSO and role-based access control scoped to organizations and projects.
5. **[Audit logs](/docs/administration/audit-logs).** Record both LLM activity and developer actions for internal and supervisory review.

### [Cloud](/security/data-regions)

Managed cloud in the EU, US or Japan.

- Regions: EU · US · JP
- Certifications: SOC 2 Type II · ISO 27001
- Data residency: Pinned to region
- Support: Enterprise SLA

### [Self-host](/self-hosting)

Run Langfuse in your own VPC.

- Infra: Kubernetes · Docker
- Storage: ClickHouse · Postgres · S3
- Access: SSO · VPN-only
- License: MIT core + Enterprise

### [Air-gapped](/self-hosting/security/networking)

No internet access. No vendor access.

- Outbound traffic: None
- Langfuse support access: None
- Users: Internal only, via VPN
- Updates: Offline image transfer

## Built for AI evaluation needs of financial institutions

Platform and risk teams in financial services are looking for a complete observability and eval suite. Langfuse covers the full surface, and we are open about where the work lives in your pipeline rather than in our UI.

### Evaluate AI quality

Test before release. Monitor production. Review with your experts.

- **[Offline evaluation](/docs/evaluation/get-started/offline):** Golden datasets built from production traces, versioned experiments with baseline comparison, and a release gate that fails the pull request on regression.
- **[Online evaluation](/docs/evaluation/get-started/online):** Deterministic sampling of live traffic, LLM-as-judge and code evaluators, and threshold alerts to Slack, webhooks, or GitHub Actions when quality drifts.
- **[Human review](/docs/evaluation/evaluation-methods/annotation-queues):** Annotation queues for subject-matter experts, corrected outputs, and one-click promotion of failures into a permanent regression set.
- **[Judge calibration](/docs/evaluation/scores/score-analytics):** Score Analytics measures agreement between human labels and model judges (Cohen's Kappa, F1, Pearson, Spearman) so you can defend the judge to model risk.

### Govern AI systems

Control changes, protect sensitive data, and manage access.

- **[Prompt governance](/docs/prompt-management/features/prompt-version-control):** Immutable versions, staging and production labels, protected labels for separation of duties, and full audit history.
- **[Redaction](/docs/observability/features/masking):** Masking in the SDK before data leaves your application, with trace structure preserved for debugging.
- **[Administration](/docs/administration/rbac):** Organizations and projects as the data boundary, project-level RBAC, OIDC SSO with domain enforcement, SCIM provisioning, audit logs, and a metrics API for chargebacks.

### Use your own stack

Connect your models and manage deployment in your infrastructure.

- **[Gateway & models](/docs/administration/llm-connection):** OTLP ingest from your AI gateway, judge models pinned to your own Bedrock, Azure OpenAI, Vertex, or OpenAI connection.
- **[Dashboards as code](/docs/metrics/features/custom-dashboards):** Dashboards and widgets managed through the API and CLI, versioned in Git, deployed identically to dev, staging, and prod.
- **[Operations](/self-hosting):** Documented self-hosting on AWS with Terraform and Helm, a published release cadence, and autoscaling guidance.

## What financial services teams build on Langfuse.

### Compliance monitoring

Run evals that check AI outputs against loaded regulations and policies. Catch non-compliant responses across back-office and customer-facing flows before they ship.

### AML (anti-money laundering)

Support anomaly detection and investigation workflows — reduce cost of service and risk with better observability of agent/tool behavior.

### AI-powered advisory

Observe and improve multi-step advisory flows, score outcomes, and keep an audit trail suitable for model risk review. Evaluate your system on representative cases before it runs in production.

### Credit onboarding & underwriting

Trace agents that combine identity, fraud and credit-bureau checks into a risk summary. Score decisions, flag drift, and keep the auditable trail that credit and model risk teams require.

### Customer support agents in Financial Services

Raise autonomy rate of AI support agents: the share of cases resolved without human intervention. Trace edge cases, score good/bad runs, and iterate so agents cover more of the long tail safely.

DKB · 20,000 conversations / day

### [Govern coding agents across the whole engineering organization](/coding-agents)

Trace Claude Code, Codex, Cursor, OpenCode, and GitHub Copilot — no proxy required. See cost per developer and model, replay failed sessions, and search across the org.

## Learn how to ship reliable agents in financial services

Start with deployment gates and execution history, then see how teams like Trade Republic run Langfuse in production.

- [Building deployment gates for LLMs](/blog/2026-07-15-llm-certification-financial-services): Evaluate model and prompt changes against datasets and policy evals before release.
- [Academy: customer support chatbot](/academy/examples/customer-support-chatbot): Trace, score and iterate on a support agent to raise its autonomy rate safely.
- [Trade Republic customer story](/users/trade-republic): How a European neobroker runs self-hosted Langfuse in production. Read or watch on YouTube.

## FAQ [#faq]

### Can we deploy Langfuse in our own cloud or an air-gapped environment?

Yes. You can deploy Langfuse in your own cloud, VPC, or on-premises infrastructure. Langfuse supports deployments without public internet access (air-gapped); features such as LLM-as-a-judge evaluations need a model endpoint reachable within your environment. Our team can help you assess the setup for your deployment and security requirements. [Self-hosting](/self-hosting), [networking documentation](/self-hosting/security/networking).

### How can we prevent sensitive data from reaching Langfuse?

Configure SDK masking to remove or replace sensitive inputs, outputs, and metadata before trace data leaves your application. You can also apply masking centrally through an OpenTelemetry Collector within your infrastructure. Combine these controls with project separation and role-based access to determine which teams can access the data you choose to retain. [Masking](/docs/observability/features/masking), [access controls](/docs/administration/rbac).

### Does Langfuse sit in the inference path?

Langfuse's observability integrations collect and export traces in the background while your application continues to call its model provider or gateway. You do not need to route model requests through Langfuse to use observability. If you also use prompt management, SDK caching and fallback prompts help keep your application resilient to connectivity issues. [Background export](/docs/observability/features/queuing-batching), [prompt availability](/docs/prompt-management/features/guaranteed-availability).

### How does Langfuse work with our AI gateway and existing observability tools?

Langfuse integrates with gateways such as Kong and LiteLLM to capture model calls, token usage, cost, and latency. Its OpenTelemetry support lets you add AI tracing and evaluation alongside your existing observability stack. [Gateway integrations](/integrations/gateways/kong-ai-plugin), [LiteLLM](/integrations/gateways/litellm), [existing OpenTelemetry setups](/faq/all/existing-otel-setup).

We're also working on our own Langfuse Gateway, bringing model access controls together with tracing and cost tracking. It is currently in development; follow our [roadmap](/docs/roadmap) for updates.

### How do retention and exports support our evidence requirements?

Configure retention policies per project and schedule exports of observations and evaluation scores to your own Amazon S3, Google Cloud Storage, or Azure Blob Storage. This lets you preserve exported records under your institution's storage and retention policies. Set up exports before data expires, as data deleted by retention policies cannot be recovered. [Data retention](/docs/administration/data-retention), [scheduled exports](/docs/api-and-data-platform/features/export-to-blob-storage).

### How do Langfuse Cloud and Self-Hosted Enterprise differ in pricing and features?

Langfuse Cloud is fully managed, with subscription plans and usage-based pricing. Self-Hosted Enterprise runs in your infrastructure, with enterprise administration features and support under a custom commercial agreement; your team operates the deployment. Both Enterprise options include unlimited users. Talk to us to compare features, support, and total costs for your requirements. [Cloud pricing](/pricing), [Self-Hosted Enterprise pricing](/pricing-self-host).

[Ask anything else](/docs/ask-ai)

## Working on AI in banking, insurance or capital markets?

Talk through deployment options, compliance needs, and how teams like Trade Republic use Langfuse in production.

- [Start free](/cloud)
- [Documentation](/docs)
- [Talk to an expert](/talk-to-us)
