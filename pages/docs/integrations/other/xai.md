---
title: "Integrate X.ai (Grok) with Langfuse"
description: "Guide on integrating xAI's Grok models with Langfuse for observability."
---

# Observability for xAI / Grok with Langfuse

This guide shows you how to integrate Grok with Langfuse using the OpenAI SDK.

> **What is Grok?** Grok is X.ai’s advanced AI platform that streamlines natural language processing for intelligent application integration. Learn more at [Grok Documentation](https://docs.x.ai/docs).

> **What is Langfuse?** [Langfuse](https://langfuse.com) is an open source LLM engineering platform that helps teams trace API calls, monitor performance, and debug issues in their AI applications.

## Step 1: Install Dependencies

Make sure you have installed the necessary Python packages:


```python
%pip install openai langfuse
```

## Step 2: Set Up Environment Variables


```python
import os

# Get keys for your project from the project settings page
# https://cloud.langfuse.com

os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-..."
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-..."
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region


# Get your Grok API key from your Grok account settings
os.environ["GROK_API_KEY"] = "xai-..."
```

## Step 3: Use Grok with the OpenAI SDK

To utilize Grok through the OpenAI SDK, we use the Langfuse drop-in replacement for OpenAI. Replace the base URL with Grok’s endpoint.


```python
# Instead of importing openai directly:
from langfuse.openai import openai

client = openai.OpenAI(
  api_key=os.environ.get("GROK_API_KEY"),
  base_url="https://api.x.ai/v1"  # Grok's endpoint
)
```

## Step 4: Run an Example

The following example demonstrates how to make a simple request using Grok's API. All API calls will be automatically traced by Langfuse.


```python
response = client.chat.completions.create(
  model="grok-2-latest",
  messages=[
    {"role": "system", "content": "You are an assistant."},
    {"role": "user", "content": "What is Langfuse?"}
  ],
  name = "Grok-2-Trace"
)

print(response.choices[0].message.content)
```

    Langfuse is an observability and debugging tool specifically designed for Large Language Model (LLM) applications. It helps developers and engineers monitor, debug, and improve their LLM-powered applications by providing insights into the performance and behavior of the models. Key features of Langfuse include:
    
    - **Tracing**: Allows you to track the flow of requests through your application, helping you understand how different components interact.
    - **Metrics**: Provides quantitative data on the performance of your LLM, such as latency, throughput, and error rates.
    - **Logs**: Captures detailed logs of interactions with the LLM, which can be invaluable for debugging and understanding model behavior.
    - **Analytics**: Offers analytics to help you optimize your application based on real usage data.
    
    Langfuse is particularly useful for teams working on complex AI-driven applications, as it helps in identifying issues, optimizing performance, and ensuring the reliability of the system.


## Step 5: Enhance Tracing (Optional)

You can enhance your Grok traces:

- Add [metadata](https://langfuse.com/docs/tracing-features/metadata), [tags](https://langfuse.com/docs/tracing-features/tags), [log levels](https://langfuse.com/docs/tracing-features/log-levels) and [user IDs](https://langfuse.com/docs/tracing-features/users) to traces
- Group traces by [sessions](https://langfuse.com/docs/tracing-features/sessions)
- [`@observe()` decorator](https://langfuse.com/docs/sdk/python/decorators) to trace additional application logic
- Use [Langfuse Prompt Management](https://langfuse.com/docs/prompts/get-started) and link prompts to traces
- Add [score](https://langfuse.com/docs/scores/custom) to traces

Visit the [OpenAI SDK cookbook](https://langfuse.com/docs/integrations/openai/python/examples) to see more examples on passing additional parameters.
Find out more about Langfuse Evaluations and Prompt Management in the [Langfuse documentation](https://langfuse.com/docs).


## Step 6: See Traces in Langfuse

After running the example, log in to Langfuse to view the detailed traces, including:

- Request parameters
- Response content
- Token usage and latency metrics

<img src="https://langfuse.com/images/cookbook/integration-grok/grok-example-trace.png" alt="Langfuse Trace Example" style="border-radius: 8px;" />

_[Public example trace link in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/9178205e-2cb4-4952-8ec0-5244a1105263?timestamp=2025-03-05T11%3A07%3A46.600Z)_

## Resources

- [Grok Documentation](https://docs.x.ai/docs/overview)
- [Langfuse](https://langfuse.com)
- [Langfuse OpenAI Integration Guide](https://langfuse.com/docs/integrations/openai/python/get-started)
