---
title: Background Migrations (self-hosted)
description: Langfuse uses background migrations to perform long-running changes within the storage components when upgrading the application.
label: "Version: v3"
sidebarTitle: "Background Migrations"
---

# Background Migrations

Langfuse uses background migrations to perform long-running changes within the storage components when [upgrading](/self-hosting/upgrade) the application.
These may include the addition and backfilling of new columns or the migration of data between storages.
Background migrations are executed on startup of the worker container and run in the background until completion or failure.

Next to background migrations, fast migrations are applied directly to the database on startup of the web container.

## Monitoring

You can monitor the progress of background migrations within the Langfuse UI.
Click on the Langfuse version tag and select "Background Migrations".
You see all migrations that ever ran and their status.
You can also monitor the progress of background migrations via the worker container logs.

If migrations are running or have failed, we show a status indicator within the UI to guide users towards the background migrations overview.

## Deployment stops

Langfuse does not require deployment stops between minor releases as of now.
However, we recommend that you monitor the progress of background migrations after each update to ensure that all migrations have completed successfully before attempting another update.
We will highlight within the changelog if a deployment stop becomes required.

## Configuration

Background migrations are enabled by default and can be disabled by setting `LANGFUSE_ENABLE_BACKGROUND_MIGRATIONS=false`. This is not recommended as it may leave the application in an inconsistent state where the UI and API does not reflect the current state of the data correctly.

## Troubleshooting

### Failed to convert rust String into napi string

If you are seeing the message above for the traces, observations, or scores background migration, it is usually due to large blob data within the rows.
The error happens, because the postgres database client tries to concatenate all the data into a single string, before parsing it in Node.js.
If the string exceeds the maximum Node.js string size, the error is thrown.

We can circumvent the issue by loading fewer rows at the same time.
To do so, adjust the batchSize of your migration by editing the `background_migrations` table.
Add `{ "batchSize": 2500 }` to the `args` column of the migration you want to adjust.
Afterward, restart the migration via the UI.

### Migrations Stuck on Single Date

If you observe repeated log lines that refer to the same date, e.g.

```
langfuse-worker-1    | 2025-06-03T08:38:21.918Z info      [Background Migration] Acquired lock for background migration 20241024_1730_migrate_traces_from_pg_to_ch
langfuse-worker-1    | 2025-06-03T08:38:21.949Z info      Migrating traces from postgres to clickhouse with {}
langfuse-worker-1    | 2025-06-03T08:38:22.429Z info      Got 1000 records from Postgres in 475ms
langfuse-worker-1    | 2025-06-03T08:38:22.914Z info      Inserted 1000 traces into Clickhouse in 485ms
langfuse-worker-1    | 2025-06-03T08:38:22.919Z info      Processed batch in 965ms. Oldest record in batch: 2025-06-03T08:34:15.231Z
langfuse-worker-1    | 2025-06-03T08:38:23.391Z info      Got 1000 records from Postgres in 472ms
langfuse-worker-1    | 2025-06-03T08:38:23.811Z info      Inserted 1000 traces into Clickhouse in 420ms
langfuse-worker-1    | 2025-06-03T08:38:23.815Z info      Processed batch in 896ms. Oldest record in batch: 2025-06-03T08:34:15.231Z
langfuse-worker-1    | 2025-06-03T08:38:24.256Z info      Got 1000 records from Postgres in 441ms
langfuse-worker-1    | 2025-06-03T08:38:24.638Z info      Inserted 1000 traces into Clickhouse in 382ms
```

this might be due to a couple of reasons:

- You have many events that were created at exactly the same time.
- Your instance was created before 2024-05-03 and rarely updated since.

In both cases, you can try to adjust the `batchSize` as described above.
If this does not resolve the problem, you can customize the migration scripts (see langfuse-repo `/worker/src/backgroundMigrations/`) to use the `timestamp` or `start_time` instead of `created_at` as a cursor.
