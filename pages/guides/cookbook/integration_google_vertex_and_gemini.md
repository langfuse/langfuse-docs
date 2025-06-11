---
title: Observability and Metrics for Google Vertex AI and Gemini
description: Open source observability for Google Vertex AI applications and the Vertex AI SDK.
category: Integrations
---

# Google Vertex AI and Google Gemini Integration

[**Google Vertex AI**](https://cloud.google.com/vertex-ai) grants access to Google's own series of Gemini models as well as various models via the Vertex Model Garden (e.g. Claude3).

When **using Langfuse with Google Vertex AI**, you can easily capture [detailed traces](https://langfuse.com/docs/tracing) and metrics for every request, giving you insights into the performance and behavior of your application.

All in-ui Langfuse features next to tracing (playground, llm-as-a-judge evaluation, prompt experiments) are fully compatible with Google Vertex AI – just add your Vertex configuration in the project settings.

![Langfuse Overview Google Vertex](https://static.langfuse.com/cookbooks%2Fgoogle-vertex%2Fgoogle-vertex-langfuse.gif)

## Integration Options

There are a few ways through which you can capture traces and metrics for Google Vertex AI:

1. via an application framework that is integrated with Langfuse:

   - [Langchain](https://langfuse.com/docs/integrations/langchain)
   - [Llama Index](https://langfuse.com/docs/integrations/llama-index) 
   - [Haystack](https://langfuse.com/docs/integrations/haystack/get-started)
   - [Vercel AI SDK](https://langfuse.com/docs/integrations/vercel-ai-sdk)

2. via a Proxy such as [LiteLLM](https://langfuse.com/docs/integrations/litellm/tracing)
3. via wrapping the Vertex AI SDK with the [Langfuse Decorator](https://langfuse.com/docs/sdk/python/decorators) (_see example below_)

## Notebook Setup

This is an example notebook which illustrates the different ways to capture traces and metrics for Google Vertex AI. Let's first setup the notebook environment by installing the requirements and authenticating with Google and Langfuse.

### Install Requirements


```python
# install requirements for this notebook
%pip install langchain langchain-google-vertexai langfuse anthropic[vertex] google-cloud-aiplatform
```

### Authenticate with Google Vertex

**Authenticate your notebook environment (Colab only)**

If you are running this notebook on Google Colab, run the cell below to authenticate your environment.


```python
import sys

if "google.colab" in sys.modules:
    from google.colab import auth

    auth.authenticate_user()
```

**Set Google Cloud project information and initialize Vertex AI SDK**

To get started using Vertex AI, you must have an existing Google Cloud project and [enable the Vertex AI API](https://console.cloud.google.com/flows/enableapi?apiid=aiplatform.googleapis.com).

Learn more about setting up a [project and a development environment](https://cloud.google.com/vertex-ai/docs/start/cloud-environment).


```python
PROJECT_ID = "vertex-gemini-credentials"
LOCATION = "us-central1"

import vertexai

vertexai.init(project=PROJECT_ID, location=LOCATION)
```

### Authenticate with Langfuse


```python
import os

# Get keys for your project from the project settings page
# https://cloud.langfuse.com
os.environ["LANGFUSE_SECRET_KEY"] = ""
os.environ["LANGFUSE_PUBLIC_KEY"] = ""
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region
```

## How to wrap the Vertex AI SDK with the Langfuse Decorator

The langfuse [`@observe()` decorator for Python](https://langfuse.com/docs/sdk/python/decorators) is powerful as it helps to instrument any LLM call and regular python function. Thereby you can trace complex LLM applications and non-LLM steps such as context retrieval, important LLM calls, or conversational memory management.

In the following example, we wrap the Vertex AI SDK with the Langfuse decorator once (`vertex_generate_content`) to capture token counts and model metadata, and then reuse the decorated function.

### Wrap SDK


```python
import base64
import vertexai
from vertexai.generative_models import GenerativeModel, Part, FinishReason
import vertexai.preview.generative_models as generative_models

from langfuse import observe, get_client
langfuse = get_client()

@observe(as_type="generation")
def vertex_generate_content(input, model_name = "gemini-pro"):
  vertexai.init(project="vertex-gemini-credentials", location="us-central1")
  model = GenerativeModel(model_name)
  response = model.generate_content(
      [input],
      generation_config={
        "max_output_tokens": 8192,
        "temperature": 1,
        "top_p": 0.95,
      }
  )

  # pass model, model input, and usage metrics to Langfuse
  langfuse.update_current_span(
      input=input,
      model=model_name,
      usage_details={
          "input": response.usage_metadata.prompt_token_count,
          "output": response.usage_metadata.candidates_token_count,
          "total": response.usage_metadata.total_token_count
      }
  )
  return response.candidates[0].content.parts[0].text

```

### Run example


```python
@observe()
def assemble_prompt():
  return "please generate a small poem addressing the size of the sun and its importance for humanity"

@observe()
def poem():
  prompt = assemble_prompt()
  return vertex_generate_content(prompt)

poem()
```




    "The Sun, a giant ball so near and bright,\nIt casts its warmth and life-sustaining light,\nSo vast in size it fills our sky with gold,\nIts fiery furnace stories yet untold,\nA tiny speck, our Earth, around it goes,\nIn endless dance as planets should all know,\nIts light and heat our very being feed,\nWithout its grace we could never succeed. \n\nSo, Sun we thank you for your brilliance true, \nAnd all you do, that's good and kind and new,\nWe bask and breathe, you make our world so fair,\nA glowing star, our Sun beyond compare.\n"



See [example trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/582ab430-6fa3-4842-b472-96d33e12cd5f?timestamp=2024-12-02T15%3A01%3A42.419Z) in Langfuse.

![Trace in Langfuse](https://static.langfuse.com/cookbooks%2Fgoogle-vertex%2Fgoogle-vertex-decorator-trace.gif)

## Trace Vertex AI via Langchain

Alternatively, you can use one of the native Langfuse integrations.

Here, we'll use the [LangChain integration](https://langfuse.com/docs/integrations/langchain/tracing) to gain detailed traces of the LLM calls made to Google Vertex.


```python
from langfuse.langchain import CallbackHandler
 
# Initialize Langfuse CallbackHandler for Langchain (tracing)
langfuse_handler = CallbackHandler()
```

### Gemini Models


```python
from langchain_google_vertexai import VertexAI

model = VertexAI(model_name="gemini-pro", project=PROJECT_ID)

# pass langfuse_handler as callback to `invoke`
model.invoke("What are some of the pros and cons of Python as a programming language?", config={"callbacks": [langfuse_handler]})
```




    "## Pros of Python \n\n* **Easy to learn:** Python has a simple and elegant syntax, making it one of the easiest programming languages to learn, even for beginners. This makes it a popular choice for teaching programming concepts and for rapid prototyping.\n* **Versatile:** Python is a general-purpose language, meaning it can be used for a wide range of tasks, from web development and data science to machine learning and game development. This versatility makes it a valuable tool for developers of all skill levels.\n* **Large and active community:** Python has a large and active community of developers, which provides a wealth of resources, libraries, and support for users. This makes it easy to find help and inspiration when working on Python projects.\n* **Extensive libraries:** Python has a vast collection of libraries and frameworks available for various tasks, including data analysis, web development, machine learning, and scientific computing. This makes it easier to find pre-built solutions for common problems, saving developers time and effort.\n* **Open-source:** Python is an open-source language, which means it is free to use and distribute. This makes it accessible to everyone and allows developers to contribute to the language's development.\n* **Portable:** Python code can run on a wide range of platforms, including Windows, macOS, Linux, and Unix. This makes it a portable language that can be used on different systems without modification.\n* **Focus on readability:** Python's syntax is designed to be clear and readable, with a focus on using plain English keywords and a consistent style. This makes it easier to understand and maintain code, especially for collaborative projects.\n\n## Cons of Python\n\n* **Speed:** Python is an interpreted language, which means it is typically slower than compiled languages like C++ or Java. This can be a disadvantage for performance-critical applications.\n* **Dynamic typing:** Python is a dynamically typed language, which means that variable types are not declared explicitly. This can lead to errors if a variable is used with an incorrect data type.\n* **Limited memory management:** Python has automatic memory management, which can simplify development but can also lead to memory leaks if not used carefully.\n* **Global Interpreter Lock (GIL):** The GIL is a feature of Python that prevents multiple threads from executing Python code simultaneously. This can limit the performance of Python applications in multi-core environments.\n* **Maturity:** Although Python is a mature language, it is still evolving, and its libraries and frameworks can be subject to frequent changes and updates. This can make it challenging to maintain code over time.\n\n\nOverall, Python is a powerful and versatile language with a wide range of uses. Its ease of use, large community, and extensive libraries make it a popular choice for many developers. However, its slower speed and dynamic typing can be limitations for certain applications."



See [example trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/0a0381d9-e8b4-4478-b5c0-7a71dd5cd296?timestamp=2024-12-02T14%3A59%3A42.809Z) in Langfuse.

![Trace](https://static.langfuse.com/cookbooks%2Fgoogle-vertex%2Flangchain-gemini-pro.png)

### Anthropic Models via Vertex Model Garden


```python
from langchain_google_vertexai.model_garden import ChatAnthropicVertex

model = ChatAnthropicVertex(
    model_name="claude-3-haiku@20240307",
    project=PROJECT_ID
)

# pass langfuse_handler as callback to `invoke`
model.invoke("What are some of the pros and cons of Python as a programming language?", config={"callbacks": [langfuse_handler]})
```

See [example trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/6cdcb1fb-b02f-4571-baee-bada0fa2719a?timestamp=2024-12-02T15%3A00%3A39.193Z) in Langfuse.

![Trace in Langfuse](https://static.langfuse.com/cookbooks%2Fgoogle-vertex%2Flangchain-vertex-anthropic.png)

## Can I monitor Google Vertex and Gemini cost and token usage in Langfuse?

Yes, you can monitor cost and token usage of your Google Vertex and Gemini calls in Langfuse. The native integrations with LLM application frameworks and the LiteLLM proxy will automatically report token usage to Langfuse.

If you use the Langfuse decorator or the low-level Python SDK, you can [report](https://langfuse.com/docs/model-usage-and-cost) token usage and (optionally) also cost information directly. See example above for details.

You can define custom price information via the Langfuse dashboard or UI ([see docs](https://langfuse.com/docs/model-usage-and-cost)) to adjust to the exact pricing of your models on Google Vertex and Gemini.
