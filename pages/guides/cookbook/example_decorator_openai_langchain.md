---
description: LLM Rap Battle traced using the Langfuse Decorator, OpenAI & Langchain Integration
category: Integrations
---

# Example: Langfuse Decorator + OpenAI Integration + Langchain Integration

**Note:** This notebook utilizes the [Langfuse OTel Python SDK v3](https://langfuse.com/docs/sdk/python/sdk-v3). For users of [Python SDK v2](https://langfuse.com/docs/sdk/python/decorators-v2), please refer to [our legacy notebook](https://github.com/langfuse/langfuse-docs/blob/366ec9395851da998d390eac4ab8c4dd2e985054/cookbook/example_decorator_openai_langchain.ipynb).


```python
%pip install langfuse openai langchain_openai langchain --upgrade
```


```python
import os

# Get keys for your project from the project settings page: https://cloud.langfuse.com
os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-..." 
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-..." 
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region

# Your openai key
os.environ["OPENAI_API_KEY"] = "sk-proj-..."
```

## Imports


```python
import random
from operator import itemgetter
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema import StrOutputParser
from langfuse import observe
```


```python
from langfuse import observe, get_client
langfuse = get_client()

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
from langfuse.langchain import CallbackHandler

@observe()
def summarize_rap_langchain(rap):

    # Initialize the Langfuse handler
    langfuse_handler = CallbackHandler()

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

  langfuse.update_current_trace(
     metadata={"topic":topic},
     tags=["Launch Week 1"]
  )

  messages = [
      {"role": "system", "content": "We are all rap artist. When it is our turn, we drop a fresh line."},
      {"role": "user", "content": f"Kick it off, today's topic is {topic}, here's the mic..."}
  ]

  for turn in range(turns):
      completion = openai.chat.completions.create(
        model="gpt-4o",
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

    Topic: artificial general intelligence
    
    Rap 0: I'm kickin' it with AGI, the future's in my sights,  
    Machines getting smarter, like they got new insights,  
    Beyond narrow AI, it's a brand new domain,  
    Computers thinkin' freely, sharpenin' their brain.  
    
    Rap 1: Flippin' through algorithms, a digital symphony,  
    These code lines are flowin', create new epiphanies,  
    Boundless like the universe, we're breakin' every mold,  
    With AGI in the lab, we're changin' stories untold.  
    
    Rap 2: Pixels turn to poetry with intelligence so bold,  
    Machines learnin' feelings, understanding what’s unsaid,  
    They sift through data waves, pickin' up the threads,  
    Craftin' neural pathways where human thoughts are spread.  
    
    Rap 3: Mathematics in motion, like a symphony of thought,  
    Explorin' every crevice, solutions we sought,  
    From zeroes and ones to infinite potential,  
    In the realm of AGI, we're only experimental.  
    
    Summary: The rap is about artificial general intelligence (AGI) and how it is changing the future. The artists discuss the capabilities of machines becoming smarter and thinking freely, breaking boundaries and creating new epiphanies. They describe AGI as creating new possibilities and understanding human thoughts, with infinite potential and still in an experimental stage.

