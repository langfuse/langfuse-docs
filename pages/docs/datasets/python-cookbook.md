---
description: End-to-end example of creating a dataset, adding items, and running experiments with Langfuse datasets.
category: Datasets
---

# Langfuse Datasets Cookbook

In this cookbook, we'll iterate on systems prompts with the goal of getting only the capital of a given country. We use Langfuse datasets, to store a list of example inputs and expected outputs.

This is a very simple example, you can run experiments on any LLM application that you either trace with the [Langfuse SDKs](https://langfuse.com/docs/sdk) (Python, JS/TS) or via one of our [integrations](https://langfuse.com/docs/integrations) (e.g. Langchain).

_Simple example application_

- **Model**: gpt-4o
- **Input**: country name
- **Output**: capital
- **Evaluation**: exact match of completion and ground truth
- **Experiment on**: system prompt

## Setup


```python
%pip install langfuse openai langchain_openai langchain --upgrade
```


```python
import os

# get keys for your project from https://cloud.langfuse.com
os.environ["LANGFUSE_PUBLIC_KEY"] = ""
os.environ["LANGFUSE_SECRET_KEY"] = ""

# your openai key
os.environ["OPENAI_API_KEY"] = ""

# Your host, defaults to https://cloud.langfuse.com
# For US data region, set to "https://us.cloud.langfuse.com"
# os.environ["LANGFUSE_HOST"] = "http://localhost:3000"
```


```python
# import
from langfuse import Langfuse
import openai

# init
langfuse = Langfuse()
```

## Create a dataset


```python
langfuse.create_dataset(name="capital_cities");
```

### Items

Load local items into the Langfuse dataset. Alternatively you can add items from production via the Langfuse UI.


```python
# example items, could also be json instead of strings
local_items = [
    {"input": {"country": "Italy"}, "expected_output": "Rome"},
    {"input": {"country": "Spain"}, "expected_output": "Madrid"},
    {"input": {"country": "Brazil"}, "expected_output": "Brasília"},
    {"input": {"country": "Japan"}, "expected_output": "Tokyo"},
    {"input": {"country": "India"}, "expected_output": "New Delhi"},
    {"input": {"country": "Canada"}, "expected_output": "Ottawa"},
    {"input": {"country": "South Korea"}, "expected_output": "Seoul"},
    {"input": {"country": "Argentina"}, "expected_output": "Buenos Aires"},
    {"input": {"country": "South Africa"}, "expected_output": "Pretoria"},
    {"input": {"country": "Egypt"}, "expected_output": "Cairo"},
]
```


```python
# Upload to Langfuse
for item in local_items:
  langfuse.create_dataset_item(
      dataset_name="capital_cities",
      # any python object or value
      input=item["input"],
      # any python object or value, optional
      expected_output=item["expected_output"]
)
```

## Example using Langfuse `@observe()` decorator

### Application

This an example production application that we want to evaluate. It is instrumented with the Langfuse Decorator. We do not need to change the application code to evaluate it subsequently.


```python
from langfuse.openai import openai
from langfuse.decorators import observe, langfuse_context

@observe()
def run_my_custom_llm_app(input, system_prompt):
  messages = [
      {"role":"system", "content": system_prompt},
      {"role":"user", "content": input["country"]}
  ]

  completion = openai.chat.completions.create(
      model="gpt-4o",
      messages=messages
  ).choices[0].message.content

  return completion
```

### Experiment runner

This is a simple experiment runner that runs the application on each item in the dataset and evaluates the output.


```python
# we use a very simple eval here, you can use any eval library
# see https://langfuse.com/docs/scores/model-based-evals for details
# you can also use LLM-as-a-judge managed within Langfuse to evaluate the outputs
def simple_evaluation(output, expected_output):
  return output == expected_output
```


```python
def run_experiment(experiment_name, system_prompt):
  dataset = langfuse.get_dataset("capital_cities")

  for item in dataset.items:
    # item.observe() returns a trace_id that can be used to add custom evaluations later
    # it also automatically links the trace to the experiment run
    with item.observe(run_name=experiment_name) as trace_id:

      # run application, pass input and system prompt
      output = run_my_custom_llm_app(item.input, system_prompt)

      # optional: add custom evaluation results to the experiment trace
      # we use the previously created example evaluation function
      langfuse.score(
        trace_id=trace_id,
        name="exact_match",
        value=simple_evaluation(output, item.expected_output)
      )
```

### Run experiments

Now we can easily run experiments with different configurations to explore which yields the best results.


```python
from langfuse.decorators import langfuse_context

run_experiment(
    "famous_city",
    "The user will input countries, respond with the most famous city in this country"
)
run_experiment(
    "directly_ask",
    "What is the capital of the following country?"
)
run_experiment(
    "asking_specifically",
    "The user will input countries, respond with only the name of the capital"
)
run_experiment(
    "asking_specifically_2nd_try",
    "The user will input countries, respond with only the name of the capital. State only the name of the city."
)

# Assert that all events were sent to the Langfuse API
langfuse_context.flush()
langfuse.flush()
```

## Example using Langchain


```python
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage
 
def run_my_langchain_llm_app(input, system_message, callback_handler):
  prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            system_message,
        ),
        MessagesPlaceholder(variable_name="messages"),
    ]
  )
  chat = ChatOpenAI()
  chain = prompt | chat

  res = chain.invoke(
    { "messages": [HumanMessage(content=input)] },
    config={"callbacks":[callback_handler]}
  )
  
  return res
```


```python
def run_langchain_experiment(experiment_name, system_message):
  dataset = langfuse.get_dataset("capital_cities")

  for item in dataset.items:
    handler = item.get_langchain_handler(run_name=experiment_name)

    completion = run_my_langchain_llm_app(item.input["country"], system_message, handler)

    handler.trace.score(
      name="exact_match",
      value=simple_evaluation(completion, item.expected_output)
    )
```


```python
run_langchain_experiment(
    "langchain_famous_city",
    "The user will input countries, respond with the most famous city in this country"
)
run_langchain_experiment(
    "langchain_directly_ask",
    "What is the capital of the following country?"
)
run_langchain_experiment(
    "langchain_asking_specifically",
    "The user will input countries, respond with only the name of the capital"
)
run_langchain_experiment(
    "langchain_asking_specifically_2nd_try",
    "The user will input countries, respond with only the name of the capital. State only the name of the city."
)
```

## Evaluate experiments in Langfuse UI

- Average scores per experiment run
- Browse each run for an individual item
- Look at traces to debug issues
