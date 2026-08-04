---
title: "Cookbook LlamaIndex Integration"
description: Example cookbook for the LlamaIndex Langfuse integration.
category: Integrations
---

# Cookbook LlamaIndex Integration

This is a simple cookbook that demonstrates how to trace a LlamaIndex application with Langfuse via the [LlamaIndex Langfuse integration](https://langfuse.com/integrations/frameworks/llamaindex). It uses a very simple Index and Query together with the [OpenInference LlamaIndex instrumentation](https://docs.arize.com/phoenix/tracing/integrations-tracing/llamaindex), which automatically exports OpenTelemetry (OTel) spans to Langfuse.

**Any feedback?** Let us know on Discord or GitHub. We'd love to hear your thoughts.

## Setup

Make sure you have `llama-index`, `langfuse`, and `openinference-instrumentation-llama-index` installed.


```python
%pip install llama-index langfuse openinference-instrumentation-llama-index --upgrade
```

Set your Langfuse API keys as environment variables. Get your API keys from the [Langfuse project settings](https://cloud.langfuse.com). This example uses OpenAI for embeddings and chat completions, so you also need to set your OpenAI key.


```python
import os

# Get keys for your project from the project settings page: https://cloud.langfuse.com

os.environ.setdefault("LANGFUSE_PUBLIC_KEY", "pk-lf-...");
os.environ.setdefault("LANGFUSE_SECRET_KEY", "sk-lf-...");
os.environ.setdefault("LANGFUSE_BASE_URL", "https://cloud.langfuse.com"); # 🇪🇺 EU region
# Other Langfuse data regions include 🇺🇸 US: https://us.cloud.langfuse.com, 🇯🇵 Japan: https://jp.cloud.langfuse.com and ⚕️ HIPAA: https://hipaa.cloud.langfuse.com

# Your OpenAI key
os.environ.setdefault("OPENAI_API_KEY", "sk-proj-...");
```

With the environment variables set, we can initialize the Langfuse client and register the [OpenInference LlamaIndex instrumentation](https://docs.arize.com/phoenix/tracing/integrations-tracing/llamaindex). This third-party instrumentation automatically captures LlamaIndex operations and exports OpenTelemetry (OTel) spans to Langfuse.


```python
from langfuse import get_client
from openinference.instrumentation.llama_index import LlamaIndexInstrumentor

langfuse = get_client()

# Verify connection
if langfuse.auth_check():
    print("Langfuse client is authenticated and ready!")
else:
    print("Authentication failed. Please check your credentials and host.")

# Initialize LlamaIndex instrumentation
LlamaIndexInstrumentor().instrument()
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
# As we want to immediately see the result in Langfuse, we flush the Langfuse client
langfuse.flush()
```

Done! ✨ You see traces of your index and query in your Langfuse project.

![Example Trace in Langfuse](https://langfuse.com/images/cookbook/integration_llama-index/llama-index-example-trace.png)

[Example trace in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/12ea412956f99347b0503c1144acd0ec?timestamp=2025-06-05T15:45:52.971Z&display=details)


## Interested in more advanced features?

See the full [integration docs](https://langfuse.com/integrations/frameworks/llamaindex) to learn more about advanced features and how to use them:

- Interoperability with Langfuse Python SDK and other integrations
- Add custom metadata and attributes to the traces
