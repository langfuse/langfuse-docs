---
description: Cookbook with examples of the Langfuse Integration for Langchain (Python).
category: Integrations
---

# Cookbook: Langchain Integration

This is a cookbook with examples of the Langfuse Integration for Langchain (Python).

Follow the [integration guide](https://langfuse.com/integrations/frameworks/langchain) to add this integration to your Langchain project. The integration also supports Langchain JS.

## Setup


```python
%pip install langfuse langchain langchain_openai langchain_community --upgrade
```

Initialize the Langfuse client with your API keys from the project settings in the Langfuse UI and add them to your environment.


```python
import os

# Get keys for your project from the project settings page: https://cloud.langfuse.com
os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-..." 
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-..." 
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region

# Your openai key
os.environ["OPENAI_API_KEY"] = "sk-proj-.."
```


```python
from langfuse.langchain import CallbackHandler
 
# Initialize Langfuse CallbackHandler for Langchain (tracing)
langfuse_handler = CallbackHandler()
```

## Examples

### Sequential Chain in Langchain Expression Language (LCEL)

![Trace of Langchain LCEL](https://langfuse.com/images/cookbook/integration_langchain/langchain_LCEL.png)

[Example trace in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/dbe646b2b67957d22e8780c429b2d20f?timestamp=2025-06-11T09%3A09%3A58.823Z&display=details)


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




    'Barack Obama es de la ciudad de Chicago, Illinois, en los Estados Unidos.'



#### Runnable methods

Runnables are units of work that can be invoked, batched, streamed, transformed and composed.

The examples below show how to use the following methods with Langfuse:

- invoke/ainvoke: Transforms a single input into an output.
- batch/abatch: Efficiently transforms multiple inputs into outputs.
- stream/astream: Streams output from a single input as it’s produced.


```python
# Async Invoke
await chain2.ainvoke({"person": "biden", "language": "german"}, config={"callbacks":[langfuse_handler]})

# Batch
chain2.batch([{"person": "elon musk", "language": "english"}, {"person": "mark zuckerberg", "language": "english"}], config={"callbacks":[langfuse_handler]})

# Async Batch
await chain2.abatch([{"person": "jeff bezos", "language": "english"}, {"person": "tim cook", "language": "english"}], config={"callbacks":[langfuse_handler]})

# Stream
for chunk in chain2.stream({"person": "steve jobs", "language": "english"}, config={"callbacks":[langfuse_handler]}):
    print("Streaming chunk:", chunk)

# Async Stream
async for chunk in chain2.astream({"person": "bill gates", "language": "english"}, config={"callbacks":[langfuse_handler]}):
    print("Async Streaming chunk:", chunk)

```

### RetrievalQA

![Trace of Langchain QA Retrieval in Langfuse](https://langfuse.com/images/cookbook/integration_langchain/langchain_qa_retrieval.png)

[Example trace in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/84e1ac07dedbce3b2a236b6ece6950d9?timestamp=2025-06-11T09:29:10.248Z&display=details)


```python
import os
os.environ["SERPAPI_API_KEY"] = "..."
```


```python
%pip install unstructured selenium langchain-chroma --upgrade
```


```python
from langchain_community.document_loaders import SeleniumURLLoader
from langchain_chroma import Chroma
from langchain_text_splitters import CharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain.chains import RetrievalQA

langfuse_handler = CallbackHandler()

urls = [
    "https://raw.githubusercontent.com/langfuse/langfuse-docs/main/public/state_of_the_union.txt",
]
loader = SeleniumURLLoader(urls=urls)
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




    {'query': 'What did the president say about Ketanji Brown Jackson',
     'result': " The president nominated her to serve on the United States Supreme Court and praised her as one of the nation's top legal minds who will continue the legacy of retiring Justice Stephen Breyer."}



### AzureOpenAI


```python
os.environ["AZURE_OPENAI_ENDPOINT"] = "<Azure OpenAI endpoint>"
os.environ["AZURE_OPENAI_API_KEY"] = "<Azure OpenAI API key>"
os.environ["OPENAI_API_TYPE"] = "azure"
os.environ["OPENAI_API_VERSION"] = "2023-09-01-preview"
```


```python
from langchain_openai import AzureChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langfuse.langchain import CallbackHandler
 
# Initialize Langfuse CallbackHandler for Langchain (tracing)
langfuse_handler = CallbackHandler()

prompt = ChatPromptTemplate.from_template("what is the city {person} is from?")
model = AzureChatOpenAI(
    deployment_name="gpt-4o",
    model_name="gpt-4o",
)
chain = prompt | model

chain.invoke({"person": "Satya Nadella"}, config={"callbacks":[langfuse_handler]})
```
