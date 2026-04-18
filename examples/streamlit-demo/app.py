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
def generate_reply(messages):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
    )
    return response.choices[0].message.content


st.title("Streamlit × Langfuse Demo")

if "messages" not in st.session_state:
    st.session_state.messages = []

if "session_id" not in st.session_state:
    st.session_state.session_id = str(uuid.uuid4())

with st.sidebar:
    if st.button("New conversation"):
        st.session_state.messages = []
        st.session_state.session_id = str(uuid.uuid4())
        st.rerun()

for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

if prompt := st.chat_input("Say something"):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    with st.chat_message("assistant"):
        with propagate_attributes(session_id=st.session_state.session_id):
            reply = generate_reply(st.session_state.messages)
        st.markdown(reply)
        st.session_state.messages.append({"role": "assistant", "content": reply})
