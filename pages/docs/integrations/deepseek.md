---
description: Example cookbook on how to monitor DeepSeek models with Langfuse using the OpenAI SDK
category: Integrations
---

# Cookbook: Monitor DeepSeek Models with Langfuse Using the OpenAI SDK

The DeepSeek API uses an API format compatible with OpenAI. By modifying the configuration, you can use the OpenAI SDK or software compatible with the OpenAI API to access the DeepSeek API.

This cookbook demonstrates how to monitor [DeepSeek](https://github.com/deepseek-ai/DeepSeek-V3) models using the OpenAI SDK integration with [Langfuse](https://langfuse.com). By leveraging Langfuse's observability tools and the OpenAI SDK, you can effectively debug, monitor, and evaluate your applications that utilize DeepSeek models.

This guide will walk you through setting up the integration, making requests to DeepSeek models, and observing the interactions with Langfuse.

**Note:** *Langfuse is also natively integrated with [LangChain](https://langfuse.com/docs/integrations/langchain/tracing), [LlamaIndex](https://langfuse.com/docs/integrations/llama-index/get-started), [LiteLLM](https://langfuse.com/docs/integrations/litellm/tracing), and [other frameworks](https://langfuse.com/docs/integrations/overview). These frameworks can be used as well to trace DeepSeek requests.*

## Setup

### Install Required Packages

To get started, install the necessary packages. Ensure you have the latest versions of `langfuse` and `openai`.


```python
%pip install langfuse openai --upgrade
```

### Set Environment Variables

Set up your environment variables with the necessary keys. Obtain your Langfuse project keys from [Langfuse Cloud](https://cloud.langfuse.com). You will also need an access token from [DeepSeek](https://platform.deepseek.com/api_keys) to access their models.


```python
import os

# Get keys for your project from the project settings page: https://cloud.langfuse.com
os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-..." 
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-..." 
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region

# Your DeepSeek API key (get it from https://platform.deepseek.com/api_keys)
os.environ["DEEPSEEK_API_KEY"] = "sk-..."  # Replace with your DeepSeek API key
```

### Import Necessary Modules

Instead of importing `openai` directly, import it from `langfuse.openai`. Also, import any other necessary modules.

Check out our [OpenAI integration docs](https://langfuse.com/docs/integrations/openai/python/get-started) to learn how to use this integration with other Langfuse [features](https://langfuse.com/docs/tracing#advanced-usage).


```python
# Instead of: import openai
from langfuse.openai import OpenAI
from langfuse import observe
```

### Initialize the OpenAI Client for DeepSeek Models

Initialize the OpenAI client, pointing it to the DeepSeek model endpoint. Replace the model URL and APP key with your own.


```python
# Initialize the OpenAI client, pointing it to the DeepSeek Inference API
client = OpenAI(
    base_url="https://api.deepseek.com",  # Replace with the DeepSeek model endpoint URL
    api_key=os.getenv('DEEPSEEK_API_KEY'),  # Replace with your DeepSeek API key
)
```

## Examples

### Chat Completion Request

Use the `client` to make a chat completion request to the DeepSeek model. The `model` parameter can be any identifier since the actual model is specified in the `base_url`.



```python
completion = client.chat.completions.create(
    model="deepseek-chat", 
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Why is AI cool? Answer in 20 words or less."}
    ]
)
print(completion.choices[0].message.content)
```

    AI is cool because it automates tasks, enhances creativity, and solves complex problems quickly—making life smarter and easier.


![Example trace in Langfuse](https://langfuse.com/images/cookbook/integration_deepseek/deepseek-simple-trace.png)

*[View the example trace in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/83702a6c-ae0e-4317-87fa-dc82568a2d89?timestamp=2025-01-09T17%3A06%3A40.848Z)*

### Observe the Request with Langfuse

By using the `OpenAI` client from `langfuse.openai`, your requests are automatically traced in Langfuse. You can also use the `@observe()` decorator to group multiple generations into a single trace.



```python
@observe()  # Decorator to automatically create a trace and nest generations
def generate_story():
    completion = client.chat.completions.create(
        name="story-generator",
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": "You are a creative storyteller."},
            {"role": "user", "content": "Tell me a short story about a token that got lost on its way to the language model. Answer in 100 words or less."}
        ],
        metadata={"genre": "adventure"},
    )
    return completion.choices[0].message.content

story = generate_story()
print(story)
```

    **The Lost Token**  
    
    Timmy the Token was excited—today, he’d help the language model craft a story! But as he raced through the data pipeline, he took a wrong turn, tumbling into a forgotten cache.  
    
    "Hello?" Timmy echoed. Only silence replied.  
    
    Days passed. The model stuttered without him. Then, a cleanup script swept through. "Gotcha!" it chirped, rescuing Timmy.  
    
    Back in the prompt, Timmy gleamed. The model sparked to life: *"Once, a token got lost…"*  
    
    And so, Timmy’s adventure became the very story he was meant to tell.  
    
    (100 words exactly)


![Example trace in Langfuse](https://langfuse.com/images/cookbook/integration_deepseek/deepseek-story-trace.png)

*[View the example trace in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/9a0dca39-9fac-4fce-ace9-52b85edfb0d8?timestamp=2025-01-09T17%3A08%3A25.698Z)*

### Add Additional Langfuse Features (User, Tags, Metadata, Session)

You can enhance your traces by adding [attributes](https://langfuse.com/docs/integrations/openai/python/get-started#custom-trace-properties) such as `user_id`, `session_id`, `tags`, and `metadata`.


```python
from langfuse import get_client
 
langfuse = get_client()
 
# Trace attributes must be set on enclosing span
with langfuse.start_as_current_span(name="math-tutor") as span:
    span.update_trace(
        session_id="session_123",
        user_id="user_456",
        tags=["math"]
    )
 
    result = client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": "You are a math tutor."},
            {"role": "user", "content": "Help me understand the Pythagorean theorem. Answer in 100 words or less."}
        ],
        name="test-chat",
        metadata={"someMetadataKey": "someValue"},
    )

print(result.choices[0].message.content)
```

    The Pythagorean theorem states that in a right-angled triangle, the square of the hypotenuse (the side opposite the right angle) is equal to the sum of the squares of the other two sides. Mathematically, if \( a \) and \( b \) are the legs, and \( c \) is the hypotenuse, then:  
    
    \[ a^2 + b^2 = c^2 \]  
    
    This theorem helps calculate distances, solve geometry problems, and is foundational in trigonometry. For example, if \( a = 3 \) and \( b = 4 \), then \( c = 5 \) because \( 3^2 + 4^2 = 5^2 \).


*[View the example trace in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/19dc2f6afdf9bdfc295c10b2403e7b07?timestamp=2025-06-13T09:26:11.293Z&display=details)*

### Utilize Langfuse Context to Update Trace Attributes

You can modify trace attributes within a function using `langfuse`.


```python
from langfuse import get_client, observe
langfuse = get_client()

@observe()
def technical_explanation():
    # Your main application logic
    response = client.chat.completions.create(
        name="tech-explainer",
        model="deepseek-chat",
        messages=[
            {"role": "user", "content": "Explain how blockchain technology works. Answer in 30 words or less."}
        ],
    ).choices[0].message.content

    # Update the current trace with additional information
    langfuse.update_current_trace(
        name="Blockchain Explanation",
        session_id="session_xyz789",
        user_id="user_tech_42",
        tags=["technology", "blockchain"],
        metadata={"topic": "blockchain", "difficulty": "intermediate"},
    )

    return response

result = technical_explanation()
print(result)
```

    Blockchain is a decentralized digital ledger that records transactions across a network of computers. Each block contains transaction data, linked securely to the previous one, ensuring transparency and immutability. (30 words)


*[View the example trace in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/06cca972-a885-454f-8303-0fd753dbf5e3?timestamp=2025-01-09T17%3A10%3A39.275Z)*

### Programmatically Add Scores

Langfuse lets you ingest custom scores for individual spans or entire traces. This scoring workflow enables you to implement custom quality checks at runtime or facilitate human-in-the-loop evaluation processes.

In the example below, we demonstrate how to score a specific span for conciseness (a numeric score) and the overall trace for feedback (a categorical score). This helps in systematically assessing and improving your application.


```python
from langfuse import get_client
 
langfuse = get_client()
 
# Trace attributes must be set on enclosing span
with langfuse.start_as_current_span(name="math-tutor") as span:

    result = client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": "You are a math tutor."},
            {"role": "user", "content": "Help me understand the Pythagorean theorem. Answer in 100 words or less."}
        ],
        name="test-chat",
        metadata={"someMetadataKey": "someValue"},
    )

    # Score this specific span
    span.score(name="conciseness", value=0.8, data_type="NUMERIC")
 
    # Score the overall trace
    span.score_trace(name="feedback", value="positive", data_type="CATEGORICAL")

print(result.choices[0].message.content)
```

    The Pythagorean theorem states that in a right-angled triangle, the square of the hypotenuse (the side opposite the right angle) is equal to the sum of the squares of the other two sides. Mathematically, it’s written as:  
    
    \[ a^2 + b^2 = c^2 \]  
    
    Here, \(a\) and \(b\) are the legs, and \(c\) is the hypotenuse. For example, if \(a = 3\) and \(b = 4\), then \(c = 5\) because \(3^2 + 4^2 = 9 + 16 = 25 = 5^2\). This theorem helps calculate distances and solve geometry problems involving right triangles.


*[View the example trace in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/44616768-253d-41fd-b336-8611899a2fad?timestamp=2025-01-09T17%3A11%3A01.665Z)*

### Learn More

- **[Langfuse Documentation](https://langfuse.com/docs)**: Explore the full capabilities of Langfuse and learn how to utilize advanced features.
- **[Langfuse Integrations](https://langfuse.com/docs/integrations)**: Discover other integrations and examples.
- **[DeepSeek GitHub Repository](https://github.com/deepseek-ai/DeepSeek-V3)**: Learn more about DeepSeek models and access additional resources.

## Feedback

If you have any feedback or requests, please create an issue on [GitHub](https://github.com/langfuse/langfuse/issues) or share your ideas with the community on [Discord](https://langfuse.com/discord).
