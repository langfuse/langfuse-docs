---
title: Langfuse SDK Performance Test
category: SDKs
---

# Langfuse SDK Performance Test

Langfuse shall have a minimal impact on latency. This is achieved by running almost entirely in the background and by batching all requests to the Langfuse API.

Coverage of this performance test:
- Langfuse SDK: start_observation(), start_as_current_observation(), @observe decorator
- Langchain Integration
- OpenAI Integration
- LlamaIndex Integration

Limitations:
- We test integrations using OpenAI's hosted models, making the experiment less controlled but actual latency of the integrations impact more realistic.
- The timing outputs in this notebook are from an older run on a specific machine and network. Absolute numbers will vary, re-run the notebook to benchmark your own environment.

## Setup


```python
%pip install langfuse --upgrade
```


```python
import os

# Get keys for your project from the project settings page: https://cloud.langfuse.com
os.environ.setdefault("LANGFUSE_PUBLIC_KEY", "pk-lf-...")
os.environ.setdefault("LANGFUSE_SECRET_KEY", "sk-lf-...")
os.environ.setdefault("LANGFUSE_BASE_URL", "https://cloud.langfuse.com") # 🇪🇺 EU region
# Other Langfuse data regions include 🇺🇸 US: https://us.cloud.langfuse.com, 🇯🇵 Japan: https://jp.cloud.langfuse.com and ⚕️ HIPAA: https://hipaa.cloud.langfuse.com

# Your openai key
os.environ.setdefault("OPENAI_API_KEY", "sk-proj-...")
```


```python
from langfuse import get_client

langfuse = get_client()
```


```python
import pandas as pd
import timeit

def time_func(func, runs=100):
    durations = []
    for _ in range(runs):
        start = timeit.default_timer()
        func()
        stop = timeit.default_timer()
        durations.append(stop - start)

    desc = pd.Series(durations).describe()
    desc.index = [f'{name} (sec)' if name != 'count' else name for name in desc.index]
    return desc
```

## Python SDK

`start_observation()`, manually creating and ending a root span


```python
time_func(lambda: langfuse.start_observation(name="perf-span").end())
```

`start_observation(as_type="generation")`, nested as a child observation


```python
root_span = langfuse.start_observation(name="perf-root-span")

time_func(lambda: root_span.start_observation(name="perf-generation", as_type="generation").end())

root_span.end()
```

`start_as_current_observation()`, context manager that sets the active observation


```python
def traced_operation():
    with langfuse.start_as_current_observation(as_type="span", name="perf-span"):
        pass

time_func(traced_operation)
```

`@observe` decorator, automatically capturing timings, inputs and outputs


```python
from langfuse import observe

@observe()
def observed_function():
    return "ok"

time_func(observed_function)
```

## Langchain Integration

Docs: https://langfuse.com/integrations/frameworks/langchain


```python
%pip install langchain langchain-openai --upgrade
```


```python
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema import StrOutputParser

prompt = ChatPromptTemplate.from_template("what is the city {person} is from?")
model = ChatOpenAI(max_tokens=10)
chain = prompt | model | StrOutputParser()
```


```python
from langfuse.langchain import CallbackHandler
langfuse_handler = CallbackHandler()
```

### Benchmark without Langfuse


```python
langchain_stats_no_langfuse = time_func(lambda: chain.invoke({"person":"Paul Graham"}))
langchain_stats_no_langfuse
```




    count         100.000000
    mean (sec)      0.529463
    std (sec)       0.685193
    min (sec)       0.306092
    25% (sec)       0.373373
    50% (sec)       0.407278
    75% (sec)       0.530427
    max (sec)       7.107237
    dtype: float64



### With Langfuse Tracing


```python
langchain_stats_with_langfuse = time_func(lambda: chain.invoke({"person":"Paul Graham"}, {"callbacks":[langfuse_handler]}))
langchain_stats_with_langfuse
```




    count         100.000000
    mean (sec)      0.618286
    std (sec)       0.165149
    min (sec)       0.464992
    25% (sec)       0.518323
    50% (sec)       0.598474
    75% (sec)       0.675420
    max (sec)       1.838614
    dtype: float64



