# Instrumentation patterns

Every Langfuse integration notebook follows the same outer skeleton (metadata → install → env vars → init client → instrument → run example → view traces). What differs between notebooks is how the partner is instrumented. There are four patterns in the existing cookbook. Pick the one that matches your target integration.

When in doubt, search the partner's docs for: "OpenTelemetry", "OpenInference", "OpenAI-compatible", or "instrument". The result tells you the pattern immediately in most cases.

## Pattern 1 — OpenInference instrumentor

Use when the partner has (or there exists) a dedicated OpenInference instrumentation package. This is the cleanest pattern and the most common one for agent frameworks. Look for a package named `openinference-instrumentation-<partner>` on PyPI.

Examples in the cookbook: `integration_google_adk.ipynb`, `integration_crewai.ipynb`, `integration_openai-agents.ipynb`, `integration_autogen.ipynb`, `integration_temporal.ipynb` (for the OpenAI Agents inside Temporal), `integration_smolagents.ipynb`.

### Install cell

```python
%pip install langfuse <partner-package> openinference-instrumentation-<partner> -q
```

### Instrumentation cell (after env vars + auth check)

```python
## Step 3: OpenTelemetry Instrumentation

Use the [`<PartnerInstrumentor>`](https://github.com/Arize-ai/openinference/tree/main/python/instrumentation/openinference-instrumentation-<partner>) library to wrap <Partner> calls and send OpenTelemetry spans to Langfuse.
```

```python
from openinference.instrumentation.<partner> import <PartnerInstrumentor>

<PartnerInstrumentor>().instrument()
```

### Example cell

Whatever the minimal "hello world" is for the framework. Keep it to 15–30 lines. Typical shape: build an agent, give it one tool or prompt, run it once, print the output.

## Pattern 2 — OpenAI-compatible drop-in

Use when the partner's API is OpenAI-compatible (exposes `/v1/chat/completions` with the same schema). Works for most inference providers. No instrumentation library needed — just import OpenAI from langfuse instead of openai.

Examples: `integration_fireworks_ai.ipynb`, `integration_groq_sdk.ipynb`, `integration_deepseek_openai_sdk.ipynb`, `integration_togetherai.ipynb`, `integration_huggingface_openai_sdk.ipynb`, `integration_cerebras.ipynb`, `integration_novitaai.ipynb`, `integration_baseten.ipynb`, `integration_byteplus.ipynb`, `integration_cometapi.ipynb`, `integration_x_ai_grok.ipynb`.

### Install cell

```python
%pip install openai langfuse
```

### Env var cell additions

```python
os.environ["<PARTNER>_API_BASE"] = "https://api.<partner>.com/v1"
os.environ["<PARTNER>_API_KEY"] = "..."
```

### Skip the Langfuse client auth_check cell

This pattern doesn't need `get_client()` in the flow. The `langfuse.openai` wrapper handles it.

### Instrumentation cell (really just a client init)

```markdown
## Step 3: Use Langfuse OpenAI Drop-in Replacement

Instead of importing `openai` directly, import it from `langfuse.openai`. Calls through this client are automatically traced.
```

```python
from langfuse.openai import openai

client = openai.OpenAI(
  api_key=os.environ.get("<PARTNER>_API_KEY"),
  base_url=os.environ.get("<PARTNER>_API_BASE")
)
```

### Example cell

```python
response = client.chat.completions.create(
  model="<partner-model-id>",
  messages=[
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Why is open source important?"},
  ],
  name="<Partner>-Trace" # name of the trace
)
print(response.choices[0].message.content)
```

## Pattern 3 — Framework-native instrumentation

Use when the framework exposes its own "start tracing" hook that emits OTel (or calls OpenInference under the hood). Usually a single call like `Framework.instrument_all()`.

Examples: `integration_pydantic_ai.ipynb` uses `Agent.instrument_all()`. Some Logfire-integrated frameworks fall here too.

### Install cell

```python
%pip install langfuse <partner-package> -U
```

### Instrumentation cell

```markdown
## Step 3: Initialize <Partner> Instrumentation

<One sentence naming the partner's own instrumentation hook and what it does.>
```

```python
from <partner> import <Thing>

<Thing>.instrument_all()
```

### Example cell

Whatever the partner's minimal example is. Often needs `instrument=True` passed to the agent constructor in addition to `instrument_all()` — check the partner's docs.

