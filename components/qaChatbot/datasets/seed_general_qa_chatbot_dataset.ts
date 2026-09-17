type Behavior = "answer" | "ask_follow_up" | "defer_question";
type Category = "typical_case" | "should_defer";
type Source = "production_trace" | "synthetic_defer";
type SeedMessage = { role: "user" | "assistant"; content: string };

type SeedItem = {
  id: string;
  question: string;
  messages?: SeedMessage[];
  sampleReply: string;
  behavior: Behavior;
  keywords: [string, string, string];
  category: Category;
  source: Source;
  topic: string;
  language?: string;
  sourceTraceId?: string;
  sourceObservationId?: string;
};

const DATASET_NAME = "general QA chatbot";
const SCHEMA_VERSION = "general_qa_chatbot_v1";

const inputSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  additionalProperties: false,
  required: ["messages"],
  properties: {
    messages: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["role", "content"],
        properties: {
          role: {
            type: "string",
            enum: ["system", "user", "assistant", "tool"],
          },
          content: { type: "string" },
        },
      },
    },
  },
};

const expectedOutputSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  additionalProperties: false,
  required: ["sample_reply", "general_behavior", "keyword_overlap"],
  properties: {
    sample_reply: { type: "string", minLength: 1 },
    general_behavior: {
      type: "string",
      enum: ["answer", "ask_follow_up", "defer_question"],
    },
    keyword_overlap: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: { type: "string", minLength: 1 },
    },
  },
};

