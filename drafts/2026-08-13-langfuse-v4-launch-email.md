# Langfuse v4 launch email

This is a conditional template for Langfuse Cloud project owners and admins. Its opening mirrors the launch announcement, with the middle paragraph personalized to the recipient's migration status. Render only the action blocks that apply to the recipient's projects.

## Subject and preview text

**If action is required**

- Subject: Langfuse v4 is live: action required for {{action_project_count}} project{{action_project_count_plural}}
- Preview: Your project-specific Langfuse v4 migration steps are ready.

**If no action is required**

- Subject: Langfuse v4 is live: no action required
- Preview: Faster tables, dashboards, APIs, and evaluations are now available in Langfuse v4.

## Email body

Hi {{recipient_first_name}},

Langfuse v4 is live on Langfuse Cloud and generally available for [self-hosted deployments](https://langfuse.com/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4). It makes tables, dashboards, APIs, and evaluations faster at scale. Dashboard load times for large projects improve by at least 10x.

{{#if has_projects_requiring_action}}

Many Langfuse Cloud users do not need to change anything. For your projects, this email lists the exact actions we detected below. Complete them by **November 9, 2026**. Self-hosted users decide when to upgrade, and Langfuse v3 will receive security patches through January 2027.

{{else}}

Many Langfuse Cloud users do not need to change anything. We did not detect any migration actions for your projects. Self-hosted users decide when to upgrade, and Langfuse v3 will receive security patches through January 2027.

{{/if}}

With v4, you can find the failed tool call inside a long-running agent, isolate the model calls driving a cost spike, or evaluate one sub-agent directly. Filter the Observations table, turn that result into a chart, and save it to a dashboard without building a separate query.

[Read the Langfuse v4 launch announcement](https://langfuse.com/changelog/2026-08-13-langfuse-v4)

{{#if has_projects_requiring_action}}

### Your migration path

We detected migration actions for the following projects in **{{organization_name}}**. Please complete them by **November 9, 2026**. We generated this checklist from Langfuse usage observed during **{{detection_window}}**.

{{#each projects_requiring_action}}

#### {{project_name}}

Last trace received: {{last_trace_at}}

[Open this project's migration checklist]({{project_migration_url}})

{{#if sdk_actions}}

**Trace ingestion**

{{#each sdk_actions}}

- {{detected_source}} was last seen on {{detected_version}}. {{required_action}} Follow the [SDK upgrade guide](https://langfuse.com/docs/observability/sdk/upgrade-path).

{{/each}}

{{/if}}

{{#if custom_ingestion_action}}

**Custom ingestion**

- We detected {{custom_ingestion_action.detected_source}}. {{custom_ingestion_action.required_action}} Follow the [custom ingestion migration guide](https://langfuse.com/integrations/native/opentelemetry/migration-to-v4).

{{/if}}

{{#if api_actions}}

**Deprecated APIs**

{{#each api_actions}}

- We detected {{call_count}} call{{call_count_plural}} to `{{endpoint}}` in the detection window. Replace it with {{replacement}}. See the [deprecated API migration guide](https://langfuse.com/faq/all/deprecated-api-migration).

{{/each}}

{{/if}}

{{#if evaluator_actions}}

**Evaluators**

{{#each evaluator_actions}}

- `{{evaluator_name}}` uses {{legacy_target_type}}. Move it to {{replacement_target_type}}. Follow the [evaluator migration guide](https://langfuse.com/faq/all/llm-as-a-judge-migration).

{{/each}}

{{/if}}

{{#if export_actions}}

**Exports and integrations**

{{#each export_actions}}

- `{{integration_name}}` uses the legacy traces-and-observations source. Switch it to enriched observations in project settings. Follow the [export migration guide](https://langfuse.com/docs/api-and-data-platform/features/export-to-blob-storage#upgrade-path).

{{/each}}

{{/if}}

{{#if experiment_actions}}

**Experiments**

{{#each experiment_actions}}

- {{detected_usage}}. {{required_action}} Follow the [experiment runner guide](https://langfuse.com/docs/evaluation/experiments/experiments-via-sdk).

{{/each}}

{{/if}}

{{/each}}

You can track every project's progress from **Migration Status** in Langfuse. The [Cloud upgrade guide](https://langfuse.com/faq/all/upgrade-to-langfuse-v4) covers every check.

{{else}}

### No migration action is required

We did not detect any v4 migration actions for your projects in **{{organization_name}}**. You can review the status at any time from **Migration Status** in Langfuse.

{{/if}}

Questions? Ask in the dedicated [Langfuse v4 GitHub Discussion](https://github.com/orgs/langfuse/discussions/12518) or contact [Langfuse support](https://langfuse.com/support).

The Langfuse team

## Required personalization data

Supply the following values when rendering the email:

- Recipient data includes `recipient_first_name`, `organization_name`, and whether the recipient is an owner or admin.
- Campaign data includes `detection_window`, `action_project_count`, and the correct singular/plural suffix. The Cloud cutover date is November 9, 2026.
- Project data includes `project_name`, `project_migration_url`, `last_trace_at`, and whether any action is required.
- SDK actions include the detected language or source, detected version, latest observation time, and the exact required minimum: Python 4.7.0+ or JS/TS 5.4.0+.
- Custom ingestion actions identify legacy REST ingestion or OpenTelemetry producers that are not yet v4-ready.
- API actions include the endpoint, observed call count and detection window, and the supported replacement.
- Evaluator actions include the evaluator name, legacy target type, and required observation or experiment target.
- Export actions include the integration name and whether it still uses the legacy traces-and-observations source.
- Experiment actions identify legacy dataset-run instrumentation and the required Experiment runner or OTLP replacement.

Do not render an empty category, expose internal project IDs in the prose, or imply that "not detected" proves a feature is unused. When detection is inconclusive, direct the recipient to the in-product checklist instead of stating that no action is required.
