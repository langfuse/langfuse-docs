---
title: MLflow Integration via OpenTelemetry
description: Example cookbook for the MLflow Langfuse integration using OpenTelemetry.
category: Integrations
---

# MLflow Integration via OpenTelemetry

Langfuse is an [OpenTelemetry backend](https://langfuse.com/docs/opentelemetry/get-started), allowing trace ingestion from various OpenTelemetry instrumentation libraries. This guide demonstrates how to use the [MLflow](https://mlflow.org/docs/latest/tracing/integrations/) instrumentation library to instrument a compatible framework or LLM provider.

## Step 1: Install Dependencies

Install the necessary Python packages: `openai`, `langfuse`, and `mlflow`. These will allow you to interact with OpenAI as well as setup the instrumentation for tracing.

_**Note:** This guide uses our Python SDK v2. We have a new, improved SDK available based on OpenTelemetry. Please check out the [SDK v3](https://langfuse.com/docs/sdk/python/sdk-v3) for a more powerful and simpler to use SDK._


```python
%pip install mlflow openai opentelemetry-exporter-otlp-proto-http "langfuse<3.0.0"
```

## Step 2: Configure Environment Variables

Before sending any requests, you need to configure your credentials and endpoints. First, set up the Langfuse authentication by providing your public and secret keys. Then, configure the OpenTelemetry exporter endpoint and headers to point to Langfuse's backend. You should also specify your OpenAI API key.


```python
import os
import base64

LANGFUSE_PUBLIC_KEY = "pk-lf-..."
LANGFUSE_SECRET_KEY = "sk-lf-..."
LANGFUSE_AUTH = base64.b64encode(f"{LANGFUSE_PUBLIC_KEY}:{LANGFUSE_SECRET_KEY}".encode()).decode()

os.environ["OTEL_EXPORTER_OTLP_TRACES_ENDPOINT"] = "https://cloud.langfuse.com/api/public/otel/v1/traces"  # 🇪🇺 EU data region
# os.environ["OTEL_EXPORTER_OTLP_TRACES_ENDPOINT"] = "https://us.cloud.langfuse.com/api/public/otel/v1/traces"  # 🇺🇸 US data region
os.environ["OTEL_EXPORTER_OTLP_TRACES_HEADERS"] = f"Authorization=Basic {LANGFUSE_AUTH}"
os.environ['OTEL_EXPORTER_OTLP_TRACES_PROTOCOL']= "http/protobuf"

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

*Explanation:* This block configures the necessary environment variables. The Langfuse keys are combined and base64 encoded to form an authentication token that is then set in the OTLP headers. Additionally, the OpenTelemetry endpoint is provided to direct trace data to Langfuse's backend.

## Step 3: Initialize Instrumentation

With the environment set up, import the needed libraries and initialize MLflow instrumentation. Have a look at all available instrumentation modules [here](https://mlflow.org/docs/latest/tracing/integrations/). 


```python
import mlflow

# Enable the MLflow instrumentation for tracing OpenAI
mlflow.openai.autolog()
```

## Step 4: Make a Chat Completion Request

For this example, we will make a simple chat completion request to the OpenAI Chat API. This will generate trace data that you can later view in the Langfuse dashboard.


```python
import openai

# Use OpenAI Python SDK as usual
openai.OpenAI().chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are a chatbot."},
        {"role": "user", "content": "What is the weather like today?"},
    ],
)
```




    ChatCompletion(id='chatcmpl-BD7XRulRhULb7NjGfeOkhN3BB9zud', choices=[Choice(finish_reason='stop', index=0, logprobs=None, message=ChatCompletionMessage(content="I don't have real-time data access to provide current weather conditions. I recommend checking a reliable weather website or a weather app for the most accurate and up-to-date information.", refusal=None, role='assistant', annotations=[], audio=None, function_call=None, tool_calls=None))], created=1742466941, model='gpt-4o-mini-2024-07-18', object='chat.completion', service_tier='default', system_fingerprint='fp_b8bc95a0ac', usage=CompletionUsage(completion_tokens=35, prompt_tokens=23, total_tokens=58, completion_tokens_details=CompletionTokensDetails(accepted_prediction_tokens=0, audio_tokens=0, reasoning_tokens=0, rejected_prediction_tokens=0), prompt_tokens_details=PromptTokensDetails(audio_tokens=0, cached_tokens=0)))



## Step 5: Pass Additional Attributes (Optional)

Opentelemetry lets you attach a set of attributes to all spans by setting [`set_attribute`](https://opentelemetry.io/docs/languages/python/instrumentation/#add-attributes-to-a-span). This allows you to set properties like a Langfuse Session ID, to group traces into Langfuse Sessions or a User ID, to assign traces to a specific user. You can find a list of all supported attributes in the [here](/docs/opentelemetry/get-started#property-mapping).


```python
import openai

