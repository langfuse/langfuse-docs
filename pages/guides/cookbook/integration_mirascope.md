---
description: Cookbook with examples of the Langfuse Integration for Mirascope (Python).
category: Integrations
---

# Cookbook: Mirascope x Langfuse Observability

[Mirascope](https://www.mirascope.io/) is a Python toolkit for building with LLMs. It allows devs to write Pythonic code while profiting from its abstractions to common LLM use cases and models.

[Langfuse](https://langfuse.com/docs) is an open source LLM engineering platform. Traces, evals, prompt management and metrics to debug and improve your LLM application.

With the [Langfuse <-> Mirascope integration](https://langfuse.com/integrations/frameworks/mirascope), you can log your application to Langfuse by adding the `@with_langfuse` decorator.

Let's dive right in with some examples:


```python
# Install Mirascope and Langfuse
%pip install "mirascope[langfuse]"
```


```python
import os

# Get keys for your project from the project settings page
# https://cloud.langfuse.com
os.environ["LANGFUSE_SECRET_KEY"] = "sk-..."
os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-..."
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region

# Your openai key
os.environ["OPENAI_API_KEY"] = "sk-..."
```

## Log a first simple call


```python
from mirascope.integrations.langfuse import with_langfuse
from mirascope.core import openai, prompt_template

@with_langfuse()
@openai.call("gpt-4o-mini")
@prompt_template("Recommend a {genre} book")
def recommend_book(genre: str):
    ...

response = recommend_book("fantasy")
print(response.content)
```

    I recommend **"The House in the Cerulean Sea" by TJ Klune**. It's a heartwarming fantasy that follows Linus Baker, a caseworker for magical children, who is sent on a special assignment to a mysterious orphanage. There, he discovers unique and lovable characters and confronts themes of acceptance, found family, and the importance of love and kindness. The book combines whimsy, humor, and poignant moments, making it a delightful read for fantasy lovers.


[**Example trace**](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/84bbb50e-aebc-424a-ae8a-e1012914d46b)

![Trace of simple Mirascope execution in Langfuse](https://langfuse.com/images/cookbook/integration_mirascope_simple.png)

## Let's use it together with the Langfuse decorator

We'll use
- Mirascope's `@with_langfuse()` decorator to log the generation
- and Langfuse default [`@observe()` decorator](https://langfuse.com/docs/sdk/python/decorators) which works with any Python function to observe the `generate_facts` function and group the generations into a single trace.


```python
from mirascope.integrations.langfuse import with_langfuse
from mirascope.core import openai, prompt_template

@with_langfuse()
@openai.call("gpt-4o")
@prompt_template("Give me one short random fact about {name}")
def random_fact(name: str):
    ...

@observe()
def generate_facts(number_of_facts: int):
    for i in range(number_of_facts):
        response = random_fact(f"frogs")
        print(response.content)

generate_facts(3)
```

    Sure! Frogs can breathe through their skin, allowing them to absorb oxygen and release carbon dioxide directly into and out of their bloodstream. This process is known as cutaneous respiration.
    Some species of frogs can absorb water through their skin, meaning they don't need to drink water with their mouths.
    Frogs can breathe through their skin! This adaptation allows them to absorb oxygen directly from water, which is especially useful when they're submerged.


Head over to the Langfuse Traces table [in Langfuse Cloud](https://cloud.langfuse.com) to see the entire chat history, token counts, cost, model, latencies and more

[**Example trace**](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/71eba8c4-3088-4af2-8d35-5b19d668d6aa)

![Trace of complex Mirascope execution in Langfuse](https://langfuse.com/images/cookbook/integration_mirascope_complex.png)

## That's a wrap.

There's a lot more you can do:

- **Mirascope**: Head over to [their docs](https://docs.mirascope.io/latest/) to learn more about what you can do with the framework.
- **Langfuse**: Have a look at Evals, Datasets, Prompt Management to start exploring [all that Langfuse can do](https://langfuse.com/docs).
