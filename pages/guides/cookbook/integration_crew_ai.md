---
description: Cookbook with examples of the Langfuse Integration for crewAI.
category: Integrations
---

# Cookbook: crewAI Integration

This is a cookbook with examples of the Langfuse Integration for [crewAI](https://docs.crewai.com/) ([GitHub](https://github.com/joaomdmoura/crewai/)).<br>
It utilizes the Langfuse [OpenAI Integration](https://langfuse.com/docs/integrations/openai/python/get-started) and the [@observe() decorator](https://langfuse.com/docs/sdk/python/decorators). The OpenAI Integration ensures that each step executed by your crew is logged as a new generation in the system. The @observe() decorator automatically and asynchronously groups these logs into a single trace.


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
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # For US data region, set this to "https://us.cloud.langfuse.com"

os.environ["OPENAI_API_KEY"] = ""
```

Import the Langfuse OpenAI integration and check the server connection.


```python
from langfuse.openai import auth_check

auth_check()
```

### Create Custom Tool

For more information on how to create custom tools for the crewAI framework, please visit the [crewAI docs](https://docs.crewai.com/how-to/Create-Custom-Tools).


```python
from crewai_tools import tool

@tool
def multiplication_tool(first_number: int, second_number: int) -> str:
    """Useful for when you need to multiply two numbers together."""
    return first_number * second_number
```

### Assemble Crew

For detailed instructions on setting up your crew, please refer to the [crewAI documentation](https://docs.crewai.com/how-to/Creating-a-Crew-and-kick-it-off/).


```python
from crewai import Agent, Task, Crew

writer = Agent(
        role="Writer",
        goal="You make math engaging and understandable for young children through poetry",
        backstory="You're an expert in writing haikus but you know nothing of math.",
        tools=[multiplication_tool],  
    )

task = Task(description=("What is {multiplication}?"),
            expected_output=("Compose a haiku that includes the answer."),
            agent=writer)

crew = Crew(
  agents=[writer],
  tasks=[task],
  share_crew=False
)
```

## Examples

### Simple Example using OpenAI Integration and @observe() decorator

You can use this integration in combination with the `@observe()` decorator from the Langfuse Python SDK. Thereby, you can trace non-Langchain code, combine multiple Langchain invocations in a single trace, and use the full functionality of the Langfuse Python SDK.

Learn more about Langfuse Tracing [here](https://langfuse.com/docs/tracing).


```python
from langfuse.decorators import observe

@observe()
def create_simple_haiku(input):
    result = crew.kickoff(inputs={"multiplication": input})
    return result

create_simple_haiku("3 * 3")
```

### Example with additional trace attributes


```python
from langfuse.decorators import langfuse_context

@observe()
def create_custom_haiku(input):
    result = crew.kickoff(inputs={"multiplication": input})
    langfuse_context.update_current_observation(
        name="Crew AI Trace",
        session_id="session_id",
        user_id="user_id",
        tags=["haiku"],
        metadata={"env": "prod"}
    )
    return result

create_custom_haiku("5 * 3")
```
