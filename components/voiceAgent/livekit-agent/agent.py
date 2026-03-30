import logging
import os

from dotenv import load_dotenv
from langfuse import Langfuse
from opentelemetry.sdk.trace import TracerProvider
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


def setup_langfuse(
    metadata: dict[str, AttributeValue] | None = None,
) -> TracerProvider:
    from opentelemetry.sdk.trace import SpanProcessor

    eu_host = os.getenv("NEXT_PUBLIC_EU_LANGFUSE_BASE_URL")
    eu_public_key = os.getenv("NEXT_PUBLIC_EU_LANGFUSE_PUBLIC_KEY")
    eu_secret_key = os.getenv("EU_LANGFUSE_SECRET_KEY")

    us_host = os.getenv("NEXT_PUBLIC_US_LANGFUSE_BASE_URL")
    us_public_key = os.getenv("NEXT_PUBLIC_US_LANGFUSE_PUBLIC_KEY")
    us_secret_key = os.getenv("US_LANGFUSE_SECRET_KEY")

    jp_host = os.getenv("NEXT_PUBLIC_JP_LANGFUSE_BASE_URL")
    jp_public_key = os.getenv("NEXT_PUBLIC_JP_LANGFUSE_PUBLIC_KEY")
    jp_secret_key = os.getenv("JP_LANGFUSE_SECRET_KEY")

    if not all([eu_host, eu_public_key, eu_secret_key]):
        raise ValueError("EU Langfuse env vars must be set: NEXT_PUBLIC_EU_LANGFUSE_BASE_URL, NEXT_PUBLIC_EU_LANGFUSE_PUBLIC_KEY, EU_LANGFUSE_SECRET_KEY")
    if not all([us_host, us_public_key, us_secret_key]):
        raise ValueError("US Langfuse env vars must be set: NEXT_PUBLIC_US_LANGFUSE_BASE_URL, NEXT_PUBLIC_US_LANGFUSE_PUBLIC_KEY, US_LANGFUSE_SECRET_KEY")
    if not all([jp_host, jp_public_key, jp_secret_key]):
        raise ValueError("JP Langfuse env vars must be set: NEXT_PUBLIC_JP_LANGFUSE_BASE_URL, NEXT_PUBLIC_JP_LANGFUSE_PUBLIC_KEY, JP_LANGFUSE_SECRET_KEY")

    class LangfuseAttributeSpanProcessor(SpanProcessor):
        """Adds Langfuse trace attributes to every span."""

        def on_start(self, span, parent_context=None):
            span.set_attribute("langfuse.trace.name", "livekit-voice-agent")
            span.set_attribute("langfuse.trace.tags", ["voice-agent"])

        def on_end(self, span):
            pass

    trace_provider = TracerProvider()
    trace_provider.add_span_processor(LangfuseAttributeSpanProcessor())

    # Initialize a Langfuse client per region. Each call registers a LangfuseSpanProcessor
    # on the shared TracerProvider, handling batching/auth/export to the respective region.
    # should_export_span=lambda span: True bypasses the default LLM-only filter so that
    # all LiveKit agent spans (STT, TTS, LLM, turn detection, etc.) are captured.
    for host, public_key, secret_key in [
        (eu_host, eu_public_key, eu_secret_key),
        (us_host, us_public_key, us_secret_key),
        (jp_host, jp_public_key, jp_secret_key),
    ]:
        Langfuse(
            public_key=public_key,
            secret_key=secret_key,
            base_url=host,
            tracer_provider=trace_provider,
            should_export_span=lambda span: True,
        )

    set_tracer_provider(trace_provider, metadata=metadata)
    return trace_provider


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
                    inference.STT(
                        "deepgram/nova-3",
                        extra_kwargs={
                            "keyterms": [
                                # Langfuse
                                "Langfuse",
                                # Observability concepts
                                "OpenTelemetry",
                                "OTEL",
                                "LLM-as-a-Judge",
                                # Native SDKs
                                "LiteLLM",
                                # Frameworks
                                "LangChain",
                                "LangGraph",
                                "LangServe",
                                "LlamaIndex",
                                "Vercel AI SDK",
                                "Google ADK",
                                "Pydantic AI",
                                "OpenAI Agents",
                                "Claude Agent SDK",
                                "CrewAI",
                                "DSPy",
                                "Haystack",
                                "Instructor",
                                "AutoGen",
                                "SmolAgents",
                                "Semantic Kernel",
                                "Spring AI",
                                "Strands Agents",
                                "Swiftide",
                                "Mastra",
                                "Mirascope",
                                "Pipecat",
                                "LiveKit",
                                "Agno",
                                "VoltAgent",
                                "Embabel",
                                "Koog",
                                # Model providers
                                "Anthropic",
                                "DeepSeek",
                                "Groq",
                                "Cerebras",
                                "Fireworks AI",
                                "Together AI",
                                "Cohere",
                                "Mistral",
                                "Ollama",
                                "vLLM",
                                "xAI Grok",
                                "Hugging Face",
                                "Amazon Bedrock",
                                "Google Gemini",
                                "Google Vertex AI",
                                # Gateways
                                "OpenRouter",
                                "Portkey",
                                "Helicone",
                                # No-code
                                "Flowise",
                                "Langflow",
                                "LobeChat",
                                "OpenWebUI",
                                "Ragflow",
                                "Vapi",
                                "Dify",
                                # Other integrations
                                "PostHog",
                                "Ragas",
                                "Promptfoo",
                                "Firecrawl",
                                "Cognee",
                                "Milvus",
                            ],
                        },
                    ),
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


@server.rtc_session()
async def entrypoint(ctx: JobContext):
    # set up the langfuse tracer
    trace_provider = setup_langfuse(
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

    await session.start(agent=Kelly(), room=ctx.room)


if __name__ == "__main__":
    cli.run_app(server)