## Pattern 4 — Raw OTel exporter

Use when the partner emits OpenTelemetry spans natively and you need to configure an OTLP exporter pointing at Langfuse. Less common but real.

Examples: `otel_integration_openlit.ipynb`, `otel_integration_openllmetry.ipynb`, `otel_integration_mlflow.ipynb`, `otel_integration_arize.ipynb`.

### Install cell

```python
%pip install langfuse <partner-package>
```

### Instrumentation cell

```markdown
## Step 3: Configure OpenTelemetry Export to Langfuse

<Partner> emits OTel spans natively. Configure the OTLP exporter to send them to Langfuse.
```

```python
import os, base64

LANGFUSE_AUTH = base64.b64encode(
    f"{os.environ['LANGFUSE_PUBLIC_KEY']}:{os.environ['LANGFUSE_SECRET_KEY']}".encode()
).decode()

os.environ["OTEL_EXPORTER_OTLP_ENDPOINT"] = os.environ["LANGFUSE_BASE_URL"] + "/api/public/otel"
os.environ["OTEL_EXPORTER_OTLP_HEADERS"] = f"Authorization=Basic {LANGFUSE_AUTH}"
```

Then the partner-specific setup to start emitting (this varies — check the partner's docs).

### Example cell

Partner-specific. Often just a normal call to the partner, whose SDK already emits spans now that OTel is configured.

## Choosing between patterns when the partner offers more than one

Some partners support multiple approaches (e.g., you can use Google ADK via its OpenInference instrumentor, via raw OTel, or via OpenAI-compatible routing). When the user hasn't specified:

1. Prefer **framework-native** if the partner ships first-class Langfuse/OTel support (cleanest and best documented).
2. Otherwise prefer **OpenInference** if an `openinference-instrumentation-<partner>` package exists on PyPI.
3. Otherwise **OpenAI-compatible drop-in** if the partner is an inference API with `/v1/chat/completions`.
4. Otherwise **raw OTel exporter**.

Surface the choice to the user with a one-line rationale. If you're unsure, ask.

## Spec-building tips for `build_notebook.py`

The spec schema mirrors the skeleton in `SKILL.md`. Here's a minimal Pydantic AI (pattern 3) example:

```json
{
  "title_metadata": {
    "title": "Observability for Pydantic AI with Langfuse Integration",
    "sidebar_title": "Pydantic AI",
    "logo": "/images/integrations/pydantic_ai_icon.svg",
    "description": "Discover how to integrate Langfuse with Pydantic AI for enhanced LLM application monitoring, debugging, and tracing.",
    "category": "Integrations"
  },
  "intro": {
    "page_title": "Integrate Langfuse with Pydantic AI",
    "one_liner": "This notebook walks through integrating Langfuse with Pydantic AI for observability and debugging.",
    "partner_blurb": "[PydanticAI](https://ai.pydantic.dev/) is a Python agent framework that brings FastAPI-style type safety to GenAI app development.",
    "langfuse_blurb": "[Langfuse](https://langfuse.com) is an open-source LLM engineering platform for tracing, debugging, and evaluating LLM apps."
  },
  "install": "%pip install langfuse pydantic-ai -U",
  "env_extra": [
    {"key": "OPENAI_API_KEY", "value": "sk-proj-..."}
  ],
  "instrument_markdown": "### Step 3: Initialize Pydantic AI Instrumentation\n\nPydantic AI exposes a built-in `instrument_all()` helper that emits OpenTelemetry spans for every agent run. These get picked up by Langfuse automatically.",
  "instrument_code": "from pydantic_ai.agent import Agent\n\nAgent.instrument_all()",
  "example_markdown": "### Step 4: Run a Pydantic AI Agent\n\nPass `instrument=True` on the agent and run it. The agent will emit a trace to Langfuse.",
  "example_code": "from pydantic_ai import Agent, RunContext\n\nroulette_agent = Agent('openai:gpt-4o', deps_type=int, system_prompt='...', instrument=True)\n\n# run the agent once\n",
  "trace_image_path": "https://langfuse.com/images/cookbook/integration-pydantic-ai/pydantic-ai-trace.png",
  "example_trace_url": "TODO: replace with your own example trace URL",
  "learn_more_variant": "python"
}
```

Run: `python scripts/build_notebook.py --out cookbook/integration_pydantic_ai.ipynb --spec pydantic_ai.json`.
