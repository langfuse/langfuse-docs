---
description: Drop-in replacement of OpenAI SDK to get full observability in Langfuse by changing only the import
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

Many applications require more than one OpenAI call. In Langfuse, all LLM calls of a single API invocation can be grouped into the same `trace`.

There are 2 options: (1) pass a `trace_id` (own or random string) or (2) create a trace with the Langfuse SDK.

#### Simple: `trace_id` as string

To get started, you can just add an identifier from your own application (e.g., conversation-id) to the openai calls – or create a random id.


```python
# create random trace_id
# could also use existing id from your application, e.g. conversation id
from uuid import uuid4
trace_id = str(uuid4())

# create multiple completions, pass trace_id to each

country = "Bulgaria"

capital = openai.chat.completions.create(
  name="geography-teacher",
  model="gpt-3.5-turbo",
  messages=[
      {"role": "system", "content": "You are a Geography teacher helping students learn the capitals of countries. Output only the capital when being asked."},
      {"role": "user", "content": country}],
  temperature=0,
  trace_id=trace_id
).choices[0].message.content

poem = openai.chat.completions.create(
  name="poet",
  model="gpt-3.5-turbo",
  messages=[
      {"role": "system", "content": "You are a poet. Create a poem about a city."},
      {"role": "user", "content": capital}],
  temperature=1,
  max_tokens=200,
  trace_id=trace_id
).choices[0].message.content
```

Go to https://cloud.langfuse.com or your own instance to see your trace.

![Trace with multiple OpenAI calls](https://langfuse.com/images/docs/openai-trace-grouped.png)

#### Fully featured: interoperability with Langfuse SDK

The `trace` is a core object in Langfuse and you can add rich metadata to it. See [Python SDK docs](https://langfuse.com/docs/sdk/python#traces-1) for full documentation on this.

Some of the functionality enabled by custom traces:
- custom name to identify a specific trace-type
- user-level tracking
- experiment tracking via versions and releases
- custom metadata


```python
from langfuse import Langfuse

# initialize SDK
langfuse = Langfuse()

# create trace and add params
trace = langfuse.trace(
    # optional, if you want to use your own id
    # id = "my-trace-id",

    name = "country-poems",
    user_id = "user@example.com",
    metadata = {
        "env": "development",
    },
    release = "v0.0.21"
)

# get traceid to pass to openai calls
trace_id = trace.id

# create multiple completions, pass trace_id to each

country = "Bulgaria"

capital = openai.chat.completions.create(
  name="geography-teacher",
  model="gpt-3.5-turbo",
  messages=[
      {"role": "system", "content": "You are a Geography teacher helping students learn the capitals of countries. Output only the capital when being asked."},
      {"role": "user", "content": country}],
  temperature=0,
  trace_id=trace_id
).choices[0].message.content

poem = openai.chat.completions.create(
  name="poet",
  model="gpt-3.5-turbo",
  messages=[
      {"role": "system", "content": "You are a poet. Create a poem about a city."},
      {"role": "user", "content": capital}],
  temperature=1,
  max_tokens=200,
  trace_id=trace_id
).choices[0].message.content
```

You can also use the nesting capabilities of Langfuse Tracing by providing a `parent_observation_id`. For example, this can be the id of a span that you created via the Langfuse Python SDK.

### Add scores to generation

You can also add [scores](https://langfuse.com/docs/scores) to the trace, to e.g. record user feedback or some other evaluation. Scores are used throughout Langfuse to filter traces and on the dashboard. See the docs on scores for more details.

The score is associated to the trace using the `trace_id` (see previous step).


```python
from langfuse import Langfuse

langfuse = Langfuse()

langfuse.score(
    trace_id=trace_id,
    name="my-score-name",
    value=1
);
```

Go to https://cloud.langfuse.com or your own instance to see your trace with score.

![Trace with score](https://langfuse.com/images/docs/openai-trace-with-score.png)
