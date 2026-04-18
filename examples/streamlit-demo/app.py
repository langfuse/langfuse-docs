from dotenv import load_dotenv
from langfuse import get_client, observe
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

for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

if prompt := st.chat_input("Say something"):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    with st.chat_message("assistant"):
        reply = generate_reply(st.session_state.messages)
        st.markdown(reply)
        st.session_state.messages.append({"role": "assistant", "content": reply})
