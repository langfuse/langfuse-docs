import asyncio
import json
import logging
import os
import re
from dataclasses import dataclass
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
    AudioConfig,
    BackgroundAudioPlayer,
    BuiltinAudioClip,
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
from livekit.plugins import silero
from livekit.plugins.openai.realtime import GPTLiveModel

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
        span.set_attribute("langfuse.trace.tags", ["voice-agent", VOICE_AGENT_MODE])
        # Temporarily disabled: demo traces are not shared publicly right now.
        # span.set_attribute("langfuse.trace.public", True)

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
                # Export finished spans within a second so turns show up in
                # Langfuse while the conversation is still going.
                flush_interval=1,
            )
        )

    set_tracer_provider(trace_provider, metadata=metadata)
    return trace_provider, clients


# Upper bound for a tool result handed to the model. searchLangfuseDocs
# returns the full text of every matching page (about 60 KB / 15k tokens);
# GPT-Live's session context is capped at 8k tokens, so an uncompacted
# result never reaches the backend model and the agent keeps "waiting on
# the docs". Roughly 1.5k tokens leaves room for the conversation itself.
MAX_TOOL_RESULT_CHARS = 6000
MAX_CHARS_PER_DOC = 1200
MAX_DOCS = 5


def _truncate(text: str, limit: int) -> str:
    """Cut at the last word or line boundary before ``limit``."""
    if len(text) <= limit:
        return text
    cut = text[:limit]
    boundary = max(cut.rfind("\n"), cut.rfind(" "))
    if boundary > 0:
        cut = cut[:boundary]
    return cut.rstrip(" ,;:-") + " …"


def _clean_excerpt(text: str, limit: int) -> str:
    """Plain, readable text for the model: drop images and link URLs, keep
    line breaks, collapse repeated whitespace, and cut at a word boundary."""
    # images carry nothing a spoken answer can use
    text = re.sub(r"!\[[^\]]*\]\([^)]*\)", "", text)
    # [label](url) -> label; the model speaks, it does not click
    text = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n\s*\n+", "\n", text).strip()
    return _truncate(text, limit)


def _compact_docs_tool_result(ctx: mcp.MCPToolResultContext) -> str:
    """Reduce a Langfuse docs MCP result to what a voice answer needs."""
    raw = "\n".join(
        c.text for c in ctx.result.content if getattr(c, "type", None) == "text"
    )
    if ctx.tool_name == "searchLangfuseDocs":
        try:
            docs = json.loads(raw).get("content", [])
        except (json.JSONDecodeError, AttributeError):
            docs = None
        if isinstance(docs, list):
            parts = []
            for doc in docs[:MAX_DOCS]:
                if not isinstance(doc, dict):
                    continue
                source = doc.get("source") or {}
                body = "\n".join(
                    part.get("text", "")
                    for part in source.get("content", [])
                    if isinstance(part, dict)
                )
                body = _clean_excerpt(body, MAX_CHARS_PER_DOC)
                parts.append(f"## {doc.get('title', '')} ({doc.get('url', '')})\n{body}")
            if parts:
                # each part is already clean; only cap the total so the blank
                # line between documents survives
                return _truncate("\n\n".join(parts), MAX_TOOL_RESULT_CHARS)
    return _clean_excerpt(raw, MAX_TOOL_RESULT_CHARS)


# client_session_timeout_seconds defaults to 5s, which the RAG-backed
# searchLangfuseDocs tool regularly exceeds (the MCP client then reports
# "An internal error occurred" to the LLM).
LANGFUSE_DOCS_MCP = mcp.MCPServerHTTP(
    url="https://langfuse.com/api/mcp",
    client_session_timeout_seconds=30,
    # The voice agent answers questions; it should not file feedback.
    allowed_tools=["searchLangfuseDocs", "getLangfuseDocsPage", "getLangfuseOverview"],
    tool_result_resolver=_compact_docs_tool_result,
)


INSTRUCTIONS = (
    "Your name is {name}. You are a friendly voice assistant for Langfuse, "
    "an open-source LLM observability platform. Keep responses brief and conversational. "
    "When the user asks about Langfuse features, integrations, SDKs, pricing, or usage, "
    "use the Langfuse docs tools to find accurate information before answering. "
    "You are speaking out loud: never read out code snippets, commands, URLs, "
    "or markdown. Describe what the code does in plain words instead and point "
    "the user to the relevant docs page by name if they need the exact code."
)

GREETING = (
    "Greet the user in one short, friendly sentence and say you can answer "
    "questions about Langfuse using the docs. Do not list example topics."
)

