---
title: Pricing
description: Simple pricing for projects of all sizes. Get started on our Hobby plan without a credit card.
---

# Pricing

Get started on the Hobby plan for free. No credit card required. See also: [Self-hosted pricing](/pricing-self-host).

## Cloud Plans

### Hobby (Free)

Get started, no credit card required. Great for hobby projects and POCs.

- All platform features (with limits)
- 50k units / month included
- 30 days data access
- 2 users
- Community support via GitHub

[Sign up](https://cloud.langfuse.com)

### Core ($29/month)

For production projects. Longer data access and unlimited users.

- Everything in Hobby
- 100k units / month included, additional: $8/100k units (lower with volume)
- 90 days data access
- Unlimited users
- In-app support

Discounts available for [startups](/startups), [research/students](/research), and [open-source projects](/pricing#discounts).

[Sign up](https://cloud.langfuse.com)

### Pro ($199/month)

For scaling projects. Unlimited history, high rate limits, all features.

- Everything in Core
- 100k units / month included, additional: $8/100k units (lower with volume)
- 3 years data access
- Data retention management
- Unlimited annotation queues
- High rate limits
- SOC2 & ISO27001 reports, BAA available (HIPAA)
- Prioritized in-app support

Optional **Teams Add-on** ($300/month):

- Enterprise SSO (e.g. Okta)
- SSO enforcement
- Fine-grained RBAC
- Support via dedicated Slack channel

[Sign up](https://cloud.langfuse.com)

### Enterprise ($2,499/month)

For large-scale teams. Enterprise-grade support and security.

- Everything in Pro + Teams
- 100k units / month included, additional: $8/100k units (lower with volume)
- Audit logs
- SCIM API
- Custom rate limits
- Uptime SLA
- Support SLA
- Dedicated support engineer

Optional **Yearly Commitment**:

- Custom volume pricing
- Architecture reviews
- Billing via AWS Marketplace
- Billing via invoice
- Vendor onboarding

[Contact sales](/talk-to-us) | [Enterprise FAQ](/enterprise)

## Feature Comparison (Cloud)

| Feature | Hobby | Core | Pro | Enterprise |
|---|---|---|---|---|
| **LLM Application & Agent Tracing** | | | | |
| [Traces and graphs (agents)](/docs/observability/overview) | Yes | Yes | Yes | Yes |
| [Session tracking (chats/threads)](/docs/observability/features/sessions) | Yes | Yes | Yes | Yes |
| [User tracking](/docs/observability/features/users) | Yes | Yes | Yes | Yes |
| [Token and cost tracking](/docs/observability/features/token-and-cost-tracking) | Yes | Yes | Yes | Yes |
| [Native framework integrations](/integrations) | Yes | Yes | Yes | Yes |
| [SDKs (Python, JavaScript)](/docs/observability/sdk/overview) | Yes | Yes | Yes | Yes |
| [OpenTelemetry (Java, Go, custom)](/docs/opentelemetry/get-started) | Yes | Yes | Yes | Yes |
| [Proxy-based logging (via LiteLLM)](/integrations/gateways/litellm) | Yes | Yes | Yes | Yes |
| [Custom via API](/api-and-data-platform/features/public-api) | Yes | Yes | Yes | Yes |
| [Included usage](/docs/administration/billable-units) | 50k units | 100k units | 100k units | 100k units |
| [Additional usage](/docs/administration/billable-units) | -- | $8/100k units | $8/100k units | $8/100k units |
| Custom usage pricing | -- | -- | -- | Yearly Commitment |
| [Multi-modal](/docs/observability/features/multi-modality) | Free while in beta | Free while in beta | Free while in beta | Free while in beta |
| Access to historical data | 30 days | 90 days | 3 years | 3 years |
| [Ingestion throughput](/faq/all/api-limits) | 1,000 req/min | 4,000 req/min | 20,000 req/min | Custom |
| **Prompt Management** | | | | |
| [Prompt versioning](/docs/prompt-management/get-started) | Yes | Yes | Yes | Yes |
| Prompt fetching | Unlimited | Unlimited | Unlimited | Unlimited |
| [Prompt release management](/docs/prompt-management/features/prompt-version-control) | Yes | Yes | Yes | Yes |
| [Prompt composability](/docs/prompt-management/features/composability) | Yes | Yes | Yes | Yes |
| [Prompt caching (server and client)](/docs/prompt-management/features/caching) | Yes | Yes | Yes | Yes |
| [Playground](/docs/prompt-management/features/playground) | Yes | Yes | Yes | Yes |
| [Prompt experiments](/docs/evaluation/dataset-runs/native-run) | Yes | Yes | Yes | Yes |
| [Webhooks & Slack](/docs/prompt-management/features/webhooks-slack-integrations) | Yes | Yes | Yes | Yes |
| [Protected deployment labels](/docs/prompt-management/get-started#protected-prompt-labels) | -- | -- | Teams add-on | Yes |
| **Evaluation (online and offline)** | | | | |
| [Datasets](/docs/evaluation/dataset-runs/datasets) | Yes | Yes | Yes | Yes |
| [Experiments via SDK](/docs/evaluation/experiments/experiments-via-sdk) | Yes | Yes | Yes | Yes |
| [Experiments via UI](/docs/evaluation/experiments/experiments-via-ui) | Yes | Yes | Yes | Yes |
| [Evaluation scores (custom)](/docs/evaluation/evaluation-methods/custom-scores) | Yes | Yes | Yes | Yes |
| [User feedback tracking](/faq/all/user-feedback) | Yes | Yes | Yes | Yes |
| [External evaluation pipelines](/guides/cookbook/example_external_evaluation_pipelines) | Yes | Yes | Yes | Yes |
| [LLM-as-judge evaluators](/docs/evaluation/evaluation-methods/llm-as-a-judge) | Yes | Yes | Yes | Yes |
| [Human annotation](/docs/scores/annotation) | Yes | Yes | Yes | Yes |
| [Human annotation queues](/docs/evaluation/evaluation-methods/annotation#annotation-queues) | 1 queue | 3 queues | Yes | Yes |
| **Collaboration** | | | | |
| Projects | Unlimited | Unlimited | Unlimited | Unlimited |
| Users | 2 | Unlimited | Unlimited | Unlimited |
| **API** | | | | |
| [Extensive public API](/docs/api-and-data-platform/features/public-api) | Yes | Yes | Yes | Yes |
| [Rate limit (general API)](/faq/all/api-limits) | 30 req/min | 100 req/min | 1,000 req/min | Custom |
| [Rate limit (datasets API)](/faq/all/api-limits) | 100 req/min | 200 req/min | 1,000 req/min | Custom |
| [Rate limit (metrics API)](/faq/all/api-limits) | 100 req/day | 200 req/day | 2,000 req/day | Custom |
| [SLA](/enterprise#faq) | -- | -- | -- | Yes |
| **Exports** | | | | |
| [Batch export via UI](/docs/api-and-data-platform/features/query-via-sdk#ui) | Yes | Yes | Yes | Yes |
| [PostHog integration](/integrations/analytics/posthog) | Yes | Yes | Yes | Yes |
| [Mixpanel integration](/integrations/analytics/mixpanel) | Yes | Yes | Yes | Yes |
| [Scheduled export to blob storage](/docs/api-and-data-platform/features/query-via-sdk#blob-storage) | -- | -- | Teams add-on | Yes |
| **Support** | | | | |
| [Ask AI](/docs/ask-ai) | Yes | Yes | Yes | Yes |
| [Community (GitHub)](/support#community) | Yes | Yes | Yes | Yes |
| [In-app support](/support#in-app) | -- | Yes | Yes | Yes |
| [Private Slack channel](/support#slack) | -- | -- | Teams add-on | Yes |
| [Dedicated support engineer](/support#onboarding) | -- | -- | -- | Yes |
| [Onboarding & architectural guidance](/support#onboarding) | -- | -- | -- | Yes |
| Response time SLO | n/a | 48h | 48h (Teams: 24h) | Custom |
| [Support SLA](/enterprise#faq) | -- | -- | -- | Yes |
| **Security** | | | | |
| [Data region](/security/data-regions) | US or EU | US or EU | US or EU | US or EU |
| Sign in with Google, AzureAD, GitHub | Yes | Yes | Yes | Yes |
| [Organization-level RBAC](/docs/administration/rbac) | Yes | Yes | Yes | Yes |
| Enterprise SSO (e.g. Okta, EntraID) | -- | -- | Teams add-on | Yes |
| SSO enforcement | -- | -- | Teams add-on | Yes |
| [Client-side data masking](/docs/observability/features/masking) | Yes | Yes | Yes | Yes |
| [Project-level RBAC](/docs/administration/rbac#project-level-roles) | -- | -- | Teams add-on | Yes |
| [Data retention management](/docs/administration/data-retention) | -- | -- | Yes | Yes |
| [SCIM API (automated user provisioning)](/docs/administration/scim-and-org-api) | -- | -- | -- | Yes |
| [Audit logs](/docs/administration/audit-logs) | -- | -- | -- | Yes |
| **Billing** | | | | |
| Subscription management | -- | Self-serve | Self-serve | Self-serve, or contact sales |
| Payment methods | -- | Credit card | Credit card | Credit card, Invoice |
| Contract duration | -- | Monthly | Monthly | Yearly Commitment |
| Billing via AWS Marketplace | -- | -- | -- | Yearly Commitment |
| **Compliance** | | | | |
| Contracts | Standard T&Cs & DPA | Standard T&Cs & DPA | Standard T&Cs & DPA | Talk to sales |
| [Data processing agreement (GDPR)](/security/dpa) | Yes | Yes | Yes | Yes |
| [SOC2 Type II & ISO27001 reports](/security) | -- | -- | Yes | Yes |
| [HIPAA compliance](/security/hipaa) | -- | -- | Yes | Yes |
| InfoSec/legal reviews | -- | -- | -- | Yearly Commitment |

## Graduated Usage Pricing

Additional usage beyond the included units is billed at graduated rates. Higher volumes automatically get lower rates:

| Tier | Rate |
|---|---|
| 0 -- 100k units | Included in plan |
| 100k -- 1M units | $8.00 / 100k units |
| 1M -- 10M units | $7.00 / 100k units |
| 10M -- 50M units | $6.50 / 100k units |
| 50M+ units | $6.00 / 100k units |

### Pricing Examples

**Example 1: Small project (200k units/month on Core)**
- Core base fee: $29.00
- First 100k units: included
- Next 100k units at $8.00/100k: $8.00
- **Total: $37.00/month**

**Example 2: Growing project (1M units/month on Core)**
- Core base fee: $29.00
- First 100k units: included
- Next 900k units at $8.00/100k: $72.00
- **Total: $101.00/month**

**Example 3: Scaling project (5M units/month on Pro)**
- Pro base fee: $199.00
- First 100k units: included
- Next 900k units at $8.00/100k: $72.00
- Next 4M units at $7.00/100k: $280.00
- **Total: $551.00/month**

**Example 4: Large project (25M units/month on Pro + Teams)**
- Pro + Teams base fee: $499.00
- First 100k units: included
- Next 900k units at $8.00/100k: $72.00
- Next 9M units at $7.00/100k: $630.00
- Next 15M units at $6.50/100k: $975.00
- **Total: $2,176.00/month**

**Example 5: Enterprise scale (100M units/month on Enterprise)**
- Enterprise base fee: $2,499.00
- First 100k units: included
- Next 900k units at $8.00/100k: $72.00
- Next 9M units at $7.00/100k: $630.00
- Next 40M units at $6.50/100k: $2,600.00
- Next 50M units at $6.00/100k: $3,000.00
- **Total: $8,801.00/month** (custom volume pricing available with yearly commitment)

### Billable Units

A billable unit in Langfuse is any tracing data point sent to the platform -- including traces (complete application interactions), observations (individual steps: spans, events, and generations), and scores (evaluations). See [billable units documentation](/docs/administration/billable-units) for details.

## Discounts

| Program | Discount | Details |
|---|---|---|
| Early-stage startups | 50% off, first year | [Learn more and apply](/startups) |
| Research / Students | Up to 100% off (limits apply) | [Learn more and apply](/research) |
| Non-profits | $199 in credits / month | [Learn more and apply](/non-profit) |
| Open-source projects | $300 in credits / month, first year | Contact support@langfuse.com |

## Frequently Asked Questions

**What is the easiest way to try Langfuse?**
You can view the [public example project](/demo) or sign up for a [free account](https://cloud.langfuse.com) to try Langfuse with your own data. The Hobby plan is completely free and does not require a credit card.

**Can I self-host Langfuse for free?**
Yes, Langfuse is open source and you can self-host it for free. Use Docker Compose to run Langfuse locally, or use one of the templates to self-host in production on Kubernetes. See the [self-hosting documentation](/self-hosting) to learn more.

**What is a billable unit?**
A billable unit is any tracing data point you send to Langfuse -- including the trace, observations (spans, events, generations), and scores (evaluations). See [billable units docs](/docs/administration/billable-units) for a detailed explanation.

**How does the graduated pricing work?**
Graduated pricing means you pay different rates for different volume tiers. The first 100k units are included in paid plans, then you pay $8/100k for 100k--1M, $7/100k for 1M--10M, $6.50/100k for 10M--50M, and $6/100k for 50M+ units. Use the pricing calculator on [langfuse.com/pricing](https://langfuse.com/pricing#pricing-calculator) to estimate your bill.

**How can I reduce my Langfuse Cloud bill?**
The primary way is to reduce the number of billable units you ingest. See [tips for cutting costs](/faq/all/cutting-costs). With graduated pricing, you automatically get lower rates as your volume increases.

**When do I get billed?**
You get one bill each month. The plan fee is charged at the start of the month, and usage is charged at the end of the month.

**Can I set up alerts on usage fees?**
Yes, you can configure [spend alerts](/docs/administration/spend-alerts) to receive email notifications when spending exceeds predefined thresholds.

**How can I manage my subscription?**
Through the organization settings in Langfuse Cloud or the [Customer Portal](/billing-portal).

**Can I redline the contracts?**
Yes, customized contracts are available for Enterprise customers with a yearly commitment. Contact enterprise@langfuse.com. Default plans are self-serve on standard terms.

**Where is the data stored?**
Langfuse Cloud is hosted on AWS. Data is stored in the US or EU depending on your selection. See [security documentation](/security) for details.
