# LiveKit Voice Agent

This directory contains the LiveKit voice agent that powers the voice assistant demo on the Langfuse docs website. The agent is deployed to [LiveKit Cloud](https://cloud.livekit.io/) using the LiveKit CLI.

## How it works

The agent (`agent.py`) is a Python-based LiveKit agent that:

- Uses LiveKit's inference API with fallback adapters for LLM, STT, and TTS
- Connects to the [Langfuse Docs MCP server](https://langfuse.com/docs/docs-mcp) to answer questions about Langfuse
- Sends OpenTelemetry spans to Langfuse for tracing
- Records the conversation audio and attaches it to the trace's root observation in Langfuse

### OTel tracing

The agent configures an OpenTelemetry `TracerProvider` shared between LiveKit (via `set_tracer_provider`) and one Langfuse client per configured data region (EU, US, JP, internal). Each Langfuse client registers a `LangfuseSpanProcessor` on the provider, so LiveKit's spans (LLM calls, STT, TTS, turn detection, tool invocations) are exported to every region's demo project. Regions without configured credentials are skipped with a warning.

### Conversation recordings

The whole conversation is wrapped in a Langfuse root observation (`voice-conversation`) that LiveKit's `agent_session` span nests under. The session is started with `record={"audio": True}`, which makes LiveKit write a stereo OGG recording (user left channel, agent right channel) to `ctx.session_directory / "audio.ogg"`. When the session ends (`on_session_end`), the recording is attached to the still-open root observation's metadata as a `LangfuseMedia` file, where it renders with an audio player. Because Langfuse media IDs are derived from the file's content hash, the same media reference resolves in every region; the file is uploaded to the remaining regions via each client's media API.

## Deployment

### Secrets

The following secrets must be configured on the LiveKit Cloud agent (via `--secrets` or `--secrets-file`), one set per Langfuse region (`EU`, `US`, `JP`, `INTERNAL`):

- `NEXT_PUBLIC_<REGION>_LANGFUSE_BASE_URL` (e.g. `https://cloud.langfuse.com`)
- `NEXT_PUBLIC_<REGION>_LANGFUSE_PUBLIC_KEY`
- `<REGION>_LANGFUSE_SECRET_KEY`

Regions without credentials are skipped. `LIVEKIT_URL`, `LIVEKIT_API_KEY`, and `LIVEKIT_API_SECRET` are injected automatically by LiveKit Cloud.

### Deploy

```bash
lk agent deploy
```