## OpenAI Integration

Docs: https://langfuse.com/integrations/model-providers/openai-py


```python
%pip install langfuse openai --upgrade --quiet
```


```python
import openai
```

### Benchmark without Langfuse


```python
time_func(lambda: openai.chat.completions.create(
  model="gpt-3.5-turbo",
  messages=[
      {"role": "user", "content": "what is the city Paul Graham is from?"}],
  temperature=0,
  max_tokens=10,
))
```




    count         100.000000
    mean (sec)      0.524097
    std (sec)       0.220446
    min (sec)       0.288002
    25% (sec)       0.395479
    50% (sec)       0.507395
    75% (sec)       0.571789
    max (sec)       1.789671
    dtype: float64



### With Langfuse Tracing


```python
from langfuse.openai import openai
```


```python
time_func(lambda: openai.chat.completions.create(
  model="gpt-3.5-turbo",
  messages=[
      {"role": "user", "content": "what is the city Paul Graham is from?"}],
  temperature=0,
  max_tokens=10,
))
```




    count         100.000000
    mean (sec)      0.515243
    std (sec)       0.286902
    min (sec)       0.283431
    25% (sec)       0.378736
    50% (sec)       0.435775
    75% (sec)       0.558746
    max (sec)       2.613779
    dtype: float64



## LlamaIndex Integration

Docs: https://langfuse.com/integrations/frameworks/llamaindex


```python
%pip install llama-index openinference-instrumentation-llama-index --upgrade --quiet
```

Sample documents


```python
from llama_index.core import Document

doc1 = Document(text="""
Maxwell "Max" Silverstein, a lauded movie director, screenwriter, and producer, was born on October 25, 1978, in Boston, Massachusetts. A film enthusiast from a young age, his journey began with home movies shot on a Super 8 camera. His passion led him to the University of Southern California (USC), majoring in Film Production. Eventually, he started his career as an assistant director at Paramount Pictures. Silverstein's directorial debut, “Doors Unseen,” a psychological thriller, earned him recognition at the Sundance Film Festival and marked the beginning of a successful directing career.
""")
doc2 = Document(text="""
Throughout his career, Silverstein has been celebrated for his diverse range of filmography and unique narrative technique. He masterfully blends suspense, human emotion, and subtle humor in his storylines. Among his notable works are "Fleeting Echoes," "Halcyon Dusk," and the Academy Award-winning sci-fi epic, "Event Horizon's Brink." His contribution to cinema revolves around examining human nature, the complexity of relationships, and probing reality and perception. Off-camera, he is a dedicated philanthropist living in Los Angeles with his wife and two children.
""")
```

### Benchmark without Langfuse

Index


```python
# Example index construction + LLM query
from llama_index.core import VectorStoreIndex

time_func(lambda: VectorStoreIndex.from_documents([doc1,doc2]))
```




    count         100.000000
    mean (sec)      0.171673
    std (sec)       0.058332
    min (sec)       0.112696
    25% (sec)       0.136361
    50% (sec)       0.157330
    75% (sec)       0.178455
    max (sec)       0.459417
    dtype: float64



Query


```python
index = VectorStoreIndex.from_documents([doc1,doc2])
time_func(lambda: index.as_query_engine().query("What did he do growing up?"))
```




    count         100.000000
    mean (sec)      0.795817
    std (sec)       0.338263
    min (sec)       0.445060
    25% (sec)       0.614282
    50% (sec)       0.756573
    75% (sec)       0.908411
    max (sec)       3.495263
    dtype: float64



### With Langfuse Tracing


```python
from openinference.instrumentation.llama_index import LlamaIndexInstrumentor

# Initialize LlamaIndex instrumentation
LlamaIndexInstrumentor().instrument()
```

Index


```python
time_func(lambda: VectorStoreIndex.from_documents([doc1,doc2]))
```

Query


```python
index = VectorStoreIndex.from_documents([doc1,doc2])
time_func(lambda: index.as_query_engine().query("What did he do growing up?"))
```
