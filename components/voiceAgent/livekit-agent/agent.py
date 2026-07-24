import json
import logging
import os
from datetime import datetime, timezone

import httpx
from dotenv import load_dotenv
from langfuse import Langfuse
from langfuse.media import LangfuseMedia
from opentelemetry import trace as otel_trace
from opentelemetry.sdk.trace import SpanProcessor, TracerProvider
from opentelemetry.util.types import AttributeValue

from livekit.agents import (
    Agent,
    AgentServer,
    AgentSession,
    JobContext,
    cli,
    inference,
    mcp,
    metrics,
)
from livekit.agents.llm import FallbackAdapter as FallbackLLMAdapter
from livekit.agents.stt import FallbackAdapter as FallbackSTTAdapter
from livekit.agents.telemetry import set_tracer_provider
from livekit.agents.tts import FallbackAdapter as FallbackTTSAdapter
from livekit.agents.voice import MetricsCollectedEvent
from livekit.plugins import openai, silero

logger = logging.getLogger("langfuse-trace-example")

load_dotenv()

# This example shows how to use the Langfuse SDK to capture OTel spans emitted by LiveKit.
# The Langfuse Python SDK registers a LangfuseSpanProcessor on the TracerProvider which
# handles batching, auth, and export. We pass should_export_span=lambda span: True so that
# all LiveKit spans are captured (the default filter only exports known LLM/GenAI spans).
# To enable tracing, set the trace provider with `set_tracer_provider` in the module level or
# inside the entrypoint before the `AgentSession.start()`.


def _langfuse_regions() -> list[tuple[str, str, str]]:
    """Read the (host, public key, secret key) tuples of the configured Langfuse regions."""
    regions = []
    for name in ["EU", "US", "JP", "INTERNAL"]:
        host = os.getenv(f"NEXT_PUBLIC_{name}_LANGFUSE_BASE_URL")
        public_key = os.getenv(f"NEXT_PUBLIC_{name}_LANGFUSE_PUBLIC_KEY")
        secret_key = os.getenv(f"{name}_LANGFUSE_SECRET_KEY")
        if not all([host, public_key, secret_key]):
            logger.warning(
                "skipping Langfuse region %s: NEXT_PUBLIC_%s_LANGFUSE_BASE_URL, "
                "NEXT_PUBLIC_%s_LANGFUSE_PUBLIC_KEY, or %s_LANGFUSE_SECRET_KEY not set",
                name,
                name,
                name,
                name,
            )
            continue
        regions.append((host, public_key, secret_key))
    if not regions:
        raise ValueError("no Langfuse region is configured, set the Langfuse env vars")
    return regions


class LangfuseAttributeSpanProcessor(SpanProcessor):
    """Adds Langfuse trace attributes to every span."""

    def on_start(self, span, parent_context=None):
        span.set_attribute("langfuse.trace.name", "livekit-voice-agent")
        span.set_attribute("langfuse.trace.tags", ["voice-agent"])

    def on_end(self, span):
        pass


def setup_langfuse(
    metadata: dict[str, AttributeValue] | None = None,
) -> tuple[TracerProvider, list[Langfuse]]:
    trace_provider = TracerProvider()
    trace_provider.add_span_processor(LangfuseAttributeSpanProcessor())

    # Initialize a Langfuse client per region. Each call registers a LangfuseSpanProcessor
    # on the shared TracerProvider, handling batching/auth/export to the respective region.
    # should_export_span=lambda span: True bypasses the default LLM-only filter so that
    # all LiveKit agent spans (STT, TTS, LLM, turn detection, etc.) are captured.
    clients = []
    for host, public_key, secret_key in _langfuse_regions():
        clients.append(
            Langfuse(
                public_key=public_key,
                secret_key=secret_key,
                base_url=host,
                tracer_provider=trace_provider,
                should_export_span=lambda span: True,
            )
        )

    set_tracer_provider(trace_provider, metadata=metadata)
    return trace_provider, clients


