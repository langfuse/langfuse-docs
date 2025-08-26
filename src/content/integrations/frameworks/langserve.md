---
title: Langserve Integration
description: This guide shows how to natively integrate Langfuse with LangChain's Langserve for observability, metrics, evals, prompt management, playground, datasets.
category: Integrations
sidebarTitle: Langserve
logo: /images/integrations/langchain_icon.png
---

# Cookbook: Langserve Integration (SDK v2)

[Langserve](https://python.langchain.com/docs/langserve/) (Python)
> LangServe helps developers deploy LangChain runnables and chains as a REST API.
>
> This library is integrated with FastAPI and uses pydantic for data validation.
>
> In addition, it provides a client that can be used to call into runnables deployed on a server. A JavaScript client is available in LangChain.js.

This cookbook demonstrates how to trace applications deployed via Langserve with Langfuse (using the [LangChain integration](https://langfuse.com/integrations/frameworks/langchain)). We'll run both the server and the client in this notebook.

## Setup

_**Note:** This guide uses our Python SDK v2. We have a new, improved SDK available based on OpenTelemetry. Please check out the [SDK v3](https://langfuse.com/docs/sdk/python/sdk-v3) for a more powerful and simpler to use SDK._


```python
!pip install fastapi sse_starlette httpx langserve "langfuse<3.0.0" langchain-openai langchain
```


```python
import os

# Get keys for your project from the project settings page
# https://cloud.langfuse.com
os.environ["LANGFUSE_PUBLIC_KEY"] = ""
os.environ["LANGFUSE_SECRET_KEY"] = ""
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region

# Your openai key
os.environ["OPENAI_API_KEY"] = ""
```

## Simple LLM Call Example

Initialize the Langfuse client and configure the LLM with Langfuse as callback handler. Add to Fastapi via Langserve's `add_routes()`.


```python
from langchain_openai import ChatOpenAI
from langchain_core.runnables.config import RunnableConfig
from langfuse import Langfuse
from langfuse.callback import CallbackHandler
from fastapi import FastAPI
from langserve import add_routes

langfuse_handler = CallbackHandler()

# Tests the SDK connection with the server
langfuse_handler.auth_check()

llm = ChatOpenAI()

config = RunnableConfig(callbacks=[langfuse_handler])

llm_with_langfuse = llm.with_config(config)

# Setup server
app = FastAPI()

# Add Langserve route
add_routes(
    app,
    llm_with_langfuse,
    path="/test-simple-llm-call",
)
```



*Note: We use TestClient in this example to be able to run the server in a notebook*


```python
from fastapi.testclient import TestClient

# Initialize TestClient
client = TestClient(app)

# Test simple route
response = client.post("/test-simple-llm-call/invoke", json={"input": "Tell me a joke?"})
```

Example trace: https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/5f32e2e7-9508-4280-b47b-e0356bc3c81e

![Trace of Langserve Simple LLM Call](https://langfuse.com/images/cookbook/integration_langserve_simple.png)

## LCEL example


```python
from langchain.prompts import ChatPromptTemplate
from langchain.schema import StrOutputParser
from langserve import add_routes

# Create Chain
prompt = ChatPromptTemplate.from_template("Tell me a joke about {topic}")

chain = prompt | llm | StrOutputParser()

# Add new route
add_routes(
    app,
    chain.with_config(config),
    path="/test-chain",
)

# Test chain route
response = client.post("/test-chain/invoke", json={"input": {"topic": "Berlin"}})
```

Example trace: https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/261d1006-74ff-4b67-8baf-afdfc827aee2

![Trace of Langserve LCEL Example](https://langfuse.com/images/cookbook/integration_langserve_chain.png)

## Agent Example


```python
from langchain_core.tools import tool
from langchain_core.utils.function_calling import convert_to_openai_tool
from langchain.agents.format_scratchpad.openai_tools import (
    format_to_openai_tool_messages,
)
from langchain.agents import AgentExecutor
from langchain.agents.output_parsers.openai_tools import OpenAIToolsAgentOutputParser
from langserve.pydantic_v1 import BaseModel
from langchain_core.prompts import MessagesPlaceholder

class Input(BaseModel):
    input: str

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You are a helpful assistant."),
        ("user", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ]
)

@tool
def word_length(word: str) -> int:
    """Returns a counter word"""
    return len(word)

tools = [word_length]

llm_with_tools = llm.bind(tools=[convert_to_openai_tool(tool) for tool in tools])

agent = (
    {
        "input": lambda x: x["input"],
        "agent_scratchpad": lambda x: format_to_openai_tool_messages(
            x["intermediate_steps"]
        ),
    }
    | prompt
    | llm_with_tools
    | OpenAIToolsAgentOutputParser()
)
agent_executor = AgentExecutor(agent=agent, tools=tools)

agent_config = RunnableConfig({"run_name": "agent"}, callbacks=[langfuse_handler])

add_routes(
    app,
    agent_executor.with_types(input_type=Input).with_config(
        agent_config
    ),
    path="/test-agent",
)

response = client.post("/test-agent/invoke", json={"input": {"input": "How long is Leonardo DiCaprios last name?"}})
```

Example trace: https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/ed1d57f9-2f35-4e72-8150-b061f21840a7

![Trace of Langserve Agent example](https://langfuse.com/images/cookbook/integration_langserve_agent.png)
