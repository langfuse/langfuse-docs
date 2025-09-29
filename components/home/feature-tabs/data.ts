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
import costPng from "components/home/feature-tabs/img/cost.png";
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
    body: "Capture complete traces across your LLM stack (requests, tools, retries), tagged by user/session, with timing and token cost. Use traces to inspect failures and performance regressions.",
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
def summarize(text: str) -> str:
    res = openai.chat.completions.create(
        name="summary",
        model="gpt-5",
        messages=[
            {"role": "system", "content": "Summarize in one sentence."},
            {"role": "user", "content": text},
        ],
    )
    return res.choices[0].message.content`,
        javascript: `// TODO: set up global Langfuse OTel exporter

import { observe } from "@langfuse/tracing";
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
    body: "Monitor your LLM application's performance with comprehensive metrics dashboards. Track costs, latencies, token usage, and quality scores across models, users, and time periods.",
    docsHref: "/docs/analytics",
    videoHref: "/watch-demo?tab=metrics",
    image: {
      light: costPng,
      dark: costPng,
      alt: "Langfuse analytics dashboard showing cost and latency metrics over time",
    },
    code: {
      snippets: {
        python: `from langfuse import Langfuse

langfuse = Langfuse()

# Track metrics with custom tags for filtering
trace = langfuse.trace(
    name="document-qa",
    tags=["production", "document-processing"],
    metadata={"document_type": "legal"}
)

generation = trace.generation(
    name="answer-generation",
    model="gpt-4-turbo",
    input="What are the key terms in this contract?",
    usage={
        "input_tokens": 1500,
        "output_tokens": 300,
        "total_tokens": 1800
    }
)

# Add custom scores for quality tracking
langfuse.score(
    trace_id=trace.id,
    name="relevance",
    value=0.95
)

langfuse.score(
    trace_id=trace.id,
    name="accuracy",
    value=0.88
)`,
        javascript: `import { Langfuse } from "langfuse";

const langfuse = new Langfuse();

// Track metrics with custom tags for filtering
const trace = langfuse.trace({
  name: "document-qa",
  tags: ["production", "document-processing"],
  metadata: { documentType: "legal" }
});

const generation = trace.generation({
  name: "answer-generation",
  model: "gpt-4-turbo",
  input: "What are the key terms in this contract?",
  usage: {
    inputTokens: 1500,
    outputTokens: 300,
    totalTokens: 1800
  }
});

// Add custom scores for quality tracking
langfuse.score({
  traceId: trace.id,
  name: "relevance",
  value: 0.95
});

langfuse.score({
  traceId: trace.id,
  name: "accuracy",
  value: 0.88
});`,
      },
    },
    quickstartHref: "/docs/analytics",
  },
  {
    id: "prompt-management",
    icon: GitPullRequestArrow,
    title: "Prompt Management",
    subtitle: "Version and deploy prompts with low latency.",
    body: "Manage prompts collaboratively with version control, deploy them instantly, and retrieve them with low latency in your applications. Support for templates, variables, and A/B testing.",
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
    body: "Experiment with different prompts, models, and parameters in an interactive playground. Compare outputs, iterate on prompts, and save successful configurations.",
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
    body: "Collect user feedback, create manual annotations, and run automated evaluation functions. Build datasets from production data to continuously improve your LLM applications.",
    docsHref: "/docs/evaluation/overview",
    videoHref: "/watch-demo?tab=evaluation",
    image: {
      light: EvalsPng,
      dark: EvalsPng,
      alt: "Langfuse evaluation interface showing feedback and scores",
    },
    code: {
      snippets: {
        python: `from langfuse import Langfuse

langfuse = Langfuse()

# Create a trace with evaluation data
trace = langfuse.trace(name="customer-query")

generation = trace.generation(
    name="response",
    input="How do I reset my password?",
    output="You can reset your password by clicking the 'Forgot Password' link on the login page.",
    model="gpt-4"
)

# Add user feedback
langfuse.score(
    trace_id=trace.id,
    name="user-feedback",
    value=1,  # thumbs up
    comment="Helpful response"
)

# Run automated evaluation
def evaluate_helpfulness(input_text, output_text):
    # Your evaluation logic
    return 0.85

score = evaluate_helpfulness(
    generation.input,
    generation.output
)

langfuse.score(
    trace_id=trace.id,
    name="helpfulness",
    value=score
)`,
        javascript: `import { Langfuse } from "langfuse";

const langfuse = new Langfuse();

// Create a trace with evaluation data
const trace = langfuse.trace({ name: "customer-query" });

const generation = trace.generation({
  name: "response",
  input: "How do I reset my password?",
  output: "You can reset your password by clicking the 'Forgot Password' link on the login page.",
  model: "gpt-4"
});

// Add user feedback
langfuse.score({
  traceId: trace.id,
  name: "user-feedback",
  value: 1,  // thumbs up
  comment: "Helpful response"
});

// Run automated evaluation
function evaluateHelpfulness(inputText, outputText) {
  // Your evaluation logic
  return 0.85;
}

const score = evaluateHelpfulness(
  generation.input,
  generation.output
);

langfuse.score({
  traceId: trace.id,
  name: "helpfulness",
  value: score
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
    body: "Create manual annotations to provide feedback, corrections, and improvements to your LLM outputs. Use annotations to build high-quality datasets and improve model performance.",
    docsHref: "/docs/evaluation/evaluation-methods/annotation",
    image: {
      light: AnnotationPng,
      dark: AnnotationPng,
      alt: "Langfuse annotation interface for manual feedback and corrections",
    },
    quickstartHref: "/docs/prompt-management/features/playground",
    displayMode: "image-only",
  },
  {
    id: "public-api",
    icon: Globe,
    title: "Public API",
    subtitle: "Full REST API access to all features.",
    body: "Access all Langfuse features programmatically through our comprehensive REST API. Integrate with your existing workflows, build custom dashboards, and automate your LLM operations.",
    docsHref: "/docs/api",
    image: {
      light: observabilityPng, // Placeholder - needs API documentation screenshot
      dark: observabilityPng,
      alt: "Langfuse API documentation and examples",
    },
    code: {
      snippets: {
        javascript: `// Using the Langfuse REST API
const LANGFUSE_BASE_URL = "https://cloud.langfuse.com";
const API_KEY = process.env.LANGFUSE_PUBLIC_KEY;
const SECRET_KEY = process.env.LANGFUSE_SECRET_KEY;

// Fetch traces with filtering
async function getTraces() {
  const response = await fetch(\`\${LANGFUSE_BASE_URL}/api/public/traces\`, {
    headers: {
      'Authorization': \`Basic \${btoa(API_KEY + ':' + SECRET_KEY)}\`,
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  return data.data;
}

// Create a new trace via API
async function createTrace(traceData) {
  const response = await fetch(\`\${LANGFUSE_BASE_URL}/api/public/traces\`, {
    method: 'POST',
    headers: {
      'Authorization': \`Basic \${btoa(API_KEY + ':' + SECRET_KEY)}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: traceData.name,
      userId: traceData.userId,
      metadata: traceData.metadata
    })
  });

  return response.json();
}`,
        python: `import requests
import base64
import os

# Using the Langfuse REST API
LANGFUSE_BASE_URL = "https://cloud.langfuse.com"
API_KEY = os.getenv("LANGFUSE_PUBLIC_KEY")
SECRET_KEY = os.getenv("LANGFUSE_SECRET_KEY")

# Create authorization header
auth_string = f"{API_KEY}:{SECRET_KEY}"
auth_bytes = base64.b64encode(auth_string.encode()).decode()

headers = {
    'Authorization': f'Basic {auth_bytes}',
    'Content-Type': 'application/json'
}

# Fetch traces with filtering
def get_traces():
    response = requests.get(
        f"{LANGFUSE_BASE_URL}/api/public/traces",
        headers=headers
    )
    return response.json()['data']

# Create a new trace via API
def create_trace(trace_data):
    response = requests.post(
        f"{LANGFUSE_BASE_URL}/api/public/traces",
        headers=headers,
        json={
            "name": trace_data["name"],
            "userId": trace_data["userId"],
            "metadata": trace_data["metadata"]
        }
    )
    return response.json()`,
      },
    },
    quickstartHref: "/docs/api-and-data-platform/overview",
    displayMode: "code-only",
  },
];
