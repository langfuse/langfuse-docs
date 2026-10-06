---
title: Langfuse for financial services
description: Observe and evaluate AI agents across banks, brokers, and fintechs. Deployment gates, production traces, audit trails, and self-hosting for regulated teams.
---

# Langfuse for financial services

Financial institutions handle personal and trusted information. AI can accelerate processes and improve service quality, but it has to meet a high bar for reliability and observability. Langfuse gives engineering, platform, and risk teams visibility into production agents — in Langfuse Cloud or on your own infrastructure.

- **Standardize observability and evals across teams.** Bring agents across frameworks, models, and gateways into a shared view of traces and evaluations.
- **Ship reliable agents with deployment quality gates.** Evaluate model and agent changes against datasets before release.
- **Retain execution history.** Keep traces of AI executions as evidence for supervisory and regulatory reviews.
- **Flag potential policy violations.** Score outputs against your policies and regulations with evaluators.
- **Self-host or air-gap.** Deploy with no internet access and lock access to internal users via VPN.

[SOC 2 Type II](/security/soc2) · [ISO 27001](/security/iso27001) · [GDPR](/security/gdpr) · [Self-hosting](/self-hosting) · [Hardening for government](/self-hosting/configuration/hardening#hardening-for-government)

[Talk to an expert](/talk-to-us) using the form on this page.

## Customers in financial services

Customers in financial services include Ramp, Intuit, SumUp, and Rocket Money.

### [SumUp](/users/sumup)

> “Building on Langfuse we saved 30% of external BPO cost by deflecting 50% of support conversations to AI.”
>
> — Ana Casado, Head of Operations Data and AI, SumUp

### [Ramp](/users/ramp)

> “We wanted something built for agents as users first. And that means API first. An agent should never get stuck waiting for a human because of a deficiency in the API. This is what Langfuse is.”
>
> — David Traina, Data Platform, Ramp

### [Trade Republic](/users/trade-republic)

> “We're using the open-source self-hosted version of Langfuse and we don't see any limitations there. We're super happy with it.”
>
> — Paolo Tamagnini, Senior Data Scientist, Trade Republic

## Every run traced, scored, and on the record

See load, behavior, and usage shifts early. Evals score outputs against your policies, and execution history is retained for supervisory and model risk review.

Illustrative credit-onboarding example: application referred to an underwriter. Human review queued.

- credit-onboarding-agent (agent, 8.42s)
- identity.verify (tool, 1.31s)
- fraud.screen (tool, 1.86s)
- credit_bureau.lookup (tool, 3.54s)
- risk-summary (llm, 2.37s)
- policy-compliance (eval, 0.61s)

Scores: policy_compliance PASS · 1.00; pii_redacted PASS; decision_drift_7d 0.04; human_review queued.

### Ship reliable agents through deployment quality gates

Replay prompt, model, and tool changes against golden datasets. Fail the release when accuracy, policy, or hallucination scores regress — before a client sees a wrong figure.

![Gate results comparing Claude models on FinanceBench with pass and fail scores](/images/blog/2026-07-15-llm-certification-financial-services/benchmark-results.png)

[Deployment gates in financial services](/blog/2026-07-15-llm-certification-financial-services)

### Trace production executions and react to usage shifts

See load, behavior, and cost as they change. Inspect every tool call and reasoning step so platform and risk teams know what the system is handling.

![Agent execution trace showing model turns, tool calls, and nested steps](/images/workflow-automation/execution-trace.png)

[Tracing overview](/docs/observability/overview)

### Cover compliance with audit trails and PII redaction

Mask sensitive fields before data leaves your application. Keep execution history and developer actions for internal and supervisory review, with SSO and project-level RBAC.

![Human annotation of an incorrect agent step with a written explanation](/images/workflow-automation/human-review.png)

[Masking and redaction](/docs/observability/features/masking)

## Run it where your data is allowed to live

Langfuse Cloud in the EU, US, or Japan, self-hosted in your VPC, or fully air-gapped. Same product, same APIs.

### Cloud

Managed cloud in the EU, US, or Japan.

- Regions: EU · US · JP
- Certifications: SOC 2 Type II · ISO 27001
- Data residency: Pinned to region
- Support: Enterprise SLA

### Self-host

Run Langfuse in your own VPC.

- Infra: Kubernetes · Docker
- Storage: ClickHouse · Postgres · S3
- Access: SSO · VPN-only
- License: MIT core + Enterprise

### Air-gapped

No internet access. No vendor access.

- Outbound traffic: None
- Langfuse support access: None
- Users: Internal only, via VPN
- Updates: Offline image transfer

[ISO 27001](/security/iso27001) · [SOC 2](/security/soc2) · [GDPR](/security/gdpr) · [HIPAA](/security/hipaa)

See the [security overview](/security), [self-hosting docs](/self-hosting), and [hardening for government](/self-hosting/configuration/hardening#hardening-for-government).

## Evaluation for financial services

From testing changes before release to monitoring production quality and incorporating expert feedback — with the security controls and deployment options your institution needs.

### Offline evaluation

Golden datasets from production traces, versioned experiments with baseline comparison, and a release gate that fails the pull request on regression.

### Online evaluation

Sampling of live traffic, LLM-as-a-judge and code evaluators, and threshold alerts when quality drifts.

### Human review

Annotation queues for subject-matter experts, corrected outputs, and promotion of failures into a regression set.

### Judge calibration

Score Analytics measures agreement between human labels and model judges so you can defend the judge to model risk.

### Prompt governance

Immutable versions, staging and production labels, protected labels for separation of duties, and full audit history.

### Redaction and administration

Masking in the SDK before data leaves your application, project-level RBAC, OIDC SSO, SCIM, and audit logs.

## What financial services teams build on Langfuse

### [Customer support agents](/users/sumup)

An agent resolves merchant and customer requests, escalating edge cases to humans.

Autonomy rate, good and bad runs scored by evals and reviewers, and the long-tail cases to fix next.

SumUp · 50% deflection

### Credit onboarding and underwriting

An agent combines identity, fraud, and bureau checks into a risk summary and decision.

Why an application was approved or referred, decision drift over time, and eval scores per prompt version.

### AML investigations

An agent gathers transaction history and drafts a case summary for an analyst.

Which tools ran, what data they returned, and how cost and latency vary per case.

### AI-powered advisory

A multi-step agent turns client goals and holdings into a portfolio recommendation.

Each reasoning step and tool call, scored for suitability, with history kept for model risk review.

### Compliance monitoring

An agent drafts customer replies and back-office summaries that must follow internal policy.

Policy evals on every output, with potential violations flagged for review before release.

### [Coding agents across engineering](/coding-agents)

Developers use Claude Code, Codex, Cursor, and Copilot across teams and repositories.

Cost per developer and model, failing tools, and full session replays.

## Learn how to ship reliable agents in financial services

Start with deployment gates and execution history, then see how teams like Trade Republic run Langfuse in production.

- [Building deployment gates for LLMs](/blog/2026-07-15-llm-certification-financial-services): Evaluate model and prompt changes against datasets and policy evals before release.
- [Academy: customer support chatbot](/academy/examples/customer-support-chatbot): Trace, score, and iterate on a support agent to raise its autonomy rate safely.
- [Trade Republic customer story](/users/trade-republic): How a European neobroker runs self-hosted Langfuse in production. Read or watch on YouTube.
- [Structured output extraction cookbook](/guides/cookbook/example_structured_output_extraction): Evaluate insurance-claim and document extraction per field, then improve the pipeline with experiments.

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

## Working on AI in banking, insurance, or capital markets?

Talk through deployment options, compliance needs, and how teams like Trade Republic use Langfuse in production.

- [Start free](/cloud)
- [Documentation](/docs)
- [Talk to an expert](/talk-to-us)