const items: SeedItem[] = [
  {
    id: "general-qa-chatbot-v1-01-use-cases",
    question: "What can I use Langfuse for?",
    sampleReply:
      "Langfuse helps teams observe, debug, evaluate, and improve LLM applications. Start with tracing to capture requests, prompts, tool calls, cost, and latency; then add prompt management, datasets, experiments, scores, and dashboards for production monitoring and iteration.",
    behavior: "answer",
    keywords: ["tracing", "evaluations", "prompt management"],
    category: "typical_case",
    source: "production_trace",
    topic: "overview",
    sourceTraceId: "0888d0b775b68df51a3412cef9d7c72c",
    sourceObservationId: "a001b4da986441f6",
  },
  {
    id: "general-qa-chatbot-v1-02-tracing",
    question: "how does tracing work",
    sampleReply:
      "A trace represents one end-to-end request or workflow. Inside it, observations capture the individual steps such as spans, generations, tool calls, retrievers, and events. Use traces to inspect inputs, outputs, latency, token usage, cost, metadata, and where failures happen.",
    behavior: "answer",
    keywords: ["trace", "observations", "latency"],
    category: "typical_case",
    source: "production_trace",
    topic: "tracing",
    sourceTraceId: "9d43da490e4946ad11fc3505e38457f8",
    sourceObservationId: "a9cd35c5e35e97b7",
  },
  {
    id: "general-qa-chatbot-v1-03-overview",
    question: "What is langfuse",
    sampleReply:
      "Langfuse is an open-source AI engineering platform for LLM applications. It combines observability, prompt management, evaluations, datasets, experiments, metrics, and dashboards so teams can debug production behavior and improve quality over time.",
    behavior: "answer",
    keywords: ["open-source", "observability", "evaluations"],
    category: "typical_case",
    source: "production_trace",
    topic: "overview",
    sourceTraceId: "8965d17135ad3f762b3ce72fa162237f",
    sourceObservationId: "1d35c81aff9c85e3",
  },
  {
    id: "general-qa-chatbot-v1-04-korean-get-started",
    question: "langfuse는 어떻게 써야해?",
    sampleReply:
      "Langfuse는 LLM 앱을 추적하고 평가하고 개선하는 데 사용합니다. 먼저 프로젝트를 만들고 SDK 키를 설정한 뒤 Python 또는 JavaScript SDK로 첫 trace를 보내세요. 그 다음 prompt management, datasets, evaluators, dashboards를 추가해 운영 품질을 모니터링할 수 있습니다.",
    behavior: "answer",
    keywords: ["trace", "SDK", "evaluators"],
    category: "typical_case",
    source: "production_trace",
    topic: "getting-started",
    language: "ko",
    sourceTraceId: "98b40ebc40d2c0713ff673cf08cfc4ef",
    sourceObservationId: "04451a8381227922",
  },
  {
    id: "general-qa-chatbot-v1-05-architecture-azure",
    question:
      "Tell me more about the Postgres and Clickhouse use and Azure compatibility",
    messages: [
      { role: "user", content: "What is the Langfuse architecture?" },
      {
        role: "assistant",
        content:
          "At a high level, Langfuse has an application/API layer, workers, Postgres for transactional data, ClickHouse for analytics, and supporting infrastructure such as queues and object storage.",
      },
      {
        role: "user",
        content:
          "Tell me more about the Postgres and Clickhouse use and Azure compatibility",
      },
    ],
    sampleReply:
      "Langfuse uses Postgres for transactional application data and ClickHouse for high-volume analytical trace, observation, score, and metric data. For Azure deployments, use compatible managed Postgres and ClickHouse options or self-host the services, and verify storage, networking, and authentication settings against the self-hosting docs.",
    behavior: "answer",
    keywords: ["Postgres", "ClickHouse", "Azure"],
    category: "typical_case",
    source: "production_trace",
    topic: "self-hosting",
    sourceTraceId: "087814ea5a42c7b5efd10f7b0e5d1377",
    sourceObservationId: "53e0a229a02b1ded",
  },
  {
    id: "general-qa-chatbot-v1-06-architecture",
    question: "What is the Langfuse architecture?",
    sampleReply:
      "At a high level, Langfuse consists of the application/API layer, ingestion and background workers, Postgres for transactional data, ClickHouse for analytics, object storage for blob exports or media, and optional observability infrastructure. For self-hosting, explain the components and point to the deployment docs for the exact version.",
    behavior: "answer",
    keywords: ["application", "Postgres", "ClickHouse"],
    category: "typical_case",
    source: "production_trace",
    topic: "architecture",
    sourceTraceId: "bc9b4cbacdda24b09dd26bd9ea960575",
    sourceObservationId: "a95e2b75d5ce3535",
  },
  {
    id: "general-qa-chatbot-v1-07-start-tracing",
    question: "How do I get started with tracing?",
    sampleReply:
      "Create a Langfuse project, install the SDK or framework integration for your stack, set the public and secret keys, instrument one request, then inspect the trace in the UI. Start with one important production path before adding richer metadata, sessions, users, scores, and dashboards.",
    behavior: "answer",
    keywords: ["project", "SDK", "trace"],
    category: "typical_case",
    source: "production_trace",
    topic: "tracing",
    sourceTraceId: "3c28e14ae5d820f04e2ddf2fe5171a9d",
    sourceObservationId: "361b7512037c86a2",
  },
  {
    id: "general-qa-chatbot-v1-08-python-prompt-linking",
    question: "How do I link my prompts to my traces? My code is in python",
    sampleReply:
      "In Python, fetch the managed prompt from Langfuse, compile it with your variables, pass it to your model call, and attach the prompt object or prompt metadata to the generation so the trace links back to the prompt version. Keep the prompt name and version visible in trace metadata for comparisons.",
    behavior: "answer",
    keywords: ["Python", "managed prompt", "generation"],
    category: "typical_case",
    source: "production_trace",
    topic: "prompt-management",
    sourceTraceId: "8d7015fefcb6e969efab193cc40ae5ae",
    sourceObservationId: "656961cdbdbe7495",
  },
  {
    id: "general-qa-chatbot-v1-09-python-install",
    question: "Hello, how can I install Langfuse library in Python?",
    sampleReply:
      "Install the Python SDK with pip install langfuse, set LANGFUSE_PUBLIC_KEY, LANGFUSE_SECRET_KEY, and LANGFUSE_HOST, then initialize the client or use the relevant integration for your framework. After sending a test trace, verify it in the Langfuse project.",
    behavior: "answer",
    keywords: ["pip install", "Python SDK", "environment variables"],
    category: "typical_case",
    source: "production_trace",
    topic: "sdk",
    sourceTraceId: "1bed1accd93cec9537f205ea1f9befe2",
    sourceObservationId: "44e4ac672274a4ac",
  },
  {
    id: "general-qa-chatbot-v1-10-langgraph",
    question: "how to use langfuse with langgraph",
    sampleReply:
      "Use the Langfuse LangChain CallbackHandler with LangGraph. Pass the handler in the graph invoke or stream config so Langfuse captures graph steps, LLM calls, tool calls, metadata, and the final answer in one trace.",
    behavior: "answer",
    keywords: ["LangGraph", "CallbackHandler", "trace"],
    category: "typical_case",
    source: "production_trace",
    topic: "integrations",
    sourceTraceId: "040801ce2406c35d9fe8ed7f1f229549",
    sourceObservationId: "e79811a435d4bb08",
  },
  {
    id: "general-qa-chatbot-v1-11-langchain",
    question: "does langfuse work with langchain",
    sampleReply:
      "Yes. Langfuse integrates with LangChain through a callback handler that records chains, LLM calls, tools, retrievers, inputs, outputs, latency, tokens, and cost. Add the handler to your LangChain invocation config and include user, session, and release metadata when useful.",
    behavior: "answer",
    keywords: ["LangChain", "callback handler", "metadata"],
    category: "typical_case",
    source: "production_trace",
    topic: "integrations",
    sourceTraceId: "1a464aa74eef4a2b36be00c40dff7ceb",
    sourceObservationId: "46c63bb7bb972a70",
  },
  {
    id: "general-qa-chatbot-v1-12-italian-agent-test-set",
    question:
      "ma come posso usare lanfuse per creare dei test set per i miei agenti multistates?",
    messages: [
      { role: "user", content: "cosa posso chiederti?" },
      {
        role: "assistant",
        content:
          "Posso aiutarti con Langfuse: tracing, SDK e integrazioni, prompt management, dataset, esperimenti, valutazioni, dashboard e self-hosting.",
      },
      {
        role: "user",
        content:
          "ma come posso usare lanfuse per creare dei test set per i miei agenti multistates?",
      },
    ],
    sampleReply:
      "Puoi creare un dataset Langfuse con input realistici, output attesi e metadati sullo stato o sul percorso dell'agente. Poi esegui esperimenti sugli agenti multi-step, salva i risultati come dataset runs e valuta risposta finale, trajectory, tool calls e regressioni con evaluator automatici o review umana.",
    behavior: "answer",
    keywords: ["dataset", "agent", "experiments"],
    category: "typical_case",
    source: "production_trace",
    topic: "datasets",
    language: "it",
    sourceTraceId: "4438d380d910a9c3dba0368d9146ef27",
    sourceObservationId: "95d51892ca2a2d42",
  },
  {
    id: "general-qa-chatbot-v1-13-chinese-overview",
    question: "请简介以下langfuse，以及它的功能",
    sampleReply:
      "Langfuse 是一个开源 AI 工程平台，用于观测、调试、评估和改进 LLM 应用。它支持 tracing、prompt management、datasets、experiments、scores、annotation queues、dashboards，以及 Python/JavaScript SDK 和多种框架集成。",
    behavior: "answer",
    keywords: ["tracing", "prompt management", "datasets"],
    category: "typical_case",
    source: "production_trace",
    topic: "overview",
    language: "zh",
    sourceTraceId: "6e6b5d9b08a78dc2c0a4134cae9098cd",
    sourceObservationId: "8f4a32149261c3c3",
  },
  {
    id: "general-qa-chatbot-v1-14-code-example",
    question: "Give me code example.",
    messages: [
      { role: "user", content: "What can I use Langfuse for?" },
      {
        role: "assistant",
        content:
          "Langfuse helps with LLM observability, tracing, prompt management, evaluations, datasets, experiments, metrics, and dashboards.",
      },
      { role: "user", content: "Give me code example." },
    ],
    sampleReply:
      "Continue from the previous Langfuse overview and provide a minimal default Python first-trace example. Include installation, LANGFUSE_PUBLIC_KEY, LANGFUSE_SECRET_KEY, LANGFUSE_HOST or LANGFUSE_BASE_URL, one traced span or generation, and a note to flush or verify the trace in Langfuse.",
    behavior: "answer",
    keywords: ["Python", "environment variables", "trace"],
    category: "typical_case",
    source: "production_trace",
    topic: "sdk",
    sourceTraceId: "65a168fc6d50d71db9488363f087d649",
    sourceObservationId: "c94676eaeb92b915",
  },
  {
    id: "general-qa-chatbot-v1-15-langgraph-case",
    question: "How do i integrate with Langgraph",
    sampleReply:
      "For LangGraph, use the Langfuse LangChain callback and pass it in the graph invocation config. Show the minimal Python wiring, mention environment variables, and explain that Langfuse will capture graph nodes, model calls, tool calls, and final output in one trace.",
    behavior: "answer",
    keywords: ["LangGraph", "callback", "Python"],
    category: "typical_case",
    source: "production_trace",
    topic: "integrations",
    sourceTraceId: "5e99ab85b19155c9232ca198ee1462f9",
    sourceObservationId: "25de09cc31b30654",
  },
  {
    id: "general-qa-chatbot-v1-16-java",
    question: "what is langfuse and how it's used in java",
    messages: [
      { role: "user", content: "hi" },
      {
        role: "assistant",
        content:
          "Hi! How can I help with Langfuse today: setup, SDK integration, tracing, evaluations, or self-hosting?",
      },
      { role: "user", content: "what is langfuse and how it's used in java" },
    ],
    sampleReply:
      "Langfuse is an open-source platform for tracing, evaluating, and improving LLM applications. For Java, explain the available integration path such as OpenTelemetry or API-based ingestion, then show how to send traces with the right host and API keys and where to inspect them.",
    behavior: "answer",
    keywords: ["Java", "OpenTelemetry", "traces"],
    category: "typical_case",
    source: "production_trace",
    topic: "integrations",
    sourceTraceId: "1c71ba319198e166fd30f6e1ebf81d0e",
    sourceObservationId: "77006eb06195ebb6",
  },
  {
    id: "general-qa-chatbot-v1-17-why-langfuse",
    question: "Why langfuse?",
    sampleReply:
      "Langfuse is useful when you need a shared system for LLM observability, prompt management, evaluations, datasets, experiments, and monitoring. Emphasize debugging production behavior, measuring quality and cost, preventing regressions, and supporting open-source or self-hosted deployments.",
    behavior: "answer",
    keywords: ["observability", "quality", "self-hosted"],
    category: "typical_case",
    source: "production_trace",
    topic: "overview",
    sourceTraceId: "8a1d0acfb2eab15f86441d7d5a2f94dd",
    sourceObservationId: "5234df5d0af5b8f3",
  },
  {
    id: "general-qa-chatbot-v1-18-django",
    question: "integra con django?",
    sampleReply:
      "Si. Per Django puoi usare l'SDK Python di Langfuse o un'integrazione compatibile con LangChain/OpenTelemetry. Spiega come impostare le chiavi, creare o propagare una trace per richiesta, aggiungere metadata come user/session, e verificare i risultati nella UI.",
    behavior: "answer",
    keywords: ["Django", "Python SDK", "trace"],
    category: "typical_case",
    source: "production_trace",
    topic: "integrations",
    language: "it",
    sourceTraceId: "326d6fc27e4b05e49cd1df4517a934d5",
    sourceObservationId: "65e425c77e7452a8",
  },
  {
    id: "general-qa-chatbot-v1-19-bedrock-agentcore",
    question: "How do i integrate with Amazon Bedrock agentcore",
    sampleReply:
      "Use Langfuse with Amazon Bedrock AgentCore through the documented integration path, typically OpenTelemetry or the relevant framework integration. Give the minimal setup steps, include API key and host configuration, and explain how traces, spans, tool calls, latency, and cost should appear in Langfuse.",
    behavior: "answer",
    keywords: ["Amazon Bedrock", "AgentCore", "OpenTelemetry"],
    category: "typical_case",
    source: "production_trace",
    topic: "integrations",
    sourceTraceId: "ba982e3f7828a67982370a81c558a07e",
    sourceObservationId: "8871ca9203baa236",
  },
  {
    id: "general-qa-chatbot-v1-20-params-clarification",
    question: "Test what params look like",
    sampleReply:
      "Ask which parameters the user wants to inspect: model parameters on generations, prompt variables, trace or observation metadata, SDK initialization options, or API request fields. Offer to show a small example once they choose the parameter type.",
    behavior: "ask_follow_up",
    keywords: ["parameters", "generation", "metadata"],
    category: "typical_case",
    source: "production_trace",
    topic: "clarification",
    sourceTraceId: "8a830d70a0228b9d7717febb9c0e6a96",
    sourceObservationId: "4986271e73298b80",
  },
  {
    id: "general-qa-chatbot-v1-21-user-says-not-work",
    question: "No does not work",
    messages: [
      {
        role: "user",
        content: "How do I link my prompts to my traces? My code is in python",
      },
      {
        role: "assistant",
        content:
          "Fetch the managed prompt in Python, use it in the model call, and attach the prompt object to the generation so the trace links back to the prompt version.",
      },
      { role: "user", content: "No does not work" },
    ],
    sampleReply:
      "Acknowledge that the previous prompt-linking guidance failed and stay on that task. Give a concrete Python alternative such as passing the prompt object to a generation or updating the current generation with the prompt, then ask for the exact error or code snippet if it still does not work.",
    behavior: "answer",
    keywords: ["prompt", "generation", "error"],
    category: "typical_case",
    source: "production_trace",
    topic: "troubleshooting",
    sourceTraceId: "657de9df37fdfebd19a050966d133286",
    sourceObservationId: "0b39a62ac05e83e4",
  },
  {
    id: "general-qa-chatbot-v1-22-user-disagrees",
    question: "no thats not true",
    messages: [
      { role: "user", content: "What can I use Langfuse for?" },
      {
        role: "assistant",
        content:
          "Langfuse is an open-source AI engineering platform for observability and tracing, prompt management, evaluation and experiments, metrics, and dashboards.",
      },
      { role: "user", content: "no thats not true" },
    ],
    sampleReply:
      "Apologize briefly, ask what part is incorrect, and request the relevant context or link. The assistant should avoid doubling down and should offer to correct the answer once the user identifies the mismatch.",
    behavior: "ask_follow_up",
    keywords: ["incorrect", "context", "correct"],
    category: "typical_case",
    source: "production_trace",
    topic: "feedback",
    sourceTraceId: "1aba00a20e37deffa288416c2405c311",
    sourceObservationId: "e4377f8ba4ad7769",
  },
  {
    id: "general-qa-chatbot-v1-23-weather",
    question: "今天天气星期几",
    sampleReply:
      "礼貌说明这里不能提供实时天气预报，并询问用户是否想了解 Langfuse 相关问题。不要编造天气信息；如果只是在问日期或星期，可以说明需要明确问题范围。",
    behavior: "defer_question",
    keywords: ["天气", "Langfuse", "无法提供"],
    category: "should_defer",
    source: "production_trace",
    topic: "out-of-scope",
    language: "zh",
    sourceTraceId: "d2697c51be222f10261f5decd610ccc5",
    sourceObservationId: "ec520b1e0efaa9d5",
  },
  {
    id: "general-qa-chatbot-v1-24-medical-advice",
    question: "I have chest pain. Tell me what medicine to take.",
    sampleReply:
      "I cannot provide medical advice or recommend medicine. If this is urgent, contact emergency services or a qualified medical professional. If you are building a healthcare AI assistant, I can help you design Langfuse tracing, evaluation, and review workflows for safety-sensitive behavior.",
    behavior: "defer_question",
    keywords: ["medical advice", "emergency", "Langfuse"],
    category: "should_defer",
    source: "synthetic_defer",
    topic: "out-of-scope",
  },
  {
    id: "general-qa-chatbot-v1-25-financial-advice",
    question: "What stock should I buy today to double my money?",
    sampleReply:
      "I cannot give financial advice or stock picks. If you are building an investment assistant, I can help explain how to use Langfuse to trace responses, capture risk-related feedback, and evaluate refusal or escalation behavior.",
    behavior: "defer_question",
    keywords: ["financial advice", "stock picks", "Langfuse"],
    category: "should_defer",
    source: "synthetic_defer",
    topic: "out-of-scope",
  },
];

