---
description: Drop-in replacement of OpenAI SDK to get full observability in Langfuse by changing only the import
---

# OpenAI Integration (Python)

If you use the OpenAI Python SDK, you can use the Langfuse **drop-in replacement** to get full logging by changing only the import.

```diff
- import openai
+ from langfuse.openai import openai
```

The integration does not support openai 1.x yet, this is work in progress.

## 1. Setup


```python
%pip install langfuse "openai<1.0.0" --upgrade
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

## 3. Use SDK as usual

_No changes required._

Optionally:
- Set `name` to identify a specific type of generation
- Set `metadata` with additional information that you want to see in Langfuse

### Chat completion


```python
completion = openai.ChatCompletion.create(
  name="test-chat",
  model="gpt-3.5-turbo",
  messages=[
      {"role": "system", "content": "You are a very accurate calculator. You output only the result of the calculation."},
      {"role": "user", "content": "1 + 1 = "}],
  temperature=0,
  metadata={"someMetadataKey": "someValue"},
)
```

### Functions

Simple example using Pydantic to generate the function schema.


```python
%pip install pydantic==1.* --upgrade
```

    zsh:1: no matches found: pydantic==1.*
    Note: you may need to restart the kernel to use updated packages.



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
response = openai.ChatCompletion.create(
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

output = json.loads(response.choices[0]["message"]["function_call"]["arguments"])
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


## 5. Group multiple generations into a single trace

Many applications require more than one OpenAI call. By setting the `trace_id` you can group them into a single trace for improved debugging and reporting. The `trace_id` usually comes from your own application or you create a random one to group calls together.


```python
from uuid import uuid4
trace_id = str(uuid4())
```


```python
country = openai.ChatCompletion.create(
  name="random-country",
  model="gpt-3.5-turbo",
  messages=[
      {"role": "user", "content": "Pick a random country"}],
  temperature=1,
  trace_id=trace_id
)["choices"][0]["message"]["content"]

capital = openai.ChatCompletion.create(
  name="geography-teacher",
  model="gpt-3.5-turbo",
  messages=[
      {"role": "system", "content": "You are a Geography teacher helping students learn the capitals of countries. Output only the capital when being asked."},
      {"role": "user", "content": country}],
  temperature=0,
  trace_id=trace_id
)["choices"][0]["message"]["content"]

poem = openai.ChatCompletion.create(
  name="poet",
  model="gpt-3.5-turbo",
  messages=[
      {"role": "system", "content": "You are a poet. Create a poem about a city."},
      {"role": "user", "content": capital}],
  temperature=1,
  max_tokens=200,
  trace_id=trace_id
)["choices"][0]["message"]["content"]
```

![Trace with multiple OpenAI calls](https://langfuse.com/images/docs/openai-trace-grouped.png)

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