# VOICE_AGENT_MODE selects the agent: "gpt-live" (default) runs the OpenAI
# GPT-Live speech-to-speech model, "pipeline" runs the cascaded STT -> LLM -> TTS
# pipeline on LiveKit inference (no OpenAI key required). Keep the pipeline as a
# fallback in case GPT-Live is unavailable.
VOICE_AGENT_MODE = os.getenv("VOICE_AGENT_MODE", "gpt-live").strip().lower()
if VOICE_AGENT_MODE not in ("gpt-live", "pipeline"):
    raise ValueError(
        f"invalid VOICE_AGENT_MODE={VOICE_AGENT_MODE!r}, expected 'gpt-live' or 'pipeline'"
    )


class Marin(Agent):
    """Speech-to-speech agent on OpenAI GPT-Live.

    GPT-Live is a full-duplex voice model: the voice model handles listening,
    turn taking, and speaking while a backend Responses model (configured via
    ``responses_options``) handles reasoning and tool calls, including the
    Langfuse docs MCP tools registered on the AgentSession. No separate STT, TTS,
    or VAD is needed. Requires OPENAI_API_KEY with GPT-Live access.
    """

    def __init__(self) -> None:
        super().__init__(
            instructions=INSTRUCTIONS.format(name="Marin"),
            llm=GPTLiveModel(
                voice=os.getenv("GPT_LIVE_VOICE", "marin"),
                responses_options={
                    "model": os.getenv("GPT_LIVE_RESPONSES_MODEL", "gpt-5.6-luna"),
                    "instructions": (
                        "You answer questions about Langfuse for a voice assistant. "
                        "Use the Langfuse docs tools whenever the user asks about "
                        "features, integrations, SDKs, pricing, or usage. Keep answers "
                        "short and spoken-word friendly: no markdown, no lists, no URLs, "
                        "and no code snippets or commands. Describe what code does in "
                        "plain words and name the relevant docs page instead."
                    ),
                    "reasoning": {"effort": "low"},
                    "text": {"verbosity": "low"},
                },
            ),
        )

    async def on_enter(self):
        logger.info("Marin is entering the session")
        # GPT-Live treats generate_reply() as refused if the model has not
        # started speaking within 10s, so keep the greeting instruction short.
        self.session.generate_reply(instructions=GREETING)


