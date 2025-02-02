---
description: Open Source Observability for Pydantic AI. Example cookbook for the Pydantic AI Langfuse integration using OpenTelemetry.
category: Integrations
---

# Pydantic AI Integration via OpenTelemetry


```python
%pip install pydantic-ai[logfire]
```


```python
import os
import base64

LANGFUSE_PUBLIC_KEY=""
LANGFUSE_SECRET_KEY=""
LANGFUSE_AUTH=base64.b64encode(f"{LANGFUSE_PUBLIC_KEY}:{LANGFUSE_SECRET_KEY}".encode()).decode()

os.environ["OTEL_EXPORTER_OTLP_ENDPOINT"] = "https://cloud.langfuse.com/api/public/otel" # EU data region
# os.environ["OTEL_EXPORTER_OTLP_ENDPOINT"] = "https://us.cloud.langfuse.com/api/public/otel" # US data region
os.environ["OTEL_EXPORTER_OTLP_HEADERS"] = f"Authorization=Basic {LANGFUSE_AUTH}"

# your openai key
os.environ["OPENAI_API_KEY"] = ""
```


```python
import nest_asyncio
nest_asyncio.apply()
```


```python
import logfire

logfire.configure(
    service_name='my_logfire_service',

    # Sending to Logfire is on by default regardless of the OTEL env vars.
    send_to_logfire=False,
)
```


```python
from pydantic_ai import Agent, RunContext

roulette_agent = Agent(
    'openai:gpt-4o',
    deps_type=int,
    result_type=bool,
    system_prompt=(
        'Use the `roulette_wheel` function to see if the '
        'customer has won based on the number they provide.'
    ),
)


@roulette_agent.tool
async def roulette_wheel(ctx: RunContext[int], square: int) -> str:
    """check if the square is a winner"""
    return 'winner' if square == ctx.deps else 'loser'
```


```python
# Run the agent
success_number = 18
result = roulette_agent.run_sync('Put my money on square eighteen', deps=success_number)
print(result.data)
```

[Example trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/0194c8b3c1fbb67529f717d4009a310b?timestamp=2025-02-02T22%3A06%3A51.387Z)

![Pydantic AI OpenAI Trace](https://langfuse.com/images/cookbook/otel-integration-pydantic-ai/pydanticai-openai-trace-tree.png)


```python
result = roulette_agent.run_sync('I bet five is the winner', deps=success_number)
print(result.data)
```

[Example trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/0194c8b3d11a9a66859edb3fade14760?timestamp=2025-02-02T22%3A06%3A55.258Z)
