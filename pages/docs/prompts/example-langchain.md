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

# Your openai key
os.environ["OPENAI_API_KEY"] = "sk-proj-..."
```

```python
from langfuse import get_client
from langfuse.langchain import CallbackHandler

# Initialize Langfuse client (prompt management)
langfuse = get_client()

# Initialize Langfuse CallbackHandler for Langchain (tracing)
langfuse_callback_handler = CallbackHandler()
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

    To plan an event titled "{Event Name}" in Central Park, New York City on June 5, 2024, we need to consider several key factors: audience, budget, venue, catering options, and entertainment. Below is a detailed plan to ensure the event is successful and memorable.

    ### Event Overview
    - **Event Name**: {Event Name}
    - **Event Description**: {Event Description}
    - **Date**: June 5, 2024
    - **Location**: Central Park, New York City

    ### Audience
    - **Target Audience**: Define the demographic (e.g., age group, interests, professional background) that the event is aimed at.
    - **Expected Attendance**: Estimate the number of attendees to plan logistics accordingly.

    ### Budget
    - **Total Budget**: Determine the overall budget for the event.
    - **Allocation**:
      - Venue: 20%
      - Catering: 25%
      - Entertainment: 20%
      - Marketing and Promotion: 15%
      - Logistics and Rentals: 10%
      - Miscellaneous: 10%

    ### Venue
    - **Location**: Central Park, NYC
    - **Permits**: Obtain necessary permits from the NYC Parks Department for hosting an event in Central Park.
    - **Layout**: Plan the layout considering the stage, seating, food stations, and restrooms.
    - **Weather Contingency**: Arrange for tents or an alternative indoor venue in case of inclement weather.

    ### Catering Options
    - **Vendors**: Consider local catering companies such as:
      - Great Performances
      - Abigail Kirsch
      - Neuman’s Kitchen
    - **Menu**: Offer a diverse menu catering to various dietary preferences (vegetarian, vegan, gluten-free).
    - **Beverages**: Include a selection of non-alcoholic and alcoholic beverages, ensuring compliance with local regulations.

    ### Entertainment
    - **Performers**: Book local bands, DJs, or performers that align with the event theme.
    - **Sound and Lighting**: Hire a professional company to manage sound and lighting, ensuring high-quality production.
    - **Activities**: Plan interactive activities or workshops relevant to the event theme.

    ### Logistics
    - **Transportation**: Provide information on public transport options and parking facilities.
    - **Security**: Hire a security team to ensure the safety of all attendees.
    - **First Aid**: Arrange for a first aid station with trained medical personnel.
    - **Waste Management**: Implement a waste management plan with recycling options.

    ### Marketing and Promotion
    - **Strategy**: Develop a marketing plan using social media, email campaigns, and partnerships with local businesses.
    - **Materials**: Create promotional materials such as flyers, banners, and digital content.
    - **Registration**: Set up an online registration platform for attendees to RSVP.

    ### Potential Vendors
    - **Event Planner**: Hire a local event planning company with experience in organizing events in Central Park.
    - **AV Equipment**: Rent from companies like AV NYC or Big Apple Rentals.
    - **Decor**: Work with a local decor company to enhance the event's aesthetic.

    ### Timeline
    - **6 Months Prior**: Finalize vendors, secure permits, and begin marketing.
    - **3 Months Prior**: Confirm all bookings, finalize the guest list, and start ticket sales.
    - **1 Month Prior**: Conduct a walkthrough of the venue, finalize the menu, and confirm all logistics.
    - **1 Week Prior**: Reconfirm all arrangements with vendors and staff.
    - **Event Day**: Arrive early for setup, conduct a final check, and ensure all elements are in place.

    By addressing these factors and following this plan, {Event Name} is set to be a successful and enjoyable event for all attendees.

## View Trace in Langfuse

Now we can see that the trace incl. the prompt template have been logged to Langfuse

![Trace of prompt used in Langchain in Langfuse](https://langfuse.com/images/docs/prompt-management-langchain-trace.png)

## Iterate on prompt in Langfuse

We can now continue adapting our prompt template in the Langfuse UI and continuously update the prompt template in our Langchain application via the script above.
