# Langfuse × Pydantic AI – Agent Evals 

## 1. Setup – install packages & add credentials


```python
# If you are running this on colab/@home comment‑out what you already have
%pip install -q --upgrade "pydantic-ai[mcp]" langfuse openai nest_asyncio aiohttp
```

    Note: you may need to restart the kernel to use updated packages.



```python
import os

# Get keys for your project from the project settings page
# https://cloud.langfuse.com
os.environ["LANGFUSE_PUBLIC_KEY"] = ""
os.environ["LANGFUSE_SECRET_KEY"] = ""
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region

# Your openai key
os.environ["OPENAI_API_KEY"] = ""
```

## 2. Enable Langfuse Tracing

All integrations: https://langfuse.com/integrations


```python
from langfuse import get_client
from pydantic_ai.agent import Agent

# Initialise Langfuse client and verify connectivity
langfuse = get_client()
assert langfuse.auth_check(), "Langfuse auth failed - check your keys ✋"

# Turn on OpenTelemetry instrumentation for *all* future Agent instances
Agent.instrument_all()
print("✅ Pydantic AI instrumentation enabled - traces will stream to Langfuse")
```

    ✅ Pydantic AI instrumentation enabled - traces will stream to Langfuse


## Mock tool response


```python
overview= """
# Langfuse

> Langfuse is an **open-source LLM engineering platform** ([GitHub](https://github.com/langfuse/langfuse)) that helps teams collaboratively debug, analyze, and iterate on their LLM applications. All platform features are natively integrated to accelerate the development workflow.

## Langfuse Docs MCP Server

Connect to the Langfuse Docs MCP server to access documentation directly in your AI editor:

- **Endpoint**: `https://langfuse.com/api/mcp`
- **Transport**: `streamableHttp`
- **Documentation**: [Langfuse Docs MCP Server](https://langfuse.com/docs/docs-mcp)

The MCP server provides tools to search Langfuse documentation, GitHub issues, and discussions. See the [installation guide](https://langfuse.com/docs/docs-mcp) for setup instructions in Cursor, VS Code, Claude Desktop, and other MCP clients.

## Docs

- [Docs](https://langfuse.com/docs)
- [Custom Dashboards](https://langfuse.com/docs/analytics/custom-dashboards)
- [Example Intent Classification](https://langfuse.com/docs/analytics/example-intent-classification)
- [Metrics Api](https://langfuse.com/docs/analytics/metrics-api)
- [Overview](https://langfuse.com/docs/analytics/overview)
- [Api](https://langfuse.com/docs/api)
- [Ask Ai](https://langfuse.com/docs/ask-ai)
- [Audit Logs](https://langfuse.com/docs/audit-logs)
- [Core Features](https://langfuse.com/docs/core-features)
- [Data Deletion](https://langfuse.com/docs/data-deletion)
- [Data Retention](https://langfuse.com/docs/data-retention)
- [Example Synthetic Datasets](https://langfuse.com/docs/datasets/example-synthetic-datasets)
- [Get Started](https://langfuse.com/docs/datasets/get-started)
- [Overview](https://langfuse.com/docs/datasets/overview)
- [Prompt Experiments](https://langfuse.com/docs/datasets/prompt-experiments)
- [Python Cookbook](https://langfuse.com/docs/datasets/python-cookbook)
- [Demo](https://langfuse.com/docs/demo)
- [Docs Mcp](https://langfuse.com/docs/docs-mcp)
- [Fine Tuning](https://langfuse.com/docs/fine-tuning)
- [Get Started](https://langfuse.com/docs/get-started)
- [Model Usage And Cost](https://langfuse.com/docs/model-usage-and-cost)
- [Example Arize](https://langfuse.com/docs/opentelemetry/example-arize)
- [Example Mlflow](https://langfuse.com/docs/opentelemetry/example-mlflow)
- [Example Openlit](https://langfuse.com/docs/opentelemetry/example-openlit)
- [Example Openllmetry](https://langfuse.com/docs/opentelemetry/example-openllmetry)
- [Example Python Sdk](https://langfuse.com/docs/opentelemetry/example-python-sdk)
- [Get Started](https://langfuse.com/docs/opentelemetry/get-started)
- [Playground](https://langfuse.com/docs/playground)
- [A B Testing](https://langfuse.com/docs/prompts/a-b-testing)
- [Example Langchain](https://langfuse.com/docs/prompts/example-langchain)
- [Example Langchain Js](https://langfuse.com/docs/prompts/example-langchain-js)
- [Example Openai Functions](https://langfuse.com/docs/prompts/example-openai-functions)
- [Get Started](https://langfuse.com/docs/prompts/get-started)
- [Mcp Server](https://langfuse.com/docs/prompts/mcp-server)
- [N8n Node](https://langfuse.com/docs/prompts/n8n-node)
- [Query Traces](https://langfuse.com/docs/query-traces)
- [Rbac](https://langfuse.com/docs/rbac)
- [Roadmap](https://langfuse.com/docs/roadmap)
- [Annotation](https://langfuse.com/docs/scores/annotation)
- [Custom](https://langfuse.com/docs/scores/custom)
- [Data Model](https://langfuse.com/docs/scores/data-model)
- [External Evaluation Pipelines](https://langfuse.com/docs/scores/external-evaluation-pipelines)
- [Model Based Evals](https://langfuse.com/docs/scores/model-based-evals)
- [Overview](https://langfuse.com/docs/scores/overview)
- [User Feedback](https://langfuse.com/docs/scores/user-feedback)
- [Overview](https://langfuse.com/docs/sdk/overview)
- [Decorators](https://langfuse.com/docs/sdk/python/decorators)
- [Example](https://langfuse.com/docs/sdk/python/example)
- [Low Level Sdk](https://langfuse.com/docs/sdk/python/low-level-sdk)
- [Sdk V3](https://langfuse.com/docs/sdk/python/sdk-v3)
- [Example Notebook](https://langfuse.com/docs/sdk/typescript/example-notebook)
- [Guide](https://langfuse.com/docs/sdk/typescript/guide)
- [Guide Web](https://langfuse.com/docs/sdk/typescript/guide-web)
- [Example Python](https://langfuse.com/docs/security/example-python)
- [Getting Started](https://langfuse.com/docs/security/getting-started)
- [Overview](https://langfuse.com/docs/security/overview)
- [Tracing](https://langfuse.com/docs/tracing)
- [Tracing Data Model](https://langfuse.com/docs/tracing-data-model)
- [Agent Graphs](https://langfuse.com/docs/tracing-features/agent-graphs)
- [Comments](https://langfuse.com/docs/tracing-features/comments)
- [Environments](https://langfuse.com/docs/tracing-features/environments)
- [Log Levels](https://langfuse.com/docs/tracing-features/log-levels)
- [Masking](https://langfuse.com/docs/tracing-features/masking)
- [Metadata](https://langfuse.com/docs/tracing-features/metadata)
- [Multi Modality](https://langfuse.com/docs/tracing-features/multi-modality)
- [Releases And Versioning](https://langfuse.com/docs/tracing-features/releases-and-versioning)
- [Sampling](https://langfuse.com/docs/tracing-features/sampling)
- [Sessions](https://langfuse.com/docs/tracing-features/sessions)
- [Tags](https://langfuse.com/docs/tracing-features/tags)
- [Trace Ids](https://langfuse.com/docs/tracing-features/trace-ids)
- [Url](https://langfuse.com/docs/tracing-features/url)
- [Users](https://langfuse.com/docs/tracing-features/users)
"""
```

## 3. Create an agent that can search the Langfuse docs

We use the Lagfuse Docs MCP Server to provide tools to the agent: https://langfuse.com/docs/docs-mcp


```python
from pydantic_ai import Agent, RunContext
from pydantic_ai.mcp import MCPServerStreamableHTTP, CallToolFunc, ToolResult
from langfuse import observe
from typing import Any

# Public MCP server that exposes Langfuse docs tools
LANGFUSE_MCP_URL = "https://langfuse.com/api/mcp"

@observe
async def run_agent(question: str, system_prompt: str, model="openai:o3-mini"):
    langfuse.update_current_trace(input=question)

    tool_call_history = []

    # Log all tool calls for trajectory analysis
    async def process_tool_call(
        ctx: RunContext[int],
        call_tool: CallToolFunc,
        tool_name: str,
        args: dict[str, Any],
    ) -> ToolResult:
        """A tool call processor that passes along the deps."""
        print(f"MCP Tool call: {tool_name} with args: {args}")
        tool_call_history.append({
            "tool_name": tool_name,
            "args": args
        })
        return await call_tool(tool_name, args)
    
    langfuse_docs_server = MCPServerStreamableHTTP(
        LANGFUSE_MCP_URL,
        process_tool_call=process_tool_call
    )

    agent = Agent(
        model=model,
        mcp_servers=[langfuse_docs_server],
        system_prompt=system_prompt
    )

    async with agent.run_mcp_servers():
        print("\n---")
        print("Q:", question)
        result = await agent.run(question)
        print("A:", result.output)

        langfuse.update_current_trace(
            output=result.output,
            metadata={"tool_call_history": tool_call_history
        })

        return result.output, tool_call_history
```


```python
await run_agent(
    question="What is Langfuse and how does it help monitor LLM applications?",
    system_prompt="You are an expert on Langfuse. Answer user questions accurately and concisely using the available MCP tools. Cite sources when appropriate. Please make sure to use the tools in the best way possible to answer.",
    model="openai:gpt-4.1-nano"
);
```

    
    ---
    Q: What is Langfuse and how does it help monitor LLM applications?
    MCP Tool call: getLangfuseOverview with args: {}
    MCP Tool call: searchLangfuseDocs with args: {'query': 'What is Langfuse and how does it help monitor LLM applications'}
    A: Langfuse is an open-source LLM engineering platform designed to help teams collaboratively debug, analyze, and improve their large language model (LLM) applications. It offers comprehensive features such as tracing, prompt management, evaluation, and monitoring, all integrated to streamline the development workflow. 
    
    It helps monitor LLM applications by providing detailed tracing of LLM interactions, capturing performance metrics like latency and error rates, and allowing for evaluation of output quality over time. Langfuse enables real-time visibility into how models are functioning in production, identifying bottlenecks, errors, or biases, and ultimately ensuring the robustness and reliability of AI systems. It is model-agnostic and supports integration with various frameworks, making it a versatile tool for maintaining and improving LLM applications. 
    
    You can learn more about its capabilities in the [official documentation](https://langfuse.com/docs).


## Evaluation

1. Create Test Cases
    - input
    - reference for reference-based evaluations
2. Set up evaluators
3. Run experiments


```python
tests_cases = [
    {
        "input": {"question": "What is Langfuse?"},
        "expected_output": {
            "response_facts": [
                "Open Source LLM Engineering Platform",
                "Product modules: Tracing, Evaluation and Prompt Management"
            ],
            "trajectory": [
                "getLangfuseOverview"
            ],
        }
    },
    {
        "input": {
            "question": "How to trace a python application with Langfuse?"
        },
        "expected_output": {
            "response_facts": [
                "Python SDK, you can use the observe() decorator",
                "Lots of integrations, LangChain, LlamaIndex, Pydantic AI, and many more."
            ],
            "trajectory": [
                "getLangfuseOverview",
                "searchLangfuseDocs"
            ],
            "search_term": "Python Tracing"
        }
    },
    {
        "input": {"question": "How to connect to the Langfuse Docs MCP server?"},
        "expected_output": {
            "response_facts": [
                "Connect via the MCP server endpoint: https://langfuse.com/api/mcp",
                "Transport protocol: `streamableHttp`"
            ],
            "trajectory": ["getLangfuseOverview"]
        }
    },
    {
        "input": {
            "question": "How long are traces retained in langfuse?",
        },
        "expected_output": {
            "response_facts": [
                "By default, traces are retained indefinetly",
                "You can set custom data retention policy in the project settings"
            ],
            "trajectory": ["getLangfuseOverview", "searchLangfuseDocs"],
            "search_term": "Data retention"
        }
    }
]
```

Upload to Langfuse datasets


```python
DATSET_NAME = "pydantic-ai-mcp-agent-evaluation"
```


```python
dataset = langfuse.create_dataset(
    name=DATSET_NAME
)
for case in tests_cases:
    langfuse.create_dataset_item(
        dataset_name=DATSET_NAME,
        input=case["input"],
        expected_output=case["expected_output"]
    )
```

### Set up Evaluations in Langfuse

#### Final response evaluation

```md
You are a teacher grading a student based on the factual correctness of his statements. In the following please find some example gradings that you did in the past.

### Examples

#### **Example 1:**
- **Response:** "The sun is shining brightly."
- **Facts to verify:** ["The sun is up.", "It is a beautiful day."]

Grading
- Reasoning: The response accurately includes both facts and aligns with the context of a beautiful day.
- Score: 1

#### **Example 2:**
- **Response:** "When I was in the kitchen, the dog was there"
- **Facts to verify:** ["The cat is on the table.", "The dog is in the kitchen."]

Grading
- Reasoning: The response includes that the dog is in the kitchen but does not mention that the cat is on the table.
- Score: 0

### New Student Response

- **Response**: {{response}}
- **Facts to verify:** {{facts_to_verify}}
```

#### Trajectory

```md
You are comparing two lists of strings. Please check whether the lists contain exactly the same items. The order does not matter.

## Examples

Input
Expected: ["searchWeb", "visitWebsite"]
Output: ["searchWeb"]

Grading
Reasoning: ["searchWeb", "visitWebsite"] are expected. In the output, "visitWebsite" is missing. Thus the two arrays are not the same.
Score: 0

Input
Expected: ["drawImage", "visitWebsite", "speak"]
Output: ["visitWebsite", "speak", "drawImage"]

Grading
Reasoning: The output matches the items from the expected output.
Score: 1

Input
Expected: ["getNews"]
Output: ["getNews", "watchTv"]

Grading
Reasoning: The output contains "watchTv" which was not expected.
Score: 0

## This excercise

Expected: {{expected}}
Output: {{output}}
```

#### Search quality

```md
You are a teacher grading a student based on whether he has looked for the right information in order to answe a question. In the following please find some example gradings that you did in the past.

The search by the student does not need to exactly match the response you expected; searches are often brief. The search term should correspond vaguely with the expected search term.

### Examples
#### **Example 1:**
- **Response:** How can I contact support?
- **Expected search topics**: Support

Grading
- Reasoning: The response accurately searches for support.
- Score: 1

#### **Example 2:**
- **Response:** Deployment
- **Expected search topics:** Tracing

Grading
- Reasoning: The response does not match the expected search topic of Tracing. Deployment questions are unrelated.
- Score: 0

#### **Example 3:**
- **Response:**
- **Expected search topics:**

Grading
- Reasoning: No search was done and no search term was expected.
- Score: 1

#### **Example 4:**
- **Response:** How to view sessions?
- **Expected search topics:**

Grading
- Reasoning: No search was expected, but search was used. This is not a problem.
- Score: 1

#### **Example 5:**
- **Response:**
- **Expected search topics:** How to run Langfuse locally?

Grading
- Reasoning: Even though we expected a search regarding running Langfuse locally, no search was made.
- Score: 0

### New Student Response

- **Response:** {{search}}
- **Expected search topics:** {{expected_search_topic}}
```

### Run Experiments


```python
system_prompts = {
    "simple": (
        "You are an expert on Langfuse. "
        "Answer user questions accurately and concisely using the available MCP tools. "
        "Cite sources when appropriate."
    ),
    "nudge_search_and_sources": (
        "You are an expert on Langfuse. "
        "Answer user questions accurately and concisely using the available MCP tools. "
        "Always cite sources when appropriate."
        "When you are unsure, always use getLangfuseOverview tool to do some research and then search the docs for more information. You can if needed use these tools multiple times."
    )
}

models = [
    "openai:gpt-4.1-nano",
    "openai:o4-mini"
]
```


```python
from datetime import datetime

d = langfuse.get_dataset(DATSET_NAME)

for prompt_name, prompt_content in list(system_prompts.items()):
    for test_model in models:
        now = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
        
        for item in d.items:
            with item.run(
                run_name=f"{test_model}-{prompt_name}-{now}",
                run_metadata={"model": test_model, "prompt": prompt_content},
            ) as root_span:
                
                await run_agent(
                    item.input["question"],
                    prompt_content,
                    test_model
                )

```

    
    ---
    Q: How long are traces retained in langfuse?
    MCP Tool call: searchLangfuseDocs with args: {'query': 'trace retention period'}
    A: In Langfuse, traces are retained based on the data retention settings configured at the project level. The minimum retention period is 3 days, but it can be set up to a longer period depending on your needs. By default, Langfuse stores event data indefinitely, but you can specify a retention period, and older data will be automatically deleted nightly once it surpasses this setting.
    
    ---
    Q: How to connect to the Langfuse Docs MCP server?
    MCP Tool call: searchLangfuseDocs with args: {'query': 'connect to the Langfuse Docs MCP server'}
    A: To connect to the Langfuse Docs MCP server, use the following endpoint and configurations:
    
    - **Endpoint:** `https://langfuse.com/api/mcp`
    - **Transport:** `streamableHttp`
    
    Depending on your client, you may need to add the MCP server configuration in your setup. For example:
    
    - In JSON format:
    ```json
    {
      "mcpServers": {
        "langfuse-docs": {
          "url": "https://langfuse.com/api/mcp"
        }
      }
    }
    ```
    
    - Or, if you're using a CLI or specific tools, refer to their documentation for adding custom MCP servers with this URL.
    
    You can also integrate this with various editors or clients like Cursor, Claude, or Windsurf by following their specific instructions for adding an MCP server.
    
    Would you like detailed steps for a particular client or environment?
    
    ---
    Q: How to trace a python application with Langfuse?
    MCP Tool call: searchLangfuseDocs with args: {'query': 'How to trace a Python application with Langfuse'}
    A: To trace a Python application with Langfuse, you can use the Python SDK (low-level or v3). The SDK allows you to create traces, spans, generations, events, and other observations, which represent different parts of your application's execution.
    
    Here's a basic overview:
    
    1. **Initialize the Langfuse Client**: Set your credentials and create a client instance.
    2. **Create a Trace**: Use `langfuse.trace()` to start a new trace.
    3. **Create Spans**: Use `trace.span()` to mark different units of work within a trace.
    4. **Record Generations, Events, and Observations**: You can log model generations, discrete events, and other steps.
    5. **Use context managers or method calls to update end times and add data.**
    
    For detailed code examples and step-by-step guidance, you can refer to the [Langfuse Python SDK documentation](https://langfuse.com/docs/sdk/python/low-level-sdk) or the [cookbook guide](https://langfuse.com/guides/cookbook/python_sdk_low_level#tracing).
    
    Would you like a code sample to get started?
    
    ---
    Q: What is Langfuse?
    MCP Tool call: getLangfuseOverview with args: {}
    A: Langfuse is an open-source LLM engineering platform designed to help teams collaboratively debug, analyze, and iterate on their large language model applications. It provides native platform features that accelerate the development workflow, with capabilities such as diagnostics, monitoring, and analytics for LLM-based systems. You can find more details and documentation on their official site [here](https://langfuse.com/docs).
    
    ---
    Q: How long are traces retained in langfuse?
    MCP Tool call: searchLangfuseDocs with args: {'query': 'How long are traces retained in langfuse traces retained'}
    A: By default, Langfuse will keep all your traces (and other event data) indefinitely. If you need to cap how long data lives, you can enable the “Data Retention” feature at the project level:
    
    • You set the retention period in days (minimum 3 days).  
    • Once enabled, every night Langfuse will delete traces (based on their `timestamp`) older than your configured window.  
    
    Source: Langfuse Data Retention docs (https://langfuse.com/docs/data-retention)
    
    ---
    Q: How to connect to the Langfuse Docs MCP server?
    MCP Tool call: searchLangfuseDocs with args: {'query': 'Langfuse Docs MCP server connect'}
    A: To connect your AI agent or editor to the Langfuse Docs MCP server, point it at the following endpoint over the `streamableHttp` protocol:
    
        Endpoint: https://langfuse.com/api/mcp  
        Transport: streamableHttp  
    
    Below are examples for popular clients; feel free to adapt to your own MCP-client:
    
    1. Cursor (VS Code extension)  
       • One-click install:  
         https://cursor.com/install-mcp?name=langfuse-docs&config=eyJ1cmwiOiJodHRwczovL2xhbmdmdXNlLmNvbS9hcGkvbWNwIn0%3D  
       • Or add to your mcp.json:  
         {  
           "mcpServers": {  
             "langfuse-docs": { "url": "https://langfuse.com/api/mcp" }  
           }  
         }  
    
    2. GitHub Copilot in VS Code  
       1. Open Command Palette (⌘+Shift+P)  
       2. “MCP: Add Server…” → HTTP  
       3. Paste https://langfuse.com/api/mcp → name it (e.g. `langfuse-docs`) → save  
    
    3. Claude Code (CLI or settings file)  
       • CLI one-liner:  
         claude mcp add \  
           --transport http \  
           langfuse-docs \  
           https://langfuse.com/api/mcp \  
           --scope user  
       • Or in `~/.claude/settings.json` (or project/.claude/settings.json):  
         {  
           "mcpServers": {  
             "langfuse-docs": {  
               "transportType": "http",  
               "url": "https://langfuse.com/api/mcp",  
               "verifySsl": true  
             }  
           }  
         }  
    
    4. Windsurf  
       • Direct (if Windsurf supports streamableHttp):  
         { "mcpServers": { "langfuse-docs": { "url": "https://langfuse.com/api/mcp" } } }  
       • Or via local proxy using `mcp-remote`:  
         {  
           "mcpServers": {  
             "langfuse-docs": {  
               "command": "npx",  
               "args": ["mcp-remote", "https://langfuse.com/api/mcp"]  
             }  
           }  
         }  
    
    Once configured, start or restart your editor/agent and invoke MCP mode (e.g. `/mcp` in Claude Code) to verify the connection. You’ll now have access to the `searchLangfuseDocs` and `getLangfuseOverview` tools directly inside your AI workflows.  
    
    Source: Langfuse Docs MCP Server (https://langfuse.com/docs/docs-mcp)
    
    ---
    Q: How to trace a python application with Langfuse?
    MCP Tool call: searchLangfuseDocs with args: {'query': 'trace python application with Langfuse'}
    MCP Tool call: searchLangfuseDocs with args: {'query': 'python quickstart tracing Langfuse get started'}
    A: To trace your Python-based LLM application with Langfuse, you can choose either the decorator-based “quickstart” (recommended) or the low-level SDK for full manual control.
    
    ––––––––––––––––––––  
    1) Install & configure  
    ––––––––––––––––––––  
    ```bash
    pip install langfuse
    ```  
    Then set your Langfuse credentials and (optionally) region in `.env` or your environment:
    
     • LANGFUSE_PUBLIC_KEY="pk-lf-…"  
     • LANGFUSE_SECRET_KEY="sk-lf-…"  
     • # EU (default)  
     • LANGFUSE_HOST="https://cloud.langfuse.com"  
     • # US  
     • # LANGFUSE_HOST="https://us.cloud.langfuse.com"  
    
    ––––––––––––––––––––  
    2) Quickstart: decorator-based tracing  
    ––––––––––––––––––––  
    The `@observe()` decorator instruments your functions and any OpenAI calls inside them:
    
    ```python
    # main.py
    from langfuse import observe, get_client
    from langfuse.openai import openai    # drop-in OpenAI SDK replacement
    
    @observe()
    def ask_story():
        return openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role":"system","content":"You’re a great storyteller."},
                {"role":"user","content":"Once upon a time…"}
            ],
        ).choices[0].message.content
    
    @observe()
    def main():
        print(ask_story())
    
    if __name__ == "__main__":
        main()
    ```
    
    What happens:
    
    • Every `@observe()` creates a Langfuse trace, and nested OpenAI calls become “generations” within that trace.  
    • You get cost, latency, agent-graph, user/session IDs, and a full timeline in the Langfuse UI.  
    • No other code changes required—just import your LLM provider through the Langfuse integration.  
    
    Reference: Get Started with Langfuse Tracing (langfuse.com/docs/get-started)¹
    
    ––––––––––––––––––––  
    3) Manual control: low-level Python SDK  
    ––––––––––––––––––––  
    If you need custom spans, events or non-OpenAI calls, use the low-level client:
    
    ```python
    from langfuse import Langfuse
    from datetime import datetime
    
    # 1) Init client
    lf = Langfuse()
    
    # 2) Start a trace
    trace = lf.trace(
        name="my-llm-feature",
        user_id="user_123",
        metadata={"flow":"chatbot"},
        tags=["production"],
    )
    
    # 3) Add a retrieval span
    retrieval = trace.span(
        name="vector-db-search",
        input={"query":"What are OKRs?"},
    )
    # ... do work …
    retrieval.end(output={"results":[...]})
    
    # 4) Add a generation span
    gen = trace.generation(
        name="final-answer",
        model="gpt-4o",
        input="Summarize OKRs",
    )
    # ... call LLM …
    gen.end(
        output="Here’s the summary…",
        usage_details={"prompt_tokens":50,"completion_tokens":60},
    )
    
    # 5) Flush before exit (for short-lived apps)
    lf.flush()
    ```
    
    Key concepts:  
    • trace → span → generation → event (nested)  
    • `.end()` sets end_time; `.update()` upserts without closing  
    • `trace.get_trace_url()` gives you a direct link in the dashboard  
    • Use `lf.shutdown()` or `lf.flush()` in serverless/lifecycle hooks to ensure delivery  
    
    Reference: Python SDK (Low-level) guide (langfuse.com/docs/sdk/python/low-level-sdk)²
    
    ––––––––––––––––––––  
    4) Serverless & advanced usage  
    ––––––––––––––––––––  
    • In AWS Lambda / Vercel: call `lf.flush()` (or `await lf.flushAsync()`) before the function exits.  
    • Control sampling with `LANGFUSE_SAMPLE_RATE`.  
    • Bring your own `trace_id`, `parent_span_id` for distributed tracing.  
    • Instrument other frameworks (LangChain, LlamaIndex, Anthropic) via OTEL or official integrations.  
    
    ––––––––––––––––––––  
    5) Next steps  
    ––––––––––––––––––––  
    • Browse the Tracing reference to add Sessions, Users, Tags, Metadata, Release/Versioning, Public Links, etc.  
    • Use the Analytics, Cost & Usage dashboards to monitor in real time.  
    
    ¹ https://langfuse.com/docs/get-started  
    ² https://langfuse.com/docs/sdk/python/low-level-sdk
    
    ---
    Q: What is Langfuse?
    MCP Tool call: getLangfuseOverview with args: {}
    A: Langfuse is an open-source “LLM engineering” platform (MIT-licensed) that helps teams instrument, debug, analyze and iterate on large-language-model applications. Out of the box it provides:  
    • Automatic tracing of every prompt and model response (with metadata, sessions, tags, logs, etc.)  
    • Built-in metrics, dashboards and analytics (e.g. prompt-A/B tests, intent-classification reports)  
    • Custom scoring and evaluation pipelines (human feedback, model-based evals, external pipelines)  
    • Data-set management for synthetic and real examples (for prompt experiments, fine-tuning)  
    • RBAC, audit logs, self-hosting support (Docker, Kubernetes, cloud)  
    • SDKs (Python, TypeScript), REST API, and an MCP server for in-editor docs and search  
    
    In short, Langfuse unifies tracing, metrics, scoring, evaluation and dashboards in one platform so you can build, monitor and optimize LLM-driven systems more effectively.  
    Source: https://langfuse.com (“Langfuse is an open-source LLM engineering platform…”)
    
    ---
    Q: How long are traces retained in langfuse?
    MCP Tool call: searchLangfuseDocs with args: {'query': 'trace retention period in Langfuse'}
    A: In Langfuse, trace data retention is configurable at the project level. The minimum retention period is 3 days, and it can be set to any number of days greater than or equal to 3. Data older than the configured retention period is automatically deleted on a nightly basis. By default, event data such as traces, observations, scores, and media assets are stored indefinitely unless a retention policy is specified. You can find more details in the [Data Retention documentation](https://langfuse.com/docs/data-retention).
    
    ---
    Q: How to connect to the Langfuse Docs MCP server?
    MCP Tool call: searchLangfuseDocs with args: {'query': 'connect to the Langfuse Docs MCP server'}
    A: To connect to the Langfuse Docs MCP server, you need to use the endpoint: [https://langfuse.com/api/mcp](https://langfuse.com/api/mcp). The communication protocol supported is `streamableHttp`, which is compatible with most clients.
    
    Here are the general steps to connect:
    
    1. **Add the MCP server configuration** to your client. For example, in JSON format:
    ```json
    {
      "mcpServers": {
        "langfuse-docs": {
          "url": "https://langfuse.com/api/mcp"
        }
      }
    }
    ```
    
    2. **Configure your client** (such as Cursor, Claude, Windsurf, or others) with this endpoint following their specific setup instructions, which typically involve specifying the URL and choosing the transport method (`http` or `streamableHttp`).
    
    3. **Verify connection** by starting your client and confirming that it recognizes the server.
    
    For detailed instructions tailored to your specific client, see the official documentation [here](https://langfuse.com/docs/docs-mcp).
    
    ---
    Q: How to trace a python application with Langfuse?
    MCP Tool call: searchLangfuseDocs with args: {'query': 'trace a Python application with Langfuse'}
    A: To trace a Python application with Langfuse, you can use the Python SDK v3, which supports W3C Trace Context IDs for distributed tracing. Here's a high-level overview of the steps:
    
    1. Initialize the Langfuse client in your application.
    2. Use the `@observe()` decorator to automatically create and link spans, generations, events, etc.
    3. Optionally, generate deterministic trace IDs using `create_trace_id()` if needed.
    4. Use the `start_as_current_span()` method to manually create spans and set trace context.
    5. Access the current trace ID and propagate it across components or services.
    6. Ensure to call `langfuse.flush()` or `langfuse.shutdown()` before your application terminates to send all data.
    
    You can find more detailed instructions and code samples in the [Langfuse documentation](https://langfuse.com/docs/tracing-features/trace-ids). If you'd like, I can provide specific code snippets or further guidance.
    
    ---
    Q: What is Langfuse?
    MCP Tool call: getLangfuseOverview with args: {}
    A: Langfuse is an open-source Large Language Model (LLM) engineering platform designed to help teams collaboratively debug, analyze, and iterate on their LLM applications. It offers native integrations of various features to accelerate the development workflow. You can find more details in their [official documentation](https://langfuse.com/docs).
    
    ---
    Q: How long are traces retained in langfuse?
    MCP Tool call: searchLangfuseDocs with args: {'query': 'trace retention'}
    A: By default, Langfuse will keep all traces forever (i.e. “indefinitely”). If you enable the Data Retention feature on a per-project basis (available on Pro Team Add-On, Enterprise Cloud, or Self-Hosted Enterprise), you can specify a retention period in days (minimum 3 days). Any traces (as well as observations, scores, and media assets) older than that period will be picked up by a nightly cleanup job and permanently deleted.  
    
    Source: Langfuse Docs – Data Retention (https://langfuse.com/docs/data-retention)
    
    ---
    Q: How to connect to the Langfuse Docs MCP server?
    MCP Tool call: getLangfuseOverview with args: {}
    MCP Tool call: searchLangfuseDocs with args: {'query': 'Docs MCP server connection streamableHttp example Langfuse'}
    A: To connect your AI editor or agent to the Langfuse Docs MCP server, point it at https://langfuse.com/api/mcp using the streamableHttp protocol. Below are example configurations for popular clients—feel free to adapt to yours:
    
    1. Generic (e.g. Cursor via mcp.json)  
    ```json
    {
      "mcpServers": {
        "langfuse-docs": {
          "url": "https://langfuse.com/api/mcp"
        }
      }
    }
    ```  
    2. GitHub Copilot (VS Code)  
    - Open Command Palette → “MCP: Add Server…”  
    - Select HTTP, paste https://langfuse.com/api/mcp, name it (e.g. langfuse-docs) and save  
    
    3. Claude Code  
    Shell:  
    ```bash
    claude mcp add \
      --transport http \
      langfuse-docs \
      https://langfuse.com/api/mcp \
      --scope user
    ```  
    Or in ~/.claude/settings.json:  
    ```json
    {
      "mcpServers": {
        "langfuse-docs": {
          "transportType": "http",
          "url": "https://langfuse.com/api/mcp",
          "verifySsl": true
        }
      }
    }
    ```
    
    4. Windsurf (no native streamableHttp)  
    Use the `mcp-remote` shim:  
    ```json
    {
      "mcpServers": {
        "langfuse-docs": {
          "command": "npx",
          "args": ["mcp-remote", "https://langfuse.com/api/mcp"]
        }
      }
    }
    ```
    
    Once configured, open your agent/AI session and verify by invoking the MCP server (e.g. start a session and send a `/mcp` ping).  
    Source: Langfuse Docs MCP Server (https://langfuse.com/docs/docs-mcp)
    
    ---
    Q: How to trace a python application with Langfuse?
    MCP Tool call: searchLangfuseDocs with args: {'query': 'python Langfuse trace python application'}
    A: To get full observability of your Python app in Langfuse you need to:
    
    1. Install & configure the SDK  
    2. Initialize a Langfuse client  
    3. Annotate your code (either low-level or decorator-based)  
    4. Flush on shutdown  
    
    —  
    
    1) Install & configure  
    ```bash
    pip install langfuse --upgrade
    ```  
    Then set your Langfuse credentials (and OpenAI key if you’re calling OpenAI):  
    ```bash
    export LANGFUSE_PUBLIC_KEY=<your-public-key>
    export LANGFUSE_SECRET_KEY=<your-secret-key>
    export LANGFUSE_HOST=https://cloud.langfuse.com    # or your self-hosted URL
    export OPENAI_API_KEY=<your-openai-key>
    ```  
    (You can also set these in Python’s `os.environ`.)  
    
    2) Initialize the client  
    ```python
    from langfuse import Langfuse
    langfuse = Langfuse()
    # Optional: verify credentials
    langfuse.auth_check()
    ```  
      
    
    3a) Low-level tracing  
    Use the client’s `.trace()`, `.span()` and `.generation()` methods to manually instrument sections of your app:  
    ```python
    # start a trace
    trace = langfuse.trace(name="process_order", user_id="user123", input={"order_id": 42})
    
    # a nested span
    span = trace.span(name="db_lookup", metadata={"table": "orders"})
    # … do your DB query …
    span.end(output={"order": {...}})
    
    # an LLM call as a generation
    gen = trace.generation(
        name="summarize_order",
        model="gpt-4",
        model_parameters={"temperature": 0.7},
        input="Please summarize the order details."
    )
    # … call the model …
    gen.end(output="Summary text", usage_details={"input": 10, "output": 12})
    
    # Optionally update trace output or metadata
    trace.update(output={"summary": "..."} )
    ```
    Source: Python SDK (Low-level) tracing guide¹  
    
    3b) Decorator-based tracing (easiest)  
    If you prefer to annotate your functions, use the decorator API:  
    ```python
    from langfuse.decorators import observe
    
    @observe()               # becomes a trace + nested spans
    def main_workflow(order_id: int):
        data = load_order(order_id)      # logged as a span
        summary = summarize_with_llm(data)  # logged as an LLM generation
        return summary
    
    main_workflow(42)
    ```
    The decorator automatically captures nesting, timing, inputs/outputs, and turns each call into a trace/span/generation.  
    Source: Python Decorators cookbook²  
    
    4) Flush before exit  
    Langfuse sends events asynchronously on background threads. In short-lived environments (Lambda, Google Cloud Functions, etc.) you must block until all events ship:  
    ```python
    langfuse.flush()
    ```  
    
    That’s it—you’ll now see full traces, spans, model generations, costs, and custom metadata in the Langfuse UI.  
    
    References:  
    1. https://langfuse.com/guides/cookbook/python_sdk_low_level#tracing  
    2. https://langfuse.com/guides/cookbook/python_decorators#basic-usage
    
    ---
    Q: What is Langfuse?
    MCP Tool call: getLangfuseOverview with args: {}
    A: Langfuse is an open-source LLM-engineering platform that helps teams instrument, debug, analyze and iterate on their language-model applications. It lets you:  
    • Capture and visualize every prompt, model call and chain execution in rich “traces”  
    • Build dashboards, run analytics and set up custom metrics via its Metrics API  
    • Experiment with prompts and datasets (A/B tests, prompt sweeps, synthetic data)  
    • Collect scores (human feedback, automated evals) and build custom evaluation pipelines  
    • Audit and explore logs, user activity and data-retention settings  
    • Integrate via first-class Python, TypeScript and low-level SDKs—or plug directly into OpenTelemetry  
    
    All features—tracing, analytics, scoring, dashboards and more—are natively integrated for a unified, collaborative LLM-development workflow.  
    (Source: Langfuse overview)

