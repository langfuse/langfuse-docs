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
%pip install arize-phoenix-otel openai openinference-instrumentation-openai
```

## Step 2: Configure Environment Variables

Set your Langfuse API keys for the basic auth header. Get your Langfuse API keys by signing up for [Langfuse Cloud](https://cloud.langfuse.com) or [self-hosting Langfuse](https://langfuse.com/self-hosting).

Also, add your `OPENAI_API_KEY` as an environment variable.


```python
import os
import base64

LANGFUSE_PUBLIC_KEY="pk-lf-..."
LANGFUSE_SECRET_KEY="sk-lf-..."
LANGFUSE_AUTH=base64.b64encode(f"{LANGFUSE_PUBLIC_KEY}:{LANGFUSE_SECRET_KEY}".encode()).decode()

# your openai key
os.environ["OPENAI_API_KEY"] = "sk-..."
```

## Step 3: Initialize Instrumentation

Initialize the Arize Phoenix module [`register()`](https://docs.arize.com/phoenix/tracing/how-to-tracing/setup-tracing-python) by passing in the protocol, endpoint, and headers. The use the `SmolagentsInstrumentor` to instrument your Smolagents application. (You can replace this with any of the frameworks supported [here](https://docs.arize.com/phoenix/tracing/integrations-tracing))


```python
from phoenix.otel import register
from openinference.instrumentation.openai import OpenAIInstrumentor

# configure the Phoenix tracer
register(protocol="http/protobuf", endpoint="https://cloud.langfuse.com/api/public/otel/v1/traces", headers={"Authorization": f"Basic {LANGFUSE_AUTH}"})

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

## Passing User and Session ID (Optional)

To pass user and session id, you can use the [using_attributes](https://docs.arize.com/arize/llm-tracing/how-to-tracing-manual/hybrid-instrumentation#using_attributes) module. This allows you to group traces into [Langfuse Sessions](https://langfuse.com/docs/tracing-features/sessions) and assign [User IDs](https://langfuse.com/docs/tracing-features/users).


```python
import openai

from openinference.instrumentation import using_attributes
with using_attributes(
    session_id = "my-session-id",
    user_id = "my-user-name",
):

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

_[Public example trace in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/76e520bd3ec1f70356cde4f6d369fd2e?timestamp=2025-02-28T12%3A57%3A01.513Z&observation=cc20bc20cebf9361)_
