---
description: Examplel on how to use Langfuse Prompt Management in Langchain applications in Python
---

# Example: Langfuse Prompt Management with Langchain in Python

[Langfuse Prompt Management](https://langfuse.com/docs/prompts) helps to version control and manage prompts collaboratively in one place. This example demostrates how to use prompts managed in Langfuse to run Langchain applications.

## Setup


```python
%pip install langfuse langchain langchain-openai openai --upgrade
```

    Requirement already satisfied: langfuse in /usr/local/lib/python3.10/dist-packages (2.18.2)
    Requirement already satisfied: langchain in /usr/local/lib/python3.10/dist-packages (0.1.9)
    Collecting langchain-openai
      Downloading langchain_openai-0.0.8-py3-none-any.whl (32 kB)
    Requirement already satisfied: openai in /usr/local/lib/python3.10/dist-packages (1.12.0)
    Requirement already satisfied: backoff<3.0.0,>=2.2.1 in /usr/local/lib/python3.10/dist-packages (from langfuse) (2.2.1)
    Requirement already satisfied: chevron<0.15.0,>=0.14.0 in /usr/local/lib/python3.10/dist-packages (from langfuse) (0.14.0)
    Requirement already satisfied: httpx<0.26.0,>=0.15.4 in /usr/local/lib/python3.10/dist-packages (from langfuse) (0.25.2)
    Requirement already satisfied: packaging<24.0,>=23.2 in /usr/local/lib/python3.10/dist-packages (from langfuse) (23.2)
    Requirement already satisfied: pydantic<3.0,>=1.10.7 in /usr/local/lib/python3.10/dist-packages (from langfuse) (2.6.1)
    Requirement already satisfied: wrapt==1.14 in /usr/local/lib/python3.10/dist-packages (from langfuse) (1.14.0)
    Requirement already satisfied: PyYAML>=5.3 in /usr/local/lib/python3.10/dist-packages (from langchain) (6.0.1)
    Requirement already satisfied: SQLAlchemy<3,>=1.4 in /usr/local/lib/python3.10/dist-packages (from langchain) (2.0.27)
    Requirement already satisfied: aiohttp<4.0.0,>=3.8.3 in /usr/local/lib/python3.10/dist-packages (from langchain) (3.9.3)
    Requirement already satisfied: async-timeout<5.0.0,>=4.0.0 in /usr/local/lib/python3.10/dist-packages (from langchain) (4.0.3)
    Requirement already satisfied: dataclasses-json<0.7,>=0.5.7 in /usr/local/lib/python3.10/dist-packages (from langchain) (0.6.4)
    Requirement already satisfied: jsonpatch<2.0,>=1.33 in /usr/local/lib/python3.10/dist-packages (from langchain) (1.33)
    Requirement already satisfied: langchain-community<0.1,>=0.0.21 in /usr/local/lib/python3.10/dist-packages (from langchain) (0.0.24)
    Requirement already satisfied: langchain-core<0.2,>=0.1.26 in /usr/local/lib/python3.10/dist-packages (from langchain) (0.1.27)
    Requirement already satisfied: langsmith<0.2.0,>=0.1.0 in /usr/local/lib/python3.10/dist-packages (from langchain) (0.1.10)
    Requirement already satisfied: numpy<2,>=1 in /usr/local/lib/python3.10/dist-packages (from langchain) (1.25.2)
    Requirement already satisfied: requests<3,>=2 in /usr/local/lib/python3.10/dist-packages (from langchain) (2.31.0)
    Requirement already satisfied: tenacity<9.0.0,>=8.1.0 in /usr/local/lib/python3.10/dist-packages (from langchain) (8.2.3)
    Collecting tiktoken<1,>=0.5.2 (from langchain-openai)
      Downloading tiktoken-0.6.0-cp310-cp310-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (1.8 MB)
    [2K     [90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[0m [32m1.8/1.8 MB[0m [31m11.2 MB/s[0m eta [36m0:00:00[0m
    [?25hRequirement already satisfied: anyio<5,>=3.5.0 in /usr/local/lib/python3.10/dist-packages (from openai) (3.7.1)
    Requirement already satisfied: distro<2,>=1.7.0 in /usr/lib/python3/dist-packages (from openai) (1.7.0)
    Requirement already satisfied: sniffio in /usr/local/lib/python3.10/dist-packages (from openai) (1.3.0)
    Requirement already satisfied: tqdm>4 in /usr/local/lib/python3.10/dist-packages (from openai) (4.66.2)
    Requirement already satisfied: typing-extensions<5,>=4.7 in /usr/local/lib/python3.10/dist-packages (from openai) (4.9.0)
    Requirement already satisfied: aiosignal>=1.1.2 in /usr/local/lib/python3.10/dist-packages (from aiohttp<4.0.0,>=3.8.3->langchain) (1.3.1)
    Requirement already satisfied: attrs>=17.3.0 in /usr/local/lib/python3.10/dist-packages (from aiohttp<4.0.0,>=3.8.3->langchain) (23.2.0)
    Requirement already satisfied: frozenlist>=1.1.1 in /usr/local/lib/python3.10/dist-packages (from aiohttp<4.0.0,>=3.8.3->langchain) (1.4.1)
    Requirement already satisfied: multidict<7.0,>=4.5 in /usr/local/lib/python3.10/dist-packages (from aiohttp<4.0.0,>=3.8.3->langchain) (6.0.5)
    Requirement already satisfied: yarl<2.0,>=1.0 in /usr/local/lib/python3.10/dist-packages (from aiohttp<4.0.0,>=3.8.3->langchain) (1.9.4)
    Requirement already satisfied: idna>=2.8 in /usr/local/lib/python3.10/dist-packages (from anyio<5,>=3.5.0->openai) (3.6)
    Requirement already satisfied: exceptiongroup in /usr/local/lib/python3.10/dist-packages (from anyio<5,>=3.5.0->openai) (1.2.0)
    Requirement already satisfied: marshmallow<4.0.0,>=3.18.0 in /usr/local/lib/python3.10/dist-packages (from dataclasses-json<0.7,>=0.5.7->langchain) (3.21.0)
    Requirement already satisfied: typing-inspect<1,>=0.4.0 in /usr/local/lib/python3.10/dist-packages (from dataclasses-json<0.7,>=0.5.7->langchain) (0.9.0)
    Requirement already satisfied: certifi in /usr/local/lib/python3.10/dist-packages (from httpx<0.26.0,>=0.15.4->langfuse) (2024.2.2)
    Requirement already satisfied: httpcore==1.* in /usr/local/lib/python3.10/dist-packages (from httpx<0.26.0,>=0.15.4->langfuse) (1.0.4)
    Requirement already satisfied: h11<0.15,>=0.13 in /usr/local/lib/python3.10/dist-packages (from httpcore==1.*->httpx<0.26.0,>=0.15.4->langfuse) (0.14.0)
    Requirement already satisfied: jsonpointer>=1.9 in /usr/local/lib/python3.10/dist-packages (from jsonpatch<2.0,>=1.33->langchain) (2.4)
    Requirement already satisfied: orjson<4.0.0,>=3.9.14 in /usr/local/lib/python3.10/dist-packages (from langsmith<0.2.0,>=0.1.0->langchain) (3.9.15)
    Requirement already satisfied: annotated-types>=0.4.0 in /usr/local/lib/python3.10/dist-packages (from pydantic<3.0,>=1.10.7->langfuse) (0.6.0)
    Requirement already satisfied: pydantic-core==2.16.2 in /usr/local/lib/python3.10/dist-packages (from pydantic<3.0,>=1.10.7->langfuse) (2.16.2)
    Requirement already satisfied: charset-normalizer<4,>=2 in /usr/local/lib/python3.10/dist-packages (from requests<3,>=2->langchain) (3.3.2)
    Requirement already satisfied: urllib3<3,>=1.21.1 in /usr/local/lib/python3.10/dist-packages (from requests<3,>=2->langchain) (2.0.7)
    Requirement already satisfied: greenlet!=0.4.17 in /usr/local/lib/python3.10/dist-packages (from SQLAlchemy<3,>=1.4->langchain) (3.0.3)
    Requirement already satisfied: regex>=2022.1.18 in /usr/local/lib/python3.10/dist-packages (from tiktoken<1,>=0.5.2->langchain-openai) (2023.12.25)
    Requirement already satisfied: mypy-extensions>=0.3.0 in /usr/local/lib/python3.10/dist-packages (from typing-inspect<1,>=0.4.0->dataclasses-json<0.7,>=0.5.7->langchain) (1.0.0)
    Installing collected packages: tiktoken, langchain-openai
    Successfully installed langchain-openai-0.0.8 tiktoken-0.6.0



```python
import os

# get keys for your project from https://cloud.langfuse.com
os.environ["LANGFUSE_PUBLIC_KEY"] = ""
os.environ["LANGFUSE_SECRET_KEY"] = ""

# your openai key
os.environ["OPENAI_API_KEY"] = ""

# if you do not use Langfuse Cloud
# os.environ["LANGFUSE_HOST"] = "http://localhost:3000"
```


```python
from langfuse import Langfuse
from langfuse.callback import CallbackHandler

langfuse = Langfuse()

langfuse_handler = CallbackHandler()

# optional, verify that Langfuse is configured correctly
print(langfuse.auth_check())
print(langfuse_handler.auth_check())
```

    True
    True


## Create Prompt in Langfuse

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
)
```




    <langfuse.model.PromptClient at 0x7ae4159fdbd0>



## Get current prompt version from Langfuse


```python
# Get current production version of prompt
langfuse_prompt = langfuse.get_prompt("event-planner")
print(langfuse_prompt.prompt)
```

    Plan an event titled {{Event Name}}. The event will be about: {{Event Description}}. The event will be held in {{Location}} on {{Date}}. Consider the following factors: audience, budget, venue, catering options, and entertainment. Provide a detailed plan including potential vendors and logistics.


## Extract Langfuse prompt template prompt and config

As you saw earlier, Langfuse declares input variables of prompt templates with double brackets (`{{input variable}}`). Langchain, on the other side, uses single brackets for declaring input variables in PromptTemplates (`{input variable}`). Hence, we need to edit the template before declaring the Langchain template.


```python
import re

# Replace double brackets with single brackets
single_bracket_prompt = re.sub(r'\{\{(.*?)\}\}', r'{\1}', langfuse_prompt.prompt)
print(single_bracket_prompt)
```

    Plan an event titled {Event Name}. The event will be about: {Event Description}. The event will be held in {Location} on {Date}. Consider the following factors: audience, budget, venue, catering options, and entertainment. Provide a detailed plan including potential vendors and logistics.


The other configurations can be extracted straightforward


```python
model = langfuse_prompt.config["model"]
temperature = str(langfuse_prompt.config["temperature"])
print(f"Prompt model configurations\nModel: {model}\nTemperature: {temperature}")
```

    Prompt model configurations
    Model: gpt-3.5-turbo-1106
    Temperature: 0


## Build Langchain application


```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

langchain_prompt = ChatPromptTemplate.from_template(single_bracket_prompt)
model = ChatOpenAI(model=model, temperature=temperature)

chain = langchain_prompt | model
```

## Use Langchain chain with Langfuse callback handler


```python
response = chain.invoke(
    input={
      "Event Name": "Wedding",
      "Event Description": "The wedding of Julia and Alex, a charming couple "
      " who share a love for art and nature. This special day will celebrate "
      "their journey together with a blend of traditional and contemporary elements, "
      "reflecting their unique personalities.",
      "Location": "Central Park, New York City",
      "Date": "June 5, 2024"
    },
    config={
        "callbacks":[langfuse_handler]
    }
)
```


```python
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

(TODO: Replace with CleanShot screenshot)

## Iterate on prompt in Langfuse
We can now continue adapting our prompt template in the Langfuse UI and continuously update the prompt template in our Langchain application via the script above.
