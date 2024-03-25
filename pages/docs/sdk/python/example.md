---
description: Langfuse Python SDK - a decorators-based integration to give you powerful tracing, evals, and analytics for your LLM application
category: SDKs
---

# Cookbook: Python Decorators

The Langfuse Python SDK uses decorators for you to effortlessly integrate observability into your LLM applications. It supports both synchronous and asynchronous functions, automatically handling traces, spans, and generations, along with key execution details like inputs and outputs. This setup allows you to concentrate on developing high-quality applications while benefitting from observability insights with minimal code.

This cookbook containes examples for all key functionalities of the decorator-based integration with Langfuse.

## Installation & setup

Install `langfuse`:


```python
%pip install langfuse
```

If you haven't done so yet, [sign up to Langfuse](https://cloud.langfuse.com/auth/sign-up) and obtain your API keys from the project settings. You can also [self-host](https://langfuse.com/docs/deployment/self-host) Langfuse.


```python
import os

# Get keys for your project from the project settings page
# https://cloud.langfuse.com
os.environ["LANGFUSE_PUBLIC_KEY"] = ""
os.environ["LANGFUSE_SECRET_KEY"] = ""
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region

# Your openai key
os.environ["OPENAI_API_KEY"] = ""
```

## Basic usage

Langfuse simplifies observability in LLM-powered applications by organizing activities into traces. Each trace contains observations: spans for nested activities, events for distinct actions, or generations for LLM interactions. This setup mirrors your app's execution flow, offering insights into performance and behavior. See our [Tracing documentation](/docs/tracing/overview) for more details on Langfuse's telemetry model.

`@observe()` decorator automatically and asynchronously logs nested traces to Langfuse. The outermost function becomes a `trace` in Langfuse, all children are `spans` by default.

By default it captures:
- nesting via context vars
- timings/durations
- args and kwargs as input dict
- returned values as output


```python
from langfuse.decorators import langfuse_context, observe
import time

@observe()
def wait():
    time.sleep(1)

@observe()
def capitalize(input: str):
    return input.upper()

@observe()
def main_fn(query: str):
    wait()
    capitalized = capitalize(query)
    return f"Q:{capitalized}; A: nice too meet you!"

main_fn("hi there");
```

Voilà! ✨ Langfuse will generate a trace with a nested span for you.

> **Example trace**: https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/21128edc-27bf-4643-92f9-84d66c63de8d

## Add additional parameters to the trace

In addition to the attributes automatically captured by the decorator, you can add others to use the full features of Langfuse.

Two utility methods:
- `langfuse_context.update_current_observation`: Update the trace/span of the current function scope
- `langfuse_context.update_current_trace`: Update the trace itself, can also be called within any deeply nested span within the trace

