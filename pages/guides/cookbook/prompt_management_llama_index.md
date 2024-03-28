---
description: Example of Open Source Prompt Management for LlamaIndex applications using Langfuse.

category: Prompt Management
---

Example: Langfuse Prompt Management with LlamaIndex (Python)

[Langfuse Prompt Management](https://langfuse.com/docs/prompts) helps to version control and manage prompts collaboratively in one place. This example demostrates how to use prompts managed in LlamaIndex applications.

_In addition, we use [Langfuse Tracing](https://langfuse.com/docs/tracing) via the native [LlamaIndex integration](https://langfuse.com/docs/integrations/llama-index) to inspect and debug the LlamaIndex application._

## Setup


```python
%pip install langfuse llama_index --upgrade
```

Initialize the Langfuse client with your API keys from the project settings in the Langfuse UI and add them to your environment. Also register Langfuse's `LlamaIndexCallbackHandler` in the LLamaIndex settings.


```python
import os

# get keys for your project from https://cloud.langfuse.com
os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-***"
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-***"
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # for EU data region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # for US data region

# your openai key
os.environ["OPENAI_API_KEY"] = "***"
```


```python
from langfuse import Langfuse
from llama_index.core import Settings
from llama_index.core.callbacks import CallbackManager
from langfuse.llama_index import LlamaIndexCallbackHandler

# Initialize Langfuse client (prompt management)
langfuse = Langfuse()

langfuse_callback_handler = LlamaIndexCallbackHandler() # get langfuse's llamaindex callback handler
Settings.callback_manager = CallbackManager([langfuse_callback_handler]) # register callback handler in settings
```

## Add prompt to Langfuse Prompt Management

We add the prompt used in this example via the SDK. Alternatively, you can also edit and version the prompt in the Langfuse UI.

- `Name` that identifies the prompt in Langfuse Prompt Management
- Prompt with prompt template incl. `{{input variables}}`
- Config including `model_name` and `temperature`
- `is_active` to immediately use prompt


```python
langfuse.create_prompt(
    name="event-planner",
    prompt=
    "Plan an event titled {{event_name}}. The event will be about: {{event_description}}. "
    "The event will be held in {{location}} on {{date}}. "
    "Consider the following factors: audience, budget, venue, catering options, and entertainment. "
    "Provide a detailed plan including potential vendors and logistics.",
    config={
        "model":"gpt-3.5-turbo-1106",
        "temperature": 0,
    },
    is_active=True
);
```

Prompt in Langfuse UI

![Created prompt in Langfuse UI](https://langfuse.com/images/docs/prompt-management-langchain-prompt.png)

## Example application

### Get current prompt version from Langfuse


```python
# Get current production version of prompt
langfuse_prompt = langfuse.get_prompt("event-planner")
print(langfuse_prompt.prompt)
```

    Plan an event titled {{event_name}}. The event will be about: {{event_description}}. The event will be held in {{location}} on {{date}}. Consider the following factors: audience, budget, venue, catering options, and entertainment. Provide a detailed plan including potential vendors and logistics.


### Transform into LlamaIndex PromptTemplate

Use the utility method `.get_langchain_prompt()` to transform the Langfuse prompt into a string that can be used in LlamaIndex.

Context: Langfuse declares input variables in prompt templates using double brackets (`{{input variable}}`). LlamaIndex uses single brackets for declaring input variables in PromptTemplates (`{input variable}`). The utility method `.get_langchain_prompt()` replaces the double brackets with single brackets.


```python
from llama_index.core import PromptTemplate

llama_index_prompt = PromptTemplate(langfuse_prompt.get_langchain_prompt())
```

Extract the configuration options from `prompt.config`


```python
model = langfuse_prompt.config["model"]
temperature = str(langfuse_prompt.config["temperature"])
print(f"Prompt model configurations\nModel: {model}\nTemperature: {temperature}")
```

    Prompt model configurations
    Model: gpt-3.5-turbo-1106
    Temperature: 0


### Format prompt and define LlamaIndex chat engine



```python
from llama_index.core.chat_engine import SimpleChatEngine

prompt = llama_index_prompt.format(
    event_name = "Wedding",
    event_description = "The wedding of Julia and Alex, a charming couple who share a love for art and nature. This special day will celebrate their journey together with a blend of traditional and contemporary elements, reflecting their unique personalities.",
    location = "Central Park, New York City",
    date = "June 5, 2024"
)

chat_engine = SimpleChatEngine.from_defaults()
```

## Invoke chat engine


```python
response = chat_engine.chat(prompt)
print(response)
```

    Event Title: Wedding of Julia and Alex
    
    Date: June 5, 2024
    Venue: Central Park, New York City
    Audience: Family and friends of Julia and Alex
    Budget: $20,000
    
    Event Plan:
    
    1. Venue:
    Central Park offers a beautiful and natural setting for the wedding ceremony. The couple will exchange vows in the Shakespeare Garden, surrounded by lush greenery and blooming flowers. The reception will take place at the Loeb Boathouse, overlooking the lake.
    
    2. Catering:
    For catering, we will hire a local catering company that specializes in farm-to-table cuisine. The menu will feature seasonal dishes made with fresh, locally sourced ingredients. Options will include a variety of appetizers, entrees, and desserts to suit all dietary preferences.
    
    3. Entertainment:
    To entertain guests during the reception, we will hire a live band that can play a mix of classic love songs and contemporary hits. Additionally, we will have a DJ to keep the party going late into the night. The couple will also have a photo booth set up for guests to capture fun memories.
    
    4. Decor:
    The decor will reflect the couple's love for art and nature. We will use a color palette of soft pastels and earth tones, with floral arrangements featuring wildflowers and greenery. The tables will be adorned with artistic centerpieces and handmade place cards.
    
    5. Logistics:
    - Transportation: Shuttle buses will be arranged to transport guests from the ceremony to the reception venue.
    - Seating: A seating chart will be created to ensure that guests are seated with their desired companions.
    - Timeline: A detailed timeline will be established to ensure that all events run smoothly and on schedule.
    - Photography: A professional photographer will be hired to capture all the special moments of the day.
    
    Potential Vendors:
    - Catering: Farm-to-Table Catering Co.
    - Entertainment: Love Notes Band, DJ Party Time
    - Decor: Artistic Blooms Floral Design
    - Photography: Capture the Moment Photography
    
    Overall, the wedding of Julia and Alex will be a magical and memorable event that celebrates their love and unique personalities. The blend of traditional and contemporary elements, along with the beautiful setting of Central Park, will create a truly special day for the couple and their guests.


## View Trace in Langfuse

Now we can see that the trace incl. the prompt template have been logged to Langfuse

Todo: Replace screenshot (https://cloud.langfuse.com/project/clr4qu8qv0000yu4ja339x02u/traces/a815e715-7234-4b19-b792-2f1f0d5c1a10)

![Trace of prompt used in Langchain in Langfuse](https://langfuse.com/images/docs/prompt-management-langchain-trace.png)
