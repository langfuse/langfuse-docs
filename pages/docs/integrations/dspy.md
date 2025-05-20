---
description: Open-source observability for DSPy, a framework that systematically optimizes language model prompts and weights.
category: Integrations
---

# DSPy - Observability & Tracing

This cookbook demonstrates how to use [DSPy](https://github.com/stanfordnlp/dspy) with Langfuse. DSPy is a framework that systematically optimizes language model prompts and weights, making it easier to build and refine complex systems with LMs by automating the tuning process and improving reliability. For further information on DSPy, please visit the [documentation](https://dspy-docs.vercel.app/docs/intro).

## Prerequisites

Install the required packages:

```python
%pip install dspy langfuse litellm
```

## Step 1: Setup Langfuse Environment Variables

First, configure your Langfuse environment variables. You can get your Langfuse API keys by signing up for [Langfuse Cloud](https://cloud.langfuse.com) or [self-hosting Langfuse](https://langfuse.com/self-hosting).

```python
import os

os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-..."
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-..."
```

## Step 2: Create a DSPy Callback for Langfuse

Create a custom callback class that extends DSPy's BaseCallback to integrate with Langfuse. This callback will handle the tracing and observability of your DSPy modules.

```python
from dspy.utils.callback import BaseCallback
from langfuse.decorators import langfuse_context
from langfuse import Langfuse
from litellm import completion_cost
from typing import Optional
import dspy
import contextvars
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LangFuseDSPYCallback(BaseCallback):
    def __init__(self, signature: dspy.Signature):
        super().__init__()
        # Use contextvars for per-call state
        self.current_system_prompt = contextvars.ContextVar("current_system_prompt")
        self.current_prompt = contextvars.ContextVar("current_prompt")
        self.current_completion = contextvars.ContextVar("current_completion")
        self.current_span = contextvars.ContextVar("current_span")
        self.model_name_at_span_creation = contextvars.ContextVar("model_name_at_span_creation")
        self.input_field_values = contextvars.ContextVar("input_field_values")
        # Initialize Langfuse client
        self.langfuse = Langfuse()
        self.input_field_names = signature.input_fields.keys()

    def on_module_start(self, call_id, *args, **kwargs):
        inputs = kwargs.get("inputs")
        extracted_args = inputs["kwargs"]
        input_field_values = {}
        for input_field_name in self.input_field_names:
            if input_field_name in extracted_args:
                input_field_values[input_field_name] = extracted_args[input_field_name]
        self.input_field_values.set(input_field_values)

    def on_module_end(self, call_id, outputs, exception):
        metadata = {
            "existing_trace_id": langfuse_context.get_current_trace_id(),
            "parent_observation_id": langfuse_context.get_current_observation_id(),
        }
        outputs_extracted = {}
        if outputs is not None:
            try:
                outputs_extracted = {k: v for k, v in outputs.items()}
            except AttributeError:
                outputs_extracted = {"value": outputs}
            except Exception as e:
                outputs_extracted = {"error_extracting_module_output": str(e)}
        langfuse_context.update_current_observation(
            input=self.input_field_values.get({}),
            output=outputs_extracted,
            metadata=metadata
        )

    def on_lm_start(self, call_id, *args, **kwargs):
        if self.current_span.get(None):
            return
        lm_instance = kwargs.get("instance")
        lm_dict = lm_instance.__dict__
        model_name = lm_dict.get("model")
        temperature = lm_dict.get("kwargs", {}).get("temperature")
        max_tokens = lm_dict.get("kwargs", {}).get("max_tokens")
        inputs = kwargs.get("inputs")
        messages = inputs.get("messages")
        system_prompt = messages[0].get("content")
        user_input = messages[1].get("content")
        self.current_system_prompt.set(system_prompt)
        self.current_prompt.set(user_input)
        self.model_name_at_span_creation.set(model_name)
        trace_id = langfuse_context.get_current_trace_id()
        parent_observation_id = langfuse_context.get_current_observation_id()
        span_obj = None
        if trace_id:
            span_obj = self.langfuse.generation(
                input=user_input,
                name=model_name,
                trace_id=trace_id,
                parent_observation_id=parent_observation_id,
                metadata={
                    "model": model_name,
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                    "system": system_prompt,
                },
            )
        self.current_span.set(span_obj)

    def on_lm_end(self, call_id, outputs, exception, **kwargs):
        # ... [Implementation details for on_lm_end remain the same as in your code]
        pass
```

## Step 3: Using the Callback with DSPy

Here's how to use the Langfuse callback with your DSPy modules:

```python
import dspy
from utils.llm import LangFuseDSPYCallback

# Define your signature
class ExtractInfo(dspy.Signature):
    """Extract structured information from text."""
    text: str = dspy.InputField()
    title: str = dspy.OutputField()
    headings: list[str] = dspy.OutputField()
    entities: list[dict[str, str]] = dspy.OutputField(desc="a list of entities and their metadata")

# Initialize the language model
lm = dspy.LM('openai/your-model-name', api_key='PROVIDER_API_KEY')

# Create and configure the callback
callback = LangFuseDSPYCallback(ExtractInfo)
dspy.configure(lm=lm, callbacks=[callback])

# Create and use your module
module = dspy.Predict(ExtractInfo)

# Example usage
text = "Apple Inc. announced its latest iPhone 14 today. The CEO, Tim Cook, highlighted its new features in a press release."
response = module(text=text)

print(response.title)
print(response.headings)
print(response.entities)
```

## Step 4: Viewing Traces in Langfuse

After running your DSPy application, you can inspect the traced events in Langfuse:

![Example trace in Langfuse](https://github.com/user-attachments/assets/4d8dc110-80df-411f-b642-8a62628cf3fb)

The traces will include:
- Input and output values for each module
- Model usage and costs
- System prompts and completions
- Error handling and status messages
- Metadata about the model configuration

This integration provides a comprehensive view of your DSPy application's behavior and performance, making it easier to debug and optimize your language model pipelines.

