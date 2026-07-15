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

### Self-Hosted Enterprise (Custom pricing)

Dedicated Langfuse deployment with enterprise capabilities and support. Runs on your ClickHouse deployment -- we help you pick the right ClickHouse setup.

- All Open Source features plus management APIs, project-level RBAC, data retention policies, and audit logs
- Runs on your ClickHouse deployment -- we help you pick the right ClickHouse setup
- Activated via license key; one key covers all of your environments
- Annual agreement sized on your billable units
- Dedicated support engineer for deployment and hosting guidance
- Solutions architect support during evaluation and rollout
- Direct access to the product team for feedback
- SOC 2 Type II and ISO 27001 reports
- Support SLA
- Billing via AWS Marketplace or invoice

[Talk to sales](/talk-to-us?deployment=self-hosted) | [Enterprise FAQ](/enterprise)

## Feature Comparison (Self-Hosted)

| Feature                                                                                             | Open Source                    | Enterprise                                                 |
| --------------------------------------------------------------------------------------------------- | ------------------------------ | ---------------------------------------------------------- |
| **LLM Application & Agent Tracing**                                                                 |                                |                                                            |
| [Traces and graphs (agents)](/docs/observability/overview)                                          | Yes                            | Yes                                                        |
| [Session tracking (chats/threads)](/docs/observability/features/sessions)                           | Yes                            | Yes                                                        |
| [User tracking](/docs/observability/features/users)                                                 | Yes                            | Yes                                                        |
| [Token and cost tracking](/docs/observability/features/token-and-cost-tracking)                     | Yes                            | Yes                                                        |
| [Native framework integrations](/integrations)                                                      | Yes                            | Yes                                                        |
| [SDKs (Python, JavaScript)](/docs/observability/sdk/overview)                                       | Yes                            | Yes                                                        |
| [OpenTelemetry (Java, Go, custom)](/docs/opentelemetry/get-started)                                 | Yes                            | Yes                                                        |
| [Proxy-based logging (via LiteLLM)](/integrations/gateways/litellm)                                 | Yes                            | Yes                                                        |
| [Custom via API](/api-and-data-platform/features/public-api)                                        | Yes                            | Yes                                                        |
| Included usage                                                                                      | Unlimited                      | Unlimited                                                  |
| [Multi-modal](/docs/observability/features/multi-modality)                                          | Yes                            | Yes                                                        |
| **Prompt Management**                                                                               |                                |                                                            |
| [Prompt versioning](/docs/prompt-management/get-started)                                            | Yes                            | Yes                                                        |
| Prompt fetching                                                                                     | Unlimited                      | Unlimited                                                  |
| [Prompt release management](/docs/prompt-management/features/prompt-version-control)                | Yes                            | Yes                                                        |
| [Prompt composability](/docs/prompt-management/features/composability)                              | Yes                            | Yes                                                        |
| [Prompt caching (server and client)](/docs/prompt-management/features/caching)                      | Yes                            | Yes                                                        |
| [Playground](/docs/prompt-management/features/playground)                                           | Yes                            | Yes                                                        |
| [Prompt experiments](/docs/evaluation/dataset-runs/native-run)                                      | Yes                            | Yes                                                        |
| [Webhooks & Slack](/docs/prompt-management/features/webhooks-slack-integrations)                    | Yes                            | Yes                                                        |
| [Protected deployment labels](/docs/prompt-management/get-started#protected-prompt-labels)          | --                             | Yes                                                        |
| **Evaluation (online and offline)**                                                                 |                                |                                                            |
| [Datasets](/docs/evaluation/dataset-runs/datasets)                                                  | Yes                            | Yes                                                        |
| [Experiments via SDK](/docs/evaluation/experiments/experiments-via-sdk)                             | Yes                            | Yes                                                        |
| [Experiments via UI](/docs/evaluation/experiments/experiments-via-ui)                               | Yes                            | Yes                                                        |
| [Evaluation scores (custom)](/docs/evaluation/evaluation-methods/custom-scores)                     | Yes                            | Yes                                                        |
| [User feedback tracking](/faq/all/user-feedback)                                                    | Yes                            | Yes                                                        |
| [External evaluation pipelines](/guides/cookbook/example_external_evaluation_pipelines)             | Yes                            | Yes                                                        |
| [LLM-as-judge evaluators](/docs/evaluation/evaluation-methods/llm-as-a-judge)                       | Yes                            | Yes                                                        |
| [Human annotation](/docs/scores/annotation)                                                         | Yes                            | Yes                                                        |
| [Human annotation queues](/docs/evaluation/evaluation-methods/annotation#annotation-queues)         | Yes                            | Yes                                                        |
| **Collaboration**                                                                                   |                                |                                                            |
| Projects                                                                                            | Unlimited                      | Unlimited                                                  |
| Users                                                                                               | Unlimited                      | Unlimited                                                  |
| **API**                                                                                             |                                |                                                            |
| [Extensive public API](/docs/api-and-data-platform/features/public-api)                             | Yes                            | Yes                                                        |
| **Exports**                                                                                         |                                |                                                            |
| [Batch export via UI](/docs/api-and-data-platform/features/query-via-sdk#ui)                        | Yes                            | Yes                                                        |
| [PostHog integration](/integrations/analytics/posthog)                                              | Yes                            | Yes                                                        |
| [Mixpanel integration](/integrations/analytics/mixpanel)                                            | Yes                            | Yes                                                        |
| [Scheduled export to blob storage](/docs/api-and-data-platform/features/query-via-sdk#blob-storage) | Yes                            | Yes                                                        |
| **Deployment**                                                                                      |                                |                                                            |
| [ClickHouse deployment model](/self-hosting/deployment/infrastructure/clickhouse)                   | ClickHouse OSS, Cloud, or BYOC | ClickHouse OSS, Cloud, or BYOC (BYOC or Cloud recommended) |
| [Deployment templates](/self-hosting)                                                               | Yes                            | Yes                                                        |
| [Local (Docker Compose)](/self-hosting/deployment/docker-compose)                                   | Yes                            | Yes                                                        |
| [Kubernetes (Helm)](/self-hosting/deployment/kubernetes-helm)                                       | Yes                            | Yes                                                        |
| [AWS (Terraform)](/self-hosting/deployment/aws)                                                     | Yes                            | Yes                                                        |
| [Azure (Terraform)](/self-hosting/deployment/azure)                                                 | Yes                            | Yes                                                        |
| [GCP (Terraform)](/self-hosting/deployment/gcp)                                                     | Yes                            | Yes                                                        |
| **Support**                                                                                         |                                |                                                            |
| [Ask AI](/docs/ask-ai)                                                                              | Yes                            | Yes                                                        |
| [Community (GitHub)](/support#community)                                                            | Yes                            | Yes                                                        |
| [In-app support](/support#in-app)                                                                   | --                             | Yes                                                        |
| [Private Slack channel](/support#slack)                                                             | --                             | Yes                                                        |
| [Dedicated support engineer](/support#onboarding)                                                   | --                             | Yes                                                        |
| [Onboarding & architectural guidance](/support#onboarding)                                          | --                             | Yes                                                        |
| Solutions architect support                                                                         | --                             | Yes                                                        |
| Product team feedback channel                                                                       | --                             | Yes                                                        |
| [Response time SLO](https://clickhouse.com/legal/support-services-policy)                           | Best effort (community)        | 1h (24/7)                                                  |
| [Support SLA](/enterprise#faq)                                                                      | --                             | Yes                                                        |
| **Security**                                                                                        |                                |                                                            |
| Sign in with Google, AzureAD, GitHub                                                                | Yes                            | Yes                                                        |
| [Organization-level RBAC](/docs/administration/rbac)                                                | Yes                            | Yes                                                        |
| Enterprise SSO (e.g. Okta, EntraID)                                                                 | Yes                            | Yes                                                        |
| SSO enforcement                                                                                     | Yes                            | Yes                                                        |
| [Client-side data masking](/docs/observability/features/masking)                                    | Yes                            | Yes                                                        |
| [Server-side data masking](/self-hosting/security/data-masking)                                     | --                             | Yes                                                        |
| [Project-level RBAC](/docs/administration/rbac#project-level-roles)                                 | --                             | Yes                                                        |
| [Data retention management](/docs/administration/data-retention)                                    | --                             | Yes                                                        |
| [SCIM API (automated user provisioning)](/docs/administration/scim-and-org-api)                     | --                             | Yes                                                        |
| [Organization creators](/self-hosting/administration/organization-creators)                         | --                             | Yes                                                        |
| [UI customization](/self-hosting/administration/ui-customization)                                   | --                             | Yes                                                        |
| [Audit logs](/docs/administration/audit-logs)                                                       | --                             | Yes                                                        |
| [Admin API (project management, SCIM)](/docs/administration/scim-and-org-api)                       | --                             | Yes                                                        |
| [Instance management API](/self-hosting/administration/instance-management-api)                     | --                             | Yes                                                        |
| **Compliance**                                                                                      |                                |                                                            |
| SOC2 Type II & ISO27001 reports                                                                     | --                             | Yes                                                        |
| InfoSec/legal reviews                                                                               | --                             | Yes                                                        |

_Standard contracts: [ClickHouse General Terms & Conditions](https://clickhouse.com/legal/clickhouse-general-terms-and-conditions) and the [Self-Managed Addendum](https://clickhouse.com/legal/clickhouse-self-managed-addendum). Redlined contracts are available for larger committed-spend agreements._

## Discounts

| Program              | Discount                            | Details                             |
| -------------------- | ----------------------------------- | ----------------------------------- |
| Early-stage startups | 50% off, first year                 | [Learn more and apply](/startups)   |
| Research / Students  | Up to 100% off (limits apply)       | [Learn more and apply](/research)   |
| Non-profits          | $199 in credits / month             | [Learn more and apply](/non-profit) |
| Open-source projects | $300 in credits / month, first year | Contact support@langfuse.com        |

## Frequently Asked Questions

**Can I self-host Langfuse for free?**
Yes, Langfuse is open source and you can self-host it for free. Use Docker Compose to run Langfuse locally, or use one of the templates to self-host in production on Kubernetes. See the [self-hosting documentation](/self-hosting) to learn more.

**What is the difference between Open Source and Enterprise?**
Open Source includes all core platform features under the MIT license with community support. Enterprise adds management APIs, project-level RBAC, data retention policies, audit logs, and dedicated support. It is activated via a license key under an annual agreement.

**How is Enterprise priced?**
Langfuse Enterprise (self-hosted) is an annual agreement with a flat fee sized on your [billable units](/docs/administration/billable-units) across all deployments and environments. One license key covers all environments. Langfuse does not actively meter self-hosted usage; usage is reviewed together at renewal. [Talk to sales](/talk-to-us?deployment=self-hosted) for a quote.

**Where is the data stored?**
Self-hosted Langfuse stores data in your own infrastructure. You control data residency and can deploy in any region. See [security documentation](/security) for details.
