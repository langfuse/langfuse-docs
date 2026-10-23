---
title: Self-Hosted Pricing
description: Deploy Langfuse OSS today. Upgrade to Enterprise at any time.
---

# Self-Hosted Pricing

Deploy Langfuse OSS today. Upgrade to Enterprise at any time. See also: [Cloud pricing](/pricing).

## Plans

### Open Source (Free)

Self-host all core Langfuse features for free without any limitations.

- MIT License
- All core platform features and APIs (observability, evaluation, prompt management, datasets, etc.)
- Scalability of Langfuse Cloud
- Deployment docs & Helm chart
- Enterprise SSO and RBAC
- Community support
- Unlimited units / usage

[Deployment guide](/self-hosting)

### Self-Hosted Enterprise (Custom Pricing)

Dedicated Langfuse deployment with enterprise capabilities and support. Bundled with ClickHouse Cloud, ClickHouse BYOC, or ClickHouse Private.

- All Open Source features plus management APIs, project-level RBAC, data retention policies, and audit logs
- Bundled with ClickHouse Cloud, ClickHouse BYOC, or ClickHouse Private
- Langfuse pricing is additive to your ClickHouse commercial plan
- Named lead support engineer for deployment and hosting guidance
- Solutions architect support during evaluation and rollout
- Direct access to the product team for feedback
- SOC 2 Type II and ISO 27001 reports
- Support SLA
- Billing via AWS Marketplace or invoice

[Talk to sales](/talk-to-us?deployment=self-hosted) | [Enterprise FAQ](/enterprise)

### Self-Hosted Government (Custom Pricing) [#government]

Dedicated Langfuse deployment for government and highly regulated environments.

- Everything in Enterprise
- NIST hardening
- FIPS 140-3
- Air-gapped deployment

[Talk to sales](/talk-to-us?deployment=self-hosted)

## Feature Comparison (Self-Hosted)

