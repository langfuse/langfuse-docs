# Technical persona review: Langfuse v4 launch post

Research date: 2026-08-11

Draft reviewed: [`content/blog/2026-08-13-langfuse-v4.mdx`](../content/blog/2026-08-13-langfuse-v4.mdx) at commit [`3db638955`](https://github.com/langfuse/langfuse-docs/tree/3db638955794353836bccd82bdd6cf6a68fd303e)

Personas:

1. Senior engineer integrating Langfuse through an SDK or public API
2. Observability/data-platform engineer evaluating the v4 storage and query architecture
3. Technical decision-maker checking the announcement against canonical product and migration documentation

Only first-party sources in this repository were used. Line references to the launch draft refer to the reviewed commit above.

## Executive summary

The post has a strong technical spine: it begins with the user-visible performance result, explains the observations-first model, translates that model into product workflows, and gives Cloud and self-hosted users separate migration paths. Its central claims about the observation model, SDK versions for real-time ingestion, replacement APIs, and the measured dashboard improvement are supported by the canonical docs.

It is not ready to publish unchanged from a technical-risk perspective. Two issues can cause readers to take the wrong action:

1. The post announces a three-month managed migration window and says project-specific emails will be sent, while the current canonical docs still say that the Cloud cutover date has not been announced and that v3 and v4 remain side by side. This needs an authoritative launch-program decision and synchronized docs, not merely a copy edit.
2. The self-hosted five-step summary omits the rule that a deployment starting in `legacy` must switch to a healthy `dual` write before enabling the one-time historic backfill. It also omits the current hard blocker for Helm deployments using the chart's built-in ClickHouse.

The architecture section is directionally correct but should distinguish the conceptual "one observations table" from the physical `events_full` plus `events_core` implementation, and "immutable" from the canonical "mostly immutable." The post also needs to qualify its root-observation default and the dashboard benchmark so readers do not interpret them as universal.

## Priority recommendations

### P0: resolve before publication

#### 1. Synchronize the Cloud launch state and deadline

**Draft lines:** 31–33, 100–114

The draft says v4 is live on Cloud, that affected users have three months, and that owners/admins will receive the exact actions for each project. The canonical upgrade guide still says the managed cutover date is unannounced and instructs users to enable a v4 preview toggle when present. The compatibility page likewise says Cloud runs v3 and v4 side by side until a future cutover. ([launch draft](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/blog/2026-08-13-langfuse-v4.mdx#L31-L33), [managed rollout guide](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/faq/all/upgrade-to-langfuse-v4.mdx#L38-L50), [compatibility page](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/docs/compatibility.mdx#L53-L57))

The repository contains no first-party source that verifies a three-month clock starting on August 13 or the exact email behavior described in the draft. The in-product migration panel is documented, but it does not substantiate the delivery, recipient, or deadline claims. ([upgrade checklist](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/faq/all/upgrade-to-langfuse-v4.mdx#L40-L53))

**Concrete change:** Before merging, either:

- update `/docs/v4`, `/docs/compatibility`, and the Cloud upgrade guide in the same launch change with the actual cutover date/window and final UI state; or
- change the post to the current documented state: "We will announce the managed cutover date separately. Until then, review Action required and complete the checks that apply to your project."

If personalized emails are confirmed operationally, add the exact start/end dates rather than the relative phrase "three months." That removes ambiguity for people discovering the article later.

#### 2. Make the self-hosted sequence safe for `legacy` starters

**Draft lines:** 118–126

The draft allows starting in either `legacy` or `dual`, then says to move historic data by automated backfill. The canonical guide explicitly requires the backfill to remain disabled in `legacy`; it runs once, and enabling it before dual write is active can leave a permanent gap in the new tables. The documented order is: migrate consumers, switch from `legacy` to `dual`, confirm dual-write health, and only then backfill or wait one retention period. ([write-mode warning](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L227-L244), [ordered migration steps](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L250-L304), [backfill safety rule](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L377-L381))

**Concrete change:** Replace steps 2–5 with:

1. Deploy v4 in `legacy` or `dual` mode.
2. Upgrade producers and migrate API consumers, evaluators, experiments, and exports.
3. If you started in `legacy`, switch to `dual` and verify the propagation health check.
4. After dual write is healthy, backfill historic data or dual-write for one full retention window.
5. Validate the new read path, then cut over to `events_only`.

Add one sentence that `events_only` is the point of commitment: old table writes stop, deprecated endpoints return `404`, incompatible SDKs are rejected, and trace-level evaluators stop. ([cutover behavior](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L310-L321), [rollback boundary](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L404-L408))

### P1: high-value corrections

#### 3. Surface the built-in ClickHouse Helm blocker

**Draft lines:** 31, 116–126

Self-hosted v4 is GA, but not every existing deployment topology can upgrade. The canonical guide says Helm deployments with `clickhouse.deploy: true` cannot upgrade yet because the bundled ClickHouse has no v4-compatible upgrade path. It also requires PostgreSQL 15+, Redis 7.0+, and ClickHouse 25.12+; an automated backfill needs roughly 3x ClickHouse disk headroom. ([infrastructure requirements and blocker](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L163-L181))

**Concrete change:** Add a warning directly below the self-hosted heading: "If your Helm deployment uses the chart's built-in ClickHouse (`clickhouse.deploy: true`), wait for the supported ClickHouse upgrade path before upgrading to v4." In the numbered list, change step 1 to "Verify all infrastructure minimums, including ClickHouse 25.12+, PostgreSQL 15+, and Redis 7.0+, and plan roughly 3x ClickHouse headroom if you will backfill."

#### 4. Qualify the root-observation default

**Draft line:** 84

The post says the root observation "is the default row" in the main table. The actual behavior is a default `Is Root Observation = true` filter, not one intrinsically designated row, and it applies for projects ingesting with Python SDK 4.7.0+ or JS/TS SDK 5.4.0+ when no saved view, shared link, or prior table state overrides it. Logical app roots can also have a physical parent. ([observations-table behavior](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/faq/all/explore-observations-in-v4.mdx#L36-L45), [dashboard model](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/faq/all/dashboard-changes-in-v4.mdx#L17-L25))

**Concrete change:** Use: "For projects on current SDKs, the Observations table opens with `Is Root Observation = true` by default, giving you a one-row-per-entry-point view. Remove the filter to search every operation. Saved views and shared links keep their own filters."

#### 5. Distinguish the conceptual model from physical storage

**Draft lines:** 68–75

The conceptual explanation is sound: observations are individual application steps, traces logically group observations by `trace_id`, and SDKs propagate trace attributes to observations. ([data model](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/docs/observability/data-model.mdx#L20-L30))

The physical implementation is more nuanced than the draft and diagram alt text imply. Self-hosted v4 introduces `events_full`, an immutable full-fidelity table, and `events_core`, a query-optimized projection with truncated payload fields. The canonical migration guide calls the model "mostly immutable," and the engineering deep dive notes intentional lightweight updates for operations such as bookmarking or publishing. ([physical tables](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L56-L65), [immutability caveat](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/blog/2026-03-10-simplify-langfuse-for-scale.mdx#L124-L160))

There is also a historic-data exception to "metadata lives on each observation": the backfill propagates trace name, user, session, version, release, tags, and public/bookmarked flags, but intentionally does not copy trace metadata to historic child observations. ([historic backfill fields](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L383-L400))

**Concrete change:** Keep the simple conceptual paragraph, but make the implementation sentence precise: "Conceptually, v4 queries one denormalized observations model. Physically, Langfuse keeps a full-fidelity events table and a lighter projection for table and chart queries. The main ingestion path writes completed observations once; a small set of UI mutations still use lightweight updates." Change "metadata lives on each observation" to "trace context such as user, session, and tags is propagated onto observations" or add the historic-backfill caveat.

#### 6. Scope the performance result to the measured workload

**Draft lines:** 25, 31, 72

"Dashboard load times for large projects improve by at least 10x" is supported, but the canonical source scopes it to dashboards over longer time ranges. It separately says initial table loads over large amounts of data go from seconds to milliseconds. The engineering deep dive describes table loads reaching tens of milliseconds and says the final gains came from both the new model and the `events_core` projection. ([canonical benchmark](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L14-L18), [implementation and benchmark context](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/blog/2026-03-10-simplify-langfuse-for-scale.mdx#L240-L271))

The headline and intro also group APIs and evaluations into the same unqualified performance statement. The docs specifically call Observations API v2 and Metrics API v2 significantly faster; they do not establish that every API or every evaluation job gets the 10x dashboard result. ([v4 feature list](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/docs/v4.mdx#L35-L42))

**Concrete change:** Use: "Initial table loads over large datasets drop from seconds to milliseconds, and dashboards over longer time ranges load at least 10x faster in large projects. The new Observations API v2 and Metrics API v2 use the same query model." Avoid making `10x` read as a promise for every table, API request, evaluator, or project size.

### P2: clarity and trust improvements

#### 7. Separate compatibility, deprecation, and real-time thresholds

**Draft lines:** 106–112, 120–126

Python 4.7.0+ and JS/TS 5.4.0+ are the thresholds for real-time v4 visibility. Earlier patch releases in the current majors can still ingest but may appear with about a ten-minute delay. Separately, `events_only` removes older major-version ingestion paths and deprecated read endpoints. ([SDK behavior](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L256-L272), [propagation behavior](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L366-L375))

The Cloud bullet correctly says "for real-time v4 ingestion," but the self-hosted phrase "upgrade SDKs" is underspecified and may make engineers confuse a recommended patch floor with the compatibility floor.

**Concrete change:** Add: "The 4.7.0/5.4.0 patch levels are the real-time thresholds, not the whole compatibility matrix. Use the compatibility guide to identify producers that will stop working at `events_only`." Mention the `x-langfuse-ingestion-version: 4` header for direct OTel exporters next to the SDK thresholds.

#### 8. Make the API migration row concrete

**Draft lines:** 88–94, 108–110

"Legacy ingestion and read APIs" combines two migrations. Legacy trace/span/generation/event ingestion moves to OTLP/HTTP. Deprecated reads move to Observations API v2, Metrics API v2, Scores API v3, and Experiments APIs. On self-hosted `legacy` or `dual`, old endpoints keep working; at `events_only`, listed legacy endpoints return `404` or reject unsupported event types. ([endpoint behavior](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L91-L153))

**Concrete change:** Split the table row into "Legacy ingestion → OTLP/HTTP" and "Deprecated reads → Observations v2, Metrics v2, Scores v3, and Experiments APIs." That gives SDK/API integrators an actionable mental model without reproducing the full endpoint matrix.

#### 9. Put evaluator constraints next to the evaluator benefit

**Draft lines:** 60–64, 90–92, 96

Observation-level evaluators can target LLM calls, retrievals, tool calls, and other individual observations, so the benefit is real. They only read fields on the matched observation, not siblings or children, and one score is produced for each matching observation. A migration can therefore require an instrumentation change or tighter name/type/root filters to preserve one score per trace. ([evaluator target and context](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/docs/evaluation/evaluation-methods/llm-as-a-judge.mdx#L110-L136), [migration cardinality](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/faq/all/llm-as-a-judge-migration.mdx#L99-L109), [multi-observation migration cases](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/faq/all/llm-as-a-judge-migration.mdx#L129-L142))

**Concrete change:** The feature card can stay concise, but change "Evaluate the relevant operation" to "Evaluate one matching operation" and link the migration table directly from the trace-level mapping row. Add a short note after the table: "Observation-level evaluators see one matched observation at a time; narrow filters or update instrumentation when a previous evaluator combined data from multiple spans."

#### 10. Acknowledge dashboard number and filter differences

**Draft lines:** 35, 55–58, 78

The chart workflow is correctly described and can save a widget to a dashboard, but the saved widget uses the dashboard's time range and requires dashboard edit permission. Charts and Pulse cannot aggregate every filter; score, metadata, comments, full-text, presence, and numeric-measure filters have documented limitations. ([chart behavior](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/docs/observability/features/events-table-charts.mdx#L57-L80), [Pulse filter limitations](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/docs/observability/features/pulse.mdx#L61-L76))

The migration can also change absolute dashboard values through synthetic root observations, approximate distinct trace counts, time-bucket boundaries, and revised score aggregation. ([dashboard differences](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/faq/all/dashboard-changes-in-v4.mdx#L43-L79), [expected numerical differences](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/faq/all/dashboard-changes-in-v4.mdx#L145-L161))

**Concrete change:** Do not burden the launch narrative with every filter limitation. Add one sentence in the migration section: "Dashboard totals can differ slightly from v3 because v4 counts and groups traces from observations; see the dashboard migration guide for expected differences." Link that sentence to `/faq/all/dashboard-changes-in-v4`.

## Claim audit

| Draft claim                                                                       |   Lines | Verdict                                                            | Severity | Evidence and recommended treatment                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| --------------------------------------------------------------------------------- | ------: | ------------------------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| v4 is live on Cloud and GA for self-hosted deployments                            |      31 | Partly supported, rollout state inconsistent                       | P0       | Self-hosted GA is documented, but Cloud docs still describe side-by-side preview and a future v4-only cutover. Synchronize launch-state docs. ([overview](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/docs/v4.mdx#L11-L18), [timeline](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/docs/v4.mdx#L44-L61))                                                                                                                                                                                  |
| Large-project dashboards improve by at least 10x                                  |  31, 72 | Supported with scope                                               | P1       | Canonical scope is dashboards over longer time ranges; retain that qualifier. ([self-host guide](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L14-L18))                                                                                                                                                                                                                                                                                                                               |
| Many Cloud users need no change                                                   |      33 | Not quantitatively substantiated                                   | P2       | New managed projects need no migration, but the repository provides no basis for "many." Use "New Cloud projects need no migration; existing projects should check Action required." ([Cloud guide](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/faq/all/upgrade-to-langfuse-v4.mdx#L8-L12))                                                                                                                                                                                                                                                   |
| Affected owners/admins get exact project actions and have three months            | 33, 114 | Unsupported by current canonical docs                              | P0       | The panel and organization overview are documented; recipient, email, and window claims are not. Current docs say cutover date unannounced. Confirm operational source and synchronize docs. ([Cloud rollout](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/faq/all/upgrade-to-langfuse-v4.mdx#L38-L53))                                                                                                                                                                                                                                        |
| v3 receives security patches through January 2027                                 |      33 | Supported                                                          | —        | Canonical guide says there is no self-host forced cutover and v3 receives security patches through January 2027. ([Cloud/self-host guide](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/faq/all/upgrade-to-langfuse-v4.mdx#L56-L60))                                                                                                                                                                                                                                                                                                            |
| Every operation is directly searchable                                            |  39, 44 | Supported as product framing, with search semantics                | P2       | Full-text search covers input/output and string metadata, but is token/phrase based rather than substring search; metadata matching through API is case-sensitive. Keep the card, avoid implying arbitrary substring search. ([search docs](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/docs/observability/features/full-text-search.mdx#L16-L36))                                                                                                                                                                                            |
| Pulse jumps from a spike to the causing observations                              |   49–51 | Supported                                                          | —        | Click or drag narrows the table to the selected time window. It identifies the observations in the spike, not causal attribution in the statistical sense. Current wording is acceptable. ([Pulse](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/docs/observability/features/pulse.mdx#L49-L72))                                                                                                                                                                                                                                                |
| A filtered table can become a chart and dashboard widget                          |   55–58 | Supported with constraints                                         | P2       | Requires dashboard edit permission; dashboard supplies the saved widget's time range; some filters cannot be aggregated. Link is appropriate. ([chart docs](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/docs/observability/features/events-table-charts.mdx#L57-L80))                                                                                                                                                                                                                                                                         |
| Trace context including metadata lives on every observation                       |      70 | Supported for current propagation, exception for historic backfill | P1       | Historic child observations intentionally do not receive trace metadata during backfill. Qualify the list or say "trace context is propagated." ([data model](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/docs/observability/data-model.mdx#L20-L30), [backfill exception](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L387-L393))                                                                                               |
| Observations are immutable for the main ingestion path                            |      72 | Substantially supported                                            | P2       | "Main ingestion path" appropriately narrows the claim, but physical tables use lightweight updates and backfill de-duplication. "Completed observations are written once on the direct path" is most precise. ([engineering deep dive](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/blog/2026-03-10-simplify-langfuse-for-scale.mdx#L124-L160), [backfill implementation](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L395-L400)) |
| A trace is observations sharing a `trace_id`                                      |      84 | Supported                                                          | —        | This is the canonical definition. ([data model](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/docs/observability/data-model.mdx#L20-L26))                                                                                                                                                                                                                                                                                                                                                                                                       |
| Root observation is the default row                                               |      84 | Overgeneralized                                                    | P1       | It is a default filter for current SDKs under specific table-state conditions; logical roots are not always physical roots. Qualify. ([observations guide](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/faq/all/explore-observations-in-v4.mdx#L36-L45))                                                                                                                                                                                                                                                                                       |
| Experiments no longer need to be tied to datasets                                 |      96 | Supported but broad                                                | P2       | SDK experiments can use local data; UI experiments still use datasets. Prefer "Experiments can run from datasets or local test data." ([LLM-as-a-Judge experiment flow](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/docs/evaluation/evaluation-methods/llm-as-a-judge.mdx#L148-L163))                                                                                                                                                                                                                                                         |
| Python 4.7.0+ / JS 5.4.0+ provide real-time v4 ingestion                          |     108 | Supported                                                          | —        | Older current-major patches may still ingest with about ten-minute delay. The direct OTel equivalent is the v4 ingestion header. ([self-host SDK guidance](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L256-L266))                                                                                                                                                                                                                                                                   |
| `legacy` and `dual` let self-hosters separate server and model cutover            | 118–122 | Supported with lifecycle caveat                                    | P1       | They are temporary migration modes scheduled for removal in a future major version, not permanent operating modes. ([write modes](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L183-L194))                                                                                                                                                                                                                                                                                            |
| Historic data can be backfilled or covered by one retention period of dual writes |     123 | Supported, sequence omitted                                        | P0       | Backfill only after healthy dual write; rollover only fits deployments with an enforced global retention policy. ([historic options](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L286-L304))                                                                                                                                                                                                                                                                                         |

## Persona reactions

### Senior SDK/API integrator

**What works:** The post correctly names the current real-time SDK patch floors and the four replacement API families. Splitting Cloud from self-hosted is useful, and the migration table provides a fast inventory of affected surfaces.

**Where trust drops:** "Upgrade SDKs" does not tell this reader whether an older producer stops ingesting, merely becomes delayed, or only loses deprecated `api.*` access. The API row merges ingestion and reads, despite their different replacements. Direct OTel users need the v4 ingestion header and client-side context propagation, not only a new URL. Evaluator users need to know that one matched observation produces one score and cannot read sibling/child data automatically. ([compatibility FAQ](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/docs/compatibility.mdx#L195-L215), [evaluator context](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/docs/evaluation/evaluation-methods/llm-as-a-judge.mdx#L117-L136))

**Best improvement:** Keep the post's concise checklist, but use precise labels: "real-time threshold," "removed at cutover," "OTLP/HTTP ingestion," and the four replacement read API families. Link each mapping row to its migration guide rather than only linking one general guide after the list.

### Observability/data-platform engineer

**What works:** The post connects the user-visible query model to denormalization, immutable direct writes, ClickHouse scans, and removal of read-time joins/deduplication. The schema image supports the conceptual v3-to-v4 shift, and the deep-dive link gives readers the implementation history.

**Where trust drops:** Calling the implementation one immutable table hides `events_full`, `events_core`, lightweight updates, synthetic/virtual roots, and backfill de-duplication. These are reasonable engineering choices, but omitting them makes the explanation sound cleaner than the system actually is. Export consumers also need to understand that "enriched observations" changes the exported event shape and that downstream per-trace metrics must be recomputed by grouping observations, not merely repointed. The canonical integrations docs explicitly warn that event coverage and volume can change. ([physical model](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L56-L65), [PostHog migration implications](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/integrations/analytics/posthog.mdx#L151-L186), [Mixpanel migration implications](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/integrations/analytics/mixpanel.mdx#L168-L203))

**Best improvement:** Add one implementation-precision sentence below the diagram and make the export bullet say "migrate each integration and its downstream consumer to enriched observations." Link to the export-specific guide.

### Technical decision-maker

**What works:** The post answers the first-order questions quickly: what changed, why it matters, whether Cloud or self-hosted users need to act, how support differs, and where detailed migration documentation lives.

**Where trust drops:** The launch state and migration window do not agree with the current canonical docs. The 10x statement lacks its measured workload qualifier. The self-hosted section omits an upgrade-blocking Helm topology and the storage headroom needed for backfill. The phrase "when you are ready" could also suggest `legacy`/`dual` are indefinite supported end states, while the guide says they are migration utilities planned for removal. ([Cloud state](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/docs/compatibility.mdx#L22-L31), [self-host constraints](https://github.com/langfuse/langfuse-docs/blob/3db638955794353836bccd82bdd6cf6a68fd303e/content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L163-L188))

**Best improvement:** Make the deadline absolute and source-backed, state the benchmark scope, add the Helm warning, and describe `events_only` as the intended final state and point of commitment.

## Suggested revised technical passages

These are surgical changes, not a full rewrite.

### Performance and architecture

> Initial table loads over large datasets drop from seconds to milliseconds, while dashboards over longer time ranges load at least 10x faster in large projects. Observations API v2 and Metrics API v2 use the same observations-first query model.
>
> Conceptually, v4 queries one denormalized observations model: a trace is the set of observations sharing a `trace_id`, and trace context such as user, session, and tags is propagated onto those observations. Physically, Langfuse stores full-fidelity events plus a lighter projection for table and chart queries. Completed observations are written once on the direct ingestion path; a small set of UI mutations still uses lightweight updates.

### Root observations

> For projects on current SDKs, the Observations table opens with `Is Root Observation = true` by default, giving you a one-row-per-entry-point view. Remove the filter to search every operation. Saved views and shared links keep their own filters.

### Self-hosted flow

> Before upgrading, verify all infrastructure minimums. Helm deployments using the chart's built-in ClickHouse (`clickhouse.deploy: true`) must wait for a supported ClickHouse upgrade path. If you plan to backfill historic data, budget roughly 3x your current ClickHouse data volume.
>
> 1. Upgrade ClickHouse to 25.12 or later, PostgreSQL to 15 or later, and Redis to 7.0 or later.
> 2. Deploy v4 in `legacy` or `dual` write mode.
> 3. Upgrade producers and migrate deprecated API consumers, evaluators, experiments, exports, and their downstream consumers.
> 4. If you started in `legacy`, switch to `dual` and verify event propagation is healthy.
> 5. After dual write is healthy, backfill historic data or keep dual writing for one full enforced retention period.
> 6. Validate the new read path, then switch to `events_only`. This is the point of commitment: old table writes stop, deprecated endpoints return `404`, incompatible SDKs are rejected, and trace-level evaluators stop.

## Conclusion

The post is technically persuasive and substantially aligned with the v4 docs. Fix the Cloud rollout contradiction and self-hosted sequence before publication. Then add the Helm blocker, root-filter qualification, and architecture/performance precision. Those changes preserve the post's pace while materially improving safety and credibility for technical readers.