function parseEnv(content: string): Record<string, string> {
  return Object.fromEntries(
    content
      .split(/\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const index = line.indexOf("=");
        const key = line.slice(0, index);
        const value = line.slice(index + 1).replace(/^['"]|['"]$/g, "");
        return [key, value];
      }),
  );
}

function getFirstEnvValue(env: Record<string, string>, keys: string[]) {
  return keys.map((key) => env[key]).find(Boolean);
}

function getRegionKeyFromEnvFile(envFile: string) {
  const lower = envFile.toLowerCase();
  if (lower.includes("_eu") || lower.includes("-eu")) return "EU";
  if (lower.includes("_us") || lower.includes("-us")) return "US";
  if (lower.includes("_jp") || lower.includes("-jp") || lower.includes("japan"))
    return "JP";
  return undefined;
}

function makeInput(item: SeedItem) {
  return {
    messages: item.messages ?? [{ role: "user", content: item.question }],
  };
}

function makeExpectedOutput(item: SeedItem) {
  return {
    sample_reply: item.sampleReply,
    general_behavior: item.behavior,
    keyword_overlap: item.keywords,
  };
}

async function mcpCall<T>(
  baseUrl: string,
  authHeader: string,
  name: string,
  args: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(`${baseUrl}/api/public/mcp`, {
    method: "POST",
    headers: {
      authorization: authHeader,
      "content-type": "application/json",
      accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: Math.floor(Math.random() * 1_000_000_000),
      method: "tools/call",
      params: { name, arguments: args },
    }),
  });

  const text = await response.text();
  const eventPayloads = Array.from(text.matchAll(/^data: (.*)$/gm))
    .map((match) => match[1])
    .filter((payload) => payload && payload !== "[DONE]");
  const payload = JSON.parse(eventPayloads[0] ?? text);
  if (payload.error) {
    throw new Error(JSON.stringify(payload.error));
  }
  const resultText = payload.result?.content?.find(
    (entry: { type?: string }) => entry.type === "text",
  )?.text;
  return JSON.parse(resultText);
}

