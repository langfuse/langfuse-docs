---
description: Fully async and typed Python SDK. Uses Pydantic objects for data verification.
---

# Python SDK

[![PyPI](https://img.shields.io/pypi/v/langfuse?style=flat-square)](https://pypi.org/project/langfuse/)

- [View as notebook on GitHub](https://github.com/langfuse/langfuse-docs/blob/main/src/ipynb/langfuse_docs_sdk_python.ipynb)
- [Open as notebook in Google Colab](http://colab.research.google.com/github/langfuse/langfuse-docs/blob/main/src/ipynb/langfuse_docs_sdk_python.ipynb)

This is a Python SDK used to send LLM data to Langfuse in a convenient way. It uses a worker Thread and an internal queue to manage requests to the Langfuse backend asynchronously. Hence, the SDK does not impact your latencies and also does not impact your customers in case of exceptions.

Using langchain? Use the [langchain integration](https://langfuse.com/docs/langchain)

## 1. Installation

The Langfuse SDKs are hosted on the pypi index.


```python
%pip install langfuse
```

Initialize the client with api keys and optionally your environment. In the example we are using the cloud environment which is also the default. The Python client can modify all entities in the Langfuse API and therefore requires the secret key.


```python
ENV_HOST = "https://cloud.langfuse.com"
ENV_SECRET_KEY = "sk-lf-1234567890"
ENV_PUBLIC_KEY = "pk-lf-1234567890"
```


```python
from langfuse import Langfuse

langfuse = Langfuse(ENV_PUBLIC_KEY, ENV_SECRET_KEY, ENV_HOST)
```

## 2. Record a simple LLM call
To record a single call to a LLM, you can use `langfuse.generations()` method from the SDK and provide it with the LLM configuration and the prompt and completion.


```python
from datetime import datetime
from langfuse.model import InitialGeneration, Usage

generationStartTime = datetime.now()

# call to an LLM API

langfuse.generation(InitialGeneration(
    name="summary-generation",
    startTime=generationStartTime,
    endTime=datetime.now(),
    model="gpt-3.5-turbo",
    modelParameters={"maxTokens": "1000", "temperature": "0.9"},
    prompt=[{"role": "system", "content": "You are a helpful assistant."}, {"role": "user", "content": "Please generate a summary of the following documents \nThe engineering department defined the following OKR goals...\nThe marketing department defined the following OKR goals..."}],
    completion="The Q3 OKRs contain goals for multiple teams...",
    usage=Usage(promptTokens=50, completionTokens = 49),
    metadata={"interface": "whatsapp"}
))
```

    new_trace_id 750545fd-f606-4d21-8476-04415468376f





    <langfuse.client.StatefulGenerationClient at 0x7c68d3590b20>



## 3. Record a more complex application
```
TRACE
|
|-- SPAN: Retrieval
|   |
|   |-- GENERATION: Vector DB Query Creation
|   |
|   |-- SPAN: Data Fetching
|   |
|   |-- GENERATION: Data Summary Creation
|
|-- GENERATION: Output Generation
```





```python
from langfuse.model import CreateTrace, CreateSpan, CreateGeneration, CreateEvent

trace = langfuse.trace(CreateTrace(name = "llm-feature"))
retrieval = trace.span(CreateSpan(name = "retrieval"))
retrieval.generation(CreateSpan(name = "query-creation"))
retrieval.span(CreateGeneration(name = "vector-db-search"))
retrieval.generation(CreateEvent(name = "db-summary"))
generation = trace.generation(CreateGeneration(name = "user-output"))
```

The Langfuse SDK and UI are designed to support very complex LLM features which contain for example vector database searches and multiple LLM calls. For that, it is very convenient to nest or chain the SDK. Understanding a small number of terms makes it easy to integrate with Langfuse.

#### Traces
A `Trace` represents a single execution of a LLM feature. It is a container for all succeeding objects.
#### Observations
Each `Trace` can contain multiple `Observations` to record individual steps of an execution. There are different types of `Observations`.
  - `Events` are the basic building block. They are used to track discrete events in a `Trace`.
  - `Spans` can be used to record steps from a chain like fetching data from a vector databse. You are able to record inputs, outputs and more.
  - `Generations` are a specific type of `Spans` which are used to record generations of an AI model. They contain additional metadata about the model and the prompt/completion and are specifically rendered in the langfuse UI.

##Object details

### Traces

Traces are the top-level entity in the Langfuse API. They represent an execution flow in a LLM application usually triggered by an external event.

- `name` (optional): identifier of the trace. Useful for sorting/filtering in the UI.
- `metadata` (optional): additional metadata of the trace. Can be any JSON object.
- `id` (optional): The id of the trace can be set, otherwise a random one is generated. Useful for linking traces to external systems or when grouping multiple runs into a single trace (e.g. messages in a chat thread).
- `userId` (optional): the id of the user who triggered the execution.


```python
from langfuse.model import CreateTrace

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

Spans represent durations of units of work in a trace. We generated convenient SDK functions for generic spans to support your use cases such as Agent tool usages.

- `startTime` (optional): the time at which the span started. If no startTime is provided, the current time will be used.
- `endTime` (optional): the time at which the span ended. Can also be set using `span.update()`.
- `name` (optional): identifier of the span. Useful for sorting/filtering in the UI.
- `metadata` (optional): additional metadata of the span. Can be any JSON object. Can also be set or updated using `span.update()`.
- `level` (optional): the level of the event. Can be `DEBUG`, `DEFAULT`, `WARNING` or `ERROR`. Used for sorting/filtering of traces with elevated error levels and for highlighting in the UI.
- `statusMessage` (optional): the status message of the event. Additional field for context of the event. E.g. the error message of an error event.
- `input` (optional): the input to the span. Can be any JSON object.
- `output` (optional): the output to the span. Can be any JSON object.


```python
from datetime import datetime
from langfuse.model import CreateSpan, UpdateSpan

retrievalStartTime = datetime.now()

# retrieveDocs = retrieveDoc()
# ...

span = trace.span(CreateSpan(
        name="embedding-search",
        startTime=retrievalStartTime,
        endTime=datetime.now(),
        metadata={"database": "pinecone"},
        input = {'query': 'This document entails the OKR goals for ACME'},
    )
)
```

Spans can be updated once your function completes for example record outputs.




```python
span = span.update(UpdateSpan(
        output = {"response": "[{'name': 'OKR Engineering', 'content': 'The engineering department defined the following OKR goals...'},{'name': 'OKR Marketing', 'content': 'The marketing department defined the following OKR goals...'}]"}
    )
)
```

### Generation

Generations are used to log generations of AI model. They contain additional metadata about the model and the prompt/completion and are specifically rendered in the langfuse UI.


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
from langfuse.model import CreateGeneration, Usage, UpdateGeneration

from datetime import datetime

generationStartTime = datetime.now()

# chat_completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=[{"role": "user", "content": "Hello world"}])
# ...

generation = trace.generation(CreateGeneration(
    name="summary-generation",
    startTime=generationStartTime,
    endTime=datetime.now(),
    model="gpt-3.5-turbo",
    modelParameters={"maxTokens": "1000", "temperature": "0.9"},
    prompt=[{"role": "system", "content": "You are a helpful assistant."}, {"role": "user", "content": "Please generate a summary of the following documents \nThe engineering department defined the following OKR goals...\nThe marketing department defined the following OKR goals..."}],
    metadata={"interface": "whatsapp"}
))
```

Generations can be updated once your LLM function completes for example record outputs.


```python
generation.update(UpdateGeneration(
    completion="The Q3 OKRs contain goals for multiple teams...",
    usage=Usage(promptTokens=50, completionTokens = 49),
))
```




    <langfuse.client.StatefulGenerationClient at 0x7c68d3591ba0>



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
from langfuse.model import CreateEvent
from datetime import datetime

event = span.event(CreateEvent(
        name="chat-docs-retrieval",
        startTime=datetime.now(),
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

## 3. Collect (user) feedback

Scores are used to evaluate single executions/traces. They can be supplied internally through our UI or via the SDK. If the score relates to a specific step of the trace, the score can optionally also be attached to the observation to enable evaluating it specifically.

- `traceId`: the id of the trace to which the score should be attached, automatically set when using trace.score() instead of langfuse.score()
- `name`: identifier of the score, string
- `value`: the value of the score; float; optional: scale it to e.g. 0..1 to make it comparable to other scores
- `comment` (optional): additional context/explanation of the score
- `observationId` (optional): the id of the observation to which the score should be attached, automatically set when using span.score()/event.score()/generation.score() instead of langfuse.score()


```python
from langfuse.model import CreateScore

trace.score(CreateScore(
    name="user-explicit-feedback",
    value=1,
    comment="I like how personalized the response is"
))
```




    <langfuse.client.StatefulClient at 0x7c68d3591840>



##Technical considerations

## Serverless environments

The Langfuse SDK executes network requests in the background on a separate thread for better performance of your application. This can lead to lost events in short lived environments like NextJs cloud functions or AWS Lambda functions when the Python process is terminated before the SDK sent all events to our backend.

To avoid this, ensure that the `langfuse.flush()` function is called before termination. This method is waiting for all tasks to have completed, hence it is blocking.


```python
langfuse.flush()
```

## FastAPI
For engineers working with FastAPI, we have a short example, of how to use it there. [Here](https://github.com/langfuse/fastapi_demo) is a Git Repo with all the details.



```python
%pip install fastapi
```

Here is an example of how to initialise FastAPI and register the `langfuse.flush()` method to run at shutdown.
With this, your Python environment will only terminate once Langfuse received all the events.


```python
from contextlib import asynccontextmanager
from fastapi import FastAPI, Query, BackgroundTasks
from langfuse.model import InitialGeneration


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Operation on startup

    yield  # wait until shutdown

    # Flush all events to be sent to Langfuse on shutdown and terminate all Threads gracefully. This operation is blocking.
    langfuse.flush()


app = FastAPI(lifespan=lifespan)
```


```python
langfuse = Langfuse(ENV_PUBLIC_KEY, ENV_SECRET_KEY, ENV_HOST)

@app.get("/generate/",tags=["APIs"])
async def campaign(prompt: str = Query(..., max_length=20)):
  # call to a LLM
  generation = langfuse.generation(
      InitialGeneration(name="llm-feature", metadata="test", prompt=prompt)
  )
  return True
```
