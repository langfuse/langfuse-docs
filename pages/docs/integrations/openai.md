---
description: Drop-in replacement of OpenAI SDK to get full observability in Langfuse by changing only the import
---

# OpenAI Integration (Python)

If you use the OpenAI Python SDK, you can use the Langfuse **drop-in replacement** to get full logging by changing only the import.

```diff
- import openai
+ from langfuse.openai import openai
```

_**Current limitations**_

- Each generation creates a new trace in Langfuse
- It is not possible to attach a score to the generation

Use this integration if you want to get started with Langfuse super fast and mostly care about tracking costs and monitoring model inputs and outputs. This integration is work in progress and features will be added over time. Suggestions and PRs welcome!

For full flexibility, consider using the fully-featured [Python SDK](/docs/integrations/sdk/python).

→ This page is a jupyter notebook, open it on [GitHub](https://github.com/langfuse/langfuse-docs/blob/main/src/ipynb/langfuse_docs_openai_integration.ipynb) or [Google Colab](http://colab.research.google.com/github/langfuse/langfuse-docs/blob/main/src/ipynb/langfuse_docs_openai_integration.ipynb).

## 1. Setup

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
