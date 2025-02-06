---
title: Observability for LlamaIndex Workflows with Langfuse  
description: Learn how to integrate Langfuse with LlamaIndex Workflows using OpenTelemetry. This cookbook shows you how to trace AI workflows, improve observability, and debug LLM applications.  
---

# Observability for LlamaIndex Workflows

This cookbook demonstrates how to use [Langfuse](https://langfuse.com) to gain real-time observability for your [LlamaIndex Workflows](https://docs.llamaindex.ai/en/stable/module_guides/workflow/). You will learn how to leverage OpenTelemetry to trace each step within a workflow for improved monitoring, debugging, and performance optimization.

> **What are LlamaIndex Workflows?** [LlamaIndex Workflows](https://docs.llamaindex.ai/en/stable/module_guides/workflow/) is a flexible, event-driven framework designed to build robust AI agents. In LlamaIndex, workflows are created by chaining together multiple steps—each defined and validated using the `@step` decorator. Every step processes specific event types, allowing you to orchestrate complex processes such as AI agent collaboration, RAG flows, data extraction, and more.

> **What is Langfuse?** [Langfuse](https://langfuse.com) is the open source LLM engineering platform. It helps teams to collaboratively manage prompts, trace applications, debug problems, and evaluate their LLM system in production.

## Get Started

We'll walk through a simple example of using LlamaIndex Workflows and integrating it with Langfuse via OpenTelemetry.

### Step 1: Install Dependencies


```python
%pip install opentelemetry-sdk opentelemetry-exporter-otlp
%pip install openai gcsfs nest-asyncio "openinference-instrumentation-llama-index>=2.0.0"
%pip install llama-index
```

### Step 2: Set Up Environment Variables

Configure your Langfuse API keys and OpenTelemetry export settings. Replace the placeholder values with your actual credentials. These settings ensure that OpenTelemetry traces are sent to Langfuse for real-time observability.


```python
import os
import base64

LANGFUSE_PUBLIC_KEY="pk-lf-..."
LANGFUSE_SECRET_KEY="sk-lf-..."
LANGFUSE_AUTH=base64.b64encode(f"{LANGFUSE_PUBLIC_KEY}:{LANGFUSE_SECRET_KEY}".encode()).decode()

# your openai key
os.environ["OPENAI_API_KEY"] = "sk-..."

os.environ["OTEL_EXPORTER_OTLP_ENDPOINT"] = "https://cloud.langfuse.com/api/public/otel" # 🇪🇺 EU data region
# os.environ["OTEL_EXPORTER_OTLP_ENDPOINT"] = "https://us.cloud.langfuse.com/api/public/otel" # 🇺🇸 US data region
os.environ["OTEL_EXPORTER_OTLP_HEADERS"] = f"Authorization=Basic {LANGFUSE_AUTH}"
```

### Step 3: Initialize the `LlamaIndexInstrumentor`

Initialize the `LlamaIndexInstrumentor` from the [openinference library](https://github.com/Arize-ai/openinference) before your application code. Configure `tracer_provider` and add a span processor to export traces to Langfuse. `OTLPSpanExporter()` (here imported as `HTTPSpanExporter`) uses the endpoint and headers from the environment variables.


```python
from opentelemetry.sdk import trace as trace_sdk
from opentelemetry.sdk.trace.export import SimpleSpanProcessor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import (
    OTLPSpanExporter as HTTPSpanExporter,
)
from openinference.instrumentation.llama_index import LlamaIndexInstrumentor

# Add Langfuse
span_langfuse_processor = SimpleSpanProcessor(HTTPSpanExporter())

# Add them to the tracer
tracer_provider = trace_sdk.TracerProvider()
tracer_provider.add_span_processor(span_processor=span_langfuse_processor)

# Instrument the application
LlamaIndexInstrumentor().instrument(tracer_provider=tracer_provider)
```

### Step 4: Create a Simple LlamaIndex Workflows Application

In LlamaIndex Workflows, you build event-driven AI agents by defining steps with the `@step` decorator. Each step processes an event and, if appropriate, emits new events. In this example, we create a simple workflow with two steps: one that pre-processes an incoming event and another that generates a reply.


```python
from llama_index.core.workflow import (
    Event,
    StartEvent,
    StopEvent,
    Workflow,
    step,
)

# `pip install llama-index-llms-openai` if you don't already have it
from llama_index.llms.openai import OpenAI

class JokeEvent(Event):
    joke: str

class JokeFlow(Workflow):
    llm = OpenAI()

    @step
    async def generate_joke(self, ev: StartEvent) -> JokeEvent:
        topic = ev.topic

        prompt = f"Write your best joke about {topic}."
        response = await self.llm.acomplete(prompt)
        return JokeEvent(joke=str(response))

    @step
    async def critique_joke(self, ev: JokeEvent) -> StopEvent:
        joke = ev.joke

        prompt = f"Give a thorough analysis and critique of the following joke: {joke}"
        response = await self.llm.acomplete(prompt)
        return StopEvent(result=str(response))

w = JokeFlow(timeout=60, verbose=False)
result = await w.run(topic="pirates")
print(str(result))
```

    Analysis:
    This joke plays on the pun of "fish and ships" sounding like "fish and chips," a popular dish at seafood restaurants. The joke also incorporates the pirate theme by mentioning a pirate going to a seafood restaurant, which adds an element of humor.
    
    Critique:
    Overall, this joke is light-hearted and playful, making it suitable for a general audience. The pun is clever and well-executed, providing a humorous twist to a common phrase. However, the joke may be considered somewhat predictable or cliché, as puns involving homophones are a common comedic device. Additionally, the joke relies heavily on wordplay and does not have a complex setup or punchline, which may limit its appeal to some audiences. Overall, while this joke is amusing and likely to elicit a chuckle, it may not be considered particularly original or innovative.


### Step 5: View Traces in Langfuse

After running your workflow, log in to [Langfuse](https://cloud.langfuse.com) to explore the generated OpenTelemetry traces. You will see detailed logs for each workflow step along with metrics such as token counts, latencies, and execution paths. For example, the trace may show how the preprocessing and reply generation steps were executed in your LlamaIndex Workflows application.

![Langfuse Trace Example](https://langfuse.com/images/cookbook/integration-llamaindex-workflows/llamaindex-workflows-example-trace.png)

_[Public example trace in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/9463f912ef8b9763a62d67445bcbc737?timestamp=2025-02-06T13%3A51%3A33.358Z&observation=7d9e694bfe0dd983)_

## References

- [Langfuse OpenTelemetry Docs](https://langfuse.com/docs/opentelemetry/get-started)  
- [LlamaIndex Workflows Documentation](https://docs.llamaindex.ai/en/stable/module_guides/workflow/)  



