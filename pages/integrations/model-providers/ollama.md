---
title: Ollama Observability and Tracing for local LLMs using Langfuse
sidebarTitle: Ollama
description: Run Open Source LLMs locally on your machine with Ollama and trace ouputs with Langfuse for Open Source LLM Observability
category: Integrations
logo: /images/integrations/ollama_icon.svg
---

# Trace your local Ollama model with Langfuse

In this cookbook, we will show you how to trace local language models with Ollama and Langfuse.

**Note: We'll use the Langfuse OpenAI SDK integration for Python in this example. This works the same for [JS/TS](https://langfuse.com/docs/integrations/openai/js/get-started) or via the Langfuse integrations with [LangChain](https://langfuse.com/docs/integrations/langchain/tracing) and [LlamaIndex](https://langfuse.com/docs/integrations/llama-index/get-started).**

## What is Ollama?

Ollama ([GitHub](https://github.com/ollama/ollama)) is an open-source platform that allows you to run large language models (LLMs) locally on your machine, supporting a variety of models including [Llama 3.1](https://ollama.com/library/llama3.1) and [Mistral 7B](https://ollama.com/library/mistral). It optimizes setup and configuration by bundling model weights, configuration, and data into a single package defined by a Modelfile.

## What is Langfuse?

Langfuse ([GitHub](https://github.com/langfuse/langfuse)) is an open-source LLM engineering platform that helps teams collaboratively debug, analyze, and iterate on their LLM applications via tracing, prompt management and evaluations.

### Local Deployment of Langfuse

Of course, you can also locally deploy Langfuse to run models and trace LLM outputs only on your own device. [Here](https://langfuse.com/self-hosting/local) is a guide on how to run Langfuse on your local machine using Docker Compose. This method is ideal for testing Langfuse and troubleshooting integration issues.

For this example, we will use the Langfuse cloud version.

## Example 1: Llama 3.1 Model

In this example, we will use the Llama 3.1 model to create a simple chat completions application using the OpenAI Python SDK and Langfuse tracing.

### Step 1: Setup Ollama

Start by [downloading Ollama](https://ollama.com/download) and pull the [Llama 3.1](https://ollama.com/library/llama3.1) model. See the [Ollama documentation](https://github.com/ollama/ollama/tree/main/docs) for further information.

```bash
ollama pull llama3.1
```

To invoke Ollama’s OpenAI compatible API endpoint, use the same [OpenAI format](https://platform.openai.com/docs/quickstart?context=curl) and change the hostname to `http://localhost:11434`:

```bash
curl http://localhost:11434/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": "llama3.1",
        "messages": [
            {
                "role": "system",
                "content": "You are a helpful assistant."
            },
            {
                "role": "user",
                "content": "Hello!"
            }
        ]
    }'
```

### Step 2: Setup Langfuse

Initialize the Langfuse client with your [API keys](https://langfuse.com/faq/all/where-are-langfuse-api-keys) from the project settings in the Langfuse UI and add them to your environment.


```python
import os

# Get keys for your project from the project settings page
# https://cloud.langfuse.com
os.environ["LANGFUSE_PUBLIC_KEY"] = ""
os.environ["LANGFUSE_SECRET_KEY"] = ""
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region
```


```python
%pip install langfuse openai --upgrade
```

### Step 3: Use the OpenAI Python SDK to call the Llama3.1 Model

To use the Ollama model, we use the OpenAI Python SDK as Ollama has the same API (see above). To trace your LLM calls in Langfuse you can use the **drop-in replacement** ([docs](https://langfuse.com/docs/integrations/openai/python/get-started), this also works for JS/TS and via LangChain and LlamaIndex) to get full logging by changing only the import.

```diff
- import openai
+ from langfuse.openai import openai
 
Alternative imports:
+ from langfuse.openai import OpenAI, AsyncOpenAI, AzureOpenAI, AsyncAzureOpenAI
```


```python
# Drop-in replacement to get full logging by changing only the import
from langfuse.openai import OpenAI

# Configure the OpenAI client to use http://localhost:11434/v1 as base url 
client = OpenAI(
    base_url = 'http://localhost:11434/v1',
    api_key='ollama', # required, but unused
)

response = client.chat.completions.create(
  model="llama3.1",
  messages=[
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Who was the first person to step on the moon?"},
    {"role": "assistant", "content": "Neil Armstrong was the first person to step on the moon on July 20, 1969, during the Apollo 11 mission."},
    {"role": "user", "content": "What were his first words when he stepped on the moon?"}
  ]
)
print(response.choices[0].message.content)
```

    A famous moment in history! When Neil Armstrong took his historic first steps on the moon, his first words were: "That's one small step for man, one giant leap for mankind." (Note: The word was actually "man", not "men" - it's often been reported as "one small step for men", but Armstrong himself said he meant to say "man")


### **Step 4:** See Traces in Langfuse 

[Example Trace in the Langfuse UI](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/6ad58e47-3bff-4287-9a96-af85d2627ea4)

![View example trace in the Langfuse UI](https://langfuse.com/images/cookbook/integration-ollama/integration-ollama-llama-trace.png)

## Example 2: Mistral 7B Model

In this example, we will use the Mistral 7B model to create a simple chat completions application using the OpenAI Python SDK and Langfuse tracing.

### Step 1: Setup Ollama

Start by [downloading Ollama](https://ollama.com/download) and pulling the [Mistral 7B](https://ollama.com/library/mistral) model:

```bash
ollama pull mistral

```

To invoke Ollama’s OpenAI compatible API endpoint, use the same [OpenAI format](https://platform.openai.com/docs/quickstart?context=curl) and change the hostname to http://localhost:11434:

```bash
curl http://localhost:11434/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": "mistral",
        "messages": [
            {
                "role": "system",
                "content": "You are a helpful assistant."
            },
            {
                "role": "user",
                "content": "Hello!"
            }
        ]
    }'

```

### Step 2: Setup Langfuse

Initialize the Langfuse client with your [API keys](https://langfuse.com/faq/all/where-are-langfuse-api-keys) from the project settings in the Langfuse UI and add them to your environment.


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

### Step 3: Use the OpenAI Python SDK to call the Mistral Model


```python
# Drop-in replacement to get full logging by changing only the import
from langfuse.openai import OpenAI

# Configure the OpenAI client to use http://localhost:11434/v1 as base url 
client = OpenAI(
    base_url = 'http://localhost:11434/v1',
    api_key='ollama', # required, but unused
)

response = client.chat.completions.create(
  model="mistral",
  messages=[
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "How many elements are there in the periodic table?"},
    {"role": "assistant", "content": "There are 118 elements in the periodic table."},
    {"role": "user", "content": "Which element was discovered most recently?"}
  ]
)
print(response.choices[0].message.content)
```

     The most recently confirmed element is oganesson (Og), with symbol Og and atomic number 118. It was officially recognized by IUPAC (International Union of Pure and Applied Chemistry) in 2016, following the synthesis of several atoms at laboratories in Russia and Germany. The latest unofficially-recognized element is ununsextium (Uus), with atomic number 138. However, its synthesis is still under investigation, and IUPAC has yet to officially confirm its existence.


### Step 4: See Traces in Langfuse 

[Example Trace in the Langfuse UI](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/85693874-9ddb-4fd4-a386-0031933cb784)

![View example trace in the Langfuse UI](https://langfuse.com/images/cookbook/integration-ollama/integration-ollama-mistral-trace.png)

## Feedback

If you have any feedback or requests, please create a GitHub [Issue](https://langfuse.com/issue) or share your idea with the community on [Discord](https://discord.langfuse.com/).