# client_session_timeout_seconds defaults to 5s, which the RAG-backed
# searchLangfuseDocs tool regularly exceeds (the MCP client then reports
# "An internal error occurred" to the LLM).
LANGFUSE_DOCS_MCP = mcp.MCPServerHTTP(
    url="https://langfuse.com/api/mcp",
    client_session_timeout_seconds=30,
)


class Kelly(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions=(
                "Your name is Kelly. You are a friendly voice assistant for Langfuse, "
                "an open-source LLM observability platform. Keep responses brief and conversational. "
                "When the user asks about Langfuse features, integrations, SDKs, pricing, or usage, "
                "use the Langfuse docs tools to find accurate information before answering."
            ),
            llm=FallbackLLMAdapter(
                llm=[
                    inference.LLM("openai/gpt-5.4-mini"),
                    inference.LLM("google/gemini-3.5-flash"),
                ]
            ),
            stt=FallbackSTTAdapter(
                stt=[
                    inference.STT("deepgram/nova-3", language="multi"),
                    inference.STT("assemblyai/universal-streaming"),
                ]
            ),
            tts=FallbackTTSAdapter(
                tts=[
                    inference.TTS("cartesia/sonic-3.5"),
                    inference.TTS("rime/arcana"),
                ]
            ),
            # Turn detection defaults to inference.TurnDetector() (the new
            # audio-native end-of-turn model) in livekit-agents 1.6+.
        )

    async def on_enter(self):
        logger.info("Kelly is entering the session")
        self.session.generate_reply(
            instructions="Greet the user and let them know you can answer questions about Langfuse using the documentation. Keep it short and friendly."
        )


class Alloy(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions=(
                "Your name is Alloy. You are a friendly voice assistant for Langfuse, "
                "an open-source LLM observability platform. Keep responses brief and conversational. "
                "When the user asks about Langfuse features, integrations, SDKs, pricing, or usage, "
                "use the Langfuse docs tools to find accurate information before answering."
            ),
            llm=openai.realtime.RealtimeModel(voice="alloy"),
        )

    async def on_enter(self):
        logger.info("Alloy is entering the session")
        self.session.generate_reply(
            instructions="Greet the user and let them know you can answer questions about Langfuse using the documentation. Keep it short and friendly."
        )


server = AgentServer()

# Wrapper root spans, Langfuse clients, agent session, and the store-audio
# preference per room, shared between the entrypoint and on_session_end.
_recording_context: dict[
    str, tuple[otel_trace.Span, list[Langfuse], AgentSession, bool]
] = {}


def _transcript_messages(session: AgentSession) -> list[dict[str, str]]:
    """The conversation as chat messages (system prompt excluded)."""
    return [
        {"role": item.role, "content": item.text_content or ""}
        for item in session.history.items
        if item.type == "message" and item.role in ("user", "assistant")
    ]


