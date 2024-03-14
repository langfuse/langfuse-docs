---
description: Cookbook on how to use Langfuse Prompt Management to version control prompts collaboratively when using OpenAI functions.
category: Prompt Management
---

# Example: Langfuse Prompt Management for OpenAI functions (Python)

Langfuse [Prompt Management](https://langfuse.com/docs/prompts) helps to version control and manage prompts collaboratively in one place. This example demostrates how to use the flexible `config` object on Langfuse prompts to store function calling options and model parameters.

## Setup


```python
%pip install langfuse openai --upgrade
```


```python
import os

# Get keys for your project
os.environ["LANGFUSE_PUBLIC_KEY"] = ""
os.environ["LANGFUSE_SECRET_KEY"] = ""
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com"

# OpenAI key
os.environ["OPENAI_API_KEY"] = ""
```


```python
from langfuse import Langfuse
langfuse = Langfuse()

# optional, verify that Langfuse is configured correctly
langfuse.auth_check()
```




    True



## Add prompt to Langfuse Prompt Management

We add the prompt used in this example via the SDK. Alternatively, you can also edit and version the prompt in the Langfuse UI.

- `Name` that identifies the prompt in Langfuse Prompt Management
- Prompt with `json_schema` variable
- Config including `model_name`, `temperature`, and `json_schema`
- `is_active` to immediately use prompt


```python
langfuse.create_prompt(
    name="story_summarization",
    prompt="Extract the key information from this text and return it in JSON format. Use the following schema: {{json_schema}}",
    config={
        "model":"gpt-3.5-turbo-1106",
        "temperature": 0,
        "json_schema":{
            "main_character": "string (name of protagonist)",
            "key_content": "string (1 sentence)",
            "keywords": "array of strings",
            "genre": "string (genre of story)",
            "critic_review_comment": "string (write similar to a new york times critic)",
            "critic_score": "number (between 0 bad and 10 exceptional)"
        }
    },
    is_active=True
);
```

Prompt in Langfuse UI

![Langfuse Prompt Management](https://langfuse.com/images/docs/prompt-management-with-config-for-openai-functions.png)

## Example application

### Get current prompt version from Langfuse


```python
prompt = langfuse.get_prompt("story_summarization")
```

We can now use the prompt to compile our system message


```python
prompt.compile(json_schema="TEST SCHEMA")
```




    'Extract the key information from this text and return it in JSON format. Use the following schema: TEST SCHEMA'



And it includes the config object


```python
prompt.config
```




    {'model': 'gpt-3.5-turbo-1106',
     'json_schema': {'genre': 'string (genre of story)',
      'keywords': 'array of strings',
      'key_content': 'string (1 sentence)',
      'critic_score': 'number (between 0 bad and 10 exceptional)',
      'main_character': 'string (name of protagonist)',
      'critic_review_comment': 'string (write similar to a new york times critic)'},
     'temperature': 0}



### Create example function

In this example we use the native [Langfuse OpenAI integration](https://langfuse.com/docs/integrations/openai) by importing from `langfuse.openai`. This enables [tracing](https://langfuse.com/docs/tracing) in Langfuse and is not required for using Langfuse prompts management.


```python
from langfuse.openai import OpenAI
client = OpenAI()
```

Use Langfuse prompt to construct the `summarize_story` example function.


```python
import json

def summarize_story(story):
  # Stringify the JSON schema
  json_schema_str = ', '.join([f"'{key}': {value}" for key, value in prompt.config["json_schema"].items()])

  # Compile prompt with stringified version of json schema
  system_message = prompt.compile(json_schema=json_schema_str)

  # Format as OpenAI messages
  messages = [
      {"role":"system","content": system_message},
      {"role":"user","content":story}
  ]

  # Get additional config
  model = prompt.config["model"]
  temperature = prompt.config["temperature"]

  # Execute LLM call
  res = client.chat.completions.create(
    model = model,
    temperature = temperature,
    messages = messages,
    response_format = { "type": "json_object" }
  )

  # Parse response as JSON
  res = json.loads(res.choices[0].message.content)

  return res
```

### Execute it


```python
# Thanks ChatGPT for the story
STORY = """
In a bustling city where the nighttime glittered with neon signs and the rush never calmed, lived a lonely cat named Whisper. Amidst the ceaseless clatter, Whisper discovered an abandoned hat one day. To her enigmatic surprise, this was no ordinary accessory; it had the unusual power to make her invisible to any onlooker.
Whisper, now carrying a peculiar power, started a journey that was unexpected. She became a benevolent spirit to the less fortunate, the homeless people who equally shared the cold nights with her. Nights that were once barren turned miraculous as warm meals mysteriously appeared to those who needed them most. No one could see her, yet her actions spoke volumes, turning her into an unsung hero in the hidden corners of the city.
As she carried on with her mysterious deed, she found an unanticipated reward. Joy started to kindle in her heart, born not from the invisibility, but from the result of her actions; the growing smiles on the faces of those she surreptitiously helped. Whisper might have remained unnoticed to the world, but amidst her secret kindness, she discovered her true happiness.
"""
```


```python
summarize_story(STORY)
```




    {'genre': 'Fantasy',
     'keywords': ['lonely cat',
      'invisible',
      'benevolent spirit',
      'unsung hero',
      'mysterious deed',
      'true happiness'],
     'key_content': 'In a bustling city, a lonely cat named Whisper discovers an abandoned hat with the power to make her invisible, leading her to become a benevolent spirit and unsung hero to the less fortunate.',
     'critic_score': 9,
     'main_character': 'Whisper',
     'critic_review_comment': "Whisper's journey from loneliness to self-discovery through acts of kindness is a heartwarming and enchanting tale that captivates the reader with its magical elements and profound message about true happiness."}



## View trace in Langfuse

As we used the native Langfuse integration with the OpenAI SDK, we can view the trace in Langfuse.

![Trace of OpenAI functions in Langfuse](https://langfuse.com/images/docs/openai-functions-trace-with-prompt-management.png)

## Iterate on prompt in Langfuse

We can now iterate on the prompt in Langfuse UI including model parameters and function calling options without changing the code or redeploying the application.
