---
description: Example of Open Source Prompt Management for Langchain applications using Langfuse.
category: Prompt Management
---

# Example: Langfuse Prompt Management with Langchain (Python)

[Langfuse Prompt Management](https://langfuse.com/docs/prompts) helps to version control and manage prompts collaboratively in one place. This example demostrates how to use prompts managed in Langchain applications.

_In addition, we use [Langfuse Tracing](https://langfuse.com/docs/tracing) via the native [Langchain integration](https://langfuse.com/docs/integrations/langchain) to inspect and debug the Langchain application._

## Setup


```python
%pip install langfuse langchain langchain-openai --upgrade
```


```python
import os

# get keys for your project from https://cloud.langfuse.com
os.environ["LANGFUSE_PUBLIC_KEY"] = ""
os.environ["LANGFUSE_SECRET_KEY"] = ""
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com"

# your openai key
os.environ["OPENAI_API_KEY"] = ""
```


```python
from langfuse import Langfuse
from langfuse.callback import CallbackHandler

# Initialize Langfuse client (prompt management)
langfuse = Langfuse()

# Initialize Langfuse CallbackHandler for Langchain (tracing)
langfuse_callback_handler = CallbackHandler()

# Optional, verify that Langfuse is configured correctly
assert langfuse.auth_check()
assert langfuse_callback_handler.auth_check()
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
    "Plan an event titled {{Event Name}}. The event will be about: {{Event Description}}. "
    "The event will be held in {{Location}} on {{Date}}. "
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

    Plan an event titled {{Event Name}}. The event will be about: {{Event Description}}. The event will be held in {{Location}} on {{Date}}. Consider the following factors: audience, budget, venue, catering options, and entertainment. Provide a detailed plan including potential vendors and logistics.


### Transform into Langchain PromptTemplate

Use the utility method `.get_langchain_prompt()` to transform the Langfuse prompt into a string that can be used in Langchain.

Context: Langfuse declares input variables in prompt templates using double brackets (`{{input variable}}`). Langchain uses single brackets for declaring input variables in PromptTemplates (`{input variable}`). The utility method `.get_langchain_prompt()` replaces the double brackets with single brackets.


```python
from langchain_core.prompts import ChatPromptTemplate

langchain_prompt = ChatPromptTemplate.from_template(langfuse_prompt.get_langchain_prompt())
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


### Create Langchain chain based on prompt


```python
from langchain_openai import ChatOpenAI

model = ChatOpenAI(model=model, temperature=temperature)

chain = langchain_prompt | model
```

## Invoke chain


```python
example_input = {
    "Event Name": "Wedding",
    "Event Description": "The wedding of Julia and Alex, a charming couple who share a love for art and nature. This special day will celebrate their journey together with a blend of traditional and contemporary elements, reflecting their unique personalities.",
    "Location": "Central Park, New York City",
    "Date": "June 5, 2024"
}
```


```python
# we pass the callback handler to the chain to trace the run in Langfuse
response = chain.invoke(input=example_input,config={"callbacks":[langfuse_callback_handler]})

print(response.content)
```

    Event Title: Julia and Alex's Artful Nature Wedding
    
    Audience: Family, friends, and loved ones of Julia and Alex, as well as art and nature enthusiasts.
    
    Budget: $30,000
    
    Venue: Central Park, New York City
    
    Catering Options: 
    - Organic and locally sourced menu options
    - Vegetarian and vegan options
    - Artfully presented dishes
    - Champagne toast and signature cocktails
    
    Entertainment:
    - Live acoustic music during the ceremony
    - DJ for the reception
    - Interactive art stations for guests to create their own masterpieces
    - Nature-inspired photo booth
    
    Logistics:
    - Ceremony and reception to be held in a secluded area of Central Park, surrounded by lush greenery and blooming flowers
    - Tents and seating to be set up for guests
    - Art installations and sculptures to be placed around the venue
    - Transportation for guests to and from the park
    - Permits and permissions for the event in Central Park
    
    Potential Vendors:
    - Catering: Farm-to-table catering company
    - Music: Local acoustic musician and DJ
    - Art installations: Local artists and galleries
    - Photography: Nature and art-focused photographer
    - Transportation: Eco-friendly shuttle service
    
    Overall, the wedding will be a beautiful blend of art and nature, with a focus on sustainability and creativity. The event will showcase the couple's love for each other and their shared passions, creating a memorable and unique experience for all in attendance.


## View Trace in Langfuse

Now we can see that the trace incl. the prompt template have been logged to Langfuse

![Trace of prompt used in Langchain in Langfuse](https://langfuse.com/images/docs/prompt-management-langchain-trace.png)

## Iterate on prompt in Langfuse
We can now continue adapting our prompt template in the Langfuse UI and continuously update the prompt template in our Langchain application via the script above.
