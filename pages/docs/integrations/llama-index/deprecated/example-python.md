---
description: Example cookbook for the LlamaIndex Langfuse integration.
category: Integrations
---

# Cookbook LlamaIndex Integration

This is a simple cookbook that demonstrates how to use the [LlamaIndex Langfuse integration](https://langfuse.com/docs/integrations/llama-index/get-started). It uses a very simple Index and Query. We've recorded a short [video](https://langfuse.com/guides/videos/llama-index) to show you how to use this cookbook.

**Any feedback?** Let us know on Discord or GitHub. This is a new integration, and we'd love to hear your thoughts.

## Setup

Make sure you have both `llama-index` and `langfuse` installed.


```python
%pip install llama-index langfuse --upgrade
```

Initialize the integration. Get your API keys from the [Langfuse project settings](https://cloud.langfuse.com).


```python
from llama_index.core import Settings
from llama_index.core.callbacks import CallbackManager
from langfuse.llama_index import LlamaIndexCallbackHandler
 
langfuse_callback_handler = LlamaIndexCallbackHandler(
    public_key="pk-lf-...",
    secret_key="sk-lf-...",
    host="https://cloud.langfuse.com"
)
Settings.callback_manager = CallbackManager([langfuse_callback_handler])
```

This example uses OpenAI for embeddings and chat completions.


```python
import os

os.environ["OPENAI_API_KEY"] = ""
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


```python
# Chat
response = index.as_chat_engine().chat("What did he do growing up?")
print(response)
```

## Explore traces in Langfuse


```python
# As we want to immediately see result in Langfuse, we need to flush the callback handler
langfuse_callback_handler.flush()
```

Done! ✨ You see traces of your index and query in your Langfuse project.

Example traces (public links):
1. [Query](https://cloud.langfuse.com/project/cltipxbkn0000cdd7sbfbpovm/traces/f2e7f721-0940-4139-9b3a-e5cc9b0cb2d3)
2. [Query (chat)](https://cloud.langfuse.com/project/cltipxbkn0000cdd7sbfbpovm/traces/89c62a4d-e992-4923-a6b7-e2f27ae4cff3)
3. [Session](https://cloud.langfuse.com/project/cltipxbkn0000cdd7sbfbpovm/sessions/notebook-session-2)

Trace in Langfuse:

![Langfuse Traces](https://static.langfuse.com/llamaindex-langfuse-docs.gif)


## Interested in more advanced features?

See the full [integration docs](https://langfuse.com/docs/integrations/llama-index/get-started) to learn more about advanced features and how to use them:

- Interoperability with Langfuse Python SDK and other integrations
- Add custom metadata and attributes to the traces
