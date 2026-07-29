# Research: Blob storage export migration for Langfuse v4

Research date: 2026-07-28

## Conclusion

The upgrade guide should describe a consumer migration that must finish before the v4 cutover, not just a change to an integration setting. The safe sequence is:

1. Ensure both the legacy and enriched tables are being written.
2. Select **Traces and observations (legacy) and enriched observations** on the export integration.
3. Validate the enriched files and move consumers from `traces/` plus `observations/` to `observations_v2/`.
4. Select **Enriched observations (recommended)**.
5. For self-hosted deployments, only then cut the server over to `LANGFUSE_MIGRATION_V4_WRITE_MODE=events_only`.

This order follows the existing export migration procedure and the self-hosted v4 requirement to migrate export configurations before the final cutover. The worker rejects a legacy-containing export source after `events_only`, rather than advancing the export cursor with stale or empty data. ([current export guide](https://github.com/langfuse/langfuse-docs/blob/ebb4f535124b0ebd35f38e3b64dc35055fef1bae/content/docs/api-and-data-platform/features/export-to-blob-storage.mdx#L263-L273), [self-hosted v4 guide](https://github.com/langfuse/langfuse-docs/blob/ebb4f535124b0ebd35f38e3b64dc35055fef1bae/content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L229-L277), [worker guard](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/worker/src/features/exportWriteModeGuard.ts#L8-L38))

## Availability and timing

Langfuse Cloud is already running the v4 experience, but older organizations can still switch between the v3 and v4 read experiences until the separate, future Cloud v4-only cutover. The cutover date has not been announced. ([v4 overview](https://github.com/langfuse/langfuse-docs/blob/ebb4f535124b0ebd35f38e3b64dc35055fef1bae/content/docs/v4.mdx#L37-L50))

Cloud projects created on or after 2026-05-20 cannot select either legacy-containing source. For older Cloud projects, integrations created on or after 2026-06-22 cannot select a legacy-containing source either. An older integration on an older project can keep its persisted source until the Cloud cutover; the cutoffs apply to newly chosen values. ([export-source policy](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/packages/shared/src/features/analytics-integrations/export-source-policy.ts#L9-L32), [cutoff constants and validation](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/packages/shared/src/features/analytics-integrations/export-source-policy.ts#L47-L76), [Cloud validation](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/packages/shared/src/features/analytics-integrations/export-source-policy.ts#L192-L233))

The May 20 changelog is useful historical context but is incomplete on its own: it predates the June 22 integration-level cutoff and therefore says existing Cloud projects are unaffected. The current v4 and compatibility documentation include both cutoffs. ([May 20 changelog](https://github.com/langfuse/langfuse-docs/blob/ebb4f535124b0ebd35f38e3b64dc35055fef1bae/content/changelog/2026-05-20-blob-storage-enriched-default.mdx#L12-L18), [v4 rollout details](https://github.com/langfuse/langfuse-docs/blob/ebb4f535124b0ebd35f38e3b64dc35055fef1bae/content/docs/v4.mdx#L43-L50))

At the future Cloud v4-only cutover, remaining legacy exports will be switched to the enriched source automatically. The public date is still unannounced. ([compatibility detail](https://github.com/langfuse/langfuse-docs/blob/ebb4f535124b0ebd35f38e3b64dc35055fef1bae/components-mdx/compat/detail-legacy-export-source.mdx#L1))

For self-hosted deployments, v3 supports the traces-and-observations export and v4 supports enriched observations; the legacy source is deprecated on v4. A blanket statement that “new integrations already use enriched observations” is therefore inaccurate for self-hosted v3. ([self-hosted compatibility matrix](https://github.com/langfuse/langfuse-docs/blob/ebb4f535124b0ebd35f38e3b64dc35055fef1bae/content/self-hosting/upgrade/versioning.mdx#L94-L98))

## Export source versus server write mode

The integration has three export sources:

| Integration export source                                      | Reads                                            |
| -------------------------------------------------------------- | ------------------------------------------------ |
| **Traces and observations (legacy)**                           | Legacy `traces` and `observations` tables        |
| **Traces and observations (legacy) and enriched observations** | Both legacy tables and the enriched events table |
| **Enriched observations (recommended)**                        | Enriched events table                            |

The public API maps these to `LEGACY_TRACES_OBSERVATIONS`, `LEGACY_TRACES_AND_ENRICHED_OBSERVATIONS`, and `OBSERVATIONS_V2`. ([public API source enum](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/web/src/features/public-api/types/blob-storage-integrations.ts#L45-L88))

Self-hosted v4 separately has the server write modes `legacy`, `dual`, and `events_only`. These control which ClickHouse tables receive data; they are not export source settings. In `legacy`, the enriched export cannot run because the enriched tables are not written. In `events_only`, either export source containing legacy tables is rejected because `traces` and `observations` are no longer written. `dual` is the bridge in which both sides are populated. ([self-hosted write modes](https://github.com/langfuse/langfuse-docs/blob/ebb4f535124b0ebd35f38e3b64dc35055fef1bae/content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L165-L227), [worker guard](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/worker/src/features/exportWriteModeGuard.ts#L8-L38))

The final self-hosted cutover to `events_only` stops all writes to the old `traces` and `observations` tables and is the point of commitment in the server migration. Export configurations are explicitly listed among the items to migrate before that cutover. ([self-hosted migration steps](https://github.com/langfuse/langfuse-docs/blob/ebb4f535124b0ebd35f38e3b64dc35055fef1bae/content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L229-L277))

## Output and consumer differences

| Stage      | Paths written below `{prefix}{project-id}/`               | Consumer behavior                                                 |
| ---------- | --------------------------------------------------------- | ----------------------------------------------------------------- |
| Legacy     | `traces/`, `observations/`, `scores/`                     | Join observations to traces on `trace_id` for trace context       |
| Transition | `traces/`, `observations/`, `observations_v2/`, `scores/` | Compare both representations, then validate the enriched consumer |
| Enriched   | `observations_v2/`, `scores/`                             | Read trace context directly from each observation row             |

These paths are determined directly by the worker’s export-source branches; scores are always scheduled, legacy-containing sources schedule traces and observations, and enriched-containing sources schedule `observations_v2`. ([worker table selection](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/worker/src/features/blobstorage/handleBlobStorageIntegrationProjectJob.ts#L1388-L1424))

Enriched observation rows carry trace context directly, so warehouse-side joins are unnecessary. Legacy `observations/` rows keep trace-level fields such as `user_id`, `session_id`, and `tags` in the separate `traces/` file. Scores are exported for every source. ([field reference: enriched observations](https://github.com/langfuse/langfuse-docs/blob/ebb4f535124b0ebd35f38e3b64dc35055fef1bae/content/docs/api-and-data-platform/features/blob-storage-export-fields.mdx#L21-L28), [field reference: scores and legacy paths](https://github.com/langfuse/langfuse-docs/blob/ebb4f535124b0ebd35f38e3b64dc35055fef1bae/content/docs/api-and-data-platform/features/blob-storage-export-fields.mdx#L82-L141))

The migration-relevant schema differences are concentrated in three field groups: enriched `basic` adds `bookmarked`, `public`, `session_id`, and `user_id`; enriched `usage` adds `usage_pricing_tier_id`; and enriched `trace_context` places `release`, `tags`, and `trace_name` on each observation rather than in `traces/`. The detailed field reference should remain the canonical schema reference. ([committed field-group comparison](https://github.com/langfuse/langfuse-docs/blob/ebb4f535124b0ebd35f38e3b64dc35055fef1bae/content/docs/api-and-data-platform/features/export-to-blob-storage.mdx#L248-L255))

During the transition source, both representations contain the same logical observations, so a consumer that ingests both as one dataset will create duplicates unless it separates or deduplicates them. The existing guide therefore describes duplicates as intentional during validation. ([current upgrade path](https://github.com/langfuse/langfuse-docs/blob/ebb4f535124b0ebd35f38e3b64dc35055fef1bae/content/docs/api-and-data-platform/features/export-to-blob-storage.mdx#L263-L270))

After switching to enriched-only, the legacy directories receive no new objects, including empty files. Consumers that watch those directories can therefore go silent without an error. Manifest-driven consumers continue correctly because each manifest enumerates the files produced by that run. ([current export guide](https://github.com/langfuse/langfuse-docs/blob/ebb4f535124b0ebd35f38e3b64dc35055fef1bae/content/docs/api-and-data-platform/features/export-to-blob-storage.mdx#L269-L273), [manifest commit point](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/worker/src/features/blobstorage/handleBlobStorageIntegrationProjectJob.ts#L1427-L1438))

## `DEPRECATION_NOTICE.txt`

On Langfuse Cloud only, an integration whose source includes legacy data gets `{prefix}{project-id}/DEPRECATION_NOTICE.txt`. The fixed key is overwritten on each successful legacy-containing run. ([notice definition](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/worker/src/features/blobstorage/deprecationNotice.ts#L1-L20), [Cloud-only dispatch](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/worker/src/features/blobstorage/handleBlobStorageIntegrationProjectJob.ts#L1440-L1459))

The notice is written best-effort after the manifest and is not part of the manifest. Failure to write or remove it does not fail the export. The next successful enriched-only run attempts to delete a notice left by the legacy integration. ([notice write and removal](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/worker/src/features/blobstorage/handleBlobStorageIntegrationProjectJob.ts#L1108-L1159), [run order](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/worker/src/features/blobstorage/handleBlobStorageIntegrationProjectJob.ts#L1427-L1459))

Consequently, the notice should not be presented as a completion signal. Pipelines should filter object-created events to `manifests/` and process each manifest’s file keys. ([current export guide](https://github.com/langfuse/langfuse-docs/blob/ebb4f535124b0ebd35f38e3b64dc35055fef1bae/content/docs/api-and-data-platform/features/export-to-blob-storage.mdx#L261-L273))

## Recommended structure for the rewritten upgrade guide

1. Open with a scope warning: this applies only when the integration currently writes `traces/` and `observations/`.
2. Show the three-stage path table from this note.
3. Give one ordered migration procedure that moves consumers before selecting enriched-only.
4. Add deployment-specific timing:
   - Cloud: eligible older integrations can use the transition source; complete the migration before the announced v4-only cutover.
   - Self-hosted: use the transition source while the server is in `dual`, then select enriched-only before `events_only`.
5. End with the legacy-directory silence warning and a link to the detailed field reference.

This structure keeps the main action sequence compact while preserving the two operational failure modes that matter: switching the exporter before consumers are ready, and switching the self-hosted server to `events_only` before the exporter is ready. The supporting behavior is documented in the export migration path, the server migration guide, and the worker’s write-mode guard. ([current export guide](https://github.com/langfuse/langfuse-docs/blob/ebb4f535124b0ebd35f38e3b64dc35055fef1bae/content/docs/api-and-data-platform/features/export-to-blob-storage.mdx#L263-L273), [self-hosted v4 guide](https://github.com/langfuse/langfuse-docs/blob/ebb4f535124b0ebd35f38e3b64dc35055fef1bae/content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L229-L277), [worker guard](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/worker/src/features/exportWriteModeGuard.ts#L8-L38))
