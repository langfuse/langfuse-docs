# Streamlit × Langfuse Demo

Minimal chat app that will be layered with [Langfuse](https://langfuse.com) observability across subsequent commits. This commit only ships the baseline: a plain OpenAI-backed chat interface.

## Prerequisites

- Python 3.10+
- An [OpenAI API key](https://platform.openai.com/api-keys)

## Setup

```bash
cd examples/streamlit-demo
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Then open `.env` and fill in `OPENAI_API_KEY`. The Langfuse keys stay as placeholders until later commits wire up tracing.

## Run

```bash
streamlit run app.py
```

The app starts at `http://localhost:8501`. Type a message and the assistant replies using `gpt-4o-mini`.
