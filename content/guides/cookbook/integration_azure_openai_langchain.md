---
title: "Langfuse Tracing and Prompt Management for Azure OpenAI and Langchain"
description: This cookbook demonstrates use of Langfuse with Azure OpenAI and Langchain for prompt versioning and evaluations.
category: Integrations
---

# Langfuse Tracing and Prompt Management for Azure OpenAI and Langchain

This cookbook demonstrates use of Langfuse with Azure OpenAI and Langchain for prompt versioning and evaluations.

## Setup


```python
%pip install --quiet langfuse langchain langchain-openai --upgrade
```


```python
import os

# get keys for your project from https://cloud.langfuse.com
os.environ.setdefault("LANGFUSE_PUBLIC_KEY", "pk-lf-***");
os.environ.setdefault("LANGFUSE_SECRET_KEY", "sk-lf-***");
os.environ.setdefault("LANGFUSE_BASE_URL", "https://cloud.langfuse.com"); # 🇪🇺 EU region
# Other Langfuse data regions include 🇺🇸 US: https://us.cloud.langfuse.com, 🇯🇵 Japan: https://jp.cloud.langfuse.com and ⚕️ HIPAA: https://hipaa.cloud.langfuse.com

# your azure openai configuration
os.environ.setdefault("AZURE_OPENAI_ENDPOINT", "your Azure OpenAI endpoint");
os.environ.setdefault("AZURE_OPENAI_API_KEY", "your Azure OpenAI API key");
os.environ.setdefault("OPENAI_API_TYPE", "azure");
os.environ.setdefault("OPENAI_API_VERSION", "2023-09-01-preview");
```

We'll use the native Langfuse integration for Langchain. Learn more it in the [documentation](https://langfuse.com/integrations/frameworks/langchain).


```python
from langfuse import get_client
from langfuse.langchain import CallbackHandler

# Initialize Langfuse CallbackHandler for Langchain (tracing)
langfuse_handler = CallbackHandler()

# optional, verify your Langfuse credentials
get_client().auth_check()
```

Langchain imports


```python
from langchain_openai import AzureChatOpenAI
from langchain_core.prompts import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
```

## Simple example


```python
from langchain_openai import AzureChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langfuse.langchain import CallbackHandler

langfuse_handler = CallbackHandler()

prompt = ChatPromptTemplate.from_template("what is the city {person} is from?")
model = AzureChatOpenAI(
    deployment_name="gpt-4o",
    model_name="gpt-4o",
)
chain = prompt | model

chain.invoke({"person": "Satya Nadella"}, config={"callbacks":[langfuse_handler]})
```

**✨ Done. Go to the Langfuse Dashboard to explore the trace of this run.**

## Example using Langfuse Prompt Management and Langchain

Learn more about Langfuse Prompt Management in the [docs](https://langfuse.com/docs/prompts).


```python
# Initialize the Langfuse Client
from langfuse import get_client
langfuse = get_client()

template = """
You are an AI assistant travel assistant that provides vacation recommendations to users. 
You should also be able to provide information about the weather, local customs, and travel restrictions. 
"""

# Push the prompt to Langfuse and immediately promote it to production
langfuse.create_prompt(
    name="travel_consultant",
    prompt=template,
    labels=["production"],
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
    deployment_name="gpt-4o",
    model_name="gpt-4o",
)

human_message_prompt = HumanMessagePromptTemplate.from_template("{text}")
chat_prompt = ChatPromptTemplate.from_messages(
    [system_message_prompt, human_message_prompt]
)
chain = chat_prompt | llm

result = chain.invoke(
    {"text": "Where should I go on vacation in December for warm weather and beaches?"},
    config={"callbacks": [langfuse_handler]},
)

print(result.content)
```

## Multiple Langchain runs in same Langfuse trace

Langchain setup


```python
from langchain_openai import AzureChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from operator import itemgetter

prompt1 = ChatPromptTemplate.from_template(
    "What {type} is easiest to learn but hardest to master? Give a step by step approach of your thoughts, ending in your answer"
)
prompt2 = ChatPromptTemplate.from_template(
    "How {type} can be learned in 21 days? respond in {language}"
)
model = AzureChatOpenAI(
    deployment_name="gpt-4o",
    model_name="gpt-4o",
)
chain1 = prompt1 | model | StrOutputParser()
chain2 = (
    {"type": chain1, "language": itemgetter("language")}
    | prompt2
    | model
    | StrOutputParser()
)
```

Run the chain multiple times within the same Langfuse trace by wrapping the invocations in an enclosing span (created via `start_as_current_observation`). Trace attributes such as `user_id` are set via `propagate_attributes`.


```python
from langfuse import get_client, propagate_attributes
from langfuse.langchain import CallbackHandler

langfuse = get_client()
langfuse_handler = CallbackHandler()

# Create an enclosing span to group both runs into a single trace
with langfuse.start_as_current_observation(
    as_type="span", name="chain_of_thought_example"
) as root_span:
    with propagate_attributes(user_id="user-1234"):
        # First run
        chain2.invoke(
            {"type": "business", "language": "german"},
            config={"callbacks": [langfuse_handler]},
        )

        # Second run
        chain2.invoke(
            {"type": "business", "language": "english"},
            config={"callbacks": [langfuse_handler]},
        )
```

## Adding scores

When evaluating traces of your LLM application in Langfuse, you need to add [scores](https://langfuse.com/docs/scores) to the trace. For simplicity, we'll add a mocked score. Check out the docs for more information on complex score types.

Get the `trace_id` from the enclosing span of the previous run. Inside an active observation, you can also get it via `langfuse.get_current_trace_id()`.


```python
trace_id = root_span.trace_id
```


```python
# Add score to the trace via the Langfuse Python Client
langfuse.create_score(
    trace_id=trace_id,
    name="user-explicit-feedback",
    value=1,
    comment="I like how personalized the response is",
)
```
