# LiveKit Voice Agent

This directory contains the LiveKit voice agent that powers the voice assistant demo on the Langfuse docs website. The agent is deployed to [LiveKit Cloud](https://cloud.livekit.io/) using the LiveKit CLI.

## How it works

The agent (`agent.py`) is a Python-based LiveKit agent that:

- Runs on [OpenAI GPT-Live](https://docs.livekit.io/agents/models/realtime/plugins/gpt-live/), a full-duplex speech-to-speech model, by default (`VOICE_AGENT_MODE=gpt-live`)
- Falls back to a cascaded STT → LLM → TTS pipeline on LiveKit's inference API with provider fallback adapters when `VOICE_AGENT_MODE=pipeline`
- Connects to the [Langfuse Docs MCP server](https://langfuse.com/docs/docs-mcp) to answer questions about Langfuse
- Sends OpenTelemetry spans to Langfuse for tracing
- Records the conversation audio and attaches it to the trace's root observation in Langfuse

### Agent modes

`VOICE_AGENT_MODE` selects which agent joins the room:

- `gpt-live` (default): the `Marin` agent uses `GPTLiveModel`. The voice model handles listening, turn taking, and speaking; a backend Responses model (`GPT_LIVE_RESPONSES_MODEL`, default `gpt-5.6-luna`) handles reasoning and the Langfuse docs MCP tool calls. The voice can be changed with `GPT_LIVE_VOICE` (default `marin`). Requires `OPENAI_API_KEY` from an account with GPT-Live access. No VAD, STT, or TTS is configured in this mode.
- `pipeline`: the `Kelly` agent runs the cascaded pipeline with Silero VAD, LiveKit inference STT/LLM/TTS fallback adapters, and a keyboard-typing "thinking" sound during slow tool calls.

Traces are tagged with the active mode (`voice-agent`, `gpt-live` or `pipeline`).

### OTel tracing

The agent configures an OpenTelemetry `TracerProvider` shared between LiveKit (via `set_tracer_provider`) and one Langfuse client per configured data region (EU, US, JP, internal). Each Langfuse client registers a `LangfuseSpanProcessor` on the provider, so LiveKit's spans (LLM calls, STT, TTS, turn detection, tool invocations) are exported to every region's demo project. Regions without configured credentials are skipped with a warning.

### Conversation recordings

The whole conversation is wrapped in a Langfuse root observation (`voice-conversation`) that LiveKit's `agent_session` span nests under. The session is started with `record={"audio": True}`, which makes LiveKit write a stereo OGG recording (user left channel, agent right channel) to `ctx.session_directory / "audio.ogg"`. When the session ends (`on_session_end`), the recording is attached to the still-open root observation's metadata as a `LangfuseMedia` file, where it renders with an audio player. Because Langfuse media IDs are derived from the file's content hash, the same media reference resolves in every region; the file is uploaded to the remaining regions via each client's media API.

## Deployment

### Secrets

The following secrets must be configured on the LiveKit Cloud agent (via `--secrets` or `--secrets-file`):

- `OPENAI_API_KEY` (required for the default `gpt-live` mode)
- `VOICE_AGENT_MODE` (optional, `gpt-live` or `pipeline`), `GPT_LIVE_VOICE`, `GPT_LIVE_RESPONSES_MODEL` (optional overrides)

Plus one set of Langfuse credentials per region (`EU`, `US`, `JP`, `INTERNAL`):

- `NEXT_PUBLIC_<REGION>_LANGFUSE_BASE_URL` (e.g. `https://cloud.langfuse.com`)
- `NEXT_PUBLIC_<REGION>_LANGFUSE_PUBLIC_KEY`
- `<REGION>_LANGFUSE_SECRET_KEY`

Regions without credentials are skipped. `LIVEKIT_URL`, `LIVEKIT_API_KEY`, and `LIVEKIT_API_SECRET` are injected automatically by LiveKit Cloud.

### Deploy

`livekit.toml` pins the LiveKit Cloud project and agent ID so `lk agent deploy` updates the existing agent. Authenticate once with `lk cloud auth`, then from this directory:

```bash
lk agent deploy --project langfuse-docs-demo
```

Several configured CLI projects share the same subdomain, so pass `--project langfuse-docs-demo` explicitly to avoid the CLI picking the wrong credentials.
