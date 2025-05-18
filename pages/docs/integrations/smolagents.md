---
title: Observability for smolagents with Langfuse
description: Learn how to integrate Langfuse with Hugging Face smolagents using OpenTelemetry. This lets you trace and debug your AI agents.
category: Integrations
---

# Integrate Langfuse with smolagents

This notebook shows how to monitor and debug your Hugging Face **smolagents** with **Langfuse** using the `SmolagentsInstrumentor`. By the end of this guide, you will be able to trace your smolagents applications with Langfuse.

> **What are smolagents?** [smolagents](https://github.com/huggingface/smolagents) is a minimalist and open source AI agent framework developed by Hugging Face, designed to simplify the creation and deployment of powerful agents with just a few lines of code. It focuses on simplicity and efficiency, making it easy for developers to leverage LLMs for various applications.

> **What is Langfuse?** [Langfuse](https://langfuse.com) is an open source platform for LLM engineering. It provides tracing and monitoring capabilities for AI agents, helping developers debug, analyze, and optimize their products. Langfuse integrates with various tools and frameworks via native integrations, OpenTelemetry, and SDKs.

## Get Started

We'll walk through a simple example of using smolagents and integrating it with Langfuse.

### Step 1: Install Dependencies


```python
%pip install 'smolagents[telemetry]'
%pip install opentelemetry-sdk opentelemetry-exporter-otlp openinference-instrumentation-smolagents
```

### Step 2: Set Up Environment Variables

Set your Langfuse API keys and configure the OpenTelemetry endpoint to send traces to Langfuse. Get your Langfuse API keys by signing up for [Langfuse Cloud](https://cloud.langfuse.com) or [self-hosting Langfuse](https://langfuse.com/self-hosting).

Also, add your [Hugging Face token](https://huggingface.co/settings/tokens) (`HF_TOKEN`) as an environment variable.



```python
import os
import base64

LANGFUSE_PUBLIC_KEY="pk-lf-..."
LANGFUSE_SECRET_KEY="sk-lf-..."
LANGFUSE_AUTH=base64.b64encode(f"{LANGFUSE_PUBLIC_KEY}:{LANGFUSE_SECRET_KEY}".encode()).decode()

os.environ["OTEL_EXPORTER_OTLP_ENDPOINT"] = "https://cloud.langfuse.com/api/public/otel" # EU data region
# os.environ["OTEL_EXPORTER_OTLP_ENDPOINT"] = "https://us.cloud.langfuse.com/api/public/otel" # US data region
os.environ["OTEL_EXPORTER_OTLP_HEADERS"] = f"Authorization=Basic {LANGFUSE_AUTH}"

# your Hugging Face token
os.environ["HF_TOKEN"] = "hf_..."
```

### Step 3: Initialize the `SmolagentsInstrumentor`

Initialize the `SmolagentsInstrumentor` before your application code. Configure `tracer_provider` and add a span processor to export traces to Langfuse. `OTLPSpanExporter()` uses the endpoint and headers from the environment variables.


```python
from opentelemetry.sdk.trace import TracerProvider
from openinference.instrumentation.smolagents import SmolagentsInstrumentor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace.export import SimpleSpanProcessor

trace_provider = TracerProvider()
trace_provider.add_span_processor(SimpleSpanProcessor(OTLPSpanExporter()))

SmolagentsInstrumentor().instrument(tracer_provider=trace_provider)
```

### Step 4: Run your smolagent

This smolagent example has a manager `CodeAgent` that orchestrates the `managed_agent`, which can perform web searches to gather data. By using tools like `DuckDuckGoSearchTool` and `VisitWebpageTool`, it retrieves the U.S. 2024 growth rate and calculates how many years it will take for the GDP to double.



```python
from smolagents import (
    CodeAgent,
    ToolCallingAgent,
    DuckDuckGoSearchTool,
    VisitWebpageTool,
    HfApiModel,
)

model = HfApiModel(
    model_id="deepseek-ai/DeepSeek-R1-Distill-Qwen-32B"
)

search_agent = ToolCallingAgent(
    tools=[DuckDuckGoSearchTool(), VisitWebpageTool()],
    model=model,
    name="search_agent",
    description="This is an agent that can do web search.",
)

manager_agent = CodeAgent(
    tools=[],
    model=model,
    managed_agents=[search_agent],
)
manager_agent.run(
    "How can Langfuse be used to monitor and improve the reasoning and decision-making of smolagents when they execute multi-step tasks, like dynamically adjusting a recipe based on user feedback or available ingredients?"
)
```

### Step 5: Pass Additional Attributes (Optional)

Opentelemetry lets you attach a set of attributes to all spans by setting [`set_attribute`](https://opentelemetry.io/docs/languages/python/instrumentation/#add-attributes-to-a-span). This allows you to set properties like a Langfuse Session ID, to group traces into Langfuse Sessions or a User ID, to assign traces to a specific user. You can find a list of all supported attributes in the [here](/docs/opentelemetry/get-started#property-mapping).


```python
# Sets the global default tracer provider
from opentelemetry import trace
trace.set_tracer_provider(trace_provider)

# Creates a tracer from the global tracer provider
tracer = trace.get_tracer("my.tracer.name")

with tracer.start_as_current_span("Smolagent-Trace") as span:
    span.set_attribute("langfuse.user.id", "user-123")
    span.set_attribute("langfuse.session.id", "123456789")
    span.set_attribute("langfuse.tags", ["smolagents", "demo"])
    span.set_attribute("langfuse.prompt.name", "test-1")

    # Create agent
    model = HfApiModel()
    agent = ToolCallingAgent(
        tools=[DuckDuckGoSearchTool()],
        model=model,
    )

    # Run your agent - the span attributes will be carried through
    result = agent.run("How can Langfuse be used to monitor and improve the reasoning and decision-making of smolagents when they execute multi-step tasks, like dynamically adjusting a recipe based on user feedback or available ingredients?")
```

### Step 6: View Traces in Langfuse

After running the agent, you can view the traces generated by your smolagents application in [Langfuse](https://cloud.langfuse.com). You should see detailed steps of the LLM interactions, which can help you debug and optimize your AI agent.

![smolagents example trace](https://langfuse.com/images/cookbook/integration-smolagents/smolagent_example_trace.png)

_[Public example trace in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/ce5160f9bfd5a6cd63b07d2bfcec6f54?timestamp=2025-02-11T09%3A25%3A45.163Z&display=details)_



### Dataset Experiments

You can also test your smolagents using [Langfuse Dataset Experiments](https://langfuse.com/docs/datasets/overview):

1. Create a benchmark dataset (with prompt and expected output pairs)
2. Run your agent on that dataset
3. Compare outputs to the expected results or use an additional scoring mechanism

Below, we demonstrate this approach with the [GSM8K dataset](https://huggingface.co/datasets/gsm8k), which contains math questions and solutions.


```python
import pandas as pd
from datasets import load_dataset

# Fetch GSM8K from Hugging Face
dataset = load_dataset("openai/gsm8k", 'main', split='train')
df = pd.DataFrame(dataset)
print("First few rows of GSM8K dataset:")
print(df.head())
```

Next, we create a dataset entity in Langfuse to track the runs. Then, we add each item from the dataset to the system. (If you’re not using Langfuse, you might simply store these in your own database or local file for analysis.)


```python
from langfuse import Langfuse
langfuse = Langfuse()

langfuse_dataset_name = "gsm8k_dataset_huggingface"

# Create a dataset in Langfuse
langfuse.create_dataset(
    name=langfuse_dataset_name,
    description="GSM8K benchmark dataset uploaded from Huggingface",
    metadata={
        "date": "2025-03-10", 
        "type": "benchmark"
    }
)
```


```python
for idx, row in df.iterrows():
    langfuse.create_dataset_item(
        dataset_name=langfuse_dataset_name,
        input={"text": row["question"]},
        expected_output={"text": row["answer"]},
        metadata={"source_index": idx}
    )
    if idx >= 9: # Upload only the first 10 items for demonstration
        break
```

#### Running the Agent on the Dataset

We define a helper function `run_smolagent()` that:
1. Starts an OpenTelemetry span
2. Runs our agent on the prompt
3. Records the trace ID in Langfuse

Then, we loop over each dataset item, run the agent, and link the trace to the dataset item. We can also attach a quick evaluation score if desired.


```python
from opentelemetry.trace import format_trace_id
from smolagents import (CodeAgent, HfApiModel, LiteLLMModel)

# Example: using HfApiModel or LiteLLMModel to access openai, anthropic, gemini, etc. models:
model = HfApiModel()

agent = CodeAgent(
    tools=[],
    model=model,
    add_base_tools=True
)

def run_smolagent(question):
    with tracer.start_as_current_span("Smolagent-Trace") as span:
        span.set_attribute("langfuse.tag", "dataset-run")
        output = agent.run(question)

        current_span = trace.get_current_span()
        span_context = current_span.get_span_context()
        trace_id = span_context.trace_id
        formatted_trace_id = format_trace_id(trace_id)

        langfuse_trace = langfuse.trace(
            id=formatted_trace_id, 
            input=question, 
            output=output
        )
    return langfuse_trace, output
```


```python
dataset = langfuse.get_dataset(langfuse_dataset_name)

# Run our agent against each dataset item (limited to first 10 above)
for item in dataset.items:
    langfuse_trace, output = run_smolagent(item.input["text"])

    # Link the trace to the dataset item for analysis
    item.link(
        langfuse_trace,
        run_name="smolagent-notebook-run-01",
        run_metadata={ "model": model.model_id }
    )

    # Optionally, store a quick evaluation score for demonstration
    langfuse_trace.score(
        name="<example_eval>",
        value=1,
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

## References

- [Langfuse OpenTelemetry Docs](https://langfuse.com/docs/opentelemetry/get-started)
- [smolagents Documentation](https://huggingface.co/docs/smolagents/en/index)
