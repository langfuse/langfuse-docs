---
title: Query via SDKs
sidebarTitle: Query via SDKs
description: Conveniently fetch your LLM Observability traces via the SDKs for few-shotting, fine-tuning or further analysis.
---

# Query Data via SDKs

Langfuse is [open-source](/open-source) and data tracked with Langfuse is open. You can query data via: [SDKs](#sdks) and [API](#api). For export functionality, see [Export Data](/docs/api-and-data-platform/overview).

Common use cases:

- Train or fine-tune models on the production traces in Langfuse. E.g. to create a small model after having used a large model in production for a specific use case.
- Collect few-shot examples to improve quality of output.
- Programmatically create [datasets](/docs/evaluation/features/datasets).

If you are new to Langfuse, we recommend familiarizing yourself with the [Langfuse data model](/docs/tracing-data-model).

<Callout type="info">

New data is typically available for querying within 15-30 seconds of ingestion, though processing times may vary at times. Please visit [status.langfuse.com](https://status.langfuse.com) if you encounter any issues.

</Callout>

## SDKs [#sdks]

Via the [SDKs](/docs/sdk/overview) for Python and JS/TS you can easily query the API without having to write the HTTP requests yourself.

<Callout type="info">

If you need aggregated metrics (e.g., counts, costs, usage) rather than individual entities, consider the [Metrics API](/docs/metrics/features/metrics-api). It is optimized for aggregate queries and higher rate limits.

</Callout>

<LangTabs items={["Python SDK", "JS/TS SDK"]}>
<Tab title="Python SDK">

```bash
pip install langfuse
```

```python
from langfuse import get_client
langfuse = get_client()  # uses environment variables to authenticate
```

The `api` namespace is auto-generated from the Public API (OpenAPI). Method names mirror REST resources and support filters and pagination.

<Callout type="warning">

From Python SDK v4 and JS/TS SDK v5 onward, the high-performance endpoints are
the defaults:

- `api.observations` (formerly `api.observations_v_2` / `api.observationsV2`)
- `api.scores` (formerly `api.score_v_2` / `api.scoreV2`)
- `api.metrics` (formerly `api.metrics_v_2` / `api.metricsV2`)

The old v2 aliases were removed in these major releases. Legacy v1 endpoints
are now available under `api.legacy.*` (Python: `*_v1`, JS/TS: `*V1`).

</Callout>

### Traces

```python
traces = langfuse.api.trace.list(limit=100, user_id="user_123", tags=["production"])  # pagination via cursor
trace = langfuse.api.trace.get("traceId")
```

### Observations

```python
# Default high-performance endpoint (formerly observations_v_2)
observations = langfuse.api.observations.get_many(
    trace_id="abcdef1234",
    type="GENERATION",
    limit=100,
    fields="core,basic,usage"
)

# Legacy v1 endpoint
legacy_observations = langfuse.api.legacy.observations_v1.get_many(
    trace_id="abcdef1234",
    type="GENERATION",
    limit=100
)
legacy_observation = langfuse.api.legacy.observations_v1.get("observationId")
```

### Sessions

```python
sessions = langfuse.api.sessions.list(limit=50)
```

### Scores

```python
# Default high-performance endpoint (formerly score_v_2)
langfuse.api.scores.get_many(score_ids = "ScoreId")

# Legacy v1 endpoint
langfuse.api.legacy.score_v1.get(score_ids = "ScoreId")
```

### Prompts

Please refer to the [prompt management documentation](/docs/prompt-management/get-started) on fetching prompts.

### Datasets

```python
# Namespaces:
# - langfuse.api.datasets.*
# - langfuse.api.dataset_items.*
# - langfuse.api.dataset_run_items.*
```

### Metrics

```python
# Default high-performance endpoint (formerly metrics_v_2)
query_v2 = """
{
  "view": "observations",
  "metrics": [{"measure": "totalCost", "aggregation": "sum"}],
  "dimensions": [{"field": "providedModelName"}],
  "filters": [],
  "fromTimestamp": "2025-05-01T00:00:00Z",
  "toTimestamp": "2025-05-13T00:00:00Z"
}
"""

langfuse.api.metrics.get(query = query_v2)

# Legacy v1 endpoint
query_v1 = """
{
  "view": "traces",
  "metrics": [{"measure": "count", "aggregation": "count"}],
  "dimensions": [{"field": "name"}],
  "filters": [],
  "fromTimestamp": "2025-05-01T00:00:00Z",
  "toTimestamp": "2025-05-13T00:00:00Z"
}
"""

langfuse.api.legacy.metrics_v1.metrics(query = query_v1)
```

#### Async equivalents

```python
# All endpoints are also available as async under `async_api`:
trace = await langfuse.async_api.trace.get("traceId")
traces = await langfuse.async_api.trace.list(limit=100)
```

#### Common filtering & pagination

- limit, cursor (pagination)
- time range filters (e.g., start_time, end_time)
- entity filters: user_id, session_id, trace_id, type, name, tags, level, etc.

See the Public API for the exact parameters per resource.

</Tab>
<Tab title="JS/TS SDK">

<Callout type="info">

The methods on the `langfuse.api` are auto-generated from the API reference and cover all entities. You can explore more entities via Intellisense

</Callout>

```bash
npm install @langfuse/client
```

```ts
import { LangfuseClient } from "@langfuse/client";

const langfuse = new LangfuseClient();

// Fetch list of traces, supports filters and pagination
const traces = await langfuse.api.trace.list();

// Fetch a single trace by ID
const trace = await langfuse.api.trace.get("traceId");

// Fetch list of observations (default high-performance endpoint; formerly observationsV2)
const observations = await langfuse.api.observations.getMany({
  traceId: "abcdef1234",
  type: "GENERATION",
  limit: 100,
  fields: "core,basic,usage"
});

// Fetch list of observations (legacy v1 endpoint)
const legacyObservations = await langfuse.api.legacy.observationsV1.getMany();
const legacyObservation = await langfuse.api.legacy.observationsV1.get("observationId");

// Fetch list of sessions
const sessions = await langfuse.api.sessions.list();

// Fetch a single session by ID
const session = await langfuse.api.sessions.get("sessionId");

// Fetch list of scores (default high-performance endpoint; formerly scoreV2)
const scores = await langfuse.api.scores.getMany();

// Fetch a single score by ID
const score = await langfuse.api.scores.getById("scoreId");

// Legacy v1 scores endpoint
const legacyScores = await langfuse.api.legacy.scoreV1.get();

// Fetch metrics (default high-performance endpoint; formerly metricsV2)
const metrics = await langfuse.api.metrics.get({
  query: JSON.stringify({
    view: "observations",
    metrics: [{ measure: "totalCost", aggregation: "sum" }],
    dimensions: [{ field: "providedModelName" }],
    filters: [],
    fromTimestamp: "2025-05-01T00:00:00Z",
    toTimestamp: "2025-05-13T00:00:00Z"
  })
});

// Legacy v1 namespaces:
// - langfuse.api.legacy.observationsV1
// - langfuse.api.legacy.scoreV1
// - langfuse.api.legacy.metricsV1

// Explore more entities via Intellisense
```

The above examples show the current JavaScript SDK API methods. All methods support filters and pagination as shown in the code examples.

</Tab>
</LangTabs>

## Related Resources

- For large-scale data exports (e.g., all traces for fine-tuning or analytics), consider using the [Blob Storage Export](/docs/api-and-data-platform/features/export-to-blob-storage) to automatically sync data to S3, GCS, or Azure on a schedule instead of paginating through the API.
- To manually export filtered data from the Langfuse UI, see [Export from UI](/docs/api-and-data-platform/features/export-from-ui).
