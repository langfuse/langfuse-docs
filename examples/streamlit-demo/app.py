import atexit
import uuid

from anthropic import Anthropic
from dotenv import load_dotenv
from langfuse import get_client, observe, propagate_attributes
from langfuse.openai import OpenAI
from opentelemetry.instrumentation.anthropic import AnthropicInstrumentor
import streamlit as st

load_dotenv()

MODELS = {
    "gpt-4o-mini": "openai",
    "claude-sonnet-4-6": "anthropic",
}


@st.cache_resource
def init_langfuse():
    client = get_client()
    if client.auth_check():
        print("Langfuse client authenticated")
    else:
        print("Langfuse authentication failed — check LANGFUSE_PUBLIC_KEY / LANGFUSE_SECRET_KEY / LANGFUSE_BASE_URL")
    atexit.register(client.flush)
    return client


@st.cache_resource
def init_anthropic_instrumentor():
    AnthropicInstrumentor().instrument()


langfuse = init_langfuse()
init_anthropic_instrumentor()
openai_client = OpenAI()
anthropic_client = Anthropic()


def _stream_openai(messages, model):
    stream = openai_client.chat.completions.create(
        model=model,
        messages=messages,
        stream=True,
        stream_options={"include_usage": True},
    )
    for chunk in stream:
        if not chunk.choices:
            continue
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta


def _stream_anthropic(messages, model):
    stream = anthropic_client.messages.create(
        model=model,
        max_tokens=1024,
        messages=messages,
        stream=True,
    )
    for event in stream:
        if event.type == "content_block_delta":
            yield event.delta.text


@observe()
def stream_reply(messages, model, trace_holder):
    trace_holder.append(langfuse.get_current_trace_id())
    if MODELS[model] == "openai":
        yield from _stream_openai(messages, model)
    else:
        yield from _stream_anthropic(messages, model)


st.title("Streamlit × Langfuse Demo")

if "messages" not in st.session_state:
    st.session_state.messages = []

if "session_id" not in st.session_state:
    st.session_state.session_id = str(uuid.uuid4())

if "user_id" not in st.session_state:
    st.session_state.user_id = "anonymous"

if "model" not in st.session_state:
    st.session_state.model = "gpt-4o-mini"

with st.sidebar:
    name = st.text_input(
        "Your name",
        value="" if st.session_state.user_id == "anonymous" else st.session_state.user_id,
    )
    st.session_state.user_id = name.strip() or "anonymous"

    st.session_state.model = st.selectbox(
        "Model",
        list(MODELS.keys()),
        index=list(MODELS.keys()).index(st.session_state.model),
    )

    if st.button("New conversation"):
        st.session_state.messages = []
        st.session_state.session_id = str(uuid.uuid4())
        st.rerun()

if "scored_traces" not in st.session_state:
    st.session_state.scored_traces = set()


def score_trace(trace_id: str, value: str):
    langfuse.create_score(
        trace_id=trace_id,
        name="user-feedback",
        value=value,
        data_type="CATEGORICAL",
    )
    langfuse.flush()
    st.session_state.scored_traces.add(trace_id)


for idx, msg in enumerate(st.session_state.messages):
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])
        if msg["role"] == "assistant" and msg.get("trace_id"):
            trace_id = msg["trace_id"]
            if trace_id in st.session_state.scored_traces:
                st.caption("Thanks for the feedback!")
            else:
                up, down, _ = st.columns([1, 1, 10])
                if up.button("👍", key=f"up_{idx}"):
                    score_trace(trace_id, "positive")
                    st.rerun()
                if down.button("👎", key=f"down_{idx}"):
                    score_trace(trace_id, "negative")
                    st.rerun()

if prompt := st.chat_input("Say something"):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    with st.chat_message("assistant"):
        trace_holder = []
        with propagate_attributes(
            session_id=st.session_state.session_id,
            user_id=st.session_state.user_id,
            tags=[MODELS[st.session_state.model]],
        ):
            reply = st.write_stream(
                stream_reply(
                    st.session_state.messages,
                    st.session_state.model,
                    trace_holder,
                )
            )
        st.session_state.messages.append(
            {"role": "assistant", "content": reply, "trace_id": trace_holder[0]}
        )
        st.rerun()
