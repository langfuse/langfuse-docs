---
description: Example notebook on how to monitor Hugging Face models with Langfuse using the OpenAI SDK
category: Integrations
---

# Cookbook: Monitor 🤗 Hugging Face Models with 🪢 Langfuse

This cookbook shows you how to monitor Hugging Face models using the OpenAI SDK integration with [Langfuse](https://langfuse.com). This allows you to collaboratively debug, monitor and evaluate your LLM applications.

This allows you to test and evaluate different models, monitor your application's cost and assign scores such as user feedback or human annotations.

## Setup

### Install Required Packages


```python
%pip install langfuse openai --upgrade
```

### Set Environment Variables

Set up your environment variables with the necessary keys. Get keys for your Langfuse project from [Langfuse Cloud](https://cloud.langfuse.com). Also, obtain an access token from [Huggingface](https://huggingface.co/settings/tokens).



```python
import os

# Get keys for your project from https://cloud.langfuse.com
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-..." # Docs Example
os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-..." # Docs Example
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com"  # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com"  # 🇺🇸 US region

os.environ["HUGGINGFACE_ACCESS_TOKEN"] = "hf_..."
```

### Import Necessary Modules

Instead of importing `openai` directly, import it from `langfuse.openai`. Also, import any other necessary modules.


```python
# Instead of: import openai
from langfuse.openai import OpenAI
from langfuse.decorators import observe
```

### Initialize the OpenAI Client for Huggingface Models

Initialize the OpenAI client but point it to the Huggingface model endpoint. You can use any model hosted on Huggingface that supports the OpenAI API format. Replace the model URL and access token with your own.

For this example, we use the `Meta-Llama-3-8B-Instruct` model.


```python
# Initialize the OpenAI client, pointing it to the Huggingface Inference API
client = OpenAI(
    base_url="https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct" + "/v1/",  # replace with your endpoint url
    api_key= os.getenv('HUGGINGFACE_ACCESS_TOKEN'),  # replace with your token
)
```

## Examples

### Chat Completion Request

Use the `client` to make a chat completion request to the Huggingface model. The `model` parameter can be any identifier since the actual model is specified in the `base_url`.


```python
completion = client.chat.completions.create(
    model="tgi",
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

    In silicon halls, where codes reside,
    A new breed of mind begins to thrive,
    Language models, with patterns so fine,
    Weave words into meaning, in a digital shrine.
    
    With algorithms old, and new ones bright,
    They learn from texts, day and endless night,
    Syllables, syntax, semantics unfold,
    As they craft their own tales, young and bold.
    
    They mimic humans, with words so free,
    But with precision, and logic, they'll be,
    Processing data, with speed


![Example trace in Langfuse](https://langfuse.com/images/cookbook/huggingface/huggingface-cookbook-trace-poem.png)

*[Example trace in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/0c205096-fbd9-48b9-afa3-5837483488d8?timestamp=2025-01-09T15%3A03%3A08.365Z)*

### Observe the Request with Langfuse

By using the `OpenAI` client from `langfuse.openai`, your requests are automatically traced in Langfuse. You can also use the `@observe()` decorator to group multiple generations into a single trace.


```python
@observe()  # Decorator to automatically create a trace and nest generations
def generate_rap():
    completion = client.chat.completions.create(
        name="rap-generator",
        model="tgi",
        messages=[
            {"role": "system", "content": "You are a poet."},
            {"role": "user", "content": "Compose a rap about the open source LLM engineering platform Langfuse."}
        ],
        metadata={"category": "rap"},
    )
    return completion.choices[0].message.content

rap = generate_rap()
print(rap)
```

    (The rhythm is set, the beat's on fire)
    Yo, listen up, it's time to acquire
    Knowledge on Langfuse, the game is dire
    Open-source, the future is higher
    LLM engineering platform, no need to question the fire
    
    Verse 1:
    Langfuse, the brainchild of geniuses bright
    Built with passion, crafted with precision and might
    A platform so versatile, it's a beautiful sight
    For developers who dare to take flight
    They're building


![Example trace in Langfuse](https://langfuse.com/images/cookbook/huggingface/huggingface-cookbook-trace-rap.png)

*[Example trace in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/8c432652-ee56-4985-83aa-9e95945ca481?timestamp=2025-01-09T15%3A00%3A22.904Z)*

### Add Additional Langfuse Features (User, Tags, Metadata, Session)

You can access additional Langfuse features by adding relevant attributes to the request. This includes setting `user_id`, `session_id`, `tags`, and `metadata`.


```python
completion_with_attributes = client.chat.completions.create(
    name="translation-with-attributes",  # Trace name
    model="tgi",
    messages=[
        {"role": "system", "content": "You are a translator."},
        {"role": "user", "content": "Translate the following text from English to German: 'The Language model produces text'"}
    ],
    temperature=0.7,
    metadata={"language": "English"},  # Trace metadata
    tags=["translation", "language", "German"],  # Trace tags
    user_id="user1234",  # Trace user ID
    session_id="session5678",  # Trace session ID
)
print(completion_with_attributes.choices[0].message.content)
```

    The translation of the text from English to German is:
    
    "Das Sprachmodell produziert Text"


![Example trace in Langfuse](https://langfuse.com/images/cookbook/huggingface/huggingface-cookbook-trace-translation.png)

*[Example trace in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/54ad697e-8b4c-45eb-b20a-233d236a813e?timestamp=2025-01-09T15%3A10%3A44.987Z)*

### Learn more

- **[Langfuse Space on Huggingface](https://huggingface.co/spaces/langfuse/langfuse-template-space)**: Langfuse can be deployed as a Space on Huggingface. This allows you to use Langfuse's observability tools right within the Huggingface platform. 
- **[Gradio example notebook](https://langfuse.com/docs/integrations/other/gradio)**: This example notebook shows you how to build an LLM Chat UI with Gradio and trace it with Langfuse

## Feedback

If you have any feedback or requests, please create a GitHub [Issue](https://langfuse.com/issue) or share your ideas with the community on [Discord](https://langfuse.com/discord).


