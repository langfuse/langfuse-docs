---
title: Langfuse for Government
description: Open-source observability and evaluations for AI agents. Deploy Langfuse in air-gapped, on-premises, and cloud environments — and keep traces, prompts, and evaluation data inside your security boundary.
---

# Build accountable AI. Keep it under your control.

Langfuse for Government — observability and evaluations for public-sector AI, inside your security boundary.

Government and public-sector teams use Langfuse to observe, evaluate, and improve AI agents — without sending prompts, traces, or evaluation data outside their security boundary. Deploy **air-gapped, on premises, or in a private cloud**. The core is open source and inspectable; you operate the stack.

- Your environment
- Inspectable source
- Audit-ready traces
- [Talk to a public-sector expert](/talk-to-us)
- [Explore self-hosting](/self-hosting)

Open-source core (MIT) · Internet access optional · 100,000+ engineers · 10+ billion observations per month

## Understand every agent. Improve every outcome. [#observe]

Government AI must do more than work in a demo. Teams need to understand how an agent reached an answer, measure whether it is reliable, and improve it without losing control of sensitive data.

Langfuse brings the full improvement loop into one platform:

### See what happened

Trace every model call, tool invocation, retrieval step, and agent decision. Investigate failures with the full context of each request, session, model, prompt, latency, and cost.

[Observability docs](/docs/observability/overview)

### Measure what works

Score outputs with LLM-as-a-judge, deterministic checks, human review, and user feedback. Turn production failures into datasets and regression tests before the next release.

[Evaluation docs](/docs/evaluation/overview)

### Contain failures early

Monitor quality, security scores, latency, and cost. Set thresholds and route alerts through webhooks, Slack, or GitHub Actions — so teams can act before isolated failures become systemic.

[Alerts docs](/docs/observability/features/alerts)

## Mission-ready deployment, on your terms [#deploy]

Langfuse is built to run where government teams already operate — behind a firewall, in a classified network, or in an approved cloud account — without changing the product or the data model.

### Run inside your security boundary

Deploy Langfuse in a VPC, on premises, or in a fully air-gapped Kubernetes environment. Internet access is optional. Bring your own infrastructure, networking, storage, and operational controls.

[Networking docs](/self-hosting/security/networking)

### Inspect and control the software

The complete Langfuse repository is public. All core product capabilities — tracing, evaluations, prompt management, experiments, and annotation — are MIT-licensed without usage limits. Enterprise extensions live in clearly marked directories and activate only with a license key.

[Open-source licensing](/handbook/chapters/open-source)

### Operate the same architecture proven in the cloud

Self-hosted Langfuse is not a reduced fork. It uses the same codebase and architecture as Langfuse Cloud. Asynchronous ingestion absorbs traffic spikes, incoming events are persisted before processing, and background migrations reduce disruption during upgrades.

[Architecture overview](/self-hosting#architecture)

### Keep AI systems accountable

Application traces create a detailed record of model calls and agent actions. Enterprise audit logs add immutable records of who changed what, when, and with which before-and-after state. SSO, role-based access control, SCIM, retention policies, and server-side data masking support centralized governance.

This governance set is available with Langfuse Enterprise.

[Audit logs](/docs/administration/audit-logs)

## Security without giving up developer velocity [#security]

Self-host Langfuse so application teams can debug and evaluate agents quickly, while security teams keep telemetry, prompts, and evaluation data inside the approved boundary.

- **Data stays where you put it.** Run the platform and its open-source dependencies in infrastructure you control.
- **Sensitive data can be masked before storage.** Redact data in the SDK before transmission, or apply [centralized ingestion masking](/self-hosting/security/data-masking) in self-hosted Enterprise deployments.
- **Open standards reduce lock-in.** Instrument with [OpenTelemetry](/integrations/native/opentelemetry) or use Langfuse SDKs and integrations across models, frameworks, and languages.
- **Your team controls upgrades.** Use versioned releases and deploy changes on your schedule.

### FIPS-compliant Docker images available upon request [#fips]

For deployments with FIPS requirements, compliant Langfuse Docker images are available upon request.

[Book a meeting](/talk-to-us)

## Start locally. Deploy for the mission. [#get-started]

Run Langfuse locally with Docker Compose in minutes:

```bash
git clone https://github.com/langfuse/langfuse.git
cd langfuse
docker compose up
```

Move to production with the official Kubernetes Helm chart or maintained Terraform modules for AWS, Azure, and Google Cloud — without changing the product or data model.

- [Read the deployment guide](/self-hosting)
- [View the source on GitHub](https://github.com/langfuse/langfuse)
- [Kubernetes Helm chart](/self-hosting/deployment/kubernetes-helm)
- [AWS Terraform](/self-hosting/deployment/aws)
- [Azure Terraform](/self-hosting/deployment/azure)
- [GCP Terraform](/self-hosting/deployment/gcp)

## Bring accountable AI into your environment.

See how Langfuse can help your team observe, evaluate, and improve mission-critical AI systems — without moving sensitive data outside your control.

- [Talk to a public-sector expert](/talk-to-us)
- [Explore self-hosting](/self-hosting)
