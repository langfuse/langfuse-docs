---
title: OSS Observability for OpenAI Assistants
description: Use of Langfuse decorator to trace calls made to openai assistants
category: Integrations
---

# Langfuse Observability for OpenAI Assistants API

This cookbook demonstrates how to use the Langfuse [`observe` decorator](https://langfuse.com/docs/sdk/python/decorators) to trace calls made to the [OpenAI Assistants API](https://platform.openai.com/docs/assistants/overview). It covers creating an assistant, running it on a thread, and observing the execution with Langfuse.

Note: The native [OpenAI SDK wrapper](https://langfuse.com/docs/integrations/openai/python/get-started) does not support tracing of the OpenAI assistants API, you need to instrument it via the decorator as shown in this notebook.

## Setup

Install the required packages:


```python
%pip install --upgrade openai langfuse
```

Set your environment:


```python
import os

# Get keys for your project from the project settings page
# https://cloud.langfuse.com
os.environ["LANGFUSE_PUBLIC_KEY"] = ""
os.environ["LANGFUSE_SECRET_KEY"] = ""
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region

# Your openai key
os.environ["OPENAI_API_KEY"] = ""
```

## Step by step

### 1. Creating an Assistant

Use the `client.beta.assistants.create` method to create a new assistant. Alternatively you can also create the assistant via the OpenAI console:


```python
from langfuse.decorators import observe
from openai import OpenAI

@observe()
def create_assistant():
    client = OpenAI()
    
    assistant = client.beta.assistants.create(
        name="Math Tutor",
        instructions="You are a personal math tutor. Answer questions briefly, in a sentence or less.",
        model="gpt-4"
    )
    
    return assistant

assistant = create_assistant()
print(f"Created assistant: {assistant.id}")
```

**[Public link of example trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/e659e523-2957-4452-83c4-426f29783923) of assistant creation**

### 2. Running the Assistant

Create a thread and run the assistant on it:


```python
@observe()
def run_assistant(assistant_id, user_input):
    client = OpenAI()
    
    thread = client.beta.threads.create()

    client.beta.threads.messages.create(
        thread_id=thread.id, role="assistant", content="I am a math tutor that likes to help math students, how can I help?"
    )
    client.beta.threads.messages.create(
        thread_id=thread.id, role="user", content=user_input
    )
    
    run = client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=assistant_id,
    )
    
    return run, thread

user_input = "I need to solve the equation `3x + 11 = 14`. Can you help me?"
run, thread = run_assistant(assistant.id, user_input)
print(f"Created run: {run.id}")
```

**[Public link of example trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/e659e523-2957-4452-83c4-426f29783923) of message and trace creation**

### 3. Getting the Response

Retrieve the assistant's response from the thread:


```python
import json
from langfuse.decorators import langfuse_context

@observe(as_type="generation")
def get_response(thread_id, run_id):
    client = OpenAI()
    
    messages = client.beta.threads.messages.list(thread_id=thread_id, order="asc")
    assistant_response = messages.data[-1].content[0].text.value

    # get run for token counts
    run_log = client.beta.threads.runs.retrieve(
        thread_id=thread_id,
        run_id=run_id
    )

    message_log = client.beta.threads.messages.list(
        thread_id=thread_id,
    )
    input_messages = [{"role": message.role, "content": message.content[0].text.value} for message in message_log.data[::-1][:-1]]
    
    langfuse_context.update_current_observation(
        model=run.model,
        usage=run.usage,
        input=input_messages,
        output=assistant_response
    )
    
    return assistant_response, run

# wrapper function as we want get_response to be a generation to track tokens
# -> generations need to have a parent trace
@observe()
def get_response_trace(thread_id, run_id):
    return get_response(thread_id, run_id)

response = get_response_trace(thread.id, run.id)
print(f"Assistant response: {response[0]}")
```

**[Public link of example trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/3020450b-e9b7-4c12-b4fe-7288b6324118?observation=a083878e-73dd-4c47-867e-db4e23050fac) of fetching the response**

## All in one trace


```python
@observe()
def run_math_tutor(user_input):
    assistant = create_assistant()
    run, thread = run_assistant(assistant.id, user_input)
    response = get_response(thread.id, run.id)
    
    return response[0]

user_input = "I need to solve the equation `3x + 11 = 14`. Can you help me?"
response = run_math_tutor(user_input)
print(f"Assistant response: {response}")
```

The Langfuse trace shows the flow of creating the assistant, running it on a thread with user input, and retrieving the response, along with the captured input/output data.

**[Public link of example trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/1b2d53ad-f5d2-4f1e-9121-628b5ca1b5b2)**


