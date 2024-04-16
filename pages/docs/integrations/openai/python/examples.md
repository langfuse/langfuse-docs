---
description: Drop-in replacement of OpenAI SDK to get full observability in Langfuse by changing only the import
category: Integrations
---

# Cookbook: OpenAI Integration (Python)

This is a cookbook with examples of the Langfuse Integration for OpenAI (Python).

Follow the [integration guide](https://langfuse.com/docs/integrations/openai/get-started) to add this integration to your OpenAI project.

## Setup

The integration is compatible with OpenAI SDK versions `>=0.27.8`. It supports async functions and streaming for OpenAI SDK versions `>=1.0.0`.


```python
%pip install langfuse openai --upgrade
```


```python
import os

# get keys for your project from https://cloud.langfuse.com
os.environ["LANGFUSE_PUBLIC_KEY"] = ""
os.environ["LANGFUSE_SECRET_KEY"] = ""

# your openai key
os.environ["OPENAI_API_KEY"] = ""

# Your host, defaults to https://cloud.langfuse.com
# For US data region, set to "https://us.cloud.langfuse.com"
# os.environ["LANGFUSE_HOST"] = "http://localhost:3000"
```


```python
# instead of: import openai
from langfuse.openai import openai
```


```python
# For debugging, checks the SDK connection with the server. Do not use in production as it adds latency.
from langfuse.openai import auth_check

auth_check()
```

## Examples

### Chat completion


```python
completion = openai.chat.completions.create(
  name="test-chat",
  model="gpt-3.5-turbo",
  messages=[
      {"role": "system", "content": "You are a very accurate calculator. You output only the result of the calculation."},
      {"role": "user", "content": "1 + 1 = "}],
  temperature=0,
  metadata={"someMetadataKey": "someValue"},
)
```

### Chat completion (streaming)

Simple example using the OpenAI streaming functionality.


```python
completion = openai.chat.completions.create(
  name="test-chat",
  model="gpt-3.5-turbo",
  messages=[
      {"role": "system", "content": "You are a professional comedian."},
      {"role": "user", "content": "Tell me a joke."}],
  temperature=0,
  metadata={"someMetadataKey": "someValue"},
  stream=True
)

for chunk in completion:
  print(chunk.choices[0].delta.content, end="")
```

### Chat completion (async)

Simple example using the OpenAI async client. It takes the Langfuse configurations either from the environment variables or from the attributes on the `openai` module.


```python
from langfuse.openai import AsyncOpenAI

async_client = AsyncOpenAI()
```


```python
completion = await async_client.chat.completions.create(
  name="test-chat",
  model="gpt-3.5-turbo",
  messages=[
      {"role": "system", "content": "You are a very accurate calculator. You output only the result of the calculation."},
      {"role": "user", "content": "1 + 100 = "}],
  temperature=0,
  metadata={"someMetadataKey": "someValue"},
)
```

Go to https://cloud.langfuse.com or your own instance to see your generation.

![Chat completion](https://langfuse.com/images/docs/openai-chat.png)

### Functions

Simple example using Pydantic to generate the function schema.


```python
%pip install pydantic --upgrade
```


```python
from typing import List
from pydantic import BaseModel

class StepByStepAIResponse(BaseModel):
    title: str
    steps: List[str]
schema = StepByStepAIResponse.schema() # returns a dict like JSON schema
```


```python
import json
response = openai.chat.completions.create(
    name="test-function",
    model="gpt-3.5-turbo-0613",
    messages=[
       {"role": "user", "content": "Explain how to assemble a PC"}
    ],
    functions=[
        {
          "name": "get_answer_for_user_query",
          "description": "Get user answer in series of steps",
          "parameters": StepByStepAIResponse.schema()
        }
    ],
    function_call={"name": "get_answer_for_user_query"}
)

output = json.loads(response.choices[0].message.function_call.arguments)
```

Go to https://cloud.langfuse.com or your own instance to see your generation.

![Function](https://langfuse.com/images/docs/openai-function.png)


### Group multiple generations into a single trace

Many applications require more than one OpenAI call. The `@observe()` decorator allows to nest all LLM calls of a single API invocation into the same `trace` in Langfuse.


```python
from langfuse.openai import openai
from langfuse.decorators import observe

@observe() # decorator to automatically create trace and nest generations
def main(country: str, user_id: str, **kwargs) -> str:
    # nested generation 1: use openai to get capital of country
    capital = openai.chat.completions.create(
      name="geography-teacher",
      model="gpt-3.5-turbo",
      messages=[
          {"role": "system", "content": "You are a Geography teacher helping students learn the capitals of countries. Output only the capital when being asked."},
          {"role": "user", "content": country}],
      temperature=0,
    ).choices[0].message.content

    # nested generation 2: use openai to write poem on capital
    poem = openai.chat.completions.create(
      name="poet",
      model="gpt-3.5-turbo",
      messages=[
          {"role": "system", "content": "You are a poet. Create a poem about a city."},
          {"role": "user", "content": capital}],
      temperature=1,
      max_tokens=200,
    ).choices[0].message.content

    return poem

# run main function and let Langfuse decorator do the rest
print(main("Bulgaria", "admin"))
```

Go to https://cloud.langfuse.com or your own instance to see your trace.

![Trace with multiple OpenAI calls](https://langfuse.com/images/docs/openai-trace-grouped.png)

#### Fully featured: Interoperability with Langfuse SDK

The `trace` is a core object in Langfuse and you can add rich metadata to it. See [Python SDK docs](https://langfuse.com/docs/sdk/python#traces-1) for full documentation on this.

Some of the functionality enabled by custom traces:
- custom name to identify a specific trace-type
- user-level tracking
- experiment tracking via versions and releases
- custom metadata


```python
from langfuse.openai import openai
from langfuse.decorators import langfuse_context, observe

@observe() # decorator to automatically create trace and nest generations
def main(country: str, user_id: str, **kwargs) -> str:
    # nested generation 1: use openai to get capital of country
    capital = openai.chat.completions.create(
      name="geography-teacher",
      model="gpt-3.5-turbo",
      messages=[
          {"role": "system", "content": "You are a Geography teacher helping students learn the capitals of countries. Output only the capital when being asked."},
          {"role": "user", "content": country}],
      temperature=0,
    ).choices[0].message.content

    # nested generation 2: use openai to write poem on capital
    poem = openai.chat.completions.create(
      name="poet",
      model="gpt-3.5-turbo",
      messages=[
          {"role": "system", "content": "You are a poet. Create a poem about a city."},
          {"role": "user", "content": capital}],
      temperature=1,
      max_tokens=200,
    ).choices[0].message.content

    # rename trace and set attributes (e.g., medatata) as needed
    langfuse_context.update_current_trace(
        name="City poem generator",
        session_id="1234",
        user_id=user_id,
        tags=["tag1", "tag2"],
        public=True,
        metadata = {
        "env": "development",
        },
        release = "v0.0.21"
    )

    return poem

# create random trace_id, could also use existing id from your application, e.g. conversation id
trace_id = str(uuid4())

# run main function, set your own id, and let Langfuse decorator do the rest
print(main("Bulgaria", "admin", langfuse_observation_id=trace_id))
```

### Programmatically add scores

You can add [scores](https://langfuse.com/docs/scores) to the trace, to e.g. record user feedback or some programmatic evaluation. Scores are used throughout Langfuse to filter traces and on the dashboard. See the docs on scores for more details.

The score is associated to the trace using the `trace_id`.


```python
from langfuse import Langfuse
from langfuse.decorators import langfuse_context, observe

langfuse = Langfuse()

@observe() # decorator to automatically create trace and nest generations
def main():
    # get trace_id of current trace
    trace_id = langfuse_context.get_current_trace_id()

    # rest of your application ...

    return "res", trace_id

# execute the main function to generate a trace
_, trace_id = main()

# Score the trace from outside the trace context
langfuse.score(
    trace_id=trace_id,
    name="my-score-name",
    value=1
)
```
