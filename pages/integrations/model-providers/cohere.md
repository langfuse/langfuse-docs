---
title: Integrate Cohere with Langfuse
sidebarTitle: Cohere
description: Guide on integrating Cohere with Langfuse via the OpenAI SDK for observability and debugging.
category: Integrations
logo: /images/integrations/cohere_icon.svg
---

# Observability for Cohere with Langfuse

This guide shows you how to integrate Cohere with Langfuse using the OpenAI SDK Compatibility API. Trace and monitor your applications seamlessly.

> **What is Cohere?** [Cohere](https://docs.cohere.com/docs/) is an AI platform that provides state-of-the-art language models via API, allowing developers to build applications with natural language understanding capabilities.

> **What is Langfuse?** [Langfuse](https://langfuse.com) is an open source LLM engineering platform for tracing, monitoring, and debugging LLM applications.

## Step 1: Install Dependencies

Ensure you have the necessary Python packages installed:


```python
%pip install openai langfuse
```

## Step 2: Set Up Environment Variables


```python
import os

# Get keys for your project from the project settings page
# https://cloud.langfuse.com

os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf..." 
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf..." 
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region

# Set your Cohere API key from your Cohere account settings
os.environ["COHERE_API_KEY"] = "..."
```

## Step 3: Use Cohere with the OpenAI SDK

Leverage the Compatibility API by replacing the base URL with Cohere's endpoint when initializing the client.


```python
# Instead of importing openai directly, use Langfuse's drop-in replacement
from langfuse.openai import openai

client = openai.OpenAI(
  api_key=os.environ.get("COHERE_API_KEY"),
  base_url="https://api.cohere.ai/compatibility/v1"  # Cohere Compatibility API endpoint
)
```

## Step 4: Run an Example

The example below demonstrates a basic chat completion request. All API calls are automatically traced by Langfuse.


```python
response = client.chat.completions.create(
  model="command-r7b-12-2024",  # Replace with the desired Cohere model
  messages=[
    {"role": "system", "content": "You are an assistant."},
    {"role": "user", "content": "Tell me about the benefits of using Cohere with Langfuse."}
  ],
  name="Cohere-Trace"
)

print(response.choices[0].message.content)
```

## Step 5: See Traces in Langfuse

After running the example, log in to Langfuse to view the detailed traces, including request parameters, response content, token usage, and latency metrics.

![Langfuse Trace Example](https://langfuse.com/images/cookbook/integration_cohere/cohere-example-trace.png)

_[Public example trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/17d82424-f22f-46d1-a63b-6ec3e2c3da1e?timestamp=2025-03-05T11%3A35%3A26.398Z&observation=490e73b2-fdf5-40ad-95d7-a1d0bd054e0e)_

## Resources

- [Cohere Documentation](https://docs.cohere.com/docs/compatibility-api)
- [Langfuse](https://langfuse.com)
- [Langfuse OpenAI Integration Guide](https://langfuse.com/integrations/model-providers/openai-py)
