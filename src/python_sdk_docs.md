# Python SDK

- [View as notebook on GitHub](https://github.com/langfuse/langfuse-docs/blob/main/src/python_sdk_docs.ipynb)
- [Open as notebook in Google Colab](http://colab.research.google.com/github/langfuse/langfuse-docs/blob/main/src/python_sdk_docs.ipynb)

## 1. Initializing the client

The langfuse SDKs are hosted on the pypi index.


```python
%pip install langfuse
```

    Collecting langfuse
      Downloading langfuse-0.0.40-py3-none-any.whl (34 kB)
    Requirement already satisfied: attrs>=21.3.0 in /usr/local/lib/python3.10/dist-packages (from langfuse) (23.1.0)
    Collecting httpx<0.25.0,>=0.15.4 (from langfuse)
      Downloading httpx-0.24.1-py3-none-any.whl (75 kB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m75.4/75.4 kB[0m [31m2.6 MB/s[0m eta [36m0:00:00[0m
    [?25hCollecting pydantic==1.10.7 (from langfuse)
      Downloading pydantic-1.10.7-cp310-cp310-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (3.1 MB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m3.1/3.1 MB[0m [31m10.8 MB/s[0m eta [36m0:00:00[0m
    [?25hCollecting pytest<8.0.0,>=7.4.0 (from langfuse)
      Downloading pytest-7.4.0-py3-none-any.whl (323 kB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m323.6/323.6 kB[0m [31m9.0 MB/s[0m eta [36m0:00:00[0m
    [?25hCollecting pytest-asyncio<0.22.0,>=0.21.1 (from langfuse)
      Downloading pytest_asyncio-0.21.1-py3-none-any.whl (13 kB)
    Collecting pytest-timeout<3.0.0,>=2.1.0 (from langfuse)
      Downloading pytest_timeout-2.1.0-py3-none-any.whl (12 kB)
    Requirement already satisfied: python-dateutil<3.0.0,>=2.8.0 in /usr/local/lib/python3.10/dist-packages (from langfuse) (2.8.2)
    Requirement already satisfied: typing-extensions>=4.2.0 in /usr/local/lib/python3.10/dist-packages (from pydantic==1.10.7->langfuse) (4.7.1)
    Requirement already satisfied: certifi in /usr/local/lib/python3.10/dist-packages (from httpx<0.25.0,>=0.15.4->langfuse) (2023.5.7)
    Collecting httpcore<0.18.0,>=0.15.0 (from httpx<0.25.0,>=0.15.4->langfuse)
      Downloading httpcore-0.17.3-py3-none-any.whl (74 kB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m74.5/74.5 kB[0m [31m3.2 MB/s[0m eta [36m0:00:00[0m
    [?25hRequirement already satisfied: idna in /usr/local/lib/python3.10/dist-packages (from httpx<0.25.0,>=0.15.4->langfuse) (3.4)
    Requirement already satisfied: sniffio in /usr/local/lib/python3.10/dist-packages (from httpx<0.25.0,>=0.15.4->langfuse) (1.3.0)
    Requirement already satisfied: iniconfig in /usr/local/lib/python3.10/dist-packages (from pytest<8.0.0,>=7.4.0->langfuse) (2.0.0)
    Requirement already satisfied: packaging in /usr/local/lib/python3.10/dist-packages (from pytest<8.0.0,>=7.4.0->langfuse) (23.1)
    Requirement already satisfied: pluggy<2.0,>=0.12 in /usr/local/lib/python3.10/dist-packages (from pytest<8.0.0,>=7.4.0->langfuse) (1.2.0)
    Requirement already satisfied: exceptiongroup>=1.0.0rc8 in /usr/local/lib/python3.10/dist-packages (from pytest<8.0.0,>=7.4.0->langfuse) (1.1.2)
    Requirement already satisfied: tomli>=1.0.0 in /usr/local/lib/python3.10/dist-packages (from pytest<8.0.0,>=7.4.0->langfuse) (2.0.1)
    Requirement already satisfied: six>=1.5 in /usr/local/lib/python3.10/dist-packages (from python-dateutil<3.0.0,>=2.8.0->langfuse) (1.16.0)
    Collecting h11<0.15,>=0.13 (from httpcore<0.18.0,>=0.15.0->httpx<0.25.0,>=0.15.4->langfuse)
      Downloading h11-0.14.0-py3-none-any.whl (58 kB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m58.3/58.3 kB[0m [31m4.5 MB/s[0m eta [36m0:00:00[0m
    [?25hRequirement already satisfied: anyio<5.0,>=3.0 in /usr/local/lib/python3.10/dist-packages (from httpcore<0.18.0,>=0.15.0->httpx<0.25.0,>=0.15.4->langfuse) (3.7.1)
    Installing collected packages: pytest, pydantic, h11, pytest-timeout, pytest-asyncio, httpcore, httpx, langfuse
      Attempting uninstall: pytest
        Found existing installation: pytest 7.2.2
        Uninstalling pytest-7.2.2:
          Successfully uninstalled pytest-7.2.2
      Attempting uninstall: pydantic
        Found existing installation: pydantic 1.10.11
        Uninstalling pydantic-1.10.11:
          Successfully uninstalled pydantic-1.10.11
    Successfully installed h11-0.14.0 httpcore-0.17.3 httpx-0.24.1 langfuse-0.0.40 pydantic-1.10.7 pytest-7.4.0 pytest-asyncio-0.21.1 pytest-timeout-2.1.0


Initialize the client with api keys and optionally your environment. In the example we are using the cloud environment which is also the default. The Python client can modify all entities in the Langfuse API and therefore requires the secret key.


```python
ENV_HOST = "https://cloud.langfuse.com"
ENV_SECRET_KEY = "sk-lf-..."
ENV_PUBLIC_KEY = "pk-lf-..."
```


```python
from langfuse import Langfuse

langfuse = Langfuse(ENV_PUBLIC_KEY, ENV_SECRET_KEY, ENV_HOST)
```

### Flushing

The langfuse client is built asynchronous to not add latency. Only when calling the flush function, the network requests to the langfuse backend will be executed.

Langfuse offers two different fush functions. `async_flush` returns a coroutine and hence can be used in async contexts such as this Notebook. `flush` is a synchronous function and takes care of asynchronous code in the background and is blocking.


```python
# result = await client.flush()
# returns a result and executes a coroutine in the background

result = await langfuse.async_flush() # returns a coroutine
print(result)
```

    {'status': 'success'}


## 2. Trace execution of backend

- Each backend execution is logged with a single `trace`.
- Each trace can contain multiple `observations` to log the individual steps of the execution.
  - Observations can be nested.
  - Observations can be of different types
    - `Events` are the basic building block. They are used to track discrete events in a trace.
    - `Spans` represent durations of units of work in a trace.
    - `Generations` are spans which are used to log generations of AI model. They contain additional metadata about the model and the prompt/completion and are specifically rendered in the langfuse UI.

### Traces

Traces are the top-level entity in the Langfuse API. They represent an execution flow in a LLM application usually triggered by an external event.

Traces can be created and updated.

`trace.create()` takes the following parameters:

- `name` (optional): identifier of the trace. Useful for sorting/filtering in the UI.
- `metadata` (optional): additional metadata of the trace. Can be any JSON object.
- `externalId` (optional): the id of the execution in the external system. Useful for linking traces to external systems. Frequently used to create scores without having access to the langfuse `traceId`.
- `userId` (optional): the id of the user who triggered the execution.


```python
from langfuse.api.model import CreateTrace

trace = langfuse.trace(CreateTrace(
    name = "docs-retrieval",
    userId = "user__935d7d1d-8625-4ef4-8651-544613e7bd22",
    metadata = {
        "env": "production",
        "email": "user@langfuse.com",
    }
))
```

### Span

Spans represent durations of units of work in a trace. We generated convenient SDK functions for generic spans as well as LLM spans.

`span.create()` take the following parameters:

- `startTime` (optional): the time at which the span started. If no startTime is provided, the current time will be used.
- `endTime` (optional): the time at which the span ended. Can also be set using `span.update()`.
- `name` (optional): identifier of the span. Useful for sorting/filtering in the UI.
- `metadata` (optional): additional metadata of the span. Can be any JSON object. Can also be set or updated using `span.update()`.
- `level` (optional): the level of the event. Can be `DEBUG`, `DEFAULT`, `WARNING` or `ERROR`. Used for sorting/filtering of traces with elevated error levels and for highlighting in the UI.
- `statusMessage` (optional): the status message of the event. Additional field for context of the event. E.g. the error message of an error event.
- `input` (optional): the input to the span. Can be any JSON object.
- `output` (optional): the output to the span. Can be any JSON object.


```python
import datetime
from langfuse.api.model import CreateSpan

retrievalStartTime = datetime.datetime.now()

# retrieveDocs = retrieveDoc()
# ...

span = trace.span(CreateSpan(
        name="embedding-search",
        startTime=retrievalStartTime,
        endTime=datetime.datetime.now(),
        metadata={"database": "pinecone"},
        input = {'query': 'This document entails the OKR goals for ACME'},
        output = {"response": "[{'name': 'OKR Engineering', 'content': 'The engineering department defined the following OKR goals...'},{'name': 'OKR Marketing', 'content': 'The marketing department defined the following OKR goals...'}]"}
    )
)
```

### Generation

Generations are used to log generations of AI model. They contain additional metadata about the model and the prompt/completion and are specifically rendered in the langfuse UI.

`generation.log()` take the following parameters:

- `startTime` (optional): the time at which the generation started.
- `endTime` (optional): the time at which the generation ended.
- `name` (optional): identifier of the generation. Useful for sorting/filtering in the UI.
- `model` (optional): the name of the model used for the generation
- `modelParameters` (optional): the parameters of the model used for the generation; can be any key-value pairs
- `prompt` (optional): the prompt used for the generation; can be any string or JSON object (recommended for chat models or other models that use structured input)
- `completion` (optional): the completion generated by the model
- `usage` (optional): the usage of the model during the generation; takes two optional key-value pairs: `promptTokens` and `completionTokens`
- `metadata` (optional): additional metadata of the generation. Can be any JSON object.
- `level` (optional): the level of the event. Can be `DEBUG`, `DEFAULT`, `WARNING` or `ERROR`. Used for sorting/filtering of traces with elevated error levels and for highlighting in the UI.
- `statusMessage` (optional): the status message of the event. Additional field for context of the event. E.g. the error message of an error event.


```python
from langfuse.api.model import CreateGeneration, Usage
import datetime

generationStartTime = datetime.datetime.now()

# chat_completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=[{"role": "user", "content": "Hello world"}])
# ...

trace.generation(CreateGeneration(
    name="summary-generation",
    startTime=generationStartTime,
    endTime=datetime.datetime.now(),
    model="gpt-3.5-turbo",
    modelParameters={"maxTokens": "1000", "temperature": "0.9"},
    prompt=[{"role": "system", "content": "You are a helpful assistant."}, {"role": "user", "content": "Please generate a summary of the following documents \nThe engineering department defined the following OKR goals...\nThe marketing department defined the following OKR goals..."}],
    completion="The Q3 OKRs contain goals for multiple teams...",
    usage=Usage(promptTokens=50, completionTokens = 49),
    metadata={"interface": "whatsapp"}
))
```

### Events

Events are used to track discrete events in a trace.

- `startTime`: the time at which the event started.
- `name` (optional): identifier of the event. Useful for sorting/filtering in the UI.
- `metadata` (optional): additional metadata of the event. JSON object.
- `level` (optional): the level of the event. Can be `DEBUG`, `DEFAULT`, `WARNING` or `ERROR`. Used for sorting/filtering of traces with elevated error levels and for highlighting in the UI.
- `statusMessage` (optional): the status message of the event. Additional field for context of the event. E.g. the error message of an error event.
- `input` (optional): the input to the event. Can be any JSON object.
- `output` (optional): the output to the event. Can be any JSON object.


```python
from langfuse.api.model import CreateEvent
import datetime

event = span.event(CreateEvent(
        name="chat-docs-retrieval",
        startTime=datetime.datetime.now(),
        metadata={"key": "value"},
        input = {"key": "value"},
        output = {"key": "value"}
    )
)
```

`span.update()` take the following parameters:

- `spanId`: the id of the span to update
- `endTime` (optional): the time at which the span ended
- `metadata` (optional): merges with existing metadata of the span. Can be any JSON object.

### Nesting of observations

Nesting of observations is helpful to structure the trace in a hierarchical way. This is especially helpful for complex chains and agents.

```
Simple example
- trace: chat-app-session
  - span: chat-interaction
    - event: get-user-profile
    - generation: chat-completion
```


```python
trace = langfuse.trace(CreateTrace(name = "chat-app-session"))
span = trace.span(CreateSpan(name = "chat-interaction"))
event = span.event(CreateEvent(name = "get-user-profile"))
generation = span.generation(CreateGeneration(name = "chat-completion"))
```

## 3. Collect scores

Scores are used to evaluate executions/traces. They are always attached to a single trace. If the score relates to a specific step of the trace, the score can optionally also be atatched to the observation to enable evaluating it specifically.

- `traceId`: the id of the trace to which the score should be attached
- `name`: identifier of the score, string
- `value`: the value of the score; float; optional: scale it to e.g. 0..1 to make it comparable to other scores
- `traceIdType` (optional): the type of the traceId. Can be `LANGFUSE` (default) or `EXTERNAL`. If `EXTERNAL` is used, the score will be attached to the trace with the given externalId.
- `comment` (optional): additional context/explanation of the score


```python
from langfuse.api.model import CreateScore


trace.score(CreateScore(
    name="user-explicit-feedback",
    value=1,
    comment="I like how personalized the response is"
))
```


```python
result = await langfuse.async_flush()
print(result)
```

    {'status': 'success'}


## Troubleshooting

If you encounter any issue, we are happy to help on [Discord](https://discord.gg/7NXusRtqYU) or shoot us an email: help@langfuse.com
