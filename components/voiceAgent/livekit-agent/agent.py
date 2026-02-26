import asyncio
import base64
import json
import os
import urllib.parse
import urllib.request

from livekit import agents
from livekit.agents import AgentServer, AgentSession, Agent, RunContext, function_tool
from livekit.agents.telemetry import set_tracer_provider
from livekit.plugins import openai


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
            instructions=(
                "You are a friendly voice assistant for Langfuse, an open-source LLM observability platform. "
                "Keep responses brief and conversational. "
                "When the user asks about Langfuse features, integrations, SDKs, pricing, or usage, "
                "use the search_langfuse_docs tool to find accurate information before answering."
            ),
        )

    @function_tool()
    async def search_langfuse_docs(
        self,
        context: RunContext,
        query: str,
    ) -> str:
        """Search the Langfuse documentation to answer questions about Langfuse features, integrations, SDKs, and usage.

        Args:
            query: The search query about Langfuse
        """
        encoded_query = urllib.parse.quote(query)
        url = f"https://langfuse.com/api/search-docs?query={encoded_query}"

        def _fetch():
            req = urllib.request.Request(url, headers={"Accept": "application/json"})
            with urllib.request.urlopen(req, timeout=10) as response:
                return response.read().decode()

        try:
            raw = await asyncio.to_thread(_fetch)
            data = json.loads(raw)
            answer = data.get("answer", "")
            if isinstance(answer, str):
                try:
                    parsed = json.loads(answer)
                    chunks = []
                    for item in parsed.get("content", []):
                        source = item.get("source", {})
                        for block in source.get("content", []):
                            if block.get("type") == "text":
                                chunks.append(block["text"][:500])
                        if len(chunks) >= 3:
                            break
                    return "\n\n".join(chunks) if chunks else answer[:2000]
                except (json.JSONDecodeError, TypeError):
                    return answer[:2000]
            return str(answer)[:2000]
        except Exception as e:
            return f"Could not search documentation: {e}"


server = AgentServer()


@server.rtc_session()
async def entrypoint(ctx: agents.JobContext):
    setup_langfuse()

    session = AgentSession(
        llm=openai.realtime.RealtimeModel(voice="alloy"),
    )

    await session.start(
        room=ctx.room,
        agent=Assistant(),
    )

    await session.generate_reply(
        instructions="Greet the user and offer your assistance. Always respond in English."
    )


if __name__ == "__main__":
    agents.cli.run_app(server)
