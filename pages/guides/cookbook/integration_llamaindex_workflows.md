---
title: Observability for LlamaIndex Workflows with Langfuse  
description: Learn how to monitor LlamaIndex Workflows with Langfuse. This cookbook shows you how to trace AI workflows, improve observability, and debug LLM applications.  
---

# Observability for LlamaIndex Workflows

This cookbook demonstrates how to use [Langfuse](https://langfuse.com) to gain real-time observability for your [LlamaIndex Workflows](https://docs.llamaindex.ai/en/stable/module_guides/workflow/).

> **What are LlamaIndex Workflows?** [LlamaIndex Workflows](https://docs.llamaindex.ai/en/stable/module_guides/workflow/) is a flexible, event-driven framework designed to build robust AI agents. In LlamaIndex, workflows are created by chaining together multiple steps—each defined and validated using the `@step` decorator. Every step processes specific event types, allowing you to orchestrate complex processes such as AI agent collaboration, RAG flows, data extraction, and more.

> **What is Langfuse?** [Langfuse](https://langfuse.com) is the open source LLM engineering platform. It helps teams to collaboratively manage prompts, trace applications, debug problems, and evaluate their LLM system in production.

## Get Started

We'll walk through a simple example of using LlamaIndex Workflows and integrating it with Langfuse.

### Step 1: Install Dependencies


```python
%pip install langfuse openai llama-index
```

### Step 2: Set Up Environment Variables

Configure your Langfuse API keys. You can get them by signing up for [Langfuse Cloud](https://cloud.langfuse.com) or [self-hosting Langfuse](https://langfuse.com/self-hosting).


```python
import os

# Get keys for your project from the project settings page
# https://cloud.langfuse.com

os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-..." 
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-..."
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region

# Set your OpenAI API key
os.environ["OPENAI_API_KEY"] = "sk-proj-..."
```

### Step 3: Initialize the `LlamaIndexInstrumentor`

At the root of your LlamaIndex application, register Langfuse’s `LlamaIndexInstrumentor`. When instantiating `LlamaIndexInstrumentor`, make sure to configure your Langfuse API keys and the Host URL correctly via environment variables or constructor arguments.


```python
from langfuse.llama_index import LlamaIndexInstrumentor

# Get your keys from the Langfuse project settings page and set them as environment variables or pass them as arguments when initializing the instrumentor
instrumentor = LlamaIndexInstrumentor()
```

### Step 4: Create a Simple LlamaIndex Workflows Application

In LlamaIndex Workflows, you build event-driven AI agents by defining steps with the `@step` decorator. Each step processes an event and, if appropriate, emits new events. In this example, we create a simple workflow with two steps: one that pre-processes an incoming event and another that generates a reply.


```python
instrumentor.start()

from llama_index.core.workflow import (
    Event,
    StartEvent,
    StopEvent,
    Workflow,
    step,
)

# `pip install llama-index-llms-openai` if you don't already have it
from llama_index.llms.openai import OpenAI

class JokeEvent(Event):
    joke: str

class JokeFlow(Workflow):
    llm = OpenAI()

    @step
    async def generate_joke(self, ev: StartEvent) -> JokeEvent:
        topic = ev.topic

        prompt = f"Write your best joke about {topic}."
        response = await self.llm.acomplete(prompt)
        return JokeEvent(joke=str(response))

    @step
    async def critique_joke(self, ev: JokeEvent) -> StopEvent:
        joke = ev.joke

        prompt = f"Give a thorough analysis and critique of the following joke: {joke}"
        response = await self.llm.acomplete(prompt)
        return StopEvent(result=str(response))

w = JokeFlow(timeout=60, verbose=False)
result = await w.run(topic="pirates")
print(str(result))

instrumentor.flush()
```

    Trace ID is not set. Creating generation client with new trace id.


    Analysis:
    This joke plays on the pun of "fish and ships" sounding like "fish and chips," a popular dish at seafood restaurants. The joke also incorporates the pirate theme by mentioning a pirate going to a seafood restaurant, which adds an element of humor and surprise.
    
    Critique:
    Overall, this joke is light-hearted and playful, making it suitable for a general audience. The use of wordplay is clever and adds an element of wit to the punchline. However, the joke may be considered somewhat predictable as the punchline is somewhat expected once the pirate theme is introduced. Additionally, the humor may not be particularly sophisticated or original, as puns involving food and wordplay are common in comedy. Overall, while this joke may elicit a chuckle or a smile, it may not be particularly memorable or groundbreaking in terms of humor.


### Step 5: View Traces in Langfuse

After running your workflow, log in to [Langfuse](https://cloud.langfuse.com) to explore the generated traces. You will see logs for each workflow step along with metrics such as token counts, latencies, and execution paths. 

![Langfuse Trace Example](https://langfuse.com/images/cookbook/integration-llamaindex-workflows/llamaindex-workflows-example-trace.png)

_[Public example trace in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/f2bb3e13-aafb-41a0-a852-efd20f12a4f4?timestamp=2025-02-13T16%3A03%3A09.705Z)_

## References

- [LlamaIndex Workflows Documentation](https://docs.llamaindex.ai/en/stable/module_guides/workflow/)  


