# Streamlit × Langfuse Demo

A minimal LLM chat app built with [Streamlit](https://streamlit.io/) and instrumented end-to-end with [Langfuse](https://langfuse.com). This is the runnable companion to the [Streamlit integration guide](https://langfuse.com/integrations/other/streamlit) — the guide walks through the code topic by topic, this folder lets you run it locally in one command.

## How it works

- Streaming chat UI via `st.write_stream` and Streamlit's chat elements
- Langfuse tracing for every reply through the `@observe` decorator and the `langfuse.openai` SDK wrapper
- Anthropic calls are auto-instrumented via OpenTelemetry using `AnthropicInstrumentor`
- [Sessions](https://langfuse.com/docs/tracing-features/sessions) scoped per browser tab, plus sidebar-driven [user identification](https://langfuse.com/docs/tracing-features/users)
- Thumbs-up / thumbs-down [user-feedback scores](https://langfuse.com/docs/scores/user-feedback) attached to the trace id captured during streaming
- Model switcher routing between OpenAI (`gpt-4o-mini`) and Anthropic (`claude-sonnet-4-6`), with the provider tagged on every trace

## Setup

```bash
cd examples/streamlit-demo
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Fill in `.env` with your Langfuse project keys (from [Langfuse Cloud](https://cloud.langfuse.com) or a [self-hosted](https://langfuse.com/self-hosting) instance) and at least one provider key.

## Run

```bash
streamlit run app.py
```

Open `http://localhost:8501`, set a name in the sidebar, pick a model, and start chatting. Traces, sessions, users, and feedback scores populate in your Langfuse project immediately.
