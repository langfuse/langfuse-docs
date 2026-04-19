import atexit
import uuid

from dotenv import load_dotenv
from langfuse import get_client, observe, propagate_attributes
from langfuse.openai import OpenAI
import streamlit as st

load_dotenv()


@st.cache_resource
def init_langfuse():
    client = get_client()
    if client.auth_check():
        print("Langfuse client authenticated")
    else:
        print("Langfuse authentication failed — check LANGFUSE_PUBLIC_KEY / LANGFUSE_SECRET_KEY / LANGFUSE_BASE_URL")
    atexit.register(client.flush)
    return client


langfuse = init_langfuse()
client = OpenAI()


@observe()
def stream_reply(messages, trace_holder):
    trace_holder.append(langfuse.get_current_trace_id())
    stream = client.chat.completions.create(
        model="gpt-4o-mini",
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


st.title("Streamlit × Langfuse Demo")

if "messages" not in st.session_state:
    st.session_state.messages = []

if "session_id" not in st.session_state:
    st.session_state.session_id = str(uuid.uuid4())

if "user_id" not in st.session_state:
    st.session_state.user_id = "anonymous"

with st.sidebar:
    name = st.text_input(
        "Your name",
        value="" if st.session_state.user_id == "anonymous" else st.session_state.user_id,
    )
    st.session_state.user_id = name.strip() or "anonymous"

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
        ):
            reply = st.write_stream(
                stream_reply(st.session_state.messages, trace_holder)
            )
        st.session_state.messages.append(
            {"role": "assistant", "content": reply, "trace_id": trace_holder[0]}
        )
        st.rerun()
