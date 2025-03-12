---
title: Pydantic AI Integration via OpenTelemetry
description: Open Source Observability for Pydantic AI. Example cookbook for the Pydantic AI Langfuse integration using OpenTelemetry.
category: Integrations
---

# Pydantic AI Integration via OpenTelemetry

Langfuse offers an [OpenTelemetry backend](https://langfuse.com/docs/opentelemetry/) that ingests trace data from a variety of OpenTelemetry instrumentation libraries. In this guide, we demonstrate how to use the Pydantic Logfire instrumentation library to instrument your Pydantic AI agents.

> **About PydanticAI:** [PydanticAI](https://pydantic-ai.readthedocs.io/en/latest/) is a Python agent framework designed to simplify the development of production-grade generative AI applications. It brings the same type-safety, ergonomic API design, and developer experience found in FastAPI to the world of GenAI app development. 

## Step 1: Install Dependencies

Before you begin, install the necessary Python packages. The command below will install the `pydantic-ai` package along with Logfire support, which is required for trace ingestion via Langfuse:


```python
%pip install pydantic-ai[logfire]
```

## Step 2: Configure Environment Variables

To forward trace data to Langfuse, you must set up the required environment variables. This includes providing your Langfuse API keys and the proper OpenTelemetry exporter endpoint. Additionally, you need to specify your OpenAI API key if you are using OpenAI for your generative tasks.


```python
import os
import base64

LANGFUSE_PUBLIC_KEY = "pk-lf-..."
LANGFUSE_SECRET_KEY = "sk-lf-..."
LANGFUSE_AUTH = base64.b64encode(f"{LANGFUSE_PUBLIC_KEY}:{LANGFUSE_SECRET_KEY}".encode()).decode()

os.environ["OTEL_EXPORTER_OTLP_ENDPOINT"] = "https://cloud.langfuse.com/api/public/otel" # EU data region
# os.environ["OTEL_EXPORTER_OTLP_ENDPOINT"] = "https://us.cloud.langfuse.com/api/public/otel" # US data region
os.environ["OTEL_EXPORTER_OTLP_HEADERS"] = f"Authorization=Basic {LANGFUSE_AUTH}"

# your openai key
os.environ["OPENAI_API_KEY"] = "sk-..."
```

## Step 3: Initialize Instrumentation

Now, initialize Logfire’s instrumentation and define a sample Pydantic AI agent that makes use of dependency injection and tool registration. In this example, we create a "roulette" agent. The agent is configured to call a tool function (`roulette_wheel`), which checks if a given square is a winner. The agent is type-safe, ensuring that the dependency (`deps_type`) and the output (`result_type`) have defined types.


```python
import nest_asyncio
nest_asyncio.apply()
```


```python
import logfire

logfire.configure(
    service_name='my_logfire_service',

    # Sending to Logfire is on by default regardless of the OTEL env vars.
    send_to_logfire=False,
)
```

Make sure to pass `instrument=True` while configuring the `Agent`.


```python
from pydantic_ai import Agent, RunContext

roulette_agent = Agent(
    'openai:gpt-4o',
    deps_type=int,
    result_type=bool,
    system_prompt=(
        'Use the `roulette_wheel` function to see if the '
        'customer has won based on the number they provide.'
    ),
    instrument=True
)


@roulette_agent.tool
async def roulette_wheel(ctx: RunContext[int], square: int) -> str:
    """check if the square is a winner"""
    return 'winner' if square == ctx.deps else 'loser'
```

## Step 4: Run the Agent

Finally, run your Pydantic AI agent and generate trace data that will be sent to Langfuse. In the example below, the agent is executed with a dependency value (the winning square) and natural language input. The output from the tool function is then printed.


```python
# Run the agent
success_number = 18
result = roulette_agent.run_sync('Put my money on square eighteen', deps=success_number)
print(result.data)
```

### Step 5: Pass Additional Attributes (Optional)

Opentelemetry lets you attach a set of attributes to all spans by setting [`set_attribute`](https://opentelemetry.io/docs/languages/python/instrumentation/#add-attributes-to-a-span). This allows you to set properties like a Langfuse Session ID, to group traces into Langfuse Sessions or a User ID, to assign traces to a specific user. You can find a list of all supported attributes in the [here](/docs/opentelemetry/get-started#property-mapping).


```python
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace.export import SimpleSpanProcessor
from opentelemetry import trace

trace_provider = TracerProvider()
trace_provider.add_span_processor(SimpleSpanProcessor(OTLPSpanExporter()))
trace.set_tracer_provider(trace_provider)
tracer = trace.get_tracer("my.tracer.name")

# Creates a new parent span and adds additional attributes
with tracer.start_as_current_span("Pydantic-Ai-Trace") as span:
    span.set_attribute("langfuse.user.id", "user-123")
    span.set_attribute("langfuse.session.id", "123456789")
    span.set_attribute("langfuse.tags", ["pydantic", "demo"])
    span.set_attribute("langfuse.prompt.name", "test-1")

    # Run the agent
    success_number = 23
    result = roulette_agent.run_sync('Put my money on square eighteen', deps=success_number)
    print(result.data)

    # Optional: Add input and output values to the new parent span
    span.set_attribute("input.value", success_number)
    span.set_attribute("output.value", result.new_messages_json())
```

## Step 6: Explore Traces in Langfuse

With the instrumentation in place, all trace data generated by the agent will be sent to Langfuse. You can view detailed trace logs—including operation timings, debugging information, and performance metrics—by accessing your Langfuse dashboard. For example, check out a [sample trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/01958b00f28af691900a70f06c3196e5?timestamp=2025-03-12T15%3A37%3A29.994Z&observation=a0a7ab9127ea620f) to see the flow of a Pydantic AI request.

[Example trace in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/01958b00f28af691900a70f06c3196e5?timestamp=2025-03-12T15%3A37%3A29.994Z&observation=a0a7ab9127ea620f)

![Pydantic AI OpenAI Trace](https://langfuse.com/images/cookbook/otel-integration-pydantic-ai/pydanticai-openai-trace-tree.png)
