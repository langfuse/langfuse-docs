---
title: "LlamaIndex.TS Integration"
description: "This guide shows how you can instrument the LlamaIndex.TS package to trace your LLM interactions to Langfuse using the Traceloop OpenTelemetry SDK."
category: Integrations
---

# LlamaIndex.TS Integration

This guide shows how you can instrument the [LlamaIndex.TS package](https://ts.llamaindex.ai/) to trace your LLM interactions to Langfuse using the [Traceloop OpenTelemetry SDK](https://github.com/traceloop/openllmetry-js).

_**Note**: This cookbook uses Deno.js, which requires different syntax for importing packages and setting environment variables._

## Step 1: Set Up Your Environment

Before you begin, ensure that you have all the required npm packages installed. In this guide, we use the following packages:

- **dotenv**: Loads environment variables from a .env file.
- **base-64**: Encodes your Langfuse keys into a Base64 token.
- **@traceloop/node-server-sdk**: Exports the collected traces to Langfuse.
- **openai**: (Optional) Provides an alternative method to trigger chat completions.

The first code cell sets up the environment by importing the necessary modules, reading the keys from the environment, and encoding these credentials. It also defines the endpoints for the OTLP exporter and Langfuse headers. Adjust the region (EU or US) as needed for your deployment.

```typescript
import * as dotenv from "npm:dotenv";
import base64 from "npm:base-64"; // Use default import instead of namespace import

dotenv.config();

const LANGFUSE_PUBLIC_KEY = "pk-lf-...";
const LANGFUSE_SECRET_KEY = "sk-lf-...";
const LANGFUSE_AUTH = base64.encode(
  `${LANGFUSE_PUBLIC_KEY}:${LANGFUSE_SECRET_KEY}`
);

process.env["TRACELOOP_BASE_URL"] =
  "https://cloud.langfuse.com/api/public/otel"; // 🇪🇺 EU data region
// process.env["OTEL_EXPORTER_OTLP_ENDPOINT"] = "https://us.cloud.langfuse.com/api/public/otel"; // 🇺🇸 US data region
process.env["TRACELOOP_HEADERS"] = `Authorization=Basic ${LANGFUSE_AUTH}`;

// your openai key
process.env["OPENAI_API_KEY"] = "sk-...";
```

## Step 2: Initialize the Traceloop Instrumentation

Next, initialize the traceloop instrumentation to route trace data from your LLM interactions to Langfuse. By passing `disableBatch: true`, traces are sent immediately Langfuse. This is useful when running in a notebook environment where you want real-time trace output.

```typescript
import * as traceloop from "npm:@traceloop/node-server-sdk";

traceloop.initialize({ disableBatch: true });
```

    Traceloop exporting traces to https://cloud.langfuse.com/api/public/otel

## Step 3: Make LLM Chat Requests

Once the environment and instrumentation are initialized, you can make LLM chat requests.

This example uses the `openai` package to create a chat completion request. Every model call automatically generates a trace in Langfuse.

```typescript
import { OpenAI } from "npm:llamaindex";

const llm = new OpenAI();
const response = await llm.chat({
  messages: [{ content: "Tell me a joke.", role: "user" }],
});

console.log(response.message.content);
```

    Why don't skeletons fight each other?

    They don't have the guts!

## Step 4: View Your Traces in Langfuse

After executing the code, all traced operations are sent to Langfuse’s OpenTelemetry backend. You can now see traces in Langfuse and analyze the performance and flow of your LLM application.
