# Example: Using OpenTelemetry SDK with Langfuse OTel API

This notebook demonstrates how to use any OpenTelemetry SDK to send traces to Langfuse. [OpenTelemetry](https://opentelemetry.io/) is a CNCF project that provides a standard way to collect distributed traces and metrics from applications.

Langfuse operates as an [OpenTelemetry Backend](/docs/opentelemetry/get-started) and maps the received traces to the Langfuse data model according to the OpenTelemetry Gen AI Conventions. See the [property mapping documentation](/docs/opentelemetry/get-started#property-mapping) for details on how attributes are parsed.

In this example, we'll use the [Python OpenTelemetry SDK](https://opentelemetry.io/docs/languages/python/) to send traces with GenAI attributes to Langfuse.

## Setup


```python
%pip install opentelemetry-sdk opentelemetry-exporter-otlp opentelemetry-api
```


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

## Flattened attributes

Opentelemetry lets you attach a set of attributes to all spans by setting [`set_attribute`](https://opentelemetry.io/docs/languages/python/instrumentation/#add-attributes-to-a-span).

**GenAI Semantic Convention Attributes:**


```python
with tracer.start_as_current_span("GenAI Attributes") as span:
    span.set_attribute("gen_ai.prompt.0.role", "system")
    span.set_attribute("gen_ai.prompt.0.content", "You are a coding assistant that helps write Python code.")
    span.set_attribute("gen_ai.prompt.1.role", "user") 
    span.set_attribute("gen_ai.prompt.1.content", "Write a function that calculates the factorial of a number.")

    span.set_attribute("gen_ai.completion.0.role", "assistant")
    span.set_attribute("gen_ai.completion.0.content", """def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n-1)""")

    span.set_attribute("gen_ai.request.model", "gpt-4")
    span.set_attribute("gen_ai.request.temperature", 0.7)
    span.set_attribute("gen_ai.usage.prompt_tokens", 25)
    span.set_attribute("gen_ai.usage.completion_tokens", 45)
```

[Example trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/226b5e5ea844788de7bced27fc475c62?timestamp=2025-02-06T10%3A57%3A11.141Z&observation=db79c5e1372feffc)

**Langfuse Attributes:**

 [`set_attribute`](https://opentelemetry.io/docs/languages/python/instrumentation/#add-attributes-to-a-span) allows you to set properties like a Langfuse Session ID, to group traces into Langfuse Sessions or a User ID, to assign traces to a specific user. You can find a list of all supported attributes in the [here](/docs/opentelemetry/get-started#property-mapping).


```python
with tracer.start_as_current_span("Langfuse Attributes") as span:
    span.set_attribute("langfuse.user.id", "user-123")
    span.set_attribute("langfuse.session.id", "123456789")
    span.set_attribute("langfuse.tags", ["staging", "demo"])
    span.set_attribute("langfuse.prompt.name", "test-1")
```

## JSON-serialized attributes

Export a span using JSON-serialized attributes


```python
with tracer.start_as_current_span("GenAI JSON-Serialized Attributes") as span:
    span.set_attribute(
        "gen_ai.prompt_json",
        json.dumps(
            [
                {"role": "system", "content": "You are an expert art historian and critic."},
                {"role": "user", "content": "Describe Vincent van Gogh's 'The Starry Night' painting in detail."},
            ]
        ),
    )
    span.set_attribute(
        "gen_ai.completion_json",
        json.dumps(
            [
                {"role": "assistant", "content": "The Starry Night (1889) is one of Van Gogh's most famous works, painted during his stay at the Saint-Paul-de-Mausole asylum. The painting depicts a night scene with a swirling sky filled with stars and a crescent moon over a village. The sky is dominated by luminous yellow stars and a spiral pattern of blue clouds. In the foreground, a dark cypress tree reaches toward the sky like a flame. The village below is quiet and peaceful, with a prominent church spire piercing the night. The brushwork is bold and expressive, with thick impasto strokes creating a sense of movement and energy throughout the composition."},
            ]
        ),
    )
```

[Example trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/019440a211c0ee6739d0be1f9101ac3f?timestamp=2025-02-06T10%3A57%3A44.540Z&observation=a09151c5814c1803)

## Dataset Experiments

With [Dataset Experiments](https://langfuse.com/docs/datasets/overview), you can test your application on a dataset before deploying it to production. 

First, set up the function that will be used to run the application. This function returns the application output as well as the Langfuse trace to link to dataset run with the trace.


```python
from opentelemetry.trace import format_trace_id
from opentelemetry import trace

# Set the global default tracer provider
trace.set_tracer_provider(trace_provider)
tracer = trace.get_tracer(__name__)

def run_oetl_application(input):
    with tracer.start_as_current_span("Otel-Trace") as span:

        # Your gen ai application logic here: (make sure this function is sending traces to Langfuse)
        output = your_application(input)

        # Fetch the current span and trace id
        current_span = trace.get_current_span()
        span_context = current_span.get_span_context()
        trace_id = span_context.trace_id
        formatted_trace_id = format_trace_id(trace_id)

        langfuse_trace = langfuse.trace(
            id=formatted_trace_id, 
            input=input, 
            output=output
        )
    return langfuse_trace, output
```

Then loop over the dataset items and run the application.


```python
from langfuse import Langfuse
langfuse = Langfuse()

dataset = langfuse.get_dataset("<langfuse_dataset_name>")

# Run our application against each dataset item
for item in dataset.items:
    langfuse_trace, output = run_oetl_application(item.input["text"])

    # Link the trace to the dataset item for analysis
    item.link(
        langfuse_trace,
        run_name="run-01",
        run_metadata={ "model": model.model_id }
    )

    # Optionally, store a quick evaluation score for demonstration
    langfuse_trace.score(
        name="<example_eval>",
        value= your_evaluation_function(output),
        comment="This is a comment"
    )

# Flush data to ensure all telemetry is sent
langfuse.flush()
```

You can repeat this process with different:
- Models (OpenAI GPT, local LLM, etc.)
- Tools (search vs. no search)
- Prompts (different system messages)

Then compare them side-by-side in your observability tool:

![Dataset run overview](https://langfuse.com/images/cookbook/huggingface-agent-course/dataset_runs.png)
![Dataset run comparison](https://langfuse.com/images/cookbook/huggingface-agent-course/dataset-run-comparison.png)
