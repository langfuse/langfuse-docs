---
description: Langfuse Python SDK - a decorators-based integration to give you powerful tracing, evals, and analytics for your LLM application
---

# Python SDK Guide

[![PyPI](https://img.shields.io/pypi/v/langfuse?style=flat-square)](https://pypi.org/project/langfuse/)

The Langfuse Python SDK uses decorators for you to effortlessly integrate observability into your LLM applications. It supports both synchronous and asynchronous functions, automatically handling traces, spans, and generations, along with key execution details like inputs and outputs. This setup allows you to concentrate on developing high-quality applications while benefitting from observability insights with minimal code.

If you use [Langchain](/docs/integrations/langchain), [LlamaIndex](/docs/integrations/llama-index) or other popular frameworks to build your LLM app, check out our [integrations](/docs/integrations) for tailored solutions.

For a detailed API reference, see our [Python SDK API Reference](https://f5cb2b86.langfuse-python.pages.dev/langfuse/decorators/langfuse#LangfuseDecorator).

Here's a simple example of our decorators-based Python SDK:


```python
from langfuse.decorators import langfuse


@langfuse.trace()
def span_inside_trace():
    print("Hello, from a span inside a trace!")


@langfuse.trace()
def function_to_trace():
    print("Hello, from the parent trace!")
    span_inside_trace()


langfuse.flush()
```

Voilà! ✨ Langfuse will generate a trace with a nested span for you.

## Installation & setup

Install `langfuse`:


```python
%pip install langfuse
```

If you haven't done so yet, [sign up to Langfuse](https://cloud.langfuse.com/auth/sign-up) and obtain your API keys from the project settings. Configure your environment variables to reflect the correct values for `LANGFUSE_HOST`, `LANGFUSE_SECRET_KEY`, and `LANGFUSE_PUBLIC_KEY`. You can use either a `.env` file at the root of your application in combination with `python-dotenv`, or set them directly 


```python
# .env
LANGFUSE_SECRET_KEY="sk-lf-...";
LANGFUSE_PUBLIC_KEY="pk-lf-...";
LANGFUSE_HOST="https://cloud.langfuse.com"; # 🇪🇺 EU region, "https://us.cloud.langfuse.com" for 🇺🇸 US region
```


```python
import os

os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-..."
os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-..."
os.environ["LANGFUSE_HOST"] = (
    "https://cloud.langfuse.com"  # 🇪🇺 EU region, "https://us.cloud.langfuse.com" for 🇺🇸 US region
)
```

## Basic usage

Langfuse simplifies observability in LLM-powered applications by organizing activities into traces. Each trace contains observations: spans for nested activities, events for distinct actions, or generations for LLM interactions. This setup mirrors your app's execution flow, offering insights into performance and behavior. See our [Tracing documentation](/docs/tracing/overview) for more details on Langfuse's telemetry model.

Langfuse simplifies application tracing with the `@langfuse.trace()` decorator, automating the tracking of execution times and the nesting hierarchy of calls. This approach allows you to seamlessly integrate observability by simply decorating the functions you'd like to trace, and focusing on feature development while Langfuse handles the intricacies of contexts and nested calls.

### Capture traces

In Langfuse, traces serve as the foundational element, acting as containers for various observations within your application. Traces are capable of representing comprehensive execution flows, such as those found in chained LLM applications, backend endpoint processes, or any complex sequence involving multiple observations. This hierarchical structure allows for a detailed and organized view of application performance and behavior.

Utilizing the `@langfuse.trace()` decorator provided by the Langfuse Python SDK, you can designate the top-level function in a sequence as a trace. Subsequent nested function calls decorated with `@langfuse.trace()` are automatically recognized as either spans, which are subdivisions of a trace capturing specific operations, or generations, which are specialized observations for LLM interactions.

Here's a concise example demonstrating how to employ the Langfuse decorator to capture traces, spans, and generations, and how to finalize the trace by flushing it to the Langfuse platform for analysis:


```python
from langfuse.decorators import langfuse


@langfuse.trace(as_type="generation")
def deeply_nested_llm_call():
    # Logic for a deeply nested LLM call
    pass


@langfuse.trace()
def nested_span():
    # This creates a new span within the trace
    deeply_nested_llm_call()


@langfuse.trace()
def main():
    # The entry point creating a new trace
    nested_span()


# Execute the main function to initiate the trace
main()

# Flush the collected data to the Langfuse platform
langfuse.flush()
```

This will be the resulting hierarchy from the above executions:

![python_decorators_nesting](/public/images/cookbook/python_decorators_nesting.png)

### Enrich elements

Enhancing the detail and relevance of your observability data in Langfuse is straightforward. By leveraging the `langfuse.update_current_observation` and `langfuse.update_current_trace` methods, you can enrich the context of your observability data directly within the scope of the function being observed.

When adding parameters, consider the specific observation type that is in context. The [Python SDK API Reference](https://f5cb2b86.langfuse-python.pages.dev/langfuse/decorators/langfuse#LangfuseDecorator.update_current_observation) provides a comprehensive list of the parameters you can set per observation type. Trace parameters can be updated from any point within the nested function hierarchy.

Below is an example demonstrating how to enrich traces and observations with custom parameters:


```python
from langfuse.decorators import langfuse


@langfuse.trace(as_type="generation")
def deeply_nested_llm_call():
    # Enrich the current observation with a custom name, input, and output
    langfuse.update_current_observation(
        name="Deeply nested LLM call", input="Ping?", output="Pong!"
    )
    # Set the parent trace's name from within a nested observation
    langfuse.update_current_trace(
        name="Trace name set from deeply_nested_llm_call",
        session_id="1234",
        user_id="5678",
        tags=["tag1", "tag2"],
    )


@langfuse.trace()
def nested_span():
    # Update the current span with a custom name and level
    langfuse.update_current_observation(name="Nested Span", level="WARNING")
    deeply_nested_llm_call()


@langfuse.trace()
def main():
    nested_span()


# Execute the main function to generate the enriched trace
main()

# Flush the enriched data to the Langfuse platform for analysis
langfuse.flush()
```

On the Langfuse platform the trace now shows with the updated name from the `deeply_nested_llm_call`, and the observations will be enriched with the appropriate data points.

![python_decorators_enriched-nesting](/public/images/cookbook/python_decorators_enriched-nesting.png)

### Flush observations

The Langfuse SDK executes network requests in the background on a separate thread for better performance of your application. This can lead to lost events in short lived environments such as AWS Lambda functions when the Python process is terminated before the SDK sent all events to our backend.

To avoid this, ensure that the `langfuse.flush()` method is called before termination. This method is waiting for all tasks to have completed, hence it is blocking.

## Additional features

### [WIP - not ready for review]Scoring

[Scores](https://langfuse.com/docs/scores/overview) are used to evaluate single observations or entire traces. They can created manually via the Langfuse UI or via the SDKs.

If the score relates to a specific step of the trace, specify the `observation_id`.

| Parameter | Type   | Optional | Description
| --- | --- | --- | ---
| trace_id | string | no | The id of the trace to which the score should be attached. Automatically set if you use `{trace,generation,span,event}.score({})`
| observation_id | string | yes | The id of the observation to which the score should be attached. Automatically set if you use `{generation,span,event}.score({})`
| name | string | no | Identifier of the score.
| value | number | no | The value of the score. Can be any number, often standardized to 0..1
| comment | string | yes | Additional context/explanation of the score.


```python
from langfuse.decorators import langfuse


# This will create a new span under the trace
@langfuse.trace()
def nested_span():
    langfuse.score_current_observation(
        name="feedback-on-span",
        value=1,
        comment="I like how personalized the response is",
    )

    langfuse.score_current_trace(
        name="feedback-on-trace",
        value=1,
        comment="I like how personalized the response is",
    )


# This will create a new trace
@langfuse.trace()
def main():
    nested_span()


main()

# Flush the trace to send it to the Langfuse platform
langfuse.flush()
```

### Custom IDs

If you have your own unique ID representing an execution (messageId, traceId, correlationId), you can easily set those as trace or observation IDs for effective lookups in Langfuse. To set a custom ID for a trace or observation, simply pass the `langfuse_observation_id` as a keyword argument *within the traced function*. Requiring `langfuse_observation_id` to be set as a keyword argument (kwarg) here rather than as a static decorator argument enables ID assignment at runtime.


```python
from langfuse.decorators import langfuse


@langfuse.trace()
def process_user_request(user_id, request_data, **kwargs):
    # Function logic here
    pass


def main():
    user_id = "user123"
    request_data = {"action": "login"}

    # Custom ID for tracking
    custom_observation_id = f"{user_id}-{request_data['action']}"
    process_user_request(
        user_id=user_id,
        request_data=request_data,
        langfuse_observation_id=custom_observation_id,
    )


main()

# Flush the trace to send it to the Langfuse platform
langfuse.flush()
```

### Debug mode
Enable debug mode to get verbose logs. Set the debug mode via the environment variable `LANGFUSE_DEBUG=True`.

### Authentication check

Use `langfuse.auth_check()` to verify that your host and API credentials are valid.

### Releases and versions

Track `releases` in Langfuse to relate traces in Langfuse with the versioning of your application. This can be done by setting the environment variable `LANGFUSE_RELEASE` or setting it as a trace parameter.

If no release is set, this defaults to [common system environment names](https://github.com/langfuse/langfuse-python/blob/main/langfuse/environment.py#L3).

## API reference

See the [Python SDK API reference](https://f5cb2b86.langfuse-python.pages.dev/langfuse/decorators/langfuse#LangfuseDecorator) for more details.
