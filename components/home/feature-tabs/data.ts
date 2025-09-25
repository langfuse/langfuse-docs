import {
  TextQuote,
  LineChart,
  GitPullRequestArrow,
  ThumbsUp,
  FlaskConical,
  Globe,
} from "lucide-react";
import type { FeatureTabData } from "./types";

// Import existing images from the bento grid
import bentoTracePng from "../img/bento_trace.png";
import bentoTraceDarkPng from "../img/bento_trace_dark.png";
import bentoMetricsPng from "../img/bento_metrics.png";
import bentoMetricsDarkPng from "../img/bento_metrics_dark.png";
import bentoPromptPng from "../img/bento_prompt_management.png";
import bentoPromptDarkPng from "../img/bento_prompt_management_dark.png";

export const featureTabsData: FeatureTabData[] = [
  {
    id: "observability",
    icon: TextQuote,
    title: "Observability",
    subtitle: "Trace every LLM call with cost & latency.",
    body: "Langfuse captures complete traces across your LLM stack (requests, tools, retries), tagged by user/session, with timing and token cost. Use trace → observation hierarchy to inspect failures and performance regressions.",
    docsHref: "/docs/observability/overview",
    videoHref: "/watch-demo?tab=observability",
    image: {
      light: bentoTracePng,
      dark: bentoTraceDarkPng,
      alt: "Langfuse observability trace detail view showing nested observations with latency and cost"
    },
    code: {
      language: "python",
      snippet: `from langfuse import Langfuse

# Initialize Langfuse client
langfuse = Langfuse()

# Create a trace for your LLM application
trace = langfuse.trace(
    name="chat-completion",
    user_id="user-123",
    session_id="session-456",
    metadata={"environment": "production"}
)

# Track the LLM call
generation = trace.generation(
    name="openai-completion",
    model="gpt-4",
    input=[{"role": "user", "content": "What is the capital of France?"}],
    metadata={"temperature": 0.7}
)

# Complete the generation with output and usage
generation.end(
    output="The capital of France is Paris.",
    usage={
        "input_tokens": 12,
        "output_tokens": 8,
        "total_tokens": 20
    }
)`
    },
    quickstartHref: "/docs/get-started"
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
      light: bentoMetricsPng,
      dark: bentoMetricsDarkPng,
      alt: "Langfuse analytics dashboard showing cost and latency metrics over time"
    },
    code: {
      language: "python",
      snippet: `from langfuse import Langfuse

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
)`
    },
    quickstartHref: "/docs/analytics"
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
      light: bentoPromptPng,
      dark: bentoPromptDarkPng,
      alt: "Langfuse prompt management interface showing versioned prompts"
    },
    code: {
      language: "python",
      snippet: `from langfuse import Langfuse

langfuse = Langfuse()

# Fetch the latest prompt version
prompt = langfuse.get_prompt("customer-support-chat")

# Compile prompt with variables
compiled = prompt.compile(
    customer_name="Alice Johnson",
    issue_type="billing",
    urgency="high"
)

# Use with OpenAI
import openai
response = openai.chat.completions.create(
    model="gpt-4",
    messages=compiled.to_openai_messages(),
    temperature=prompt.config.get("temperature", 0.7)
)

# Track usage back to Langfuse
langfuse.generation(
    name="support-response",
    prompt=prompt,
    input=compiled.to_openai_messages(),
    output=response.choices[0].message.content,
    model="gpt-4",
    usage={
        "input_tokens": response.usage.prompt_tokens,
        "output_tokens": response.usage.completion_tokens
    }
)`
    },
    quickstartHref: "/docs/prompt-management/get-started"
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
      light: bentoTracePng, // Placeholder - needs evaluation screenshot
      dark: bentoTraceDarkPng,
      alt: "Langfuse evaluation interface showing feedback and scores"
    },
    code: {
      language: "python",
      snippet: `from langfuse import Langfuse

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
)`
    },
    quickstartHref: "/docs/evaluation/get-started"
  },
  {
    id: "playground",
    icon: FlaskConical,
    title: "Playground",
    subtitle: "Test prompts and models interactively.",
    body: "Experiment with different prompts, models, and parameters in an interactive playground. Compare outputs, iterate on prompts, and save successful configurations.",
    docsHref: "/docs/prompt-management/features/playground",
    image: {
      light: bentoTracePng, // Placeholder - needs playground screenshot
      dark: bentoTraceDarkPng,
      alt: "Langfuse playground interface for testing prompts and models"
    },
    code: {
      language: "python",
      snippet: `from langfuse import Langfuse

langfuse = Langfuse()

# Test prompt variations in playground
prompt_v1 = langfuse.get_prompt("product-description", version=1)
prompt_v2 = langfuse.get_prompt("product-description", version=2)

# Compare different models and configurations
test_configs = [
    {"model": "gpt-4", "temperature": 0.3},
    {"model": "gpt-3.5-turbo", "temperature": 0.7},
    {"model": "claude-3-sonnet", "temperature": 0.5}
]

product_data = {
    "name": "Wireless Headphones",
    "features": ["noise-cancelling", "20h battery", "bluetooth 5.0"]
}

for config in test_configs:
    compiled = prompt_v2.compile(**product_data)

    # Generate and track in playground session
    response = langfuse.generation(
        name=f"playground-test-{config['model']}",
        prompt=prompt_v2,
        input=compiled,
        model=config["model"],
        model_parameters={"temperature": config["temperature"]}
    )`
    },
    quickstartHref: "/docs/prompt-management/features/playground"
  },
  {
    id: "public-api",
    icon: Globe,
    title: "Public API",
    subtitle: "Full REST API access to all features.",
    body: "Access all Langfuse features programmatically through our comprehensive REST API. Integrate with your existing workflows, build custom dashboards, and automate your LLM operations.",
    docsHref: "/docs/api",
    image: {
      light: bentoTracePng, // Placeholder - needs API documentation screenshot
      dark: bentoTraceDarkPng,
      alt: "Langfuse API documentation and examples"
    },
    code: {
      language: "javascript",
      snippet: `// Using the Langfuse REST API
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
}`
    },
    quickstartHref: "/docs/api"
  }
];