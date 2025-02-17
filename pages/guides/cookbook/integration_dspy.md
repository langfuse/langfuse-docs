---
description: Open-source observability for DSPy, a framework that systematically optimizes language model prompts and weights.
category: Integrations
---

# DSPy - Observability & Tracing

This cookbook demonstrates how to use [DSPy](https://github.com/stanfordnlp/dspy) with Langfuse. DSPy is a framework that systematically optimizes language model prompts and weights, making it easier to build and refine complex systems with LMs by automating the tuning process and improving reliability. For further information on DSPy, please visit the [documentation](https://dspy-docs.vercel.app/docs/intro).

**Note:** For this integration, we use the [MLflow instrumentation library](https://mlflow.org/docs/latest/llms/tracing/index.html#using-opentelemetry-collector-for-exporting-traces) which sends traces to [Langfuse's OpenTelemetry backend](https://langfuse.com/docs/opentelemetry/get-started).

## Prerequisites
Install the latest versions of DSPy and MLflow. For example:


```python
%pip install dspy mlflow
```

## Step 1: Setup Langfuse Environment Variables

First, we configure the environment variables. We set the OpenTelemetry endpoint, protocol, and authorization headers so that the traces from DSPy (via MLflow) are correctly sent to Langfuse. You can get your Langfuse API keys by signing up for [Langfuse Cloud](https://cloud.langfuse.com) or [self-hosting Langfuse](https://langfuse.com/self-hosting).


```python
import os
import base64

LANGFUSE_PUBLIC_KEY="pk-lf-..."
LANGFUSE_SECRET_KEY="sk-lf-..."
LANGFUSE_AUTH=base64.b64encode(f"{LANGFUSE_PUBLIC_KEY}:{LANGFUSE_SECRET_KEY}".encode()).decode()

os.environ["OTEL_EXPORTER_OTLP_TRACES_ENDPOINT"] = "https://cloud.langfuse.com/api/public/otel/v1/traces"  # 🇪🇺 EU data region
# os.environ["OTEL_EXPORTER_OTLP_TRACES_ENDPOINT"] = "https://us.cloud.langfuse.com/api/public/otel/v1/traces"  # 🇺🇸 US data region
os.environ["OTEL_EXPORTER_OTLP_TRACES_HEADERS"] = f"Authorization=Basic {LANGFUSE_AUTH}"
os.environ['OTEL_EXPORTER_OTLP_TRACES_PROTOCOL']= "http/protobuf"
```

## Step 2: Enable MLflow Tracing for DSPy

Next, we use [MLflow’s autologging](https://dspy.ai/tutorials/observability/#tracing) module for DSPy to automatically capture your DSPy traces. This is done by a single call which instruments DSPy’s LM calls.


```python
import mlflow
mlflow.dspy.autolog()
```

## Step 3: Configure DSPy

Next, we set up DSPy. This involves initializing a language model and configuring DSPy to use it. You can then run various DSPy modules that showcase its features.


```python

import dspy
lm = dspy.LM('openai/gpt-4o-mini', api_key='sk-proj-...')
dspy.configure(lm=lm)
```

## Step 4: Running DSPy Modules with Observability

Here are a few examples form the [DSPy documentation](https://dspy.ai/) showing core features. Each example automatically sends trace data to Langfuse via MLflow.

### Example 1: Using the Chain-of-Thought Module (Math Reasoning)


```python
math = dspy.ChainOfThought("question -> answer: float")
math(question="Two dice are tossed. What is the probability that the sum equals two?")
```




    Prediction(
        reasoning='When two dice are tossed, each die has 6 faces, resulting in a total of 6 * 6 = 36 possible outcomes. The only way to achieve a sum of 2 is if both dice show a 1 (1,1). There is only 1 favorable outcome for this event. Therefore, the probability of the sum equaling 2 is the number of favorable outcomes divided by the total number of outcomes, which is 1/36.',
        answer=0.027777777777777776
    )



### Example 2: Building a RAG Pipeline


```python
def search_wikipedia(query: str) -> list[str]:
    results = dspy.ColBERTv2(url='http://20.102.90.50:2017/wiki17_abstracts')(query, k=3)
    return [x['text'] for x in results]

rag = dspy.ChainOfThought('context, question -> response')

question = "What's the name of the castle that David Gregory inherited?"
rag(context=search_wikipedia(question), question=question)
```




    Prediction(
        reasoning='The context mentions that David Gregory inherited Kinnairdy Castle in 1664. This information directly answers the question regarding the name of the castle he inherited.',
        response='The name of the castle that David Gregory inherited is Kinnairdy Castle.'
    )



### Example 3: Running a Classification Module with DSPy Signatures


```python
def evaluate_math(expression: str):
    return dspy.PythonInterpreter({}).execute(expression)

def search_wikipedia(query: str):
    results = dspy.ColBERTv2(url='http://20.102.90.50:2017/wiki17_abstracts')(query, k=3)
    return [x['text'] for x in results]

react = dspy.ReAct("question -> answer: float", tools=[evaluate_math, search_wikipedia])

pred = react(question="What is 9362158 divided by the year of birth of David Gregory of Kinnairdy castle?")
print(pred.answer)
```

    5765.0


### Disabling Auto Tracing

If you decide that you want to disable auto tracing, you can do so by passing the `disabled=True` parameter:



```python
import mlflow
mlflow.dspy.autolog(disabled=True)
```

### MLflow Trace Decorator

If you want to trace additional application logic, you can use the MLflow trace decorator. This allows you to capture the inputs and outputs of a function by adding the @mlflow.trace decorator to its definition. 

**Note:** For other [native Langfuse integrations](https://langfuse.com/docs/integrations/overview) which do not rely on an Opentelemetry instrumentation module (such as OpenAI, Langchain or Hugging Face), you can use the [Langfuse decorator](https://langfuse.com/docs/sdk/python/decorators) to trace additional application logic.


```python
import mlflow

# Mark any function with the trace decorator to automatically capture input(s) and output(s)
@mlflow.trace
def some_function(x, y, z=2):
    return x + (y - z)

# Invoking the function will generate a trace that is logged to the active experiment
some_function(2, 4)
```

## Step 5: Viewing Traces in Langfuse

After running your DSPy application, you can inspect the traced events in Langfuse:

![Example trace in Langfuse](https://langfuse.com/images/cookbook/integration-dspy/dspy-example-trace.png)

_[Public example trace link in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/c41422725cf61e12a25c2811cff9ffba?timestamp=2025-02-17T13%3A50%3A52.692Z)_

