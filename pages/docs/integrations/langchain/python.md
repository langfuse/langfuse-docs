---
description: Open source observability for your Langchain (Python) application. Automatically captures rich traces and metrics.
---

# Langchain Integration (Python)

Langfuse integrates with Langchain using [Langchain Callbacks](https://python.langchain.com/docs/modules/callbacks/). Thereby, the Langfuse SDK automatically creates a nested trace for the abstractions offered by Langchain.

## Integration

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
chain = LLMChain(llm=llm, prompt=prompt)

# Add Langfuse handler as callback to `run` or `invoke`
chain.run(input="<user_input>", callbacks=[langfuse_handler])
chain.invoke({"input": "<user_input>"}, config={"callbacks": [langfuse_handler]})
```

[Langchain expression language](https://python.langchain.com/docs/expression_language/) (LCEL)

```python
chain = prompt | llm
chain.invoke({"input": "<user_input>"}, config={"callbacks": [langfuse_handler]})
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

### Setup


```python
%pip install langfuse langchain langchain_openai --upgrade
```

Initialize the Langfuse client with your API keys from the project settings in the Langfuse UI and add them to your environment.

Alternatively, you may also pass them as arguments to the `CallbackHandler` constructor, but make sure not to commit any keys to your repository.


```python
import os

# get keys for your project from https://cloud.langfuse.com
os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-*****"
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-*****"
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

### Examples

#### 1. Sequential Chain

![Trace of Langchain Sequential Chain in Langfuse](https://langfuse.com/images/docs/langchain_chain.jpg)


```python
# further imports
from langchain_openai import OpenAI
from langchain.chains import LLMChain, SimpleSequentialChain
from langchain.prompts import PromptTemplate

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

# invoke
review = overall_chain.invoke("Tragedy at sunset on the beach", {"callbacks":[langfuse_handler]}) # add the handler to the run method
# run
review = overall_chain.run("Tragedy at sunset on the beach", callbacks=[langfuse_handler]) # add the handler to the run method
```

#### 2. Sequential Chain in Langchain Expression Language (LCEL)

![Trace of Langchain LCEL](https://langfuse.com/images/docs/langchain_LCEL.png)


```python
from operator import itemgetter
from langchain_openai import ChatOpenAI
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
```

#### 3. RetrievalQA

![Trace of Langchain QA Retrieval in Langfuse](https://langfuse.com/images/docs/langchain_qa_retrieval.jpg)


```python
import os
os.environ["SERPAPI_API_KEY"] = ""
```


```python
%pip install unstructured chromadb tiktoken google-search-results python-magic langchainhub --upgrade
```


```python
from langchain.document_loaders import UnstructuredURLLoader
from langchain.vectorstores import Chroma
from langchain.text_splitter import CharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
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

chain.invoke(query, config={"callbacks":[langfuse_handler]})
```



![Trace of Langchain Agent in Langfuse](https://langfuse.com/images/docs/langchain_agent.jpg)


```python
from langchain.agents import AgentExecutor, load_tools, create_openai_functions_agent
from langchain_openai import ChatOpenAI
from langchain import hub

langfuse_handler = CallbackHandler()

llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)
tools = load_tools(["serpapi"])
prompt = hub.pull("hwchase17/openai-functions-agent")
agent = create_openai_functions_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools)

agent_executor.invoke({"input": "What is Langfuse?"}, config={"callbacks":[langfuse_handler]})
```

### Adding scores

To add [scores](/docs/scores) to traces created with the Langchain integration, access the traceId via `langfuse_handler.get_trace_id()`


```python
from langfuse import Langfuse

# Trace langchain run via the Langfuse CallbackHandler as shown above

# Get id of the last created trace
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

### Interoperability with Langfuse Python SDK

To use all functionalities of Langfuse, use `get_langchain_handler()` on Langfuse tracing nodes (`trace` or `span`). Learn more about Langfuse Tracing [here](https://langfuse.com/docs/tracing).

**Advantages**
- Set custom attributes on trace/span.
- Add additional custom observations to the trace that are not created by the Langchain integration.
- Trace a Langchain application in any point in the application/trace hierarchy.

**Disadvantages**
- Input/output of a run is not added to trace/span but to a child span.

#### How it works


```python
# Initialize the Langfuse Python SDK
from langfuse import Langfuse
langfuse = Langfuse()

# Create a trace via the SDK and get a Langchain Callback handler for it
trace = langfuse.trace(name="custom-trace", user_id="user-1234", session_id="session-1234")
langfuse_handler = trace.get_langchain_handler()
```


```python
# Alternatively, create a span and get a Langchain Callback handler for it
trace = langfuse.trace()
span = trace.span()
langfuse_handler = span.get_langchain_handler()
```

#### Example

We'll run the same chain multiple times at different places within the hierarchy of a trace.

```
TRACE: person-locator
|
|-- SPAN: Chain (Alan Turing)
|
|-- SPAN: Physics
|   |
|   |-- SPAN: Chain (Albert Einstein)
|   |
|   |-- SPAN: Chain (Isaac Newton)
|   |
|   |-- SPAN: Favorites
|   |   |
|   |   |-- SPAN: Chain (Richard Feynman)
```

Setup chain


```python
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_template("what is the city {person} is from?")
model = ChatOpenAI()

chain = prompt | model
```

Invoke it multiple times as part of a nested trace.


```python
trace = langfuse.trace(name="person-locator")

# On trace
langfuse_handler = trace.get_langchain_handler()
chain.invoke({"person": "Alan Turing"}, config={"callbacks":[langfuse_handler]})

# On span "Physics"
span_physics = trace.span(name="Physics")
langfuse_handler = span_physics.get_langchain_handler()
chain.invoke({"person": "Albert Einstein"}, config={"callbacks":[langfuse_handler]})
chain.invoke({"person": "Isaac Newton"}, config={"callbacks":[langfuse_handler]})

# On span "Physics"."Favorites"
span_favorites = span_physics.span(name="Favorites")
langfuse_handler = span_favorites.get_langchain_handler()
chain.invoke({"person": "Richard Feynman"}, config={"callbacks":[langfuse_handler]})

# End both spans to get span-level latencies
span_favorites.end()
span_physics.end()
```

View it in Langfuse

![Trace of Nested Langchain Runs in Langfuse](https://langfuse.com/images/docs/langchain_python_trace_interoperability.png)

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
