---
description: Drop-in replacement of OpenAI SDK to get full observability in Langfuse by changing only the import
---

# OpenAI Integration (Python)

If you use the OpenAI Python SDK, you can use the Langfuse **drop-in replacement** to get full logging by changing only the import.

```diff
- import openai
+ from langfuse.openai import openai
```

## 1. Setup

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

# if you do not use Langfuse Cloud
# os.environ["LANGFUSE_HOST"] = "http://localhost:3000"
```

## 2. Replace import



```python
# instead of: import openai
from langfuse.openai import openai
```

### Attributes

Instead of setting the environment variables before importing the SDK, you can also use the following attributes after the import. This works for the async OpenAI client as well:

| Attribute |Description   | Default value  
| --- | --- | ---
| `openai.langfuse_host` | BaseUrl of the Langfuse API | `LANGFUSE_HOST` environment variable, defaults to `"https://cloud.langfuse.com"`       
| `openai.langfuse_public_key` | Public key of the Langfuse API | `LANGFUSE_PUBLIC_KEY` environment variable       
| `openai.langfuse_secret_key` | Private key of the Langfuse API | `LANGFUSE_SECRET_KEY` environment variable       


```python
# Instead of environment variables, you can use the module variables to configure Langfuse

# openai.langfuse_host = '...'
# openai.langfuse_public_key = '...'
# openai.langfuse_secret_key = '...'

# This works for the async client as well
# from langfuse.openai import AsyncOpenAI
```

## 3. Use SDK as usual

_No changes required._

Optionally:
- Set `name` to identify a specific type of generation
- Set `metadata` with additional information that you want to see in Langfuse

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

#### Streaming

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

    Sure, here's one for you:
    
    Why don't scientists trust atoms?
    
    Because they make up everything!None

#### Async support

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

## 4. Debug & measure in Langfuse

Go to https://cloud.langfuse.com or your own instance

### Dashboard
![Dashboard](https://langfuse.com/images/docs/openai-dashboard.png)

### List of generations
![List of generations](https://langfuse.com/images/docs/openai-generation-list.png)

### Chat completion
![Chat completion](https://langfuse.com/images/docs/openai-chat.png)

### Function
![Function](https://langfuse.com/images/docs/openai-function.png)


## 5. Track OpenAI errors

Langfuse automatically monitors OpenAI errors.


```python
# Cause an error by attempting to use a host that does not exist.
openai.api_base = "https://example.com"

country = openai.chat.completions.create(
  name="will-error",
  model="gpt-3.5-turbo",
  messages=[
      {"role": "user", "content": "How are you?"}],
)
```

Throws error 👆

![Openai error](https://langfuse.com/images/docs/openai-error.png)


```python
# Reset
openai.api_base = "https://api.openai.com/v1"
```

## 5. Group multiple generations into a single trace

Many applications require more than one OpenAI call. In Langfuse, all LLM calls of a single API invocation (or conversation thread) can be grouped into the same `trace`.

There are 2 options: (1) pass a `trace_id` (own or random string) or (2) create a trace with the Langfuse SDK.

### Simple: `trace_id` as string

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

![Trace with multiple OpenAI calls](https://langfuse.com/images/docs/openai-trace-grouped.png)

### Fully featured: create trace via SDK

The `trace` is a core object in Langfuse and you can add rich metadata to it. See [Python SDK docs](https://langfuse.com/docs/integrations/sdk/python#traces-1) for full documentation on this.

Some of the functionality enabled by custom traces:
- custom name to identify a specific trace-type
- user-level tracking
- experiment tracking via versions and releases
- custom metadata


```python
from langfuse import Langfuse
from langfuse.model import CreateTrace

# initialize SDK
langfuse = Langfuse()

# create trace and add params
trace = langfuse.trace(CreateTrace(
    name = "country-poems",
    userId = "user@example.com",
    metadata = {
        "env": "development",
    },
    release = "v0.0.21"
))

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

## 6. Add scores

You can also add [scores](https://langfuse.com/docs/scores) to the trace, to e.g. record user feedback or some other evaluation. Scores are used throughout Langfuse to filter traces and on the dashboard. See the docs on scores for more details.

The score is associated to the trace using the `trace_id` (see previous step).


```python
from langfuse import Langfuse
from langfuse.model import InitialScore

langfuse = Langfuse()

langfuse.score(InitialScore(
    traceId=trace_id,
    name="my-score-name",
    value=1
));
```

![Trace with score](https://langfuse.com/images/docs/openai-trace-with-score.png)

## Troubleshooting

### Shutdown behavior

The Langfuse SDK executes network requests in the background on a separate thread for better performance of your application. This can lead to lost events in short lived environments like AWS Lambda functions when the Python process is terminated before the SDK sent all events to the Langfuse backend.

To avoid this, ensure that the `openai.flush_langfuse()` function is called before termination. This method is blocking as it awaits all requests to be completed.


```python
openai.flush_langfuse()
```