| Feature                                                                                         | Open Source                 | Enterprise                                 | Government            |
| ----------------------------------------------------------------------------------------------- | --------------------------- | ------------------------------------------ | --------------------- |
| **LLM Application & Agent Tracing**                                                             |                             |                                            |                       |
| [Traces and graphs (agents)](/docs/observability/overview)                                      | Yes                         | Yes                                        | Yes                   |
| [Session tracking (chats/threads)](/docs/observability/features/sessions)                       | Yes                         | Yes                                        | Yes                   |
| [User tracking](/docs/observability/features/users)                                             | Yes                         | Yes                                        | Yes                   |
| [Token and cost tracking](/docs/observability/features/token-and-cost-tracking)                 | Yes                         | Yes                                        | Yes                   |
| [Native framework integrations](/integrations)                                                  | Yes                         | Yes                                        | Yes                   |
| [SDKs (Python, JavaScript)](/docs/observability/sdk/overview)                                   | Yes                         | Yes                                        | Yes                   |
| [OpenTelemetry (Java, Go, custom)](/integrations/native/opentelemetry)                          | Yes                         | Yes                                        | Yes                   |
| [Proxy-based logging (via LiteLLM)](/integrations/gateways/litellm)                             | Yes                         | Yes                                        | Yes                   |
| [Custom via API](/docs/api-and-data-platform/features/public-api)                               | Yes                         | Yes                                        | Yes                   |
| Included usage                                                                                  | Unlimited                   | Unlimited                                  | Unlimited             |
| [Multi-modal](/docs/observability/features/multi-modality)                                      | Yes                         | Yes                                        | Yes                   |
| **Langfuse AI**                                                                                 |                             |                                            |                       |
| [Halo (in-app agent)](/docs/halo)                                                               | Yes                         | Yes                                        | Yes                   |
| [MCP](/docs/api-and-data-platform/features/mcp-server)                                          | Yes                         | Yes                                        | Yes                   |
| [CLI](/docs/api-and-data-platform/features/cli)                                                 | Yes                         | Yes                                        | Yes                   |
| **Prompt Management**                                                                           |                             |                                            |                       |
| [Prompt versioning](/docs/prompt-management/get-started)                                        | Yes                         | Yes                                        | Yes                   |
| Prompt fetching                                                                                 | Unlimited                   | Unlimited                                  | Unlimited             |
| [Prompt release management](/docs/prompt-management/features/prompt-version-control)            | Yes                         | Yes                                        | Yes                   |
| [Prompt composability](/docs/prompt-management/features/composability)                          | Yes                         | Yes                                        | Yes                   |
| [Prompt caching (server and client)](/docs/prompt-management/features/caching)                  | Yes                         | Yes                                        | Yes                   |
| [Playground](/docs/prompt-management/features/playground)                                       | Yes                         | Yes                                        | Yes                   |
| [Prompt experiments](/docs/evaluation/experiments/experiments-via-ui)                           | Yes                         | Yes                                        | Yes                   |
| [Webhooks & Slack](/docs/prompt-management/features/webhooks-slack-integrations)                | Yes                         | Yes                                        | Yes                   |
| [Protected deployment labels](/docs/prompt-management/get-started#protected-prompt-labels)      | --                          | Yes                                        | Yes                   |
| **Evaluation (online and offline)**                                                             |                             |                                            |                       |
| [Datasets](/docs/evaluation/experiments/datasets)                                               | Yes                         | Yes                                        | Yes                   |
| [Experiments via SDK](/docs/evaluation/experiments/experiments-via-sdk)                         | Yes                         | Yes                                        | Yes                   |
| [Experiments via UI](/docs/evaluation/experiments/experiments-via-ui)                           | Yes                         | Yes                                        | Yes                   |
| [Evaluation scores (custom)](/docs/evaluation/evaluation-methods/scores-via-sdk)                | Yes                         | Yes                                        | Yes                   |
| [User feedback tracking](/docs/observability/features/user-feedback)                            | Yes                         | Yes                                        | Yes                   |
| [External evaluation pipelines](/guides/cookbook/example_external_evaluation_pipelines)         | Yes                         | Yes                                        | Yes                   |
| [LLM-as-judge evaluators](/docs/evaluation/evaluation-methods/llm-as-a-judge)                   | Yes                         | Yes                                        | Yes                   |
| [Human annotation](/docs/evaluation/evaluation-methods/scores-via-ui)                           | Yes                         | Yes                                        | Yes                   |
| [Human annotation queues](/docs/evaluation/evaluation-methods/annotation-queues)                | Yes                         | Yes                                        | Yes                   |
| **Metrics**                                                                                     |                             |                                            |                       |
| [Custom dashboards](/docs/metrics/features/custom-dashboards)                                   | Yes                         | Yes                                        | Yes                   |
| [Alerts](/docs/observability/features/alerts)                                                   | Langfuse v4+                | Langfuse v4+                               | Langfuse v4+          |
| **Collaboration**                                                                               |                             |                                            |                       |
| Projects                                                                                        | Unlimited                   | Unlimited                                  | Unlimited             |
| Users                                                                                           | Unlimited                   | Unlimited                                  | Unlimited             |
| **API**                                                                                         |                             |                                            |                       |
| [Extensive public API](/docs/api-and-data-platform/features/public-api)                         | Yes                         | Yes                                        | Yes                   |
| [Metrics & Observations APIs (v2)](/docs/metrics/features/metrics-api#v2)                       | Langfuse v4+                | Langfuse v4+                               | Langfuse v4+          |
| **Exports**                                                                                     |                             |                                            |                       |
| [Batch export via UI](/docs/api-and-data-platform/features/export-from-ui)                      | Yes                         | Yes                                        | Yes                   |
| [PostHog integration](/integrations/analytics/posthog)                                          | Yes                         | Yes                                        | Yes                   |
| [Mixpanel integration](/integrations/analytics/mixpanel)                                        | Yes                         | Yes                                        | Yes                   |
| [Scheduled export to blob storage](/docs/api-and-data-platform/features/export-to-blob-storage) | Yes                         | Yes                                        | Yes                   |
| **Deployment**                                                                                  |                             |                                            |                       |
| ClickHouse deployment model                                                                     | Self-managed ClickHouse OSS | Bundled: ClickHouse Cloud / BYOC / Private | ClickHouse Government |
| [Deployment templates](/self-hosting)                                                           | Yes                         | Yes                                        | Yes                   |
| [Local (Docker Compose)](/self-hosting/deployment/docker-compose)                               | Yes                         | Yes                                        | Yes                   |
| [Kubernetes (Helm)](/self-hosting/deployment/kubernetes-helm)                                   | Yes                         | Yes                                        | Yes                   |
| [AWS (Terraform)](/self-hosting/deployment/aws)                                                 | Yes                         | Yes                                        | Yes                   |
| [Azure (Terraform)](/self-hosting/deployment/azure)                                             | Yes                         | Yes                                        | Yes                   |
| [GCP (Terraform)](/self-hosting/deployment/gcp)                                                 | Yes                         | Yes                                        | Yes                   |
| **Support**                                                                                     |                             |                                            |                       |
| [Ask AI](/docs/ask-ai)                                                                          | Yes                         | Yes                                        | Yes                   |
| [Community (GitHub)](/support#community)                                                        | Yes                         | Yes                                        | Yes                   |
| [In-app support](/support#in-app)                                                               | --                          | Yes                                        | Yes                   |
| [Private Slack channel](/support#slack)                                                         | --                          | Yes                                        | Yes                   |
| [Named lead support engineer](/support#onboarding)                                              | --                          | Yes                                        | Yes                   |
| [Onboarding & architectural guidance](/support#onboarding)                                      | --                          | Yes                                        | Yes                   |
| Solutions architect support                                                                     | --                          | Yes                                        | Yes                   |
| Product team feedback channel                                                                   | --                          | Yes                                        | Yes                   |
| [Support SLA](/enterprise#faq)                                                                  | --                          | Yes                                        | Yes                   |
| **Security**                                                                                    |                             |                                            |                       |
| Sign in with Google, AzureAD, GitHub                                                            | Yes                         | Yes                                        | Yes                   |
| [Organization-level RBAC](/docs/administration/rbac)                                            | Yes                         | Yes                                        | Yes                   |
| Enterprise SSO (e.g. Okta, EntraID)                                                             | Yes                         | Yes                                        | Yes                   |
| SSO enforcement                                                                                 | Yes                         | Yes                                        | Yes                   |
| [Client-side data masking](/docs/observability/features/masking)                                | Yes                         | Yes                                        | Yes                   |
| [Server-side data masking](/self-hosting/security/data-masking)                                 | --                          | Yes                                        | Yes                   |
| [Project-level RBAC](/docs/administration/rbac#project-level-roles)                             | --                          | Yes                                        | Yes                   |
| [Data retention management](/docs/administration/data-retention)                                | --                          | Yes                                        | Yes                   |
| [SCIM API (automated user provisioning)](/docs/administration/scim-and-org-api)                 | --                          | Yes                                        | Yes                   |
| [Organization creators](/self-hosting/administration/organization-creators)                     | --                          | Yes                                        | Yes                   |
| [UI customization](/self-hosting/administration/ui-customization)                               | --                          | Yes                                        | Yes                   |
| [Audit logs](/docs/administration/audit-logs)                                                   | --                          | Yes                                        | Yes                   |
| [Admin API (project management, SCIM)](/docs/administration/scim-and-org-api)                   | --                          | Yes                                        | Yes                   |
| [Instance management API](/self-hosting/administration/instance-management-api)                 | --                          | Yes                                        | Yes                   |
| [NIST hardening](/self-hosting/configuration/hardening#hardening-for-government)                | --                          | --                                         | Yes                   |
| [FIPS 140-3](/self-hosting/configuration/fips-mode)                                             | --                          | --                                         | Yes                   |
| [Air-gapped deployment](/self-hosting/security/networking#internet-access)                      | --                          | --                                         | Yes                   |
| **Compliance**                                                                                  |                             |                                            |                       |
| SOC2 Type II & ISO27001 reports                                                                 | --                          | Yes                                        | Yes                   |
| InfoSec/legal reviews                                                                           | --                          | Yes                                        | Yes                   |

## Discounts

| Program              | Discount                            | Details                             |
| -------------------- | ----------------------------------- | ----------------------------------- |
| Early-stage startups | 50% off, first year                 | [Learn more and apply](/startups)   |
| Research / Students  | Up to 100% off (limits apply)       | [Learn more and apply](/research)   |
| Non-profits          | $199 in credits / month             | [Learn more and apply](/non-profit) |
| Open-source projects | $300 in credits / month, first year | Contact support@langfuse.com        |

## Frequently Asked Questions

**How does Langfuse pricing compare to LangSmith, Braintrust, Arize, and Datadog?**
On a representative workload, Langfuse Cloud is cheaper than [LangSmith](/compare/langsmith), [Braintrust](/compare/braintrust), [Arize](/compare/arize-phoenix), and [Datadog Agent Observability](/compare/datadog). Open the [editable pricing comparison sheet](/pricing-comparison-sheet) to fill in your own assumptions and check the numbers for your workload. For product-by-product differences, see the [comparison pages](/compare). Langfuse is also [open source](/why), based on [OpenTelemetry](/integrations/native/opentelemetry) for interoperability, [self-hostable](/self-hosting) at the same scale as Langfuse Cloud, and model- and framework-agnostic.

**Can I purchase Langfuse through AWS Marketplace?**
Yes. Self-hosted Enterprise can be billed via AWS Marketplace or invoice. [Talk to us](/talk-to-us?deployment=self-hosted) to request a private offer.

**Can I self-host Langfuse for free?**
Yes, Langfuse is open source and you can self-host it for free. Use Docker Compose to run Langfuse locally, or use one of the templates to self-host in production on Kubernetes. See the [self-hosting documentation](/self-hosting) to learn more.

**What is the difference between Open Source and Enterprise?**
Open Source includes all core platform features under the MIT license with community support. Enterprise adds management APIs, project-level RBAC, data retention policies, audit logs, dedicated support, and is bundled with a ClickHouse commercial plan.

**Where is the data stored?**
Self-hosted Langfuse stores data in your own infrastructure. You control data residency and can deploy in any region. See [security documentation](/security) for details.

[Ask anything else](/docs/ask-ai)
