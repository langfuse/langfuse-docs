---
description: This cookbook demonstate use of Langfuse with Azure OpenAI and Langchain for prompt versioning and evaluations.
category: Integrations
---

# Langfuse Tracing and Prompt Management for Azure OpenAI and Langchain

This cookbook demonstate use of Langfuse with Azure OpenAI and Langchain for prompt versioning and evaluations.

## Setup


```python
%pip install --quiet langfuse langchain langchain-openai --upgrade
```


```python
import os

# get keys for your project from https://cloud.langfuse.com
os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-***"
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-***"
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # for EU data region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # for US data region

# your azure openai configuration
os.environ["AZURE_OPENAI_ENDPOINT"] = "your Azure OpenAI endpoint"
os.environ["AZURE_OPENAI_API_KEY"] = "your Azure OpenAI API key"
os.environ["OPENAI_API_TYPE"] = "azure"
os.environ["OPENAI_API_VERSION"] = "2023-09-01-preview"
```

We'll use the native Langfuse intgeration for Langchain. Learn more it in the [documentation](https://langfuse.com/docs/integrations/langchain).


```python
from langfuse.callback import CallbackHandler

langfuse_handler = CallbackHandler()

# optional, verify your Langfuse credentials
langfuse_handler.auth_check()
```

Langchain imports


```python
from langchain_openai import AzureChatOpenAI
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.prompts.chat import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain.schema import HumanMessage
```

## Simple example


```python
from langchain_openai import AzureChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langfuse.callback import CallbackHandler

langfuse_handler = CallbackHandler()

prompt = ChatPromptTemplate.from_template("what is the city {person} is from?")
model = AzureChatOpenAI(
    deployment_name="gpt-35-turbo",
    model_name="gpt-3.5-turbo",
)
chain = prompt | model

chain.invoke({"person": "Satya Nadella"}, config={"callbacks":[langfuse_handler]})
```

**✨ Done. Go to the Langfuse Dashboard to explore the trace of this run.**

## Example using Langfuse Prompt Management and Langchain

Learn more about Langfuse Prompt Management in the [docs](https://langfuse.com/docs/prompts).


```python
# Initialize the Langfuse Client
from langfuse import Langfuse
langfuse = Langfuse()

template = """
You are an AI assistant travel assistant that provides vacation recommendations to users. 
You should also be able to provide information about the weather, local customs, and travel restrictions. 
"""

# Push the prompt to Langfuse and immediately promote it to production
langfuse.create_prompt(
    name="travel_consultant",
    prompt=template,
    is_active=True,
)
```

In your production environment, you can then fetch the production version of the prompt. The Langfuse client caches the prompt to improve performance. You can configure this behavior via a custom TTL or disable it completely.


```python
# Get the prompt from Langfuse, cache it for 5 minutes
langfuse_prompt = langfuse.get_prompt("travel_consultant", cache_ttl_seconds=300)
```

We do not use the native Langfuse `prompt.compile()` but use the raw `prompt.prompt` as Langchain will insert the prompt variables (if any).


```python
system_message_prompt = SystemMessagePromptTemplate.from_template(langfuse_prompt.prompt)
```


```python
llm = AzureChatOpenAI(
    deployment_name="gpt-35-turbo",
    model_name="gpt-3.5-turbo",
)

human_message_prompt = HumanMessagePromptTemplate.from_template("{text}")
chat_prompt = ChatPromptTemplate.from_messages(
    [system_message_prompt, human_message_prompt]
)
chain = LLMChain(llm=llm, prompt=chat_prompt)
result = chain.run(
    f"Where should I go on vaction in Decemember for warm weather and beaches?",
    callbacks=[langfuse_handler],
)

print(result)
```

## Multiple Langchain runs in same Langfuse trace

Langchain setup


```python
from langchain_openai import AzureChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema import StrOutputParser
from operator import itemgetter

prompt1 = ChatPromptTemplate.from_template(
    "What {type} is easiest to learn but hardest to master? Give a step by step approach of your thoughts, ending in your answer"
)
prompt2 = ChatPromptTemplate.from_template(
    "How {type} can be learned in 21 days? respond in {language}"
)
model = AzureChatOpenAI(
    deployment_name="gpt-35-turbo",
    model_name="gpt-3.5-turbo",
)
chain1 = prompt1 | model | StrOutputParser()
chain2 = (
    {"type": chain1, "language": itemgetter("language")}
    | prompt2
    | model
    | StrOutputParser()
)
```

Run the chain multiple times within the same Langfuse trace.


```python
# Create trace using Langfuse Client
langfuse = Langfuse()
trace = langfuse.trace(name="chain_of_thought_example", user_id="user-1234")

# Create a handler scoped to this trace
langfuse_handler = trace.get_langchain_handler()

# First run
chain2.invoke(
    {"type": "business", "language": "german"}, config={"callbacks": [langfuse_handler]}
)

# Second run
chain2.invoke(
    {"type": "business", "language": "english"}, config={"callbacks": [langfuse_handler]}
)
```

## Adding scores

When evaluating traces of your LLM application in Langfuse, you need to add [scores](https://langfuse.com/docs/scores) to the trace. For simplicity, we'll add a mocked score. Check out the docs for more information on complex score types.

Get the trace_id. We use the previous run where we created the trace using `langfuse.trace()`. You can also get the trace_id via `langfuse_handler.get_trace_id()`.


```python
trace_id = trace.id
```


```python
# Add score to the trace via the Langfuse Python Client
langfuse = Langfuse()

trace = langfuse.score(
    trace_id=trace_id,
    name="user-explicit-feedback",
    value=1,
    comment="I like how personalized the response is",
)
```