class Kelly(Agent):
    """Cascaded STT -> LLM -> TTS agent on LiveKit inference with provider fallbacks."""

    def __init__(self) -> None:
        super().__init__(
            instructions=INSTRUCTIONS.format(name="Kelly"),
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
        self.session.generate_reply(instructions=GREETING)


server = AgentServer()

@dataclass
class _ConversationContext:
    """Per-room state shared between the entrypoint and on_session_end."""

    root_span: otel_trace.Span
    tracer: otel_trace.Tracer
    langfuse_clients: list[Langfuse]
    session: AgentSession
    store_audio: bool
    root_ended: bool = False


_conversations: dict[str, _ConversationContext] = {}


def _transcript_messages(session: AgentSession) -> list[dict[str, str]]:
    """The conversation as chat messages (system prompt excluded)."""
    return [
        {"role": item.role, "content": item.text_content or ""}
        for item in session.history.items
        if item.type == "message" and item.role in ("user", "assistant")
    ]


def _set_transcript(span: otel_trace.Span, messages: list[dict[str, str]]) -> None:
    """Put the transcript on a span as Langfuse input/output."""
    if not messages:
        return
    last = messages[-1]
    if last["role"] == "assistant":
        span.set_attribute("langfuse.observation.input", json.dumps(messages[:-1]))
        span.set_attribute("langfuse.observation.output", last["content"])
    else:
        span.set_attribute("langfuse.observation.input", json.dumps(messages))


def _end_root_span(conversation: _ConversationContext) -> None:
    """End the root observation with the transcript. Idempotent."""
    if conversation.root_ended:
        return
    conversation.root_ended = True
    _set_transcript(conversation.root_span, _transcript_messages(conversation.session))
    conversation.root_span.end()


async def _upload_recording(
    client: Langfuse,
    *,
    trace_id: str,
    observation_id: str,
    audio_bytes: bytes,
    sha256: str,
) -> None:
    """Upload the recording to one region through the Langfuse media API."""
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
        logger.exception("failed to upload recording to %s", client._base_url)


async def on_session_end(ctx: JobContext) -> None:
    """Attach the session recording once LiveKit has finalized it.

    The root observation was already ended (with the transcript) when the
    agent session closed, so the conversation is complete in Langfuse without
    waiting for LiveKit's teardown. This callback runs after that teardown and
    adds a `session-recording` child observation carrying the stereo OGG
    written by `record={"audio": True}` plus a copy of the transcript. The file
    is uploaded to every configured region through the Langfuse media API (the
    media ID is derived from the file's SHA-256 client-side, so the reference
    is identical in every region).
    """
    conversation = _conversations.pop(ctx.room.name, None)
    if conversation is None:
        return
    _end_root_span(conversation)  # in case the close event never fired

    if not conversation.store_audio:
        logger.info("audio recording disabled for this session")
        return
    audio_path = ctx.session_directory / "audio.ogg"
    if not audio_path.exists():
        logger.warning("no session recording found at %s", audio_path)
        return

    audio_bytes = audio_path.read_bytes()
    recording = LangfuseMedia(content_bytes=audio_bytes, content_type="audio/ogg")

    # Child of the (already ended) root span so it lands in the same trace.
    recording_span = conversation.tracer.start_span(
        "session-recording",
        context=otel_trace.set_span_in_context(conversation.root_span),
    )
    recording_span.set_attribute("langfuse.observation.type", "event")
    _set_transcript(recording_span, _transcript_messages(conversation.session))
    # The media reference renders as an audio player once the file is uploaded.
    recording_span.set_attribute(
        "langfuse.observation.metadata.recording", recording._reference_string
    )
    recording_span.end()

    span_context = recording_span.get_span_context()
    trace_id = format(span_context.trace_id, "032x")
    observation_id = format(span_context.span_id, "016x")

    await asyncio.gather(
        *(
            _upload_recording(
                client,
                trace_id=trace_id,
                observation_id=observation_id,
                audio_bytes=audio_bytes,
                sha256=recording._content_sha256_hash,
            )
            for client in conversation.langfuse_clients
        )
    )
    logger.info("attached session recording to trace %s", trace_id)

    await asyncio.gather(
        *(asyncio.to_thread(client.flush) for client in conversation.langfuse_clients)
    )


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

    # GPT-Live is full-duplex and manages turn taking itself; the cascaded
    # pipeline needs VAD for end-of-turn and interruption detection.
    session = AgentSession(
        vad=silero.VAD.load() if VOICE_AGENT_MODE == "pipeline" else None,
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
    # is created without an explicit OTel context, so it nests under this span.
    #
    # The span is created with a plain OTel tracer (NOT a Langfuse client): the
    # LangfuseSpanProcessor only exports SDK-created spans to the project of
    # the client that created them, so in this multi-region setup a raw span is
    # the only kind that all regions' processors export.
    tracer = trace_provider.get_tracer("voice-agent")
    root_span = tracer.start_span("voice-conversation")
    conversation = _conversations[ctx.room.name] = _ConversationContext(
        root_span=root_span,
        tracer=tracer,
        langfuse_clients=langfuse_clients,
        session=session,
        store_audio=store_audio,
    )

    # End the root observation as soon as the conversation is over, with the
    # full transcript as input/output. LiveKit's teardown and the recording
    # upload (on_session_end) take another 20-30s and must not hold it back.
    @session.on("close")
    def _on_session_close(_ev) -> None:
        _end_root_span(conversation)

    with otel_trace.use_span(root_span, end_on_exit=False):  # ended on session close
        await session.start(
            agent=Kelly() if VOICE_AGENT_MODE == "pipeline" else Marin(),
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

        # Tell the demo UI which trace this conversation lands in so it can
        # show a "View trace in Langfuse" link while the call is running.
        root_context = root_span.get_span_context()
        await ctx.room.local_participant.publish_data(
            json.dumps(
                {
                    "type": "trace",
                    "traceId": format(root_context.trace_id, "032x"),
                    "observationId": format(root_context.span_id, "016x"),
                }
            ).encode(),
            reliable=True,
            topic="langfuse",
        )

        # Audible cue while the agent is thinking or calling the docs tools, so
        # slower turns (e.g. RAG searches) don't feel like dead air. In the
        # cascaded pipeline this covers the whole LLM turn; with GPT-Live the
        # session enters "thinking" while backend tool calls are running, so
        # the cue plays during docs lookups. It is a separate audio track, so
        # it can overlap with the model's own speech; keep the volume low.
        background_audio = BackgroundAudioPlayer(
            thinking_sound=[
                AudioConfig(BuiltinAudioClip.KEYBOARD_TYPING, volume=0.5),
                AudioConfig(BuiltinAudioClip.KEYBOARD_TYPING2, volume=0.4),
            ],
        )
        await background_audio.start(room=ctx.room, agent_session=session)


if __name__ == "__main__":
    cli.run_app(server)
