---
title: Observability for AutoGen with Langfuse
description: Learn how to integrate Langfuse with AutoGen via OpenTelemetry using OpenLit
---

# Integrate Langfuse with AutoGen

This notebook demonstrates how to integrate **Langfuse** with **AutoGen** using OpenTelemetry via the **OpenLit** SDK. By the end of this notebook, you will be able to trace your AutoGen applications with Langfuse for improved observability and debugging.

## What is AutoGen?

[**AutoGen**](https://microsoft.github.io/autogen/stable/) [(GitHub)](https://github.com/microsoft/autogen) is an open-source framework developed by Microsoft for building LLM applications, including agents capable of complex reasoning and interactions. AutoGen simplifies the creation of conversational agents that can collaborate or compete to solve tasks.

## What is Langfuse?

[**Langfuse**](https://langfuse.com) is an open-source LLM engineering platform. It provides tracing and monitoring capabilities for LLM applications, helping developers debug, analyze, and optimize their AI systems. Langfuse integrates with various tools and frameworks via native integrations, OpenTelemetry and API/SDKs.

## Get Started

We'll walk through a simple example of using AutoGen and integrating it with Langfuse via OpenTelemetry using OpenLit.

### Step 1: Install Dependencies



```python
%pip install langfuse openlit autogen
```

### Step 2: Set Up Environment Variables

Set your Langfuse API keys and configure OpenTelemetry export settings to send traces to Langfuse. Please refer to the [Langfuse OpenTelemetry Docs](https://langfuse.com/docs/opentelemetry/get-started) for more information on the Langfuse OpenTelemetry endpoint `/api/public/otel` and authentification.


```python
import os
import base64

LANGFUSE_PUBLIC_KEY="pk-lf-..."
LANGFUSE_SECRET_KEY="sk-lf-..."
LANGFUSE_AUTH=base64.b64encode(f"{LANGFUSE_PUBLIC_KEY}:{LANGFUSE_SECRET_KEY}".encode()).decode()

os.environ["OTEL_EXPORTER_OTLP_ENDPOINT"] = "https://cloud.langfuse.com/api/public/otel" # EU data region
# os.environ["OTEL_EXPORTER_OTLP_ENDPOINT"] = "https://us.cloud.langfuse.com/api/public/otel" # US data region
os.environ["OTEL_EXPORTER_OTLP_HEADERS"] = f"Authorization=Basic {LANGFUSE_AUTH}"

# your openai key
os.environ["OPENAI_API_KEY"] = "sk-..."
```

### Step 3: Initialize OpenLit

Initialize OpenLit to start capturing OpenTelemetry traces.


```python
import openlit

openlit.init()
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




### Step 5: See Traces in Langfuse

After running the agent above, you can log in to your Langfuse dashboard and view the traces generated by your AutoGen application. Here is an example screenshot of a trace in Langfuse:

![Langfuse Trace](https://langfuse.com/images/cookbook/integration-autogen/autogen-example-trace.png)

You can also view the public trace here: [Langfuse Trace Example](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/df850ab499107d4348584cf5933baabd?timestamp=2025-02-04T16%3A55%3A51.660Z&observation=286c648acb0105c2)

## References

- [Langfuse OpenTelemetry Docs](https://langfuse.com/docs/opentelemetry/get-started)
- [AutoGen OpenTelemetry Docs](https://microsoft.github.io/autogen/dev//user-guide/core-user-guide/framework/telemetry.html)




