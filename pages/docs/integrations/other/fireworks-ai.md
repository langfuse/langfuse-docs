---
title: "Integrate Fireworks AI with Langfuse"
description: "Guide on using Fireworks AI's open-source and proprietary AI models with Langfuse via the OpenAI SDK."
category: Integrations
---

# Observability for Fireworks AI with Langfuse

This guide shows you how to integrate Fireworks AI with Langfuse. Fireworks AI's API endpoints are fully [compatible](https://docs.fireworks.ai/tools-sdks/openai-compatibility) with the OpenAI SDK, allowing you to trace and monitor your AI applications seamlessly.

> **What is Fireworks AI?** [Fireworks AI](https://fireworks.ai/) is a platform that provides API access to state-of-the-art open-source and proprietary AI models with OpenAI-compatible endpoints.

> **What is Langfuse?** [Langfuse](https://langfuse.com) is an open source LLM engineering platform that helps teams trace API calls, monitor performance, and debug issues in their AI applications.

## Step 1: Install Dependencies


```python
%pip install openai langfuse
```

## Step 2: Set Up Environment Variables


```python
import os

# Get keys for your project from the project settings page
# https://cloud.langfuse.com

os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-..." 
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-..."
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region

# Set your Fireworks API details
os.environ["FIREWORKS_AI_API_BASE"] = "https://api.fireworks.ai/inference/v1"
os.environ["FIREWORKS_AI_API_KEY"] = "fw_..."
```

## Step 3: Use Langfuse OpenAI Drop-in Replacement


```python
from langfuse.openai import openai

client = openai.OpenAI(
  api_key=os.environ.get("FIREWORKS_AI_API_KEY"),
  base_url=os.environ.get("FIREWORKS_AI_API_BASE")
)
```

## Step 4: Run an Example


```python
response = client.chat.completions.create(
  model="accounts/fireworks/models/llama-v3p1-8b-instruct",
  messages=[
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Why is open source important?"},
  ],
  name = "Fireworks-AI-Trace" # name of the trace
)
print(response.choices[0].message.content)
```

    Open source is a crucial aspect of the software development and technology ecosystem, and its importance cannot be overstated. Here are some reasons why open source is important:
    
    1. **Collaboration and Community**: Open source allows developers from all over the world to collaborate on a project, share ideas, and contribute code. This leads to a large community of developers working together to improve the software, making it more robust and reliable.
    2. **Transparency and Accountability**: Open source code is freely available for anyone to review, modify, and distribute. This transparency ensures that developers can see exactly how the software works, making it easier to identify and fix bugs or security vulnerabilities.
    3. **Innovation and Competition**: Open source software (OSS) can foster innovation and competition, as developers can create new features, plugins, or extensions that build upon existing OSS. This leads to a more diverse and vibrant ecosystem.
    4. **Cost Savings**: Open source software is often free or low-cost, which can be a significant advantage for individuals, organizations, or governments with limited budgets.
    5. **Security**: Open source code can be reviewed by a large community of developers, making it easier to identify and fix security vulnerabilities before they become major issues.
    6. **Customization and Flexibility**: Open source software can be customized and modified to meet specific needs, making it an attractive option for organizations with unique requirements.
    7. **Patent and Licensing Issues**: Open source software is often released under permissive licenses, which reduces the risk of patent and licensing disputes.
    8. **Scalability and Interoperability**: Open source software can be easily integrated with other OSS and proprietary software, making it easier to build complex systems and applications.
    9. **Education and Research**: Open source software provides a platform for students, researchers, and developers to learn and experiment with new technologies, contributing to the advancement of computer science and technology.
    10. **Democratization of Technology**: Open source software can democratize access to technology, enabling individuals and organizations to participate in the development and use of software, regardless of their financial or geographical constraints.
    
    Overall, open source is essential for promoting collaboration, innovation, and transparency in software development, and it has become an integral part of the technology landscape.


## Step 5: Enhance Tracing (Optional)

You can enhance your Fireworks AI traces:

- Add [metadata](https://langfuse.com/docs/tracing-features/metadata), [tags](https://langfuse.com/docs/tracing-features/tags), [log levels](https://langfuse.com/docs/tracing-features/log-levels) and [user IDs](https://langfuse.com/docs/tracing-features/users) to traces
- Group traces by [sessions](https://langfuse.com/docs/tracing-features/sessions)
- [`@observe()` decorator](https://langfuse.com/docs/sdk/python/decorators) to trace additional application logic
- Use [Langfuse Prompt Management](https://langfuse.com/docs/prompts/get-started) and link prompts to traces
- Add [score](https://langfuse.com/docs/scores/custom) to traces

Visit the [OpenAI SDK cookbook](https://langfuse.com/docs/integrations/openai/python/examples) to see more examples on passing additional parameters.
Find out more about Langfuse Evaluations and Prompt Management in the [Langfuse documentation](https://langfuse.com/docs).

## Step 6: See Traces in Langfuse

After running the example, log in to Langfuse to view the detailed traces, including:

- Request parameters
- Response content
- Token usage and latency metrics

<img src="https://langfuse.com/images/cookbook/integration-fireworks-ai/fireworks-ai-example-trace.png" alt="Langfuse Trace Example" style="border-radius: 8px;" />

_[Public example trace link in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/2c11b0e4-eb40-49de-aee9-2ed11bed2839?timestamp=2025-03-05T13%3A31%3A34.781Z&observation=e9668bb4-29d7-4239-87be-e3019480f71f)_

## Resources

- [Fireworks AI Documentation](https://docs.fireworks.ai/getting-started/introduction)
- [Langfuse](https://langfuse.com)
