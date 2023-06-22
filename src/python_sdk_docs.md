# Python SDK

- [View as notebook on GitHub](https://github.com/langfuse/langfuse-docs/blob/main/src/python_sdk_docs.ipynb)
- [Open as notebook in Google Colab](http://colab.research.google.com/github/langfuse/langfuse-docs/blob/main/src/python_sdk_docs.ipynb)

## 1. Initializing the client

The langfuse SDKs are hosted in a private pypi index by [Fern](https://buildwithfern.com/). To install the sdk, you need to specify the index.

```python
%pip install --extra-index-url https://pypi.buildwithfern.com finto-fern-langfuse
```

Initialize the client with your environment and api keys. In the example we are using the cloud environment. The Python client can modify all entities in the Langfuse API and requires the secret key.

```python
ENV_HOST = "https://cloud.langfuse.com"
ENV_SECRET_KEY = "sk-lf-..."
ENV_PUBLIC_KEY = "pk-lf-..."
```

```python
from finto.client import FintoLangfuse

client = FintoLangfuse(
    environment=ENV_HOST,
    password=ENV_SECRET_KEY,
    username=ENV_PUBLIC_KEY
)
```

## 2. Trace execution of backend

- Each backend execution is logged with a single `trace`.
- Each trace can contain multiple `observations` to log the individual steps of the execution.
  - Observations can be nested.
  - Observations can be of different types
    - `Events` are the basic building block. They are used to track discrete events in a trace.
    - `Spans` represent durations of units of work in a trace.
    - `Generations` are spans which are used to log generations of AI model. They contain additional attributes about the model and the prompt/completion and are specifically rendered in the langfuse UI.

**Timestamps**

All timestamps need to be formatted in the following way before being used in the SDK. This is a limitation of the current python SDK.

```python
from datetime import datetime

datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
```

    '2023-06-22T11:56:38Z'

### Traces

Traces are the top-level entity in the Langfuse API. They represent an execution flow in a LLM application usually triggered by an external event.

Traces can be created and updated.

`trace.create()` takes the following parameters:

- `name` (optional): identifier of the trace. Useful for sorting/filtering in the UI.
- `metadata` (optional): additional metadata of the trace. Can be any JSON object.

```python
from finto.resources.trace.types.create_trace_request import CreateTraceRequest

trace = client.trace.create(
    request = CreateTraceRequest(
        name="chat-completion",
        metadata= {
            "env": "production",
            "user": "user__935d7d1d-8625-4ef4-8651-544613e7bd22",
        }
    )
)
```

### Observations

### Events

Events are used to track discrete events in a trace.

- `traceId` (optional): the id of the trace to which the event should be attached. If no traceId is provided, the event will be attached to a new trace.
- `startTime`: the time at which the event started.
- `name` (optional): identifier of the event. Useful for sorting/filtering in the UI.
- `metadata` (optional): additional metadata of the event. JSON object.
- `parentObservationId` (optional): the id of the span or event to which the event should be attached
- `input` (optional): the input to the event. Can be any JSON object.
- `output` (optional): the output to the event. Can be any JSON object.

```python
from finto.resources.event.types.create_event_request import CreateEventRequest

event = client.event.create(
    request=CreateEventRequest(
        traceId=trace.id,
        name="chat-docs-retrieval",
        startTime=datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ'),
        metadata={
            "key": "value"
        },
        input = {
            "key": "value"
        },
        output = {
            "key": "value"
        }
    )
)
```

### Span

Spans represent durations of units of work in a trace. We generated convenient SDK functions for generic spans as well as LLM spans.

`span.create()` take the following parameters:

- `traceId` (optional): the id of the trace to which the span should be attached. If no traceId is provided, the span will be attached to a new trace.
- `startTime` (optional): the time at which the span started. If no startTime is provided, the current time will be used.
- `endTime` (optional): the time at which the span ended. Can also be set using `span.update()`.
- `name` (optional): identifier of the span. Useful for sorting/filtering in the UI.
- `metadata` (optional): additional metadata of the span. Can be any JSON object. Can also be set or updated using `span.update()`.
- `parentObservationId` (optional): the id of the observation to which the span should be attached
- `input` (optional): the input to the span. Can be any JSON object.
- `output` (optional): the output to the span. Can be any JSON object.

```python
from finto.resources.span.types.create_span_request import CreateSpanRequest

retrievalStartTime = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')

# retrieveDocs = retrieveDoc()
# ...

span = client.span.create(
    request=CreateSpanRequest(
        traceId=trace.id,
        name="chat-completion",
        startTime=retrievalStartTime,
        endTime=datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ'),
        metadata={
            "key": "value"
        },
        input = {
            "key": "value"
        },
        output = {
            "key": "value"
        },
        parentObservationId=event.id,
    )
)
```

`span.update()` take the following parameters:

- `spanId`: the id of the span to update
- `endTime` (optional): the time at which the span ended
- `metadata` (optional): merges with existing metadata of the span. Can be any JSON object.

### Generation

Generations are used to log generations of AI model. They contain additional attributes about the model and the prompt/completion and are specifically rendered in the langfuse UI.

`generation.log()` take the following parameters:

- `traceId` (optional): the id of the trace to which the generation should be attached. If no traceId is provided, the generation will be attached to a new trace.
- `startTime` (optional): the time at which the generation started.
- `endTime` (optional): the time at which the generation ended.
- `name` (optional): identifier of the generation. Useful for sorting/filtering in the UI.
- `model` (optional): the name of the model used for the generation
- `modelParameters` (optional): the parameters of the model used for the generation; can be any key-value pairs
- `prompt` (optional): the prompt used for the generation; can be any string or JSON object (recommended for chat models or other models that use structured input)
- `completion` (optional): the completion generated by the model
- `usage` (optional): the usage of the model during the generation; takes two optional key-value pairs: `promptTokens` and `completionTokens`
- `metadata` (optional): additional metadata of the generation. Can be any JSON object.
- `parentObservationId` (optional): the id of the observation to which the generation should be attached as a child.

```python
from finto.resources.generations.types.create_log import CreateLog
from finto.resources.generations.types.llm_usage import LlmUsage

generationStartTime = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')

# chat_completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=[{"role": "user", "content": "Hello world"}])
# ...

generation = client.generations.log(
    request=CreateLog(
        traceId=trace.id,
        name="test",
        startTime=generationStartTime,
        endTime=datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ'),
        model="gpt-3.5-turbo",
        modelParameters= {
            "temperature":0.9,
            "maxTokens":1000,
            "topP":None,
        },
        prompt=[{"role": "user", "content":"Hello, how are you?"}],
        completion="I am fine, thank you",
        usage=LlmUsage(
            prompt_tokens=512,
            completion_tokens=49
        ),
        metadata= {
            "userid":'user__935d7d1d-8625-4ef4-8651-544613e7bd22',
        }
    )
)
```

## 3. Collect scores

Scores are used to evaluate executions/traces. They are always attached to a single trace. If the score relates to a specific step of the trace, the score can optionally also be atatched to the observation to enable evaluating it specifically.

- `traceId`: the id of the trace to which the score should be attached
- `name`: identifier of the score, string
- `value`: the value of the score; float; optional: scale it to e.g. 0..1 to make it comparable to other scores
- `observationId` (optional): the id of the span, event or generation to which the score should be attached

```python
from finto.resources.score.types.create_score_request import CreateScoreRequest

score = client.score.create(
    request=CreateScoreRequest(
        traceId=trace.id,                  # trace the score is related to
        name="user-explicit-feedback",
        value=1,
        observationId=generation.id           # optionally: also attach the score to an individual observation
    )
)
```

## Troubleshooting

If you encounter any issue, we are happy to help on [Discord](https://discord.gg/7NXusRtqYU) or shoot us an email: help@langfuse.com
