---
description: Langchain users can integrated with Langfuse in seconds using the integration
---

# Langchain integration (Python)

- [View as notebook on GitHub](https://github.com/langfuse/langfuse-docs/blob/main/src/ipynb/langfuse_docs_langchain_integration_python.ipynb)
- [Open as notebook in Google Colab](http://colab.research.google.com/github/langfuse/langfuse-docs/blob/main/src/ipynb/langfuse_docs_langchain_integration_python.ipynb)

Langfuse integrates with Langchain using the [Langchain Callbacks](https://python.langchain.com/docs/modules/callbacks/). Thereby, the Langfuse SDK automatically creates a nested trace for the abstractions offered by Langchain.

Add the handler as a callback when running your Langchain model/chain/agent:

```python /callbacks=[handler]/
# Initialize Langfuse handler
from langfuse.callback import CallbackHandler
handler = CallbackHandler(PUBLIC_KEY, SECRET_KEY)

# Setup Langchain
from langchain.chains import LLMChain
...
chain = LLMChain(llm=llm, prompt=prompt)

# Add Langfuse handler as callback
chain.run(input="<user_input", callbacks=[handler])
```

---
 **_NOTE:_**
When integrating callbacks, there are two main ways:
- *Constructor Callbacks*: Set when initializing an object, like LLMChain(callbacks=[handler]). This approach will use the callback for every call made on that specific object. However, it won't apply to its child objects, making it limited in scope.
- *Request Callbacks*: Defined when issuing a request, like chain.run(input, callbacks=[handler]). This not only uses the callback for that specific request but also for any subsequent sub-requests it triggers.

For comprehensive data capture across objects, it's advised to use the request-based approach, as demonstrated above. Refer to the Langchain callbacks documentation for more details.

---

The Langfuse `CallbackHandler` tracks the following actions when using Langchain:

- Chains: `on_chain_start`, `on_chain_end`. `on_chain_error`
- Agents: `on_agent_start`, `on_agent_action`, `on_agent_finish`, `on_agent_end`
- Tools: `on_tool_start`, `on_tool_end`, `on_tool_error`
- Retriever: `on_retriever_start`, `on_retriever_end`
- ChatModel: `on_chat_model_start`,
- LLM: `on_llm_start`, `on_llm_end`, `on_llm_error`

Missing some useful information/context in Langfuse? Join the [Discord](/discord) or share your feedback directly with us: feedback@langfuse.com

## Notebook Setup

### 1. Initializing the Langfuse Callback handler

The Langfuse SDKs are hosted on the pypi index.


```python
%pip install langfuse
```

Initialize the client with api keys and optionally your environment. In the example we are using the cloud environment which is also the default.


```python
ENV_HOST = "https://cloud.langfuse.com"
ENV_SECRET_KEY = "sk-lf-..."
ENV_PUBLIC_KEY = "pk-lf-..."
```


```python
from langfuse.callback import CallbackHandler

handler = CallbackHandler(ENV_PUBLIC_KEY, ENV_SECRET_KEY, ENV_HOST)
```

### 2. Langchain


```python
import os
os.environ["OPENAI_API_KEY"] = "sk-..."
```


```python
%pip install langchain openai
```


```python
# further imports
from langchain.llms import OpenAI
from langchain.chains import LLMChain, SimpleSequentialChain
from langchain.prompts import PromptTemplate
from langfuse.callback import CallbackHandler

```

## Examples

### 1. Sequential Chain

![Trace of Langchain Sequential Chain in Langfuse](https://langfuse.com/images/docs/langchain_chain.jpg)


```python
llm = OpenAI(openai_api_key=os.environ.get("OPENAI_API_KEY"))
template = """You are a playwright. Given the title of play, it is your job to write a synopsis for that title.
    Title: {title}
    Playwright: This is a synopsis for the above play:"""

prompt_template = PromptTemplate(input_variables=["title"], template=template)
synopsis_chain = LLMChain(llm=llm, prompt=prompt_template)

template = """You are a play critic from the New York Times. Given the synopsis of play, it is your job to write a review for that play.

    Play Synopsis:
    {synopsis}
    Review from a New York Times play critic of the above play:"""
prompt_template = PromptTemplate(input_variables=["synopsis"], template=template)
review_chain = LLMChain(llm=llm, prompt=prompt_template)

overall_chain = SimpleSequentialChain(
    chains=[synopsis_chain, review_chain],
)
review = overall_chain.run("Tragedy at sunset on the beach", callbacks=[handler]) # add the handler to the run method
handler.langfuse.flush()
```

### 2. QA Retrieval

![Trace of Langchain QA Retrieval in Langfuse](https://langfuse.com/images/docs/langchain_qa_retrieval.jpg)


```python
import os
os.environ["SERPAPI_API_KEY"] = '...'
```


```python
%pip install unstructured chromadb tiktoken google-search-results
```


```python
from langchain.document_loaders import UnstructuredURLLoader
from langchain.vectorstores import Chroma
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.chains import RetrievalQA

handler = CallbackHandler(ENV_PUBLIC_KEY, ENV_SECRET_KEY, ENV_HOST)
urls = [
    "https://raw.githubusercontent.com/langfuse/langfuse-docs/main/public/state_of_the_union.txt",
]

loader = UnstructuredURLLoader(urls=urls)

llm = OpenAI(openai_api_key=os.environ.get("OPENAI_API_KEY"))

documents = loader.load()
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
texts = text_splitter.split_documents(documents)

embeddings = OpenAIEmbeddings(openai_api_key=os.environ.get("OPENAI_API_KEY"))
docsearch = Chroma.from_documents(texts, embeddings)

query = "What did the president say about Ketanji Brown Jackson"

chain = RetrievalQA.from_chain_type(
    llm,
    retriever=docsearch.as_retriever(search_kwargs={"k": 1}),
)

result = chain.run(query, callbacks=[handler])

print(result)

handler.langfuse.flush()

```



![Trace of Langchain Agent in Langfuse](https://langfuse.com/images/docs/langchain_agent.jpg)


```python
from langchain.agents import AgentType, initialize_agent, load_tools


handler = CallbackHandler(ENV_PUBLIC_KEY, ENV_SECRET_KEY, ENV_HOST)

llm = OpenAI(openai_api_key=os.environ.get("OPENAI_API_KEY"))

tools = load_tools(["serpapi", "llm-math"], llm=llm)

agent = initialize_agent(tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True)

result = agent.run("Who is Leo DiCaprio's girlfriend? What is her current age raised to the 0.43 power?", callbacks=[handler])

handler.langfuse.flush()

print("output variable: ", result)
```

## Adding scores

To add [scores](/docs/scores) to traces created with the Langchain integration, access the traceId via `handler.get_trace_id()`


### Example


```python
from langfuse import Langfuse
from langfuse.model import CreateScore
from langfuse.model import CreateScoreRequest


# Trace langchain run via the Langfuse CallbackHandler as shown above

# Get id of created trace
traceId = handler.get_trace_id()

# Add score, e.g. via the Python SDK
langfuse = Langfuse(ENV_PUBLIC_KEY, ENV_SECRET_KEY, ENV_HOST)
trace = langfuse.score(
    CreateScoreRequest(
        traceId=traceId,
        name="user-explicit-feedback",
        value=1,
        comment="I like how personalized the response is"
    )
)
```

## Adding trace as context to a Langchain handler

It is also possible to generate a Langchain handler based on a trace. This can help to add context such as a specific `id` or `metadata`. All the Langchain observations will be collected on that trace.

To do that, we first need to initialise the [Python SDK](/docs/integrations/sdk/python), create a `trace`, and finally create the handler.


```python
%pip install uuid
```


```python
import uuid
import os

from langfuse.client import Langfuse
from langfuse.model import CreateTrace
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

langfuse = Langfuse(ENV_PUBLIC_KEY, ENV_SECRET_KEY, ENV_HOST)

trace_id = str(uuid.uuid4())
trace = langfuse.trace(CreateTrace(id=trace_id))

handler = trace.getNewHandler()

llm = OpenAI(openai_api_key=os.environ.get("OPENAI_API_KEY"))
template = """You are a playwright. Given the title of play, it is your job to write a synopsis for that title.
    Title: {title}
    Playwright: This is a synopsis for the above play:"""

prompt_template = PromptTemplate(input_variables=["title"], template=template)
synopsis_chain = LLMChain(llm=llm, prompt=prompt_template)

synopsis_chain.run("Tragedy at sunset on the beach", callbacks=[handler])

langfuse.flush()
```
