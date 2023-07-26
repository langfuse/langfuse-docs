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

The Langfuse `CallbackHandler` tracks the following actions when using Langchain:

- Chains: `on_chain_start`, `on_chain_end`. `on_chain_error`
- Agents: `on_agent_start`, `on_agent_action`, `on_agent_finish`, `on_agent_end`
- Tools: `on_tool_start`, `on_tool_end`, `on_tool_error`
- Retriever: `on_retriever_start`, `on_retriever_end`
- ChatModel: `on_chat_model_start`,
- LLM: `on_llm_start`, `on_llm_end`, `on_llm_error`

Missing some useful information/context in Langfuse? Join the [Discord](https://discord.gg/7NXusRtqYU) or share your feedback directly with us: feedback@langfuse.com

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
os.environ["OPENAI_API_KEY"] = 'sk-...'
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
await handler.langfuse.async_flush()

```




    {'status': 'success'}



### 2. QA Retrieval


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

await handler.langfuse.async_flush()

```

    [nltk_data] Downloading package punkt to /root/nltk_data...
    [nltk_data]   Unzipping tokenizers/punkt.zip.
    [nltk_data] Downloading package averaged_perceptron_tagger to
    [nltk_data]     /root/nltk_data...
    [nltk_data]   Unzipping taggers/averaged_perceptron_tagger.zip.


     The president said that Ketanji Brown Jackson is one of our nation's top legal minds and will continue Justice Breyer's legacy of excellence.





    {'status': 'success'}



### 3. Agent


```python
from langchain.agents import AgentType, initialize_agent, load_tools


handler = CallbackHandler(ENV_PUBLIC_KEY, ENV_SECRET_KEY, ENV_HOST)

llm = OpenAI(openai_api_key=os.environ.get("OPENAI_API_KEY"))

tools = load_tools(["serpapi", "llm-math"], llm=llm)

agent = initialize_agent(tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True)

result = agent.run("Who is Leo DiCaprio's girlfriend? What is her current age raised to the 0.43 power?", callbacks=[handler])

await handler.langfuse.async_flush()

print("output variable: ", result)
```

    
    
    [1m> Entering new AgentExecutor chain...[0m
    [32;1m[1;3m I need to find out who the girlfriend is and then use a calculator to calculate the age raised to the 0.43 power.
    Action: Search
    Action Input: "Leo DiCaprio girlfriend"[0m
    Observation: [36;1m[1;3mThe actor is believed to have recently split from his girlfriend of five years, actor Camila Morrone, but has previously been romantically ...[0m
    Thought:[32;1m[1;3m I need to find out how old Camila Morrone is.
    Action: Search
    Action Input: "Camila Morrone age"[0m
    Observation: [36;1m[1;3m26 years[0m
    Thought:[32;1m[1;3m I need to use the calculator to calculate 26 raised to the 0.43 power.
    Action: Calculator
    Action Input: 26^0.43[0m
    Observation: [33;1m[1;3mAnswer: 4.059182145592686[0m
    Thought:[32;1m[1;3m I now know the final answer.
    Final Answer: Leo DiCaprio's girlfriend is Camila Morrone, who is 26 years old and her age raised to the 0.43 power is 4.059182145592686.[0m
    
    [1m> Finished chain.[0m
    output variable:  Leo DiCaprio's girlfriend is Camila Morrone, who is 26 years old and her age raised to the 0.43 power is 4.059182145592686.


## Troubleshooting

If you encounter any issue, we are happy to help on [Discord](https://discord.gg/7NXusRtqYU) or shoot us an email: help@langfuse.com
