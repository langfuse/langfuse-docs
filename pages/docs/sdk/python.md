---
description: Fully async and typed Python SDK. Uses Pydantic objects for data verification.
---

# Python SDK

[![PyPI](https://img.shields.io/pypi/v/langfuse?style=flat-square)](https://pypi.org/project/langfuse/)

This is a Python SDK used to send LLM data to Langfuse in a convenient way. It uses a worker Thread and an internal queue to manage requests to the Langfuse backend asynchronously. Hence, the SDK does not impact your latencies and also does not impact your customers in case of exceptions.

Using langchain? Use the [langchain integration](https://langfuse.com/docs/langchain)

## 1. Installation

The Langfuse SDKs are hosted on the pypi index.


```python
%pip install langfuse --upgrade
```

Initialize the client with api keys and optionally your environment. In the example we are using the cloud environment which is also the default. The Python client can modify all entities in the Langfuse API and therefore requires the secret key.


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
from langfuse import Langfuse

langfuse = Langfuse()
```


```python
# checks the SDK connection with the server.
langfuse.auth_check()
```

### Options

| Variable |Description   | Default value  
| --- | --- | ---
| host | Host of the Langfuse API, set to `"https://us.cloud.langfuse.com"` for US data region | `"https://cloud.langfuse.com"`       
| release | The release number/hash of the application to provide analytics grouped by release.	| `process.env.LANGFUSE_RELEASE` or [common system environment names](https://github.com/langfuse/langfuse-python/blob/main/langfuse/environment.py#L3)
| debug | Prints debug logs to the console | `False`
| number_of_consumers | Specifies the number of consumer threads to execute network requests to the Langfuse server. Helps scaling the SDK for high load. | 1



At the bottom of the document are more detailed explanations for these.

## 2. Record a simple LLM call
To record a single call to a LLM, you can use `langfuse.generations()` method from the SDK and provide it with the LLM configuration, prompt and completion.


```python
from datetime import datetime
from langfuse.model import InitialGeneration, Usage

generationStartTime = datetime.now()

# call to an LLM API

generation = langfuse.generation(InitialGeneration(
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
|   |-- EVENT: Data Summary Creation
|
|-- GENERATION: Output Generation
```





```python
from langfuse.model import CreateTrace, CreateSpan, CreateGeneration, CreateEvent

trace = langfuse.trace(CreateTrace(name = "llm-feature"))
retrieval = trace.span(CreateSpan(name = "retrieval"))
retrieval.generation(CreateGeneration(name = "query-creation"))
retrieval.span(CreateSpan(name = "vector-db-search"))
retrieval.event(CreateEvent(name = "db-summary"))
trace.generation(CreateGeneration(name = "user-output"));
```

The Langfuse SDK and UI are designed to support very complex LLM features which contain for example vector database searches and multiple LLM calls. For that, it is very convenient to nest or chain the SDK. Understanding a small number of terms makes it easy to integrate with Langfuse.

#### Traces
A `Trace` represents a single execution of a LLM feature. It is a container for all succeeding objects.
#### Observations
Each `Trace` can contain multiple `Observations` to record individual steps of an execution. There are different types of `Observations`.
  - `Events` are the basic building block. They are used to track discrete events in a `Trace`.
  - `Spans` can be used to record steps from a chain like fetching data from a vector databse. You are able to record inputs, outputs and more.
  - `Generations` are a specific type of `Spans` which are used to record generations of an AI model. They contain additional metadata about the model and the prompt/completion and are specifically rendered in the langfuse UI.

### Traces

Traces are the top-level entity in the Langfuse API. They represent an execution flow in a LLM application usually triggered by an external event.

| Parameter | Type   | Optional | Description
| --- | --- | --- | ---
| id | string | yes | The id of the trace can be set, defaults to a random id. Set it to link traces to external systems or when grouping multiple runs into a single trace (e.g. messages in a chat thread).
| name | string | yes | Identifier of the trace. Useful for sorting/filtering in the UI.
| metadata | object | yes | Additional metadata of the trace. Can be any JSON object.
| userId | string | yes | The id of the user that triggered the execution. Used to provide [user-level analytics](https://langfuse.com/docs/user-explorer).
| version | string | yes | The version of the trace type. Used to understand how changes to the trace type affect metrics. Useful in debugging.
| release | string | yes | The release identifier of the current deployment. Used to understand how changes of different deployments affect metrics. Useful in debugging.


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

| Parameter | Type   | Optional | Description
| --- | --- | --- | ---
| id | string | yes | The id of the span can be set, otherwise a random id is generated.
| startTime | datetime.datetime | yes | The time at which the span started, defaults to the current time.
| endTime | datetime.datetime | yes | The time at which the span ended.
| name | string | yes | Identifier of the span. Useful for sorting/filtering in the UI.
| metadata | object | yes | Additional metadata of the span. Can be any JSON object.
| level | string | yes | The level of the span. Can be `DEBUG`, `DEFAULT`, `WARNING` or `ERROR`. Used for sorting/filtering of traces with elevated error levels and for highlighting in the UI.
| statusMessage | string | yes | The status message of the span. Additional field for context of the event. E.g. the error message of an error event.
| input | object | yes | The input to the span. Can be any JSON object.
| output | object | yes | The output to the span. Can be any JSON object.
| version | string | yes | The version of the span type. Used to understand how changes to the span type affect metrics. Useful in debugging.


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


| Parameter | Type   | Optional | Description
| --- | --- | --- | ---
| id | string | yes | The id of the generation can be set, defaults to random id.
| name | string | yes | Identifier of the generation. Useful for sorting/filtering in the UI.
| startTime | datetime.datetime | yes | The time at which the generation started, defaults to the current time.
| completionStartTime | datetime.datetime | yes | The time at which the completion started (streaming). Set it to get latency analytics broken down into time until completion started and completion duration.
| endTime | datetime.datetime | yes | The time at which the generation ended.
| model | string | yes | The name of the model used for the generation.
| modelParameters | object | yes | The parameters of the model used for the generation; can be any key-value pairs.
| prompt | object | yes | The prompt used for the generation; can be any string or JSON object (recommended for chat models or other models that use structured input).
| completion | string | yes | The completion generated by the model.
| usage | object | yes | The usage of the model during the generation; takes three optional key-value pairs: `promptTokens`, `completionTokens`, and `totalTokens`. For some models the token counts are [automatically calculated](https://langfuse.com/docs/token-usage) by Langfuse.
| metadata | object | yes | Additional metadata of the generation. Can be any JSON object.
| level | string | yes | The level of the generation. Can be `DEBUG`, `DEFAULT`, `WARNING` or `ERROR`. Used for sorting/filtering of traces with elevated error levels and for highlighting in the UI.
| statusMessage | string | yes | The status message of the generation. Additional field for context of the event. E.g. the error message of an error event.
| version | string | yes | The version of the generation type. Used to understand how changes to the span type affect metrics. Useful in debugging.


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
));
```

### Events

Events are used to track discrete events in a trace.

| Parameter | Type   | Optional | Description
| --- | --- | --- | ---
| id | string | yes | The id of the event can be set, otherwise a random id is generated.
| startTime | datetime.datetime | yes | The time at which the event started, defaults to the current time.
| name | string | yes | Identifier of the event. Useful for sorting/filtering in the UI.
| metadata | object | yes | Additional metadata of the event. Can be any JSON object.
| level | string | yes | The level of the event. Can be `DEBUG`, `DEFAULT`, `WARNING` or `ERROR`. Used for sorting/filtering of traces with elevated error levels and for highlighting in the UI.
| statusMessage | string | yes | The status message of the event. Additional field for context of the event. E.g. the error message of an error event.
| input | object | yes | The input to the event. Can be any JSON object.
| output | object | yes | The output to the event. Can be any JSON object.
| version | string | yes | The version of the event type. Used to understand how changes to the event type affect metrics. Useful in debugging.


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

## 3. Scores

[Scores](https://langfuse.com/docs/scores) are used to evaluate single executions/traces. They can created manually via the Langfuse UI or via the SDKs.

If the score relates to a specific step of the trace, specify the `observationId`.

| Parameter | Type   | Optional | Description
| --- | --- | --- | ---
| traceId | string | no | The id of the trace to which the score should be attached. Automatically set if you use `{trace,generation,span,event}.score({})`
| observationId | string | yes | The id of the observation to which the score should be attached. Automatically set if you use `{generation,span,event}.score({})`
| name | string | no | Identifier of the score.
| value | number | no | The value of the score. Can be any number, often standardized to 0..1
| comment | string | yes | Additional context/explanation of the score.


```python
from langfuse.model import CreateScore, InitialScore

# via {trace, span, event, generation}.score
trace.score(CreateScore(
    name="user-explicit-feedback",
    value=1,
    comment="I like how personalized the response is"
));

# using the trace_id
trace_id = trace.id
langfuse.score(InitialScore(
    traceId=trace.id,
    name="user-explicit-feedback",
    value=1,
    comment="I like how personalized the response is"
));
```

## Additional configurations

### Shutdown behavior

The Langfuse SDK executes network requests in the background on a separate thread for better performance of your application. This can lead to lost events in short lived environments like NextJs cloud functions or AWS Lambda functions when the Python process is terminated before the SDK sent all events to our backend.

To avoid this, ensure that the `langfuse.flush()` function is called before termination. This method is waiting for all tasks to have completed, hence it is blocking.


```python
langfuse.flush()
```

### Releases and versions

You might want to track releases in Langfuse to understand with which Software release a given Trace was generated. This can be done by either providing the environment variable `LANGFUSE_RELEASE` or instantiating the client with the release.


```python
# The SDK will automatically include the env variable.
os.environ["LANGFUSE_RELEASE"] = "ba7816b..." # <- example, github sha

# Alternatively, use the constructor of the SDK
langfuse = Langfuse(release='ba7816b')
```

Apart from Software releases, users want to track versions of LLM apps (e.g. Prompt versions). For this, each `Generation`, `Span`, or `Event` has a version field.


```python
langfuse.span(CreateSpan(name = "retrieval", version="<version>"));
```

### Debug
Enable debug mode to get verbose logs. Alternatively, set the debug mode via the environment variable `LANGFUSE_DEBUG`.


```python
langfuse = Langfuse(debug=True)

# Deactivating for the rest of the notebook
langfuse = Langfuse()
```

## FastAPI
For engineers working with FastAPI, we have a short example, of how to use it there. [Here](https://github.com/langfuse/fastapi_demo) is a Git Repo with all the details.



```python
%pip install fastapi --upgrade
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
langfuse = Langfuse()

@app.get("/generate/",tags=["APIs"])
async def campaign(prompt: str = Query(..., max_length=20)):
  # call to a LLM
  generation = langfuse.generation(
      InitialGeneration(name="llm-feature", metadata="test", prompt=prompt)
  )
  return True
```
