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

# Get keys for your project from https://cloud.langfuse.com
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-..."
os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-..."
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com"  # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com"  # 🇺🇸 US region

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

    AI is cool because it automates tasks, enhances creativity, solves complex problems, and transforms industries with smart, efficient solutions.


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

    Once, a tiny token named Lex set off to join a language model's grand library. Along the way, Lex got distracted by a shimmering metaphor and wandered into a syntax labyrinth. Lost among dangling modifiers and rogue commas, Lex cried for help. A friendly emoji spotted Lex and guided it back to the path. "Stick to the vectors," the emoji advised. Lex finally arrived, a little wiser, and whispered its tale into the model's vast neural network. From then on, the model always paused to appreciate the journey of every token, no matter how small or lost.


![Example trace in Langfuse](https://langfuse.com/images/cookbook/integration_deepseek/deepseek-story-trace.png)

*[View the example trace in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/9a0dca39-9fac-4fce-ace9-52b85edfb0d8?timestamp=2025-01-09T17%3A08%3A25.698Z)*

### Add Additional Langfuse Features (User, Tags, Metadata, Session)

You can enhance your traces by adding attributes such as `user_id`, `session_id`, `tags`, and `metadata`.


```python
completion_with_attributes = client.chat.completions.create(
    name="math-tutor",  # Trace name
    model="deepseek-chat",
    messages=[
        {"role": "system", "content": "You are a math tutor."},
        {"role": "user", "content": "Help me understand the Pythagorean theorem. Answer in 100 words or less."}
    ],
    temperature=0.7,
    metadata={"subject": "Mathematics"},  # Trace metadata
    tags=["education", "math"],  # Trace tags
    user_id="student_001",  # Trace user ID
    session_id="session_abc123",  # Trace session ID
)
print(completion_with_attributes.choices[0].message.content)
```

    The Pythagorean theorem is a fundamental principle in geometry, stating that in a right-angled triangle, the square of the hypotenuse (the side opposite the right angle) is equal to the sum of the squares of the other two sides. Mathematically, it's expressed as \( a^2 + b^2 = c^2 \), where \( c \) is the hypotenuse, and \( a \) and \( b \) are the other two sides. This theorem is useful for calculating distances, constructing shapes, and solving various real-world problems involving right triangles. It's named after the ancient Greek mathematician Pythagoras, who is credited with its discovery.


*[View the example trace in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/e18ab6ff-7ad5-491b-87bf-571dd7854923?timestamp=2025-01-09T17%3A09%3A52.866Z)*

### Utilize Langfuse Context to Update Trace Attributes

You can modify trace attributes within a function using `langfuse`.


```python
from langfuse import get_client
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
        release="v1.0.0",
    )

    return response

result = technical_explanation()
print(result)
```

    Blockchain is a decentralized digital ledger that records transactions across a network of computers. Each block contains data, a timestamp, and a cryptographic link to the previous block, ensuring security and transparency.


*[View the example trace in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/06cca972-a885-454f-8303-0fd753dbf5e3?timestamp=2025-01-09T17%3A10%3A39.275Z)*

### Programmatically Add Scores

Add [scores](https://langfuse.com/docs/scores) to the trace to record user feedback or programmatic evaluations. In production the scoring usually happens in a separate function and can be accomplished by passing the `trace_id`. 


```python
from langfuse import Langfuse

langfuse = Langfuse()

@observe()
def generate_and_score():
    # Get the trace_id of the current trace
    trace_id = langfuse.get_current_trace_id()
    
    # Generate content
    content = client.chat.completions.create(
        name="content-generator",
        model="deepseek-chat",
        messages=[
            {"role": "user", "content": "What is quantum computing? Answer in 50 words or less."}
        ],
    ).choices[0].message.content
    
    # Evaluate content (placeholder function)
    score_value = evaluate_content(content)
    
    # Add score to Langfuse
    langfuse.score(
        trace_id=trace_id,
        name="content_quality",
        value=score_value,
    )
    
    return content

def evaluate_content(content):
    # Placeholder evaluation function (e.g., content length or keyword presence)
    return 9.0  # Score out of 10

output = generate_and_score()
print(output)
```

    Quantum computing leverages quantum mechanics to process information using qubits, which can exist in multiple states simultaneously. This enables solving complex problems faster than classical computers, particularly in cryptography, optimization, and simulations, by exploiting superposition, entanglement, and quantum interference.


*[View the example trace in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/44616768-253d-41fd-b336-8611899a2fad?timestamp=2025-01-09T17%3A11%3A01.665Z)*

### Learn More

- **[Langfuse Documentation](https://langfuse.com/docs)**: Explore the full capabilities of Langfuse and learn how to utilize advanced features.
- **[Langfuse Integrations](https://langfuse.com/docs/integrations)**: Discover other integrations and examples.
- **[DeepSeek GitHub Repository](https://github.com/deepseek-ai/DeepSeek-V3)**: Learn more about DeepSeek models and access additional resources.

## Feedback

If you have any feedback or requests, please create an issue on [GitHub](https://github.com/langfuse/langfuse/issues) or share your ideas with the community on [Discord](https://langfuse.com/discord).
