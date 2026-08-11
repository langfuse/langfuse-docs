# Langfuse v4 launch post: upgrade-focused persona review

## Scope and recommendation

This memo reviews [`content/blog/2026-08-13-langfuse-v4.mdx`](../content/blog/2026-08-13-langfuse-v4.mdx) as:

1. a Langfuse Cloud v3 user with migration work;
2. a self-hosted production operator planning the server upgrade; and
3. a skeptical user who has previously seen missing traces, delayed data, or migration-related performance trouble.

The review uses only first-party material in this repository as factual authority. The post has a good high-level shape, but I would not publish it unchanged. One Cloud timeline statement conflicts with the current canonical docs, and the self-hosted summary omits two unusually consequential facts: `events_only` is the default write mode, and Helm installations with bundled ClickHouse cannot currently upgrade.

## Priority summary

| Severity | Finding                                                                                                                                                                                                                                          | Affected post lines | Recommended implementation                                                                                                                                                                                            |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Critical | The promised “three-month migration window” conflicts with every current Cloud timeline source, which says the cutover date has not been announced.                                                                                              | 33, 114             | Either remove the duration, or publish an exact calendar deadline and update the overview, upgrade guide, compatibility page, timeline component, and shared compatibility details in the same PR.                    |
| Critical | The self-hosted list does not warn that `events_only` is the v4 default. A normal upgrade without migration overrides can immediately reject incompatible SDKs, remove legacy endpoints, stop legacy evaluators/exports, and start the backfill. | 118–124             | Put a warning before the numbered list: choose and configure `legacy` or `dual` **before** deploying v4 unless every producer and consumer is already compatible.                                                     |
| High     | The blog invites all self-hosters to upgrade but does not expose the current blocker for Helm deployments using bundled ClickHouse.                                                                                                              | 31, 118–126         | Add a concise availability callout that `clickhouse.deploy: true` cannot upgrade yet; external ClickHouse deployments are unaffected.                                                                                 |
| High     | “Upgrade the required infrastructure” names only ClickHouse and hides PostgreSQL, Redis, and roughly 3x ClickHouse disk headroom for a backfill.                                                                                                 | 120, 123            | Name all minimums in compact form and attach the 3x storage condition to the backfill option.                                                                                                                         |
| High     | The Cloud section does not say what fails if a detected action is ignored.                                                                                                                                                                       | 106–114             | Add one sentence tying the checklist to concrete cutover effects: old trace ingestion stops, removed read APIs return `404`, legacy evaluators stop, and legacy exports switch/stop according to deployment behavior. |
| High     | “Retain current behavior” treats `legacy` and `dual` as equivalent. Only `legacy` retains full v3 behavior; `dual` exposes/testing the new model and has delayed propagation for older producers plus extra load/cost.                           | 121                 | Split the modes: `legacy` for unchanged v3 behavior; `dual` to populate both models while validating v4.                                                                                                              |
| Medium   | The blog says the guide covers validation and rollback, but gives skeptical operators no safety checkpoint or point-of-commitment warning.                                                                                                       | 123–126             | Add a validation step before `events_only`, and state that rollback without data gaps is available only while old tables continue receiving writes.                                                                   |
| Medium   | The backfill/rollover sentence can make temporary data gaps look like data loss.                                                                                                                                                                 | 123                 | Say that backfill is online, gradual, newest-first, and may take minutes to days; retention rollover is valid only with an enforced global retention policy.                                                          |
| Medium   | The exact email-recipient and per-project-action promises have no first-party implementation or docs source in this repository.                                                                                                                  | 33, 114             | Keep only if the notification pipeline and recipient rules are independently verified; otherwise phrase as an intent and link the in-app checklist as the source of truth.                                            |
| Medium   | The migration table understates semantic changes to evaluators and dashboards.                                                                                                                                                                   | 88–96               | Add a short “validate behavior, not just availability” note: evaluator score cardinality can change, and root-observation/time-bucketing behavior can affect charts.                                                  |

## Persona 1: Langfuse Cloud v3 user who must migrate

### Walkthrough

