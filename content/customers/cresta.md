# How Cresta traces multi-service AI agent pipelines with Langfuse

## About Cresta

[Cresta](https://cresta.com/) is an enterprise generative AI platform for contact centers, built to deploy human-centric AI agents, real-time agent assistance, and conversation intelligence on customer data at scale. Teams use Cresta to automate and improve customer experience across sales, care, collections, and more—without sacrificing the trust and control enterprises require.

## Observability for AI Agents: Tracing Multi-Service LLM Pipelines with Langfuse

On Cresta’s platform, AI agents in production are not single model calls. An end customer might only see a generated response, but behind the scenes the agent runs intent detection, knowledge retrieval, tool execution, and safety validation—often many times—each with its own model, latency profile, and failure mode. A 200 OK from the agent endpoint says little about whether retrieval returned irrelevant documents or a guardrail silently rewrote the output.

To run and improve those systems, teams need a trace of each step: inputs and outputs, latency, and cost. That visibility is what makes it possible to evaluate, improve, and scale agents over time.

```
Infrastructure:  request → service → response → metric
Agent pipeline:  request → retrieve → rank → generate → validate → tool_call → generate → response
```


## Tracing agent pipelines

Langfuse organizes AI agent execution into trace trees. Each node represents a typed observation (an LLM generation, a retrieval lookup, a tool call) with structured fields appropriate to that type. A single agent turn produces a tree like this:


Each node captures structured data appropriate to its type: prompts and completions for generations, document counts and relevance scores for retrievals, pass/fail results for guardrails. That granularity turns debugging from “something is slow” into “the response synthesis step used 3x the expected tokens because the retrieval returned policy documents in two languages.” Because observations are typed, Cresta’s team can query across traces—for example, surface generations where `total_tokens > 2000`, or filter retrievals by document count to find cases where the knowledge base returned too many or too few results.

## Self-hosting and data sovereignty

Cresta self-hosts Langfuse rather than using only a managed SaaS offering. Traces capture the content of customer conversations; even though personally identifiable information (PII) is redacted before recording (either upstream before LLM processing or just-in-time at the tracing layer), keeping trace data inside Cresta’s infrastructure boundary is a hard requirement.

Cresta deploys one Langfuse instance per Kubernetes cluster, co-located with the services that produce traces:

No trace data leaves the cluster boundary. That also gives Cresta direct control over retention policies, backup schedules, and resource allocation.

## Multi-tenant trace isolation

In a multi-tenant environment, trace isolation is a compliance requirement. Different customers have different data handling agreements, and the underlying conversation data requires strict segregation even after PII redaction.

Cresta uses per-customer Langfuse organizations, each with its own API credentials. When a trace is created, the tracing library resolves the correct credentials based on the customer context from the incoming request. Service developers do not handle API keys or routing logic directly:

```python
with start_retrieval("knowledge-search") as span:
    docs = await vector_store.search(query)
    span.set_output({"doc_count": len(docs)})

# The tracing library automatically:
# 1. Reads customer_id from the request context (set by auth middleware)
# 2. Resolves credentials for that customer's Langfuse organization
# 3. Exports the span to the correct destination
```

Customer A’s traces are physically separated from Customer B’s, with no possibility of cross-contamination, even when both are served by the same pods.

## Cross-service trace propagation

A single customer interaction often touches multiple services: a Go agent service, a Python RAG pipeline, a separate function bundle for tool execution. The trace needs to follow the request across all of them.

Cresta propagates trace context through gRPC metadata headers, injected and extracted by interceptors on each service:

The downstream service joins the existing trace without any manual setup. Each service initializes its own root span, and any observations it creates nest under that root. Both services export their spans independently, and Langfuse reconstructs the full tree from matching trace and span IDs. In the Langfuse UI, Cresta’s engineers see the complete cross-service picture:


The full call tree is stitched together across language boundaries, with no manual ID threading or log correlation.

## Debugging agent chains with trace data

Seeing the full trace across services helps with latency and cost analysis; the deeper value is debugging agent reasoning. An agentic pipeline is a chain of LLM calls where each step’s output feeds into the next. When the final response is wrong, the root cause is often not the last generation—it is often a misleading intermediate output several steps earlier that sent the rest of the chain in the wrong direction.

Without structured traces, that is hard to diagnose. The final response looks wrong, but logs for each individual step may look reasonable in isolation. The issue only shows up when engineers can see the full chain of prompts and completions in sequence and pinpoint where the reasoning diverged.

That is where the typed trace tree helps. Each Generation node records the full prompt (including context injected from prior steps) and the completion returned. Walking the tree from root to leaf, Cresta’s team can identify the specific step where the output diverged—for example, intent detection returning “billing inquiry” when the customer was actually asking about a service cancellation, with every downstream step following that incorrect signal.

The trace makes the causal chain explicit. Instead of guessing what went wrong and re-running the pipeline with ad hoc logging, engineers can inspect each prompt, each completion, and each handoff between steps.

Langfuse’s sandbox goes further. After engineers identify the problematic generation, they can replay the chain from that point with a modified prompt while keeping prior inputs and context fixed—without reproducing the full end-to-end request or standing up test fixtures. They edit the prompt at the failing step, re-run, and see how the change propagates through the rest of the chain. The iteration cycle shifts from “ship a prompt change to staging and wait for a similar request” to “replay this exact failure with a candidate fix in seconds.”

## What comes next

LLM observability is still a young discipline, and Cresta is actively exploring several directions:

- **Evaluation scores on traces**: attaching automated quality scores (relevance, faithfulness, coherence) directly to trace observations, tightening the loop between production behavior and offline evaluation.
- **Prompt engineering co-pilot**: a freeform drafting surface (canvas-style UI) for non-technical users, with quick actions (refine, format, shorten) and guided conversation aligned to prompt best practices. Optional inputs such as Langfuse traces, eval runs, and plain-language feedback ground suggestions in observed behavior while avoiding overfitting to a single metric.
- **Regression detection across prompt versions**: comparing trace-level metrics before and after a prompt change to quantify impact, rather than relying on offline evaluation alone.

The more precisely teams can see what an AI agent is doing, the more effectively they can improve it. Observability is not separate from AI agent quality—it is a prerequisite for it.
