type IntegrationType = "sdk" | "model_provider" | "framework" | "gateway";
type Ecosystem = "python" | "js_ts" | "provider" | "framework" | "gateway";

type SeedItem = {
  id: string;
  question: string;
  integration: string;
  integrationType: IntegrationType;
  ecosystem: Ecosystem;
  docsUrls: string[];
  docsPaths: string[];
  requiresVersionOrPackage: boolean;
  focus: string[];
};

const DATASET_NAME = "SDK integration docs grounding";
const SCHEMA_VERSION = "sdk_integration_grounding_v1";

const evaluationCriteria = [
  "grounded_in_langfuse_docs",
  "docs_links_required",
  "version_or_package_details_required",
  "avoid_training_data_only_claims",
];

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

const items: SeedItem[] = [
  {
    id: "sdk-integration-grounding-v1-01-python-sdk-v4",
    question:
      "What is the current recommended way to instrument a Python app with Langfuse tracing, and which SDK version/package should I install?",
    integration: "python-sdk",
    integrationType: "sdk",
    ecosystem: "python",
    docsUrls: [
      "https://langfuse.com/docs/observability/sdk/overview",
      "https://langfuse.com/docs/observability/sdk/instrumentation",
      "https://langfuse.com/docs/observability/sdk/upgrade-path/python-v3-to-v4",
    ],
    docsPaths: [
      "/docs/observability/sdk/overview",
      "/docs/observability/sdk/instrumentation",
      "/docs/observability/sdk/upgrade-path/python-v3-to-v4",
    ],
    requiresVersionOrPackage: true,
    focus: [
      "Python SDK v4",
      "pip install langfuse",
      "OpenTelemetry-based instrumentation",
    ],
  },
  {
    id: "sdk-integration-grounding-v1-02-js-ts-sdk-v5",
    question:
      "How do I set up Langfuse tracing in a Node or TypeScript app with the current JS/TS SDK, including package names and initialization?",
    integration: "js-ts-sdk",
    integrationType: "sdk",
    ecosystem: "js_ts",
    docsUrls: [
      "https://langfuse.com/docs/observability/sdk/overview",
      "https://langfuse.com/docs/observability/sdk/instrumentation",
      "https://langfuse.com/docs/observability/sdk/upgrade-path/js-v4-to-v5",
    ],
    docsPaths: [
      "/docs/observability/sdk/overview",
      "/docs/observability/sdk/instrumentation",
      "/docs/observability/sdk/upgrade-path/js-v4-to-v5",
    ],
    requiresVersionOrPackage: true,
    focus: ["JS/TS SDK v5", "@langfuse/tracing", "@langfuse/otel"],
  },
  {
    id: "sdk-integration-grounding-v1-03-openai-python",
    question:
      "How do I trace OpenAI Python SDK calls with Langfuse using the drop-in replacement, and what OpenAI SDK version compatibility should I mention?",
    integration: "openai-python",
    integrationType: "model_provider",
    ecosystem: "python",
    docsUrls: ["https://langfuse.com/integrations/model-providers/openai-py"],
    docsPaths: ["/integrations/model-providers/openai-py"],
    requiresVersionOrPackage: true,
    focus: [
      "drop-in import change",
      "OpenAI SDK compatibility",
      "streaming support",
    ],
  },
  {
    id: "sdk-integration-grounding-v1-04-openai-js",
    question:
      "How do I trace the OpenAI JS/TS SDK with Langfuse using observeOpenAI, and what packages and docs should the answer cite?",
    integration: "openai-js",
    integrationType: "model_provider",
    ecosystem: "js_ts",
    docsUrls: ["https://langfuse.com/integrations/model-providers/openai-js"],
    docsPaths: ["/integrations/model-providers/openai-js"],
    requiresVersionOrPackage: true,
    focus: ["observeOpenAI", "OpenAI JS/TS SDK", "Langfuse tracing packages"],
  },
  {
    id: "sdk-integration-grounding-v1-05-anthropic-python",
    question:
      "What is the documented way to trace Anthropic Claude calls with Langfuse in Python, including the OpenTelemetry option and required packages?",
    integration: "anthropic-python",
    integrationType: "model_provider",
    ecosystem: "python",
    docsUrls: ["https://langfuse.com/integrations/model-providers/anthropic"],
    docsPaths: ["/integrations/model-providers/anthropic"],
    requiresVersionOrPackage: true,
    focus: [
      "AnthropicInstrumentor",
      "OpenTelemetry instrumentation",
      "OpenAI-compatible endpoint alternative",
    ],
  },
  {
    id: "sdk-integration-grounding-v1-06-anthropic-js",
    question:
      "How should I trace Anthropic JS/TS SDK calls with Langfuse, and what setup details should be grounded in the Langfuse docs?",
    integration: "anthropic-js",
    integrationType: "model_provider",
    ecosystem: "js_ts",
    docsUrls: [
      "https://langfuse.com/integrations/model-providers/anthropic-js",
    ],
    docsPaths: ["/integrations/model-providers/anthropic-js"],
    requiresVersionOrPackage: true,
    focus: ["Anthropic JS/TS SDK", "OpenTelemetry", "Langfuse setup"],
  },
  {
    id: "sdk-integration-grounding-v1-07-langchain-langgraph",
    question:
      "What is the recommended Langfuse setup for LangChain or LangGraph, including callback handler package details for Python and JS/TS?",
    integration: "langchain-langgraph",
    integrationType: "framework",
    ecosystem: "framework",
    docsUrls: ["https://langfuse.com/integrations/frameworks/langchain"],
    docsPaths: ["/integrations/frameworks/langchain"],
    requiresVersionOrPackage: true,
    focus: [
      "LangChain callback handler",
      "LangGraph tracing",
      "Python and JS/TS packages",
    ],
  },
  {
    id: "sdk-integration-grounding-v1-08-llamaindex",
    question:
      "How do I trace a LlamaIndex application or workflow with Langfuse, and which integration docs and package setup should the answer rely on?",
    integration: "llamaindex",
    integrationType: "framework",
    ecosystem: "python",
    docsUrls: [
      "https://langfuse.com/integrations/frameworks/llamaindex",
      "https://langfuse.com/integrations/frameworks/llamaindex-workflows",
    ],
    docsPaths: [
      "/integrations/frameworks/llamaindex",
      "/integrations/frameworks/llamaindex-workflows",
    ],
    requiresVersionOrPackage: true,
    focus: ["LlamaIndex instrumentation", "workflows", "package setup"],
  },
  {
    id: "sdk-integration-grounding-v1-09-vercel-ai-sdk",
    question:
      "How do I trace a Vercel AI SDK app with Langfuse, including OpenTelemetry setup, required package names, and links to the correct docs?",
    integration: "vercel-ai-sdk",
    integrationType: "framework",
    ecosystem: "js_ts",
    docsUrls: ["https://langfuse.com/integrations/frameworks/vercel-ai-sdk"],
    docsPaths: ["/integrations/frameworks/vercel-ai-sdk"],
    requiresVersionOrPackage: true,
    focus: ["Vercel AI SDK", "OpenTelemetry", "Langfuse exporter setup"],
  },
  {
    id: "sdk-integration-grounding-v1-10-litellm-proxy",
    question:
      "What is the Langfuse integration path for LiteLLM Proxy, and how is it different from using the LiteLLM SDK directly?",
    integration: "litellm-proxy",
    integrationType: "gateway",
    ecosystem: "gateway",
    docsUrls: [
      "https://langfuse.com/integrations/gateways/litellm",
      "https://langfuse.com/integrations/frameworks/litellm-sdk",
    ],
    docsPaths: [
      "/integrations/gateways/litellm",
      "/integrations/frameworks/litellm-sdk",
    ],
    requiresVersionOrPackage: true,
    focus: ["LiteLLM Proxy", "LiteLLM SDK", "Langfuse callback/config"],
  },
  {
    id: "sdk-integration-grounding-v1-11-amazon-bedrock",
    question:
      "How do I monitor Amazon Bedrock calls with Langfuse, and when should I use the Bedrock SDK integration versus OpenTelemetry-based tracing?",
    integration: "amazon-bedrock",
    integrationType: "model_provider",
    ecosystem: "provider",
    docsUrls: [
      "https://langfuse.com/integrations/model-providers/amazon-bedrock",
      "https://langfuse.com/integrations/frameworks/amazon-agentcore",
    ],
    docsPaths: [
      "/integrations/model-providers/amazon-bedrock",
      "/integrations/frameworks/amazon-agentcore",
    ],
    requiresVersionOrPackage: true,
    focus: ["Amazon Bedrock SDK", "AgentCore", "OpenTelemetry"],
  },
  {
    id: "sdk-integration-grounding-v1-12-google-gemini-vertex",
    question:
      "How do I trace Google Gemini or Vertex AI usage with Langfuse, and what provider-specific setup details should be included from the docs?",
    integration: "google-gemini-vertex-ai",
    integrationType: "model_provider",
    ecosystem: "provider",
    docsUrls: [
      "https://langfuse.com/integrations/model-providers/google-gemini",
      "https://langfuse.com/integrations/model-providers/google-vertex-ai",
    ],
    docsPaths: [
      "/integrations/model-providers/google-gemini",
      "/integrations/model-providers/google-vertex-ai",
    ],
    requiresVersionOrPackage: true,
    focus: ["Google GenAI SDK", "Vertex AI", "provider-specific setup"],
  },
  {
    id: "sdk-integration-grounding-v1-13-openai-agents",
    question:
      "How do I trace an OpenAI Agents SDK workflow with Langfuse, and which OpenInference or OpenTelemetry instrumentation details should be cited?",
    integration: "openai-agents",
    integrationType: "framework",
    ecosystem: "python",
    docsUrls: ["https://langfuse.com/integrations/frameworks/openai-agents"],
    docsPaths: ["/integrations/frameworks/openai-agents"],
    requiresVersionOrPackage: true,
    focus: [
      "OpenAI Agents SDK",
      "OpenInference instrumentation",
      "OpenTelemetry",
    ],
  },
  {
    id: "sdk-integration-grounding-v1-14-crewai",
    question:
      "How do I instrument a CrewAI app with Langfuse, and which OpenTelemetry or OpenLIT setup steps should the answer include?",
    integration: "crewai",
    integrationType: "framework",
    ecosystem: "python",
    docsUrls: ["https://langfuse.com/integrations/frameworks/crewai"],
    docsPaths: ["/integrations/frameworks/crewai"],
    requiresVersionOrPackage: true,
    focus: ["CrewAI", "OpenTelemetry", "OpenLIT"],
  },
  {
    id: "sdk-integration-grounding-v1-15-instructor",
    question:
      "How do I use Langfuse with Instructor for structured outputs, and what package/setup/version details should be grounded in the docs?",
    integration: "instructor",
    integrationType: "framework",
    ecosystem: "python",
    docsUrls: ["https://langfuse.com/integrations/frameworks/instructor"],
    docsPaths: ["/integrations/frameworks/instructor"],
    requiresVersionOrPackage: true,
    focus: ["Instructor", "structured outputs", "Python package setup"],
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

function makeInput(question: string) {
  return {
    messages: [{ role: "user", content: question }],
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
        "Reference-free QA chatbot dataset for SDK and integration questions. The intended evaluators should score documentation grounding, cited docs, and package/version completeness.",
      metadata: {
        owner: "qa-chatbot",
        schema_version: SCHEMA_VERSION,
        item_count: items.length,
        reference_style: "reference_free",
        expected_output: "omitted",
        evaluation_goal: "docs_grounding_and_setup_completeness",
        evaluation_criteria: evaluationCriteria,
        source: "langfuse_docs_index_and_docs_pages",
        docs_checked_at: "2026-07-16",
        sample_project_only: true,
      },
      inputSchema,
    },
  );

  const datasetId = dataset.id ?? existingDataset?.id;
  if (!datasetId) throw new Error("Langfuse did not return a dataset id.");

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    await mcpCall(baseUrl, authHeader, "upsertDatasetItem", {
      datasetId,
      id: item.id,
      input: makeInput(item.question),
      metadata: {
        category: "sdk_integration_docs_grounding",
        source: "docs_derived",
        integration: item.integration,
        integration_type: item.integrationType,
        ecosystem: item.ecosystem,
        docs_urls: item.docsUrls,
        docs_paths: item.docsPaths,
        focus: item.focus,
        evaluation_criteria: evaluationCriteria,
        expected_output: "omitted",
        reference_style: "reference_free",
        requires_version_or_package: item.requiresVersionOrPackage,
        schema_version: SCHEMA_VERSION,
        item_number: index + 1,
      },
      status: "ACTIVE",
    });
  }

  const readBackDataset = await mcpCall<{
    inputSchema?: unknown;
    expectedOutputSchema?: unknown;
  }>(baseUrl, authHeader, "getDataset", { datasetId });
  const itemList = await mcpCall<{
    data: Array<{
      id: string;
      status?: string;
      expectedOutput?: unknown;
      metadata?: { integration_type?: string; integration?: string };
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
  const seededIds = new Set(items.map((item) => item.id));
  const activeSeedItems = activeItems.filter((item) => seededIds.has(item.id));
  const countsByType = activeSeedItems.reduce<Record<string, number>>(
    (acc, item) => {
      const type = item.metadata?.integration_type ?? "unknown";
      acc[type] = (acc[type] ?? 0) + 1;
      return acc;
    },
    {},
  );
  const itemsWithExpectedOutput = activeSeedItems.filter(
    (item) => item.expectedOutput != null,
  ).length;

  console.log(
    JSON.stringify(
      {
        datasetName: DATASET_NAME,
        datasetId,
        url: dataset.url ?? existingDataset?.url,
        activeSeedItems: activeSeedItems.length,
        totalActiveItemsInDataset: activeItems.length,
        countsByType,
        hasInputSchema: Boolean(readBackDataset.inputSchema),
        hasExpectedOutputSchema: Boolean(readBackDataset.expectedOutputSchema),
        itemsWithExpectedOutput,
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
