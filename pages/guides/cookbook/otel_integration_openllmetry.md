---
description: Example cookbook for the OpenLLMetry Langfuse integration using OpenTelemetry.
category: Integrations
---

# OpenLLMetry Integration via OpenTelemetry

Langfuse provides a backend built on OpenTelemetry for ingesting trace data, and you can use different instrumentation libraries to export traces from your applications. In this guide, we showcase how to instrument your LLM application using the [OpenLLMetry instrumentation library](https://github.com/traceloop/openllmetry) by Traceloop.

> **About OpenLLMetry:** [OpenLLMetry](https://www.traceloop.com/docs/openllmetry/introduction) is an open source project that simplifies monitoring and debugging of your LLM application. It leverages OpenTelemetry to collect trace data in a non-intrusive manner.

## Step 1: Install Dependencies

Begin by installing the necessary Python packages. In this example, we need the `openai` library to interact with OpenAI’s API and `traceloop-sdk` for enabling OpenLLMetry instrumentation.

```python
%pip install openai traceloop-sdk
```

## Step 2: Configure Environment Variables

Before sending any requests, configure your environment with the necessary credentials and endpoints. Here, we set up Langfuse authentication by combining your public and secret keys into a Base64-encoded token. We also specify the Langfuse endpoint based on your desired geographical region (EU or US) and provide your OpenAI API key.

```python
import os
import base64

LANGFUSE_PUBLIC_KEY = "pk-lf-..."
LANGFUSE_SECRET_KEY = "sk-lf-..."
LANGFUSE_AUTH = base64.b64encode(f"{LANGFUSE_PUBLIC_KEY}:{LANGFUSE_SECRET_KEY}".encode()).decode()

os.environ["OTEL_EXPORTER_OTLP_ENDPOINT"] = "https://cloud.langfuse.com/api/public/otel" # 🇪🇺 EU data region
# os.environ["OTEL_EXPORTER_OTLP_ENDPOINT"] = "https://us.cloud.langfuse.com/api/public/otel" # 🇺🇸 US data region

os.environ["OTEL_EXPORTER_OTLP_HEADERS"] = f"Authorization=Basic {LANGFUSE_AUTH}"

# Set your OpenAI API key.
os.environ["OPENAI_API_KEY"] = "sk-proj-..."
```

Configure `tracer_provider` and add a span processor to export traces to Langfuse. `OTLPSpanExporter()` uses the endpoint and headers from the environment variables.

```python
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace.export import SimpleSpanProcessor

trace_provider = TracerProvider()
trace_provider.add_span_processor(SimpleSpanProcessor(OTLPSpanExporter()))

# Sets the global default tracer provider
from opentelemetry import trace
trace.set_tracer_provider(trace_provider)

# Creates a tracer from the global tracer provider
tracer = trace.get_tracer(__name__)
```

## Step 3: Initialize Instrumentation

Next, initialize the OpenLLMetry instrumentation using the `traceloop-sdk`. Using `disable_batch=True` is recommended if you run this code in a notebook as traces are sent immediately without waiting for batching.

```python
from traceloop.sdk import Traceloop

Traceloop.init(disable_batch=True,
               api_endpoint=os.environ.get("OTEL_EXPORTER_OTLP_ENDPOINT"),
               headers=os.environ.get(f"Authorization=Basic {LANGFUSE_AUTH}"),)
```

## Step 4: Execute a Sample LLM Request

With instrumentation enabled, every OpenAI API call will now be traced. The following example sends a chat completion request to illustrate the integration.

```python
openai_client = OpenAI()

chat_completion = openai_client.chat.completions.create(
    messages=[
        {
          "role": "user",
          "content": "What is LLM Observability?",
        }
    ],
    model="gpt-4o-mini",
)

print(chat_completion)
```

## Step 5: Pass Additional Attributes (Optional)

Opentelemetry lets you attach a set of attributes to all spans by setting [`set_attribute`](https://opentelemetry.io/docs/languages/python/instrumentation/#add-attributes-to-a-span). This allows you to set properties like a Langfuse Session ID, to group traces into Langfuse Sessions or a User ID, to assign traces to a specific user. You can find a list of all supported attributes in the [here](/docs/opentelemetry/get-started#property-mapping).

```python
from openai import OpenAI

with tracer.start_as_current_span("OpenAI-Trace") as span:
    span.set_attribute("langfuse.user.id", "user-123")
    span.set_attribute("langfuse.session.id", "123456789")
    span.set_attribute("langfuse.tags", ["smolagents", "demo"])
    span.set_attribute("langfuse.prompt.name", "test-1")

    # Create an instance of the OpenAI client.
    openai_client = OpenAI()

    # Make a sample chat completion request. This request will be traced by OpenLIT and sent to Langfuse.
    chat_completion = openai_client.chat.completions.create(
        messages=[
            {
              "role": "user",
              "content": "What is LLM Observability?",
            }
        ],
        model="gpt-4o-mini",
    )

    print(chat_completion)
```

## Step 6: View the Trace in Langfuse

After running the above code, you can review the generated trace in your Langfuse dashboard:

[Example Trace in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/e417c49b4044725e48aa0e089534fa12?timestamp=2025-02-02T22%3A04%3A04.487Z)

![OpenLLMetry OpenAI Trace Link](https://langfuse.com/images/cookbook/otel-integration-openllmetry/openllmetry-openai-trace.png)
