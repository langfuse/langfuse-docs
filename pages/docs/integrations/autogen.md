---
title: Observability for AutoGen with Langfuse
description: Learn how to integrate Langfuse with AutoGen via OpenTelemetry using OpenLit
---

# Integrate Langfuse with AutoGen

This notebook demonstrates how to integrate **Langfuse** with **AutoGen** using OpenTelemetry via the **OpenLit** SDK. By the end of this notebook, you will be able to trace your AutoGen applications with Langfuse for improved observability and debugging.

> **What is AutoGen?** [AutoGen](https://microsoft.github.io/autogen/stable/) [(GitHub)](https://github.com/microsoft/autogen) is an open-source framework developed by Microsoft for building LLM applications, including agents capable of complex reasoning and interactions. AutoGen simplifies the creation of conversational agents that can collaborate or compete to solve tasks.

> **What is Langfuse?** [Langfuse](https://langfuse.com) is an open-source LLM engineering platform. It provides tracing and monitoring capabilities for LLM applications, helping developers debug, analyze, and optimize their AI systems. Langfuse integrates with various tools and frameworks via native integrations, OpenTelemetry, and API/SDKs.

## Get Started

We'll walk through a simple example of using AutoGen and integrating it with Langfuse via OpenTelemetry using OpenLit.

### Step 1: Install Dependencies



```python
%pip install langfuse openlit autogen
%pip install opentelemetry-sdk opentelemetry-exporter-otlp
```

### Step 2: Set Up Environment Variables

Set your Langfuse API keys and configure OpenTelemetry export settings to send traces to Langfuse. Please refer to the [Langfuse OpenTelemetry Docs](https://langfuse.com/docs/opentelemetry/get-started) for more information on the Langfuse OpenTelemetry endpoint `/api/public/otel` and authentification.


```python
import os
import base64

# Get keys for your project from the project settings page: https://cloud.langfuse.com
os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-..." 
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-..." 
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region


LANGFUSE_AUTH = base64.b64encode(
    f"{os.environ.get('LANGFUSE_PUBLIC_KEY')}:{os.environ.get('LANGFUSE_SECRET_KEY')}".encode()
).decode()

os.environ["OTEL_EXPORTER_OTLP_ENDPOINT"] = os.environ.get("LANGFUSE_HOST") + "/api/public/otel"
os.environ["OTEL_EXPORTER_OTLP_HEADERS"] = f"Authorization=Basic {LANGFUSE_AUTH}"

# your openai key
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

### Step 3: Initialize OpenLit

Initialize OpenLit to start capturing OpenTelemetry traces.


```python
import openlit

# Initialize OpenLIT instrumentation. The disable_batch flag is set to true to process traces immediately.
openlit.init(tracer=tracer, disable_batch=True)
```

### Step 4: Create a Simple AutoGen Application

We'll create a simple AutoGen application where an Assistant agent answers a user's question.


```python
import autogen
from autogen import AssistantAgent, UserProxyAgent

llm_config = {"model": "gpt-4o", "api_key": os.environ["OPENAI_API_KEY"]}
assistant = AssistantAgent("assistant", llm_config=llm_config)

user_proxy = UserProxyAgent(
    "user_proxy", code_execution_config={"executor": autogen.coding.LocalCommandLineCodeExecutor(work_dir="coding")}
)

# Start the chat
user_proxy.initiate_chat(
    assistant,
    message="What is Langfuse?",
)

```

    [33muser_proxy[0m (to assistant):
    
    What is Langfuse?
    
    --------------------------------------------------------------------------------
    [33massistant[0m (to user_proxy):
    
    Langfuse is a debugging and observability tool designed specifically for AI workflows. It provides developers with insights and tools to monitor, debug, and improve their AI models and applications. Langfuse mainly focuses on logging AI interactions, analyzing model performance, tracking errors, and understanding user interactions with AI systems. By providing a detailed overview of how AI workflows are performing in production, Langfuse helps teams iterate faster and enhance their AI solutions’ reliability and effectiveness. TERMINATE
    
    --------------------------------------------------------------------------------





    ChatResult(chat_id=None, chat_history=[{'content': 'What is Langfuse?', 'role': 'assistant', 'name': 'user_proxy'}, {'content': 'Langfuse is a debugging and observability tool designed specifically for AI workflows. It provides developers with insights and tools to monitor, debug, and improve their AI models and applications. Langfuse mainly focuses on logging AI interactions, analyzing model performance, tracking errors, and understanding user interactions with AI systems. By providing a detailed overview of how AI workflows are performing in production, Langfuse helps teams iterate faster and enhance their AI solutions’ reliability and effectiveness. TERMINATE', 'role': 'user', 'name': 'assistant'}], summary='Langfuse is a debugging and observability tool designed specifically for AI workflows. It provides developers with insights and tools to monitor, debug, and improve their AI models and applications. Langfuse mainly focuses on logging AI interactions, analyzing model performance, tracking errors, and understanding user interactions with AI systems. By providing a detailed overview of how AI workflows are performing in production, Langfuse helps teams iterate faster and enhance their AI solutions’ reliability and effectiveness. ', cost={'usage_including_cached_inference': {'total_cost': 0.00213, 'gpt-4o-2024-08-06': {'cost': 0.00213, 'prompt_tokens': 472, 'completion_tokens': 95, 'total_tokens': 567}}, 'usage_excluding_cached_inference': {'total_cost': 0}}, human_input=['exit'])



### Step 5: Pass Additional Attributes (Optional)

Opentelemetry lets you attach a set of attributes to all spans by setting [`set_attribute`](https://opentelemetry.io/docs/languages/python/instrumentation/#add-attributes-to-a-span). This allows you to set properties like a Langfuse Session ID, to group traces into Langfuse Sessions or a User ID, to assign traces to a specific user. You can find a list of all supported attributes in the [here](/docs/opentelemetry/get-started#property-mapping).


```python
with tracer.start_as_current_span("AutoGen-Trace") as span:
    span.set_attribute("langfuse.user.id", "user-123")
    span.set_attribute("langfuse.session.id", "123456789")
    span.set_attribute("langfuse.tags", ["semantic-kernel", "demo"])
    span.set_attribute("langfuse.prompt.name", "test-1")

    # Start the chat
    user_proxy.initiate_chat(
        assistant,
        message="What is Langfuse?",
    )
```

Alternatively, OpenTelemetry traces in Langfuse can also be modified using the [Python low-level SDK](https://langfuse.com/docs/sdk/python/low-level-sdk). For this, we create a new parent span and fetch the OpenTelemetry `trace_id`. This trace_id is then used to modify the span. Have a look at the [Python low-level SDK](https://langfuse.com/docs/sdk/python/low-level-sdk) for more examples. 


```python
from opentelemetry.trace import format_trace_id
from langfuse import Langfuse

langfuse = Langfuse()

with tracer.start_as_current_span("Semantic-Kernel-Trace") as span:

    # Start the chat
    user_proxy.initiate_chat(
        assistant,
        message="What is Langfuse?",
    )
    
    # Get the trace_id from the Otel span
    current_span = trace.get_current_span()
    span_context = current_span.get_span_context()
    trace_id = span_context.trace_id
    formatted_trace_id = format_trace_id(trace_id)

    # Update the trace using the low-level Python SDK.
    langfuse.trace(
        id=formatted_trace_id, 
        name = "docs-retrieval",
        user_id = "user__935d7d1d-8625-4ef4-8651-544613e7bd22",
        metadata = {"email": "user@langfuse.com"},
        tags = ["production"]
    )
```


### Step 6: See Traces in Langfuse

After running the agent above, you can log in to your Langfuse dashboard and view the traces generated by your AutoGen application. Here is an example screenshot of a trace in Langfuse:

![Langfuse Trace](https://langfuse.com/images/cookbook/integration-autogen/autogen-example-trace.png)

You can also view the public trace here: [Langfuse Trace Example](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/df850ab499107d4348584cf5933baabd?timestamp=2025-02-04T16%3A55%3A51.660Z&observation=286c648acb0105c2)

## References

- [Langfuse OpenTelemetry Docs](https://langfuse.com/docs/opentelemetry/get-started)
- [AutoGen OpenTelemetry Docs](https://microsoft.github.io/autogen/dev//user-guide/core-user-guide/framework/telemetry.html)


