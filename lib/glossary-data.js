// @ts-check

const CATEGORIES = {
  OBSERVABILITY: {
    label: "Observability",
  },
  EVALUATION: {
    label: "Evaluation",
  },
  PROMPTS: {
    label: "Prompts",
  },
  SDK: {
    label: "SDK",
  },
  PLATFORM: {
    label: "Platform",
  },
  API: {
    label: "API",
  },
};

/** @type {import("../components/Glossary").GlossaryTerm[]} */
const TERMS = [
  {
    term: "AI Engineering Loop",
    id: "ai-engineering-loop",
    definition:
      "A lifecycle for continuously improving AI-powered systems by connecting production visibility with development workflows. It moves from tracing and monitoring real behavior to building datasets, running experiments, and evaluating changes before the cycle starts again.",
    link: "/academy/ai-engineering-loop",
    categories: ["OBSERVABILITY", "EVALUATION"],
    relatedTerms: ["Trace", "LLM-as-a-Judge", "Dataset", "Evaluator"],
  },
  {
    term: "Agent",
    id: "agent",
    definition:
      "An observation type that represents an AI agent workflow, including multi-step reasoning processes, tool orchestration, and autonomous decision-making. Used to track agent behavior and interactions.",
    link: "/docs/observability/features/observation-types",
    categories: ["OBSERVABILITY"],
    relatedTerms: ["Observation", "Tool", "Agent Graph", "Span"],
    synonyms: ["Observation Type"],
  },
  {
    term: "Agent Graph",
    id: "agent-graph",
    definition:
      "A visual representation of complex AI agent workflows in Langfuse. Agent graphs help you understand and debug multi-step reasoning processes and agent interactions by displaying the flow of observations within a trace.",
    link: "/docs/observability/features/agent-graphs",
    categories: ["OBSERVABILITY"],
    relatedTerms: ["Trace", "Observation", "Agent", "Span"],
  },
  {
    term: "Annotation Queue",
    id: "annotation-queue",
    definition:
      "A manual evaluation method that allows domain experts to review and add scores and comments to traces, observations, or sessions. Useful for building ground truth, systematic labeling, and team collaboration.",
    link: "/docs/evaluation/evaluation-methods/annotation-queues",
    categories: ["EVALUATION"],
    relatedTerms: ["Score", "Trace", "Session", "Online Evaluation"],
  },
  {
    term: "Billable Unit",
    id: "billable-unit",
    definition:
      "The unit of measurement for Langfuse Cloud pricing. Units are the sum of traces, observations, and scores ingested per billing period.",
    link: "/docs/administration/billable-units",
    categories: ["PLATFORM"],
    relatedTerms: ["Trace", "Observation", "Score"],
  },
  {
    term: "API Key",
    id: "api-key",
    definition:
      "Credentials used to authenticate with the Langfuse API and SDKs. API keys consist of a public key and secret key and are associated with a specific project. They are managed in project settings.",
    link: "/docs/administration/rbac",
    categories: ["PLATFORM", "API"],
    relatedTerms: ["Project", "Public API", "SDK"],
  },
  {
    term: "Chain",
    id: "chain",
    definition:
      "An observation type that represents a link between different application steps, such as passing context from a retriever to an LLM call.",
    link: "/docs/observability/features/observation-types",
    categories: ["OBSERVABILITY"],
    relatedTerms: ["Observation", "Span", "Retriever", "Generation"],
    synonyms: ["Observation Type"],
  },
  {
    term: "Chat Prompt",
    id: "chat-prompt",
    definition:
      "A prompt type that consists of an array of messages with specific roles (system, user, assistant). Useful for managing complete conversation structures and chat history.",
    link: "/docs/prompt-management/data-model#text-vs-chat-prompts",
    categories: ["PROMPTS"],
    relatedTerms: ["Text Prompt", "Prompt Management", "Prompt Variables"],
    synonyms: ["Message Prompt"],
  },
  {
    term: "Custom Dashboards",
    id: "custom-dashboards",
    definition:
      "Flexible, self-service analytics dashboards that allow you to visualize and monitor metrics from your LLM application. Dashboards support multiple chart types, filtering, and multi-level aggregations.",
    link: "/docs/metrics/features/custom-dashboards",
    categories: ["OBSERVABILITY"],
    relatedTerms: ["Score", "Token Tracking"],
  },
  {
    term: "Remote Experiment",
    id: "remote-experiment",
    definition:
      "A webhook-based trigger that allows running SDK experiments from the Langfuse UI. Configure a webhook URL and default config, then trigger experiments that fetch the dataset, run your application, and ingest scores back into Langfuse.",
    link: "/docs/evaluation/experiments/experiments-via-sdk#optional-trigger-sdk-experiment-from-ui",
    categories: ["EVALUATION"],
    relatedTerms: ["Dataset", "Dataset Experiment", "Score"],
  },
  {
    term: "Dataset",
    id: "dataset",
    definition:
      "A collection of test cases (dataset items) used to test and benchmark LLM applications. Datasets contain inputs and optionally expected outputs for systematic testing.",
    link: "/docs/evaluation/experiments/datasets",
    categories: ["EVALUATION"],
    relatedTerms: ["Dataset Item", "Dataset Experiment", "Offline Evaluation"],
  },
  {
    term: "Dataset Item",
    id: "dataset-item",
    definition:
      "An individual test case within a dataset. Each item contains an input (the scenario to test) and optionally an expected output.",
    link: "/docs/evaluation/experiments/data-model#datasetitem-object",
    categories: ["EVALUATION"],
    relatedTerms: ["Dataset", "Dataset Experiment", "Task"],
  },
  {
    term: "Dataset Experiment",
    id: "dataset-experiment",
    definition:
      "Also known as a Dataset Run. The execution of a dataset through your LLM application, producing outputs that can be evaluated. Links dataset items to their corresponding traces.",
    link: "/docs/evaluation/experiments/data-model#datasetrun-experiment-run",
    categories: ["EVALUATION"],
    relatedTerms: ["Dataset", "Dataset Item", "Task", "Score"],
    synonyms: ["Dataset Run", "Experiment Run"],
  },
  {
    term: "Embedding",
    id: "embedding",
    definition:
      "An observation type that represents a call to an LLM to generate embeddings. Can include model information, token usage, and costs.",
    link: "/docs/observability/features/observation-types",
    categories: ["OBSERVABILITY"],
    relatedTerms: ["Observation", "Generation", "Retriever", "Token Tracking"],
    synonyms: ["Observation Type"],
  },
  {
    term: "Environment",
    id: "environment",
    definition:
      "A way to organize traces, observations, and scores from different deployment contexts (e.g., production, staging, development). Helps keep data separate while using the same project.",
    link: "/docs/observability/features/environments",
    categories: ["OBSERVABILITY"],
    relatedTerms: ["Project", "Trace", "Tags"],
  },
  {
    term: "Evaluation Method",
    id: "evaluation-method",
    definition:
      "A function that scores traces, observations, sessions, or dataset runs. Methods include LLM-as-a-Judge for subjective assessments, Annotation Queues for human review, Scores via UI for spot checks, and Scores via API/SDK for programmatic evaluation.",
    link: "/docs/evaluation/core-concepts#evaluation-methods",
    categories: ["EVALUATION"],
    relatedTerms: [
      "Score",
      "LLM-as-a-Judge",
      "Annotation Queue",
      "Dataset Experiment",
    ],
  },
  {
    term: "Evaluator",
    id: "evaluator",
    definition:
      "An observation type that represents functions assessing the relevance, correctness, or helpfulness of LLM outputs. Also refers to the function that scores experiment results.",
    link: "/docs/observability/features/observation-types",
    categories: ["OBSERVABILITY"],
    relatedTerms: [
      "Score",
      "LLM-as-a-Judge",
      "Observation",
      "Evaluation Method",
    ],
    synonyms: ["Observation Type"],
  },
  {
    term: "Event",
    id: "event",
    definition:
      "A basic observation type used to track discrete events in a trace. Events are the building blocks of tracing.",
    link: "/docs/observability/features/observation-types",
    categories: ["OBSERVABILITY"],
    relatedTerms: ["Observation", "Span", "Trace"],
    synonyms: ["Observation Type"],
  },
  {
    term: "Flush",
    id: "flush",
    definition:
      "The process of sending buffered trace data to the Langfuse server. Important for short-lived applications to ensure no data is lost when the process terminates.",
    link: "/docs/observability/sdk/instrumentation#client-lifecycle--flushing",
    categories: ["SDK"],
    relatedTerms: ["SDK", "Trace", "Instrumentation"],
  },
  {
    term: "Generation",
    id: "generation",
    definition:
      "An observation type that logs outputs from AI models including prompts, completions, token usage, and costs. The most common observation type for LLM calls.",
    link: "/docs/observability/features/observation-types",
    categories: ["OBSERVABILITY"],
    relatedTerms: ["Observation", "Token Tracking", "Span"],
    synonyms: ["Observation Type"],
  },
  {
    term: "Guardrail",
    id: "guardrail",
    definition:
      "An observation type that represents a component protecting against malicious content, jailbreaks, or other security risks.",
    link: "/docs/observability/features/observation-types",
    categories: ["OBSERVABILITY"],
    relatedTerms: ["Observation", "Trace", "Agent"],
    synonyms: ["Observation Type"],
  },
  {
    term: "Instrumentation",
    id: "instrumentation",
    definition:
      "The process of adding code to record application behavior. Langfuse provides context managers, observe wrappers, and manual observation methods for instrumenting your application.",
    link: "/docs/observability/sdk/instrumentation",
    categories: ["SDK", "OBSERVABILITY"],
    relatedTerms: ["SDK", "Trace", "Observation", "Flush"],
  },
  {
    term: "LLM Connection",
    id: "llm-connection",
    definition:
      "An API key configuration that allows Langfuse to call LLM models in the Playground or for LLM-as-a-Judge evaluations. Supports providers like OpenAI, Anthropic, and Google.",
    link: "/docs/administration/llm-connection",
    categories: ["PLATFORM"],
    relatedTerms: ["Playground", "LLM-as-a-Judge"],
  },
  {
    term: "LLM-as-a-Judge",
    id: "llm-as-a-judge",
    definition:
      "An evaluation method that uses an LLM to score the output of your application based on custom criteria. Provides scalable, repeatable evaluations with chain-of-thought reasoning.",
    link: "/docs/evaluation/evaluation-methods/llm-as-a-judge",
    categories: ["EVALUATION"],
    relatedTerms: [
      "Score",
      "Evaluator",
      "Online Evaluation",
      "Offline Evaluation",
    ],
  },
  {
    term: "Log View",
    id: "log-view",
    definition:
      "Shows all observations concatenated. Great for quickly scanning through them.",
    link: "/docs/observability/overview",
    categories: ["OBSERVABILITY"],
    relatedTerms: ["Agent Graph"],
  },
  {
    term: "MCP Server",
    id: "mcp-server",
    definition:
      "A Model Context Protocol server that enables AI-powered tools to interact with Langfuse data. Used for advanced integrations and AI-assisted workflows.",
    link: "/docs/api-and-data-platform/features/mcp-server",
    categories: ["PLATFORM"],
    relatedTerms: ["Public API", "SDK"],
  },
  {
    term: "Metrics API",
    id: "metrics-api",
    definition:
      "An API endpoint for retrieving customized analytics from Langfuse data. Allows specifying dimensions, metrics, filters, and time granularity to build custom reports and dashboards for LLM applications.",
    link: "/docs/metrics/features/metrics-api",
    categories: ["API"],
    relatedTerms: ["Custom Dashboards", "Public API", "Token"],
  },
  {
    term: "Model Definition",
    id: "model-definition",
    definition:
      "A configuration that stores pricing information for an LLM model. Model definitions specify the cost per input and output token, enabling Langfuse to automatically calculate the price of generations based on token usage.",
    link: "/docs/observability/features/token-and-cost-tracking",
    categories: ["OBSERVABILITY"],
    relatedTerms: ["Token", "Generation", "Custom Dashboards"],
  },
  {
    term: "Observation",
    id: "observation",
    definition:
      "An individual step within a trace. Observations can be of different types (span, generation, event, tool, etc.) and can be nested to represent hierarchical workflows.",
    link: "/docs/observability/data-model",
    categories: ["OBSERVABILITY"],
    relatedTerms: ["Trace", "Span", "Generation", "Event"],
  },
  {
    term: "Offline Evaluation",
    id: "offline-evaluation",
    definition:
      "Testing your application against a fixed dataset before deployment. Used to validate changes and catch regressions during development.",
    link: "/docs/evaluation/core-concepts#the-evaluation-loop",
    categories: ["EVALUATION"],
    relatedTerms: [
      "Dataset",
      "Online Evaluation",
      "Score",
      "Dataset Experiment",
    ],
  },
  {
    term: "Online Evaluation",
    id: "online-evaluation",
    definition:
      "Scoring live production traces to catch issues in real traffic. Helps identify edge cases and monitor application quality in production.",
    link: "/docs/evaluation/core-concepts#online-evaluation",
    categories: ["EVALUATION"],
    relatedTerms: ["Trace", "Score", "Offline Evaluation", "LLM-as-a-Judge"],
  },
  {
    term: "OpenTelemetry",
    id: "opentelemetry",
    definition:
      "An open standard for collecting telemetry data from applications. Langfuse is built on OpenTelemetry, enabling interoperability and reducing vendor lock-in.",
    link: "/integrations/native/opentelemetry",
    categories: ["OBSERVABILITY", "SDK"],
    relatedTerms: ["Trace", "Span", "Instrumentation"],
    synonyms: ["OTel"],
  },
  {
    term: "Organization",
    id: "organization",
    definition:
      "A top-level entity in Langfuse that contains projects. Organizations manage billing, team members, and SSO configuration.",
    link: "/docs/administration/rbac",
    categories: ["PLATFORM"],
    relatedTerms: ["Project", "RBAC"],
  },
  {
    term: "Playground",
    id: "playground",
    definition:
      "The LLM Playground where you can test, iterate, and compare different prompts and models directly in Langfuse without writing code.",
    link: "/docs/prompt-management/features/playground",
    categories: ["PROMPTS"],
    relatedTerms: ["Chat Prompt", "Text Prompt", "LLM Connection"],
  },
  {
    term: "Project",
    id: "project",
    definition:
      "A container that groups all Langfuse data within an organization. Projects enable fine-grained role-based access control and separate data for different applications.",
    link: "/docs/administration/rbac",
    categories: ["PLATFORM"],
    relatedTerms: ["Organization", "RBAC", "API Key", "Environment"],
  },
  {
    term: "Prompt Management",
    id: "prompt-management",
    definition:
      "A systematic approach to storing, versioning, and retrieving prompts for LLM applications. Decouples prompt updates from code deployment.",
    link: "/docs/prompt-management/overview",
    categories: ["PROMPTS"],
    relatedTerms: [
      "Chat Prompt",
      "Text Prompt",
      "Prompt Variables",
      "Playground",
    ],
  },
  {
    term: "Prompt Label",
    id: "prompt-label",
    definition:
      "A label that can be assigned to a prompt version. Used to mark prompt versions as production or staging to fetch them via the SDK or API.",
    link: "/docs/prompt-management/features/prompt-version-control",
    categories: ["PROMPTS"],
    relatedTerms: ["Prompt Management", "Protected Prompt Label"],
  },
  {
    term: "Protected Prompt Label",
    id: "protected-prompt-label",
    definition:
      "Restricts the ability to modify certain prompt labels (e.g. production) from being added to new prompt versions to admins and owners. This prevents accidental or unauthorized changes to production prompts.",
    link: "/docs/prompt-management/features/prompt-version-control",
    categories: ["PROMPTS"],
    relatedTerms: ["Prompt Management", "Environment"],
  },
  {
    term: "Public API",
    id: "public-api",
    definition:
      "The REST API that provides access to all Langfuse data and features. Used for custom integrations, workflows, and programmatic access.",
    link: "/docs/api-and-data-platform/features/public-api",
    categories: ["API"],
    relatedTerms: ["SDK", "API Key", "MCP Server"],
  },
  {
    term: "RBAC",
    id: "rbac",
    definition:
      "Role-Based Access Control that manages permissions within Langfuse. Roles include Owner, Admin, Member, Viewer, and None, each with specific scopes.",
    link: "/docs/administration/rbac",
    categories: ["PLATFORM"],
    relatedTerms: ["Organization", "Project"],
    synonyms: ["Role-Based Access Control"],
  },
  {
    term: "Retriever",
    id: "retriever",
    definition:
      "An observation type that represents data retrieval steps, such as calls to vector stores or databases in RAG applications.",
    link: "/docs/observability/features/observation-types",
    categories: ["OBSERVABILITY"],
    relatedTerms: ["Observation", "Chain", "Embedding"],
    synonyms: ["Observation Type"],
  },
  {
    term: "Score",
    id: "score",
    definition:
      "The output of an annotation or automated evaluation. Scores can be numeric, categorical, boolean, or text and are assigned to traces, observations, sessions, or dataset runs.",
    link: "/docs/evaluation/scores/data-model#scores",
    categories: ["EVALUATION"],
    relatedTerms: [
      "Score Config",
      "Evaluator",
      "LLM-as-a-Judge",
      "Annotation Queue",
    ],
  },
  {
    term: "Score Config",
    id: "score-config",
    definition:
      "A configuration defining how a score is calculated and interpreted. Includes data type, value constraints, and categories for standardized scoring.",
    link: "/docs/evaluation/scores/data-model#score-config",
    categories: ["EVALUATION"],
    relatedTerms: ["Score", "LLM-as-a-Judge"],
  },
  {
    term: "SDK",
    id: "sdk",
    definition:
      "Software Development Kit. Langfuse provides native SDKs for Python and JavaScript/TypeScript that handle tracing, prompt management, and API access.",
    link: "/docs/observability/sdk/overview",
    categories: ["SDK"],
    relatedTerms: ["Instrumentation", "Flush", "Public API"],
    synonyms: ["Software Development Kit"],
  },
  {
    term: "Session",
    id: "session",
    definition:
      "A way to group related traces that are part of the same user interaction. Commonly used for multi-turn conversations or chat threads.",
    link: "/docs/observability/features/sessions",
    categories: ["OBSERVABILITY"],
    relatedTerms: ["Trace", "User Tracking"],
  },
  {
    term: "Span",
    id: "span",
    definition:
      "An observation type that represents the duration of a unit of work in a trace. The default observation type for most operations.",
    link: "/docs/observability/features/observation-types",
    categories: ["OBSERVABILITY"],
    relatedTerms: ["Observation", "Trace", "Generation", "OpenTelemetry"],
    synonyms: ["Observation Type"],
  },
  {
    term: "Tags",
    id: "tags",
    definition:
      "Flexible labels that categorize and filter traces and observations. Useful for organizing by feature, API endpoint, workflow, or other criteria.",
    link: "/docs/observability/features/tags",
    categories: ["OBSERVABILITY"],
    relatedTerms: ["Trace", "Environment"],
  },
  {
    term: "Task",
    id: "task",
    definition:
      "A function definition that processes dataset items during an experiment. The task represents the application code you want to test.",
    link: "/docs/evaluation/experiments/data-model#task",
    categories: ["EVALUATION"],
    relatedTerms: ["Dataset", "Dataset Item", "Dataset Experiment"],
  },
  {
    term: "Text Prompt",
    id: "text-prompt",
    definition:
      "A prompt type that consists of a single string. Ideal for simple use cases or when you only need a system message.",
    link: "/docs/prompt-management/data-model#text-vs-chat-prompts",
    categories: ["PROMPTS"],
    relatedTerms: ["Chat Prompt", "Prompt Management", "Prompt Variables"],
    synonyms: ["String Prompt"],
  },
  {
    term: "Token",
    id: "token",
    definition:
      "The basic unit of text that LLMs process. Tokens can be words, parts of words, or characters depending on the model's tokenizer. Token counts determine API costs and context window limits. Langfuse tracks input and output tokens for cost monitoring and optimization.",
    link: "/docs/observability/features/token-and-cost-tracking",
    categories: ["OBSERVABILITY"],
    relatedTerms: ["Generation", "Custom Dashboards"],
  },
  {
    term: "Tool",
    id: "tool",
    definition:
      "An observation type that represents a tool call in your application, such as calling a weather API or executing a database query.",
    link: "/docs/observability/features/observation-types",
    categories: ["OBSERVABILITY"],
    relatedTerms: ["Observation", "Agent", "Span", "Agent Graph"],
    synonyms: ["Observation Type"],
  },
  {
    term: "Trace",
    id: "trace",
    definition:
      "A single request or operation in your LLM application. Traces contain the overall input, output, and metadata, along with nested observations that capture each step.",
    link: "/docs/observability/data-model",
    categories: ["OBSERVABILITY"],
    relatedTerms: ["Observation", "Session", "Span", "Generation"],
  },
  {
    term: "Tracing",
    id: "tracing",
    definition:
      "The process of capturing structured logs of every request in your LLM application. Includes prompts, responses, token usage, latency, and any intermediate steps.",
    link: "/docs/observability/overview",
    categories: ["OBSERVABILITY"],
    relatedTerms: ["Trace", "Instrumentation", "SDK"],
  },
  {
    term: "User Tracking",
    id: "user-tracking",
    definition:
      "The ability to associate traces with users via a userId. Enables per-user analytics, cost tracking, and filtering.",
    link: "/docs/observability/features/users",
    categories: ["OBSERVABILITY"],
    relatedTerms: ["Trace", "Session"],
  },
  {
    term: "Prompt Variables",
    id: "prompt-variables",
    definition:
      "Placeholders in prompts that are dynamically filled at runtime. Allow creating reusable prompt templates with customizable content.",
    link: "/docs/prompt-management/features/variables",
    categories: ["PROMPTS"],
    relatedTerms: ["Prompt Management", "Chat Prompt", "Text Prompt"],
  },
];

module.exports = {
  CATEGORIES,
  TERMS,
};