For details on available attributes, have a look at the [reference](https://python.reference.langfuse.com/langfuse/decorators#LangfuseDecorator.update_current_observation)

Below is an example demonstrating how to enrich traces and observations with custom parameters:


```python
from langfuse.decorators import langfuse_context, observe

@observe(as_type="generation")
def deeply_nested_llm_call():
    # Enrich the current observation with a custom name, input, and output
    langfuse_context.update_current_observation(
        name="Deeply nested LLM call", input="Ping?", output="Pong!"
    )
    # Set the parent trace's name from within a nested observation
    langfuse_context.update_current_trace(
        name="Trace name set from deeply_nested_llm_call",
        session_id="1234",
        user_id="5678",
        tags=["tag1", "tag2"],
        public=True
    )

@observe()
def nested_span():
    # Update the current span with a custom name and level
    langfuse_context.update_current_observation(name="Nested Span", level="WARNING")
    deeply_nested_llm_call()

@observe()
def main():
    nested_span()

# Execute the main function to generate the enriched trace
main()
```

On the Langfuse platform the trace now shows with the updated name from the `deeply_nested_llm_call`, and the observations will be enriched with the appropriate data points.

> **Example trace**: https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/f16e0151-cca8-4d90-bccf-1d9ea0958afb

## Log an LLM Call using `as_type="generation"`

Model calls are represented by `generations` in Langfuse and allow you to add additional attributes. Use the `as_type="generation"` flag to mark a function as a generation. Optionally, you can extract additional generation specific attributes ([reference](https://python.reference.langfuse.com/langfuse/decorators#LangfuseDecorator.update_current_observation)). 

This works with any LLM provider/SDK. In this example, we'll use Anthropic.


```python
%pip install anthropic
```


```python
os.environ["ANTHROPIC_API_KEY"] = ""

import anthropic
anthopic_client = anthropic.Anthropic()
```


```python
# Wrap LLM function with decorator
@observe(as_type="generation")
def anthropic_completion(**kwargs):
  # extract some fields from kwargs
  kwargs_clone = kwargs.copy()
  input = kwargs_clone.pop('messages', None)
  model = kwargs_clone.pop('model', None)
  langfuse_context.update_current_observation(
      input=input,
      model=model,
      metadata=kwargs_clone
  )
  
  # return result
  return anthopic_client.messages.create(**kwargs).content[0].text

@observe()
def main():
  return anthropic_completion(
      model="claude-3-opus-20240229",
      max_tokens=1024,
      messages=[
          {"role": "user", "content": "Hello, Claude"}
      ]
  )

main()
```

> **Example trace**: https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/ece9079d-e12c-4c0e-9dc3-8805d0bbe8ec?observation=723c04ff-cdca-4716-8143-e691129be315

## Customize input/output

By default, input/ouput of a function are captured by `@observe()`.

**You can disable capturing input/output** for a specific function:


```python
from langfuse.decorators import observe

@observe(capture_input=False, capture_output=False)
def stealth_fn(input: str):
    return input

stealth_fn("Super secret content")
```

> **Example trace**: https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/6bdeb443-ef8c-41d8-a8a1-68fe75639428

Alternatively, you can **override input and output** via `update_current_observation` (or `update_current_trace`):


```python
from langfuse.decorators import langfuse_context, observe

@observe()
def fn_2():
    langfuse_context.update_current_observation(
        input="Table?", output="Tennis!"
    )
    # Logic for a deeply nested LLM call
    pass

@observe()
def main_fn():
    langfuse_context.update_current_observation(
        input="Ping?", output="Pong!"
    )
    fn_2()

main_fn()
```

> **Example trace**: https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/d3c3ad92-d85d-4437-aaf3-7587d84f398c

## Interoperability with other Integrations

Langfuse is tightly integrated with the OpenAI SDK, LangChain, and LlamaIndex. The integrations are seamlessly interoperable with each other within a decorated function. The following example demonstrates this interoperability by using all three integrations within a single trace.

### 1. Initializing example applications


```python
%pip install llama-index langchain langchain_openai --upgrade
```

#### OpenAI

The [OpenAI integration](https://langfuse.com/docs/integrations/openai/get-started) automatically detects the context in which it is executed. Just use `from langfuse.openai import openai` and get native tracing of all OpenAI calls.


```python
from langfuse.openai import openai
from langfuse.decorators import observe

@observe()
def openai_fn(calc: str):
    res = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
          {"role": "system", "content": "You are a very accurate calculator. You output only the result of the calculation."},
          {"role": "user", "content": calc}],
    )
    return res.choices[0].message.content
```

#### LlamaIndex

Via `Settings.callback_manager` you can configure the callback to use for tracing of the subsequent LlamaIndex executions. `langfuse_context.get_current_llama_index_handler()` exposes a callback handler scoped to the current trace context, in this case `llama_index_fn()`.


```python
from langfuse.decorators import langfuse_context, observe
from llama_index.core import Document, VectorStoreIndex
from llama_index.core import Settings
from llama_index.core.callbacks import CallbackManager

doc1 = Document(text="""
Maxwell "Max" Silverstein, a lauded movie director, screenwriter, and producer, was born on October 25, 1978, in Boston, Massachusetts. A film enthusiast from a young age, his journey began with home movies shot on a Super 8 camera. His passion led him to the University of Southern California (USC), majoring in Film Production. Eventually, he started his career as an assistant director at Paramount Pictures. Silverstein's directorial debut, “Doors Unseen,” a psychological thriller, earned him recognition at the Sundance Film Festival and marked the beginning of a successful directing career.
""")
doc2 = Document(text="""
Throughout his career, Silverstein has been celebrated for his diverse range of filmography and unique narrative technique. He masterfully blends suspense, human emotion, and subtle humor in his storylines. Among his notable works are "Fleeting Echoes," "Halcyon Dusk," and the Academy Award-winning sci-fi epic, "Event Horizon's Brink." His contribution to cinema revolves around examining human nature, the complexity of relationships, and probing reality and perception. Off-camera, he is a dedicated philanthropist living in Los Angeles with his wife and two children.
""")

@observe()
def llama_index_fn(question: str):
    # Set callback manager for LlamaIndex, will apply to all LlamaIndex executions in this function
    langfuse_handler = langfuse_context.get_current_llama_index_handler()
    Settings.callback_manager = CallbackManager([langfuse_handler])

    # Run application
    index = VectorStoreIndex.from_documents([doc1,doc2])
    response = index.as_query_engine().query(question)
    return response
```

#### LangChain

`langfuse_context.get_current_llama_index_handler()` exposes a callback handler scoped to the current trace context, in this case `langchain_fn()`. Pass it to subsequent runs to your LangChain application to get full tracing within the scope of the current trace.


```python
from operator import itemgetter
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema import StrOutputParser
from langfuse.decorators import observe
 
prompt = ChatPromptTemplate.from_template("what is the city {person} is from?")
model = ChatOpenAI()
chain = prompt | model | StrOutputParser()

@observe()
def langchain_fn(person: str):
    # Get Langchain Callback Handler scoped to the current trace context
    langfuse_handler = langfuse_context.get_current_langchain_handler()

    # Pass handler to invoke
    chain.invoke({"person": person}, config={"callbacks":[langfuse_handler]})
```

### 2. Run all in a single trace


```python
from langfuse.decorators import observe

@observe()
def main():
    output_openai = openai_fn("5+7")
    output_llamaindex = llama_index_fn("What did he do growing up?")
    output_langchain = langchain_fn("Feynman")

    return output_openai, output_llamaindex, output_langchain

main();
```


> **Example trace**: https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/4fcd93e3-79f2-474a-8e25-0e21c616249a

## Flush observations

The Langfuse SDK executes network requests in the background on a separate thread for better performance of your application. This can lead to lost events in short lived environments such as AWS Lambda functions when the Python process is terminated before the SDK sent all events to the Langfuse API.

Make sure to call `langfuse_context.flush()` before exiting to prevent this. This method waits for all tasks to finish.

## Additional features

### Scoring

[Scores](https://langfuse.com/docs/scores/overview) are used to evaluate single observations or entire traces. You can create them manually in the Langfuse UI, run model-based evaluation or ingest via the SDK.

| Parameter | Type   | Optional | Description
| --- | --- | --- | ---
| name | string | no | Identifier of the score.
| value | number | no | The value of the score. Can be any number, often standardized to 0..1
| comment | string | yes | Additional context/explanation of the score.


#### Within the decorated function

You can attach a score to the current observation context by calling `langfuse_context.score_current_observation`. You can also score the entire trace from anywhere inside the nesting hierarchy by calling `langfuse_context.score_current_trace`:


```python
from langfuse.decorators import langfuse_context, observe

@observe()
def nested_span():
    langfuse_context.score_current_observation(
        name="feedback-on-span",
        value=1,
        comment="I like how personalized the response is",
    )

    langfuse_context.score_current_trace(
        name="feedback-on-trace-from-nested-span",
        value=1,
        comment="I like how personalized the response is",
    )


# This will create a new trace
@observe()
def main():
    langfuse_context.score_current_trace(
        name="feedback-on-trace",
        value=1,
        comment="I like how personalized the response is",
    )
    nested_span()

main()
```

> **Example trace**: https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/1dfcff43-34c3-4888-b99a-bb9b9afd57c9

#### Outside the decorated function

Alternatively you may also score a trace or observation from outside its context as often scores are added async. For example, based on user feedback.

The decorators expose the trace_id and observation_id which are necessary to add scores outside of the decorated functions:


```python
from langfuse import Langfuse
from langfuse.decorators import langfuse_context, observe

# Initialize the Langfuse client
langfuse_client = Langfuse()

@observe()
def nested_fn():
    span_id = langfuse_context.get_current_observation_id()

    # can also be accessed in main
    trace_id = langfuse_context.get_current_trace_id()

    return "foo_bar", trace_id, span_id

# Create a new trace
@observe()
def main():

    _, trace_id, span_id = nested_fn()

    return "main_result", trace_id, span_id


# Flush the trace to send it to the Langfuse platform
langfuse_context.flush()

# Execute the main function to generate a trace
_, trace_id, span_id = main()

# Score the trace from outside the trace context
langfuse_client.score(
    trace_id=trace_id,
    name="trace-score",
    value=1,
    comment="I like how personalized the response is"
)

# Score the specific span/function from outside the trace context
langfuse_client.score(
    trace_id=trace_id,
    observation_id=span_id,
    name="span-score",
    value=1,
    comment="I like how personalized the response is"
);
```

> **Example trace**: https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/0090556d-015c-48cb-bc33-4af29b05af31

### Customize IDs

By default, Langfuse assigns random ids to all logged events.

If you have your own unique ID (e.g. messageId, traceId, correlationId), you can easily set those as trace or observation IDs for effective lookups in Langfuse.

To dynamically set a custom ID for a trace or observation, simply pass a keyword argument `langfuse_observation_id` to the function decorated with `@observe()`. Thereby, the trace/observation in Langfuse will use this id. Note: ids in Langfuse are unique and traces/observations are upserted/merged on these ids.


```python
from langfuse.decorators import langfuse_context, observe
import uuid

@observe()
def process_user_request(user_id, request_data, **kwargs):
    # Function logic here
    pass


def main():
    user_id = "user123"
    request_data = {"action": "login"}

    # Custom ID for tracking
    custom_observation_id = "custom-" + str(uuid.uuid4())

    # Pass id as kwarg
    process_user_request(
        user_id=user_id,
        request_data=request_data,
        # Pass the custom observation ID to the function
        langfuse_observation_id=custom_observation_id,
    )

main()
```

> **Example trace**: https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/custom-bbda815f-c61a-4cf5-a545-7fceeef1b635

### Debug mode
Enable debug mode to get verbose logs. Set the debug mode via the environment variable `LANGFUSE_DEBUG=True`.

### Authentication check

Use `langfuse_context.auth_check()` to verify that your host and API credentials are valid.


```python
from langfuse.decorators import langfuse_context

assert langfuse_context.auth_check()
```

## Learn more

See Docs and [SDK reference](https://python.reference.langfuse.com/langfuse/decorators) for more details. Questions? Add them on [GitHub Discussions](https://github.com/orgs/langfuse/discussions/categories/support).
