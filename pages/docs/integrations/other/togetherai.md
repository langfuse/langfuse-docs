---
title: "Monitor Together.ai with Langfuse"
description: "Learn how to integrate Together.ai using the OpenAI Python SDK with Langfuse."
---

# Integrate Together.ai with Langfuse

This guide shows you how to integrate Together.ai with Langfuse. Together's API endpoints for chat, language and code, images, and embeddings are fully compatible with OpenAI's API. This allows us to use the Langfuse OpenAI drop-in replacement to trace all parts of your application.

> **What is Together.ai?** [Together.ai](https://docs.together.ai/docs/openai-api-compatibility) empowers developers and researchers to train, fine-tune, and deploy generative AI models, offering access to over 100 open-source models on both serverless and dedicated instances. The platform emphasizes decentralized cloud services, enabling organizations of all sizes to customize AI solutions using their own data.

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

os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-..." # DOCS EXAMPLE KEYS
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-..." # DOCS EXAMPLE KEYS
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region


# Get your Together.ai API key from the project settings page
os.environ["TOGETHER_API_KEY"] = "..."
```

## Step 3: Langfuse OpenAI drop-in Replacement

In this step we use the native [OpenAI drop-in replacement](https://langfuse.com/docs/integrations/openai/python/get-started) by importing `from langfuse.openai import openai`.

To start using Together with OpenAI's client libraries, pass in your Together API key to the `api_key` option, and change the `base_url` to `https://api.together.xyz/v1`:


```python
# instead of import openai:
from langfuse.openai import openai

client = openai.OpenAI(
  api_key=os.environ.get("TOGETHER_API_KEY"),
  base_url="https://api.together.xyz/v1",
)
```

**Note:** The OpenAI drop-in replacement is fully compatible with the [Low-Level Langfuse Python SDKs](https://langfuse.com/docs/sdk/python/low-level-sdk) and [`@observe()` decorator](https://langfuse.com/docs/sdk/python/decorators) to trace all parts of your application.

## Step 4: Run An Example

The following cell demonstrates how to call Together.ai's chat model using the traced OpenAI client. All API calls will be automatically traced by Langfuse.


```python
client = openai.OpenAI(
  api_key=os.environ.get("TOGETHER_API_KEY"),
  base_url="https://api.together.xyz/v1",
)

response = client.chat.completions.create(
  model="meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
  messages=[
    {"role": "system", "content": "You are a travel agent. Be descriptive and helpful."},
    {"role": "user", "content": "Tell me the top 3 things to do in San Francisco"},
  ]
)

print(response.choices[0].message.content)
```

    San Francisco, the City by the Bay, is a vibrant and eclectic destination that offers a wide range of exciting experiences for visitors. As a travel agent, I'd be delighted to share with you the top 3 things to do in San Francisco:
    
    1. **Explore the Golden Gate Bridge**: This iconic suspension bridge is an engineering marvel and a symbol of San Francisco. Take a stroll across the bridge, which offers breathtaking views of the San Francisco Bay, the city skyline, and the Pacific Ocean. You can also walk or bike across the bridge, or take a guided tour to learn more about its history and construction.
    
    As you walk across the bridge, be sure to stop at the Golden Gate Bridge Pavilion, which offers stunning views and interactive exhibits that showcase the bridge's history and significance. If you're feeling adventurous, you can also take a guided kayak tour under the bridge, which offers a unique perspective on this iconic landmark.
    
    2. **Visit Alcatraz Island**: Located in the San Francisco Bay, Alcatraz Island is a former maximum-security prison that was once home to some of the most notorious inmates in American history, including Al Capone. Take a ferry to the island and explore the prison cells, the solitary confinement cells, and the gardens and courtyards that were once the domain of the prisoners.
    
    As you explore the island, you'll learn about the history of the prison and the lives of the inmates who were once held there. You'll also see the remnants of the prison's notorious past, including the cells where prisoners were kept in solitary confinement and the exercise yard where they were allowed to exercise.
    
    3. **Walk across the Painted Ladies**: The Painted Ladies are a row of colorful Victorian houses that are one of San Francisco's most iconic landmarks. Located in Alamo Square, these houses are a photographer's dream, with their bright colors and ornate details. Take a stroll across the square and admire the houses, which were once the homes of wealthy San Francisco families.
    
    As you walk across the square, be sure to take in the stunning views of the city skyline and the surrounding hills. You can also take a guided tour of the houses, which will give you a deeper understanding of their history and significance. If you're feeling adventurous, you can also take a hike up the nearby hills, which offer breathtaking views of the city and the bay.
    
    These are just a few of the many exciting experiences that San Francisco has to offer. Whether you're interested in history, architecture, or outdoor adventures, there's something for everyone in this vibrant and eclectic city.
    
    Would you like me to recommend any additional activities or experiences in San Francisco?


## Step 5: See Traces in Langfuse

After running the example model call, you can see the traces in Langfuse. You will see detailed information about your Together.ai API calls, including:

- Request parameters (model, messages, temperature, etc.)
- Response content
- Token usage statistics
- Latency metrics

![Langfuse Trace Example](https://langfuse.com/images/cookbook/integration-togetherai/togetherai-example-trace.png)

_[Public example trace link in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/d3c13a6f-00c5-4090-8f18-6ce18c794950?timestamp=2025-02-25T15%3A43%3A52.800Z&observation=9eeb3b33-49f0-4557-ac00-d3cbe6bc051e)_

## Resources

- Check the [Together.ai Documentation](https://docs.together.ai/docs/openai-api-compatibility) for further details on available models and API options.
- Visit [Langfuse](https://langfuse.com) to learn more about monitoring and tracing capabilities for your LLM applications.
