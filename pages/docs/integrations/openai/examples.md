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




    True



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

    Sure thing! Why did the scarecrow win an award? Because he was outstanding in his field!None

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

    Requirement already satisfied: pydantic in /usr/local/lib/python3.10/dist-packages (2.6.3)
    Collecting pydantic
      Downloading pydantic-2.6.4-py3-none-any.whl (394 kB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m394.9/394.9 kB[0m [31m1.2 MB/s[0m eta [36m0:00:00[0m
    [?25hRequirement already satisfied: annotated-types>=0.4.0 in /usr/local/lib/python3.10/dist-packages (from pydantic) (0.6.0)
    Requirement already satisfied: pydantic-core==2.16.3 in /usr/local/lib/python3.10/dist-packages (from pydantic) (2.16.3)
    Requirement already satisfied: typing-extensions>=4.6.1 in /usr/local/lib/python3.10/dist-packages (from pydantic) (4.10.0)
    Installing collected packages: pydantic
      Attempting uninstall: pydantic
        Found existing installation: pydantic 2.6.3
        Uninstalling pydantic-2.6.3:
          Successfully uninstalled pydantic-2.6.3
    Successfully installed pydantic-2.6.4



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

Many applications require more than one OpenAI call. Langfuse `decorators` allows to nest all LLM calls of a single API invocation into the same `trace` with just a few lines of codes.


```python
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

    return poem

# run main function and let Langfuse decorator do the rest
print(main("Bulgaria", "admin"))

# Flush observations to Langfuse
langfuse_context.flush()
```

    In the heart of mountains and dreams,
    There lies a city, where beauty gleams.
    Sofia, a place of ancient tales,
    Where history whispers in every gale.
    
    Streets lined with cobblestones old,
    Tales of conquerors and stories untold.
    Architecture grand, a sight to behold,
    Domes and spires reaching for the sky's fold.
    
    Markets bustling with colors and sounds,
    A melting pot of cultures, where harmony abounds.
    The aroma of spices fills the air,
    As locals and travelers alike share a care.
    
    Parks and gardens, oases of green,
    Amidst the urban jungle, a peaceful scene.
    Bridges spanning rivers that flow,
    Connecting past and present in a graceful glow.
    
    Sofia, a city of contrasts and charm,
    Where past and present intertwine arm in arm.
    A place where time stands still, yet moves on,
    A city to love, a city to be drawn.
    
    So let us wander through Sofia's


#### Optional: Set `trace_id` manually

When creating a trace, Langfuse offers users 2 options: (1) create a `trace_id` with the Langfuse SDK (default) or (2) pass a `trace_id` (own or random string) to the Langfuse SDK. With Langfuse `decorators` users can add an identifier from your their own application (e.g., conversation-id) via the `keyword arguments`.


```python
from langfuse.decorators import langfuse_context, observe
from uuid import uuid4

# create random trace_id, could also use existing id from your application, e.g. conversation id
trace_id = str(uuid4())

# run main function and let Langfuse decorator do the rest
print(main("Bulgaria", "admin", langfuse_observation_id=trace_id))

# Flush observations to Langfuse
langfuse_context.flush()
```

    In the heart of the Balkan land,
    Where ancient stories make their stand,
    Lies a city full of grace and charm,
    Sofia, oh Sofia, where histories swarm.
    
    With domes and towers that reach the sky,
    Whispers of the past floating by,
    A place where East meets West in glee,
    In Sofia, where cultures dance free.
    
    Streets bustling with life and sound,
    Mosaics of colors all around,
    Each corner a new tale to tell,
    In Sofia, where secrets dwell.
    
    A city of contrasts, old and new,
    Where dreams are born, and skies are blue,
    In the cradle of mountains tall,
    Sofia stands proud, a city for all.
    
    So, let us wander, let us roam,
    Through streets of cobblestone,
    Among the ruins and the art,
    In Sofia, where memories start.
    
    For in this city, vibrant and true,
    There's a spirit that will guide you through,
    Sofia, oh Sofia,


Go to https://cloud.langfuse.com or your own instance to see your trace.

TODO: update screenshot https://cloud.langfuse.com/project/clr4qu8qv0000yu4ja339x02u/traces/158b5d9a-68ee-493f-b26d-2347a2333bac

![Trace with multiple OpenAI calls](https://langfuse.com/images/docs/openai-trace-grouped.png)

#### Fully featured: Interoperability with Langfuse SDK

The `trace` is a core object in Langfuse and you can add rich metadata to it. See [Python SDK docs](https://langfuse.com/docs/sdk/python#traces-1) for full documentation on this.

Some of the functionality enabled by custom traces:
- custom name to identify a specific trace-type
- user-level tracking
- experiment tracking via versions and releases
- custom metadata


```python
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

# run main function and let Langfuse decorator do the rest
print(main("Bulgaria", "admin", langfuse_observation_id=trace_id))

# Flush observations to Langfuse
langfuse_context.flush()
```

    In the heart of Bulgaria lies a city fair,
    Sofia, with its charm beyond compare.
    Nestled among mountains, a sight to see,
    A tapestry of history and modernity.
    
    Streets lined with cafes, bustling and alive,
    Where stories are shared, dreams thrive.
    The ancient churches, with domes so grand,
    Whisper tales of a city that will forever stand.
    
    The people of Sofia, a vibrant blend,
    From all walks of life, they do extend
    A warm embrace to all who pass through,
    In this city where dreams can come true.
    
    Underneath the stars, Sofia shines bright,
    A beacon of hope in the darkest night.
    A city of contrasts, old and new,
    So rich in culture, so full of hue.
    
    So raise a glass to Sofia, proud and free,
    A city that holds the key
    To memories made and stories told,
    In a city of wonder, a sight to behold.


Screenshot? Trace: https://cloud.langfuse.com/project/clr4qu8qv0000yu4ja339x02u/traces/1835e03e-8dbc-4a2b-ba56-df4c18d023df

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
