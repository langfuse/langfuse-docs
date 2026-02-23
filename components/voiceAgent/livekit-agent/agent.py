import base64
import os

from livekit import agents
from livekit.agents import AgentServer, AgentSession, Agent
from livekit.agents.telemetry import set_tracer_provider
from livekit.plugins import openai, silero


def setup_langfuse():
    from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
    from opentelemetry.sdk.trace import TracerProvider, SpanProcessor
    from opentelemetry.sdk.trace.export import BatchSpanProcessor

    public_key = os.getenv("LANGFUSE_PUBLIC_KEY")
    secret_key = os.getenv("LANGFUSE_SECRET_KEY")
    host = os.getenv("LANGFUSE_BASE_URL")

    if not public_key or not secret_key or not host:
        print("Warning: Langfuse env vars not set, tracing disabled")
        return

    langfuse_auth = base64.b64encode(f"{public_key}:{secret_key}".encode()).decode()
    os.environ["OTEL_EXPORTER_OTLP_ENDPOINT"] = f"{host.rstrip('/')}/api/public/otel"
    os.environ["OTEL_EXPORTER_OTLP_HEADERS"] = f"Authorization=Basic {langfuse_auth}"

    class LangfuseAttributeSpanProcessor(SpanProcessor):
        """Adds Langfuse trace attributes to every span."""

        def on_start(self, span, parent_context=None):
            span.set_attribute("langfuse.trace.name", "livekit-voice-agent")
            span.set_attribute("langfuse.trace.tags", ["voice-agent"])

        def on_end(self, span):
            pass

    trace_provider = TracerProvider()
    trace_provider.add_span_processor(LangfuseAttributeSpanProcessor())
    trace_provider.add_span_processor(BatchSpanProcessor(OTLPSpanExporter()))
    set_tracer_provider(trace_provider)


class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions="You are a friendly voice assistant for Langfuse, an open-source LLM observability platform. Keep responses brief and conversational.",
        )


server = AgentServer()


@server.rtc_session()
async def entrypoint(ctx: agents.JobContext):
    setup_langfuse()

    session = AgentSession(
        vad=silero.VAD.load(),
        stt=openai.STT(model="gpt-4o-mini-transcribe"),
        llm=openai.LLM(model="gpt-4o-mini"),
        tts=openai.TTS(model="gpt-4o-mini-tts"),
    )

    await session.start(
        room=ctx.room,
        agent=Assistant(),
    )

    await session.generate_reply(
        instructions="Greet the user and offer your assistance."
    )


if __name__ == "__main__":
    agents.cli.run_app(server)
