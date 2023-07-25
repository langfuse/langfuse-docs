# Python SDK

- [View as notebook on GitHub](https://github.com/langfuse/langfuse-docs/blob/main/src/python_sdk_docs.ipynb)
- [Open as notebook in Google Colab](http://colab.research.google.com/github/langfuse/langfuse-docs/blob/main/src/python_sdk_docs.ipynb)

# Integrating Langfuse
Most people write all the LLM chains and agents themselves. This section explains, how you can report LLM data to Langfuse while owning the APIs to your infrastructure such as LLM providers or databases. Below, you can explore how to integrate Langfuse with Langchain.

## 1. Initializing the client

The Langfuse SDKs are hosted on the pypi index.


```python
%pip install langfuse
```

    Collecting langfuse
      Downloading langfuse-0.0.52-py3-none-any.whl (37 kB)
    Requirement already satisfied: attrs>=21.3.0 in /usr/local/lib/python3.10/dist-packages (from langfuse) (23.1.0)
    Collecting httpx<0.25.0,>=0.15.4 (from langfuse)
      Downloading httpx-0.24.1-py3-none-any.whl (75 kB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m75.4/75.4 kB[0m [31m4.6 MB/s[0m eta [36m0:00:00[0m
    [?25hCollecting langchain<0.0.238,>=0.0.237 (from langfuse)
      Downloading langchain-0.0.237-py3-none-any.whl (1.3 MB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m1.3/1.3 MB[0m [31m15.4 MB/s[0m eta [36m0:00:00[0m
    [?25hCollecting pydantic==1.10.7 (from langfuse)
      Downloading pydantic-1.10.7-cp310-cp310-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (3.1 MB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m3.1/3.1 MB[0m [31m57.1 MB/s[0m eta [36m0:00:00[0m
    [?25hRequirement already satisfied: python-dateutil<3.0.0,>=2.8.0 in /usr/local/lib/python3.10/dist-packages (from langfuse) (2.8.2)
    Requirement already satisfied: typing-extensions>=4.2.0 in /usr/local/lib/python3.10/dist-packages (from pydantic==1.10.7->langfuse) (4.7.1)
    Requirement already satisfied: certifi in /usr/local/lib/python3.10/dist-packages (from httpx<0.25.0,>=0.15.4->langfuse) (2023.5.7)
    Collecting httpcore<0.18.0,>=0.15.0 (from httpx<0.25.0,>=0.15.4->langfuse)
      Downloading httpcore-0.17.3-py3-none-any.whl (74 kB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m74.5/74.5 kB[0m [31m6.7 MB/s[0m eta [36m0:00:00[0m
    [?25hRequirement already satisfied: idna in /usr/local/lib/python3.10/dist-packages (from httpx<0.25.0,>=0.15.4->langfuse) (3.4)
    Requirement already satisfied: sniffio in /usr/local/lib/python3.10/dist-packages (from httpx<0.25.0,>=0.15.4->langfuse) (1.3.0)
    Requirement already satisfied: PyYAML>=5.4.1 in /usr/local/lib/python3.10/dist-packages (from langchain<0.0.238,>=0.0.237->langfuse) (6.0.1)
    Requirement already satisfied: SQLAlchemy<3,>=1.4 in /usr/local/lib/python3.10/dist-packages (from langchain<0.0.238,>=0.0.237->langfuse) (2.0.19)
    Requirement already satisfied: aiohttp<4.0.0,>=3.8.3 in /usr/local/lib/python3.10/dist-packages (from langchain<0.0.238,>=0.0.237->langfuse) (3.8.4)
    Requirement already satisfied: async-timeout<5.0.0,>=4.0.0 in /usr/local/lib/python3.10/dist-packages (from langchain<0.0.238,>=0.0.237->langfuse) (4.0.2)
    Collecting dataclasses-json<0.6.0,>=0.5.7 (from langchain<0.0.238,>=0.0.237->langfuse)
      Downloading dataclasses_json-0.5.13-py3-none-any.whl (26 kB)
    Collecting langsmith<0.0.11,>=0.0.10 (from langchain<0.0.238,>=0.0.237->langfuse)
      Downloading langsmith-0.0.10-py3-none-any.whl (27 kB)
    Requirement already satisfied: numexpr<3.0.0,>=2.8.4 in /usr/local/lib/python3.10/dist-packages (from langchain<0.0.238,>=0.0.237->langfuse) (2.8.4)
    Requirement already satisfied: numpy<2,>=1 in /usr/local/lib/python3.10/dist-packages (from langchain<0.0.238,>=0.0.237->langfuse) (1.22.4)
    Collecting openapi-schema-pydantic<2.0,>=1.2 (from langchain<0.0.238,>=0.0.237->langfuse)
      Downloading openapi_schema_pydantic-1.2.4-py3-none-any.whl (90 kB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m90.0/90.0 kB[0m [31m7.8 MB/s[0m eta [36m0:00:00[0m
    [?25hRequirement already satisfied: requests<3,>=2 in /usr/local/lib/python3.10/dist-packages (from langchain<0.0.238,>=0.0.237->langfuse) (2.27.1)
    Requirement already satisfied: tenacity<9.0.0,>=8.1.0 in /usr/local/lib/python3.10/dist-packages (from langchain<0.0.238,>=0.0.237->langfuse) (8.2.2)
    Requirement already satisfied: six>=1.5 in /usr/local/lib/python3.10/dist-packages (from python-dateutil<3.0.0,>=2.8.0->langfuse) (1.16.0)
    Requirement already satisfied: charset-normalizer<4.0,>=2.0 in /usr/local/lib/python3.10/dist-packages (from aiohttp<4.0.0,>=3.8.3->langchain<0.0.238,>=0.0.237->langfuse) (2.0.12)
    Requirement already satisfied: multidict<7.0,>=4.5 in /usr/local/lib/python3.10/dist-packages (from aiohttp<4.0.0,>=3.8.3->langchain<0.0.238,>=0.0.237->langfuse) (6.0.4)
    Requirement already satisfied: yarl<2.0,>=1.0 in /usr/local/lib/python3.10/dist-packages (from aiohttp<4.0.0,>=3.8.3->langchain<0.0.238,>=0.0.237->langfuse) (1.9.2)
    Requirement already satisfied: frozenlist>=1.1.1 in /usr/local/lib/python3.10/dist-packages (from aiohttp<4.0.0,>=3.8.3->langchain<0.0.238,>=0.0.237->langfuse) (1.4.0)
    Requirement already satisfied: aiosignal>=1.1.2 in /usr/local/lib/python3.10/dist-packages (from aiohttp<4.0.0,>=3.8.3->langchain<0.0.238,>=0.0.237->langfuse) (1.3.1)
    Collecting marshmallow<4.0.0,>=3.18.0 (from dataclasses-json<0.6.0,>=0.5.7->langchain<0.0.238,>=0.0.237->langfuse)
      Downloading marshmallow-3.20.1-py3-none-any.whl (49 kB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m49.4/49.4 kB[0m [31m1.5 MB/s[0m eta [36m0:00:00[0m
    [?25hCollecting typing-inspect<1,>=0.4.0 (from dataclasses-json<0.6.0,>=0.5.7->langchain<0.0.238,>=0.0.237->langfuse)
      Downloading typing_inspect-0.9.0-py3-none-any.whl (8.8 kB)
    Collecting h11<0.15,>=0.13 (from httpcore<0.18.0,>=0.15.0->httpx<0.25.0,>=0.15.4->langfuse)
      Downloading h11-0.14.0-py3-none-any.whl (58 kB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m58.3/58.3 kB[0m [31m2.8 MB/s[0m eta [36m0:00:00[0m
    [?25hRequirement already satisfied: anyio<5.0,>=3.0 in /usr/local/lib/python3.10/dist-packages (from httpcore<0.18.0,>=0.15.0->httpx<0.25.0,>=0.15.4->langfuse) (3.7.1)
    Requirement already satisfied: urllib3<1.27,>=1.21.1 in /usr/local/lib/python3.10/dist-packages (from requests<3,>=2->langchain<0.0.238,>=0.0.237->langfuse) (1.26.16)
    Requirement already satisfied: greenlet!=0.4.17 in /usr/local/lib/python3.10/dist-packages (from SQLAlchemy<3,>=1.4->langchain<0.0.238,>=0.0.237->langfuse) (2.0.2)
    Requirement already satisfied: exceptiongroup in /usr/local/lib/python3.10/dist-packages (from anyio<5.0,>=3.0->httpcore<0.18.0,>=0.15.0->httpx<0.25.0,>=0.15.4->langfuse) (1.1.2)
    Requirement already satisfied: packaging>=17.0 in /usr/local/lib/python3.10/dist-packages (from marshmallow<4.0.0,>=3.18.0->dataclasses-json<0.6.0,>=0.5.7->langchain<0.0.238,>=0.0.237->langfuse) (23.1)
    Collecting mypy-extensions>=0.3.0 (from typing-inspect<1,>=0.4.0->dataclasses-json<0.6.0,>=0.5.7->langchain<0.0.238,>=0.0.237->langfuse)
      Downloading mypy_extensions-1.0.0-py3-none-any.whl (4.7 kB)
    Installing collected packages: pydantic, mypy-extensions, marshmallow, h11, typing-inspect, openapi-schema-pydantic, langsmith, httpcore, httpx, dataclasses-json, langchain, langfuse
      Attempting uninstall: pydantic
        Found existing installation: pydantic 1.10.11
        Uninstalling pydantic-1.10.11:
          Successfully uninstalled pydantic-1.10.11
    Successfully installed dataclasses-json-0.5.13 h11-0.14.0 httpcore-0.17.3 httpx-0.24.1 langchain-0.0.237 langfuse-0.0.52 langsmith-0.0.10 marshmallow-3.20.1 mypy-extensions-1.0.0 openapi-schema-pydantic-1.2.4 pydantic-1.10.7 typing-inspect-0.9.0


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
- `externalId` (optional): the id of the execution in the external system. Useful for linking traces to external systems. Frequently used to create scores without having access to the Langfuse `traceId`.
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




    <langfuse.client.StatefulGenerationClient at 0x7f5b914d52a0>



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




    <langfuse.client.StatefulClient at 0x7f5b914d6200>




```python
result = await langfuse.async_flush()
print(result)
```

    {'status': 'success'}


### Flushing

The Langfuse client is built asynchronous to not add latency. Only when calling the flush function, the network requests to the langfuse backend will be executed.

Langfuse offers two different fush functions. `async_flush` returns a coroutine and hence can be used in async contexts such as this Notebook. `flush` is a synchronous function and takes care of asynchronous code in the background and is blocking.


```python
# result = await client.flush()
# returns a result and executes a coroutine in the background

result = await langfuse.async_flush() # returns a coroutine
print(result)
```

    {'status': 'success'}


# Integrate Langfuse with Langchain
Many people use Langchain to get started fast with LLM apps. This section explains, how you can integrate Langchain with Langfuse.

## 1. Initializing the client

The Langfuse SDKs are hosted on the pypi index.


```python
%pip install langfuse
```

    Requirement already satisfied: langfuse in /usr/local/lib/python3.10/dist-packages (0.0.52)
    Requirement already satisfied: attrs>=21.3.0 in /usr/local/lib/python3.10/dist-packages (from langfuse) (23.1.0)
    Requirement already satisfied: httpx<0.25.0,>=0.15.4 in /usr/local/lib/python3.10/dist-packages (from langfuse) (0.24.1)
    Requirement already satisfied: langchain<0.0.238,>=0.0.237 in /usr/local/lib/python3.10/dist-packages (from langfuse) (0.0.237)
    Requirement already satisfied: pydantic==1.10.7 in /usr/local/lib/python3.10/dist-packages (from langfuse) (1.10.7)
    Requirement already satisfied: python-dateutil<3.0.0,>=2.8.0 in /usr/local/lib/python3.10/dist-packages (from langfuse) (2.8.2)
    Requirement already satisfied: typing-extensions>=4.2.0 in /usr/local/lib/python3.10/dist-packages (from pydantic==1.10.7->langfuse) (4.7.1)
    Requirement already satisfied: certifi in /usr/local/lib/python3.10/dist-packages (from httpx<0.25.0,>=0.15.4->langfuse) (2023.5.7)
    Requirement already satisfied: httpcore<0.18.0,>=0.15.0 in /usr/local/lib/python3.10/dist-packages (from httpx<0.25.0,>=0.15.4->langfuse) (0.17.3)
    Requirement already satisfied: idna in /usr/local/lib/python3.10/dist-packages (from httpx<0.25.0,>=0.15.4->langfuse) (3.4)
    Requirement already satisfied: sniffio in /usr/local/lib/python3.10/dist-packages (from httpx<0.25.0,>=0.15.4->langfuse) (1.3.0)
    Requirement already satisfied: PyYAML>=5.4.1 in /usr/local/lib/python3.10/dist-packages (from langchain<0.0.238,>=0.0.237->langfuse) (6.0.1)
    Requirement already satisfied: SQLAlchemy<3,>=1.4 in /usr/local/lib/python3.10/dist-packages (from langchain<0.0.238,>=0.0.237->langfuse) (2.0.19)
    Requirement already satisfied: aiohttp<4.0.0,>=3.8.3 in /usr/local/lib/python3.10/dist-packages (from langchain<0.0.238,>=0.0.237->langfuse) (3.8.4)
    Requirement already satisfied: async-timeout<5.0.0,>=4.0.0 in /usr/local/lib/python3.10/dist-packages (from langchain<0.0.238,>=0.0.237->langfuse) (4.0.2)
    Requirement already satisfied: dataclasses-json<0.6.0,>=0.5.7 in /usr/local/lib/python3.10/dist-packages (from langchain<0.0.238,>=0.0.237->langfuse) (0.5.13)
    Requirement already satisfied: langsmith<0.0.11,>=0.0.10 in /usr/local/lib/python3.10/dist-packages (from langchain<0.0.238,>=0.0.237->langfuse) (0.0.10)
    Requirement already satisfied: numexpr<3.0.0,>=2.8.4 in /usr/local/lib/python3.10/dist-packages (from langchain<0.0.238,>=0.0.237->langfuse) (2.8.4)
    Requirement already satisfied: numpy<2,>=1 in /usr/local/lib/python3.10/dist-packages (from langchain<0.0.238,>=0.0.237->langfuse) (1.22.4)
    Requirement already satisfied: openapi-schema-pydantic<2.0,>=1.2 in /usr/local/lib/python3.10/dist-packages (from langchain<0.0.238,>=0.0.237->langfuse) (1.2.4)
    Requirement already satisfied: requests<3,>=2 in /usr/local/lib/python3.10/dist-packages (from langchain<0.0.238,>=0.0.237->langfuse) (2.27.1)
    Requirement already satisfied: tenacity<9.0.0,>=8.1.0 in /usr/local/lib/python3.10/dist-packages (from langchain<0.0.238,>=0.0.237->langfuse) (8.2.2)
    Requirement already satisfied: six>=1.5 in /usr/local/lib/python3.10/dist-packages (from python-dateutil<3.0.0,>=2.8.0->langfuse) (1.16.0)
    Requirement already satisfied: charset-normalizer<4.0,>=2.0 in /usr/local/lib/python3.10/dist-packages (from aiohttp<4.0.0,>=3.8.3->langchain<0.0.238,>=0.0.237->langfuse) (2.0.12)
    Requirement already satisfied: multidict<7.0,>=4.5 in /usr/local/lib/python3.10/dist-packages (from aiohttp<4.0.0,>=3.8.3->langchain<0.0.238,>=0.0.237->langfuse) (6.0.4)
    Requirement already satisfied: yarl<2.0,>=1.0 in /usr/local/lib/python3.10/dist-packages (from aiohttp<4.0.0,>=3.8.3->langchain<0.0.238,>=0.0.237->langfuse) (1.9.2)
    Requirement already satisfied: frozenlist>=1.1.1 in /usr/local/lib/python3.10/dist-packages (from aiohttp<4.0.0,>=3.8.3->langchain<0.0.238,>=0.0.237->langfuse) (1.4.0)
    Requirement already satisfied: aiosignal>=1.1.2 in /usr/local/lib/python3.10/dist-packages (from aiohttp<4.0.0,>=3.8.3->langchain<0.0.238,>=0.0.237->langfuse) (1.3.1)
    Requirement already satisfied: marshmallow<4.0.0,>=3.18.0 in /usr/local/lib/python3.10/dist-packages (from dataclasses-json<0.6.0,>=0.5.7->langchain<0.0.238,>=0.0.237->langfuse) (3.20.1)
    Requirement already satisfied: typing-inspect<1,>=0.4.0 in /usr/local/lib/python3.10/dist-packages (from dataclasses-json<0.6.0,>=0.5.7->langchain<0.0.238,>=0.0.237->langfuse) (0.9.0)
    Requirement already satisfied: h11<0.15,>=0.13 in /usr/local/lib/python3.10/dist-packages (from httpcore<0.18.0,>=0.15.0->httpx<0.25.0,>=0.15.4->langfuse) (0.14.0)
    Requirement already satisfied: anyio<5.0,>=3.0 in /usr/local/lib/python3.10/dist-packages (from httpcore<0.18.0,>=0.15.0->httpx<0.25.0,>=0.15.4->langfuse) (3.7.1)
    Requirement already satisfied: urllib3<1.27,>=1.21.1 in /usr/local/lib/python3.10/dist-packages (from requests<3,>=2->langchain<0.0.238,>=0.0.237->langfuse) (1.26.16)
    Requirement already satisfied: greenlet!=0.4.17 in /usr/local/lib/python3.10/dist-packages (from SQLAlchemy<3,>=1.4->langchain<0.0.238,>=0.0.237->langfuse) (2.0.2)
    Requirement already satisfied: exceptiongroup in /usr/local/lib/python3.10/dist-packages (from anyio<5.0,>=3.0->httpcore<0.18.0,>=0.15.0->httpx<0.25.0,>=0.15.4->langfuse) (1.1.2)
    Requirement already satisfied: packaging>=17.0 in /usr/local/lib/python3.10/dist-packages (from marshmallow<4.0.0,>=3.18.0->dataclasses-json<0.6.0,>=0.5.7->langchain<0.0.238,>=0.0.237->langfuse) (23.1)
    Requirement already satisfied: mypy-extensions>=0.3.0 in /usr/local/lib/python3.10/dist-packages (from typing-inspect<1,>=0.4.0->dataclasses-json<0.6.0,>=0.5.7->langchain<0.0.238,>=0.0.237->langfuse) (1.0.0)


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

### 2. Langchain setup


```python
import os
os.environ["OPENAI_API_KEY"] = 'sk-...'
```


```python
%pip install langchain openai
```

    Requirement already satisfied: langchain in /usr/local/lib/python3.10/dist-packages (0.0.237)
    Collecting openai
      Downloading openai-0.27.8-py3-none-any.whl (73 kB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m73.6/73.6 kB[0m [31m2.6 MB/s[0m eta [36m0:00:00[0m
    [?25hRequirement already satisfied: PyYAML>=5.4.1 in /usr/local/lib/python3.10/dist-packages (from langchain) (6.0.1)
    Requirement already satisfied: SQLAlchemy<3,>=1.4 in /usr/local/lib/python3.10/dist-packages (from langchain) (2.0.19)
    Requirement already satisfied: aiohttp<4.0.0,>=3.8.3 in /usr/local/lib/python3.10/dist-packages (from langchain) (3.8.4)
    Requirement already satisfied: async-timeout<5.0.0,>=4.0.0 in /usr/local/lib/python3.10/dist-packages (from langchain) (4.0.2)
    Requirement already satisfied: dataclasses-json<0.6.0,>=0.5.7 in /usr/local/lib/python3.10/dist-packages (from langchain) (0.5.13)
    Requirement already satisfied: langsmith<0.0.11,>=0.0.10 in /usr/local/lib/python3.10/dist-packages (from langchain) (0.0.10)
    Requirement already satisfied: numexpr<3.0.0,>=2.8.4 in /usr/local/lib/python3.10/dist-packages (from langchain) (2.8.4)
    Requirement already satisfied: numpy<2,>=1 in /usr/local/lib/python3.10/dist-packages (from langchain) (1.22.4)
    Requirement already satisfied: openapi-schema-pydantic<2.0,>=1.2 in /usr/local/lib/python3.10/dist-packages (from langchain) (1.2.4)
    Requirement already satisfied: pydantic<2,>=1 in /usr/local/lib/python3.10/dist-packages (from langchain) (1.10.7)
    Requirement already satisfied: requests<3,>=2 in /usr/local/lib/python3.10/dist-packages (from langchain) (2.27.1)
    Requirement already satisfied: tenacity<9.0.0,>=8.1.0 in /usr/local/lib/python3.10/dist-packages (from langchain) (8.2.2)
    Requirement already satisfied: tqdm in /usr/local/lib/python3.10/dist-packages (from openai) (4.65.0)
    Requirement already satisfied: attrs>=17.3.0 in /usr/local/lib/python3.10/dist-packages (from aiohttp<4.0.0,>=3.8.3->langchain) (23.1.0)
    Requirement already satisfied: charset-normalizer<4.0,>=2.0 in /usr/local/lib/python3.10/dist-packages (from aiohttp<4.0.0,>=3.8.3->langchain) (2.0.12)
    Requirement already satisfied: multidict<7.0,>=4.5 in /usr/local/lib/python3.10/dist-packages (from aiohttp<4.0.0,>=3.8.3->langchain) (6.0.4)
    Requirement already satisfied: yarl<2.0,>=1.0 in /usr/local/lib/python3.10/dist-packages (from aiohttp<4.0.0,>=3.8.3->langchain) (1.9.2)
    Requirement already satisfied: frozenlist>=1.1.1 in /usr/local/lib/python3.10/dist-packages (from aiohttp<4.0.0,>=3.8.3->langchain) (1.4.0)
    Requirement already satisfied: aiosignal>=1.1.2 in /usr/local/lib/python3.10/dist-packages (from aiohttp<4.0.0,>=3.8.3->langchain) (1.3.1)
    Requirement already satisfied: marshmallow<4.0.0,>=3.18.0 in /usr/local/lib/python3.10/dist-packages (from dataclasses-json<0.6.0,>=0.5.7->langchain) (3.20.1)
    Requirement already satisfied: typing-inspect<1,>=0.4.0 in /usr/local/lib/python3.10/dist-packages (from dataclasses-json<0.6.0,>=0.5.7->langchain) (0.9.0)
    Requirement already satisfied: typing-extensions>=4.2.0 in /usr/local/lib/python3.10/dist-packages (from pydantic<2,>=1->langchain) (4.7.1)
    Requirement already satisfied: urllib3<1.27,>=1.21.1 in /usr/local/lib/python3.10/dist-packages (from requests<3,>=2->langchain) (1.26.16)
    Requirement already satisfied: certifi>=2017.4.17 in /usr/local/lib/python3.10/dist-packages (from requests<3,>=2->langchain) (2023.5.7)
    Requirement already satisfied: idna<4,>=2.5 in /usr/local/lib/python3.10/dist-packages (from requests<3,>=2->langchain) (3.4)
    Requirement already satisfied: greenlet!=0.4.17 in /usr/local/lib/python3.10/dist-packages (from SQLAlchemy<3,>=1.4->langchain) (2.0.2)
    Requirement already satisfied: packaging>=17.0 in /usr/local/lib/python3.10/dist-packages (from marshmallow<4.0.0,>=3.18.0->dataclasses-json<0.6.0,>=0.5.7->langchain) (23.1)
    Requirement already satisfied: mypy-extensions>=0.3.0 in /usr/local/lib/python3.10/dist-packages (from typing-inspect<1,>=0.4.0->dataclasses-json<0.6.0,>=0.5.7->langchain) (1.0.0)
    Installing collected packages: openai
    Successfully installed openai-0.27.8



```python
# further imports
from langchain.llms import OpenAI
from langchain.chains import LLMChain, SimpleSequentialChain
from langchain.prompts import PromptTemplate
from langfuse.callback import CallbackHandler

```

## 3. Sequential Chain



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



## 4. QA Retrieval


```python
import os
os.environ["SERPAPI_API_KEY"] = '...'
```


```python
%pip install unstructured chromadb tiktoken google-search-results
```

    Collecting unstructured
      Downloading unstructured-0.8.1-py3-none-any.whl (1.4 MB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m1.4/1.4 MB[0m [31m14.9 MB/s[0m eta [36m0:00:00[0m
    [?25hCollecting chromadb
      Downloading chromadb-0.4.3-py3-none-any.whl (399 kB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m399.0/399.0 kB[0m [31m34.3 MB/s[0m eta [36m0:00:00[0m
    [?25hCollecting tiktoken
      Downloading tiktoken-0.4.0-cp310-cp310-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (1.7 MB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m1.7/1.7 MB[0m [31m84.9 MB/s[0m eta [36m0:00:00[0m
    [?25hCollecting google-search-results
      Downloading google_search_results-2.4.2.tar.gz (18 kB)
      Preparing metadata (setup.py) ... [?25l[?25hdone
    Requirement already satisfied: chardet in /usr/local/lib/python3.10/dist-packages (from unstructured) (4.0.0)
    Collecting filetype (from unstructured)
      Downloading filetype-1.2.0-py2.py3-none-any.whl (19 kB)
    Requirement already satisfied: lxml in /usr/local/lib/python3.10/dist-packages (from unstructured) (4.9.3)
    Collecting msg-parser (from unstructured)
      Downloading msg_parser-1.2.0-py2.py3-none-any.whl (101 kB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m101.8/101.8 kB[0m [31m11.7 MB/s[0m eta [36m0:00:00[0m
    [?25hRequirement already satisfied: nltk in /usr/local/lib/python3.10/dist-packages (from unstructured) (3.8.1)
    Requirement already satisfied: openpyxl in /usr/local/lib/python3.10/dist-packages (from unstructured) (3.0.10)
    Requirement already satisfied: pandas in /usr/local/lib/python3.10/dist-packages (from unstructured) (1.5.3)
    Collecting pdf2image (from unstructured)
      Downloading pdf2image-1.16.3-py3-none-any.whl (11 kB)
    Collecting pdfminer.six (from unstructured)
      Downloading pdfminer.six-20221105-py3-none-any.whl (5.6 MB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m5.6/5.6 MB[0m [31m76.0 MB/s[0m eta [36m0:00:00[0m
    [?25hRequirement already satisfied: pillow in /usr/local/lib/python3.10/dist-packages (from unstructured) (8.4.0)
    Collecting pypandoc (from unstructured)
      Downloading pypandoc-1.11-py3-none-any.whl (20 kB)
    Collecting python-docx (from unstructured)
      Downloading python-docx-0.8.11.tar.gz (5.6 MB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m5.6/5.6 MB[0m [31m113.3 MB/s[0m eta [36m0:00:00[0m
    [?25h  Preparing metadata (setup.py) ... [?25l[?25hdone
    Collecting python-pptx (from unstructured)
      Downloading python-pptx-0.6.21.tar.gz (10.1 MB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m10.1/10.1 MB[0m [31m97.8 MB/s[0m eta [36m0:00:00[0m
    [?25h  Preparing metadata (setup.py) ... [?25l[?25hdone
    Collecting python-magic (from unstructured)
      Downloading python_magic-0.4.27-py2.py3-none-any.whl (13 kB)
    Requirement already satisfied: markdown in /usr/local/lib/python3.10/dist-packages (from unstructured) (3.4.3)
    Requirement already satisfied: requests in /usr/local/lib/python3.10/dist-packages (from unstructured) (2.27.1)
    Requirement already satisfied: tabulate in /usr/local/lib/python3.10/dist-packages (from unstructured) (0.9.0)
    Requirement already satisfied: xlrd in /usr/local/lib/python3.10/dist-packages (from unstructured) (2.0.1)
    Collecting requests (from unstructured)
      Downloading requests-2.31.0-py3-none-any.whl (62 kB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m62.6/62.6 kB[0m [31m7.7 MB/s[0m eta [36m0:00:00[0m
    [?25hRequirement already satisfied: pydantic<2.0,>=1.9 in /usr/local/lib/python3.10/dist-packages (from chromadb) (1.10.7)
    Collecting chroma-hnswlib==0.7.1 (from chromadb)
      Downloading chroma-hnswlib-0.7.1.tar.gz (30 kB)
      Installing build dependencies ... [?25l[?25hdone
      Getting requirements to build wheel ... [?25l[?25hdone
      Preparing metadata (pyproject.toml) ... [?25l[?25hdone
    Collecting fastapi<0.100.0,>=0.95.2 (from chromadb)
      Downloading fastapi-0.99.1-py3-none-any.whl (58 kB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m58.4/58.4 kB[0m [31m6.4 MB/s[0m eta [36m0:00:00[0m
    [?25hCollecting uvicorn[standard]>=0.18.3 (from chromadb)
      Downloading uvicorn-0.23.1-py3-none-any.whl (59 kB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m59.5/59.5 kB[0m [31m5.2 MB/s[0m eta [36m0:00:00[0m
    [?25hRequirement already satisfied: numpy>=1.21.6 in /usr/local/lib/python3.10/dist-packages (from chromadb) (1.22.4)
    Collecting posthog>=2.4.0 (from chromadb)
      Downloading posthog-3.0.1-py2.py3-none-any.whl (37 kB)
    Requirement already satisfied: typing-extensions>=4.5.0 in /usr/local/lib/python3.10/dist-packages (from chromadb) (4.7.1)
    Collecting pulsar-client>=3.1.0 (from chromadb)
      Downloading pulsar_client-3.2.0-cp310-cp310-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (5.3 MB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m5.3/5.3 MB[0m [31m109.5 MB/s[0m eta [36m0:00:00[0m
    [?25hCollecting onnxruntime>=1.14.1 (from chromadb)
      Downloading onnxruntime-1.15.1-cp310-cp310-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (5.9 MB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m5.9/5.9 MB[0m [31m110.6 MB/s[0m eta [36m0:00:00[0m
    [?25hCollecting tokenizers>=0.13.2 (from chromadb)
      Downloading tokenizers-0.13.3-cp310-cp310-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (7.8 MB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m7.8/7.8 MB[0m [31m27.7 MB/s[0m eta [36m0:00:00[0m
    [?25hCollecting pypika>=0.48.9 (from chromadb)
      Downloading PyPika-0.48.9.tar.gz (67 kB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m67.3/67.3 kB[0m [31m7.4 MB/s[0m eta [36m0:00:00[0m
    [?25h  Installing build dependencies ... [?25l[?25hdone
      Getting requirements to build wheel ... [?25l[?25hdone
      Preparing metadata (pyproject.toml) ... [?25l[?25hdone
    Requirement already satisfied: tqdm>=4.65.0 in /usr/local/lib/python3.10/dist-packages (from chromadb) (4.65.0)
    Collecting overrides>=7.3.1 (from chromadb)
      Downloading overrides-7.3.1-py3-none-any.whl (17 kB)
    Requirement already satisfied: importlib-resources in /usr/local/lib/python3.10/dist-packages (from chromadb) (6.0.0)
    Requirement already satisfied: regex>=2022.1.18 in /usr/local/lib/python3.10/dist-packages (from tiktoken) (2022.10.31)
    Collecting starlette<0.28.0,>=0.27.0 (from fastapi<0.100.0,>=0.95.2->chromadb)
      Downloading starlette-0.27.0-py3-none-any.whl (66 kB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m67.0/67.0 kB[0m [31m4.8 MB/s[0m eta [36m0:00:00[0m
    [?25hCollecting coloredlogs (from onnxruntime>=1.14.1->chromadb)
      Downloading coloredlogs-15.0.1-py2.py3-none-any.whl (46 kB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m46.0/46.0 kB[0m [31m5.0 MB/s[0m eta [36m0:00:00[0m
    [?25hRequirement already satisfied: flatbuffers in /usr/local/lib/python3.10/dist-packages (from onnxruntime>=1.14.1->chromadb) (23.5.26)
    Requirement already satisfied: packaging in /usr/local/lib/python3.10/dist-packages (from onnxruntime>=1.14.1->chromadb) (23.1)
    Requirement already satisfied: protobuf in /usr/local/lib/python3.10/dist-packages (from onnxruntime>=1.14.1->chromadb) (3.20.3)
    Requirement already satisfied: sympy in /usr/local/lib/python3.10/dist-packages (from onnxruntime>=1.14.1->chromadb) (1.11.1)
    Requirement already satisfied: python-dateutil>=2.8.1 in /usr/local/lib/python3.10/dist-packages (from pandas->unstructured) (2.8.2)
    Requirement already satisfied: pytz>=2020.1 in /usr/local/lib/python3.10/dist-packages (from pandas->unstructured) (2022.7.1)
    Requirement already satisfied: six>=1.5 in /usr/local/lib/python3.10/dist-packages (from posthog>=2.4.0->chromadb) (1.16.0)
    Collecting monotonic>=1.5 (from posthog>=2.4.0->chromadb)
      Downloading monotonic-1.6-py2.py3-none-any.whl (8.2 kB)
    Collecting backoff>=1.10.0 (from posthog>=2.4.0->chromadb)
      Downloading backoff-2.2.1-py3-none-any.whl (15 kB)
    Requirement already satisfied: certifi in /usr/local/lib/python3.10/dist-packages (from pulsar-client>=3.1.0->chromadb) (2023.5.7)
    Requirement already satisfied: charset-normalizer<4,>=2 in /usr/local/lib/python3.10/dist-packages (from requests->unstructured) (2.0.12)
    Requirement already satisfied: idna<4,>=2.5 in /usr/local/lib/python3.10/dist-packages (from requests->unstructured) (3.4)
    Requirement already satisfied: urllib3<3,>=1.21.1 in /usr/local/lib/python3.10/dist-packages (from requests->unstructured) (1.26.16)
    Requirement already satisfied: click>=7.0 in /usr/local/lib/python3.10/dist-packages (from uvicorn[standard]>=0.18.3->chromadb) (8.1.6)
    Requirement already satisfied: h11>=0.8 in /usr/local/lib/python3.10/dist-packages (from uvicorn[standard]>=0.18.3->chromadb) (0.14.0)
    Collecting httptools>=0.5.0 (from uvicorn[standard]>=0.18.3->chromadb)
      Downloading httptools-0.6.0-cp310-cp310-manylinux_2_5_x86_64.manylinux1_x86_64.manylinux_2_17_x86_64.manylinux2014_x86_64.whl (428 kB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m428.8/428.8 kB[0m [31m37.8 MB/s[0m eta [36m0:00:00[0m
    [?25hCollecting python-dotenv>=0.13 (from uvicorn[standard]>=0.18.3->chromadb)
      Downloading python_dotenv-1.0.0-py3-none-any.whl (19 kB)
    Requirement already satisfied: pyyaml>=5.1 in /usr/local/lib/python3.10/dist-packages (from uvicorn[standard]>=0.18.3->chromadb) (6.0.1)
    Collecting uvloop!=0.15.0,!=0.15.1,>=0.14.0 (from uvicorn[standard]>=0.18.3->chromadb)
      Downloading uvloop-0.17.0-cp310-cp310-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (4.1 MB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m4.1/4.1 MB[0m [31m83.0 MB/s[0m eta [36m0:00:00[0m
    [?25hCollecting watchfiles>=0.13 (from uvicorn[standard]>=0.18.3->chromadb)
      Downloading watchfiles-0.19.0-cp37-abi3-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (1.3 MB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m1.3/1.3 MB[0m [31m59.2 MB/s[0m eta [36m0:00:00[0m
    [?25hCollecting websockets>=10.4 (from uvicorn[standard]>=0.18.3->chromadb)
      Downloading websockets-11.0.3-cp310-cp310-manylinux_2_5_x86_64.manylinux1_x86_64.manylinux_2_17_x86_64.manylinux2014_x86_64.whl (129 kB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m129.9/129.9 kB[0m [31m13.1 MB/s[0m eta [36m0:00:00[0m
    [?25hCollecting olefile>=0.46 (from msg-parser->unstructured)
      Downloading olefile-0.46.zip (112 kB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m112.2/112.2 kB[0m [31m11.4 MB/s[0m eta [36m0:00:00[0m
    [?25h  Preparing metadata (setup.py) ... [?25l[?25hdone
    Requirement already satisfied: joblib in /usr/local/lib/python3.10/dist-packages (from nltk->unstructured) (1.3.1)
    Requirement already satisfied: et-xmlfile in /usr/local/lib/python3.10/dist-packages (from openpyxl->unstructured) (1.1.0)
    Collecting cryptography>=36.0.0 (from pdfminer.six->unstructured)
      Downloading cryptography-41.0.2-cp37-abi3-manylinux_2_28_x86_64.whl (4.3 MB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m4.3/4.3 MB[0m [31m73.1 MB/s[0m eta [36m0:00:00[0m
    [?25hCollecting XlsxWriter>=0.5.7 (from python-pptx->unstructured)
      Downloading XlsxWriter-3.1.2-py3-none-any.whl (153 kB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m153.0/153.0 kB[0m [31m16.3 MB/s[0m eta [36m0:00:00[0m
    [?25hRequirement already satisfied: cffi>=1.12 in /usr/local/lib/python3.10/dist-packages (from cryptography>=36.0.0->pdfminer.six->unstructured) (1.15.1)
    Requirement already satisfied: anyio<5,>=3.4.0 in /usr/local/lib/python3.10/dist-packages (from starlette<0.28.0,>=0.27.0->fastapi<0.100.0,>=0.95.2->chromadb) (3.7.1)
    Collecting humanfriendly>=9.1 (from coloredlogs->onnxruntime>=1.14.1->chromadb)
      Downloading humanfriendly-10.0-py2.py3-none-any.whl (86 kB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m86.8/86.8 kB[0m [31m8.5 MB/s[0m eta [36m0:00:00[0m
    [?25hRequirement already satisfied: mpmath>=0.19 in /usr/local/lib/python3.10/dist-packages (from sympy->onnxruntime>=1.14.1->chromadb) (1.3.0)
    Requirement already satisfied: sniffio>=1.1 in /usr/local/lib/python3.10/dist-packages (from anyio<5,>=3.4.0->starlette<0.28.0,>=0.27.0->fastapi<0.100.0,>=0.95.2->chromadb) (1.3.0)
    Requirement already satisfied: exceptiongroup in /usr/local/lib/python3.10/dist-packages (from anyio<5,>=3.4.0->starlette<0.28.0,>=0.27.0->fastapi<0.100.0,>=0.95.2->chromadb) (1.1.2)
    Requirement already satisfied: pycparser in /usr/local/lib/python3.10/dist-packages (from cffi>=1.12->cryptography>=36.0.0->pdfminer.six->unstructured) (2.21)
    Building wheels for collected packages: chroma-hnswlib, google-search-results, pypika, python-docx, python-pptx, olefile
      Building wheel for chroma-hnswlib (pyproject.toml) ... [?25l[?25hdone
      Created wheel for chroma-hnswlib: filename=chroma_hnswlib-0.7.1-cp310-cp310-linux_x86_64.whl size=2272522 sha256=f78d1b4068e5b604729287f9badff77c290005bdaf1e9162981794f91050f06f
      Stored in directory: /root/.cache/pip/wheels/ad/f2/d2/3f32228e9f4713a9f32a468de8bbc3c642f7805ebef888418b
      Building wheel for google-search-results (setup.py) ... [?25l[?25hdone
      Created wheel for google-search-results: filename=google_search_results-2.4.2-py3-none-any.whl size=32002 sha256=92ecc1c62eb32e3427bc7829811b7bef244d21e1ff0038a40578d3caeb2e293a
      Stored in directory: /root/.cache/pip/wheels/d3/b2/c3/03302d12bb44a2cdff3c9371f31b72c0c4e84b8d2285eeac53
      Building wheel for pypika (pyproject.toml) ... [?25l[?25hdone
      Created wheel for pypika: filename=PyPika-0.48.9-py2.py3-none-any.whl size=53723 sha256=36d34a90f5d37f52fe073824b32f83a4b02472f3cb1463852cdc3abf5d36acfe
      Stored in directory: /root/.cache/pip/wheels/e1/26/51/d0bffb3d2fd82256676d7ad3003faea3bd6dddc9577af665f4
      Building wheel for python-docx (setup.py) ... [?25l[?25hdone
      Created wheel for python-docx: filename=python_docx-0.8.11-py3-none-any.whl size=184491 sha256=24a2659a30e0493f55649bcdff101bee6cf9a049e1d0399510efec65b98efb4b
      Stored in directory: /root/.cache/pip/wheels/80/27/06/837436d4c3bd989b957a91679966f207bfd71d358d63a8194d
      Building wheel for python-pptx (setup.py) ... [?25l[?25hdone
      Created wheel for python-pptx: filename=python_pptx-0.6.21-py3-none-any.whl size=470935 sha256=e382cb3f16e1b696912e663ea9d446f830d44b66095dbb5e321b936cef726ad2
      Stored in directory: /root/.cache/pip/wheels/ea/dd/74/01b3ec7256a0800b99384e9a0f7620e358afc3a51a59bf9b49
      Building wheel for olefile (setup.py) ... [?25l[?25hdone
      Created wheel for olefile: filename=olefile-0.46-py2.py3-none-any.whl size=35417 sha256=a6e393c1c04225a3ae09e76c8ae827d0bdd2848e2900abddae320fc636878445
      Stored in directory: /root/.cache/pip/wheels/02/39/c0/9eb1f7a42b4b38f6f333b6314d4ed11c46f12a0f7b78194f0d
    Successfully built chroma-hnswlib google-search-results pypika python-docx python-pptx olefile
    Installing collected packages: tokenizers, pypika, monotonic, filetype, XlsxWriter, websockets, uvloop, uvicorn, requests, python-magic, python-dotenv, python-docx, pypandoc, pulsar-client, pdf2image, overrides, olefile, humanfriendly, httptools, chroma-hnswlib, backoff, watchfiles, tiktoken, starlette, python-pptx, posthog, msg-parser, google-search-results, cryptography, coloredlogs, pdfminer.six, onnxruntime, fastapi, unstructured, chromadb
      Attempting uninstall: requests
        Found existing installation: requests 2.27.1
        Uninstalling requests-2.27.1:
          Successfully uninstalled requests-2.27.1
      Attempting uninstall: cryptography
        Found existing installation: cryptography 3.4.8
        Uninstalling cryptography-3.4.8:
          Successfully uninstalled cryptography-3.4.8
    [31mERROR: pip's dependency resolver does not currently take into account all the packages that are installed. This behaviour is the source of the following dependency conflicts.
    google-colab 1.0.0 requires requests==2.27.1, but you have requests 2.31.0 which is incompatible.[0m[31m
    [0mSuccessfully installed XlsxWriter-3.1.2 backoff-2.2.1 chroma-hnswlib-0.7.1 chromadb-0.4.3 coloredlogs-15.0.1 cryptography-41.0.2 fastapi-0.99.1 filetype-1.2.0 google-search-results-2.4.2 httptools-0.6.0 humanfriendly-10.0 monotonic-1.6 msg-parser-1.2.0 olefile-0.46 onnxruntime-1.15.1 overrides-7.3.1 pdf2image-1.16.3 pdfminer.six-20221105 posthog-3.0.1 pulsar-client-3.2.0 pypandoc-1.11 pypika-0.48.9 python-docx-0.8.11 python-dotenv-1.0.0 python-magic-0.4.27 python-pptx-0.6.21 requests-2.31.0 starlette-0.27.0 tiktoken-0.4.0 tokenizers-0.13.3 unstructured-0.8.1 uvicorn-0.23.1 uvloop-0.17.0 watchfiles-0.19.0 websockets-11.0.3





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



### 4. Agent


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
