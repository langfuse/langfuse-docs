---
description: Example cookbook for the OpenLIT Langfuse integration using OpenTelemetry.
category: Integrations
---

# OpenLIT Integration via OpenTelemetry


```python
%pip install openai langfuse openlit
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
from openai import OpenAI
import openlit

openlit.init(disable_batch=True)

openai_client = OpenAI()

chat_completion = openai_client.chat.completions.create(
    messages=[
        {
          "role": "user",
          "content": "What is LLM Observability?",
        }
    ],
    model="gpt-3.5-turbo",
)

print(chat_completion)
```

[Example trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/64902f6a5b4f27738be939b7ad38eab3?timestamp=2025-02-02T22%3A09%3A53.053Z)

![OpenLIT OpenAI Trace](https://langfuse.com/images/cookbook/otel-integration-openlit/openlit-openai-trace.png)
