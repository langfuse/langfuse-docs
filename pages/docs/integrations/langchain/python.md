---
description: Open source observability for your Langchain (Python) application. Automatically captures rich traces and metrics.
---

# Langchain integration (Python)

Langfuse integrates with Langchain using [Langchain Callbacks](https://python.langchain.com/docs/modules/callbacks/). Thereby, the Langfuse SDK automatically creates a nested trace for the abstractions offered by Langchain.

Simply add the Langfuse handler as a callback when running your Langchain model/chain/agent to start capturing traces from your executions:

```python
# Initialize Langfuse handler
from langfuse.callback import CallbackHandler

langfuse_handler = CallbackHandler(
    public_key=LANGFUSE_PUBLIC_KEY, secret_key=LANGFUSE_SECRET_KEY
)

# Setup Langchain
from langchain.chains import LLMChain
...
chain = LLMChain(llm=llm, prompt=prompt, callbacks=[langfuse_handler])

# Add Langfuse handler as callback
chain.run(input="<user_input>", callbacks=[langfuse_handler])
```

[Langchain expression language](https://python.langchain.com/docs/expression_language/) (LCEL)

```python
chain = prompt | llm
chain.invoke(input, config={"callbacks": [langfuse_handler]})
```

---

The Langfuse `CallbackHandler` tracks the following actions when using Langchain:

- Chains: `on_chain_start`, `on_chain_end`. `on_chain_error`
- Agents: `on_agent_start`, `on_agent_action`, `on_agent_finish`, `on_agent_end`
- Tools: `on_tool_start`, `on_tool_end`, `on_tool_error`
- Retriever: `on_retriever_start`, `on_retriever_end`
- ChatModel: `on_chat_model_start`,
- LLM: `on_llm_start`, `on_llm_end`, `on_llm_error`

Missing some useful information/context in Langfuse? Join the [Discord](/discord) or share your feedback directly with us: feedback@langfuse.com

## Example Cookbook

<NotebookBanner src="cookbook/integration_langchain.ipynb" />

### 1. Initializing the Langfuse Callback handler


```python
%pip install langfuse langchain openai --upgrade
```

Initialize the Langfuse client with your API keys from the project settings in the Langfuse UI and add them to your environment.

Alternatively, you may also pass them as arguments to the `CallbackHandler` constructor, but make sure not to commit any keys to your repository.


```python
import os

# get keys for your project from https://cloud.langfuse.com
os.environ["LANGFUSE_PUBLIC_KEY"] = ""
os.environ["LANGFUSE_SECRET_KEY"] = ""
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # for EU data region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # for US data region

# your openai key
os.environ["OPENAI_API_KEY"] = ""
```


```python
from langfuse.callback import CallbackHandler

langfuse_handler = CallbackHandler()
```


```python
# Tests the SDK connection with the server
langfuse_handler.auth_check()
```

### 2. Langchain


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
llm = OpenAI()
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
review = overall_chain.run("Tragedy at sunset on the beach", callbacks=[langfuse_handler]) # add the handler to the run method
langfuse_handler.flush()
```

### 2. Sequential Chain in Langchain Expression Language (LCEL)

![Trace of Langchain LCEL](https://langfuse.com/images/docs/langchain_LCEL.png)


```python
from operator import itemgetter
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema import StrOutputParser

langfuse_handler = CallbackHandler()

prompt1 = ChatPromptTemplate.from_template("what is the city {person} is from?")
prompt2 = ChatPromptTemplate.from_template(
    "what country is the city {city} in? respond in {language}"
)

model = ChatOpenAI()

chain1 = prompt1 | model | StrOutputParser()

chain2 = (
    {"city": chain1, "language": itemgetter("language")}
    | prompt2
    | model
    | StrOutputParser()
)

chain2.invoke({"person": "obama", "language": "spanish"}, config={"callbacks":[langfuse_handler]})
langfuse_handler.get_trace_url()
```

### 3. QA Retrieval

![Trace of Langchain QA Retrieval in Langfuse](https://langfuse.com/images/docs/langchain_qa_retrieval.jpg)


```python
import os
os.environ["SERPAPI_API_KEY"] = ''
```


```python
%pip install unstructured chromadb tiktoken google-search-results python-magic --upgrade
```


```python
from langchain.document_loaders import UnstructuredURLLoader
from langchain.vectorstores import Chroma
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.chains import RetrievalQA

langfuse_handler = CallbackHandler()
urls = [
    "https://raw.githubusercontent.com/langfuse/langfuse-docs/main/public/state_of_the_union.txt",
]

loader = UnstructuredURLLoader(urls=urls)

llm = OpenAI()

documents = loader.load()
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
texts = text_splitter.split_documents(documents)

embeddings = OpenAIEmbeddings()
docsearch = Chroma.from_documents(texts, embeddings)

query = "What did the president say about Ketanji Brown Jackson"

chain = RetrievalQA.from_chain_type(
    llm,
    retriever=docsearch.as_retriever(search_kwargs={"k": 1}),
)

result = chain.run(query, callbacks=[langfuse_handler])

print(result)

langfuse_handler.flush()
```



![Trace of Langchain Agent in Langfuse](https://langfuse.com/images/docs/langchain_agent.jpg)


```python
from langchain.agents import AgentType, initialize_agent, load_tools


langfuse_handler = CallbackHandler()

llm = OpenAI()

tools = load_tools(["serpapi", "llm-math"], llm=llm)

agent = initialize_agent(tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True)

result = agent.run("Who is Leo DiCaprio's girlfriend? What is her current age raised to the 0.43 power?", callbacks=[langfuse_handler])

langfuse_handler.flush()

print("output variable: ", result)
```

## Adding scores

To add [scores](/docs/scores) to traces created with the Langchain integration, access the traceId via `langfuse_handler.get_trace_id()`

### Example


```python
from langfuse import Langfuse

# Trace langchain run via the Langfuse CallbackHandler as shown above

# Get id of created trace
trace_id = langfuse_handler.get_trace_id()

# Add score, e.g. via the Python SDK
langfuse = Langfuse()
trace = langfuse.score(
    trace_id=trace_id,
    name="user-explicit-feedback",
    value=1,
    comment="I like how personalized the response is"
)
```

## Adding trace as context to a Langchain handler

It is also possible to generate a Langchain handler based on a trace. This can help to add context such as a specific `user_id`, `name` or `metadata`. All the Langchain observations will be collected on that trace.

To do that, we first need to initialize the [Python SDK](/docs/sdk/python), create a `trace`, and finally create the handler.


```python
import uuid
import os

from langfuse import Langfuse
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

langfuse = Langfuse()

trace = langfuse.trace(name="synopsis-application", user_id="user-1234")

langfuse_handler = trace.get_langchain_handler()

llm = OpenAI()
template = """You are a playwright. Given the title of play, it is your job to write a synopsis for that title.
    Title: {title}
    Playwright: This is a synopsis for the above play:"""

prompt_template = PromptTemplate(input_variables=["title"], template=template)
synopsis_chain = LLMChain(llm=llm, prompt=prompt_template)

synopsis_chain.run("Tragedy at sunset on the beach", callbacks=[langfuse_handler])

langfuse.flush() # This will also flush events added by 'langfuse_handler'
```

## Configuring multiple runs per trace

Sometimes it is required to have multiple Langchain runs in one 'Trace'. For this, we provide the 'setNextSpan' function to configure the 'id' of the parent span of the next run. This can be helpful to create scores for the different runs.

The example below will result in the following trace:

```
TRACE (id: trace_id)
|
|-- SPAN: LLMChain (id: generated by Langfuse)
|   |
|   |-- GENERATION: OpenAI (id: generated by Langfuse)
|
|-- SPAN: LLMChain (id: generated by 'next_span_id')
|   |
|   |-- GENERATION: OpenAI (id: generated by Langfuse)
```


```python
import uuid
import os

from langfuse import Langfuse
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

langfuse = Langfuse()

trace_id = str(uuid.uuid4())
trace = langfuse.trace(id=trace_id)

langfuse_handler = trace.get_langchain_handler()

llm = OpenAI()
template = """You are a playwright. Given the title of play, it is your job to write a synopsis for that title.
    Title: {title}
    Playwright: This is a synopsis for the above play:"""

prompt_template = PromptTemplate(input_variables=["title"], template=template)
synopsis_chain = LLMChain(llm=llm, prompt=prompt_template)

synopsis_chain.run("Tragedy at sunset on the beach", callbacks=[langfuse_handler])

# configure the next span id
next_span_id = str(uuid.uuid4())
langfuse_handler.setNextSpan(next_span_id)

synopsis_chain.run("Comedy at sunset on the beach", callbacks=[langfuse_handler])

langfuse.flush() # This will also flush events added by 'langfuse_handler'
```

## Upgrading from v1.x.x to v2.x.x

The `CallbackHandler` can be used in multiple invocations of a Langchain chain as shown below.

```python
from langfuse.callback import CallbackHandler
langfuse_handler = CallbackHandler(PUBLIC_KEY, SECRET_KEY)

# Setup Langchain
from langchain.chains import LLMChain
...
chain = LLMChain(llm=llm, prompt=prompt, callbacks=[langfuse_handler])

# Add Langfuse handler as callback
chain.run(input="<first_user_input>", callbacks=[langfuse_handler])
chain.run(input="<second_user_input>", callbacks=[langfuse_handler])

```

So far, invoking the chain multiple times would group the observations in one trace.

```bash
TRACE
|
|-- SPAN: Retrieval
|   |
|   |-- SPAN: LLM Chain
|   |   |
|   |   |-- GENERATION: ChatOpenAi
|-- SPAN: Retrieval
|   |
|   |-- SPAN: LLM Chain
|   |   |
|   |   |-- GENERATION: ChatOpenAi
```

We changed this, so that each invocation will end up on its own trace. This allows us to derive the user inputs and outputs to Langchain applications. If you still want to group multiple invocations on one trace, you can use [this](https://langfuse.com/docs/langchain/python#adding-trace-as-context-to-a-langchain-handler) approach.

```bash
TRACE_1
|
|-- SPAN: Retrieval
|   |
|   |-- SPAN: LLM Chain
|   |   |
|   |   |-- GENERATION: ChatOpenAi

TRACE_2
|
|-- SPAN: Retrieval
|   |
|   |-- SPAN: LLM Chain
|   |   |
|   |   |-- GENERATION: ChatOpenAi
```


