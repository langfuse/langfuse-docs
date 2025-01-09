---
description: Cookbook with examples of the Langfuse Integration for Groq SDK (Python).
category: Integrations
---

# Cookbook: Groq SDK Integration (Python)

This cookbook provides step-by-step examples of integrating Langfuse with the Groq SDK in Python. By following these examples, you'll learn how to log and trace interactions with Groq language models, enabling you to debug and evaluate the performance of your AI-driven applications.

**Note:** *Langfuse is also natively integrated with [LangChain](https://langfuse.com/docs/integrations/langchain/tracing), [LlamaIndex](https://langfuse.com/docs/integrations/llama-index/get-started), [LiteLLM](https://langfuse.com/docs/integrations/litellm/tracing), and [other frameworks](https://langfuse.com/docs/integrations/overview). If you use one of them, any use of Groq models is instrumented right away.*

## Overview

In this notebook, we will explore various use cases where Langfuse can be integrated with the Groq SDK, including:

- **Basic LLM Calls:** Learn how to wrap standard Groq model interactions with Langfuse's `@observe` decorator for comprehensive logging.
- **Chained Function Calls:** See how to manage and observe complex workflows where multiple model interactions are linked together to produce a final result.
- **Streaming Support:** Discover how to use Langfuse with streaming responses from Groq models, ensuring that real-time interactions are fully traceable.

For more detailed guidance on the Groq SDK or the **`@observe`** decorator from Langfuse, please refer to the [Groq Documentation](https://console.groq.com/docs) and the [Langfuse Documentation](https://langfuse.com/docs/sdk/python/decorators#log-any-llm-call).

## Setup

First, install the required packages:


```python
%pip install groq langfuse
```


Set up your environment variables for Langfuse and Groq:


```python
import os

# Get keys for your project from https://cloud.langfuse.com
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-..." # Docs Example
os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-..." # Docs Example
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com"  # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com"  # 🇺🇸 US region

# Your Groq API key
os.environ["GROQ_API_KEY"] = "gsk_..."
```

Initialize the Groq client:


```python
from groq import Groq

# Initialize Groq client
groq_client = Groq(api_key=os.environ["GROQ_API_KEY"])
```

## Examples

### Basic LLM Calls

We are integrating the Groq SDK with Langfuse using the [`@observe` decorator](https://langfuse.com/docs/sdk/python/decorators), which is crucial for logging and tracing interactions with large language models (LLMs). The `@observe(as_type="generation")` decorator specifically logs LLM interactions, capturing inputs, outputs, and model parameters. The resulting `groq_chat_completion` method can then be used across your project.


```python
from langfuse.decorators import langfuse_context, observe

# Function to handle Groq chat completion calls, wrapped with @observe to log the LLM interaction
@observe(as_type="generation")
def groq_chat_completion(**kwargs):
    # Clone kwargs to avoid modifying the original input
    kwargs_clone = kwargs.copy()

    # Extract relevant parameters from kwargs
    messages = kwargs_clone.pop('messages', None)
    model = kwargs_clone.pop('model', None)
    temperature = kwargs_clone.pop('temperature', None)
    max_tokens = kwargs_clone.pop('max_tokens', None)
    top_p = kwargs_clone.pop('top_p', None)

    # Filter and prepare model parameters for logging
    model_parameters = {
        "max_tokens": max_tokens,
        "temperature": temperature,
        "top_p": top_p
    }
    model_parameters = {k: v for k, v in model_parameters.items() if v is not None}

    # Log the input and model parameters before calling the LLM
    langfuse_context.update_current_observation(
        input=messages,
        model=model,
        model_parameters=model_parameters,
        metadata=kwargs_clone,
    )

    # Call the Groq model to generate a response
    response = groq_client.chat.completions.create(**kwargs)

    # Log the usage details and output content after the LLM call
    choice = response.choices[0]
    langfuse_context.update_current_observation(
        usage_details={
            "input": len(str(messages)),
            "output": len(choice.message.content)
        },
        output=choice.message.content
    )

    # Return the model's response object
    return response
```

#### Simple Example

In the following example, we also added the decorator to the top-level function `find_best_painter_from`. This function calls the `groq_chat_completion` function, which is decorated with `@observe(as_type="generation")`. This hierarchical setup helps to trace more complex applications that involve multiple LLM calls and other non-LLM methods decorated with `@observe`.


```python
@observe()
def find_best_painter_from(country="France"):
    response = groq_chat_completion(
        model="llama3-70b-8192",
        max_tokens=1024,
        temperature=0.4,
        messages=[
            {
                "role": "user",
                "content": f"Who is the best painter from {country}? Answer in one short sentence."
            }
        ]
    )
    return response.choices[0].message.content

print(find_best_painter_from())
```

    Claude Monet, a founder of Impressionism, is often considered the best painter from France.


![Example trace in Langfuse](https://langfuse.com/images/cookbook/integration-groq/single-trace-example.png)

*[Example trace in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/d5f7e896-a51c-4f70-b066-114f0cab9020?timestamp=2025-01-09T10%3A23%3A26.872Z&observation=3dee4a0f-e348-481f-a795-d46c90ffbea5)*

### Chained Completions

This example demonstrates chaining multiple LLM calls using the `@observe()` decorator. The first call identifies the best painter from a specified country, and the second call uses that painter's name to find their most famous painting. Both interactions are logged by Langfuse as we use the wrapped `groq_chat_completion` method created above, ensuring full traceability across the chained requests.


```python
from langfuse.decorators import langfuse_context, observe

@observe()
def find_best_painting_from(country="France"):
    response = groq_chat_completion(
        model="llama3-70b-8192",
        max_tokens=1024,
        temperature=0.1,
        messages=[
            {
                "role": "user",
                "content": f"Who is the best painter from {country}? Only provide the name."
            }
        ]
    )
    painter_name = response.choices[0].message.content.strip()

    response = groq_chat_completion(
        model="llama3-70b-8192",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": f"What is the most famous painting of {painter_name}? Answer in one short sentence."
            }
        ]
    )
    return response.choices[0].message.content

print(find_best_painting_from("Germany"))
```

    Albrecht Dürer's most famous painting is "Melencolia I" (1514), a complex and enigmatic work that is widely regarded as one of the most iconic and influential prints of the Renaissance.



![Example trace in Langfuse](https://langfuse.com/images/cookbook/integration-groq/chained-trace.png)

*[Example trace in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/5913c996-84b4-4f75-9043-8db81dd4d0a4?timestamp=2025-01-09T10%3A23%3A42.893Z)*

### Streaming Completions

The following example demonstrates how to handle streaming responses from the Groq model using the `@observe(as_type="generation")` decorator. The process is similar to the completion example but includes handling streamed data in real-time.


```python
from langfuse.decorators import langfuse_context, observe

@observe(as_type="generation")
def stream_groq_chat_completion(**kwargs):
    kwargs_clone = kwargs.copy()
    messages = kwargs_clone.pop('messages', None)
    model = kwargs_clone.pop('model', None)
    temperature = kwargs_clone.pop('temperature', None)
    max_tokens = kwargs_clone.pop('max_tokens', None)
    top_p = kwargs_clone.pop('top_p', None)

    model_parameters = {
        "max_tokens": max_tokens,
        "temperature": temperature,
        "top_p": top_p
    }
    model_parameters = {k: v for k, v in model_parameters.items() if v is not None}

    langfuse_context.update_current_observation(
        input=messages,
        model=model,
        model_parameters=model_parameters,
        metadata=kwargs_clone,
    )

    stream = groq_client.chat.completions.create(stream=True, **kwargs)
    final_response = ""
    for chunk in stream:
        content = str(chunk.choices[0].delta.content)
        final_response += content
        yield content

    langfuse_context.update_current_observation(
        usage_details={
            "total_tokens": len(final_response.split())
        },
        output=final_response
    )
```

Usage:


```python
@observe()
def stream_find_best_five_painter_from(country="France"):
    response_chunks = stream_groq_chat_completion(
        model="llama3-70b-8192",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": f"Who are the best five painters from {country}? Give me a list of names and their most famous painting."
            }
        ]
    )
    final_response = ""
    for chunk in response_chunks:
        final_response += str(chunk)
        print(chunk, end="")

    return final_response

stream_find_best_five_painter_from("Spain")
```

    What a great question! Spain has a rich artistic heritage, and choosing just five painters is a challenge. However, here's a list of five of the most renowned Spanish painters, along with their most famous works:
    
    1. **Diego Velázquez** (1599-1660)
    	* Most famous painting: "Las Meninas" (1656) - a masterpiece of Baroque art, showcasing the Spanish royal family and the artist himself.
    
    2. **Pablo Picasso** (1881-1973)
    	* Most famous painting: "Guernica" (1937) - a powerful anti-war artwork responding to the bombing of the town of Guernica during the Spanish Civil War.
    
    3. **El Greco** (1541-1614)
    	* Most famous painting: "The Burial of the Count of Orgaz" (1588) - a stunning example of Mannerist art, blending Spanish and Greek influences.
    
    4. **Francisco Goya** (1746-1828)
    	* Most famous painting: "The Third of May 1808" (1814) - a haunting depiction of the brutal suppression of a rebellion against Napoleon's army.
    
    5. **Joan Miró** (1893-1983)
    	* Most famous painting: "The Birth of the World" (1925) - a seminal work of Surrealist art, showcasing the artist's unique blend of abstract forms and vibrant colors.
    
    These five painters have not only contributed significantly to the development of Spanish art but also left an indelible mark on the global art scene.None




    'What a great question! Spain has a rich artistic heritage, and choosing just five painters is a challenge. However, here\'s a list of five of the most renowned Spanish painters, along with their most famous works:\n\n1. **Diego Velázquez** (1599-1660)\n\t* Most famous painting: "Las Meninas" (1656) - a masterpiece of Baroque art, showcasing the Spanish royal family and the artist himself.\n\n2. **Pablo Picasso** (1881-1973)\n\t* Most famous painting: "Guernica" (1937) - a powerful anti-war artwork responding to the bombing of the town of Guernica during the Spanish Civil War.\n\n3. **El Greco** (1541-1614)\n\t* Most famous painting: "The Burial of the Count of Orgaz" (1588) - a stunning example of Mannerist art, blending Spanish and Greek influences.\n\n4. **Francisco Goya** (1746-1828)\n\t* Most famous painting: "The Third of May 1808" (1814) - a haunting depiction of the brutal suppression of a rebellion against Napoleon\'s army.\n\n5. **Joan Miró** (1893-1983)\n\t* Most famous painting: "The Birth of the World" (1925) - a seminal work of Surrealist art, showcasing the artist\'s unique blend of abstract forms and vibrant colors.\n\nThese five painters have not only contributed significantly to the development of Spanish art but also left an indelible mark on the global art scene.None'



![Example trace in Langfuse](https://langfuse.com/images/cookbook/integration-groq/streaming-trace.png)

*[Example trace in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/c21544f3-d837-4441-9a0c-a47b3fd5dcaf?timestamp=2025-01-09T13%3A02%3A14.362Z&observation=c0d9e820-377c-4c4d-b6cb-19dd6951bfa4)*

## Feedback

If you have any feedback or requests, please create a GitHub [Issue](https://langfuse.com/issue) or share your ideas with the community on [Discord](https://langfuse.com/discord).
