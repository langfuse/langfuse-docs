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

# your openai key
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
from langfuse import observe

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
from langfuse.langchain import CallbackHandler

def run_langchain_experiment(experiment_name, system_prompt):
  dataset = langfuse.get_dataset("capital_cities")

  # Initialize the Langfuse handler
  langfuse_handler = CallbackHandler()

  for item in dataset.items:
  
      # Use the item.run() context manager
      with item.run(
          run_name = experiment_name,

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

    
    Finished processing dataset 'capital_cities' for run 'langchain_famous_city'.
    
    Finished processing dataset 'capital_cities' for run 'langchain_directly_ask'.
    
    Finished processing dataset 'capital_cities' for run 'langchain_asking_specifically'.
    
    Finished processing dataset 'capital_cities' for run 'langchain_asking_specifically_2nd_try'.


    Exception while exporting Span batch.
    Traceback (most recent call last):
      File "/Users/jannik/Documents/GitHub/langfuse-docs/.venv/lib/python3.13/site-packages/urllib3/connectionpool.py", line 534, in _make_request
        response = conn.getresponse()
      File "/Users/jannik/Documents/GitHub/langfuse-docs/.venv/lib/python3.13/site-packages/urllib3/connection.py", line 516, in getresponse
        httplib_response = super().getresponse()
      File "/opt/homebrew/Cellar/python@3.13/3.13.2/Frameworks/Python.framework/Versions/3.13/lib/python3.13/http/client.py", line 1430, in getresponse
        response.begin()
        ~~~~~~~~~~~~~~^^
      File "/opt/homebrew/Cellar/python@3.13/3.13.2/Frameworks/Python.framework/Versions/3.13/lib/python3.13/http/client.py", line 331, in begin
        version, status, reason = self._read_status()
                                  ~~~~~~~~~~~~~~~~~^^
      File "/opt/homebrew/Cellar/python@3.13/3.13.2/Frameworks/Python.framework/Versions/3.13/lib/python3.13/http/client.py", line 292, in _read_status
        line = str(self.fp.readline(_MAXLINE + 1), "iso-8859-1")
                   ~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^
      File "/opt/homebrew/Cellar/python@3.13/3.13.2/Frameworks/Python.framework/Versions/3.13/lib/python3.13/socket.py", line 719, in readinto
        return self._sock.recv_into(b)
               ~~~~~~~~~~~~~~~~~~~~^^^
      File "/opt/homebrew/Cellar/python@3.13/3.13.2/Frameworks/Python.framework/Versions/3.13/lib/python3.13/ssl.py", line 1304, in recv_into
        return self.read(nbytes, buffer)
               ~~~~~~~~~^^^^^^^^^^^^^^^^
      File "/opt/homebrew/Cellar/python@3.13/3.13.2/Frameworks/Python.framework/Versions/3.13/lib/python3.13/ssl.py", line 1138, in read
        return self._sslobj.read(len, buffer)
               ~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^
    TimeoutError: The read operation timed out
    
    The above exception was the direct cause of the following exception:
    
    Traceback (most recent call last):
      File "/Users/jannik/Documents/GitHub/langfuse-docs/.venv/lib/python3.13/site-packages/requests/adapters.py", line 667, in send
        resp = conn.urlopen(
            method=request.method,
        ...<9 lines>...
            chunked=chunked,
        )
      File "/Users/jannik/Documents/GitHub/langfuse-docs/.venv/lib/python3.13/site-packages/urllib3/connectionpool.py", line 841, in urlopen
        retries = retries.increment(
            method, url, error=new_e, _pool=self, _stacktrace=sys.exc_info()[2]
        )
      File "/Users/jannik/Documents/GitHub/langfuse-docs/.venv/lib/python3.13/site-packages/urllib3/util/retry.py", line 474, in increment
        raise reraise(type(error), error, _stacktrace)
              ~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
      File "/Users/jannik/Documents/GitHub/langfuse-docs/.venv/lib/python3.13/site-packages/urllib3/util/util.py", line 39, in reraise
        raise value
      File "/Users/jannik/Documents/GitHub/langfuse-docs/.venv/lib/python3.13/site-packages/urllib3/connectionpool.py", line 787, in urlopen
        response = self._make_request(
            conn,
        ...<10 lines>...
            **response_kw,
        )
      File "/Users/jannik/Documents/GitHub/langfuse-docs/.venv/lib/python3.13/site-packages/urllib3/connectionpool.py", line 536, in _make_request
        self._raise_timeout(err=e, url=url, timeout_value=read_timeout)
        ~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
      File "/Users/jannik/Documents/GitHub/langfuse-docs/.venv/lib/python3.13/site-packages/urllib3/connectionpool.py", line 367, in _raise_timeout
        raise ReadTimeoutError(
            self, url, f"Read timed out. (read timeout={timeout_value})"
        ) from err
    urllib3.exceptions.ReadTimeoutError: HTTPSConnectionPool(host='cloud.langfuse.com', port=443): Read timed out. (read timeout=10)
    
    During handling of the above exception, another exception occurred:
    
    Traceback (most recent call last):
      File "/Users/jannik/Documents/GitHub/langfuse-docs/.venv/lib/python3.13/site-packages/opentelemetry/sdk/trace/export/__init__.py", line 362, in _export_batch
        self.span_exporter.export(self.spans_list[:idx])  # type: ignore
        ~~~~~~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^
      File "/Users/jannik/Documents/GitHub/langfuse-docs/.venv/lib/python3.13/site-packages/opentelemetry/exporter/otlp/proto/http/trace_exporter/__init__.py", line 204, in export
        return self._export_serialized_spans(serialized_data)
               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^
      File "/Users/jannik/Documents/GitHub/langfuse-docs/.venv/lib/python3.13/site-packages/opentelemetry/exporter/otlp/proto/http/trace_exporter/__init__.py", line 174, in _export_serialized_spans
        resp = self._export(serialized_data)
      File "/Users/jannik/Documents/GitHub/langfuse-docs/.venv/lib/python3.13/site-packages/opentelemetry/exporter/otlp/proto/http/trace_exporter/__init__.py", line 139, in _export
        resp = self._session.post(
            url=self._endpoint,
        ...<3 lines>...
            cert=self._client_cert,
        )
      File "/Users/jannik/Documents/GitHub/langfuse-docs/.venv/lib/python3.13/site-packages/requests/sessions.py", line 637, in post
        return self.request("POST", url, data=data, json=json, **kwargs)
               ~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
      File "/Users/jannik/Documents/GitHub/langfuse-docs/.venv/lib/python3.13/site-packages/requests/sessions.py", line 589, in request
        resp = self.send(prep, **send_kwargs)
      File "/Users/jannik/Documents/GitHub/langfuse-docs/.venv/lib/python3.13/site-packages/requests/sessions.py", line 703, in send
        r = adapter.send(request, **kwargs)
      File "/Users/jannik/Documents/GitHub/langfuse-docs/.venv/lib/python3.13/site-packages/requests/adapters.py", line 713, in send
        raise ReadTimeout(e, request=request)
    requests.exceptions.ReadTimeout: HTTPSConnectionPool(host='cloud.langfuse.com', port=443): Read timed out. (read timeout=10)


## Evaluate experiments in Langfuse UI

- Average scores per experiment run
- Browse each run for an individual item
- Look at traces to debug issues
