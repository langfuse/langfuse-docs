# Langfuse v4 launch post: consolidated persona review

Research date: 2026-08-11

Scope: [`content/blog/2026-08-13-langfuse-v4.mdx`](../content/blog/2026-08-13-langfuse-v4.mdx) at commit [`3db638955`](https://github.com/langfuse/langfuse-docs/tree/3db638955794353836bccd82bdd6cf6a68fd303e)

This review consolidates three independent, evidence-backed reviews covering nine reader personas:

1. A person new to Langfuse
2. A non-technical product or AI lead
3. A Langfuse Cloud project owner
4. A Cloud v3 user with migration work
5. A self-hosted production operator
6. A user skeptical after migration or data-visibility issues
7. A senior SDK or API integrator
8. An observability or data-platform engineer
9. A technical decision-maker

The detailed reviews are:

- [Newcomer, non-technical lead, and Cloud owner](./langfuse-v4-launch-review-newcomer.md)
- [Cloud upgrader, self-hosted operator, and skeptical user](./langfuse-v4-launch-review-upgrade.md)
- [SDK/API integrator, data-platform engineer, and technical decision-maker](./langfuse-v4-launch-review-technical.md)

Product, rollout, and migration claims were checked against first-party Langfuse documentation, source files, release material, and GitHub discussions. Persona reactions are reviewer inferences.

## Recommendation

**Request changes before merging the launch post.**

The post has a strong launch story: a concrete performance result, recognizable debugging and evaluation use cases, a clear observations-first explanation, and separate Cloud and self-hosted paths. The visual cards and migration screenshot also make it easy to scan.

Two issues should block publication:

1. The post promises a three-month Cloud migration window, while every linked canonical source says the managed cutover date is not yet announced.
2. The self-hosted summary can lead an operator through an unsafe sequence because it does not say that `events_only` is the v4 default or that a deployment starting in `legacy` must switch to a healthy `dual` write before enabling the one-time historic backfill.

The post should then be improved for audience routing, self-hosted constraints, and technical precision. These can be done without turning the launch announcement into a migration manual.

## Where the personas agree

| Reader                   | What already works                                               | Main point of friction                                                         | Best improvement                                                      |
| ------------------------ | ---------------------------------------------------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| New to Langfuse          | Failure, cost, and evaluation examples make the product tangible | Migration language arrives before reassurance that there is nothing to migrate | Add a new-user route and Get started CTA near the top                 |
| Non-technical lead       | Outcomes map to reliability, cost, and quality                   | ClickHouse and migration details interrupt the product story                   | Put outcomes and required action before architecture                  |
| Cloud owner              | The migration panel and conditional checklist are strong         | The direct action and source of truth appear too late                          | Put **Action Required** immediately after the opening                 |
| Cloud upgrader           | SDK, API, evaluator, and export categories are useful            | Deadline and failure modes are ambiguous                                       | Use an exact source-backed deadline and say what stops at cutover     |
| Self-hosted operator     | Separate migration modes and staged steps build confidence       | Defaults, blockers, resource needs, and rollback boundary are hidden           | Surface the safe pre-deploy decision and operational constraints      |
| Skeptical user           | The architecture and benchmark are credible                      | Expected delay and gradual backfill can look like data loss                    | State expected migration behavior and validation checkpoints          |
| SDK/API integrator       | Real-time SDK patch floors and replacement APIs are named        | Compatibility, real-time freshness, and removed endpoints are conflated        | Label each threshold and split ingestion from read API migration      |
| Data-platform engineer   | Denormalization and removal of joins explain the speedup         | The physical model sounds simpler and more immutable than it is                | Distinguish the conceptual model from `events_full` and `events_core` |
| Technical decision-maker | The post covers value, architecture, and rollout in one place    | The strongest claims do not all match canonical rollout and constraint docs    | Resolve source-of-truth conflicts and qualify benchmarks              |

## P0: resolve before publication

### 1. Reconcile the Cloud deadline and launch state

The post says affected users have three months and will receive exact project actions by email. The current [Cloud upgrade guide](../content/faq/all/upgrade-to-langfuse-v4.mdx), [v4 overview](../content/docs/v4.mdx), [compatibility page](../content/docs/compatibility.mdx), and [`VersionTimeline`](../components/VersionTimeline.tsx) all say the managed cutover date will be announced later. They also still describe a side-by-side preview state for some organizations.

This is the clearest consensus finding across all three reviews. It is a source-of-truth issue, not a stylistic preference.

Recommended implementation:

- If the launch establishes the deadline, publish an exact calendar date rather than an evergreen relative duration. Update the overview, Cloud upgrade guide, compatibility page, timeline component, and shared compatibility details in the same change.
- If the deadline is not approved, replace the duration with: “We will announce the managed cutover date separately. Until then, review **Action Required** and complete the checks that apply to your project.”
- Confirm the recipient query, delivery behavior, and project-action personalization before promising that owners and admins “will” receive exact actions. In all cases, describe the in-app checklist as the durable source of truth.

Primary sources: [v4 overview](https://langfuse.com/docs/v4#timeline), [Cloud upgrade guide](https://langfuse.com/faq/all/upgrade-to-langfuse-v4#managed), and [compatibility documentation](https://langfuse.com/docs/compatibility#sdk-server).

### 2. Correct the self-hosted migration sequence

The current five-step summary allows a deployment to start in `legacy`, then moves directly to historic backfill. The [self-hosted upgrade guide](../content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx) says the backfill must remain disabled in `legacy`. It runs once, so enabling it before dual write is healthy can leave data ingested in the intervening period permanently absent from the new tables.

The summary must also state that `events_only` is the v4 default. Without migration overrides, incompatible SDK data is rejected, legacy endpoints stop working, trace-level evaluators stop, legacy exports stop, and the historic backfill starts automatically.

Recommended replacement sequence:

1. Verify infrastructure minimums and upgrade ClickHouse before the Langfuse server.
2. Before the first v4 deployment, choose `legacy` to retain full v3 behavior or `dual` to write both models while validating v4. Use the default `events_only` only when all producers and consumers are compatible.
3. Upgrade producers and migrate API consumers, evaluators, experiments, custom OpenTelemetry ingestion, exports, and their downstream consumers.
4. If you started in `legacy`, switch to `dual` and verify event propagation is healthy.
5. After dual write is healthy, run the historic backfill or dual-write for one full enforced retention period.
6. Validate the new read path, then switch to `events_only`. This is the point of commitment for rollback to the v3 read path.

Primary sources: [write modes](https://langfuse.com/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4#step-2), [historic-data options](https://langfuse.com/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4#historic-data), and [rollback boundary](https://langfuse.com/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4#rollback).

## P1: high-value changes

### 3. Add an audience router immediately after the opening

The post currently asks all readers to process Cloud migration language before it gives newcomers a path or Cloud owners a direct action. A three-row block would answer “What does this mean for me?” without adding much length:

- **New to Langfuse:** Nothing to migrate. Follow [Get started](/docs/observability/get-started); it already uses v4.
- **Existing Cloud project:** Open **Action Required**. Only the actions detected for your project apply.
- **Self-hosted:** Upgrade on your schedule. Review the topology and infrastructure constraints before deploying v4.

This directly follows the audience split already used by the [v4 overview](../content/docs/v4.mdx) and [upgrade guide](../content/faq/all/upgrade-to-langfuse-v4.mdx).

### 4. Surface the self-hosted blocker and resource requirements

The current post says self-hosted v4 is GA, but one supported deployment topology cannot yet upgrade: Helm installations using the chart’s bundled ClickHouse (`clickhouse.deploy: true`). Deployments using external ClickHouse are unaffected.

The post should also name the minimum versions and the backfill condition:

- ClickHouse 25.12 or later
- PostgreSQL 15 or later
- Redis 7.0 or later
- Roughly 3x current ClickHouse data-volume headroom for an automated historic backfill

This belongs in a compact warning directly under the self-hosted heading. It determines whether and how a reader can act on the announcement.

Primary source: [self-hosted infrastructure requirements](https://langfuse.com/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4#step-1).

### 5. Put value and action before implementation detail

The four capability cards are one of the strongest parts of the post. Keep them directly after the audience router. Move the Cloud checklist and self-hosted routing ahead of, or directly adjacent to, the interface-migration table. Keep the ClickHouse explanation and schema visual later as “How it works.”

Recommended high-level order:

1. Hero and measured outcome
2. What this means for you
3. What you can do now
4. Cloud and self-hosted actions
5. What changed in the product
6. How the architecture makes it faster
7. Choose your next step

This gives non-technical readers a complete journey before the technical deep dive while preserving the technical explanation for engineers.

### 6. Define observations and traces in plain language

At first use, add:

> Every step in an application, such as an LLM call, tool call, or retrieval, is an observation. A trace groups the observations for one request.

Then introduce “observations-first.” This is consistent with the [canonical data model](https://langfuse.com/docs/observability/data-model#observations-and-traces) and prevents newcomers from having to infer the key term.

### 7. Make the performance and architecture language precise

Use the measured benchmark scope:

> Initial table loads over large datasets drop from seconds to milliseconds, while dashboards over longer time ranges load at least 10x faster in large projects. Observations API v2 and Metrics API v2 use the same query model.

Avoid making 10x sound like a guarantee for every API request, evaluator, project size, or dashboard.

For the implementation, distinguish the simple conceptual model from physical storage:

> Conceptually, v4 queries one denormalized observations model. Physically, Langfuse keeps a full-fidelity events table and a lighter projection for table and chart queries. Completed observations are written once on the direct ingestion path; a small set of UI mutations still uses lightweight updates.

This matches the [self-hosted data-model reference](https://langfuse.com/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4#data-model) and [technical deep dive](https://langfuse.com/blog/2026-03-10-simplify-langfuse-for-scale) without overloading the launch story.

### 8. Make API and SDK migration labels actionable

The migration table currently combines legacy ingestion and deprecated reads. Split it into:

- **Legacy trace/span/generation/event ingestion** → OTLP/HTTP ingestion
- **Deprecated read APIs** → Observations API v2, Metrics API v2, Scores API v3, and Experiments APIs

Keep Python 4.7.0+ and JS/TS 5.4.0+ labeled as **real-time v4 thresholds**. Earlier current-major patches may still ingest with an approximately ten-minute delay; older incompatible majors fail at `events_only`. Direct OpenTelemetry exporters need the v4 ingestion header plus the new attribute and immutable-span semantics, not just a new URL.

Primary sources: [compatibility matrix](https://langfuse.com/docs/compatibility#sdk-server), [custom ingestion migration](https://langfuse.com/integrations/native/opentelemetry/migration-to-v4), and [deprecated API migration](https://langfuse.com/faq/all/deprecated-api-migration).

### 9. Restore a true new-user CTA

The closing cards currently route only to the v4 overview, compatibility, and GitHub Discussion. Replace or add a first card for **Get started with Langfuse**. Keep migration and architecture resources for existing users.

Suggested CTA set:

1. Get started with Langfuse
2. Check your v4 migration path
3. Upgrade a self-hosted deployment
4. Read the architecture deep dive or ask in GitHub Discussions

## P2: useful, but keep out of the main narrative

These issues are real, but the launch post should link to canonical guides rather than reproduce every caveat:

- Observation-level evaluators see one matching observation at a time and can change score cardinality.
- Dashboard totals can differ slightly because of root-observation bucketing, synthetic roots, and revised aggregation.
- Blob storage, PostHog, and Mixpanel migration includes downstream consumer and schema changes, not only a setting change.
- During `dual`, older producer data can take about ten minutes to appear in v4.
- Historic backfill is online and resumable but appears gradually, newest first, and may take minutes to days.
- Saved views and shared links can override the default root-observation filter.

The launch post needs one sentence on expected migration behavior and one link per affected surface. The migration guides should retain the full detail.

## Evidence from users who encountered migration uncertainty

The first-party [self-hosted v4 discussion](https://github.com/orgs/langfuse/discussions/14157) contains recurring questions about:

- whether the preview applied to fresh or existing deployments;
- whether adopting the preview would preserve a path to GA;
- whether upgrading SDKs before the server was safe;
- whether apparently missing traces were data loss or delayed processing;
- whether environment-variable spelling and case changed startup behavior.

The stable guide now answers these questions, but the discussion shows why the launch post should clearly name the safe sequence, expected delay, historic-data behavior, and rollback boundary. This is especially important for readers who have already experienced a difficult database migration.

## Suggested replacement opening

> Langfuse v4 is live on Langfuse Cloud and generally available for self-hosted deployments. It makes it faster to debug, evaluate, and monitor complex LLM applications by letting you work with every LLM call, tool execution, and agent step directly. Initial table loads over large datasets drop from seconds to milliseconds, and dashboards over longer time ranges load at least 10x faster in large projects.
>
> **New to Langfuse?** There is nothing to migrate. Follow the [Get started guide](/docs/observability/get-started); it already uses v4.
>
> **Already using Langfuse Cloud?** Open **Action Required** in the sidebar. You only need to complete the actions detected for your project. The in-app checklist is the source of truth for your migration status. **Self-hosting Langfuse?** Upgrade on your schedule; v3 continues to receive security patches through January 2027, but check the v4 infrastructure and topology requirements before scheduling the upgrade.
>
> With v4, you can find the failed tool call inside a long-running agent, isolate the model calls driving a cost spike, or score one sub-agent’s output directly. Filter the Observations table, turn that result into a chart, and save it to a dashboard without building a separate query.

Add the approved Cloud deadline and email wording only after the canonical rollout sources and notification behavior are synchronized.

## Suggested implementation sequence

1. Decide the authoritative Cloud cutover date and email behavior.
2. Update all rollout sources together or soften the blog to the current documented state.
3. Add the three-audience router and new-user CTA.
4. Replace the self-hosted summary with the safe sequence and availability warning.
5. Tighten the performance, architecture, SDK, and API wording.
6. Keep detailed evaluator, dashboard, export, and migration caveats in linked guides.
7. Re-render the post on desktop and mobile and verify the new callout does not overwhelm the hero.

The individual research memos contain exact line references and additional replacement copy for each persona.
