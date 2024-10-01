---
description: Cookbook with examples of the Langfuse Integration for LlamaIndex (Python).
category: Integrations
---

# Cookbook: LlamaIndex Integration

This is a cookbook with examples of the Langfuse Integration for LlamaIndex (Python).

Follow the [integration guide](https://langfuse.com/docs/integrations/llama-index/get-started) to add this integration to your LlamaIndex project. Note that the integration does not support LlamaIndex.TS yet. If you are interested in an integration with LlamaIndex.TS, add your upvote/comments to this [issue](https://github.com/orgs/langfuse/discussions/1291).

## Setup


```python
%pip install langfuse llama_index llama-index-callbacks-langfuse --upgrade
```

Initialize the Langfuse client with your API keys from the project settings in the Langfuse UI and add them to your environment.


```python
import os

# get keys for your project from https://cloud.langfuse.com
os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-***"
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-***"
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # for EU data region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # for US data region

# your openai key
os.environ["OPENAI_API_KEY"] = "***"
```

At the root of your LlamaIndex application, you need to register Langfuse's `LlamaIndexCallbackHandler` in the LlamaIndex `Settings.callback_manager`. There are two ways to configure the `LlamaIndexCallbackHandler`, (1) via environment variables or (2) via constructor arguments. Here we will use the former method. For the latter method refer to the [docs](https://langfuse.com/docs/integrations/llama-index/get-started).


```python
from llama_index.core import Settings
from llama_index.core.callbacks import CallbackManager
from langfuse.llama_index import LlamaIndexCallbackHandler

langfuse_callback_handler = LlamaIndexCallbackHandler() # get langfuse's llamaindex callback handler
Settings.callback_manager = CallbackManager([langfuse_callback_handler]) # register callback handler in settings
```

## Examples

### SimpleQA

Simple QA chat bot using an OpenAI model and a prompt template with LlamaIndex's `chat_engine`.

todo: add screenshot (https://cloud.langfuse.com/project/clr4qu8qv0000yu4ja339x02u/traces/3f244ae8-dc26-4ecb-98b5-94a48535e76e)


```python
from llama_index.core.chat_engine import SimpleChatEngine

prompt = (
    "You are a helpful chat bot. Context information can be found below.\n"
    "---------------------\n"
    "Langfuse is an open source LLM engineering platform to help teams collaboratively debug, "
    "analyze and iterate on their LLM Applications."
    "---------------------\n"
    "Given the context information and no prior knowledge, "
    "answer the question of the user"
)

chat_engine = SimpleChatEngine.from_defaults(system_prompt=prompt)
response = chat_engine.chat(
    "What is Langfuse?"
)
```

### RetrievalQA

Simple RAG QA application using an OpenAI model and `VectorStoreIndex` to create an `OpenAIAgent` able to answer question using the context stored in the vector store.

todo: add screenshot (https://cloud.langfuse.com/project/clr4qu8qv0000yu4ja339x02u/traces/cf60e4a4-9cd3-4193-99a1-f19355752b37)


```python
from llama_index.core import Document
from llama_index.core import VectorStoreIndex

city_info = {
    "Toronto": "Toronto is the largest city in Canada and has a diverse population. It's known for its many green spaces.",
    "Seattle": "Seattle, located in the Pacific Northwest, is surrounded by water, mountains, and evergreen forests.",
    "Chicago": "Chicago is known for its bold architecture and has a skyline punctuated by skyscrapers.",
    "Boston": "Boston is one of the oldest municipalities in the United States and is known for its rich history.",
    "Houston": "Houston is the most populous city in Texas and is famous for its space research and energy industry."
}

city_docs = [Document(text=info, metadata={"city": city}) for city, info in city_info.items()]

# Create an index from city_docs
index = VectorStoreIndex.from_documents(city_docs)
```


```python
from llama_index.agent.openai import OpenAIAgent
from llama_index.core.tools import QueryEngineTool, ToolMetadata

# define a query engine tool for the index with metadata
query_engine = index.as_query_engine()
tool_metadata = ToolMetadata(name="CityInfoTool", description="Tool for querying city information.")
query_engine_tool = QueryEngineTool(query_engine=query_engine, metadata=tool_metadata)

agent = OpenAIAgent.from_tools([query_engine_tool], verbose=True)
```


```python
# example query about a specific city
query = "What is known about the city of Boston?"
response = agent.chat(query)
```

    Added user message to memory: What is known about the city of Boston?
    === Calling Function ===
    Calling function: CityInfoTool with args: {"input":"Boston"}
    Got output: Boston is one of the oldest municipalities in the United States and is known for its rich history.
    ========================
    


### Agent with tools

Sample application using an two `FunctionTools`, one tool allowing to add number and one useless dummy tool, to create an `OpenAIAgent` able to answer queries by selecting the relevant tool.

todo: add screenshot (https://cloud.langfuse.com/project/clr4qu8qv0000yu4ja339x02u/traces/4c70c620-1a0e-4257-88a6-3088f818597d)


```python
from llama_index.core.tools import FunctionTool

def add(a: int, b: int) -> int:
    """Add two integers and returns the result."""
    return a + b

add_tool = FunctionTool.from_defaults(fn=add)

def useless_tool() -> str:
    """A tool that returns a fixed string."""
    return "This is a useless output."

useless_tool = FunctionTool.from_defaults(fn=useless_tool)
```


```python
from llama_index.agent.openai import OpenAIAgent

# create an OpenAIAgent with custom tools
agent = OpenAIAgent.from_tools([useless_tool, add_tool], verbose=True)
```


```python
response = agent.chat("What is 5 + 2?", tool_choice="auto")
```

    Added user message to memory: What is 5 + 2?
    === Calling Function ===
    Calling function: add with args: {"a":5,"b":2}
    Got output: 7
    ========================
    


## Adding scores to traces
To add [scores](/docs/scores) to traces created with the Langchain integration, access the traceId via `langfuse_handler.get_trace_id()`

todo: add screenshot (https://cloud.langfuse.com/project/clr4qu8qv0000yu4ja339x02u/traces/4c70c620-1a0e-4257-88a6-3088f818597d)


```python
from langfuse import Langfuse

# Trace langchain run via the Langfuse CallbackHandler as shown above

# get id of the last created trace
trace_id = langfuse_callback_handler.get_trace_id()

# add score, e.g. via the Python SDK
langfuse = Langfuse()
trace = langfuse.score(
    trace_id=trace_id,
    name="user-explicit-feedback",
    value=1,
    comment="I like how personalized the response is"
)
```

## Interoperability with Langfuse Python SDK

In Langfuse, we can get a LlamaIndex callback handler by simply calling `langfuse_context.get_current_llama_index_handler()` in the context of a trace or span when using `decorators`.

### How it works


```python
from langfuse.decorators import langfuse_context, observe

# create a trace via Langfuse decorators and get a LlamaIndex Callback handler for it
@observe() # automtically log function as a trace to Langfuse
def main():
    # update trace attributes (e.g, name, session_id, user_id)
    langfuse_context.update_current_trace(
        name="custom-trace",
        session_id="user-1234",
        user_id="session-1234",
    )
    # get the langchain handler for the current trace
    langfuse_context.get_current_llama_index_handler()

    # use the handler to trace LlamaIndex runs ...

main()
```

### Example

We will run a `RetrievalQA` agent as seen before, to nest multiple two questions on a set of books in one trace.

```
TRACE: book-recommendation-analysis
|
|-- SPAN: genre_analysis
|   |
|   |-- SPAN: crete_genre_index
|   |
|   |-- SPAN: query_for_genre
|
|-- SPAN: author_analysis
|   |
|   |-- SPAN: crete_author_index
|   |
|   |-- SPAN: query_for_author
```


```python
from langfuse.decorators import langfuse_context, observe
from llama_index.core import Settings, Document, VectorStoreIndex
from llama_index.core.callbacks import CallbackManager
from llama_index.agent.openai import OpenAIAgent
from llama_index.core.tools import QueryEngineTool, ToolMetadata

# Sample book data
book_data = {
    "genres": {
        "Fantasy": ["Harry Potter and the Sorcerer's Stone", "The Hobbit", "A Game of Thrones"],
        "Science Fiction": ["Dune", "The Martian", "Neuromancer"],
        "Mystery": ["The Girl with the Dragon Tattoo", "Gone Girl", "The Da Vinci Code"]
    },
    "authors": {
        "J.K. Rowling": ["Harry Potter and the Sorcerer's Stone", "Harry Potter and the Chamber of Secrets"],
        "George R.R. Martin": ["A Game of Thrones", "A Clash of Kings"],
        "Agatha Christie": ["Murder on the Orient Express", "And Then There Were None"]
    }
}

@observe() # automtically log function as a trace to Langfuse
def main_recommendation_system():
    # Set callback manager for LlamaIndex, will apply to all LlamaIndex executions in this function
    langfuse_handler = langfuse_context.get_current_llama_index_handler()
    Settings.callback_manager = CallbackManager([langfuse_handler])

    genre_analysis()
    author_analysis()

    langfuse_context.update_current_trace(
        name="book-recommendation-analysis",
        session_id="session-bookrec",
        user_id="user-3"
    )

@observe() # automtically log function as a span to Langfuse
def genre_analysis():
    # Set callback manager for LlamaIndex, will apply to all LlamaIndex executions in this function
    langfuse_handler = langfuse_context.get_current_llama_index_handler()
    Settings.callback_manager = CallbackManager([langfuse_handler])

    genre_index = create_genre_index()
    query_for_genre(genre_index, "Fantasy")

@observe() # automtically log function as a sub-span to Langfuse
def create_genre_index():
    # Set callback manager for LlamaIndex, will apply to all LlamaIndex executions in this function
    langfuse_handler = langfuse_context.get_current_llama_index_handler()
    Settings.callback_manager = CallbackManager([langfuse_handler])

    genre_docs = [Document(text=", ".join(titles), metadata={"genre": genre})
                  for genre, titles in book_data["genres"].items()]
    return VectorStoreIndex.from_documents(genre_docs)

@observe() # automtically log function as a sub-span to Langfuse
def query_for_genre(index, genre):
    # Set callback manager for LlamaIndex, will apply to all LlamaIndex executions in this function
    langfuse_handler = langfuse_context.get_current_llama_index_handler()
    Settings.callback_manager = CallbackManager([langfuse_handler])

    query_engine = index.as_query_engine()
    tool_metadata = ToolMetadata(name="GenreTool", description="Tool for querying book genres.")
    query_engine_tool = QueryEngineTool(query_engine=query_engine, metadata=tool_metadata)

    agent = OpenAIAgent.from_tools([query_engine_tool], verbose=True)
    query = f"What books are in the {genre} genre?"
    response = agent.chat(query)

@observe() # automtically log function as a span to Langfuse
def author_analysis():
    # Set callback manager for LlamaIndex, will apply to all LlamaIndex executions in this function
    langfuse_handler = langfuse_context.get_current_llama_index_handler()
    Settings.callback_manager = CallbackManager([langfuse_handler])

    author_index = create_author_index()
    query_for_author(author_index, "J.K. Rowling")

@observe() # automtically log function as a sub-span to Langfuse
def create_author_index():
    # Set callback manager for LlamaIndex, will apply to all LlamaIndex executions in this function
    langfuse_handler = langfuse_context.get_current_llama_index_handler()
    Settings.callback_manager = CallbackManager([langfuse_handler])

    author_docs = [Document(text=", ".join(titles), metadata={"author": author})
                   for author, titles in book_data["authors"].items()]
    return VectorStoreIndex.from_documents(author_docs)

@observe() # automtically log function as a sub-span to Langfuse
def query_for_author(index, author_name):
    # Set callback manager for LlamaIndex, will apply to all LlamaIndex executions in this function
    langfuse_handler = langfuse_context.get_current_llama_index_handler()
    Settings.callback_manager = CallbackManager([langfuse_handler])

    query_engine = index.as_query_engine()
    tool_metadata = ToolMetadata(name="AuthorTool", description="Tool for querying book authors.")
    query_engine_tool = QueryEngineTool(query_engine=query_engine, metadata=tool_metadata)

    agent = OpenAIAgent.from_tools([query_engine_tool], verbose=True)
    query = f"What books has {author_name} written?"
    response = agent.chat(query)

main_recommendation_system()
```

View it in Langfuse

todo: update screenshot (https://cloud.langfuse.com/project/clr4qu8qv0000yu4ja339x02u/traces/225508bf-ec84-4c87-b881-0e539081bc5f)

![Trace of Nested Langchain Runs in Langfuse](https://langfuse.com/images/docs/langchain_python_trace_interoperability.png)
