---
title: Observe OpenAI Agents with Langfuse
description: Learn how to use Langfuse to monitor OpenAI Agents SDK to debug and evaluate your AI agents
category: Integrations
---

# Observe OpenAI Agents with Langfuse

This notebook demonstrates how to **integrate Langfuse** into your **OpenAI Agents** workflow.

> **What are OpenAI Agents?**: [OpenAI Agents](https://platform.openai.com/docs/guides/agents) are systems that intelligently accomplish tasks, from simple steps to complex, open-ended objectives.
> **What is Langfuse?**: [Langfuse](https://langfuse.com/) is an open-source observability platform for AI agents. It helps you visualize and monitor LLM calls, tool usage, cost, latency, and more.

**Tip**: Observability is crucial to diagnosing, improving, and comparing AI agents. By sending traces and logs to Langfuse, you can quickly analyze the performance of your system.

## 1. Install Dependencies

Below we install the `openai-agents` library (the OpenAI Agents SDK), and the `pydantic-ai[logfire]` OpenTelemetry instrumentation.


```python
%pip install openai-agents
%pip install nest_asyncio
%pip install pydantic-ai[logfire]
```

## 2. Configure Environment & Langfuse Credentials

Next, we'll set environment variables to connect to Langfuse and your OpenAI API key. 
- Replace `pk-lf-...` and `sk-lf-...` with your actual Langfuse keys.
- Replace the `OPENAI_API_KEY` with your valid OpenAI API key.

If you have multiple regions, use the correct `LANGFUSE_HOST` (EU or US).


```python
import os
import base64

# Replace with your Langfuse keys.
os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-..."  
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-..."  
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com"  # or 'https://us.cloud.langfuse.com'

# Build Basic Auth header.
LANGFUSE_AUTH = base64.b64encode(
    f"{os.environ.get('LANGFUSE_PUBLIC_KEY')}:{os.environ.get('LANGFUSE_SECRET_KEY')}".encode()
).decode()

# Configure OpenTelemetry endpoint & headers
os.environ["OTEL_EXPORTER_OTLP_ENDPOINT"] = os.environ.get("LANGFUSE_HOST") + "/api/public/otel"
os.environ["OTEL_EXPORTER_OTLP_HEADERS"] = f"Authorization=Basic {LANGFUSE_AUTH}"

# OpenAI API Key
os.environ["OPENAI_API_KEY"] = "sk-proj-..." 
```

## 3. Instrumenting the Agent with Pydantic

Pydantic Logfire offerst an instrumentation for the OpenAi Agent SDK. We use this to send traces to the [Langfuse OpenTelemetry Backend](https://langfuse.com/docs/opentelemetry/get-started).



```python
import nest_asyncio
nest_asyncio.apply()
```


```python
import logfire

# Configure logfire instrumentation.
logfire.configure(
    service_name='my_agent_service',

    send_to_logfire=False,
)
# This method automatically patches OpenAI Agents to send logs via OTLP to Langfuse.
logfire.instrument_openai_agents()
```

## 4. Hello World Example

Below we create an **OpenAI Agent** that always replies in **haiku** form. We run it with `Runner.run` and print the final output.

Observability notes:
1. **All steps** of the agent's chain-of-thought, function calls, or tool usage are captured.
2. The entire run is recorded as a single trace in Langfuse.



```python
import asyncio
from agents import Agent, Runner

async def main():
    agent = Agent(
        name="Assistant",
        instructions="You only respond in haikus.",
    )

    result = await Runner.run(agent, "Tell me about recursion in programming.")
    print(result.final_output)

loop = asyncio.get_running_loop()
await loop.create_task(main())
```

**Example**: [Langfuse Trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/019589d78d9fe296dcdc8975d7127c8f?timestamp=2025-03-12T10%3A12%3A39.967Z)

Clicking the link above (or your own project link) lets you view all sub-spans, token usage, latencies, etc., for debugging or optimization.

## 5. Multi-agent Handoff Example

Here we create:
- A **Spanish agent** that responds only in Spanish.
- An **English agent** that responds only in English.
- A **Triage agent** that routes the request to the correct agent based on the input language.

Any calls or handoffs are captured as part of the trace. That way, you can see which sub-agent or tool was used, as well as the final result.


```python
from agents import Agent, Runner
import asyncio

spanish_agent = Agent(
    name="Spanish agent",
    instructions="You only speak Spanish.",
)

english_agent = Agent(
    name="English agent",
    instructions="You only speak English",
)

triage_agent = Agent(
    name="Triage agent",
    instructions="Handoff to the appropriate agent based on the language of the request.",
    handoffs=[spanish_agent, english_agent],
)

result = await Runner.run(triage_agent, input="Hola, ¿cómo estás?")
print(result.final_output)
```

**Example**: [Langfuse Trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/019589d7eb4d42b2cd24067ac4eb0a33?timestamp=2025-03-12T10%3A13%3A03.949Z)

## 6. Functions Example

OpenAI Agents typically allow the agent to call Python functions. With Langfuse instrumentation, you can see which **functions** are called, their arguments, and the return values. Here we define a simple function `get_weather(city: str)` and add it as a tool.



```python
import asyncio
from agents import Agent, Runner, function_tool

# Example function tool.
@function_tool
def get_weather(city: str) -> str:
    return f"The weather in {city} is sunny."

agent = Agent(
    name="Hello world",
    instructions="You are a helpful agent.",
    tools=[get_weather],
)

async def main():
    result = await Runner.run(agent, input="What's the weather in Tokyo?")
    print(result.final_output)

loop = asyncio.get_running_loop()
await loop.create_task(main())
```

**Example**: [Langfuse Trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/019589d809d7c869f1164b0d1bdab0f3?timestamp=2025-03-12T10%3A13%3A11.767Z)

When viewing the trace, you’ll see a span capturing the function call `get_weather` and the arguments passed.

## 7. Grouping Agent Runs

In some workflows, you want to group multiple calls into a single trace—for instance, when building a small chain of prompts that all relate to the same user request. You can use a `trace(...)` context manager to nest multiple calls under one top-level trace.



```python
from agents import Agent, Runner, trace
import asyncio

async def main():
    agent = Agent(name="Joke generator", instructions="Tell funny jokes.")

    with trace("Joke workflow"):
        first_result = await Runner.run(agent, "Tell me a joke")
        second_result = await Runner.run(agent, f"Rate this joke: {first_result.final_output}")
        print(f"Joke: {first_result.final_output}")
        print(f"Rating: {second_result.final_output}")

loop = asyncio.get_running_loop()
await loop.create_task(main())
```

**Example**: [Langfuse Trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/019589d88acdc96f860fdd904968b006?timestamp=2025-03-12T10%3A13%3A44.781Z)

Each child call is represented as a sub-span under the top-level **Joke workflow** span, making it easy to see the entire conversation or sequence of calls.
