---
title: "Trace IDs & Distributed Tracing"
description: "Use custom trace IDs and tracer IDs for distributed tracing in Langfuse. Link traces across services, use deterministic IDs, and integrate with your existing tracing infrastructure."
sidebarTitle: Trace IDs & Distributed Tracing
---

# Trace IDs & Distributed Tracing

A **trace ID** is a unique identifier that follows a request as it flows through your system. In distributed systems, trace IDs enable you to correlate operations across multiple services and reconstruct the full request lifecycle.

By default, Langfuse assigns random 32 hexchar trace IDs and 16 hexchar observation IDs.

## Creating and accessing Trace IDs

<LangTabs items={["Python SDK", "JS/TS SDK"]}>
<Tab title="Python SDK">

Use [`create_trace_id()`](https://python.reference.langfuse.com/langfuse#Langfuse.create_trace_id) to generate a trace ID. If a `seed` is provided, the ID is deterministic. Use the same seed to get the same ID. This is useful for correlating external IDs with Langfuse traces.

```python /create_trace_id/
from langfuse import get_client, Langfuse
langfuse = get_client()

external_request_id = "req_12345"
deterministic_trace_id = langfuse.create_trace_id(seed=external_request_id)
``` 

Use [`get_current_trace_id()`](https://python.reference.langfuse.com/langfuse#Langfuse.get_current_trace_id) to get the current trace ID and [`get_current_observation_id`](https://python.reference.langfuse.com/langfuse#Langfuse.get_current_observation_id) to get the current observation ID.

You can also use `observation.trace_id` and `observation.id` to access the trace and observation IDs directly from a LangfuseSpan or LangfuseGeneration object.

```python /create_trace_id/ /get_current_trace_id/ /get_current_observation_id/
from langfuse import get_client, Langfuse
langfuse = get_client()

with langfuse.start_as_current_observation(as_type="span", name="my-op") as current_op:
    trace_id = langfuse.get_current_trace_id()
    observation_id = langfuse.get_current_observation_id()
    print(trace_id, observation_id)
```
</Tab>
<Tab title="JS/TS SDK">
Use [`createTraceId`](https://langfuse-js-git-main-langfuse.vercel.app/functions/_langfuse_tracing.createTraceId.html) to generate a deterministic trace ID from a seed.

```ts /createTraceId/ /getActiveTraceId/
import { createTraceId, startObservation } from "@langfuse/tracing";

const externalId = "support-ticket-54321";
const langfuseTraceId = await createTraceId(externalId);
```

Use [`getActiveTraceId`](https://langfuse-js-git-main-langfuse.vercel.app/functions/_langfuse_tracing.getActiveTraceId.html) to get the active trace ID and [`getActiveSpanId`](https://langfuse-js-git-main-langfuse.vercel.app/functions/_langfuse_tracing.getActiveSpanId.html) to get the current observation ID.

```ts /getActiveTraceId/
import { startObservation, getActiveTraceId } from "@langfuse/tracing";

await startObservation("run", async (span) => {
  const traceId = getActiveTraceId();
  console.log(`Current trace ID: ${traceId}`);
});
```
</Tab>
</LangTabs>

## Setting a custom Trace ID

You can set a custom trace ID when wrapping your application code with the Langfuse SDK.

<LangTabs items={["Python SDK", "JS/TS SDK"]}>
<Tab title="Python SDK">

**Using the Context Manager**

```python
from langfuse import get_client

langfuse = get_client()

# Use a predefined trace ID with trace_context parameter
with langfuse.start_as_current_observation(
    as_type="span",
    name="my-operation",
    trace_context={
        "trace_id": "abcdef1234567890abcdef1234567890",  # Must be 32 hex chars
        "parent_span_id": "fedcba0987654321"  # Optional, 16 hex chars
    }
) as observation:
    print(f"This observation has trace_id: {observation.trace_id}")
    # YOUR APPLICATION CODE HERE
```

**Using the Decorator**

```python
from langfuse import observe

@observe()
def my_operation(input):
    # YOUR APPLICATION CODE HERE
    result = call_llm(input)
    return result

process_user_request(
    input="Hello",
    langfuse_trace_id="abcdef1234567890abcdef1234567890" # Must be 32 hex chars
)
```

</Tab>
<Tab title="JS/TS SDK">

**Deterministic trace IDs**

When starting a new trace with a predetermined `traceId`, you must also provide an arbitrary parent-`spanId` for the parent observation. The parent span ID value is irrelevant as long as it is a valid 16-hexchar string as the span does not actually exist within the trace but is only used for trace ID inheritance of the created observation.

You can create valid, deterministic trace IDs from a seed string using `createTraceId`. This is useful for correlating Langfuse traces with IDs from external systems, like a support ticket ID.

```typescript
import { createTraceId, startObservation } from "@langfuse/tracing";

const externalId = "support-ticket-54321";

// Generate a valid, deterministic traceId from the external ID
const langfuseTraceId = await createTraceId(externalId);

// You can now start a new trace with this ID
const rootSpan = startObservation(
  "process-ticket",
  {},
  {
    parentSpanContext: {
      traceId: langfuseTraceId,
      spanId: "0123456789abcdef", // A valid 16 hexchar string; value is irrelevant as parent span does not exist but only used for inheritance
      traceFlags: 1, // mark trace as sampled
    },
  }
);

// Later, you can regenerate the same traceId to score or retrieve the trace
const scoringTraceId = await createTraceId(externalId);
// scoringTraceId will be the same as langfuseTraceId
```

Setting a parentSpanContext will detach the created span from the active span context as it no longer inherits from the current active span in the context.


Learn more in the [Langfuse SDK instrumentation docs](/docs/observability/sdk/instrumentation#trace-ids).

</Tab>
</LangTabs>
