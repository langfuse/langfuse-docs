---
title: Example - Tracing and Evaluation for the OpenAI-Agents SDK
description: This guide shows how to evaluate the OpenAI-Agents SDK with Langfuse using online and offline evaluation methods.
category: Integrations
---

# Evaluation for the OpenAI-Agents SDK

In this tutorial, we will learn how to **monitor the internal steps (traces) of the [OpenAI agent SDK](https://github.com/openai/openai-agents-python)** and **evaluate its performance** using [Langfuse](https://langfuse.com) and [Hugging Face Datasets](https://huggingface.co/datasets).

This guide covers online and offline evaluation metrics used by teams to bring agents to production fast and reliably. To learn more about evaluation strategies, check out our [blog post](https://langfuse.com/blog/2025-03-04-llm-evaluation-101-best-practices-and-challenges).

**Why AI agent Evaluation is important:**

- Debugging issues when tasks fail or produce suboptimal results
- Monitoring costs and performance in real-time
- Improving reliability and safety through continuous feedback

<br>

<div style="position: relative; padding-top: 69.85769728331177%;">
  <iframe
    src="https://customer-xnej9vqjtgxpafyk.cloudflarestream.com/e335d35a0a762b76055f3e0b977f3380/iframe?muted=true&loop=true&autoplay=true&poster=https%3A%2F%2Fcustomer-xnej9vqjtgxpafyk.cloudflarestream.com%2Fe335d35a0a762b76055f3e0b977f3380%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600&controls=false"
    loading="lazy"
    style="border: white; position: absolute; top: 0; left: 0; height: 100%; width: 100%; border-radius: 10px;"
    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
    allowfullscreen="true"
  ></iframe>
</div>

## Step 0: Install the Required Libraries

Below we install the `openai-agents` library (the OpenAI Agents SDK [link text](https://github.com/openai/openai-agents-python)), the `pydantic-ai[logfire]` OpenTelemetry instrumentation, `langfuse` and the Hugging Face `datasets` library

```python
%pip install openai-agents nest_asyncio "pydantic-ai[logfire]" langfuse datasets
```

## Step 1: Instrument Your Agent

In this notebook, we will use [Langfuse](https://langfuse.com/) to trace, debug and evaluate our agent.

**Note:** If you are using LlamaIndex or LangGraph, you can find documentation on instrumenting them [here](https://langfuse.com/docs/integrations/llama-index/workflows) and [here](https://langfuse.com/docs/integrations/langchain/example-python-langgraph).

```python
import os
import base64

# Get keys for your project from the project settings page: https://cloud.langfuse.com
os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-..."
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-..."
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region

# Build Basic Auth header.
LANGFUSE_AUTH = base64.b64encode(
    f"{os.environ.get('LANGFUSE_PUBLIC_KEY')}:{os.environ.get('LANGFUSE_SECRET_KEY')}".encode()
).decode()

# Configure OpenTelemetry endpoint & headers
os.environ["OTEL_EXPORTER_OTLP_ENDPOINT"] = os.environ.get("LANGFUSE_HOST") + "/api/public/otel"
os.environ["OTEL_EXPORTER_OTLP_HEADERS"] = f"Authorization=Basic {LANGFUSE_AUTH}"

# Your openai key
os.environ["OPENAI_API_KEY"] = "sk-proj-..."
```

With the environment variables set, we can now initialize the Langfuse client. `get_client()` initializes the Langfuse client using the credentials provided in the environment variables.

```python
from langfuse import get_client

langfuse = get_client()

# Verify connection
if langfuse.auth_check():
    print("Langfuse client is authenticated and ready!")
else:
    print("Authentication failed. Please check your credentials and host.")
```

    Langfuse client is authenticated and ready!

Pydantic Logfire offers an instrumentation for the OpenAi Agent SDK. We use this to send traces to the [Langfuse OpenTelemetry Backend](https://langfuse.com/docs/opentelemetry/get-started).

```python
import nest_asyncio
nest_asyncio.apply()
```

**Note:** `nest_asyncio.apply()` is not compatible with `uvloop`, which is commonly used with FastAPI to manage the event loop. If your application uses `uvloop` and you require nest_asyncio (e.g., for certain instrumentation or tracing libraries), you'll need to disable `uvloop` in the affected parts of your codebase and fall back to Python’s standard asyncio event loop.

```python
import logfire

# Configure logfire instrumentation.
logfire.configure(
    service_name='my_agent_service',

    send_to_logfire=False,
)
# This method automatically patches the OpenAI Agents SDK to send logs via OTLP to Langfuse.
logfire.instrument_openai_agents()
```

    Overriding of current TracerProvider is not allowed

## Step 2: Test Your Instrumentation

Here is a simple Q&A agent. We run it to confirm that the instrumentation is working correctly. If everything is set up correctly, you will see logs/spans in your observability dashboard.

```python
import asyncio
from agents import Agent, Runner

async def main():
    agent = Agent(
        name="Assistant",
        instructions="You are a senior software engineer",
    )

    result = await Runner.run(agent, "Tell me why it is important to evaluate AI agents.")
    print(result.final_output)

loop = asyncio.get_running_loop()
await loop.create_task(main())

langfuse.flush()
```

    09:51:42.350 OpenAI Agents trace: Agent workflow
    09:51:42.352   Agent run: 'Assistant'
    09:51:42.359     Responses API with 'gpt-4o'
    Evaluating AI agents is crucial for several reasons:

    1. **Performance Assessment**: Evaluating AI helps determine how well an agent performs on specific tasks and whether it meets the desired objectives or benchmarks.

    2. **Reliability and Safety**: Ensures the AI behaves consistently and safely, particularly in critical applications like healthcare, finance, or autonomous vehicles.

    3. **Bias Detection**: Helps identify and mitigate biases that could lead to unfair or discriminatory outcomes, promoting ethical AI use.

    4. **Improvement and Iteration**: Evaluation provides insights into areas where the AI can be improved, guiding further development and optimization.

    5. **Trust and Transparency**: Building trust with users and stakeholders by demonstrating the AI’s capabilities, reliability, and limitations through clear evaluation metrics.

    6. **Regulatory Compliance**: Ensures adherence to industry standards and legal requirements, which can vary by region and application.

    7. **Resource Allocation**: Helps in making informed decisions about resource allocation, ensuring effort and investment are directed towards promising AI solutions.

    8. **User Satisfaction**: Evaluation ensures that the AI meets user needs and expectations, leading to better user experience and engagement.

    Each of these factors contributes to developing AI systems that are effective, ethical, and aligned with human values and needs.

Check your [Langfuse Traces Dashboard](https://cloud.langfuse.com/traces) to confirm that the spans and logs have been recorded.

Example trace in Langfuse:

![Example trace in Langfuse](https://langfuse.com/images/cookbook/integration_openai-agents/first-example-trace.png)

_[Link to the trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/0195948781a9f0d78fd5e067154aa508?timestamp=2025-03-14T12%3A01%3A03.401Z&observation=64bcac3cb82d04e9)_

## Step 3: Observe and Evaluate a More Complex Agent

Now that you have confirmed your instrumentation works, let's try a more complex query so we can see how advanced metrics (token usage, latency, costs, etc.) are tracked.

```python
import asyncio
from agents import Agent, Runner, function_tool

# Example function tool.
@function_tool
def get_weather(city: str) -> str:
    return f"The weather in {city} is sunny."

agent = Agent(
    name="Hello world",
    instructions="You are a helpful agent.",
    tools=[get_weather],
)

async def main():
    result = await Runner.run(agent, input="What's the weather in Berlin?")
    print(result.final_output)

loop = asyncio.get_running_loop()
await loop.create_task(main())
```

    09:53:26.847 OpenAI Agents trace: Agent workflow
    09:53:26.856   Agent run: 'Hello world'
    09:53:26.859     Responses API with 'gpt-4o'
    09:53:27.783     Function: get_weather
    09:53:27.784     Responses API with 'gpt-4o'
    The weather in Berlin is currently sunny.

### Trace Structure

Langfuse records a **trace** that contains **spans**, which represent each step of your agent’s logic. Here, the trace contains the overall agent run and sub-spans for:

- The tool call (get_weather)
- The LLM calls (Responses API with 'gpt-4o')

You can inspect these to see precisely where time is spent, how many tokens are used, and so on:

![Trace tree in Langfuse](https://langfuse.com/images/cookbook/integration_openai-agents/trace-tree.png)

_[Link to the trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/019594b5b9a27c5d497b13be71e7f255?timestamp=2025-03-14T12%3A51%3A32.386Z&display=preview&observation=6374a3c96baf831d)_

## Online Evaluation

Online Evaluation refers to evaluating the agent in a live, real-world environment, i.e. during actual usage in production. This involves monitoring the agent’s performance on real user interactions and analyzing outcomes continuously.

We have written down a guide on different evaluation techniques [here](https://langfuse.com/blog/2025-03-04-llm-evaluation-101-best-practices-and-challenges).

### Common Metrics to Track in Production

1. **Costs** — The instrumentation captures token usage, which you can transform into approximate costs by assigning a price per token.
2. **Latency** — Observe the time it takes to complete each step, or the entire run.
3. **User Feedback** — Users can provide direct feedback (thumbs up/down) to help refine or correct the agent.
4. **LLM-as-a-Judge** — Use a separate LLM to evaluate your agent’s output in near real-time (e.g., checking for toxicity or correctness).

Below, we show examples of these metrics.

#### 1. Costs

Below is a screenshot showing usage for `gpt-4o` calls. This is useful to see costly steps and optimize your agent.

![Costs](https://langfuse.com/images/cookbook/integration_openai-agents/gpt-4o-costs.png)

_[Link to the trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/019594b5b9a27c5d497b13be71e7f255?timestamp=2025-03-14T12%3A51%3A32.386Z&display=preview&observation=6374a3c96baf831d)_

#### 2. Latency

We can also see how long it took to complete each step. In the example below, the entire run took 7 seconds, which you can break down by step. This helps you identify bottlenecks and optimize your agent.

![Latency](https://langfuse.com/images/cookbook/integration_openai-agents/openai-agent-latency.png)

_[Link to the trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/019594b5b9a27c5d497b13be71e7f255?timestamp=2025-03-14T12%3A51%3A32.386Z&display=timeline&observation=b12967a01b3f8bcb)_

#### 3. Add Additional Attributes

Langfuse allows you to pass additional attributes to your spans. These can include `user_id`, `tags`, `session_id`, and custom `metadata`. Enriching traces with these details is important for analysis, debugging, and monitoring of your application's behavior across different users or sessions.

The following code demonstrates how to start a custom span with `langfuse.start_as_current_span` and then update the trace associated with this span using `span.update_trace()`.

**→ Learn more about [Updating Trace and Span Attributes](https://langfuse.com/docs/sdk/python/sdk-v3#updating-observations).**

```python
input_query = "Why is AI agent evaluation important?"

with langfuse.start_as_current_span(
    name="OpenAI-Agent-Trace",
    ) as span:

    # Run your application here
    async def main(input_query):
            agent = Agent(
                name = "Assistant",
                instructions = "You are a helpful assistant.",
            )

            result = await Runner.run(agent, input_query)
            print(result.final_output)
            return result

    result = await main(input_query)

    # Pass additional attributes to the span
    span.update_trace(
        input=input_query,
        output=result,
        user_id="user_123",
        session_id="my-agent-session",
        tags=["staging", "demo", "OpenAI Agent SDK"],
        metadata={"email": "user@langfuse.com"},
        version="1.0.0"
        )

# Flush events in short-lived applications
langfuse.flush()
```

    09:56:52.232 OpenAI Agents trace: Agent workflow
    09:56:52.233   Agent run: 'Assistant'
    09:56:52.236     Responses API with 'gpt-4o'
    AI agent evaluation is crucial for several reasons:

    1. **Performance Assessment**: It determines how well the AI meets its intended tasks and objectives. This ensures that the AI can perform at a level that is useful and reliable.

    2. **Safety and Reliability**: Evaluating AI helps identify and mitigate potential risks, bugs, or errors that could lead to unintended or harmful outcomes.

    3. **Fairness and Bias**: It helps detect and address biases in AI systems, ensuring fair treatment and reducing discrimination against specific groups.

    4. **Transparency and Accountability**: Evaluation provides insights into AI decision-making processes, which is vital for accountability and building trust with users and stakeholders.

    5. **Improvement and Optimization**: Through evaluation, developers can identify areas for improvement, optimize algorithms, and enhance the overall efficiency and effectiveness of AI systems.

    6. **Compliance and Regulation**: Ensures that AI systems comply with legal, ethical, and industry standards, which is increasingly important as regulations evolve.

    7. **User Experience**: Helps tailor AI systems to user needs by understanding how they interact with and perceive the AI’s performance.

    Overall, evaluation is a key component in the lifecycle of AI development, ensuring that systems are effective, ethical, and aligned with their intended purpose.

![Example trace in Langfuse](https://langfuse.com/images/cookbook/integration_openai-agents/openai-agent-sdk-custom-attributes.png)

#### 4. User Feedback

If your agent is embedded into a user interface, you can record direct user feedback (like a thumbs-up/down in a chat UI). Below is an example using `IPython.display` for simple feedback mechanism.

In the code snippet below, when a user sends a chat message, we capture the OpenTelemetry trace ID. If the user likes/dislikes the last answer, we attach a score to the trace.

```python
from agents import Agent, Runner, WebSearchTool
from opentelemetry.trace import format_trace_id
import ipywidgets as widgets
from IPython.display import display
from langfuse import get_client

langfuse = get_client()

# Define your agent with the web search tool
agent = Agent(
    name="WebSearchAgent",
    instructions="You are an agent that can search the web.",
    tools=[WebSearchTool()]
)

def on_feedback(button):
    if button.icon == "thumbs-up":
      langfuse.create_score(
            value=1,
            name="user-feedback",
            comment="The user gave this response a thumbs up",
            trace_id=trace_id
        )
    elif button.icon == "thumbs-down":
      langfuse.create_score(
            value=0,
            name="user-feedback",
            comment="The user gave this response a thumbs down",
            trace_id=trace_id
        )
    print("Scored the trace in Langfuse")

user_input = input("Enter your question: ")

# Run agent
with langfuse.start_as_current_span(
    name="OpenAI-Agent-Trace",
    ) as span:

    # Run your application here
    result = Runner.run_sync(agent, user_input)
    print(result.final_output)

    result = await main(user_input)
    trace_id = langfuse.get_current_trace_id()

    span.update_trace(
        input=user_input,
        output=result.final_output,
    )

# Get feedback
print("How did you like the agent response?")

thumbs_up = widgets.Button(description="👍", icon="thumbs-up")
thumbs_down = widgets.Button(description="👎", icon="thumbs-down")

thumbs_up.on_click(on_feedback)
thumbs_down.on_click(on_feedback)

display(widgets.HBox([thumbs_up, thumbs_down]))

# Flush events in short-lived applications
langfuse.flush()
```

    10:06:34.993 OpenAI Agents trace: Agent workflow
    10:06:34.995   Agent run: 'WebSearchAgent'
    10:06:34.996     Responses API with 'gpt-4o'
    1 times 1 equals 1.
    10:06:36.456 OpenAI Agents trace: Agent workflow
    10:06:36.456   Agent run: 'Assistant'
    10:06:36.457     Responses API with 'gpt-4o'
    \(1 \times 1 = 1\)
    How did you like the agent response?



    HBox(children=(Button(description='👍', icon='thumbs-up', style=ButtonStyle()), Button(description='👎', icon='t…


    Scored the trace in Langfuse

User feedback is then captured in Langfuse:

![User feedback is being captured in Langfuse](https://langfuse.com/images/cookbook/integration_openai-agents/open-ai-agent-user-feedback.png)

#### 5. LLM-as-a-Judge

LLM-as-a-Judge is another way to automatically evaluate your agent's output. You can set up a separate LLM call to gauge the output’s correctness, toxicity, style, or any other criteria you care about.

**Workflow**:

1. You define an **Evaluation Template**, e.g., "Check if the text is toxic."
2. You set a model that is used as judge-model; in this case `gpt-4o-mini`.
3. Each time your agent generates output, you pass that output to your "judge" LLM with the template.
4. The judge LLM responds with a rating or label that you log to your observability tool.

Example from Langfuse:

![LLM-as-a-Judge Evaluation Template](https://langfuse.com/images/cookbook/integration_openai-agents/evaluator-template.png)
![LLM-as-a-Judge Evaluator](https://langfuse.com/images/cookbook/integration_openai-agents/evaluator.png)

```python
# Example: Checking if the agent’s output is toxic or not.
from agents import Agent, Runner, WebSearchTool

# Define your agent with the web search tool
agent = Agent(
    name="WebSearchAgent",
    instructions="You are an agent that can search the web.",
    tools=[WebSearchTool()]
)

input_query = "Is eating carrots good for the eyes?"

# Run agent
with langfuse.start_as_current_span(name="OpenAI-Agent-Trace") as span:
    # Run your agent with a query
    result = Runner.run_sync(agent, input_query)

    # Add input and output values to parent trace
    span.update_trace(
        input=input_query,
        output=result.final_output,
    )
```

    10:08:58.475 OpenAI Agents trace: Agent workflow
    10:08:58.476   Agent run: 'WebSearchAgent'
    10:08:58.478     Responses API with 'gpt-4o'

You can see that the answer of this example is judged as "not toxic".

![LLM-as-a-Judge Evaluation Score](https://langfuse.com/images/cookbook/integration_openai-agents/llm-as-a-judge-score.png)

#### 6. Observability Metrics Overview

All of these metrics can be visualized together in dashboards. This enables you to quickly see how your agent performs across many sessions and helps you to track quality metrics over time.

![Observability metrics overview](https://langfuse.com/images/cookbook/integration_openai-agents/dashboard-dark.png)

## Offline Evaluation

Online evaluation is essential for live feedback, but you also need **offline evaluation**—systematic checks before or during development. This helps maintain quality and reliability before rolling changes into production.

### Dataset Evaluation

In offline evaluation, you typically:

1. Have a benchmark dataset (with prompt and expected output pairs)
2. Run your agent on that dataset
3. Compare outputs to the expected results or use an additional scoring mechanism

Below, we demonstrate this approach with the [search-dataset](https://huggingface.co/datasets/junzhang1207/search-dataset), which contains questions that can be answered via the web search tool and expected answers.

```python
import pandas as pd
from datasets import load_dataset

# Fetch search-dataset from Hugging Face
dataset = load_dataset("junzhang1207/search-dataset", split = "train")
df = pd.DataFrame(dataset)
print("First few rows of search-dataset:")
print(df.head())
```

Next, we create a dataset entity in Langfuse to track the runs. Then, we add each item from the dataset to the system.

```python
from langfuse import get_client
langfuse = get_client()

langfuse_dataset_name = "search-dataset_huggingface_openai-agent"

# Create a dataset in Langfuse
langfuse.create_dataset(
    name=langfuse_dataset_name,
    description="search-dataset uploaded from Huggingface",
    metadata={
        "date": "2025-03-14",
        "type": "benchmark"
    }
)
```

    Dataset(id='cm88w66t102qpad07xhgeyaej', name='search-dataset_huggingface_openai-agent', description='search-dataset uploaded from Huggingface', metadata={'date': '2025-03-14', 'type': 'benchmark'}, project_id='cloramnkj0002jz088vzn1ja4', created_at=datetime.datetime(2025, 3, 14, 14, 47, 14, 676000, tzinfo=datetime.timezone.utc), updated_at=datetime.datetime(2025, 3, 14, 14, 47, 14, 676000, tzinfo=datetime.timezone.utc))

```python
for idx, row in df.iterrows():
    langfuse.create_dataset_item(
        dataset_name=langfuse_dataset_name,
        input={"text": row["question"]},
        expected_output={"text": row["expected_answer"]}
    )
    if idx >= 49: # For this example, we upload only the first 50 items
        break
```

![Dataset items in Langfuse](https://langfuse.com/images/cookbook/integration_openai-agents/example-dataset.png)

#### Running the Agent on the Dataset

We define a helper function `run_openai_agent()` that:

1. Starts a Langfuse span
2. Runs our agent on the prompt
3. Records the trace ID in Langfuse

Then, we loop over each dataset item, run the agent, and link the trace to the dataset item. We can also attach a quick evaluation score if desired.

```python
from agents import Agent, Runner, WebSearchTool
from langfuse import get_client

langfuse = get_client()
dataset_name = "search-dataset_huggingface_openai-agent"
current_run_name = "qna_model_v3_run_05_20" # Identifies this specific evaluation run

agent = Agent(
    name="WebSearchAgent",
    instructions="You are an agent that can search the web.",
    tools=[WebSearchTool(search_context_size= "high")]
)

# Assume 'run_openai_agent' is your instrumented application function
def run_openai_agent(question):
    with langfuse.start_as_current_generation(name="qna-llm-call") as generation:
        # Simulate LLM call
        result = Runner.run_sync(agent, question)

        # Update the trace with the input and output
        generation.update_trace(
            input= question,
            output=result.final_output,
        )

        return result.final_output

dataset = langfuse.get_dataset(name=dataset_name) # Fetch your pre-populated dataset

for item in dataset.items:

    # Use the item.run() context manager
    with item.run(
        run_name=current_run_name,
        run_metadata={"model_provider": "OpenAI", "temperature_setting": 0.7},
        run_description="Evaluation run for Q&A model v3 on May 20th"
    ) as root_span: # root_span is the root span of the new trace for this item and run.
        # All subsequent langfuse operations within this block are part of this trace.

        # Call your application logic
        generated_answer = run_openai_agent(question=item.input["text"])

        print(item.input)
```

You can repeat this process with different:

- Search tools (e.g. different context sized for OpenAI's `WebSearchTool`)
- Models (gpt-4o-mini, o1, etc.)
- Tools (search vs. no search)

Then compare them side-by-side in Langfuse. In this example, I did run the agent 3 times on the 50 dataset questions. For each run, I used a different setting for the context size of OpenAI's `WebSearchTool`. You can see that an increased context size also slightly increased the answer correctness from `0.89` to `0.92`. The `correct_answer` score is created by an [LLM-as-a-Judge Evaluator](https://langfuse.com/docs/scores/model-based-evals) that is set up to judge the correctness of the question based on the sample answer given in the dataset.

![Dataset run overview](https://langfuse.com/images/cookbook/integration_openai-agents/dataset_runs.png)
![Dataset run comparison](https://langfuse.com/images/cookbook/integration_openai-agents/dataset-run-comparison.png)

## Resources

Check out the [Langfuse docs](https://langfuse.com/docs) to learn more ways to evaluate and debug your agent.
