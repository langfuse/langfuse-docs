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

# Get keys for your project from the project settings page: https://cloud.langfuse.com

os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-..." 
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-..." 
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region

# your openai key
os.environ["OPENAI_API_KEY"] = "sk-proj-..."
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
- `labels` to include `production` to immediately use prompt as the default


```python
langfuse.create_prompt(
    name="event-planner",
    prompt=
    "Plan an event titled {{Event Name}}. The event will be about: {{Event Description}}. "
    "The event will be held in {{Location}} on {{Date}}. "
    "Consider the following factors: audience, budget, venue, catering options, and entertainment. "
    "Provide a detailed plan including potential vendors and logistics.",
    config={
        "model":"gpt-4o",
        "temperature": 0,
    },
    labels=["production"]
);
```

Prompt in Langfuse UI

![Created prompt in Langfuse UI](https://langfuse.com/images/docs/prompt-management-langchain-prompt.png)

## Example application

### Get current prompt version from Langfuse


```python
# Get current production version of prompt
langfuse_prompt = langfuse.get_prompt("event-planner")
```

```python
print(langfuse_prompt.prompt)
```

```
Plan an event titled {{Event Name}}. The event will be about: {{Event Description}}. The event will be held in {{Location}} on {{Date}}. Consider the following factors: audience, budget, venue, catering options, and entertainment. Provide a detailed plan including potential vendors and logistics.
 ```

### Transform into Langchain PromptTemplate

Use the utility method `.get_langchain_prompt()` to transform the Langfuse prompt into a string that can be used in Langchain.

Context: Langfuse declares input variables in prompt templates using double brackets (`{{input variable}}`). Langchain uses single brackets for declaring input variables in PromptTemplates (`{input variable}`). The utility method `.get_langchain_prompt()` replaces the double brackets with single brackets.

Also, pass the Langfuse prompt as metadata to the PromptTemplate to automatically link generations that use the prompt.


```python
from langchain_core.prompts import ChatPromptTemplate

langchain_prompt = ChatPromptTemplate.from_template(
        langfuse_prompt.get_langchain_prompt(),
        metadata={"langfuse_prompt": langfuse_prompt},
    )
```

Extract the configuration options from `prompt.config`


```python
model = langfuse_prompt.config["model"]
temperature = str(langfuse_prompt.config["temperature"])
print(f"Prompt model configurations\nModel: {model}\nTemperature: {temperature}")
```

    Prompt model configurations
    Model: gpt-4o
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

    **Event Title:** Central Park Summer Fest
    
    **Event Description:** Central Park Summer Fest is a vibrant outdoor festival celebrating the onset of summer with a blend of music, art, food, and community activities. The event aims to bring together New Yorkers and tourists alike for a day of fun, relaxation, and cultural enrichment in the heart of the city.
    
    **Date and Location:** June 5, 2024, Central Park, New York City
    
    ---
    
    ### Event Plan
    
    #### Audience
    - **Target Audience:** Families, young adults, tourists, and local residents.
    - **Expected Attendance:** 5,000 - 7,000 people.
    
    #### Budget
    - **Estimated Total Budget:** $150,000
      - Venue and Permits: $20,000
      - Catering: $40,000
      - Entertainment: $50,000
      - Marketing and Promotion: $20,000
      - Logistics and Operations: $20,000
    
    #### Venue
    - **Location:** Central Park, New York City
    - **Specific Area:** Great Lawn or Sheep Meadow (pending permit approval)
    - **Permits:** Obtain necessary permits from NYC Parks Department. Ensure compliance with noise ordinances and capacity regulations.
    
    #### Catering Options
    - **Food Trucks and Stalls:** Partner with local vendors to provide a diverse range of cuisines, including vegan and gluten-free options.
      - Potential Vendors:
        - **The Halal Guys** - Middle Eastern cuisine
        - **Wafels & Dinges** - Belgian waffles
        - **Korilla BBQ** - Korean BBQ
        - **Van Leeuwen Ice Cream** - Artisan ice cream
    - **Beverage Stations:** Set up hydration stations with water and soft drinks. Consider partnerships with local breweries for a craft beer garden.
    
    #### Entertainment
    - **Main Stage Performances:**
      - Headliner: A well-known band or artist (e.g., Vampire Weekend or The Strokes)
      - Supporting Acts: Local bands and emerging artists
    - **Art Installations:** Collaborate with local artists to create interactive art pieces throughout the park.
    - **Workshops and Activities:**
      - Yoga and wellness sessions
      - Kids' zone with face painting and games
      - Community art projects
    
    #### Logistics
    - **Security and Safety:** Hire a professional security team. Coordinate with local police and emergency services for safety protocols.
    - **Transportation and Parking:** Encourage public transportation. Provide shuttle services from major subway stations.
    - **Waste Management:** Implement a recycling and waste management plan. Partner with a local waste management company for cleanup services.
    
    #### Marketing and Promotion
    - **Social Media Campaigns:** Utilize platforms like Instagram, Facebook, and Twitter for event promotion.
    - **Partnerships:** Collaborate with local influencers and media outlets for coverage.
    - **Print Materials:** Distribute flyers and posters in local businesses and community centers.
    
    #### Potential Vendors and Partners
    - **Event Production:** Hire an experienced event production company (e.g., Eventique or Empire Entertainment) to manage logistics and technical aspects.
    - **Catering Coordination:** Work with a catering coordinator to manage food vendor logistics.
    - **Sound and Lighting:** Engage a professional AV company (e.g., Frost Productions) for stage and sound setup.
    
    ---
    
    ### Conclusion
    
    Central Park Summer Fest promises to be a memorable event that captures the essence of New York City's vibrant culture. By carefully planning each aspect, from entertainment to logistics, we aim to create a seamless and enjoyable experience for all attendees.


## Link with Langfuse Tracing

Add the prompt object to the `generation` call in the SDKs to link the generation in [Langfuse Tracing](/docs/tracing) to the prompt version. This linkage enables tracking of metrics by prompt version and name, such as event-planner", directly in the Langfuse UI. Metrics like scores per prompt version provide insights into how modifications to prompts impact the quality of the generations. If a [fallback prompt](/docs/prompts/get-started#fallback) is used, no link will be created.


```python
from langfuse import Langfuse
from langchain_core.prompts import ChatPromptTemplate, PromptTemplate
from langchain_openai import ChatOpenAI, OpenAI
 
langfuse = Langfuse()
 
# Text prompts:
langfuse_text_prompt = langfuse.get_prompt("movie-critic")
 
## Pass the langfuse_text_prompt to the PromptTemplate as metadata to link it to generations that use it
langchain_text_prompt = PromptTemplate.from_template(
    langfuse_text_prompt.get_langchain_prompt(),
    metadata={"langfuse_prompt": langfuse_text_prompt},
)
 
## Use the text prompt in a Langchain chain
llm = OpenAI()
completion_chain = langchain_text_prompt | llm
 
completion_chain.invoke({"movie": "Dune 2", "criticlevel": "expert"})
 
# Chat prompts:
langfuse_chat_prompt = langfuse.get_prompt("movie-critic-chat", type="chat")
 
## Manually set the metadata on the langchain_chat_prompt to link it to generations that use it
langchain_chat_prompt = ChatPromptTemplate.from_messages(
    langfuse_chat_prompt.get_langchain_prompt()
)
langchain_chat_prompt.metadata = {"langfuse_prompt": langfuse_chat_prompt}
 
## or use the ChatPromptTemplate constructor directly.
## Note that using ChatPromptTemplate.from_template led to issues in the past
## See: https://github.com/langfuse/langfuse/issues/5374
langchain_chat_prompt = ChatPromptTemplate(
    langfuse_chat_prompt.get_langchain_prompt(),
    metadata={"langfuse_prompt": langfuse_prompt}
)
 
## Use the chat prompt in a Langchain chain
chat_llm = ChatOpenAI()
chat_chain = langchain_chat_prompt | chat_llm
 
chat_chain.invoke({"movie": "Dune 2", "criticlevel": "expert"})
```




    AIMessage(content="As an expert movie critic, I have not personally seen Dune 2 as it has not been released yet. However, I am familiar with Dune (2021), directed by Denis Villeneuve, which is the first installment in the upcoming two-part adaptation of Frank Herbert's novel. Dune (2021) has garnered critical acclaim for its visual storytelling, intricate world-building, and strong performances. I am looking forward to seeing Dune 2 once it is released and offering my expert opinion on it.", additional_kwargs={'refusal': None}, response_metadata={'token_usage': {'completion_tokens': 105, 'prompt_tokens': 25, 'total_tokens': 130, 'completion_tokens_details': {'accepted_prediction_tokens': 0, 'audio_tokens': 0, 'reasoning_tokens': 0, 'rejected_prediction_tokens': 0}, 'prompt_tokens_details': {'audio_tokens': 0, 'cached_tokens': 0}}, 'model_name': 'gpt-3.5-turbo-0125', 'system_fingerprint': None, 'id': 'chatcmpl-BNJzW0710KB5yXoPXqHiNAfYnccpp', 'finish_reason': 'stop', 'logprobs': None}, id='run-b05e2ebf-dddc-405a-8cba-d7dc4951c104-0', usage_metadata={'input_tokens': 25, 'output_tokens': 105, 'total_tokens': 130, 'input_token_details': {'audio': 0, 'cache_read': 0}, 'output_token_details': {'audio': 0, 'reasoning': 0}})



**Note:**  If you use the `with_config` method on the PromptTemplate to create a new Langchain Runnable with updated config, please make sure to pass the `langfuse_prompt` in the `metadata` key as well. Set the `langfuse_prompt` metadata key only on PromptTemplates and not additionally on the LLM calls or elsewhere in your chains.

## View Trace in Langfuse

Now we can see that the trace incl. the prompt template have been logged to Langfuse

![Trace of prompt used in Langchain in Langfuse](https://langfuse.com/images/docs/prompt-management-langchain-trace.png)

## Iterate on prompt in Langfuse
We can now continue adapting our prompt template in the Langfuse UI and continuously update the prompt template in our Langchain application via the script above.
