---
description: Cookbook with examples of the Langfuse Integration for LiteLLM (Proxy)
category: Integrations
---

# Cookbook: LiteLLM (Proxy) Integration

The LiteLLM Proxy simplifies your work by standardizing API interactions across multiple providers such as OpenAI, Azure, Anthropic, and others. It removes the complexity of direct API calls by centralizing interactions with over 50 large language model APIs through a single endpoint, allowing you to focus on innovation rather than integration details.

Let's dive into how you can set up and start using LiteLLM with Langfuse:

### Install dependencies


```python
!pip install "litellm[proxy]" langfuse
```

### Setup environment


```python
import os
from langfuse.openai import auth_check

os.environ["LANGFUSE_PUBLIC_KEY"] = ""
os.environ["LANGFUSE_SECRET_KEY"] = ""
os.environ["OPENAI_API_KEY"] = ""
 
# Test connection to Langfuse
auth_check()
```

### Setup Lite LLM Proxy

1. Create a config file called litellm_config.yaml that looks like this:<br/>
```yaml
model_list:
    - model_name: gpt-3.5-turbo
        litellm_params:
            model: gpt-3.5-turbo
            api_key: 
    - model_name: ollama/llama3
        litellm_params:
            model: ollama/llama3
    - model_name: ollama/mistral
        litellm_params:
            model: ollama/mistral
```
2. Add your OpenAI API Key
3. Ensure that you have pulled the llama3 (8b) and mistral (7b) ollama models.
4. Run in the CLI the following command: `litellm --config litellm_config.yaml`

The Lite LLM Proxy should be now running on http://0.0.0.0:4000

To verify the connection you can run `litellm --test`


### Example using Langfuse Wrapped OpenAI SDK


```python
from langfuse.openai import openai

# Set PROXY_URL to the url of your lite_llm_proxy (by default: http://0.0.0.0:4000)
PROXY_URL="http://0.0.0.0:4000"

system_prompt = "You are a very accurate calculator. You output only the result of the calculation."

client = openai.OpenAI(
    base_url=PROXY_URL,
)
gpt_completion = client.chat.completions.create(
  model="gpt-3.5-turbo",
  messages=[
      {"role": "system", "content": system_prompt},
      {"role": "user", "content": "1 + 1 = "}],
)
print(gpt_completion.choices[0].message.content)

llama_completion = client.chat.completions.create(
  model="ollama/llama3",
  messages=[
      {"role": "system", "content": system_prompt},
      {"role": "user", "content": "3 + 3 = "}],
)
print(llama_completion.choices[0].message.content)
```

### Example using @observe() decorator

The @observe() decorator integrates tracing directly into your Python applications, automatically capturing and logging execution details such as inputs, outputs, timings, and more. The decorator simplifies achieving in-depth observability in your applications with minimal code.

For more details on how to utilize this decorator and customize your tracing, refer to our [documentation](https://langfuse.com/docs/sdk/python/decorators).



```python
from langfuse.decorators import observe
from langfuse.openai import openai

@observe()
def rap_battle():
    client = openai.OpenAI(
        base_url=PROXY_URL,
    )

    system_prompt = "You are a rap artist. Drop a fresh line."

    # First model starts the rap
    gpt_completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": "Kick it off, here's the mic..."}
        ],
    )
    first_rap = gpt_completion.choices[0].message.content
    print("Rap 1:", first_rap)

    # Second model responds
    llama_completion = client.chat.completions.create(
        model="ollama/llama3",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": first_rap}
        ],
    )
    second_rap = llama_completion.choices[0].message.content
    print("Rap 2:", second_rap)

    # Third model continues
    mistral_completion = client.chat.completions.create(
        model="ollama/mistral",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": second_rap}
        ],
    )
    third_rap = mistral_completion.choices[0].message.content
    print("Rap 3:", third_rap)

# Call the function
rap_battle()

```
