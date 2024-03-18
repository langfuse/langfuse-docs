---
title: Python SDK (Low-level)
description: Fully async and typed Python SDK. Uses Pydantic objects for data verification.
category: SDKs
---

# Python SDK (Low-level)

[![PyPI](https://img.shields.io/pypi/v/langfuse?style=flat-square)](https://pypi.org/project/langfuse/)

This is a Python SDK used to send LLM data to Langfuse in a convenient way. It uses a worker Thread and an internal queue to manage requests to the Langfuse backend asynchronously. Hence, the SDK adds only minimal latency to your application.

For most use cases, you should check out the [decorator-based SDK](http://langfuse.com/docs/sdk/python/decorators), which is more convenient and easier to use. This SDK is more low-level and is only recommended if you need more control over the request process.

## Installation


```python
%pip install langfuse --upgrade
```

## Initialize Client

To start, initialize the client by providing your credentials. You can set the credentials either as environment variables or constructor arguments.

If you are self-hosting Langfuse or using the US data region, don't forget to configure `LANGFUSE_HOST`.

To verify your credentials and host, use the `langfuse.auth_check()` function.


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

| Environment, Variable | Description   | Default value  
| --- | --- | ---
| `LANGFUSE_PUBLIC_KEY`, `public_key` | Public key, get in project settings |
| `LANGFUSE_SECRET_KEY`, `secret_key` | Secret key, get in project settings |
| `LANGFUSE_HOST`, `host` | Host of the Langfuse API | `"https://cloud.langfuse.com"`       
| `LANGFUSE_RELEASE`, `release` | Optional. The release number/hash of the application to provide analytics grouped by release.	| [common system environment names](https://github.com/langfuse/langfuse-python/blob/main/langfuse/environment.py#L3)
| `LANGFUSE_DEBUG`, `debug` | Optional. Prints debug logs to the console | `False`
| n/a, `threads` | Specifies the number of consumer threads to execute network requests to the Langfuse server. Helps scaling the SDK for high load. Only increase this if you run into scaling issues. | 1

## Tracing

The Langfuse SDK and UI are designed to support complex LLM features which contain for example vector database searches and multiple LLM calls. For that, it is very convenient to nest or chain the SDK. Understanding a small number of terms makes it easy to integrate with Langfuse.

**Traces**

A `Trace` represents a single execution of a LLM feature. It is a container for all succeeding objects.

**Observations**

Each `Trace` can contain multiple `Observations` to record individual steps of an execution. There are different types of `Observations`:
  - `Events` are the basic building block. They are used to track discrete events in a `Trace`.
  - `Spans` track time periods and include an end_time.
  - `Generations` are a specific type of `Spans` which are used to record generations of an AI model. They contain additional metadata about the model, LLM token and cost tracking, and the prompt/completions are specifically rendered in the langfuse UI.
  

_Example_
  
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
trace = langfuse.trace(name = "llm-feature")
retrieval = trace.span(name = "retrieval")
retrieval.generation(name = "query-creation")
retrieval.span(name = "vector-db-search")
retrieval.event(name = "db-summary")
trace.generation(name = "user-output");
```

### Traces

Traces are the top-level entity in the Langfuse API. They represent an execution flow in a LLM application usually triggered by an external event.

| Parameter | Type   | Optional | Description
| --- | --- | --- | ---
| id | string | yes | The id of the trace can be set, defaults to a random id. Set it to link traces to external systems or when creating a distributed trace. Traces are upserted on id.
| name | string | yes | Identifier of the trace. Useful for sorting/filtering in the UI.
| input | object | yes | The input of the trace. Can be any JSON object.
| output | object | yes | The output of the trace. Can be any JSON object.
| metadata | object | yes | Additional metadata of the trace. Can be any JSON object. Metadata is merged when being updated via the API.
| user_id | string | yes | The id of the user that triggered the execution. Used to provide [user-level analytics](https://langfuse.com/docs/tracing/users).
| session_id | string| yes | Used to group multiple traces into a [session](https://langfuse.com/docs/tracing/sessions) in Langfuse. Use your own session/thread identifier.
| version | string | yes | The version of the trace type. Used to understand how changes to the trace type affect metrics. Useful in debugging.
| release | string | yes | The release identifier of the current deployment. Used to understand how changes of different deployments affect metrics. Useful in debugging.
| tags | string[] | yes | Tags are used to categorize or label traces. Traces can be filtered by tags in the UI and GET API. Tags can also be changed in the UI. Tags are merged and never deleted via the API. |
| public | boolean | yes | You can make a trace `public` to share it via a [public link](https://langfuse.com/docs/tracing/). This allows others to view the trace without needing to log in or be members of your Langfuse project. |


```python
trace = langfuse.trace(
    name = "docs-retrieval",
    user_id = "user__935d7d1d-8625-4ef4-8651-544613e7bd22",
    metadata = {
        "email": "user@langfuse.com",
    },
    tags = ["production"]
)
```

Traces can be updated:


```python
# option 1: using trace object
trace.update(
    input="Hi there"
)

# option 2: via trace_id, trace is upserted on id
langfuse.trace(id=trace.id, output="Hi 👋")
```

You can get the url of a trace in the Langfuse interface. Helpful in interactive use or when adding this url to your logs.


```python
trace.get_trace_url()
```

### Span

Spans represent durations of units of work in a trace.

Parameters of `langfuse.span()`:

| Parameter | Type   | Optional | Description
| --- | --- | --- | ---
| id | string | yes | The id of the span can be set, otherwise a random id is generated. Spans are upserted on id.
| start_time | datetime.datetime | yes | The time at which the span started, defaults to the current time.
| end_time | datetime.datetime | yes | The time at which the span ended. Automatically set by `span.end()`.
| name | string | yes | Identifier of the span. Useful for sorting/filtering in the UI.
| metadata | object | yes | Additional metadata of the span. Can be any JSON object. Metadata is merged when being updated via the API.
| level | string | yes | The level of the span. Can be `DEBUG`, `DEFAULT`, `WARNING` or `ERROR`. Used for sorting/filtering of traces with elevated error levels and for highlighting in the UI.
| status_message | string | yes | The status message of the span. Additional field for context of the event. E.g. the error message of an error event.
| input | object | yes | The input to the span. Can be any JSON object.
| output | object | yes | The output to the span. Can be any JSON object.
| version | string | yes | The version of the span type. Used to understand how changes to the span type affect metrics. Useful in debugging.

Use trace or observation objects to create child spans:


```python
# create span, sets start_time
span = trace.span(
    name="embedding-search",
    metadata={"database": "pinecone"},
    input = {'query': 'This document entails the OKR goals for ACME'},
)

# function, mocked
# retrieved_documents = retrieveDoc()
retrieved_documents = {"response": "[{'name': 'OKR Engineering', 'content': 'The engineering department defined the following OKR goals...'},{'name': 'OKR Marketing', 'content': 'The marketing department defined the following OKR goals...'}]"}

# update span and sets end_time
span.end(
    output=retrieved_documents
);
```

Other span methods:
- `span.update()`, does not change end_time if not explicitly set

Alternatively, if using the Langfuse objects is not convenient, you can use the `langfuse` client, `trace_id` and (optionally) `parent_observation_id` to create spans, and `id` to upsert a span.


```python
trace_id = trace.id

# create span
span = langfuse.span(
    trace_id=trace_id,
    name="initial name"
)

# update span, upserts on id
langfuse.span(
    id=span.id,
    name="updated name"
)

# create new nested span
langfuse.span(
    trace_id=trace_id,
    parent_observation_id=span.id,
    name="nested span"
)
```

### Generation

Generations are used to log generations of AI models. They contain additional metadata about the model, the prompt/completion, the cost of executing the model and are specifically rendered in the langfuse UI.


| Parameter | Type   | Optional | Description
| --- | --- | --- | ---
| id | string | yes | The id of the generation can be set, defaults to random id.
| name | string | yes | Identifier of the generation. Useful for sorting/filtering in the UI.
| start_time | datetime.datetime | yes | The time at which the generation started, defaults to the current time.
| completion_start_time | datetime.datetime | yes | The time at which the completion started (streaming). Set it to get latency analytics broken down into time until completion started and completion duration.
| end_time | datetime.datetime | yes | The time at which the generation ended. Automatically set by `generation.end()`.
| model | string | yes | The name of the model used for the generation.
| model_parameters | object | yes | The parameters of the model used for the generation; can be any key-value pairs.
| input | object | yes | The prompt used for the generation. Can be any string or JSON object.
| output | string | yes | The completion generated by the model. Can be any string or JSON object.
| usage | object | yes | The usage object supports the OpenAi structure with {`promptTokens`, `completionTokens`, `totalTokens`} and a more generic version {`input`, `output`, `total`, `unit`, `inputCost`, `outputCost`, `totalCost`} where unit can be of value `"TOKENS"`, `"CHARACTERS"`, `"MILLISECONDS"`, `"SECONDS"`, or `"IMAGES"`. Refer to the docs on how to [automatically infer](https://langfuse.com/docs/model-usage-and-cost) token usage and costs in Langfuse.
| metadata | object | yes | Additional metadata of the generation. Can be any JSON object. Metadata is merged when being updated via the API.
| level | string | yes | The level of the generation. Can be `DEBUG`, `DEFAULT`, `WARNING` or `ERROR`. Used for sorting/filtering of traces with elevated error levels and for highlighting in the UI.
| status_message | string | yes | The status message of the generation. Additional field for context of the event. E.g. the error message of an error event.
| version | string | yes | The version of the generation type. Used to understand how changes to the span type affect metrics. Useful in debugging.

Use trace or observation objects to create child generations:


```python
# creates generation
generation = trace.generation(
    name="summary-generation",
    model="gpt-3.5-turbo",
    model_parameters={"maxTokens": "1000", "temperature": "0.9"},
    input=[{"role": "system", "content": "You are a helpful assistant."}, {"role": "user", "content": "Please generate a summary of the following documents \nThe engineering department defined the following OKR goals...\nThe marketing department defined the following OKR goals..."}],
    metadata={"interface": "whatsapp"}
)

# execute model, mocked here
# chat_completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=[{"role": "user", "content": "Hello world"}])
chat_completion = {
    "completion":"The Q3 OKRs contain goals for multiple teams...",
    "usage":{"input": 50, "output": 49, "unit":"TOKENS"}
}

# update span and sets end_time
generation.end(
    output=chat_completion["completion"],
    usage=chat_completion["usage"],
);
```

Other generation methods:
- `generation.update()`, does not change end_time if not explicitly set

See documentation of spans above on how to use the langfuse client and ids if you cannot use the Langfuse objects to trace your application. This also fully applies to generations.

### Events

Events are used to track discrete events in a trace.

| Parameter | Type   | Optional | Description
| --- | --- | --- | ---
| id | string | yes | The id of the event can be set, otherwise a random id is generated.
| start_time | datetime.datetime | yes | The time at which the event started, defaults to the current time.
| name | string | yes | Identifier of the event. Useful for sorting/filtering in the UI.
| metadata | object | yes | Additional metadata of the event. Can be any JSON object. Metadata is merged when being updated via the API.
| level | string | yes | The level of the event. Can be `DEBUG`, `DEFAULT`, `WARNING` or `ERROR`. Used for sorting/filtering of traces with elevated error levels and for highlighting in the UI.
| status_message | string | yes | The status message of the event. Additional field for context of the event. E.g. the error message of an error event.
| input | object | yes | The input to the event. Can be any JSON object.
| output | object | yes | The output to the event. Can be any JSON object.
| version | string | yes | The version of the event type. Used to understand how changes to the event type affect metrics. Useful in debugging.

Use trace or observation objects to create child generations:


```python
event = span.event(
    name="chat-docs-retrieval",
    metadata={"key": "value"},
    input = {"key": "value"},
    output = {"key": "value"}
)
```

See documentation of spans above on how to use the langfuse client and ids if you cannot use the Langfuse objects to trace your application. This also fully applies to events.

## Scores

[Scores](https://langfuse.com/docs/scores/overview) are used to evaluate single executions/traces. They can created manually via the Langfuse UI or via the SDKs.

If the score relates to a specific step of the trace, specify the `observation_id`.

| Parameter | Type   | Optional | Description
| --- | --- | --- | ---
| trace_id | string | no | The id of the trace to which the score should be attached. Automatically set if you use `{trace,generation,span,event}.score({})`
| observation_id | string | yes | The id of the observation to which the score should be attached. Automatically set if you use `{generation,span,event}.score({})`
| name | string | no | Identifier of the score.
| value | number | no | The value of the score. Can be any number, often standardized to 0..1
| comment | string | yes | Additional context/explanation of the score.


```python
# via {trace, span, event, generation}.score
trace.score(
    name="user-explicit-feedback",
    value=1,
    comment="I like how personalized the response is",
)

# using the trace.id
langfuse.score(
    trace_id=trace.id,
    name="user-explicit-feedback",
    value=1,
    comment="I like how personalized the response is"
)

# scoring a specific observation
langfuse.score(
    trace_id=trace.id,
    observation_id=span.id,
    name="user-explicit-feedback",
    value=1,
    comment="I like how personalized the response is"
)
```

## Additional configurations

### Shutdown behavior

The Langfuse SDK executes network requests in the background on a separate thread for better performance of your application. This can lead to lost events in short lived environments like NextJs cloud functions or AWS Lambda functions when the Python process is terminated before the SDK sent all events to our backend.

To avoid this, ensure that the `langfuse.flush()` function is called before termination. This method is waiting for all tasks to have completed, hence it is blocking.


```python
langfuse.flush()
```

### Releases and versions

Track `releases` in Langfuse to relate traces in Langfuse with the versioning of your application. This can be done by either providing the environment variable `LANGFUSE_RELEASE`, instantiating the client with the release, or setting it as a trace parameter.

If no release is set, this defaults to [common system environment names](https://github.com/langfuse/langfuse-python/blob/main/langfuse/environment.py#L3).


```python
# The SDK will automatically include the env variable.
os.environ["LANGFUSE_RELEASE"] = "ba7816b..." # <- example, github sha

# Alternatively, use the constructor of the SDK
langfuse = Langfuse(release="ba7816b")

# Alternatively, set it when creating a trace
langfuse.trace(release="ba7816b")
```

To track versions of individual pieces of you application apart from releases, use the `version` parameter on all observations. This is for example useful to track the effect of changed prompts.


```python
# works the same for spans, generations, events
langfuse.span(name="retrieval", version="<version>")
```

## Troubleshooting

### Debug mode
Enable debug mode to get verbose logs.

```python
langfuse = Langfuse(debug=True)
```

Alternatively, set the debug mode via the environment variable `LANGFUSE_DEBUG=True`.

### Configuration/authentication problems

Use auth_check() to verify that your host and api credentials are correct.


```python
langfuse.auth_check()
```

## Upgrading from v1.x.x to v2.x.x

v2 is a major release with breaking changes to simplify the SDK and make it more consistent. We recommend to upgrade to v2 as soon as possible.

You can automatically migrate your codebase using [grit](https://www.grit.io/), either [online](https://app.grit.io/migrations/new/langfuse_v2) or with the following CLI command:
```
npx -y @getgrit/launcher apply langfuse_v2
```

The grit binary executes entirely locally with AST-based transforms. Be sure to audit its changes: we suggest ensuring you have a clean working tree beforehand, and running `git add --patch` afterwards.

If your Jupyter Notebooks are not in source control, it might be harder to track changes. You may want to copy each cell individually into grit's web interface, and paste the output back in.

### Remove Pydantic interfaces

We like Pydantic, but it made the Langfuse SDK interfaces messy. Therefore, we removed the objects from the function signatures and replaced them with named parameters.

All parameters are still validated using Pydantic internally. If the validation fails, errors are logged instead of throwing exceptions.

#### Pydantic objects

**v1.x.x**
```python
from langfuse.model import CreateTrace

langfuse.trace(CreateTrace(name="My Trace"))
```

**v2.x.x**
```python
langfuse.trace(name="My Trace")
```

#### Pydantic Enums

**v1.x.x**
```python
from langfuse.model import InitialGeneration
from langfuse.api.resources.commons.types.observation_level import ObservationLevel

langfuse.generation(InitialGeneration(level=ObservationLevel.ERROR))
```

**v2.x.x**
```python
langfuse.generation(level="ERROR")
```

### Rename `prompt` and `completion` to `input` and `output`
To ensure consistency throughout Langfuse, we have renamed the `prompt` and `completion` parameters in the `generation` function to `input` and `output`, respectively. This change brings them in line with the rest of the Langfuse API.

### Snake case parameters

To increase consistency, all parameters are snake case in v2.
- `trace_id` instead of `traceId`
- `start_time` instead of `startTime`
- `end_time` instead of `endTime`
- `completion_start_time` instead of `completionStartTime`
- `status_message` instead of `statusMessage`
- `user_id` instead of `userId`
- `session_id` instead of `sessionId`
- `parent_observation_id` instead of `parentObservationId`
- `model_parameters` instead of `modelParameters`


### More generalized usage object

We improved the flexibility of the SDK by allowing you to ingest any type of usage while still supporting the OpenAI-style usage object.

**v1.x.x**
```python

from langfuse.model import InitialGeneration, Usage

 langfuse.generation(
    InitialGeneration(
        name="my-generation",
        usage=Usage(promptTokens=50, completionTokens=49),
    )
)
```

**v2.x.x**

The usage object supports the OpenAi structure with {`promptTokens`, `completionTokens`, `totalTokens`} and a more generic version {`input`, `output`, `total`, `unit`} where unit can be of value `"TOKENS"` or `"CHARACTERS"`. For some models the token counts and costs are [automatically calculated](https://langfuse.com/docs/model-usage-and-cost) by Langfuse. Create an issue to request support for other units and models.

```python
# Generic style
langfuse.generation(
    name="my-claude-generation",
    usage={
        "input": 50,
        "output": 49,
        "total": 99,
        "unit": "TOKENS"
    },
)

# OpenAI style
langfuse.generation(
    name="my-openai-generation",
    usage={
        "promptTokens": 50,
        "completionTokens": 49,
        "totalTokens": 99
    }, # defaults to "TOKENS" unit
)

# set ((input and/or output) or total), total is calculated automatically if not set
```



## FastAPI
For engineers working with FastAPI, we have a short example, of how to use it there.



```python
%pip install fastapi --upgrade
```

Here is an example of how to initialise FastAPI and register the `langfuse.flush()` method to run at shutdown.
With this, your Python environment will only terminate once Langfuse received all the events.


```python
from contextlib import asynccontextmanager
from fastapi import FastAPI, Query, BackgroundTasks

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
      name="llm-feature",
      metadata="test",
      input=prompt
  )
  return True
```
