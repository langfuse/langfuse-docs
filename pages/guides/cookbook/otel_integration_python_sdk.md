# Example: Using OpenTelemetry SDK with Langfuse OTel API

This notebook demonstrates how to use any OpenTelemetry SDK to send traces to Langfuse. [OpenTelemetry](https://opentelemetry.io/) is a CNCF project that provides a standard way to collect distributed traces and metrics from applications.

Langfuse operates as an [OpenTelemetry Backend](/docs/opentelemetry/get-started) and maps the received traces to the Langfuse data model according to the OpenTelemetry Gen AI Conventions. See the [property mapping documentation](/docs/opentelemetry/get-started#property-mapping) for details on how attributes are parsed.

In this example, we'll use the [Python OpenTelemetry SDK](https://opentelemetry.io/docs/languages/python/) to send traces with GenAI attributes to Langfuse.

## Setup


```python
%pip install opentelemetry-sdk opentelemetry-exporter-otlp opentelemetry-api
```


```python
import json
import base64

from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

LANGFUSE_OTEL_API = "https://cloud.langfuse.com/api/public/otel" # EU Data Region
# LANGFUSE_OTEL_API = "https://us.cloud.langfuse.com/api/public/otel" # US Data Region

LANGFUSE_PUBLIC_KEY="pk-lf-xxx"
LANGFUSE_SECRET_KEY="sk-lf-xxx"


LANGFUSE_AUTH = base64.b64encode(f"{LANGFUSE_PUBLIC_KEY}:{LANGFUSE_SECRET_KEY}".encode()).decode()
provider = TracerProvider()
processor = BatchSpanProcessor(
    OTLPSpanExporter(
        endpoint=f"{LANGFUSE_OTEL_API}/v1/traces",
        headers={"Authorization": f"Basic {LANGFUSE_AUTH}"},
    )
)
provider.add_span_processor(processor)
trace.set_tracer_provider(provider)
tracer = trace.get_tracer(__name__)
```

## Flattened attributes

Export a span with flattened attribute names following the GenAI semantic conventions


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
