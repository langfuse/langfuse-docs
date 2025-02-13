---
title: Tracing using the Arize SDK
description: Example cookbook on using the Arize AI SDK to trace your application to Langfuse.
---

# Tracing using the Arize SDK

Langfuse offers an [OpenTelemetry backend](https://langfuse.com/docs/opentelemetry/get-started) to ingest trace data from your LLM applications. With the Arize SDK and OpenTelemetry, you can log traces from multiple other frameworks to Langfuse. Below is an example of tracing OpenAI to Langfuse, you can find a full list of supported frameworks [here](https://docs.arize.com/phoenix/tracing/integrations-tracing). To make this example work with other frameworks, you just need to change the instrumentor to match the framework. 

> **Arize AI SDK:** Arize AI provides [Openinference](https://github.com/Arize-ai/openinference), a library that is complementary to OpenTelemetry to enable tracing of AI applications. OpenInference can be used with any OpenTelemetry-compatible backend. 

## Step 1: Install Dependencies

Install the necessary Python packages to enable OpenTelemetry tracing, openinference instrumentation, and the OpenAI SDK for making LLM requests.


```python
%pip install openai opentelemetry-sdk opentelemetry-exporter-otlp-proto-http openinference-instrumentation-openai
```

## Step 2: Configure Environment Variables

Configure your environment by setting the endpoint and header variables.


```python
import os
import base64

LANGFUSE_PUBLIC_KEY="pk-lf-..."
LANGFUSE_SECRET_KEY="sk-lf-..."
LANGFUSE_AUTH=base64.b64encode(f"{LANGFUSE_PUBLIC_KEY}:{LANGFUSE_SECRET_KEY}".encode()).decode()

os.environ["OTEL_EXPORTER_OTLP_ENDPOINT"] = "https://cloud.langfuse.com/api/public/otel" # EU data region
# os.environ["OTEL_EXPORTER_OTLP_ENDPOINT"] = "https://us.cloud.langfuse.com/api/public/otel" # US data region
os.environ["OTEL_EXPORTER_OTLP_HEADERS"] = f"Authorization=Basic {LANGFUSE_AUTH}"

# your openai key
os.environ["OPENAI_API_KEY"] = "sk-..."
```

## Step 3: Initialize Instrumentation

Before running any application code let's set up our instrumentor (you can replace this with any of the frameworks supported [here](https://docs.arize.com/phoenix/tracing/integrations-tracing))


```python
import openai
from opentelemetry import trace as trace_api
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk import trace as trace_sdk
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace.export import SimpleSpanProcessor

# Set up the trace provider
resource = Resource(attributes={})
tracer_provider = trace_sdk.TracerProvider(resource=resource)
span_exporter = OTLPSpanExporter()
span_processor = SimpleSpanProcessor(span_exporter=span_exporter)
tracer_provider.add_span_processor(span_processor=span_processor)
trace_api.set_tracer_provider(tracer_provider=tracer_provider)

# Now instrument OpenAI
from openinference.instrumentation.openai import OpenAIInstrumentor
OpenAIInstrumentor().instrument()
```

## Step 4: Execute a Sample LLM Request

With instrumentation enabled, every OpenAI API call will now be traced. The following example sends a chat completion request to illustrate the integration.


```python
response = openai.OpenAI().chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": "How does enhanced LLM observability improve AI debugging?",
        }
    ],
    model="gpt-4o-mini",
)
print(response.choices[0].message.content)
```

## Step 5: View the Traces in Langfuse

After running the above code, you can inspect the generated traces on your Langfuse dashboard:

![Example trace in Langfuse](https://langfuse.com/images/cookbook/otel-integration-arize/arize-ai-instrumentation-example-trace.png)

_[Public example trace in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/68481bf61e3088f38b9000c74e342fbb?timestamp=2025-02-11T16%3A18%3A13.316Z&observation=5e19466096ae5a95)_
