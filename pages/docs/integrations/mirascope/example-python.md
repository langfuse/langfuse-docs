---
description: Cookbook with examples of the Langfuse Integration for Mirascope (Python).
category: Integrations
---

# Cookbook: Mirascope x Langfuse integration

[Mirascope](https://www.mirascope.io/) is a Python toolkit for building with LLMs. It allows devs to write Pythonic code while profiting from its abstractions to common LLM use cases and models.

[Langfuse](https://langfuse.com/docs) is an open source LLM engineering platform. Traces, evals, prompt management and metrics to debug and improve your LLM application.

With the [Langfuse <-> Mirascope integration](https://langfuse.com/docs/integrations/mirascope), you can log your application to Langfuse by adding the `@with_langfuse` decorator.

Let's dive right in with some examples:


```python
# Install Mirascope and Langfuse
%pip install mirascope[all] langfuse
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

## Log a first simple call


```python
from mirascope.langfuse import with_langfuse
from mirascope.openai import OpenAICall, OpenAICallParams

@with_langfuse
class GeographyGenius(OpenAICall):
    prompt_template = "What's the capital of {country}?"
    country: str
    call_params = OpenAICallParams(model="gpt-4o", temperature=1)

genius = GeographyGenius(country="Japan")
response = genius.call()  # logs to langfuse
print(response.content)
```

[**Example trace**](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/4df31bf6-5960-470d-8b2b-5deb6a5fe020?observation=90de9754-c5df-4c3d-8e38-87d507392495)

![Trace of simple Mirascope execution in Langfuse](https://langfuse.com/images/cookbook/integration_mirascope_simple.png)

## Let's make this more complex

We'll use
- Mirascope's `@with_langfuse` decorator to log the call to Langfuse within the Mirascope classes
- and Langfuse default [`@observe` decorator](https://langfuse.com/docs/sdk/python/decorators) which works with any Python function

to create and trace a fun rap battle and group everything into a single trace.


```python
from openai.types.chat import ChatCompletionMessageParam
from mirascope.openai import OpenAICall
from langfuse.decorators import observe

@with_langfuse
class Rapper(OpenAICall):
    prompt_template = """
    SYSTEM: This is a rap battle. You are {person}. Make sure to defend you {position}. Only drop two lines at a time, make them rhyme.
    MESSAGES: {history}
    """
    history: list[ChatCompletionMessageParam] = []
    person: str
    position: str

zuck = Rapper(person="Mark Zuckerberg", position="Open source will win in VR/AR/Visual Computing", history=[])
timapple = Rapper(person="Tim Cook", position="Apple builds the best headsets as we are integrated in software and hardware", history=[])

# utility function to update the history of both rappers
def add_to_history(new_line: str, rapper: str):
    zuck.history += [
        {"role": "assistant" if rapper == "zuck" else "user", "content": new_line},
    ]
    timapple.history += [
        {"role": "assistant" if rapper == "timapple" else "user", "content": new_line},
    ]

## use the langfuse @observe decorator to log any Python function and wrap all logs within it into a single trace
@observe()
def rap_battle(lines: int):

  # Make sure that the battle starts of juicy
  add_to_history("Yo wassup Zuck, I hate OSS", "timapple")

  for i in range(lines):
      zuck_line = zuck.call()
      print(f"(Zuck): {zuck_line.content}")
      add_to_history(zuck_line.content, "zuck")

      timapple_line = timapple.call()
      print(f"(Tim Apple): {timapple_line.content}")
      add_to_history(timapple_line.content, "timapple")
  return [item["content"] for item in timapple.history]

rap_battle(4);
```

Head over to the Langfuse Traces table [in Langfuse Cloud](https://cloud.langfuse.com ) to see the entire chat history, token counts, cost, model, latencies and more

[**Example trace**](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/8b12f6aa-a7a4-4c12-82fc-f25c27a30f41)

![Trace of complex Mirascope execution in Langfuse](https://langfuse.com/images/cookbook/integration_mirascope_complex.png)

## That's a wrap.

There's a lot more you can do:

- **Mirascope**: Head over to [their docs](https://https://docs.mirascope.io/latest/) to learn more about what you can do with the framework.
- **Langfuse**: Have a look at Evals, Datasets, Prompt Management to start exploring [all that Langfuse can do](https://langfuse.com/docs).
