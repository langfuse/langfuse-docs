---
title: Langfuse for Government
description: Open-source observability and evaluations for AI agents. Self-host in air-gapped, on-premises, and cloud environments. Langfuse Cloud for Government coming soon.
---

# Build accountable AI. Keep it under your control.

Langfuse for Government. Observability and evaluations for public-sector AI, in your environment.

Open-source tracing and evaluations for government AI. Run it **air-gapped, on-premises, or in a private cloud**. Prompts, traces, and scores stay in your environment. You run the software.

- Your environment
- Open source
- Your traces
- [Talk to a public-sector expert](/talk-to-us)
- [Explore self-hosting](/self-hosting)

Langfuse Cloud for Government is coming soon. Managed cloud option. NIST SP 800-53 Rev. 5, SSDF, and FIPS 140-3 hardening in progress. [See both options](#government-cloud)

Open-source core (MIT) · Internet access optional · 100,000+ engineers · 10+ billion observations per month

## See what happened. Score what works. [#observe]

You need to see how an agent reached an answer, score whether it is reliable, and change it without moving sensitive data out of your environment.

### See what happened

Trace every model call, tool invocation, retrieval step, and agent decision. Investigate failures with the full context of each request, session, model, prompt, latency, and cost.

[Observability docs](/docs/observability/overview)

### Measure what works

Score outputs with LLM-as-a-judge, deterministic checks, human review, and user feedback. Turn production failures into datasets and regression tests before the next release.

[Evaluation docs](/docs/evaluation/overview)

### Contain failures early

Monitor quality, security scores, latency, and cost. Set thresholds and send alerts to webhooks, Slack, or GitHub Actions so you can respond before a bad run repeats.

[Alerts docs](/docs/observability/features/alerts)

## Run it where you already operate [#deploy]

Langfuse runs behind a firewall, on a classified network, or in an approved cloud account. The product and data model stay the same.

### Run inside your security boundary

Deploy Langfuse in a VPC, on premises, or in a fully air-gapped Kubernetes environment. Internet access is optional. Bring your own infrastructure, networking, storage, and operational controls.

[Networking docs](/self-hosting/security/networking)

### Inspect and control the software

The Langfuse repository is public. Tracing, evaluations, prompt management, experiments, and annotation are MIT-licensed, with no usage limits. Enterprise extensions live in marked directories and turn on with a license key.

[Open-source licensing](/handbook/chapters/open-source)

### Same architecture as Langfuse Cloud

Self-hosted Langfuse uses the same codebase and architecture as Langfuse Cloud. Asynchronous ingestion absorbs traffic spikes, events are persisted before processing, and background migrations reduce disruption during upgrades.

[Architecture overview](/self-hosting#architecture)

### Keep AI systems accountable

Application traces create a detailed record of model calls and agent actions. Enterprise audit logs add immutable records of who changed what, when, and with which before-and-after state. SSO, role-based access control, SCIM, retention policies, and server-side data masking support centralized governance.

This governance set is available with Langfuse Enterprise.

[Audit logs](/docs/administration/audit-logs)

## Keep data in your environment [#security]

Self-host Langfuse so application teams can debug and evaluate agents. Security teams keep telemetry, prompts, and evaluation data in the approved boundary.

- **Data stays where you put it.** Run the platform and its open-source dependencies in infrastructure you control.
- **Sensitive data can be masked before storage.** Redact data in the SDK before transmission, or apply [centralized ingestion masking](/self-hosting/security/data-masking) in self-hosted Enterprise deployments.
- **Open standards reduce lock-in.** Instrument with [OpenTelemetry](/integrations/native/opentelemetry) or use Langfuse SDKs and integrations across models, frameworks, and languages.
- **Your team controls upgrades.** Use versioned releases and deploy changes on your schedule.

### FIPS-compliant Docker images available upon request [#fips]

For deployments with FIPS requirements, compliant Langfuse Docker images are available upon request.

[Book a meeting](/talk-to-us)

## Start locally. Deploy in production. [#get-started]

Run Langfuse locally with Docker Compose in minutes:

```bash
git clone https://github.com/langfuse/langfuse.git
cd langfuse
docker compose up
```

Move to production with the official Kubernetes Helm chart or maintained Terraform modules for AWS, Azure, and Google Cloud. The product and data model stay the same.

- [Read the deployment guide](/self-hosting)
- [View the source on GitHub](https://github.com/langfuse/langfuse)
- [Kubernetes Helm chart](/self-hosting/deployment/kubernetes-helm)
- [AWS Terraform](/self-hosting/deployment/aws)
- [Azure Terraform](/self-hosting/deployment/azure)
- [GCP Terraform](/self-hosting/deployment/gcp)

## Self-host today. Cloud is coming soon. [#government-cloud]

Most government teams run Langfuse Enterprise on their own infrastructure. Langfuse Cloud for Government is a managed option in progress. Talk to sales to learn more.

### Self-hosted Enterprise

Available today. Run Langfuse Enterprise on-premises, in a VPC, or air-gapped. Pair it with [ClickHouse Government](https://clickhouse.com/government) when you need a government-ready analytics plane.

- Your cluster, your network boundary
- FIPS-compliant Docker images upon request
- RBAC, SSO, SCIM, and audit logs
- Data retention and server-side masking

[Explore self-hosting](/self-hosting)

### Langfuse Cloud for Government

Coming soon. A managed Langfuse Cloud for teams that want Langfuse to operate the control plane. Hardening work is underway.

- NIST SP 800-53 Rev. 5 hardening
- NIST SSDF (SP 800-218) hardening
- FIPS 140-3
- RBAC, SSO, SCIM, audit logs, retention, and data masking

[Contact sales](/talk-to-us)

## Run Langfuse in your environment.

Talk through self-hosted Enterprise today, or Langfuse Cloud for Government. Sensitive data stays in infrastructure you control.

- [Talk to a public-sector expert](/talk-to-us)
- [Explore self-hosting](/self-hosting)
