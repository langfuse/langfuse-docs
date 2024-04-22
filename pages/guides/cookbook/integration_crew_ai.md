---
description: Cookbook with examples of the Langfuse Integration for crewAI.
category: Integrations
---

# Cookbook: crewAI Integration

This is a cookbook with examples of the Langfuse Integration for crewAI.

_Note: crewAI is compatible with Python >=3.10, <=3.13._

## Setup


```python
!pip install crewai langfuse
```

Initialize the Langfuse client with your API keys from the project settings in the Langfuse UI and add them to your environment.


```python
import os

os.environ["LANGFUSE_PUBLIC_KEY"] = ""
os.environ["LANGFUSE_SECRET_KEY"] = ""
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # for EU data region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # for US data region

os.environ["OPENAI_API_KEY"] = ""
```


```python
from langfuse.openai import auth_check

# Tests the SDK connection with the server
auth_check()
```

## Create Custom Tool

For more information on how to create custom tools for the crewAI framework, please visit the [crewAI docs](https://docs.crewai.com/how-to/Create-Custom-Tools).


```python
from crewai_tools import tool

@tool
def multiplication_tool(first_number: int, second_number: int) -> str:
    """Useful for when you need to multiply two numbers together."""
    return first_number * second_number
```

## Assemble Crew


```python
from crewai import Agent, Task, Process, Crew

writer = Agent(
        role="Writer",
        goal="You write lesssons of math for kids.",
        backstory="You're an expert in writing haikus but you know nothing of math.",
        tools=[multiplication_tool],
    )

task = Task(description=("What is {multiplication}?"), expected_output=("Write a haiku containing the solution"), agent=writer)

crew = Crew(
  agents=[writer],
  tasks=[task],
  share_crew=True
)

```

## Examples

### Simple Example using observer() decorator

You can use this integration in combination with the `observe()` decorator from the Langfuse Python SDK. Thereby, you can trace non-Langchain code, combine multiple Langchain invocations in a single trace, and use the full functionality of the Langfuse Python SDK.

Learn more about Langfuse Tracing [here](https://langfuse.com/docs/tracing) and this functionality [here](https://langfuse.com/docs/sdk/python/decorators).


```python
from langfuse.decorators import observe, langfuse_context

@observe()
def create_haiku_simple(input):
    result = crew.kickoff(inputs={"multiplication": input})
    print(result)

create_haiku_simple("1 * 3")
```

### Example using observer() decorator with custom tracing


```python
from langfuse.decorators import langfuse_context

@observe()
def create_haiku_rich(input):
    result = crew.kickoff(inputs={"multiplication": input})
    langfuse_context.update_current_observation(
        name="Crew AI Trace",
        session_id="session_id",
        user_id="user_id",
        tags=["crew_ai", "haiku"],
        output=result,
    )
    print(result)

create_haiku_rich("5 * 3")
```

### Example using CallbackHandler()


```python
from langchain_openai import ChatOpenAI
from langfuse.callback import CallbackHandler
from langfuse import Langfuse

langfuse_handler = CallbackHandler()

crew_with_langfuse = Crew(
  agents=[writer],
  tasks=[task],
  manager_callbacks=[langfuse_handler],
)
res = crew_with_langfuse.kickoff(inputs={"multiplication": "3 * 3"})
print(res)
```
