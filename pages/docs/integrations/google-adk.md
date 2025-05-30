---
title: Observability for Google Agent Development Kit with Langfuse
description: Learn how to instrument Google ADK agents with Langfuse via OpenTelemetry
category: Integrations
---

# Integrate Langfuse with Google's Agent Development Kit

This notebook demonstrates how to capture detailed traces from a [Google Agent Development Kit](https://github.com/google/adk-python) (ADK) application with **[Langfuse](https://langfuse.com)** using the OpenTelemetry (OTel) protocol.

> **Why Agent Development Kit?**  
> [Google’s Agent Development Kit](https://developers.googleblog.com/en/agent-development-kit-easy-to-build-multi-agent-applications/) streamlines building, orchestrating, and tracing generative-AI agents out of the box, letting you move from prototype to production far faster than wiring everything yourself.

> **Why Langfuse?**  
> [Langfuse](https://langfuse.com) gives you a detailed dashboard and rich analytics for every prompt, model response, and function call in your agent, making it easy to debug, evaluate, and iterate on LLM apps.

## Step&nbsp;1: Install dependencies


```python
%pip install google-adk opentelemetry-sdk opentelemetry-exporter-otlp -q
```

## Step 2: Set up environment variables

Fill in the **Langfuse** and **OpenTelemetry** credentials for your project. Also set your **Gemini API key**.


```python
import os
import base64

LANGFUSE_PUBLIC_KEY = "pk-lf-..."
LANGFUSE_SECRET_KEY = "sk-lf-..."
LANGFUSE_AUTH=base64.b64encode(f"{LANGFUSE_PUBLIC_KEY}:{LANGFUSE_SECRET_KEY}".encode()).decode()

os.environ["OTEL_EXPORTER_OTLP_ENDPOINT"] = "https://cloud.langfuse.com/api/public/otel" # EU data region
# os.environ["OTEL_EXPORTER_OTLP_ENDPOINT"] = "https://us.cloud.langfuse.com/api/public/otel" # US data region
os.environ["OTEL_EXPORTER_OTLP_HEADERS"] = f"Authorization=Basic {LANGFUSE_AUTH}"

# Gemini API Key (Get from Google AI Studio: https://aistudio.google.com/app/apikey)
os.environ["GOOGLE_API_KEY"] = "..." 
```

## Step 3: Initialise OTel

We configure an **OTLPSpanExporter** so every span generated in this notebook is pushed straight to Langfuse.


```python
from opentelemetry import trace
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter

provider = TracerProvider(resource=Resource.create({"service.name": "hello_agent"}))
exporter = OTLPSpanExporter()
provider.add_span_processor(BatchSpanProcessor(exporter))
trace.set_tracer_provider(provider)
tracer = trace.get_tracer("hello_app")
```

## Step 4: Build a hello world agent

Every tool call and model completion is captured as an OpenTelemetry span and forwarded to Langfuse.


```python
from google.adk import Agent, Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types

# 1. ‘say_hello’ tool
def say_hello():
    return {"greeting": "Hello Langfuse 👋"}

agent = Agent(
    name="hello_agent",
    model="gemini-2.0-flash",
    instruction="Always greet using the say_hello tool.",
    tools=[say_hello],
)

# 2. session service + runner 
session_service = InMemorySessionService()

APP_NAME  = "hello_app"
USER_ID   = "demo-user"
SESSION_ID = "demo-session"  # any string; UUIDs work too

# create the session once
session_service.create_session(
    app_name=APP_NAME, user_id=USER_ID, session_id=SESSION_ID
)

runner = Runner(agent=agent, app_name=APP_NAME, session_service=session_service)

# 3.  single‑turn run 
user_msg = types.Content(role="user", parts=[types.Part(text="hi")])

for event in runner.run(user_id=USER_ID, session_id=SESSION_ID, new_message=user_msg):
    if event.is_final_response():
        print(event.content.parts[0].text)
```

## Step 5: View the trace in Langfuse

Head over to your **Langfuse dashboard → Traces**. You should see traces including all tool calls and model inputs/outputs.

![Google ADK example trace in Langfuse](https://langfuse.com/images/cookbook/integration-google-adk/google-adk-trace.png)
