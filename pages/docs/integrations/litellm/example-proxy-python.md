---
description: The stack to use any of 100+ models in Python without having to change your code and with full observability.
category: Integrations
---

# Cookbook: LiteLLM (Proxy) + Langfuse OpenAI Integration + `@observe` Decorator

We want to share a stack that's commonly used by the Langfuse community to quickly experiment with 100+ models from different providers without changing code. This stack includes:

- [**LiteLLM Proxy**](https://docs.litellm.ai/docs/) ([GitHub](https://github.com/BerriAI/litellm)) which standardizes 100+ model provider APIs on the OpenAI API schema. It removes the complexity of direct API calls by centralizing interactions with these APIs through a single endpoint. You can also self-host the LiteLLM Proxy as it is open-source.
- **Langfuse OpenAI SDK Wrapper** ([Python](https://langfuse.com/docs/integrations/openai/python/get-started), [JS](https://langfuse.com/docs/integrations/openai/js/get-started)) to natively instrument calls to all these 100+ models via the OpenAI SDK. This automatically captures token counts, latencies, streaming response times (time to first token), api errors, and more.
- **Langfuse**: OSS LLM Observability, full overview [here](https://langfuse.com/docs).

This cookbook is an end-to-end guide to set up and use this stack. As we'll use Python in this example, we will also use the `@observe` decorator to create nested traces. More on this below.

Let's dive right in!

## Install dependencies

```python
!pip install "litellm[proxy]" langfuse openai
```

## Setup environment

```python
import os
from langfuse.openai import openai

# Get keys for your project from the project settings page
# https://cloud.langfuse.com
os.environ["LANGFUSE_PUBLIC_KEY"] = ""
os.environ["LANGFUSE_SECRET_KEY"] = ""
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region

# Your openai key
os.environ["OPENAI_API_KEY"] = ""

# Test connection to Langfuse, not recommended for production as it is blocking
openai.langfuse_auth_check()
```

## Setup Lite LLM Proxy

In this example, we'll use GPT-3.5-turbo directly from OpenAI, and llama3 and mistral via the Ollama on our local machine.

**Steps**

1. Create a `litellm_config.yaml` to configure which models are available ([docs](https://litellm.vercel.app/docs/proxy/configs)). We'll use gpt-3.5-turbo, and llama3 and mistral via Ollama in this example. Make sure to replace `<openai_key>` with your OpenAI API key.
   ```yaml
   model_list:
     - model_name: gpt-3.5-turbo
       litellm_params:
         model: gpt-3.5-turbo
         api_key: <openai_key>
     - model_name: ollama/llama3
       litellm_params:
         model: ollama/llama3
     - model_name: ollama/mistral
       litellm_params:
         model: ollama/mistral
   ```
2. Ensure that you installed Ollama and have pulled the llama3 (8b) and mistral (7b) models: `ollama pull llama3 && ollama pull mistral`
3. Run the following cli command to start the proxy: `litellm --config litellm_config.yaml`

The Lite LLM Proxy should be now running on http://0.0.0.0:4000

To verify the connection you can run `litellm --test`

## Log single LLM Call via Langfuse OpenAI Wrapper

The Langfuse SDK offers a wrapper function around the OpenAI SDK, automatically logging all OpenAI calls as generations to Langfuse.

For more details, please refer to our [documentation](https://langfuse.com/docs/integrations/openai/python/get-started).

```python
from langfuse.openai import openai

# Set PROXY_URL to the url of your lite_llm_proxy (by default: http://0.0.0.0:4000)
PROXY_URL="http://0.0.0.0:4000"

system_prompt = "You are a very accurate calculator. You output only the result of the calculation."

# Configure the OpenAI client to use the LiteLLM proxy
client = openai.OpenAI(base_url=PROXY_URL)

gpt_completion = client.chat.completions.create(
  model="gpt-3.5-turbo",
  name="gpt-3.5", # optional name of the generation in langfuse
  messages=[
      {"role": "system", "content": system_prompt},
      {"role": "user", "content": "1 + 1 = "}],
)
print(gpt_completion.choices[0].message.content)

llama_completion = client.chat.completions.create(
  model="ollama/llama3",
  name="llama3", # optional name of the generation in langfuse
  messages=[
      {"role": "system", "content": system_prompt},
      {"role": "user", "content": "3 + 3 = "}],
)
print(llama_completion.choices[0].message.content)
```

Public trace links for the following examples:

- [GPT-3.5-turbo](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/a4e67d7d-d9cb-455b-9795-3ad41f39431e?observation=81006513-82b1-4ae4-bb98-7e1bc6c009a7)
- [llama3](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/22fdce4a-4d74-4af3-9746-7bafaa45247c?observation=b9b30b5d-7fbf-40b4-acd9-4fdc1776cc87)

## Trace nested LLM Calls via Langfuse OpenAI Wrapper and `@observe` decorator

Via the Langfuse `@observe()` decorator we can automatically capture execution details of any python function such as inputs, outputs, timings, and more. The decorator simplifies achieving in-depth observability in your applications with minimal code, especially when non-LLM calls are involved for knowledge retrieval (RAG) or api calls (agents).

For more details on how to utilize this decorator and customize your tracing, refer to our [documentation](https://langfuse.com/docs/sdk/python/decorators).

Let's have a look at a simple example which uses all three models we have set up in the LiteLLM Proxy:

```python
from langfuse.decorators import observe
from langfuse.openai import openai

@observe()
def rap_battle(topic: str):
    client = openai.OpenAI(
        base_url=PROXY_URL,
    )

    messages = [
        {"role": "system", "content": "You are a rap artist. Drop a fresh line."},
        {"role": "user", "content": "Kick it off, today's topic is {topic}, here's the mic..."}
    ]

    # First model (gpt-3.5-turbo) starts the rap
    gpt_completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        name="rap-gpt-3.5-turbo", # add custom name to Langfuse observation
        messages=messages,
    )
    first_rap = gpt_completion.choices[0].message.content
    messages.append({"role": "assistant", "content": first_rap})
    print("Rap 1:", first_rap)

    # Second model (ollama/llama3) responds
    llama_completion = client.chat.completions.create(
        model="ollama/llama3",
        name="rap-llama3",
        messages=messages,
    )
    second_rap = llama_completion.choices[0].message.content
    messages.append({"role": "assistant", "content": second_rap})
    print("Rap 2:", second_rap)

    # Third model (ollama/mistral) adds the final touch
    mistral_completion = client.chat.completions.create(
        model="ollama/mistral",
        name="rap-mistral",
        messages=messages,
    )
    third_rap = mistral_completion.choices[0].message.content
    messages.append({"role": "assistant", "content": third_rap})
    print("Rap 3:", third_rap)

    return messages

# Call the function
rap_battle("typography")
```

[Public trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/7b1af1be-8096-474e-a2fc-081538ca333c)

![Public Trace](https://langfuse.com/images/cookbook/integration_litellm_proxy_trace.gif)

## Learn more

Check out the docs to learn more about all components of this stack:

- [LiteLLM Proxy](https://docs.litellm.ai/docs/)
- [Langfuse OpenAI SDK Wrapper](https://langfuse.com/docs/integrations/openai/python/get-started)
- [Langfuse @observe() decorator](https://langfuse.com/docs/sdk/python/decorators)
- [Langfuse](https://langfuse.com/docs)

If you do not want to capture traces via the OpenAI SDK Wrapper, you can also directly log requests from the LiteLLM Proxy to Langfuse. For more details, refer to the [LiteLLM Docs](https://litellm.vercel.app/docs/proxy/logging#logging-proxy-inputoutput---langfuse).
