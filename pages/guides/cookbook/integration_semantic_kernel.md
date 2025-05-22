---
title: Observability for Semantic Kernel with Langfuse
description: Learn how to integrate Langfuse with Semantic Kernel for improved monitoring and debugging
category: Integrations
---

# Integrate Langfuse with Semantic Kernel

This notebook demonstrates how to integrate **Langfuse** with **Semantic Kernel** for improved observability and debugging. By the end of this notebook, you will be able to trace your Semantic Kernel applications with Langfuse.

> **What is Semantic Kernel?** [Semantic Kernel](https://learn.microsoft.com/en-us/semantic-kernel/overview/) [(GitHub)](https://github.com/microsoft/semantic-kernel) is an open-source SDK developed by Microsoft that combines LLMs with programming languages like C#, Python, and Java. It allows developers to create AI applications by integrating AI services, data sources, and logic, enabling rapid delivery of enterprise-grade solutions.

> **What is Langfuse?** [Langfuse](https://langfuse.com) is an open-source platform for LLM observability. It provides tracing and monitoring capabilities for AI applications, helping developers debug, analyze, and optimize their AI systems. Langfuse integrates with various tools and frameworks via native integrations, OpenTelemetry, and SDKs.

_**Note:** This notebook uses Python. However, this integration also works with other languages supported by Semantic Kernel, such as [C#](https://learn.microsoft.com/en-us/semantic-kernel/concepts/enterprise-readiness/observability/?pivots=programming-language-csharp) and [Java](https://learn.microsoft.com/en-us/semantic-kernel/concepts/enterprise-readiness/observability/?pivots=programming-language-java)._

## Get Started

We'll walk through a simple example of using Semantic Kernel and integrating it with Langfuse.

### Step 1: Install Dependencies

Install the necessary packages:



```python
%pip install langfuse openlit semantic-kernel
%pip install opentelemetry-sdk opentelemetry-exporter-otlp
```


### Step 2: Set Up Environment Variables

Set your Langfuse API keys and configure the Langfuse SDK. Replace the placeholders with your actual API keys.



```python
import os
import base64

# Get your own keys from https://cloud.langfuse.com
os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-..." 
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-..." 
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com"  # 🇪🇺 EU region example
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com"  # 🇺🇸 US region example

LANGFUSE_AUTH = base64.b64encode(
    f"{os.environ.get('LANGFUSE_PUBLIC_KEY')}:{os.environ.get('LANGFUSE_SECRET_KEY')}".encode()
).decode()

os.environ["OTEL_EXPORTER_OTLP_ENDPOINT"] = os.environ.get("LANGFUSE_HOST") + "/api/public/otel"
os.environ["OTEL_EXPORTER_OTLP_HEADERS"] = f"Authorization=Basic {LANGFUSE_AUTH}"

# your openai key
os.environ["OPENAI_API_KEY"] = "sk-proj-..."
os.environ["OPENAI_CHAT_MODEL_ID"] = "gpt-4o"
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

Initialize the [OpenLit instrumentation SDK](https://docs.openlit.io/latest/sdk-configuration) to start capturing OpenTelemetry traces.


```python
import openlit

# Initialize OpenLIT instrumentation. The disable_batch flag is set to true to process traces immediately.
openlit.init(tracer=tracer, disable_batch=True)
```

### Step 4: Create a Simple Semantic Kernel Application

We'll create a simple Semantic Kernel application where an Assistant agent answers a user's question.


```python
from semantic_kernel import Kernel

kernel = Kernel()
```


```python
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion

kernel.add_service(
    OpenAIChatCompletion(),
)
```


```python
from semantic_kernel.connectors.ai.open_ai import AzureChatPromptExecutionSettings, OpenAIChatPromptExecutionSettings
from semantic_kernel.prompt_template import InputVariable, PromptTemplateConfig

prompt = """{{$input}}
Answer the question above.
"""

prompt_template_config = PromptTemplateConfig(
    template=prompt,
    name="summarize",
    template_format="semantic-kernel",
    input_variables=[
        InputVariable(name="input", description="The user input", is_required=True),
    ]
)

summarize = kernel.add_function(
    function_name="summarizeFunc",
    plugin_name="summarizePlugin",
    prompt_template_config=prompt_template_config,
)
```


```python
input_text = "What is Langfuse?"

summary = await kernel.invoke(summarize, input=input_text)

print(summary)
```

### Step 5: Pass Additional Attributes (Optional)

Opentelemetry lets you attach a set of attributes to all spans by setting [`set_attribute`](https://opentelemetry.io/docs/languages/python/instrumentation/#add-attributes-to-a-span). This allows you to set properties like a Langfuse Session ID, to group traces into Langfuse Sessions or a User ID, to assign traces to a specific user. You can find a list of all supported attributes in the [here](/docs/opentelemetry/get-started#property-mapping).


```python
with tracer.start_as_current_span("Semantic-Kernel-Trace") as span:
    span.set_attribute("langfuse.user.id", "user-123")
    span.set_attribute("langfuse.session.id", "123456789")
    span.set_attribute("langfuse.tags", ["semantic-kernel", "demo"])

    input = "What is Langfuse?"
    output = await kernel.invoke(summarize, input=input_text)
    print(summary)
```

Alternatively, OpenTelemetry traces in Langfuse can also be modified using the [Python low-level SDK](https://langfuse.com/docs/sdk/python/low-level-sdk). For this, we create a new parent span and fetch the OpenTelemetry `trace_id`. This trace_id is then used to modify the span. Have a look at the [Python low-level SDK](https://langfuse.com/docs/sdk/python/low-level-sdk) for more examples. 


```python
from opentelemetry.trace import format_trace_id
from langfuse import Langfuse

langfuse = Langfuse()

with tracer.start_as_current_span("Semantic-Kernel-Trace") as span:

    input = "What is Langfuse?"
    output = await kernel.invoke(summarize, input=input_text)
    print(output)  
    
    # Get the trace_id from the Otel span
    current_span = trace.get_current_span()
    span_context = current_span.get_span_context()
    trace_id = span_context.trace_id
    formatted_trace_id = format_trace_id(trace_id)

    # Update the trace using the low-level Python SDK.
    langfuse.trace(
        id=formatted_trace_id, 
        input=input, 
        output=output,
        name = "docs-retrieval",
        user_id = "user__935d7d1d-8625-4ef4-8651-544613e7bd22",
        metadata = {"email": "user@langfuse.com"},
        tags = ["production"]
    )
```


### Step 6: See Traces in Langfuse

After running the agent above, you can log in to your Langfuse dashboard and view the traces generated by your Semantic Kernel application. Here is an example screenshot of a trace in Langfuse:

![Langfuse Trace](https://langfuse.com/images/cookbook/integration-semantic-kernel/sematric-kernel-example-trace.png)

You can also view the public trace here: [Langfuse Trace Example](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/14c7a9f1cc0d7ff16ac1a057a3d45be9?timestamp=2025-02-04T18%3A00%3A53.475Z&observation=cb3f0fb8a2369414)

## References

- [Langfuse OpenTelemetry Docs](https://langfuse.com/docs/opentelemetry/get-started)
- [Semantic Kernel OpenTelemetry Docs](https://github.com/microsoft/semantic-kernel/blob/main/dotnet/docs/TELEMETRY.md)


