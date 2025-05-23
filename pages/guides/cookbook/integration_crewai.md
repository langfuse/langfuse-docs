---
title: Observability for CrewAI with Langfuse
description: Learn how to integrate Langfuse with CrewAI via OpenTelemetry using MLflow
category: Integrations
---

# Integrate Langfuse with CrewAI

This notebook demonstrates how to integrate **Langfuse** with **CrewAI** using OpenTelemetry via the **MLflow** SDK. By the end of this notebook, you will be able to trace your CrewAI applications with Langfuse for improved observability and debugging.

> **What is CrewAI?** [CrewAI](https://github.com/crewAIInc/crewAI) is a framework for orchestrating autonomous AI agents. CrewAI enables you to create AI teams where each agent has specific roles, tools, and goals, working together to accomplish complex tasks. Each member (agent) brings unique skills and expertise, collaborating seamlessly to achieve your objectives.

> **What is Langfuse?** [Langfuse](https://langfuse.com) is an open-source LLM engineering platform. It provides tracing and monitoring capabilities for LLM applications, helping developers debug, analyze, and optimize their AI systems. Langfuse integrates with various tools and frameworks via native integrations, OpenTelemetry, and APIs/SDKs.

## Get Started

We'll walk through a simple example of using CrewAI and integrating it with Langfuse via OpenTelemetry using MLflow.

### Step 1: Install Dependencies


```python
%pip install mlflow crewai -q
```

### Step 2: Set Up Environment Variables

Set your Langfuse API keys and configure OpenTelemetry export settings to send traces to Langfuse. Please refer to the [Langfuse OpenTelemetry Docs](https://langfuse.com/docs/opentelemetry/get-started) for more information on the Langfuse OpenTelemetry endpoint `/api/public/otel` and authentication.


```python
import os
import base64

LANGFUSE_PUBLIC_KEY = "pk-lf-..."
LANGFUSE_SECRET_KEY = "sk-lf-..."
LANGFUSE_AUTH=base64.b64encode(f"{LANGFUSE_PUBLIC_KEY}:{LANGFUSE_SECRET_KEY}".encode()).decode()

os.environ["OTEL_EXPORTER_OTLP_TRACES_ENDPOINT"] = "https://cloud.langfuse.com/api/public/otel/v1/traces"  # 🇪🇺 EU data region
# os.environ["OTEL_EXPORTER_OTLP_TRACES_ENDPOINT"] = "https://us.cloud.langfuse.com/api/public/otel/v1/traces"  # 🇺🇸 US data region
os.environ["OTEL_EXPORTER_OTLP_TRACES_HEADERS"] = f"Authorization=Basic {LANGFUSE_AUTH}"
os.environ['OTEL_EXPORTER_OTLP_TRACES_PROTOCOL']= "http/protobuf"

# your openai key
os.environ["OPENAI_API_KEY"] = "sk-..."
```

### Step 3: Initialize MLflow

Initialize the [MLflow OpenTelemetry instrumentation SDK](https://mlflow.org/docs/latest/api_reference/python_api/mlflow.crewai.html) to start capturing OpenTelemetry traces.


```python
import mlflow

mlflow.crewai.autolog()
```

### Step 4: Create a Simple CrewAI Application

We'll create a simple CrewAI application where multiple agents collaborate to answer a user's question.


```python
from crewai import Agent, Task, Crew

# Define your agents with roles and goals
coder = Agent(
    role='Software developer',
    goal='Write clear, concise code on demand',
    backstory='An expert coder with a keen eye for software trends.',
)

# Create tasks for your agents
task1 = Task(
    description="Define the HTML for making a simple website with heading- Hello World! Langfuse monitors your CrewAI agent!",
    expected_output="A clear and concise HTML code",
    agent=coder
)

# Instantiate your crew
crew = Crew(
    agents=[coder],
    tasks=[task1],
)

result = crew.kickoff()
print(result)
```

### Step 5: See Traces in Langfuse

After running the agent, you can view the traces generated by your CrewAI application in [Langfuse](https://cloud.langfuse.com). You should see detailed steps of the LLM interactions, which can help you debug and optimize your AI agent.

![CrewAI example trace in Langfuse](https://langfuse.com/images/cookbook/integration_crewai/crewai-example-trace.png)

_[Public example trace in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/3b485ea0d723bab3e5e53e72c6b10a71?timestamp=2025-02-24T10%3A34%3A30.423Z&observation=0c53ff94ec9c3da9)_

## References

- [Langfuse OpenTelemetry Docs](https://langfuse.com/docs/opentelemetry/get-started)
- [CrewAI Documentation](https://docs.crewai.com/introduction)
- [MLflow Documentation](https://mlflow.org/docs/latest/api_reference/python_api/mlflow.crewai.html)



