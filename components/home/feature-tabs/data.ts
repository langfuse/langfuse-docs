import {
  TextQuote,
  LineChart,
  GitPullRequestArrow,
  ThumbsUp,
  FlaskConical,
  Globe,
  MessageSquare,
} from "lucide-react";
import type { FeatureTabData } from "./types";

import observabilityPng from "components/home/feature-tabs/img/observability-2.png";
import metricsPng from "components/home/feature-tabs/img/metrics.png";
import PromptPng from "components/home/feature-tabs/img/prompt.png";
import EvalsPng from "components/home/feature-tabs/img/evals-wide.png";
import PlaygroundPng from "components/home/feature-tabs/img/playground.png";
import AnnotationPng from "components/home/feature-tabs/img/Annotation.png";

export const featureTabsData: FeatureTabData[] = [
  {
    id: "observability",
    icon: TextQuote,
    title: "Observability",
    subtitle: "Trace every LLM call with cost & latency.",
    body: "Capture complete traces of your LLM applications/agents. Use traces to inspect failures and build eval datasets. Based on OpenTelemetry with support for all popular LLM/agent libraries.",
    docsHref: "/docs/observability/overview",
    videoHref: "/watch-demo?tab=observability",
    image: {
      light: observabilityPng,
      dark: observabilityPng,
      alt: "Langfuse observability trace detail view showing nested observations with latency and cost",
    },
    code: {
      snippets: {
        python: `from langfuse import observe

# drop-in wrapper adds OpenTelemetry tracing to OpenAI
# many other llm/agent integrations are available
from langfuse.openai import openai

@observe()  # decorate any function; all nested calls are auto-linked
def handle_request(text: str) -> str:
    res = openai.chat.completions.create(
        model="gpt-5",
        messages=[
            {"role": "system", "content": "Summarize in one sentence."},
            {"role": "user", "content": text},
        ],
    )
    return res.choices[0].message.content`,
        javascript: `import { observe } from "@langfuse/tracing";
import OpenAI from "openai";
import { observeOpenAI } from "@langfuse/openai";

// Wrap OpenAI client for Langfuse auto-instrumentation
// Integrations for many other llm/agent libraries are available
const openai = observeOpenAI(new OpenAI());

async function handleRequest(userInput: string) {
  const res = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      { role: "system", content: "Reply concisely." },
      { role: "user", content: userInput },
    ],
  });
  return res.choices[0].message.content;
}
  
// Wrap the function with observe to trace timings, nested calls, and I/O
export default observe(handleRequest);`,
      },
    },
    quickstartHref: "/docs/observability/get-started",
  },
  {
    id: "metrics",
    icon: LineChart,
    title: "Metrics",
    subtitle: "Track cost, latency, and quality.",
    body: "Monitor your LLM application's performance with comprehensive metrics dashboards and APIs. Track costs, latencies, token usage, and quality scores across models, users, and time periods.",
    docsHref: "/docs/metrics/overview",
    videoHref: "/watch-demo?tab=metrics",
    image: {
      light: metricsPng,
      dark: metricsPng,
      alt: "Langfuse analytics dashboard showing cost and latency metrics over time",
    },
    code: {
      snippets: {
        python: `# The metrics API enables querying of custom aggregations
# Example: Total LLM cost for each user over the last 30 days

import json, time
from langfuse import get_client

langfuse = get_client()
now = int(time.time() * 1000)                     # ms
from_ms = now - 30 * 24 * 60 * 60 * 1000          # 30 days ago

# Construct the query object
query = {
  "view": "traces",
  "dimensions": [{"field": "userId"}],
  "metrics": [{"measure": "totalCost", "aggregation": "sum"}],
  "fromTimestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(from_ms/1000)),
  "toTimestamp":   time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(now/1000)),
  "orderBy": [{"field": "totalCost_sum", "direction": "desc"}],
}

# Get metrics from Langfuse API
res = langfuse.api.metrics.metrics(query=json.dumps(query))`,
        javascript: `// Metrics API enables querying of custom aggregations
// Example: Total LLM cost for each user over the last 30 days
        
import { LangfuseClient } from "@langfuse/client";
const langfuse = new LangfuseClient();

const now = Date.now();
const from = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString();

// Construct the query object
const query = JSON.stringify({
  view: "traces",
  dimensions: [{ field: "userId" }],
  metrics: [{ measure: "totalCost", aggregation: "sum" }],
  fromTimestamp: from,
  toTimestamp: new Date(now).toISOString(),
  orderBy: [{ field: "totalCost_sum", direction: "desc" }],
});

// Get metrics from Langfuse API
const res = await langfuse.api.metrics.metrics({query});`,
      },
    },
    quickstartHref: "/docs/metrics/overview",
  },
  {
    id: "prompt-management",
    icon: GitPullRequestArrow,
    title: "Prompt Management",
    subtitle: "Version and deploy prompts with low latency.",
    body: "Version-control prompts collaboratively, deploy/roll-back instantly to different environments, support for templates, variables, and A/B testing. Cached client-side for 0 latency/availability impact.",
    docsHref: "/docs/prompt-management/overview",
    videoHref: "/watch-demo?tab=prompt",
    image: {
      light: PromptPng,
      dark: PromptPng,
      alt: "Langfuse prompt management interface showing versioned prompts",
    },
    code: {
      snippets: {
        python: `from langfuse import get_client
from langfuse.openai import openai

langfuse = get_client()

def handle_request(user_input: str) -> str:
  # Fetches the latest 'production' version if no 'label' is provided
  # Caches client-side, revalidates in background, instant subsequent calls
  prompt = langfuse.get_prompt("support-reply", type="chat")

  # Prompt can contain variables and placeholders
  # Filled at runtime via compile()
  compiled_prompt = prompt.compile(tone="friendly", input=user_input)

  # Works with any model, supports text and chat message formats
  res = openai.chat.completions.create(
      model="gpt-5",
      messages=compiled_prompt,
  )
  return res.choices[0].message.content
`,
        javascript: `import { LangfuseClient } from "@langfuse/client";
import OpenAI from "openai";

const langfuse = new LangfuseClient();
const openai = new OpenAI();

async function handleRequest(userInput: string) {
  // Fetches the latest 'production' version if no 'label' is provided
  // Caches client-side, revalidates in background, instant subsequent calls
  const prompt = await langfuse.prompt.get("support-reply", { type: "chat" });

  // Prompt can contain variables and placeholders
  // Filled at runtime via compile()
  const compiledPrompt = prompt.compile({ tone: "friendly", input: userInput });

  // Works with any model, supports text and chat message formats
  const res = await openai.chat.completions.create({
    model: "gpt-5",
    messages: compiledPrompt,
  });
  
  return res.choices[0].message.content;
}
`,
      },
    },
    quickstartHref: "/docs/prompt-management/get-started",
  },
  {
    id: "playground",
    icon: FlaskConical,
    title: "Playground",
    subtitle: "Test prompts and models interactively.",
    body: "Experiment with different prompts, models, and parameters in an interactive playground. Compare outputs, iterate on prompts, and save successful configurations to prompt management.",
    docsHref: "/docs/prompt-management/features/playground",
    image: {
      light: PlaygroundPng, // Placeholder - needs playground screenshot
      dark: PlaygroundPng,
      alt: "Langfuse playground interface for testing prompts and models",
    },
    displayMode: "image-only",
    quickstartHref: "/docs/prompt-management/features/playground",
  },
  {
    id: "evaluation",
    icon: ThumbsUp,
    title: "Evaluation",
    subtitle: "Collect feedback and run evaluations.",
    body: "Run online/offline evals, via UI (experiment with prompts/models) and via SDKs (experiment with end-to-end application). Build datasets from traces to continuously improve your evals. View results in UI.",
    docsHref: "/docs/evaluation/overview",
    videoHref: "/watch-demo?tab=evaluation",
    image: {
      light: EvalsPng,
      dark: EvalsPng,
      alt: "Langfuse evaluation interface showing feedback and scores",
    },
    code: {
      snippets: {
        python: `from langfuse import get_client, Evaluation
from langfuse.openai import OpenAI

langfuse = get_client()
dataset = langfuse.get_dataset("capital_cities") # fetch dataset with examples

def task(*, item, **_): # TODO: call your own application logic here
    r = OpenAI().chat.completions.create(
        model="gpt-5",
        messages=[{"role": "user", "content": item["input"]}],
    )
    return r.choices[0].message.content

def accuracy_eval(*, input, output, expected_output, **_):
    ok = expected_output.lower() in output.lower()
    return Evaluation(name="accuracy", value=1.0 if ok else 0.0)

# Experiment runner iterates dataset items, traces calls, and applies evaluators
result = langfuse.run_experiment(
    name="Capitals - simple implementation",
    data=dataset.items,
    task=task,
    evaluators=[accuracy_eval],
)
print(result.format())`,
        javascript: `import { LangfuseClient } from "@langfuse/client";
import OpenAI from "openai";

const langfuse = new LangfuseClient();
const dataset = await langfuse.dataset.get("capital_cities");

const task = async (item: { input: string }) => {
  const res = await new OpenAI().chat.completions.create({
    model: "gpt-5",
    messages: [{ role: "user", content: item.input }],
  });
  return res.choices[0].message.content;
};

const accuracy = async ({ output, expectedOutput }: any) => ({
  name: "accuracy",
  value: output.toLowerCase() === expectedOutput.toLowerCase() ? 1 : 0,
});

// Experiment runner: loops over dataset items, traces runs, applies evaluators
const result = await langfuse.experiment.run({
  name: "Capitals - simple implementation",
  data: dataset.items,
  task,
  evaluators: [accuracy],
});`,
      },
    },
    quickstartHref: "/docs/evaluation/get-started",
  },
  {
    id: "annotations",
    icon: MessageSquare,
    title: "Annotations",
    subtitle: "Add manual feedback and corrections.",
    body: "Create manual annotations to provide feedback, corrections, and improvements to your LLM outputs. Use annotations to build high-quality datasets and set a baseline for automated evals.",
    docsHref: "/docs/evaluation/evaluation-methods/annotation",
    image: {
      light: AnnotationPng,
      dark: AnnotationPng,
      alt: "Langfuse annotation interface for manual feedback and corrections",
    },
    displayMode: "image-only",
  },
  {
    id: "public-api",
    icon: Globe,
    title: "Public API",
    subtitle: "Full REST API access to all features.",
    body: "Access all Langfuse features and data programmatically through our API. Integrate with your existing workflows, build custom interfaces and dashboards, and automate your workflows.",
    docsHref: "/docs/api-and-data-platform/overview",
    image: {
      light: observabilityPng, // Placeholder - needs API documentation screenshot
      dark: observabilityPng,
      alt: "Langfuse API documentation and examples",
    },
    code: {
      snippets: {
        python: `from langfuse import get_client

langfuse = get_client()

# Get list of traces with optional filters & pagination
traces = langfuse.api.trace.list(limit=100, user_id="user_123", tags=["production"])

# Get a single trace by ID
trace = langfuse.api.trace.get("traceId")

# Get observations for a specific trace
observations = langfuse.api.observations.get_many(trace_id="traceId", type="GENERATION", limit=50)

# Get sessions and scores
sessions = langfuse.api.sessions.list(limit=20)
scores = langfuse.api.score_v_2.get(limit=20)

# Get aggregated metrics (see other tab)
metrics = langfuse.api.metrics.metrics(...)

# Many more APIs are available
# See the API reference or SDK docs for more details`,
        javascript: `import { LangfuseClient } from "@langfuse/client";

const langfuse = new LangfuseClient();

// Get list of traces with optional filters & pagination
const traces = await langfuse.api.trace.list({ limit: 100 });

// Get a single trace by ID
const trace = await langfuse.api.trace.get("traceId");

// Get observations for a specific trace
const observations = await langfuse.api.observations.getMany({traceId: "traceId", type: "GENERATION", limit: 50});

// Get sessions and scores
const sessions = await langfuse.api.sessions.list({ limit: 20 });
const scores = await langfuse.api.scoreV2.get({ limit: 20 });

// Get aggregated metrics (see other tab)
const metrics = await langfuse.api.metrics.metrics({...});

// Many more APIs are available
// See the API reference or SDK docs for more details`,
      },
    },
    displayMode: "code-only",
  },
];
