# Langfuse Datasets Cookbook

In this cookbook, we'll iterate on systems prompts with the goal of getting only the capital of a given country. We use Langfuse datasets, to store a list of example inputs and expected outputs.

This is a very simple example, you can run experiments on any LLM application that you either trace with the [Langfuse SDKs](https://langfuse.com/docs/integrations/sdk) (Python, JS/TS) or via one of our [integrations](https://langfuse.com/docs/integrations) (e.g. Langchain).

_Simple example application_

- **Model**: gpt-3.5-turbo
- **Input**: country name
- **Output**: capital
- **Evaluation**: exact match of completion and ground truth
- **Experiment on**: system prompt

## Setup


```python
%pip install langfuse openai langchain --upgrade
```


```python
import os

# get keys for your project
os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-***"
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-***"

# for self-hosting
# os.environ["ENV_HOST"] = "http://localhost:3000"

# for openai
os.environ["OPENAI_API_KEY"] = "sk-***"

# import
from langfuse import Langfuse
import openai

# init
langfuse = Langfuse()
```

## Create a dataset


```python
from langfuse.model import CreateDatasetRequest

langfuse.create_dataset(CreateDatasetRequest(name="capital_cities"))
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
from langfuse.model import CreateDatasetItemRequest

# Upload to Langfuse
for item in local_items:
  langfuse.create_dataset_item(
    CreateDatasetItemRequest(
        dataset_name="capital_cities",
        # any python object or value
        input=item["input"],
        # any python object or value, optional
        expected_output=item["expected_output"]
    )
)
```

## Define application and run experiments

We implement the application in two ways to demonstrate how it's done

1. Custom LLM app using e.g. OpenAI SDK, traced with Langfuse Python SDK
2. Langchain Application, traced via native Langfuse integration


```python
# we use a very simple eval here, you can use any eval library
def simple_evaluation(output, expected_output):
  return output == expected_output
```

### Custom app


```python
from datetime import datetime
from langfuse.client import InitialGeneration

def run_my_custom_llm_app(input, system_prompt):
  messages = [
      {"role":"system", "content": system_prompt},
      {"role":"user", "content": input["country"]}
  ]

  generationStartTime = datetime.now()

  openai_completion = openai.ChatCompletion.create(
      model="gpt-3.5-turbo",
      messages=messages
  ).choices[0].message.content

  langfuse_generation = langfuse.generation(InitialGeneration(
      name="guess-countries",
      prompt=messages,
      completion=openai_completion,
      model="gpt-3.5-turbo",
      startTime=generationStartTime,
      endTime=datetime.now()
  ))

  return openai_completion, langfuse_generation
```


```python
from langfuse.client import CreateScore

def run_experiment(experiment_name, system_prompt):
  dataset = langfuse.get_dataset("capital_cities")

  for item in dataset.items:
    completion, langfuse_generation = run_my_custom_llm_app(item.input, system_prompt)

    item.link(langfuse_generation, experiment_name) # pas the observation/generation object or the id

    langfuse_generation.score(CreateScore(
      name="exact_match",
      value=simple_evaluation(completion, item.expected_output)
    ))
```


```python
run_experiment(
    "famous_city",
    "The user will input countries, respond with the mst famous city in this country"
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
```

### Langchain application


```python
from datetime import datetime
from langchain.chat_models import ChatOpenAI
from langfuse.client import InitialGeneration
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate

def run_my_langchain_llm_app(input, prompt_template, callback_handler):

  # needs to include {country}
  prompt = PromptTemplate.from_template(prompt_template)

  llm = ChatOpenAI(openai_api_key=OPENAI_API_KEY, callbacks=[callback_handler])
  chain = LLMChain(llm=llm, prompt=prompt, callbacks=[callback_handler])
  completion = chain.run(**input)

  return completion
```


```python
from langfuse.client import CreateScore

def run_langchain_experiment(experiment_name, prompt_template):
  dataset = langfuse.get_dataset("capital_cities")

  for item in dataset.items:
    handler = item.get_langchain_handler(run_name=experiment_name)

    completion = run_my_langchain_llm_app(item.input, prompt_template, handler)

    handler.rootSpan.score(CreateScore(
      name="exact_match",
      value=simple_evaluation(completion, item.expected_output)
    ))
```


```python
run_langchain_experiment(
    "langchain_famous_city",
    "The user will input countries, respond with the mst famous city in this country"
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

![Experiment runs in Langfuse](https://langfuse.com/images/docs/dataset-runs-cookbook.jpg)
