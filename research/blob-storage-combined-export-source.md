# Research: Combined legacy and enriched blob-storage export source

Research date: 2026-07-28

Implementation reviewed at:

- `langfuse/langfuse` commit [`429ec4fff6512fff49aef50fccb92846f674a98a`](https://github.com/langfuse/langfuse/tree/429ec4fff6512fff49aef50fccb92846f674a98a)
- `langfuse/langfuse-docs` commit [`ebb4f535124b0ebd35f38e3b64dc35055fef1bae`](https://github.com/langfuse/langfuse-docs/tree/ebb4f535124b0ebd35f38e3b64dc35055fef1bae)

## Short answer

**Traces and observations (legacy) and enriched observations** is a real export-source setting whose only intended use is migration validation. It tells one blob-storage integration to write both observation layouts for each subsequent export window: the legacy `traces/` and `observations/` files and the v4 `observations_v2/` file. The worker still writes `scores/` only once. Langfuse describes the two observation outputs as essentially duplicate data and says the option should only be used while validating downstream consumers before switching to enriched-only. ([UI option definition](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/packages/shared/src/features/analytics-integrations/index.ts#L14-L37), [worker dispatch](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/worker/src/features/blobstorage/handleBlobStorageIntegrationProjectJob.ts#L1388-L1424))

It is not the self-hosted v4 `dual` write mode. The export-source setting chooses which already-populated ClickHouse data models the integration reads. The server write mode chooses which data models ingestion populates. The combined export source is usable on self-hosted v4 only while both sides are available: the server must write the events model, keep legacy writes active, and expose the v4 preview path. ([export-source policy](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/packages/shared/src/features/analytics-integrations/export-source-policy.ts#L19-L36), [worker guards](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/worker/src/features/blobstorage/handleBlobStorageIntegrationProjectJob.ts#L1263-L1287))

Most importantly, changing only the export source does **not** reset export history. The integration retains `lastSyncAt`, and the new source applies to the next scheduled or manually triggered window. Only changing `exportMode` resets `lastSyncAt`. Therefore this option does not backfill `observations_v2/` for windows exported before the switch. ([upsert behavior](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/web/src/features/blobstorage-integration/service.ts#L120-L186), [window start](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/worker/src/features/blobstorage/handleBlobStorageIntegrationProjectJob.ts#L182-L255))

## Names in the UI, API, database, and manifest

The same setting has three names:

| Surface                    | Value                                                          |
| -------------------------- | -------------------------------------------------------------- |
| UI label                   | **Traces and observations (legacy) and enriched observations** |
| Public REST `exportSource` | `LEGACY_TRACES_AND_ENRICHED_OBSERVATIONS`                      |
| Internal Prisma enum       | `TRACES_OBSERVATIONS_EVENTS`                                   |

The public API intentionally maps its descriptive value to the older internal enum. GET and PUT use the public value, while the database stores the internal value. ([public/internal mapping](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/web/src/features/public-api/types/blob-storage-integrations.ts#L45-L88), [REST serialization and update](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/web/src/pages/api/public/integrations/blob-storage/index.ts#L81-L108), [REST deserialization](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/web/src/pages/api/public/integrations/blob-storage/index.ts#L151-L198))

The run manifest receives the persisted internal enum directly, so a combined run's manifest reports `TRACES_OBSERVATIONS_EVENTS`, not the public REST value. The manifest then derives `tables` from its files. ([manifest call](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/worker/src/features/blobstorage/handleBlobStorageIntegrationProjectJob.ts#L1427-L1438), [manifest builder](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/worker/src/features/blobstorage/manifest.ts#L52-L70))

## Exact worker behavior

For a normal combined-source run, the worker creates four table-export promises over one shared `[minTimestamp, maxTimestamp]` window:

1. `scores`
2. `traces`
3. `observations`
4. `observations_v2`

It waits for all four before writing the manifest. The two source branches add only their respective observation layouts; `scores` is scheduled once before either branch. ([execution config and shared window](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/worker/src/features/blobstorage/handleBlobStorageIntegrationProjectJob.ts#L1329-L1349), [table dispatch](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/worker/src/features/blobstorage/handleBlobStorageIntegrationProjectJob.ts#L1388-L1424))

The objects are written below the configured prefix as:

```text
{prefix}{projectId}/
├── traces/{maxTimestamp}.{extension}
├── observations/{maxTimestamp}.{extension}
├── observations_v2/{maxTimestamp}.{extension}
├── scores/{maxTimestamp}.{extension}
└── manifests/{maxTimestamp}.json
```

Every table file uses the same formatted `maxTimestamp` stem. The manifest key uses the same timestamp under `manifests/`; each `files[].key` is the complete object key, including prefix and project ID. ([data-object key construction](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/worker/src/features/blobstorage/handleBlobStorageIntegrationProjectJob.ts#L462-L500), [manifest key and file contract](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/worker/src/features/blobstorage/manifest.ts#L8-L50))

The legacy files query the old ClickHouse `traces` and `observations` tables. The enriched file is named `observations_v2` externally but is produced by `getEventsForBlobStorageExport*`, which queries the v4 events data model. With the default full field groups, full input/output is requested and the query builder selects `events_full`; a reduced field selection can allow `events_core`. ([legacy trace query](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/packages/shared/src/server/repositories/traces.ts#L1186-L1260), [legacy observation query](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/packages/shared/src/server/repositories/observations.ts#L1696-L1811), [enriched export query](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/packages/shared/src/server/repositories/events.ts#L3038-L3166), [events table selection](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/packages/shared/src/server/queries/clickhouse-sql/event-query-builder.ts#L1218-L1256))

The two observation files intentionally represent the same logical observations in different schemas when both data models have been populated. The legacy layout keeps trace rows separate, so consumers join `observations/` to `traces/`; the enriched layout denormalizes trace context into each `observations_v2/` row. A pipeline must compare the layouts separately and must not ingest both into one production fact table without deduplication. `scores/` is not duplicated because the worker exports that table once for every source. ([option's migration-only description](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/packages/shared/src/features/analytics-integrations/index.ts#L19-L35), [field-reference overview](https://github.com/langfuse/langfuse-docs/blob/ebb4f535124b0ebd35f38e3b64dc35055fef1bae/content/docs/api-and-data-platform/features/blob-storage-export-fields.mdx#L21-L28), [worker table dispatch](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/worker/src/features/blobstorage/handleBlobStorageIntegrationProjectJob.ts#L1391-L1424))

## Window, cursor, retry, and manifest behavior

The integration has one cursor, `lastSyncAt`, not a separate cursor per layout. A run starts at that cursor and advances by at most one configured frequency interval, ending no later than the current time minus the lag buffer. All four table queries use that same inclusive window. ([window calculation](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/worker/src/features/blobstorage/handleBlobStorageIntegrationProjectJob.ts#L1212-L1244), [inclusive observation bounds](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/packages/shared/src/server/repositories/observations.ts#L1731-L1748), [inclusive events bounds](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/packages/shared/src/server/repositories/events.ts#L3081-L3090))

The manifest is the commit point. It is written only after every selected table upload succeeds. A table or manifest failure leaves `lastSyncAt` unchanged; the retry therefore uses the same window and overwrites objects at the same timestamp-derived keys. After success, `lastSyncAt` advances to the window's `maxTimestamp`. ([manifest commit contract](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/worker/src/features/blobstorage/handleBlobStorageIntegrationProjectJob.ts#L1424-L1438), [successful cursor update](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/worker/src/features/blobstorage/handleBlobStorageIntegrationProjectJob.ts#L1462-L1492), [failure-state update](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/worker/src/features/blobstorage/handleBlobStorageIntegrationProjectJob.ts#L1518-L1549))

Changing `exportSource` alone neither clears `lastSyncAt` nor schedules a special backfill. The persistence service resets the cursor only when `exportMode` changes. A source-only save therefore changes the files produced by the next due run; a user can also invoke **Run Now**, which the UI describes as exporting data since the last sync. ([source/mode update behavior](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/web/src/features/blobstorage-integration/service.ts#L120-L190), [Run Now behavior in the UI](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/web/src/features/blobstorage-integration/components/BlobStorageIntegrationContainer.tsx#L147-L158))

This has a direct migration consequence: selecting the combined source is suitable for comparing **new matching windows** side by side. It does not create enriched counterparts for old `traces/` and `observations/` files. Historical enriched comparison additionally requires the v4 events backfill to have populated the new tables and an explicit blob-export re-export/reset procedure. The self-hosted v4 guide makes the events backfill a separate server-migration step. ([historic events backfill](https://github.com/langfuse/langfuse-docs/blob/ebb4f535124b0ebd35f38e3b64dc35055fef1bae/content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L258-L264), [source update does not reset the cursor](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/web/src/features/blobstorage-integration/service.ts#L137-L186))

## Relationship to self-hosted v4 write modes

The server write modes and valid blob-export sources form this capability matrix:

| Self-hosted write mode   | Legacy-only source | Combined source | Enriched-only source |
| ------------------------ | ------------------ | --------------- | -------------------- |
| `legacy`                 | Works              | Blocked         | Blocked              |
| `dual`, preview enabled  | Works              | Works           | Works                |
| `dual`, preview disabled | Works              | Blocked         | Blocked              |
| `events_only`            | Blocked            | Blocked         | Works                |

The implementation blocks any enriched-containing source when the deployment does not expose enriched export, and it blocks a source in either direction when its underlying tables are not being written. `legacy` does not write events; `events_only` does not write old `traces`/`observations`; `dual` writes both. ([source classification and policy](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/packages/shared/src/features/analytics-integrations/export-source-policy.ts#L68-L145), [worker write-mode guard](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/worker/src/features/exportWriteModeGuard.ts#L8-L38), [preview availability check](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/worker/src/features/blobstorage/handleBlobStorageIntegrationProjectJob.ts#L1268-L1287))

The combined export source does not cause dual writes or backfill data itself. In `dual`, ingestion populates both models; older SDK traffic reaches the events model through a delayed propagation pipeline, while compatible SDKs can write it directly. Historical events are populated by a separate background migration. The blob exporter only reads whichever models already contain data for its current window. ([self-hosted dual-write implementation overview](https://github.com/langfuse/langfuse-docs/blob/ebb4f535124b0ebd35f38e3b64dc35055fef1bae/content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L322-L329), [historic backfill step](https://github.com/langfuse/langfuse-docs/blob/ebb4f535124b0ebd35f38e3b64dc35055fef1bae/content/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4.mdx#L258-L264))

## Availability and gating

On Cloud, the two legacy-containing sources—including the combined source—cannot be newly selected for projects created on or after 2026-05-20. They also cannot be newly selected for blob-storage integration rows created on or after 2026-06-22. A persisted legacy value on an older row is grandfathered until the Cloud cutover, but the cutoffs apply when a value is explicitly chosen. ([cutoff definitions and rationale](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/packages/shared/src/features/analytics-integrations/export-source-policy.ts#L9-L18), [validation](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/packages/shared/src/features/analytics-integrations/export-source-policy.ts#L192-L233), [current compatibility detail](https://github.com/langfuse/langfuse-docs/blob/ebb4f535124b0ebd35f38e3b64dc35055fef1bae/components-mdx/compat/detail-legacy-export-source.mdx#L1))

On self-hosted deployments, the Cloud date cutoffs do not apply. Availability follows the capability matrix above: the UI and write APIs use the deployment's preview flag and write mode to filter or reject options. A persisted-but-now-invalid value remains visible but cannot be saved silently as another value; the worker also fails before export work rather than advancing the cursor on stale or empty tables. ([self-hosted cutoff exemption](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/packages/shared/src/features/analytics-integrations/export-source-policy.ts#L107-L135), [UI option filtering](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/web/src/features/analytics-integrations/exportSource.ts#L22-L64), [worker guard rationale](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/worker/src/features/exportWriteModeGuard.ts#L8-L38))

Two first-party texts are stale relative to the current implementation. The May 20 changelog says all existing Cloud projects remain unaffected, but it predates the June 22 integration-row cutoff. The generated Fern definition also still says enriched export is Cloud-only, although the application and worker enable it for self-hosted deployments with the v4 preview flag. The current compatibility component and source policy should be treated as authoritative for availability. ([older changelog wording](https://github.com/langfuse/langfuse-docs/blob/ebb4f535124b0ebd35f38e3b64dc35055fef1bae/content/changelog/2026-05-20-blob-storage-enriched-default.mdx#L12-L18), [stale Fern note](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/fern/apis/server/definition/blob-storage-integrations.yml#L76-L87), [current policy](https://github.com/langfuse/langfuse/blob/429ec4fff6512fff49aef50fccb92846f674a98a/packages/shared/src/features/analytics-integrations/export-source-policy.ts#L129-L145))

## Implications for the user-facing migration guide

1. Do not introduce the long UI label without explaining it. Use a plain action such as **Temporarily export both layouts**, followed by the exact selector label in parentheses so users can find it.
2. State its purpose in one sentence: it writes legacy and enriched observation files for the same **future export windows** so consumers can compare them side by side.
3. Explicitly say that it does not backfill prior blob-export windows and does not itself enable v4 dual writes.
4. Make the step conditional. Many Cloud users cannot select it, and self-hosted users can select it only during the `dual` phase with v4 preview enabled. The migration guide needs a direct path for users for whom the option is unavailable.
5. Keep the duplication warning concrete: compare `observations/` with `observations_v2/`, but do not ingest both into the same production dataset; `scores/` is exported only once.
6. For self-hosted, order the concepts correctly: enable/populate the v4 events model, optionally use the combined export source for new-window validation, switch the integration to enriched-only, and only then switch the server to `events_only`.

These recommendations are inferences from the implementation and availability constraints above, not separate product contracts.
