---
description: Example cookbook for the OpenLLMetry Langfuse integration using OpenTelemetry.
category: Integrations
---

# OpenLLMetry Integration via OpenTelemetry


```python
%pip install openai traceloop-sdk
```


```python
import os
import base64

LANGFUSE_PUBLIC_KEY=""
LANGFUSE_SECRET_KEY=""
LANGFUSE_AUTH=base64.b64encode(f"{LANGFUSE_PUBLIC_KEY}:{LANGFUSE_SECRET_KEY}".encode()).decode()

os.environ["TRACELOOP_BASE_URL"] = "https://cloud.langfuse.com/api/public/otel" # EU data region
# os.environ["TRACELOOP_BASE_URL"] = "https://us.cloud.langfuse.com/api/public/otel" # US data region
os.environ["TRACELOOP_HEADERS"] = f"Authorization=Basic {LANGFUSE_AUTH}"

# your openai key
os.environ["OPENAI_API_KEY"] = ""
```

## OpenAI SDK


```python
from openai import OpenAI
from traceloop.sdk import Traceloop

Traceloop.init(disable_batch=True)

openai_client = OpenAI()

chat_completion = openai_client.chat.completions.create(
    messages=[
        {
          "role": "user",
          "content": "What is LLM Observability?",
        }
    ],
    model="gpt-4o-mini",
)

print(chat_completion)
```

[Example Trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/e417c49b4044725e48aa0e089534fa12?timestamp=2025-02-02T22%3A04%3A04.487Z)

![OpenLLMetry OpenAI Trace](https://langfuse.com/images/cookbook/otel-integration-openllmetry/openllmetry-openai-trace.png)