The opening tells me that many users need no action, that an email will identify my project-specific work, and that I have three months ([post lines 31–35](../content/blog/2026-08-13-langfuse-v4.mdx#L31)). The Cloud section then points me to **Action required**, lists possible action categories, repeats the email promise, and repeats the three-month window ([post lines 98–114](../content/blog/2026-08-13-langfuse-v4.mdx#L98)).

That is easy to scan, but I cannot answer the operational questions I care about:

- What is the actual deadline?
- Is the deadline organization-wide, per project, or three months from the email?
- What specifically stops working at cutover if an action is still open?
- If the email is missed or an owner changed, is **Action required** the authoritative checklist?
- Does “upgrade SDK” mean “data is otherwise lost,” or only “data is delayed” before cutover?

### Friction points and evidence

#### 1. The deadline is contradictory — Critical

The blog claims a three-month window twice. The official Cloud upgrade guide says, “The managed cutover date has not been announced” ([`content/faq/all/upgrade-to-langfuse-v4.mdx`, lines 38–44](../content/faq/all/upgrade-to-langfuse-v4.mdx#L38)). The v4 overview says pre-April-14 organizations can toggle until Cloud becomes v4-only and that the “date will follow” ([`content/docs/v4.mdx`, lines 44–55](../content/docs/v4.mdx#L44)). The compatibility page likewise says deprecated behavior lasts until a cutover whose date will follow ([`content/docs/compatibility.mdx`, lines 108–159](../content/docs/compatibility.mdx#L108)). The timeline implementation hard-codes “the exact date will follow” even though its visual segment begins in November ([`components/VersionTimeline.tsx`, lines 46–61 and 90–94](../components/VersionTimeline.tsx#L46)).

This is not a minor wording mismatch. A user may derive an enforceable production deadline from the blog while every linked source says no deadline exists.

**Concrete change:** choose one source of truth before launch.

- If the date is not final, replace both instances of “three months” with: “Complete the detected actions before the Cloud cutover. We will publish the exact date in the v4 timeline and notify project owners and admins.”
- If the launch announces the deadline, use an exact date rather than “three months,” define whether it is global or per-project, and update all cited pages/components in the same implementation. A relative duration in an evergreen blog becomes ambiguous immediately.

#### 2. The post lists work but not consequences — High

The linked compatibility source is explicit: Python SDK v2 and JS/TS SDK v3 and older lose trace ingestion at Cloud cutover; deprecated read APIs are removed; older current-major SDK patches can show up to a ten-minute delay ([`content/docs/compatibility.mdx`, lines 108–159 and 195–215](../content/docs/compatibility.mdx#L108)). Shared first-party compatibility details add that trace-level evaluators stop and legacy exports are automatically switched at Cloud cutover ([`components-mdx/compat/detail-trace-level-evaluators.mdx`](../components-mdx/compat/detail-trace-level-evaluators.mdx), [`components-mdx/compat/detail-legacy-export-source.mdx`](../components-mdx/compat/detail-legacy-export-source.mdx)).

The blog's generic “replace deprecated API calls” language does not convey the failure mode. A production owner needs to distinguish “recommended for real time” from “required to keep ingesting after cutover.”

**Concrete change:** add after the checklist:

> Before cutover, older current-major SDK patches may show data with up to a ten-minute delay. At cutover, legacy trace ingestion stops, deprecated read endpoints return `404`, and legacy trace-level evaluators stop producing scores. Treat **Action required** as the source of truth for which of these affect your project.

The export behavior should be worded separately because Cloud automatically switches remaining legacy exports according to the shared compatibility detail; saying all exports simply “stop” would be wrong.

#### 3. The email promise is not verifiable in this repo — Medium

The official upgrade guide verifies the in-app states (**Up to date**, **Not detected**, or an affected-item count) and the organization-wide **Migration Status** page ([`content/faq/all/upgrade-to-langfuse-v4.mdx`, lines 40–53](../content/faq/all/upgrade-to-langfuse-v4.mdx#L40)). It does not document an email, recipient selection, delivery timing, or the guarantee that an email contains “only” detected actions. No other repository source found by this review defines those semantics.

This does not prove the promise is false; it means the launch copy depends on an external implementation contract.

**Concrete change:** verify the mail pipeline and recipient query before preserving “will send.” In either case, make the app durable source of truth:

> We will also email project owners and admins a summary of detected actions. The live checklist in **Action required** is the source of truth for project status.

## Persona 2: self-hosted production operator

### Walkthrough

The self-hosted section offers five compact steps and a link to the full guide ([post lines 116–126](../content/blog/2026-08-13-langfuse-v4.mdx#L116)). As a production operator, I like the staged shape, but I need to know what must be decided before the first v4 pod starts. The current text makes the high-risk choices look like later details.

### Friction points and evidence

#### 4. The safe write-mode decision must happen before deployment — Critical

The full guide says `events_only` is the v4 default. With no override, writes go only to the new tables, the historic backfill starts automatically, and incompatible SDK data is rejected ([`content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx`, lines 183–198](../content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L183)). Under `events_only`, legacy ingestion/read endpoints return errors, legacy evaluators stop, and the legacy export source stops producing data ([same guide, lines 43–54 and 94–161](../content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L43)).

The post says to deploy in `legacy` “or” `dual` to retain current behavior. This is directionally safe but too easy to treat as an optional later configuration detail. It also blurs the modes: the guide says `legacy` retains full v3 ingestion/read behavior, whereas `dual` writes both models, allows v4 opt-in, delays older SDK data by about ten minutes in the new model, and costs more than `events_only` ([same guide, lines 202–242](../content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L202)).

**Concrete change:** replace step 2 with a pre-deploy decision:

> **Before the first v4 deployment, choose a write mode.** Use `legacy` to keep the full v3 ingestion and read behavior while separating the server upgrade from the data migration. Use `dual` to write both models while you validate v4. The default, `events_only`, is appropriate only after all producers, API consumers, evaluators, experiments, and exports are compatible.

#### 5. Infrastructure prerequisites and a current Helm blocker are hidden — High

The blog names only ClickHouse 25.12. The official guide requires ClickHouse 25.12 minimum (26.4 recommended), PostgreSQL 15 minimum, and Redis 7.0 minimum, and requires ClickHouse to be upgraded before the server ([same guide, lines 163–173](../content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L163)). More importantly, Helm deployments with bundled ClickHouse (`clickhouse.deploy: true`) cannot currently upgrade; installations using external ClickHouse are unaffected ([same guide, lines 175–179](../content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L175)).

That blocker changes whether a large audience can act on a GA launch announcement at all.

**Concrete change:** add a warning callout immediately below the self-hosted heading:

> **Check your deployment before scheduling the upgrade.** v4 requires ClickHouse 25.12+, PostgreSQL 15+, and Redis 7.0+. Helm deployments using the bundled ClickHouse (`clickhouse.deploy: true`) do not yet have an upgrade path; external ClickHouse deployments are unaffected.

#### 6. Historic-data options need resource and eligibility conditions — High

The blog says “automated background backfill or keep dual writing for one retention period” without conditions. The backfill requires roughly 3x current ClickHouse data-volume headroom ([same guide, lines 29–39 and 181](../content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L29)). It must only be enabled after dual write is active and healthy; otherwise a window of ingested data can be permanently absent from the new tables ([same guide, lines 240–242 and 377–381](../content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L240)). Retention rollover is valid only when a global retention policy is enforced and dual write remains active for one entire window ([same guide, lines 286–304](../content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L286)).

**Concrete change:** expand step 4 to:

> After dual write is healthy, either run the online historic backfill (plan for roughly 3x ClickHouse disk headroom) or, if you enforce global retention, dual-write for one full retention window. Backfilled data appears gradually, newest first.

#### 7. The cutover is a point of commitment, not just the last step — Medium

While `legacy` or `dual` continues writing the old tables, a server rollback to the latest v3 release preserves data. After `events_only`, a v3 read path misses all data written since cutover ([same guide, lines 404–408](../content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L404)). The post's final step says only “when the new data path is complete.” It provides no minimum validation gate.

**Concrete change:** replace step 5 with:

> Validate direct-ingestion canaries, API reads, evaluator score counts, exports, and historic-data coverage. Then switch to `events_only`. This is the point of commitment: rollback to a v3 read path after it would omit data written since cutover.

The full guide also recommends a worker health probe for stuck dual-write propagation ([same guide, lines 219–223](../content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L219)); linking “validation” directly to the guide's dual-write health section would make the abbreviated post useful without copying configuration.

## Persona 3: skeptical user with prior migration or performance trouble

### Walkthrough

The post asks me to trust “at least 10x,” immutability, and a clean five-step upgrade. My skepticism is not hypothetical: Langfuse's own engineering account says early dual-write results looked strong before individual records went missing and propagation slowed substantially; it then explains the fixes ([`content/blog/2026-03-10-simplify-langfuse-for-scale.mdx`, lines 183–209](../content/blog/2026-03-10-simplify-langfuse-for-scale.mdx#L183)). The concern is not that those bugs still exist. It is that the launch post does not show me how to distinguish an expected delay or backfill gap from a new failure.

### Friction points and evidence

#### 8. Expected delay and gradual backfill can be mistaken for data loss — Medium

Older SDKs and OTel without the v4 ingestion header can appear with an approximately ten-minute delay during dual write. Staging data is kept for 48 hours, and a worker health endpoint detects propagation stalls ([self-hosted guide, lines 366–375](../content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L366)). Historic backfill is resumable and online but appears gradually, newest first, and can take minutes to days ([same guide, lines 377–402 and 432–436](../content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L377)).

**Concrete change:** add a short “what to expect while migrating” note:

> During `dual`, data from older producers can take about ten minutes to reach the v4 view. Historic data appears gradually, newest first, during backfill. Monitor the dual-write worker health check and background-migration status before treating either as missing data.

This is better trust-building than a generic statement that the guide contains validation.

#### 9. Custom OTEL migration needs a canary, not just a path change — High

The blog says to “move custom REST or OpenTelemetry ingestion to the v4 OTLP/HTTP path.” The official migration guide explicitly warns that adding the v4 header alone does not make a legacy or incomplete span format ready: trace-wide attributes must be propagated, overall input/output must move to the root observation, and a complete immutable span should be exported once ([`content/integrations/native/opentelemetry/migration-to-v4.mdx`, lines 15–38 and 78–125](../content/integrations/native/opentelemetry/migration-to-v4.mdx#L15)). Re-ingesting an ID can create duplicates and inflate metrics ([same guide, lines 109–113](../content/integrations/native/opentelemetry/migration-to-v4.mdx#L109)). The guide requires a canary and lists the hierarchy, attributes, usage/cost, evaluator, and API checks to perform ([same guide, lines 127–143](../content/integrations/native/opentelemetry/migration-to-v4.mdx#L127)).

**Concrete change:** make the checklist item say:

> Migrate custom REST or OpenTelemetry ingestion to the v4 OTLP/HTTP path, update the observation attribute model, and validate a canary before moving production traffic.

#### 10. “Move evaluators” hides behavior changes — Medium

Observation-level evaluator migration can change score placement and cardinality: one matching trace previously produced one score, while v4 produces one score per matching observation. Filters must be narrowed to keep one score per trace ([`content/faq/all/llm-as-a-judge-migration.mdx`, lines 87–109](../content/faq/all/llm-as-a-judge-migration.mdx#L87)). The guide also tells teams to keep deprecated trace I/O populated until the replacement evaluator is validated, or existing trace-level evaluators may lose inputs during the transition ([same guide, lines 45–68](../content/faq/all/llm-as-a-judge-migration.mdx#L45)).

**Concrete change:** add “validate target, variable mappings, and expected score count before deactivating the legacy evaluator” to the evaluator checklist item.

#### 11. The UI/data-model description should acknowledge chart semantics — Medium

The migration table suggests a mostly direct interface replacement. Official dashboard docs say trace time bucketing changes to root-observation start time, traces without root observations can be dropped from time-series charts in mixed-ingestion projects, and synthetic root observations may appear in wide-table queries ([`content/faq/all/dashboard-changes-in-v4.mdx`, lines 63–93](../content/faq/all/dashboard-changes-in-v4.mdx#L63)).

**Concrete change:** after the migration table, add:

> If dashboards or alerts are operational controls, compare key charts before cutover. Root-observation bucketing and synthetic roots can change edge-case counts even when the underlying observations are present.

## Suggested replacement for the self-hosted section

The following keeps the launch post concise while addressing the critical operator gaps:

> Langfuse v4 is generally available for self-hosted deployments. There is no forced cutover date, and v3 receives security patches through January 2027.
>
> **Check your deployment first.** v4 requires ClickHouse 25.12+, PostgreSQL 15+, and Redis 7.0+. Helm deployments using bundled ClickHouse (`clickhouse.deploy: true`) do not yet have an upgrade path; deployments using external ClickHouse are unaffected.
>
> 1. Upgrade ClickHouse before the Langfuse server and confirm all infrastructure minimums.
> 2. Before the first v4 deployment, choose a write mode. Use `legacy` to retain the full v3 behavior or `dual` to write both models while validating v4. Use the default `events_only` only when all producers and consumers are compatible.
> 3. Upgrade SDKs and migrate APIs, evaluators, experiments, custom OTEL ingestion, and exports. Validate direct-ingestion canaries and expected evaluator score counts.
> 4. After dual write is healthy, run the online historic backfill with roughly 3x ClickHouse disk headroom, or dual-write for one full window if you enforce global retention. Historic data appears gradually, newest first.
> 5. Confirm APIs, evaluators, exports, dual-write health, and historic-data coverage, then switch to `events_only`. This is the point of commitment for rollback to the v3 read path.

## Source set

- [Langfuse v4 launch draft](../content/blog/2026-08-13-langfuse-v4.mdx)
- [Cloud v4 upgrade guide](../content/faq/all/upgrade-to-langfuse-v4.mdx)
- [Langfuse v4 overview and timeline](../content/docs/v4.mdx)
- [Cloud versions and compatibility](../content/docs/compatibility.mdx)
- [Self-hosted v3 to v4 migration guide](../content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx)
- [Self-hosted compatibility matrix](../content/self-hosting/upgrade/versioning.mdx)
- [Custom ingestion migration guide](../content/integrations/native/opentelemetry/migration-to-v4.mdx)
- [Evaluator migration guide](../content/faq/all/llm-as-a-judge-migration.mdx)
- [Dashboard changes in v4](../content/faq/all/dashboard-changes-in-v4.mdx)
- [Technical deep dive](../content/blog/2026-03-10-simplify-langfuse-for-scale.mdx)
- [Shared compatibility details](../components-mdx/compat)
- [Timeline implementation](../components/VersionTimeline.tsx)