async def on_session_end(ctx: JobContext) -> None:
    """Enrich the conversation's root observation once the session closed.

    The wrapper root span opened in the entrypoint is still open at this point,
    so the full transcript lands on the top-level observation's input/output
    and, if the user opted in, the stereo OGG written by `record={"audio": True}`
    lands in its metadata. The file is then uploaded to every configured region
    through the Langfuse media API (the media ID is derived from the file's
    SHA-256 client-side, so the reference is identical in every region).
    """
    context = _recording_context.pop(ctx.room.name, None)
    if context is None:
        return
    root_span, langfuse_clients, session, store_audio = context
    span_context = root_span.get_span_context()
    trace_id = format(span_context.trace_id, "032x")
    observation_id = format(span_context.span_id, "016x")

    recording = None
    audio_bytes = b""
    try:
        # Full transcript as the root observation's input/output (lifts to the
        # trace input/output as well).
        messages = _transcript_messages(session)
        if messages:
            last = messages[-1]
            if last["role"] == "assistant":
                root_span.set_attribute(
                    "langfuse.observation.input", json.dumps(messages[:-1])
                )
                root_span.set_attribute(
                    "langfuse.observation.output", last["content"]
                )
            else:
                root_span.set_attribute(
                    "langfuse.observation.input", json.dumps(messages)
                )

        audio_path = ctx.session_directory / "audio.ogg"
        if not store_audio:
            logger.info("audio recording disabled for this session")
        elif audio_path.exists():
            audio_bytes = audio_path.read_bytes()
            recording = LangfuseMedia(
                content_bytes=audio_bytes,
                content_type="audio/ogg",
            )
            # The media reference renders as an audio player on the root
            # observation once the file is uploaded below.
            root_span.set_attribute(
                "langfuse.observation.metadata.recording",
                recording._reference_string,
            )
        else:
            logger.warning("no session recording found at %s", audio_path)
    finally:
        root_span.end()

    # Upload the file to every configured region so the media reference
    # resolves everywhere.
    if recording is not None:
        sha256 = recording._content_sha256_hash
        for client in langfuse_clients:
            try:
                res = await client.async_api.media.get_upload_url(
                    trace_id=trace_id,
                    observation_id=observation_id,
                    content_type="audio/ogg",
                    content_length=len(audio_bytes),
                    sha256hash=sha256,
                    field="metadata",
                )
                # upload_url is None if this file was already uploaded (dedup)
                if res.upload_url:
                    async with httpx.AsyncClient(timeout=30) as http:
                        upload = await http.put(
                            res.upload_url,
                            content=audio_bytes,
                            headers={
                                "Content-Type": "audio/ogg",
                                "x-amz-checksum-sha256": sha256,
                            },
                        )
                    await client.async_api.media.patch(
                        media_id=res.media_id,
                        uploaded_at=datetime.now(timezone.utc),
                        upload_http_status=upload.status_code,
                    )
            except Exception:
                logger.exception(
                    "failed to upload recording to %s", client._base_url
                )
        logger.info("attached session recording to trace %s", trace_id)

    for client in langfuse_clients:
        client.flush()


@server.rtc_session(on_session_end=on_session_end)
async def entrypoint(ctx: JobContext):
    # set up the langfuse tracer
    trace_provider, langfuse_clients = setup_langfuse(
        # metadata will be set as attributes on all spans created by the tracer
        metadata={
            "langfuse.session.id": ctx.room.name,
        }
    )

    # (optional) add a shutdown callback to flush the trace before process exit
    async def flush_trace():
        trace_provider.force_flush()

    ctx.add_shutdown_callback(flush_trace)

    session = AgentSession(
        vad=silero.VAD.load(),
        mcp_servers=[LANGFUSE_DOCS_MCP],
    )

    @session.on("metrics_collected")
    def _on_metrics_collected(ev: MetricsCollectedEvent):
        metrics.log_metrics(ev.metrics)

    # The demo UI sets the store_audio participant attribute via the access
    # token ("Store audio recording on the trace" toggle, default on).
    participant = await ctx.wait_for_participant()
    store_audio = participant.attributes.get("store_audio", "true") != "false"

    # Wrap the whole conversation in a root span. LiveKit's agent_session span
    # is created without an explicit OTel context, so it nests under this span,
    # which stays open until on_session_end attaches transcript and recording.
    #
    # The span is created with a plain OTel tracer (NOT a Langfuse client): the
    # LangfuseSpanProcessor only exports SDK-created spans to the project of
    # the client that created them, so in this multi-region setup a raw span is
    # the only kind that all regions' processors export.
    tracer = trace_provider.get_tracer("voice-agent")
    root_span = tracer.start_span("voice-conversation")
    _recording_context[ctx.room.name] = (
        root_span,
        langfuse_clients,
        session,
        store_audio,
    )

    with otel_trace.use_span(root_span, end_on_exit=False):  # ended in on_session_end
        await session.start(
            agent=Kelly(),
            room=ctx.room,
            # Record the conversation audio (stereo OGG in ctx.session_directory)
            # unless the user opted out; other recording features stay off.
            record={
                "audio": store_audio,
                "traces": False,
                "logs": False,
                "transcript": False,
            },
        )


if __name__ == "__main__":
    cli.run_app(server)
