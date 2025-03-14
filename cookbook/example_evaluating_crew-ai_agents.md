# Bonus Unit 1: Observability and Evaluation of Agents

In this tutorial, we will learn how to **monitor the internal steps (traces) of our AI agent** and **evaluate its performance** using open-source observability tools.

The ability to observe and evaluate an agent’s behavior is essential for:
- Debugging issues when tasks fail or produce suboptimal results
- Monitoring costs and performance in real-time
- Improving reliability and safety through continuous feedback

This notebook is part of the [Hugging Face Agents Course](https://www.hf.co/learn/agents-course/unit1/introduction).

## Exercise Prerequisites 🏗️

Before running this notebook, please be sure you have:

🔲 📚  **Studied** [Introduction to Agents](https://huggingface.co/learn/agents-course/unit1/introduction)

🔲 📚  **Studied** [The smolagents framework](https://huggingface.co/learn/agents-course/unit2/smolagents/introduction)

## Step 0: Install the Required Libraries

We will need a few libraries that allow us to run, monitor, and evaluate our agents:


```python
%pip install 'smolagents[telemetry]'
%pip install opentelemetry-sdk opentelemetry-exporter-otlp openinference-instrumentation-smolagents
%pip install langfuse datasets 'smolagents[gradio]' gradio
```

## Step 1: Instrument Your Agent

In this notebook, we will use [Langfuse](https://langfuse.com/) as our observability tool, but you can use **any other OpenTelemetry-compatible service**. The code below shows how to set environment variables for Langfuse (or any OTel endpoint) and how to instrument your smolagent.

**Note:** If you are using LlamaIndex or LangGraph, you can find documentation on instrumenting them [here](https://langfuse.com/docs/integrations/llama-index/workflows) and [here](https://langfuse.com/docs/integrations/langchain/example-python-langgraph). 


```python
import os
import base64

# Get your own keys from https://cloud.langfuse.com
os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-..." 
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-..." 
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com"  # 🇪🇺 EU region example
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com"  # 🇺🇸 US region example

LANGFUSE_AUTH = base64.b64encode(
    f"{os.environ.get('LANGFUSE_PUBLIC_KEY')}:{os.environ.get('LANGFUSE_SECRET_KEY')}".encode()
).decode()

os.environ["OTEL_EXPORTER_OTLP_ENDPOINT"] = os.environ.get("LANGFUSE_HOST") + "/api/public/otel"
os.environ["OTEL_EXPORTER_OTLP_HEADERS"] = f"Authorization=Basic {LANGFUSE_AUTH}"
```


```python
# Set your Hugging Face and other tokens/secrets as environment variable
os.environ["HF_TOKEN"] = "hf_..." 
```


```python
from opentelemetry.sdk.trace import TracerProvider
from openinference.instrumentation.smolagents import SmolagentsInstrumentor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace.export import SimpleSpanProcessor
 
# Create a TracerProvider for OpenTelemetry
trace_provider = TracerProvider()

# Add a SimpleSpanProcessor with the OTLPSpanExporter to send traces
trace_provider.add_span_processor(SimpleSpanProcessor(OTLPSpanExporter()))

# Set the global default tracer provider
from opentelemetry import trace
trace.set_tracer_provider(trace_provider)
tracer = trace.get_tracer(__name__)

# Instrument smolagents with the configured provider
SmolagentsInstrumentor().instrument(tracer_provider=trace_provider)

```

## Step 2: Test Your Instrumentation

Here is a simple CodeAgent from smolagents that calculates `1+1`. We run it to confirm that the instrumentation is working correctly. If everything is set up correctly, you will see logs/spans in your observability dashboard.


```python
from smolagents import HfApiModel, CodeAgent

# Create a simple agent to test instrumentation
agent = CodeAgent(
    tools=[],
    model=HfApiModel()
)

agent.run("1+1=")
```

Check your [Langfuse Traces Dashboard](https://cloud.langfuse.com/traces) (or your chosen observability tool) to confirm that the spans and logs have been recorded.

Example screenshot from Langfuse:

![Example trace in Langfuse](https://huggingface.co/datasets/agents-course/course-images/resolve/main/en/bonus-unit2/first-example-trace.png)

_[Link to the trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/1b94d6888258e0998329cdb72a371155?timestamp=2025-03-10T11%3A59%3A41.743Z)_

## Step 3: Observe and Evaluate a More Complex Agent

Now that you have confirmed your instrumentation works, let's try a more complex query so we can see how advanced metrics (token usage, latency, costs, etc.) are tracked.


```python
from smolagents import (CodeAgent, DuckDuckGoSearchTool, HfApiModel)

search_tool = DuckDuckGoSearchTool()
agent = CodeAgent(tools=[search_tool], model=HfApiModel())

agent.run("How many Rubik's Cubes could you fit inside the Notre Dame Cathedral?")
```

### Trace Structure

Most observability tools record a **trace** that contains **spans**, which represent each step of your agent’s logic. Here, the trace contains the overall agent run and sub-spans for:
- The tool calls (DuckDuckGoSearchTool)
- The LLM calls (HfApiModel)

You can inspect these to see precisely where time is spent, how many tokens are used, and so on:

![Trace tree in Langfuse](https://huggingface.co/datasets/agents-course/course-images/resolve/main/en/bonus-unit2/trace-tree.png)

_[Link to the trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/1ac33b89ffd5e75d4265b62900c348ed?timestamp=2025-03-07T13%3A45%3A09.149Z&display=preview)_

## Online Evaluation

In the previous section, we learned about the difference between online and offline evaluation. Now, we will see how to monitor your agent in production and evaluate it live.

### Common Metrics to Track in Production

1. **Costs** — The smolagents instrumentation captures token usage, which you can transform into approximate costs by assigning a price per token.
2. **Latency** — Observe the time it takes to complete each step, or the entire run.
3. **User Feedback** — Users can provide direct feedback (thumbs up/down) to help refine or correct the agent.
4. **LLM-as-a-Judge** — Use a separate LLM to evaluate your agent’s output in near real-time (e.g., checking for toxicity or correctness).

Below, we show examples of these metrics.

#### 1. Costs

Below is a screenshot showing usage for `Qwen2.5-Coder-32B-Instruct` calls. This is useful to see costly steps and optimize your agent. 

![Costs](https://huggingface.co/datasets/agents-course/course-images/resolve/main/en/bonus-unit2/smolagents-costs.png)

_[Link to the trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/1ac33b89ffd5e75d4265b62900c348ed?timestamp=2025-03-07T13%3A45%3A09.149Z&display=preview)_

#### 2. Latency

We can also see how long it took to complete each step. In the example below, the entire conversation took 32 seconds, which you can break down by step. This helps you identify bottlenecks and optimize your agent.

![Latency](https://huggingface.co/datasets/agents-course/course-images/resolve/main/en/bonus-unit2/smolagents-latency.png)

_[Link to the trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/1ac33b89ffd5e75d4265b62900c348ed?timestamp=2025-03-07T13%3A45%3A09.149Z&display=preview)_

#### 3. Additional Attributes

You may also pass additional attributes—such as user IDs, session IDs, or tags—by setting them on the spans. For example, smolagents instrumentation uses OpenTelemetry to attach attributes like `langfuse.user.id` or custom tags.


```python
from smolagents import (CodeAgent, GoogleSearchTool, HfApiModel)
from opentelemetry import trace

search_tool = GoogleSearchTool()
agent = CodeAgent(
    tools=[search_tool],
    model=HfApiModel()
)

with tracer.start_as_current_span("Smolagent-Trace") as span:
    span.set_attribute("langfuse.user.id", "smolagent-user-123")
    span.set_attribute("langfuse.session.id", "smolagent-session-123456789")
    span.set_attribute("langfuse.tags", ["city-question", "testing-agents"])

    agent.run("What is the capital of Germany?")
```

![Enhancing agent runs with additional metrics](https://huggingface.co/datasets/agents-course/course-images/resolve/main/en/bonus-unit2/smolagents-attributes.png)

#### 4. User Feedback

If your agent is embedded into a user interface, you can record direct user feedback (like a thumbs-up/down in a chat UI). Below is an example using [Gradio](https://gradio.app/) to embed a chat with a simple feedback mechanism.

In the code snippet below, when a user sends a chat message, we capture the OpenTelemetry trace ID. If the user likes/dislikes the last answer, we attach a score to the trace.


```python
import gradio as gr
from opentelemetry.trace import format_trace_id
from smolagents import (CodeAgent, HfApiModel)
from langfuse import Langfuse

langfuse = Langfuse()
model = HfApiModel()
agent = CodeAgent(tools=[], model=model, add_base_tools=True)

formatted_trace_id = None  # We'll store the current trace_id globally for demonstration

def respond(prompt, history):
    with trace.get_tracer(__name__).start_as_current_span("Smolagent-Trace") as span:
        output = agent.run(prompt)

        current_span = trace.get_current_span()
        span_context = current_span.get_span_context()
        trace_id = span_context.trace_id
        global formatted_trace_id
        formatted_trace_id = str(format_trace_id(trace_id))
        langfuse.trace(id=formatted_trace_id, input=prompt, output=output)

    history.append({"role": "assistant", "content": str(output)})
    return history

def handle_like(data: gr.LikeData):
    # For demonstration, we map user feedback to a 1 (like) or 0 (dislike)
    if data.liked:
        langfuse.score(
            value=1,
            name="user-feedback",
            trace_id=formatted_trace_id
        )
    else:
        langfuse.score(
            value=0,
            name="user-feedback",
            trace_id=formatted_trace_id
        )

with gr.Blocks() as demo:
    chatbot = gr.Chatbot(label="Chat", type="messages")
    prompt_box = gr.Textbox(placeholder="Type your message...", label="Your message")

    # When the user presses 'Enter' on the prompt, we run 'respond'
    prompt_box.submit(
        fn=respond,
        inputs=[prompt_box, chatbot],
        outputs=chatbot
    )

    # When the user clicks a 'like' button on a message, we run 'handle_like'
    chatbot.like(handle_like, None, None)

demo.launch()

```

User feedback is then captured in your observability tool:

![User feedback is being captured in Langfuse](https://huggingface.co/datasets/agents-course/course-images/resolve/main/en/bonus-unit2/user-feedback-gradio.png)

#### 5. LLM-as-a-Judge

LLM-as-a-Judge is another way to automatically evaluate your agent's output. You can set up a separate LLM call to gauge the output’s correctness, toxicity, style, or any other criteria you care about.

**Workflow**:
1. You define an **Evaluation Template**, e.g., "Check if the text is toxic."
2. Each time your agent generates output, you pass that output to your "judge" LLM with the template.
3. The judge LLM responds with a rating or label that you log to your observability tool.

Example from Langfuse:

![LLM-as-a-Judge Evaluation Template](https://huggingface.co/datasets/agents-course/course-images/resolve/main/en/bonus-unit2/evaluator-template.png)
![LLM-as-a-Judge Evaluator](https://huggingface.co/datasets/agents-course/course-images/resolve/main/en/bonus-unit2/evaluator.png)


```python
# Example: Checking if the agent’s output is toxic or not.
from smolagents import (CodeAgent, DuckDuckGoSearchTool, HfApiModel)

search_tool = DuckDuckGoSearchTool()
agent = CodeAgent(tools=[search_tool], model=HfApiModel())

agent.run("Can eating carrots improve your vision?")
```

You can see that the answer of this example is judged as "not toxic".

![LLM-as-a-Judge Evaluation Score](https://huggingface.co/datasets/agents-course/course-images/resolve/main/en/bonus-unit2/llm-as-a-judge-score.png)

#### 6. Observability Metrics Overview

All of these metrics can be visualized together in dashboards. This enables you to quickly see how your agent performs across many sessions and helps you to track quality metrics over time.

![Observability metrics overview](https://huggingface.co/datasets/agents-course/course-images/resolve/main/en/bonus-unit2/langfuse-dashboard.png)

## Offline Evaluation

Online evaluation is essential for live feedback, but you also need **offline evaluation**—systematic checks before or during development. This helps maintain quality and reliability before rolling changes into production.

### Dataset Evaluation

In offline evaluation, you typically:
1. Have a benchmark dataset (with prompt and expected output pairs)
2. Run your agent on that dataset
3. Compare outputs to the expected results or use an additional scoring mechanism

Below, we demonstrate this approach with the [GSM8K dataset](https://huggingface.co/datasets/gsm8k), which contains math questions and solutions.


```python
import pandas as pd
from datasets import load_dataset

# Fetch GSM8K from Hugging Face
dataset = load_dataset("openai/gsm8k", 'main', split='train')
df = pd.DataFrame(dataset)
print("First few rows of GSM8K dataset:")
print(df.head())
```

Next, we create a dataset entity in Langfuse to track the runs. Then, we add each item from the dataset to the system. (If you’re not using Langfuse, you might simply store these in your own database or local file for analysis.)


```python
from langfuse import Langfuse
langfuse = Langfuse()

langfuse_dataset_name = "gsm8k_dataset_huggingface"

# Create a dataset in Langfuse
langfuse.create_dataset(
    name=langfuse_dataset_name,
    description="GSM8K benchmark dataset uploaded from Huggingface",
    metadata={
        "date": "2025-03-10", 
        "type": "benchmark"
    }
)
```


```python
for idx, row in df.iterrows():
    langfuse.create_dataset_item(
        dataset_name=langfuse_dataset_name,
        input={"text": row["question"]},
        expected_output={"text": row["answer"]},
        metadata={"source_index": idx}
    )
    if idx >= 9: # Upload only the first 10 items for demonstration
        break
```

![Dataset items in Langfuse](https://huggingface.co/datasets/agents-course/course-images/resolve/main/en/bonus-unit2/example-dataset.png)

#### Running the Agent on the Dataset

We define a helper function `run_smolagent()` that:
1. Starts an OpenTelemetry span
2. Runs our agent on the prompt
3. Records the trace ID in Langfuse

Then, we loop over each dataset item, run the agent, and link the trace to the dataset item. We can also attach a quick evaluation score if desired.


```python
from opentelemetry.trace import format_trace_id
from smolagents import (CodeAgent, HfApiModel, LiteLLMModel)

# Example: using HfApiModel or LiteLLMModel to access openai, anthropic, gemini, etc. models:
model = HfApiModel()

agent = CodeAgent(
    tools=[],
    model=model,
    add_base_tools=True
)

def run_smolagent(question):
    with tracer.start_as_current_span("Smolagent-Trace") as span:
        span.set_attribute("langfuse.tag", "dataset-run")
        output = agent.run(question)

        current_span = trace.get_current_span()
        span_context = current_span.get_span_context()
        trace_id = span_context.trace_id
        formatted_trace_id = format_trace_id(trace_id)

        langfuse_trace = langfuse.trace(
            id=formatted_trace_id, 
            input=question, 
            output=output
        )
    return langfuse_trace, output
```


```python
dataset = langfuse.get_dataset(langfuse_dataset_name)

# Run our agent against each dataset item (limited to first 10 above)
for item in dataset.items:
    langfuse_trace, output = run_smolagent(item.input["text"])

    # Link the trace to the dataset item for analysis
    item.link(
        langfuse_trace,
        run_name="smolagent-notebook-run-01",
        run_metadata={ "model": model.model_id }
    )

    # Optionally, store a quick evaluation score for demonstration
    langfuse_trace.score(
        name="<example_eval>",
        value=1,
        comment="This is a comment"
    )

# Flush data to ensure all telemetry is sent
langfuse.flush()
```

You can repeat this process with different:
- Models (OpenAI GPT, local LLM, etc.)
- Tools (search vs. no search)
- Prompts (different system messages)

Then compare them side-by-side in your observability tool:

![Dataset run overview](https://huggingface.co/datasets/agents-course/course-images/resolve/main/en/bonus-unit2/dataset_runs.png)
![Dataset run comparison](https://huggingface.co/datasets/agents-course/course-images/resolve/main/en/bonus-unit2/dataset-run-comparison.png)


## Final Thoughts

In this notebook, we covered how to:
1. **Set up Observability** using smolagents + OpenTelemetry exporters
2. **Check Instrumentation** by running a simple agent
3. **Capture Detailed Metrics** (cost, latency, etc.) through an observability tools
4. **Collect User Feedback** via a Gradio interface
5. **Use LLM-as-a-Judge** to automatically evaluate outputs
6. **Perform Offline Evaluation** with a benchmark dataset

🤗 Happy coding!
