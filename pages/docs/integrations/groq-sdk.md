---
description: Traceability and observability for Groq language models with Langfuse. This cookbook provides examples on how to use the OpenAI SDK and the Groq SDK to interact with Groq models and trace them with Langfuse.
category: Integrations
---

# Cookbook: Observability for Groq Models (Python)

This cookbook shows two ways to interact with Groq models and trace them with Langfuse:

1. Using the OpenAI SDK to interact with the Groq model
2. Using the Groq SDK to interact with Groq models

By following these examples, you'll learn how to log and trace interactions with Groq language models, enabling you to debug and evaluate the performance of your AI-driven applications.

**Note:** *Langfuse is also natively integrated with [LangChain](https://langfuse.com/docs/integrations/langchain/tracing), [LlamaIndex](https://langfuse.com/docs/integrations/llama-index/get-started), [LiteLLM](https://langfuse.com/docs/integrations/litellm/tracing), and [other frameworks](https://langfuse.com/docs/integrations/overview). If you use one of them, any use of Groq models is instrumented right away.*

## Overview

In this notebook, we will explore various use cases where Langfuse can be integrated with the Groq SDK, including:

- **Basic LLM Calls:** Learn how to wrap standard Groq model interactions with Langfuse's `@observe` decorator for comprehensive logging.
- **Chained Function Calls:** See how to manage and observe complex workflows where multiple model interactions are linked together to produce a final result.
- **Streaming Support:** Discover how to use Langfuse with streaming responses from Groq models, ensuring that real-time interactions are fully traceable.

To get started, set up your environment variables for Langfuse and Groq:


```python
import os

# Get keys for your project from https://cloud.langfuse.com
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-..." # Private Project
os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-..." # Private Project
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com"  # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com"  # 🇺🇸 US region

# Your Groq API key
os.environ["GROQ_API_KEY"] = "gsk_..."
```

## Option 1: Using the OpenAI SDK to interact with the Groq model

**Note**: *This example shows how to use the OpenAI Python SDK. If you use JS/TS, have a look at our [OpenAI JS/TS SDK](https://langfuse.com/docs/integrations/openai/js/get-started).*

### Install Required Packages


```python
%pip install langfuse openai --upgrade
```

### Import Necessary Modules

Instead of importing `openai` directly, import it from `langfuse.openai`. Also, import any other necessary modules.


```python
# Instead of: import openai
from langfuse.openai import OpenAI
```

### Initialize the OpenAI Client for the Groq Model

Initialize the OpenAI client but point it to the Groq model endpoint. Replace the access token with your own.


```python
client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=os.environ.get("GROQ_API_KEY")
)
```

### Chat Completion Request

Use the `client` to make a chat completion request to the Groq model. 



```python
completion = client.chat.completions.create(
    model="llama3-8b-8192",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {
            "role": "user",
            "content": "Write a poem about language models"
        }
    ]
)
print(completion.choices[0].message.content)
```

    In silicon halls, a dream takes form,
    A machine that speaks, yet lacks a norm.
    A language model, born of code and might,
    Generates prose, both wondrous and bright.
    
    With algorithms fine, it weaves its spell,
    Converting data into words to tell.
    It learns from texts, both old and new,
    And synthesizes meaning anew.
    
    Its vocabulary vast, its syntax grand,
    It crafts a language, at its command.
    It chatters fast, with wit and fluency,
    A fluent friend, for humanity.
    
    It mimics tone, and echoes the heart,
    A master of words, a work of art.
    Yet, as we converse, we pause to think,
    Can it truly understand, or just blink?
    
    For language is a dance, both subtle and grand,
    That requires nuance, and a human hand.
    The model's skill, though impressive to see,
    Falls short, at times, of humanity.
    
    Still, as we shape its future course,
    It brings us closer, to the universe.
    A tool, to aid our creative spark,
    A language model, that leaves its mark.
    
    Let us guide it, with care and wit,
    To discover new paths, day and night.
    For in its realm, the possibilities abound,
    A world where language, and machines entwine, profound.


*[Example trace in Langfuse](https://cloud.langfuse.com/project/cm0nywmaa005c3ol2msoisiho/traces/8c0fe015-2d87-46a8-87e6-e6bd439b35b5?timestamp=2025-01-10T12%3A55%3A11.990Z)*

## Option 2: Using the Groq SDK to interact with Groq models

For more detailed guidance on the Groq SDK or the **`@observe`** decorator from Langfuse, please refer to the [Groq Documentation](https://console.groq.com/docs) and the [Langfuse Documentation](https://langfuse.com/docs/sdk/python/decorators#log-any-llm-call).

### Install Required Packages



```python
%pip install groq langfuse
```

### Initialize the Groq client:


```python
from groq import Groq

# Initialize Groq client
groq_client = Groq(api_key=os.environ["GROQ_API_KEY"])
```

## Examples

### Basic LLM Calls

We are integrating the Groq SDK with Langfuse using the [`@observe` decorator](https://langfuse.com/docs/sdk/python/decorators), which is crucial for logging and tracing interactions with large language models (LLMs). The `@observe(as_type="generation")` decorator specifically logs LLM interactions, capturing inputs, outputs, and model parameters. The resulting `groq_chat_completion` method can then be used across your project.


```python
from langfuse import observe, get_client
langfuse = get_client()

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
    langfuse.update_current_span(
        input=messages,
        model=model,
        model_parameters=model_parameters,
        metadata=kwargs_clone,
    )

    # Call the Groq model to generate a response
    response = groq_client.chat.completions.create(**kwargs)

    # Log the usage details and output content after the LLM call
    choice = response.choices[0]
    langfuse.update_current_span(
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
                "content": f"this is a test"
            }
        ]
    )
    return response.choices[0].message.content

print(find_best_painter_from())
```

    It looks like you're testing to see if I'm working properly! That's perfectly fine. I'm happy to report that I'm functioning as intended and ready to assist you with any questions or topics you'd like to discuss. Is there anything specific you'd like to chat about or ask?


![Example trace in Langfuse](https://langfuse.com/images/cookbook/integration-groq/single-trace-example.png)

*[Example trace in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/d5f7e896-a51c-4f70-b066-114f0cab9020?timestamp=2025-01-09T10%3A23%3A26.872Z&observation=3dee4a0f-e348-481f-a795-d46c90ffbea5)*

### Chained Completions

This example demonstrates chaining multiple LLM calls using the `@observe()` decorator. The first call identifies the best painter from a specified country, and the second call uses that painter's name to find their most famous painting. Both interactions are logged by Langfuse as we use the wrapped `groq_chat_completion` method created above, ensuring full traceability across the chained requests.


```python
from langfuse import observe, get_client
langfuse = get_client()

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
from langfuse import observe, get_client
langfuse = get_client()

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

    langfuse.update_current_span(
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

    langfuse.update_current_span(
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


