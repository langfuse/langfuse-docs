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

LANGFUSE_PUBLIC_KEY=""
LANGFUSE_SECRET_KEY=""
LANGFUSE_AUTH=base64.b64encode(f"{LANGFUSE_PUBLIC_KEY}:{LANGFUSE_SECRET_KEY}".encode()).decode()

os.environ["TRACELOOP_BASE_URL"] = "https://cloud.langfuse.com/api/public/otel" # EU data region
# os.environ["TRACELOOP_BASE_URL"] = "https://us.cloud.langfuse.com/api/public/otel" # US data region
os.environ["TRACELOOP_HEADERS"] = f"Authorization=Basic {LANGFUSE_AUTH}"

# your openai key
os.environ["OPENAI_API_KEY"] = ""
```

## Step 3: Initialize Instrumentation

Next, initialize the OpenLLMetry instrumentation using the `traceloop-sdk`. Using `disable_batch=True` is recommended if you run this code in a notebook as traces are sent immediately without waiting for batching. Once initialized, any action taken using the OpenAI SDK (such as a chat completion request) will be automatically traced and forwarded to Langfuse.


```python
from openai import OpenAI
from traceloop.sdk import Traceloop

Traceloop.init(disable_batch=True)

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

## Step 4: View the Trace in Langfuse

After running the above code, you can review the generated trace in your Langfuse dashboard:

[Example Trace in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/e417c49b4044725e48aa0e089534fa12?timestamp=2025-02-02T22%3A04%3A04.487Z)

![OpenLLMetry OpenAI Trace](https://langfuse.com/images/cookbook/otel-integration-openllmetry/openllmetry-openai-trace.png)
