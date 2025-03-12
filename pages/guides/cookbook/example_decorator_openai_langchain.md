---
description: LLM Rap Battle traced using the Langfuse Decorator, OpenAI & Langchain Integration
category: Integrations
---

# Example: Langfuse Decorator + OpenAI Integration + Langchain Integration

```python
%pip install langfuse openai langchain_openai langchain
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

## Imports

```python
import random
```

```python
from operator import itemgetter
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema import StrOutputParser
from langfuse.decorators import observe
```

```python
from langfuse.decorators import langfuse_context, observe

# import openai
from langfuse.openai import openai
```

## Example: LLM Rap Battle

```python
@observe()
def get_random_rap_topic():
  topics = [
      "OSS software",
      "artificial general intelligence"
  ]
  return random.choice(topics)
```

```python
@observe()
def summarize_rap_langchain(rap):
    langfuse_handler = langfuse_context.get_current_langchain_handler()

    # Create chain
    prompt = ChatPromptTemplate.from_template("Summarrize this rap: {rap}")
    model = ChatOpenAI()
    chain = prompt | model | StrOutputParser()

    # Pass handler to invoke
    summary = chain.invoke(
        {"rap": rap},
        config={"callbacks":[langfuse_handler]}
    )

    return summary
```

```python
@observe()
def rap_battle(turns: int = 5):
  topic = get_random_rap_topic()

  print(f"Topic: {topic}")

  langfuse_context.update_current_trace(
     metadata={"topic":topic},
     tags=["Launch Week 1"]
  )

  messages = [
      {"role": "system", "content": "We are all rap artist. When it is our turn, we drop a fresh line."},
      {"role": "user", "content": f"Kick it off, today's topic is {topic}, here's the mic..."}
  ]

  for turn in range(turns):
      completion = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
      )
      rap_line = completion.choices[0].message.content
      messages.append({"role": "assistant", "content": rap_line})
      print(f"\nRap {turn}: {rap_line}")

  summary = summarize_rap_langchain([message['content'] for message in messages])

  return summary
```

```python
rap_summary = rap_battle(turns=4)
print("\nSummary: " + rap_summary)
```
