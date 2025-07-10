---
description: End-to-end example of creating a dataset, adding items, and running experiments with Langfuse datasets.
category: Datasets
---

# Langfuse Datasets Cookbook

In this cookbook, we'll iterate on systems prompts with the goal of getting only the capital of a given country. We use Langfuse datasets, to store a list of example inputs and expected outputs.

This is a very simple example, you can run experiments on any LLM application that you either trace with the [Langfuse SDKs](https://langfuse.com/docs/sdk/overview) (Python, JS/TS) or via one of our [integrations](https://langfuse.com/docs/integrations) (e.g. Langchain).

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

# Get keys for your project from the project settings page: https://cloud.langfuse.com
os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-..." 
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-..." 
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region

# Your openai key
os.environ["OPENAI_API_KEY"] = "sk-proj-..."
```

With the environment variables set, we can now initialize the Langfuse client. get_client() initializes the Langfuse client using the credentials provided in the environment variables.


```python
from langfuse import get_client
 
langfuse = get_client()
 
# Verify connection
if langfuse.auth_check():
    print("Langfuse client is authenticated and ready!")
else:
    print("Authentication failed. Please check your credentials and host.")
```

    Langfuse client is authenticated and ready!


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
from langfuse import observe, get_client

langfuse = get_client()

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

    # Explicitly set trace input/output for evaluation features
    langfuse.update_current_trace(
        input=input,
        output=completion
    )

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

        # Use the item.run() context manager
        with item.run(
            run_name = experiment_name,

        ) as root_span: # root_span is the root span of the new trace for this item and run.
            # All subsequent langfuse operations within this block are part of this trace.

            # Call your application logic
            output = run_my_custom_llm_app(item.input, system_prompt)

            # Optionally, score the result against the expected output
            root_span.score_trace(name="exact_match", value = simple_evaluation(output, item.expected_output))

    print(f"\nFinished processing dataset 'capital_cities' for run '{experiment_name}'.")
```

### Run experiments

Now we can easily run experiments with different configurations to explore which yields the best results.


```python
from langfuse import get_client
langfuse = get_client()

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
langfuse.flush()
langfuse.flush()
```

    
    Finished processing dataset 'capital_cities' for run 'famous_city'.
    
    Finished processing dataset 'capital_cities' for run 'directly_ask'.
    
    Finished processing dataset 'capital_cities' for run 'asking_specifically'.
    
    Finished processing dataset 'capital_cities' for run 'asking_specifically_2nd_try'.


## Example using Langchain


```python
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage
 
def run_my_langchain_llm_app(input, system_message, callback_handler):

  # Create a trace via Langfuse spans and use Langchain within it
  with langfuse.start_as_current_span(name="my-langchain-agent") as root_span:
        
    prompt = ChatPromptTemplate.from_messages(
      [("system", system_message), MessagesPlaceholder(variable_name="messages")]
    )
    chat = ChatOpenAI()
    chain = prompt | chat

    result = chain.invoke(
      { "messages": [HumanMessage(content=input)] },
      config={"callbacks":[callback_handler]}
    )

    # Update trace output
    root_span.update_trace(
        input=input,
        output=result.content)

  return result.content
```


```python
from langfuse.langchain import CallbackHandler

def run_langchain_experiment(experiment_name, system_prompt):
  
  dataset = langfuse.get_dataset("capital_cities")

  # Initialize the Langfuse handler
  langfuse_handler = CallbackHandler()

  for item in dataset.items:
  
      # Use the item.run() context manager
      with item.run(
          run_name = experiment_name,
          run_description="My first run",
          run_metadata={"model": "gpt-4o"},
      ) as root_span: # root_span is the root span of the new trace for this item and run.
          # All subsequent langfuse operations within this block are part of this trace.
  
          # Call your application logic
          output = run_my_langchain_llm_app(item.input["country"], system_prompt, langfuse_handler)
  
          # Optionally, score the result against the expected output
          root_span.score_trace(name="exact_match", value = simple_evaluation(output, item.expected_output))

  
  print(f"\nFinished processing dataset 'capital_cities' for run '{experiment_name}'.")
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

## More Examples

- [LangGraph Dataset Experiment](https://langfuse.com/docs/integrations/langchain/example-langgraph-agents#offline-evaluation)
- [OpenAI Agents SDK Dataset Experiment](https://langfuse.com/docs/integrations/openaiagentssdk/example-evaluating-openai-agents#dataset-evaluation)
- [CrewAI Dataset Experiment](https://langfuse.com/docs/integrations/crewai#dataset-experiments)
- [Smolagents Dataset Experiment](https://huggingface.co/learn/agents-course/en/bonus-unit2/monitoring-and-evaluating-agents-notebook#offline-evaluation)
