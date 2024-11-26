---
description: Cookbook with examples of the Langfuse Integration for Mistral SDK (Python).
category: Integrations
---

# Cookbook: Mistral SDK Integration (Python)

This cookbook provides step-by-step examples of integrating Langfuse with the Mistral AI SDK (v1) in Python. By following these examples, you'll learn how to seamlessly log and trace interactions with Mistral's language models, enhancing the transparency, debuggability, and performance monitoring of your AI-driven applications.

---

Note: Langfuse is also natively integrated with [LangChain](https://langfuse.com/docs/integrations/langchain/tracing), [LlamaIndex](https://langfuse.com/docs/integrations/llama-index/get-started), [LiteLLM](https://langfuse.com/docs/integrations/litellm/tracing), and [other frameworks](https://langfuse.com/docs/integrations/overview). If you use one of them, any use of Mistral models is instrumented right away.

---

## Overview

In this notebook, we will explore various use cases where Langfuse can be integrated with Mistral AI SDK, including:

- **Basic LLM Calls:** Learn how to wrap standard Mistral model interactions with Langfuse's @observe decorator for comprehensive logging.
- **Chained Function Calls:** See how to manage and observe complex workflows where multiple model interactions are linked together to produce a final result.
- **Async and Streaming Support:** Discover how to use Langfuse with asynchronous and streaming responses from Mistral models, ensuring that real-time and concurrent interactions are fully traceable.
- **Function Calling:** Understand how to implement and observe external tool integrations with Mistral, allowing the model to interact with custom functions and APIs.

For more detailed guidance on the Mistral SDK or the **@observe** decorator from Langfuse, please refer to the [Mistral SDK repo](https://github.com/mistralai/client-python) and the [Langfuse Documentation](https://langfuse.com/docs/sdk/python/decorators#log-any-llm-call).

## Setup


```python
!pip install mistralai langfuse
```


```python
import os

# get keys for your project from https://cloud.langfuse.com
os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-xxx"
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-xxx"
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region

# Your Mistral key
os.environ["MISTRAL_API_KEY"] = "xxx"
```


```python
from mistralai import Mistral

# Initialize Mistral client
mistral_client = Mistral(api_key=os.environ["MISTRAL_API_KEY"])
```

## Examples

### Completions

We are integrating the Mistral AI SDK with Langfuse using the [@observe decorator](https://langfuse.com/docs/sdk/python/decorators), which is crucial for logging and tracing interactions with large language models (LLMs). The @observe(as_type="generation") decorator specifically logs LLM interactions, capturing inputs, outputs, and model parameters. The resulting `mistral_completion` method can then be used across your project.


```python
from langfuse.decorators import langfuse_context, observe

# Function to handle Mistral completion calls, wrapped with @observe to log the LLM interaction
@observe(as_type="generation")
def mistral_completion(**kwargs):
  # Clone kwargs to avoid modifying the original input
  kwargs_clone = kwargs.copy()

  # Extract relevant parameters from kwargs
  input = kwargs_clone.pop('messages', None)
  model = kwargs_clone.pop('model', None)
  min_tokens = kwargs_clone.pop('min_tokens', None)
  max_tokens = kwargs_clone.pop('max_tokens', None)
  temperature = kwargs_clone.pop('temperature', None)
  top_p = kwargs_clone.pop('top_p', None)

  # Filter and prepare model parameters for logging
  model_parameters = {
        "maxTokens": max_tokens,
        "minTokens": min_tokens,
        "temperature": temperature,
        "top_p": top_p
    }
  model_parameters = {k: v for k, v in model_parameters.items() if v is not None}

  # Log the input and model parameters before calling the LLM
  langfuse_context.update_current_observation(
      input=input,
      model=model,
      model_parameters=model_parameters,
      metadata=kwargs_clone,

  )

  # Call the Mistral model to generate a response
  res = mistral_client.chat.complete(**kwargs)

  # Log the usage details and output content after the LLM call
  langfuse_context.update_current_observation(
      usage={
          "input": res.usage.prompt_tokens,
          "output": res.usage.completion_tokens
      },
      output=res.choices[0].message.content
  )

  # Return the model's response object
  return res
```

Optionally, other functions (api handlers, retrieval functions, ...) can be also decorated.

#### Simple Example

In the following example, we also added the decorator to the top-level function `find_best_painter_from`. This function calls the mistral_completion function, which is decorated with @observe(as_type="generation"). This hierarchical setup hels to trace more complex applications which involve multiple LLM calls and other non-llm methods which are decorated with @observe.

You can use langfuse_context.update_current_observation or langfuse_context.update_current_trace to add additional details such as input, output, and model parameters to the trace.


```python
@observe()
def find_best_painter_from(country="France"):
  response = mistral_completion(
      model="mistral-small-latest",
      max_tokens=1024,
      temperature=0.4,
      messages=[
        {
            "content": "Who is the best painter from {country}? Answer in one short sentence.".format(country=country),
            "role": "user",
        },
      ]
    )
  return response.choices[0].message.content

find_best_painter_from()
```




    'Claude Monet, renowned for his role as a founder of French Impressionist painting, is often considered one of the best painters from France.'



Example trace in Langfuse: https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/836a9585-cfcc-47f7-881f-85ebdd9f601b

#### Chained Completions


This example demonstrates chaining multiple LLM calls using the @observe decorator. The first call identifies the best painter from a specified country, and the second call uses that painter's name to find their most famous painting. Both interactions are logged by Langfuse as we use the wrapped `mistral_completion` method created above, ensuring full traceability across the chained requests.


```python
@observe()
def find_best_painting_from(country="France"):
  response = mistral_completion(
      model="mistral-small-latest",
      max_tokens=1024,
      temperature=0.1,
      messages=[
        {
            "content": "Who is the best painter from {country}? Only provide the name.".format(country=country),
            "role": "user",
        },
      ]
    )
  painter_name = response.choices[0].message.content
  return mistral_completion(
      model="mistral-small-latest",
      max_tokens=1024,
      messages=[
        {
            "content": "What is the most famous painting of {painter_name}? Answer in one short sentence.".format(painter_name=painter_name),
            "role": "user",
        },
      ]
    )

find_best_painting_from("Germany")
```




    ChatCompletionResponse(id='8bb8512749fd4ddf88720aec0021378c', object='chat.completion', model='mistral-small-latest', usage=UsageInfo(prompt_tokens=23, completion_tokens=23, total_tokens=46), created=1726597735, choices=[ChatCompletionChoice(index=0, message=AssistantMessage(content='Albrecht Dürer\'s most famous painting is "Self-Portrait at Twenty-Eight."', tool_calls=None, prefix=False, role='assistant'), finish_reason='stop')])



Example trace in Langfuse: https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/a3360c6f-24ad-455c-aae7-eb9d5c6f5dac

### Streaming Completions

The following example demonstrates how to handle streaming responses from the Mistral model using the @observe(as_type="generation") decorator. The process is similar to the *Completion* example but includes handling streamed data in real-time.

Just like in the previous example, we wrap the streaming function with the @observe decorator to capture the input, model parameters, and usage details. Additionally, the function processes the streamed output incrementally, updating the Langfuse context as each chunk is received.


```python
# Wrap streaming function with decorator
@observe(as_type="generation")
def stream_mistral_completion(**kwargs):
    kwargs_clone = kwargs.copy()
    input = kwargs_clone.pop('messages', None)
    model = kwargs_clone.pop('model', None)
    min_tokens = kwargs_clone.pop('min_tokens', None)
    max_tokens = kwargs_clone.pop('max_tokens', None)
    temperature = kwargs_clone.pop('temperature', None)
    top_p = kwargs_clone.pop('top_p', None)

    model_parameters = {
        "maxTokens": max_tokens,
        "minTokens": min_tokens,
        "temperature": temperature,
        "top_p": top_p
    }
    model_parameters = {k: v for k, v in model_parameters.items() if v is not None}

    langfuse_context.update_current_observation(
        input=input,
        model=model,
        model_parameters=model_parameters,
        metadata=kwargs_clone,
    )

    res = mistral_client.chat.stream(**kwargs)
    final_response = ""
    for chunk in res:
        content = chunk.data.choices[0].delta.content
        final_response += content
        yield content

        if chunk.data.choices[0].finish_reason == "stop":
            langfuse_context.update_current_observation(
                usage={
                    "input": chunk.data.usage.prompt_tokens,
                    "output": chunk.data.usage.completion_tokens
                },
                output=final_response
            )
            break

# Use stream_mistral_completion as you'd usually use the SDK
@observe()
def stream_find_best_five_painter_from(country="France"):
    response_chunks = stream_mistral_completion(
        model="mistral-small-latest",
        max_tokens=1024,
        messages=[
            {
                "content": "Who are the best five painter from {country}? Answer in one short sentence.".format(country=country),
                "role": "user",
            },
        ]
    )
    final_response = ""
    for chunk in response_chunks:
        final_response += chunk
        # You can also do something with each chunk here if needed
        print(chunk)

    return final_response

stream_find_best_five_painter_from("Spain")
```

    
    The
     best
     five
     pain
    ters
     from
     Spain
     are
     Diego
     Vel
    áz
    que
    z
    ,
     Francisco
     G
    oya
    ,
     P
    ablo
     Pic
    asso
    ,
     Salvador
     Dal
    í
    ,
     and
     Joan
     Mir
    ó
    .
    
    




    'The best five painters from Spain are Diego Velázquez, Francisco Goya, Pablo Picasso, Salvador Dalí, and Joan Miró.'



Example trace in Langfuse: https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/75a2a4fe-088d-4134-9797-ba9c21be01b2

### Async Completion


This example showcases the use of the @observe decorator in an asynchronous context. It wraps an async function that interacts with the Mistral model, ensuring that both the request and the response are logged by Langfuse. The async function allows for non-blocking LLM calls, making it suitable for applications that require concurrency while maintaining full observability of the interactions.


```python
# Wrap async function with decorator
@observe(as_type="generation")
async def async_mistral_completion(**kwargs):
  kwargs_clone = kwargs.copy()
  input = kwargs_clone.pop('messages', None)
  model = kwargs_clone.pop('model', None)
  min_tokens = kwargs_clone.pop('min_tokens', None)
  max_tokens = kwargs_clone.pop('max_tokens', None)
  temperature = kwargs_clone.pop('temperature', None)
  top_p = kwargs_clone.pop('top_p', None)

  model_parameters = {
        "maxTokens": max_tokens,
        "minTokens": min_tokens,
        "temperature": temperature,
        "top_p": top_p
    }
  model_parameters = {k: v for k, v in model_parameters.items() if v is not None}

  langfuse_context.update_current_observation(
      input=input,
      model=model,
      model_parameters=model_parameters,
      metadata=kwargs_clone,

  )

  res = await mistral_client.chat.complete_async(**kwargs)

  langfuse_context.update_current_observation(
      usage={
          "input": res.usage.prompt_tokens,
          "output": res.usage.completion_tokens
      },
      output=res.choices[0].message.content
  )

  return res

@observe()
async def async_find_best_musician_from(country="France"):
  response = await async_mistral_completion(
      model="mistral-small-latest",
      max_tokens=1024,
      messages=[
        {
            "content": "Who is the best musician from {country}? Answer in one short sentence.".format(country=country),
            "role": "user",
        },
      ]
    )
  return response

await async_find_best_musician_from("Spain")
```




    ChatCompletionResponse(id='589fa6216c5346cc984586209c693a41', object='chat.completion', model='mistral-small-latest', usage=UsageInfo(prompt_tokens=17, completion_tokens=33, total_tokens=50), created=1726597737, choices=[ChatCompletionChoice(index=0, message=AssistantMessage(content="One of the most renowned musicians from Spain is Andrés Segovia, a classical guitarist who significantly impacted the instrument's modern repertoire.", tool_calls=None, prefix=False, role='assistant'), finish_reason='stop')])



Example trace in Langfuse: https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/1f7d91ce-45dd-41bf-8e6f-1875086ed32f

### Async Streaming

This example demonstrates the use of the @observe decorator in an asynchronous streaming context. It wraps an async function that streams responses from the Mistral model, logging each chunk of data in real-time.


```python
import asyncio

# Wrap async streaming function with decorator
@observe(as_type="generation")
async def async_stream_mistral_completion(**kwargs):
    kwargs_clone = kwargs.copy()
    input = kwargs_clone.pop('messages', None)
    model = kwargs_clone.pop('model', None)
    min_tokens = kwargs_clone.pop('min_tokens', None)
    max_tokens = kwargs_clone.pop('max_tokens', None)
    temperature = kwargs_clone.pop('temperature', None)
    top_p = kwargs_clone.pop('top_p', None)

    model_parameters = {
        "maxTokens": max_tokens,
        "minTokens": min_tokens,
        "temperature": temperature,
        "top_p": top_p
    }
    model_parameters = {k: v for k, v in model_parameters.items() if v is not None}

    langfuse_context.update_current_observation(
        input=input,
        model=model,
        model_parameters=model_parameters,
        metadata=kwargs_clone,
    )

    res = await mistral_client.chat.stream_async(**kwargs)
    final_response = ""
    async for chunk in res:
        content = chunk.data.choices[0].delta.content
        final_response += content
        yield content

        if chunk.data.choices[0].finish_reason == "stop":
            langfuse_context.update_current_observation(
                usage={
                    "input": chunk.data.usage.prompt_tokens,
                    "output": chunk.data.usage.completion_tokens
                },
                output=final_response
            )
            break

@observe()
async def async_stream_find_best_five_musician_from(country="France"):
    response_chunks = async_stream_mistral_completion(
        model="mistral-small-latest",
        max_tokens=1024,
        messages=[
            {
                "content": "Who are the best five musician from {country}? Answer in one short sentence.".format(country=country),
                "role": "user",
            },
        ]
    )
    final_response = ""
    async for chunk in response_chunks:
        final_response += chunk
        # You can also do something with each chunk here if needed
        print(chunk)

    return final_response

# Run the async function
await async_stream_find_best_five_musician_from("Spain")
```

    
    The
     five
     most
     renown
    ed
     musicians
     from
     Spain
     include
    :
     Andr
    és
     Seg
    ov
    ia
    ,
     Pac
    o
     de
     Luc
    ía
    ,
     En
    rique
     I
    gles
    ias
    ,
     Ale
    j
    andro
     San
    z
    ,
     and
     Ros
    al
    ía
    .
    
    




    'The five most renowned musicians from Spain include: Andrés Segovia, Paco de Lucía, Enrique Iglesias, Alejandro Sanz, and Rosalía.'



Example trace in Langfuse: https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/36608110-f6cf-4566-a080-7c18777e2dbf

### Tool Calling

This snippet introduces Mistral's function-calling capability, where you can define custom functions to retrieve specific data, like payment status and date, based on a transaction ID. These functions are then registered with the Mistral model, allowing it to call them when processing queries. For a deeper dive into function calling with Mistral, refer to the official [Mistral documentation](https://docs.mistral.ai/capabilities/function_calling/).


```python
import pandas as pd
import json
import functools


# Sample payment transaction data
data = {
    'transaction_id': ['T1001', 'T1002', 'T1003', 'T1004', 'T1005'],
    'customer_id': ['C001', 'C002', 'C003', 'C002', 'C001'],
    'payment_amount': [125.50, 89.99, 120.00, 54.30, 210.20],
    'payment_date': ['2021-10-05', '2021-10-06', '2021-10-07', '2021-10-05', '2021-10-08'],
    'payment_status': ['Paid', 'Unpaid', 'Paid', 'Paid', 'Pending']
}

# Create a DataFrame from the data
df = pd.DataFrame(data)

# Function to retrieve payment status given a transaction ID
def retrieve_payment_status(df: data, transaction_id: str) -> str:
    if transaction_id in df.transaction_id.values:
        # Return the payment status as a JSON string
        return json.dumps({'status': df[df.transaction_id == transaction_id].payment_status.item()})
    return json.dumps({'error': 'transaction id not found.'})

# Function to retrieve payment date given a transaction ID
def retrieve_payment_date(df: data, transaction_id: str) -> str:
    if transaction_id in df.transaction_id.values:
        # Return the payment date as a JSON string
        return json.dumps({'date': df[df.transaction_id == transaction_id].payment_date.item()})
    return json.dumps({'error': 'transaction id not found.'})

# Define tools for the Mistral model with JSON schemas
tools = [
  {
      "type": "function",
      "function": {
          "name": "retrieve_payment_status",
          "description": "Get payment status of a transaction",
          "parameters": {
              "type": "object",
              "properties": {
                  "transaction_id": {
                      "type": "string",
                      "description": "The transaction id.",
                  }
              },
              "required": ["transaction_id"],
          },
      },
  },
  {
      "type": "function",
      "function": {
          "name": "retrieve_payment_date",
          "description": "Get payment date of a transaction",
          "parameters": {
              "type": "object",
              "properties": {
                  "transaction_id": {
                      "type": "string",
                      "description": "The transaction id.",
                  }
              },
              "required": ["transaction_id"],
          },
      },
  }
]

# Define tools for the Mistral model with JSON schemas
names_to_functions = {
  'retrieve_payment_status': functools.partial(retrieve_payment_status, df=df),
  'retrieve_payment_date': functools.partial(retrieve_payment_date, df=df)
}
```

The *check_transaction_status* function demonstrates the use of Mistral's function-calling capabilities. The function's result is then incorporated into the LLM's response, which is logged and traced in Langfuse. This example illustrates how external function calls can be seamlessly integrated into a Langfuse by using the the wrapped *mistral_completion* function, ensuring that every step — from tool selection to final output - is captured for thorough observability.


```python
@observe()
def tool_calling_check_transaction_status(id="T1001"):

  # Construct the initial user query message
  messages = [{"role": "user", "content": "What's the status of my transaction {id}?".format(id=id)}]

  # Use the Langfuse-decorated Mistral completion function to generate a tool-assisted response
  response = mistral_completion(
      model = "mistral-small-latest",
      messages = messages,
      max_tokens=512,
      temperature=0.1,
      tools = tools,
      tool_choice = "any",
  )


  messages.append(response.choices[0].message)

  # Extract the tool call details from the model's response
  tool_call = response.choices[0].message.tool_calls[0]
  function_name = tool_call.function.name
  function_params = json.loads(tool_call.function.arguments)

   # Execute the selected function with the extracted parameters
  function_result = names_to_functions[function_name](**function_params)

  messages.append({"role":"tool", "name":function_name, "content":function_result, "tool_call_id":tool_call.id})

  # Call the Langfuse-wrapped Mistral completion function again to generate a final response using the tool's result
  response = mistral_completion(
      model = "mistral-small-latest",
      max_tokens=1024,
      temperature=0.5,
      messages = messages
  )

  return response.choices[0].message.content

tool_calling_check_transaction_status("T1005")
```




    'Your transaction T1005 is currently pending.'



Example trace in Langfuse: https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/e986408a-f96b-40dc-8278-5d0eb0286f82

## Questions?

Join our [Discord community](https://langfuse.com/discord) in case you have any questions.
