---
description: Example cookbook for the experimental LlamaIndex Langfuse integration using the instrumentation module of LlamaIndex.
category: Integrations
---

# Cookbook LlamaIndex Integration (Instrumentation Module)

This is a simple cookbook that demonstrates how to use the [LlamaIndex Langfuse integration](https://langfuse.com/docs/integrations/llama-index/get-started) using the [instrumentation module](https://docs.llamaindex.ai/en/stable/module_guides/observability/instrumentation/) by LlamaIndex (available in llama-index v0.10.20 and later).

**Note: This integration is in beta.** Please report any issues or feedback via [GitHub](/issues).

## Setup

Make sure you have both `llama-index` and `langfuse` installed.


```python
%pip install langfuse llama_index --upgrade
```

Initialize the integration. Get your API keys from the Langfuse project settings. This example uses OpenAI for embeddings and chat completions. You can also use any other model supported by LlamaIndex.


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

Add `LlamaIndexSpanHandler` via the instrumentation module of LlamaIndex:


```python
import llama_index.core.instrumentation as instrument
from langfuse.llama_index import LlamaIndexSpanHandler

langfuse_span_handler = LlamaIndexSpanHandler()
instrument.get_dispatcher().add_span_handler(langfuse_span_handler)
```

## Index


```python
# Example context, thx ChatGPT
from llama_index.core import Document

doc1 = Document(text="""
Maxwell "Max" Silverstein, a lauded movie director, screenwriter, and producer, was born on October 25, 1978, in Boston, Massachusetts. A film enthusiast from a young age, his journey began with home movies shot on a Super 8 camera. His passion led him to the University of Southern California (USC), majoring in Film Production. Eventually, he started his career as an assistant director at Paramount Pictures. Silverstein's directorial debut, “Doors Unseen,” a psychological thriller, earned him recognition at the Sundance Film Festival and marked the beginning of a successful directing career.
""")
doc2 = Document(text="""
Throughout his career, Silverstein has been celebrated for his diverse range of filmography and unique narrative technique. He masterfully blends suspense, human emotion, and subtle humor in his storylines. Among his notable works are "Fleeting Echoes," "Halcyon Dusk," and the Academy Award-winning sci-fi epic, "Event Horizon's Brink." His contribution to cinema revolves around examining human nature, the complexity of relationships, and probing reality and perception. Off-camera, he is a dedicated philanthropist living in Los Angeles with his wife and two children.
""")
```


```python
# Example index construction + LLM query
from llama_index.core import VectorStoreIndex

index = VectorStoreIndex.from_documents([doc1,doc2])
```

## Query


```python
# Query
response = index.as_query_engine().query("What did he do growing up?")
print(response)
```

    He made home movies using a Super 8 camera.
    

Example trace: https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/5c6f2b7f-4ae5-41da-b320-24b493532657


```python
# Chat
response = index.as_chat_engine().chat("What did he do growing up?")
print(response)
```

    He made home movies using a Super 8 camera growing up.
    

Example trace: https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/f63aa1f7-8110-4a18-815c-c02d7131b984

![LlamaIndex Chat Engine Trace in Langfuse (via instrumentation module)](https://langfuse.com/images/cookbook/integration_llama-index_instrumentation_chatengine_trace.png)
