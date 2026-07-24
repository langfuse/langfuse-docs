import logging
import os
from datetime import datetime, timezone

import httpx
from dotenv import load_dotenv
from langfuse import Langfuse, LangfuseSpan
from langfuse.media import LangfuseMedia
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
from livekit.plugins.turn_detector.multilingual import MultilingualModel

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


LANGFUSE_DOCS_MCP = mcp.MCPServerHTTP(url="https://langfuse.com/api/mcp")


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
                    inference.LLM("openai/gpt-4.1-mini"),
                    inference.LLM("google/gemini-2.5-flash"),
                ]
            ),
            stt=FallbackSTTAdapter(
                stt=[
                    inference.STT("deepgram/nova-3"),
                    inference.STT("cartesia/ink-whisper"),
                ]
            ),
            tts=FallbackTTSAdapter(
                tts=[
                    inference.TTS("cartesia"),
                    inference.TTS("rime/arcana"),
                ]
            ),
            turn_detection=MultilingualModel(),
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

# Wrapper root observations and Langfuse clients per room, shared between the
# entrypoint and on_session_end.
_recording_context: dict[str, tuple[LangfuseSpan, list[Langfuse]]] = {}


async def on_session_end(ctx: JobContext) -> None:
    """Attach the session recording to the conversation's root observation.

    Runs in-process after the AgentSession closed; the stereo OGG written by
    `record={"audio": True}` is complete at this point. The wrapper root
    observation opened in the entrypoint is still open, so the recording lands
    directly in the top-level observation's metadata. The first region's client
    uploads the file via the SDK's media handling; the remaining regions receive
    the same file through their media API (the media ID is derived from the
    file's SHA-256 client-side, so the reference is identical in every region).
    """
    context = _recording_context.pop(ctx.room.name, None)
    if context is None:
        return
    root_span, langfuse_clients = context

    recording = None
    audio_bytes = b""
    try:
        audio_path = ctx.session_directory / "audio.ogg"
        if audio_path.exists():
            audio_bytes = audio_path.read_bytes()
            recording = LangfuseMedia(
                content_bytes=audio_bytes,
                content_type="audio/ogg",
            )
            # Uploads the file (via the first client, deduplicated by content
            # hash) and renders as an audio player on the root observation.
            root_span.update(metadata={"recording": recording})
        else:
            logger.warning("no session recording found at %s", audio_path)
    finally:
        root_span.end()

    # Upload the same file to the remaining regions so the media reference
    # resolves everywhere.
    if recording is not None:
        sha256 = recording._content_sha256_hash
        for client in langfuse_clients[1:]:
            try:
                res = await client.async_api.media.get_upload_url(
                    trace_id=root_span.trace_id,
                    observation_id=root_span.id,
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

    for client in langfuse_clients:
        client.flush()
    logger.info("attached session recording to trace %s", root_span.trace_id)


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

    # Wrap the whole conversation in a root observation. LiveKit's agent_session
    # span is created without an explicit OTel context, so it nests under this
    # span, which stays open until on_session_end attaches the recording.
    with langfuse_clients[0].start_as_current_observation(
        name="voice-conversation",
        end_on_exit=False,  # ended in on_session_end
    ) as root_span:
        _recording_context[ctx.room.name] = (root_span, langfuse_clients)

        await session.start(
            agent=Kelly(),
            room=ctx.room,
            # Record the conversation audio (stereo OGG in ctx.session_directory);
            # other recording features stay off to keep prior behavior.
            record={"audio": True, "traces": False, "logs": False, "transcript": False},
        )


if __name__ == "__main__":
    cli.run_app(server)
