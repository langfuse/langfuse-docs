# Research: make the Langfuse v4 upgrade FAQ concise and precise

Research date: 2026-07-28

Scope: [`content/faq/all/upgrade-to-langfuse-v4.mdx`](../content/faq/all/upgrade-to-langfuse-v4.mdx). This note uses only first-party Langfuse documentation, source files, release notes, and GitHub discussions.

## Executive summary

Yes, the page can be substantially improved. The current FAQ renders the same five follow-up actions under three ingestion scenarios, so users must scan 15 blocks even though most are conditional. It also blurs two different rollout models:

- On the managed service, legacy behavior remains available until a centrally scheduled cutover whose date has not been announced.
- On self-hosted v4, the operator chooses the cutover. Legacy ingestion and read APIs become unavailable when the deployment runs the default `events_only` mode. There is no centrally imposed upgrade date, although v3 security patches are promised only through the end of January 2027.

Sources: [current FAQ](https://github.com/langfuse/langfuse-docs/blob/edac69a51/content/faq/all/upgrade-to-langfuse-v4.mdx), [managed rollout details](https://langfuse.com/docs/v4#timeline), [self-hosted cutover behavior](https://langfuse.com/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4#cutover), [self-hosted v3 support window](https://langfuse.com/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4).

The page should have:

1. one short “upgrade your ingestion” section with separate bullets for Langfuse SDKs and custom OpenTelemetry/REST ingestion;
2. one “check what else you use” section covering deprecated reads, trace-level evaluators, and legacy exports only when applicable;
3. one deployment-specific final section: use the in-app checklist for managed projects, or the dedicated v3 → v4 guide for self-hosted deployments.

This removes the repeated scenario trees without losing any required action.

## Verified facts the FAQ should preserve

### 1. SDK and ingestion requirements

- The supported GA SDK majors are Python v4 and JS/TS v5. Python v3 and JS/TS v4 use OpenTelemetry ingestion but are deprecated on v4; Python v2 and JS/TS v3 (and older) use legacy ingestion and are not supported on self-hosted v4 in `events_only` mode. Dedicated score ingestion remains supported. Sources: [compatibility matrix](https://langfuse.com/docs/compatibility#sdk-server), [self-hosted compatibility matrix](https://langfuse.com/self-hosting/upgrade/versioning#sdk-server), [legacy ingestion detail](https://github.com/langfuse/langfuse-docs/blob/edac69a51/components-mdx/compat/detail-legacy-ingestion.mdx).
- Recommend Python SDK 4.7.0+ and JS/TS SDK 5.4.0+. The canonical docs identify these versions for real-time v4 ingestion and app-root-aware behavior. Data from older SDK paths can appear with up to a ten-minute delay. Sources: [data freshness](https://github.com/langfuse/langfuse-docs/blob/edac69a51/components-mdx/compat/data-freshness.mdx), [root observations changelog](https://langfuse.com/changelog/2026-07-15-root-observations-default).
- The current FAQ is imprecise when it tells both languages to replace their trace-update method with `propagate_attributes()`. Python uses `propagate_attributes()`; JS/TS uses `propagateAttributes()`. These replacements are specifically documented for Python v3 → v4 and JS/TS v4 → v5. Users on older majors must first follow each major-version hop, and users already on current majors may not use the deprecated methods at all. Sources: [Python v3 → v4 guide](https://langfuse.com/docs/observability/sdk/upgrade-path/python-v3-to-v4), [JS/TS v4 → v5 guide](https://langfuse.com/docs/observability/sdk/upgrade-path/js-v4-to-v5), [all upgrade paths](https://langfuse.com/docs/observability/sdk/upgrade-path).
- Deprecated trace input/output helpers are not a universal migration requirement. They should be retained temporarily only when an existing trace-level evaluator still depends on trace input/output, then removed after the observation-level evaluator is validated. Sources: [Python migration guide](https://langfuse.com/docs/observability/sdk/upgrade-path/python-v3-to-v4), [JS/TS migration guide](https://langfuse.com/docs/observability/sdk/upgrade-path/js-v4-to-v5), [evaluator migration guide](https://langfuse.com/faq/all/llm-as-a-judge-migration).

### 2. Direct OpenTelemetry and custom ingestion

- Custom ingestion must move from legacy trace/span/generation/event APIs to OTLP over HTTP at `/api/public/otel/v1/traces`. Langfuse does not currently support OTLP/gRPC. Sources: [custom ingestion migration](https://langfuse.com/integrations/native/opentelemetry/migration-to-v4), [OpenTelemetry endpoint](https://langfuse.com/integrations/native/opentelemetry#opentelemetry-endpoint).
- `x-langfuse-ingestion-version: 4` selects the real-time v4 ingestion path, but the header alone does not make an integration v4-ready. The integration must also propagate trace-wide filter context to the relevant spans, put overall input/output on the root observation, and export each completed span once rather than re-exporting the same span ID as an update. Sources: [v4-ready checklist](https://langfuse.com/integrations/native/opentelemetry/migration-to-v4#v4-ready-ingestion-checklist), [attribute propagation](https://langfuse.com/integrations/native/opentelemetry/migration-to-v4#propagate-trace-context-to-observations), [immutable spans](https://langfuse.com/integrations/native/opentelemetry/migration-to-v4#export-complete-immutable-spans).
- Therefore the FAQ should link the dedicated custom-ingestion migration guide instead of trying to compress the migration into “change endpoint, add header, propagate attributes.” That three-clause summary omits required semantic changes.

### 3. Deprecated read APIs

This is conditional: users only need it if their application calls deprecated SDK resources or REST endpoints.

The current shared step is incomplete because it names only Observations API v2 and Metrics API v2. The canonical replacements are:

| Deprecated surface             | Replacement                                                      |
| ------------------------------ | ---------------------------------------------------------------- |
| observations, traces, sessions | Observations API v2                                              |
| metrics and daily metrics      | Metrics API v2                                                   |
| Scores API v1/v2 reads         | Scores API v3                                                    |
| dataset-run reads              | Experiments and Experiment Items APIs                            |
| dataset-run writes             | Experiment runner SDK, or OTLP traces with experiment attributes |

Source: [deprecated API migration quick reference](https://langfuse.com/faq/all/deprecated-api-migration#quick-reference).

The FAQ should say “migrate any deprecated API calls using the endpoint-by-endpoint guide” rather than implying that every deprecated endpoint maps to one of two APIs.

### 4. Evaluators

- Only projects with trace-level or legacy-dataset-based LLM-as-a-Judge evaluators need this action. Those evaluators depend on the legacy tables and stop running after a self-hosted deployment cuts over to `events_only`; the replacement is an observation-level evaluator. Sources: [self-hosted evaluator behavior](https://langfuse.com/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4#evaluations), [evaluator migration guide](https://langfuse.com/faq/all/llm-as-a-judge-migration).
- An observation-level evaluator produces one score per matching observation, not automatically one per trace. Filters may need to be narrowed to a root or named observation to preserve score cardinality. This detail belongs in the linked evaluator guide, not in the top-level upgrade FAQ. Source: [evaluator score cardinality](https://langfuse.com/faq/all/llm-as-a-judge-migration).

### 5. Exports

- Only users with blob storage, PostHog, or Mixpanel integrations configured for a legacy source need this action. The target is `Enriched observations (recommended)`. On self-hosted `events_only`, the legacy source produces no data. Sources: [self-hosted export behavior](https://langfuse.com/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4#exports), [blob storage upgrade path](https://langfuse.com/docs/api-and-data-platform/features/export-to-blob-storage#upgrade-path), [PostHog migration](https://langfuse.com/integrations/analytics/posthog#migrate-export-source), [Mixpanel migration](https://langfuse.com/integrations/analytics/mixpanel#migrate-export-source).
- Existing downstream consumers can require schema or event-query changes; the combined legacy + enriched mode exists for validation and intentionally duplicates records. The FAQ should link the integration-specific guide rather than merely say “switch.” Sources: [blob storage upgrade path](https://langfuse.com/docs/api-and-data-platform/features/export-to-blob-storage#upgrade-path), [PostHog migration effects](https://langfuse.com/integrations/analytics/posthog#migrate-export-source), [Mixpanel migration effects](https://langfuse.com/integrations/analytics/mixpanel#migrate-export-source).

### 6. Rollout dates, UI toggle, and verification

- No managed-service cutover date is published in the canonical docs. The FAQ must not invent one. Sources: [v4 timeline](https://langfuse.com/docs/v4#timeline), [compatibility matrix](https://langfuse.com/docs/compatibility#sdk-server).
- The April 14, 2026 organization-creation threshold and Preview toggle apply to the managed rollout, not to self-hosted deployments generally. A concise and less brittle instruction is: “If your organization still shows the Preview toggle, enable it.” Source: [managed rollout details](https://langfuse.com/docs/v4#timeline).
- The in-app migration URL points to `cloud.langfuse.com`, so it should be labeled as the managed-project checklist instead of appearing as a universal verification step. Source: [v4 overview](https://langfuse.com/docs/v4#timeline).
- Self-hosted deployments have no forced migration date. The precise support statement is that v3 receives security patches through the end of January 2027, and breaking removals occur with the v4 server/cutover rather than on the managed-service schedule. Sources: [self-hosted upgrade guide](https://langfuse.com/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4), [versioning policy](https://langfuse.com/self-hosting/upgrade/versioning).
- As of 2026-07-28, self-hosted v4 is not a stable release. GitHub lists v3.224.2 as the latest stable server release and v4.0.0-rc.3 as a pre-release. The v4 release candidate announcement asks users to test development or staging and wait for a stable release before migrating production. The local self-hosted guide also retains a TODO to add the v4 release date. The FAQ should link the guide, as requested, but say it is for preparing or testing the migration until the stable release ships. Sources: [Langfuse server releases](https://github.com/langfuse/langfuse/releases), [v4.0.0-rc.0 release guidance](https://github.com/langfuse/langfuse/releases/tag/v4.0.0-rc.0), [self-hosting preview update](https://github.com/orgs/langfuse/discussions/14157), [local guide release-date TODO](../content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx).

## Problems in the current FAQ

1. **Rendered repetition.** Five identical shared steps are rendered under each of three ingestion scenarios. Reusable MDX components avoid source duplication but do not reduce what the reader must scan. Source: [current FAQ](https://github.com/langfuse/langfuse-docs/blob/edac69a51/content/faq/all/upgrade-to-langfuse-v4.mdx).
2. **Audience categories overlap.** “Python v3+ / JS v4+” includes both deprecated and current major versions, so a user already on Python v4 or JS v5 is told to “upgrade” and replace APIs they may not use.
3. **Deployment semantics are erased.** Replacing “Langfuse Cloud” with “Langfuse v4” while retaining “Deadline: will be announced” makes a managed-rollout deadline look like a property of the software version. Self-hosted operators control their own cutover.
4. **Language-specific API name is wrong.** JS/TS uses `propagateAttributes()`, not `propagate_attributes()`.
5. **Old-major migration is oversimplified.** Python v2 and JS v3 users need multi-hop SDK migration guides; the named update methods describe the subsequent Python v3 → v4 and JS v4 → v5 hops.
6. **API replacements are incomplete.** Scores v3 and Experiment APIs/runner are omitted.
7. **Conditional work is presented as mandatory.** Read APIs, trace-level evaluators, and legacy exports only matter when a project uses them.
8. **Direct OTEL advice is incomplete.** The header and propagated IDs are necessary but not sufficient; root I/O and immutable-span semantics matter too.
9. **The UI toggle and in-app checklist are deployment-specific.** Both are currently repeated under all managed ingestion scenarios without being labeled as managed-service actions.
10. **Self-hosted status is too optimistic.** Linking the guide is correct, but “follow the guide to migrate your deployment” omits the current release-candidate status and first-party instruction to wait for a stable release before production migration.

## Recommended page structure

Keep the FAQ as a routing page. The canonical migration guides already contain the details.

### Upgrade your ingestion

- **Langfuse SDK:** Upgrade to Python 4.7.0+ or JS/TS 5.4.0+. Follow the multi-hop SDK guides if starting on Python v2 or JS/TS v3 or older.
- **Custom REST or OpenTelemetry:** Follow the custom-ingestion v4 guide. Move legacy ingestion to OTLP/HTTP, opt into v4 ingestion, and validate the v4 span model.

### Check what else you use

- Deprecated API calls → endpoint-by-endpoint API migration guide.
- Trace-level or legacy-dataset evaluators → observation-level evaluator migration guide.
- Legacy blob storage, PostHog, or Mixpanel exports → integration-specific enriched-observations migration guide.

Phrase all three as “if you use …”.

### Complete the rollout

- **Managed project:** If the Preview toggle still appears, enable it and use the in-app migration checklist.
- **Self-hosted:** Link the v3 → v4 upgrade guide and compatibility matrix. Until a stable v4 server release is published, explicitly limit the guide to staging/testing and note that v3 security patches continue through January 2027.

### Questions

Use the general v4 discussion for managed rollout and architecture questions, and the self-hosting preview discussion for self-hosted rollout questions. Sources: [general v4 discussion](https://github.com/orgs/langfuse/discussions/12518), [self-hosting v4 discussion](https://github.com/orgs/langfuse/discussions/14157).

## Copy-level guidance

- Remove all three “Deadline: will be announced” callouts. If the managed cutover must be mentioned, say once that its date has not been announced and link the timeline.
- Do not hard-code “latest” patch versions; use the minimum recommended versions (Python 4.7.0+, JS/TS 5.4.0+) and link the upgrade guides.
- Do not list low-level method replacements in the routing FAQ. The SDK guides handle language-specific names and all breaking changes.
- Use “managed projects” only where the toggle or `cloud.langfuse.com` checklist is relevant. Use “Langfuse v4” for product behavior and “self-hosted v4” for operator-controlled cutover behavior.
- Keep one concise consequence near each action:
  - incompatible legacy SDK ingestion stops;
  - deprecated reads return `404`;
  - legacy evaluators stop producing new scores;
  - legacy exports stop producing data.
- Keep detailed endpoint maps, evaluator score behavior, export schema differences, and self-hosted migration variables in their canonical linked guides.

## Suggested acceptance criteria

- A user can identify the required ingestion path in one scan.
- Shared conditional actions appear once, not three times.
- Python and JS method names are not conflated.
- The read-API text does not imply that every endpoint maps only to Observations v2 or Metrics v2.
- Managed rollout timing is not presented as a universal v4 deadline.
- Self-hosted guidance links the dedicated guide, states the current pre-release limitation, and gives the January 2027 v3 security-support end date.
- The page contains one H1 and all anchors remain explicit if existing inbound links must be preserved.