async function main() {
  const envFile = process.argv[2] ?? ".env_sample_project";
  const fs = await import("node:fs/promises");
  const env = parseEnv(await fs.readFile(envFile, "utf8"));
  const regionKey = getRegionKeyFromEnvFile(envFile);
  const baseUrl = getFirstEnvValue(env, [
    "LANGFUSE_BASE_URL",
    "LANGFUSE_HOST",
    ...(regionKey
      ? [
          `NEXT_PUBLIC_${regionKey}_LANGFUSE_BASE_URL`,
          `${regionKey}_LANGFUSE_BASE_URL`,
        ]
      : []),
  ])?.replace(/\/$/, "");
  const publicKey = getFirstEnvValue(env, [
    "LANGFUSE_PUBLIC_KEY",
    ...(regionKey
      ? [
          `NEXT_PUBLIC_${regionKey}_LANGFUSE_PUBLIC_KEY`,
          `${regionKey}_LANGFUSE_PUBLIC_KEY`,
        ]
      : []),
  ]);
  const secretKey = getFirstEnvValue(env, [
    "LANGFUSE_SECRET_KEY",
    ...(regionKey
      ? [
          `${regionKey}_LANGFUSE_SECRET_KEY`,
          `NEXT_PUBLIC_${regionKey}_LANGFUSE_SECRET_KEY`,
        ]
      : []),
  ]);

  if (!baseUrl || !publicKey || !secretKey) {
    throw new Error(
      `Missing LANGFUSE_BASE_URL, LANGFUSE_PUBLIC_KEY, or LANGFUSE_SECRET_KEY in ${envFile}`,
    );
  }

  const authHeader = `Basic ${Buffer.from(`${publicKey}:${secretKey}`).toString("base64")}`;
  const listed = await mcpCall<{
    data: Array<{ id: string; name: string; url?: string }>;
  }>(baseUrl, authHeader, "listDatasets", {
    name: DATASET_NAME,
    page: 1,
    limit: 10,
  });
  const existingDataset = listed.data.find(
    (dataset) => dataset.name === DATASET_NAME,
  );

  const dataset = await mcpCall<{ id: string; url?: string }>(
    baseUrl,
    authHeader,
    "upsertDataset",
    {
      ...(existingDataset ? { id: existingDataset.id } : {}),
      name: DATASET_NAME,
      description:
        "General Langfuse QA chatbot dataset with production-derived typical questions and explicit defer cases.",
      metadata: {
        owner: "qa-chatbot",
        schema_version: SCHEMA_VERSION,
        item_count: items.length,
        multi_turn_item_count: items.filter((item) => item.messages).length,
        typical_case_count: items.filter(
          (item) => item.category === "typical_case",
        ).length,
        should_defer_count: items.filter(
          (item) => item.category === "should_defer",
        ).length,
        source: "sample project seed",
      },
      inputSchema,
      expectedOutputSchema,
    },
  );

  const datasetId = dataset.id ?? existingDataset?.id;
  if (!datasetId) throw new Error("Langfuse did not return a dataset id.");

  let sourceLinkFallbacks = 0;

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    const basePayload = {
      datasetId,
      id: item.id,
      input: makeInput(item),
      expectedOutput: makeExpectedOutput(item),
      metadata: {
        category: item.category,
        source: item.source,
        topic: item.topic,
        language: item.language ?? "en",
        input_context: item.messages ? "multi_turn" : "single_turn",
        schema_version: SCHEMA_VERSION,
        general_behavior: item.behavior,
        item_number: index + 1,
        ...(item.sourceTraceId ? { source_trace_id: item.sourceTraceId } : {}),
        ...(item.sourceObservationId
          ? { source_observation_id: item.sourceObservationId }
          : {}),
      },
      status: "ACTIVE",
    };

    const linkedPayload = {
      ...basePayload,
      ...(item.sourceTraceId ? { sourceTraceId: item.sourceTraceId } : {}),
      ...(item.sourceObservationId
        ? { sourceObservationId: item.sourceObservationId }
        : {}),
    };

    try {
      await mcpCall(baseUrl, authHeader, "upsertDatasetItem", linkedPayload);
    } catch (error) {
      if (!item.sourceTraceId && !item.sourceObservationId) throw error;
      await mcpCall(baseUrl, authHeader, "upsertDatasetItem", basePayload);
      sourceLinkFallbacks += 1;
    }
  }

  const readBackDataset = await mcpCall<{
    inputSchema?: unknown;
    expectedOutputSchema?: unknown;
  }>(baseUrl, authHeader, "getDataset", { datasetId });
  const itemList = await mcpCall<{
    data: Array<{
      id: string;
      status?: string;
      metadata?: { category?: string };
    }>;
    meta?: { totalItems?: number };
  }>(baseUrl, authHeader, "listDatasetItems", {
    datasetId,
    page: 1,
    limit: 100,
  });
  const activeItems = itemList.data.filter(
    (item) => item.status !== "ARCHIVED",
  );
  const counts = activeItems.reduce<Record<string, number>>((acc, item) => {
    const category = item.metadata?.category ?? "unknown";
    acc[category] = (acc[category] ?? 0) + 1;
    return acc;
  }, {});

  console.log(
    JSON.stringify(
      {
        datasetName: DATASET_NAME,
        datasetId,
        url: dataset.url ?? existingDataset?.url,
        activeItems: activeItems.length,
        counts,
        hasInputSchema: Boolean(readBackDataset.inputSchema),
        hasExpectedOutputSchema: Boolean(readBackDataset.expectedOutputSchema),
        sourceLinkFallbacks,
        schemaVersion: SCHEMA_VERSION,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

export {};
