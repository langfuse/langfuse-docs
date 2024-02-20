---
description: Open source observability for LlamaIndex via the native integration. Automatically capture detailed traces and metrics for every request of your RAG application.
---

# LlamaIndex Integration

**LlamaIndex** ([GitHub](https://github.com/run-llama/llama_index)) is an advanced "data framework" tailored for augmenting Large Language Models (LLMs) with private data. It streamlines the integration of diverse data sources and formats (APIs, PDFs, docs, SQL, etc.) through versatile data connectors and structures data into indices and graphs for LLM compatibility. The platform offers a sophisticated retrieval/query interface for enriching LLM inputs with context-specific outputs. Designed for both beginners and experts, LlamaIndex provides a user-friendly high-level API for easy data ingestion and querying, alongside customizable lower-level APIs for detailed module adaptation. 

Langfuse offers a simple integration for automatic capture of traces and metrics generated in LlamaIndex applications.

## Quickstart

Make sure you have both `llama-index` and `langfuse` installed.


```python
# Install llama-index and langfuse
pip install llama-index
pip install langfuse 
```

At the root of your LlamaIndex application, register Langfuse's `LlamaIndexCallbackHandler` in the LlamaIndex `Settings.callback_manager`. When instantiating `LlamaIndexCallbackHandler`, make sure that your environment variables for 
`LANGFUSE_PUBLIC_KEY`, `LANGFUSE_SECRET_KEY`, and `LANGFUSE_HOST` are set correctly as shown in your project settings in the Langfuse UI. Alternatively, you can also pass `public_key`, `secret_key` and `host` directly to `LlamaIndexCallbackHandler`. Make sure not to commit any keys to your repository.


```python
# main.py
from llama_index.core import Settings
from llama_index.core.callbacks import CallbackManager

from langfuse.callback import LlamaIndexCallbackHandler

langfuse_callback_handler = LlamaIndexCallbackHandler()
Settings.callback_manager = CallbackManager([langfuse_callback_handler])
```

Done! ✨ Traces and metrics from your LlamaIndex application are now automatically tracked in Langfuse. If you construct a new index or query an LLM with your documents in context, your traces and metrics are immediately visible in the Langfuse UI. Below an example expanding on (LlamaIndex's quick start guide)[https://docs.llamaindex.ai/en/stable/getting_started/starter_example.html].


```python
# Example index construction + LLM query
from llama_index.core import (
    SimpleDirectoryReader,
    VectorStoreIndex
)

# Make sure that LlamaIndexCallbackHandler is initialized in Settings as shown above

# Load documents and create an index
documents = SimpleDirectoryReader("data").load_data()
index = VectorStoreIndex.from_documents(documents) 

# Query an LLM with context from the index
response = index.as_query_engine().query("What did the author do growing up?")
print(response)

# Flush events to Langfuse before application exits
langfuse_callback_handler.flush()
```

Now head over to the Langfuse UI and inspect the traces generated from these executions.

**Important** Before shutting down your application and whenever else you see fit in you application flow, flush collected events from your application to Langfuse to not drop any events queued for reporting.


```python
# Flush events to Langfuse before application exits
langfuse_callback_handler.flush()
```
