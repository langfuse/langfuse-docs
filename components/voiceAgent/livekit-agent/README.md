# LiveKit Voice Agent

This directory contains the LiveKit voice agent that powers the voice assistant demo on the Langfuse docs website. The agent is deployed to [LiveKit Cloud](https://cloud.livekit.io/) using the LiveKit CLI.

## How it works

The agent (`agent.py`) is a Python-based LiveKit agent that:

- Uses LiveKit's inference API with fallback adapters for LLM, STT, and TTS
- Connects to the [Langfuse Docs MCP server](https://langfuse.com/docs/docs-mcp) to answer questions about Langfuse
- Sends OpenTelemetry spans to the [Langfuse OTel endpoint](https://langfuse.com/docs/observability/overview) for tracing

### OTel tracing

The agent configures an OpenTelemetry `TracerProvider` that exports spans to Langfuse via the OTLP/HTTP exporter. LiveKit's agent SDK automatically instruments LLM calls, STT, TTS, and tool invocations as OTel spans. These are sent to `{LANGFUSE_HOST}/api/public/otel` using Basic auth derived from the Langfuse API keys.

## Deployment

### Secrets

The following secrets must be configured on the LiveKit Cloud agent (via `--secrets` or `--secrets-file`):

- `LANGFUSE_PUBLIC_KEY`
- `LANGFUSE_SECRET_KEY`
- `LANGFUSE_HOST` (e.g. `https://cloud.langfuse.com`)

`LIVEKIT_URL`, `LIVEKIT_API_KEY`, and `LIVEKIT_API_SECRET` are injected automatically by LiveKit Cloud.

### Deploy

```bash
lk agent deploy
```
