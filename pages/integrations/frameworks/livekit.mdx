---
title: Open Source Observability for LiveKit Agents
sidebarTitle: LiveKit
logo: /images/integrations/livekit_icon.svg
description: Trace real-time voice AI agents and multimodal conversations built with LiveKit Agents using Langfuse.
---

# LiveKit Agents Tracing Integration

This guide shows you how to integrate **Langfuse** with **LiveKit Agents** for [observability and tracing](/docs/tracing) of real-time voice AI applications. By following these steps, you'll be able to monitor, debug and evaluate your LiveKit agents in the Langfuse dashboard.

> [LiveKit Agents](https://docs.livekit.io/agents/) ([repo](https://github.com/livekit/agents)) is an open-source Python and Node.js framework for building production-grade multimodal and voice AI agents. It provides a complete set of tools and abstractions for feeding realtime media through AI pipelines, supporting both high-performance STT-LLM-TTS voice pipelines and speech-to-speech models with any AI provider.

_Example of a LiveKit agent conversation with telemetry in Langfuse._

<Frame border>
  ![Livekit trace in Langfuse](/images/docs/livekit-trace.png)
</Frame>

## Features

A _trace_ represents the execution flow of a single request within an LLM application. It captures all relevant steps, including duration and metadata.

Agent telemetry records traces for the following activities:

- Session start
- Agent turn
- LLM node
- Function tool
- TTS node
- End-of-turn detection
- LLM and TTS metrics

Learn more about LiveKit's built-in telemetry in the [LiveKit documentation](https://docs.livekit.io/agents/build/metrics/).

## End-to-end example

We've created an end-to-end example of how to trace a LiveKit agent with Langfuse. You can find the code [on GitHub](https://github.com/livekit/agents/blob/main/examples/voice_agents/langfuse_trace.py).

## Get Started

LiveKit Agents includes built-in OpenTelemetry support, and Langfuse provides an [OpenTelemetry endpoint](/docs/opentelemetry/get-started). Follow these steps to enable comprehensive tracing for your LiveKit application.

<Steps>

### Obtain Langfuse API keys

Create a project in [Langfuse Cloud](https://cloud.langfuse.com) or [self-host](/self-hosting) Langfuse and copy your API keys.

### Environment Configuration

import EnvPython from "@/components-mdx/env-python.mdx";

<EnvPython />

### Enable telemetry

To enable telemetry, configure a tracer provider using `set_tracer_provider` in your entrypoint function.

Set the required public key, secret key, and host as environment variables.

```python filename="agent.py"
import base64
import os

from livekit.agents.telemetry import set_tracer_provider

def setup_langfuse(
    host: str | None = None, public_key: str | None = None, secret_key: str | None = None
):
    from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
    from opentelemetry.sdk.trace import TracerProvider
    from opentelemetry.sdk.trace.export import BatchSpanProcessor

    public_key = public_key or os.getenv("LANGFUSE_PUBLIC_KEY")
    secret_key = secret_key or os.getenv("LANGFUSE_SECRET_KEY")
    host = host or os.getenv("LANGFUSE_HOST")

    if not public_key or not secret_key or not host:
        raise ValueError("LANGFUSE_PUBLIC_KEY, LANGFUSE_SECRET_KEY, and LANGFUSE_HOST must be set")

    langfuse_auth = base64.b64encode(f"{public_key}:{secret_key}".encode()).decode()
    os.environ["OTEL_EXPORTER_OTLP_ENDPOINT"] = f"{host.rstrip('/')}/api/public/otel"
    os.environ["OTEL_EXPORTER_OTLP_HEADERS"] = f"Authorization=Basic {langfuse_auth}"

    trace_provider = TracerProvider()
    trace_provider.add_span_processor(BatchSpanProcessor(OTLPSpanExporter()))
    set_tracer_provider(trace_provider)

async def entrypoint(ctx: JobContext):
    setup_langfuse()  # set up the langfuse tracer provider

    # ...
```

</Steps>

## References

- [LiveKit Agents Documentation](https://docs.livekit.io/agents/)
- [LiveKit Telemetry Guide](https://docs.livekit.io/agents/build/metrics/)
- [End-to-end example](https://github.com/livekit/agents/blob/main/examples/voice_agents/langfuse_trace.py)

## GitHub Discussions

import { GhDiscussionsPreview } from "@/components/gh-discussions/GhDiscussionsPreview";

<GhDiscussionsPreview labels={["integration-livekit"]} />