input = "How does enhanced LLM observability improve AI debugging?"

with tracer.start_as_current_span("OpenAI-Trace") as span:
    span.set_attribute("langfuse.user.id", "user-123")
    span.set_attribute("langfuse.session.id", "123456789")
    span.set_attribute("langfuse.tags", ["staging", "demo"])

    # You application code below:
    response = openai.OpenAI().chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": input,
            }
        ],
        model="gpt-4o-mini",
    )
    print(response.choices[0].message.content)

    # Add input and output values to the new parent span
    span.set_attribute("input.value", input)
    span.set_attribute("output.value", response.choices[0].message.content)
```

    2025/03/20 11:36:03 WARNING mlflow.utils.autologging_utils: Encountered unexpected error during openai autologging: the JSON object must be str, bytes or bytearray, not NoneType


    Enhanced observability in Large Language Models (LLMs) plays a crucial role in AI debugging by providing deeper insights into the behavior, performance, and decision-making processes of these models. Here are some key ways in which improved observability aids in debugging:
    
    1. **Monitoring Performance Metrics**: Enhanced observability allows for real-time tracking of various performance metrics such as accuracy, response time, and model drift. By continuously monitoring these indicators, developers can quickly identify when an LLM deviates from expected behavior, enabling timely interventions.
    
    2. **Traceability of Inputs and Outputs**: Improved observability enables the logging and tracking of inputs and outputs, which helps in understanding how specific inputs influence model outputs. This traceability allows engineers to pinpoint the source of unexpected behavior or errors in the model's responses.
    
    3. **Contextual Analysis**: By incorporating contextual information, observability tools can provide insights into the model's processing of input data, including how it interprets the context or nuances. Understanding the reasoning behind a model's output helps identify when and why it may misinterpret queries or generate inappropriate responses.
    
    4. **Understanding Model Decisions**: Enhanced observability often involves explainable AI techniques such as feature importance analysis and attention visualization. These tools help in understanding which parts of the input were most influential in the model's decision-making process, thus revealing biases or weaknesses in the model.
    
    5. **Anomaly Detection**: By establishing baselines for normal model behavior, enhanced observability systems can detect anomalies in responses. This capability helps in identifying potential issues that may not be apparent through traditional testing methods or user feedback alone.
    
    6. **Testing and Validation**: Enhanced observability can support ongoing testing and validation of LLMs by providing insights into how the model performs across different scenarios and datasets. This testing can help identify gaps in training data or areas where the model may require additional fine-tuning.
    
    7. **Feedback Loops**: Observability facilitates the creation of feedback loops where user interactions and model performance data can be used to continuously improve the model. This iterative process helps rectify shortcomings and refine the model's outputs over time.
    
    8. **Collaboration and Communication**: Enhanced observability provides a shared understanding of model behavior among teams. This improved visibility fosters better communication between data scientists, engineers, and stakeholders, leading to more informed decision-making regarding model improvements and debugging efforts.
    
    9. **Compliance and Ethical Considerations**: With enhanced observability, it becomes easier to assess models against compliance and ethical standards. Debugging efforts can include the identification of biases or harmful outputs, ensuring the model adheres to ethical AI principles.
    
    In summary, enhanced observability in LLMs significantly improves AI debugging by providing comprehensive insights into model behavior, facilitating the identification of issues, and enabling more effective interventions. This ultimately leads to the development of more reliable, robust, and ethical AI systems.


## Step 6: See Traces in Langfuse

You can view the generated trace data in Langfuse. You can view this [example trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/6dea86b6feae03db538e248b38e124e1?timestamp=2025-03-20T10%3A35%3A41.217Z&display=details&observation=948b7a084327d5e6) in the Langfuse UI.

m![MLflow OpenAI Trace](https://langfuse.com/images/cookbook/otel-integration-mlflow/mlflow-openai-trace.png)
