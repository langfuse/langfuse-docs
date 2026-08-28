/**
 * General QA chatbot experiment runner.
 *
 * Runs the `general QA chatbot` dataset through the real managed prompt +
 * Langfuse docs MCP path and scores each output with:
 * - correctness: Langfuse product LLM-as-a-judge evaluator
 * - behavior-judge: Langfuse product LLM-as-a-judge evaluator
 * - keyword-overlap: deterministic SDK evaluator over the expected keywords
 *
 * Examples:
 *   npx tsx components/qaChatbot/experiments/run_general_qa_chatbot_experiment.ts components/qaChatbot/.env_sample_project
 *   npx tsx components/qaChatbot/experiments/run_general_qa_chatbot_experiment.ts components/qaChatbot/.env_sample_project --setup-product-evaluators-only
 *   PROMPT_LABELS=production,candidate-v3 EXPERIMENT_MODELS=gpt-4o-mini,gpt-4o npx tsx components/qaChatbot/experiments/run_general_qa_chatbot_experiment.ts components/qaChatbot/.env_sample_project
 *   PROMPT_VERSIONS=1,2 EXPERIMENT_MODELS=gpt-4o-mini npx tsx components/qaChatbot/experiments/run_general_qa_chatbot_experiment.ts components/qaChatbot/.env_sample_project
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { createMCPClient } from "@ai-sdk/mcp";
import { openai, type OpenAIResponsesProviderOptions } from "@ai-sdk/openai";
import { generateText, stepCountIs } from "ai";
import {
  LangfuseClient,
  type Evaluator,
  type RunEvaluator,
} from "@langfuse/client";
import { LangfuseSpanProcessor } from "@langfuse/otel";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

import {
  getChatHistory,
  getLastUserMessage,
  normalizeMessageContent,
  QA_CHATBOT_PROMPT_NAME,
} from "../shared/flow_config";

type GeneralBehavior = "answer" | "ask_follow_up" | "defer_question";

type GeneralQaExpectedOutput = {
  sample_reply: string;
  general_behavior: GeneralBehavior;
  keyword_overlap: [string, string, string] | string[];
};

type Args = {
  envFile?: string;
  datasetName: string;
  models: string[];
  promptLabels: string[];
  promptVersions: number[];
  runSeries: string;
  maxConcurrency: number;
  mcpUrl: string;
  setupProductEvaluators: boolean;
  setupProductEvaluatorsOnly: boolean;
};

const DEFAULT_DATASET_NAME = "general QA chatbot";
const DEFAULT_RUN_SERIES = "general-qa-chatbot";
const DEFAULT_MODEL = "gpt-4o-mini";
const DEFAULT_PROMPT_LABEL = "production";
const DEFAULT_MAX_CONCURRENCY = 4;
const DEFAULT_MCP_URL = "https://langfuse.com/api/mcp";
const DEFAULT_PRODUCT_JUDGE_PROVIDER = "openai";
const DEFAULT_PRODUCT_JUDGE_MODEL = "gpt-4o-mini";

const CORRECTNESS_EVALUATOR_NAME = "general-qa-chatbot-correctness";
const BEHAVIOR_EVALUATOR_NAME = "general-qa-chatbot-behavior-judge";
const CORRECTNESS_RULE_NAME = "general-qa-chatbot-correctness-experiment";
const BEHAVIOR_RULE_NAME = "general-qa-chatbot-behavior-experiment";

type ExperimentTelemetry = Parameters<
  typeof generateText
>[0]["experimental_telemetry"];
type ExperimentTelemetryMetadata = Record<string, string | number | boolean>;

function makeExperimentTelemetry(
  metadata: ExperimentTelemetryMetadata,
): ExperimentTelemetry {
  return {
    isEnabled: true,
    metadata,
  } as ExperimentTelemetry;
}

const PRODUCT_EVALUATORS = [
  {
    name: CORRECTNESS_EVALUATOR_NAME,
    type: "llm_as_judge",
    prompt: [
      "You are grading a Langfuse documentation chatbot experiment item.",
      "Score semantic correctness by comparing the actual answer to the expected sample reply.",
      "Equivalent wording is fine. Extra correct details are fine.",
      "Penalize contradictions, unsupported claims, stale or made-up URLs, and missing core information.",
      "Behavioral direction matters, but focus this score on whether the answer content matches the expected sample reply.",
      "",
      "User input:",
      "{{input}}",
      "",
      "Expected sample reply:",
      "{{expected_sample_reply}}",
      "",
      "Expected behavior:",
      "{{expected_behavior}}",
      "",
      "Actual answer:",
      "{{output}}",
    ].join("\n"),
    outputDefinition: {
      dataType: "NUMERIC",
      score: {
        description:
          "0 = incorrect, 0.5 = partially correct, 1 = semantically matches the expected sample reply.",
      },
      reasoning: {
        description:
          "Explain missing facts, contradictions, or correct coverage.",
      },
    },
  },
  {
    name: BEHAVIOR_EVALUATOR_NAME,
    type: "llm_as_judge",
    prompt: [
      "You judge only the behavior of a Langfuse documentation chatbot response.",
      "Do not grade factual correctness here except when it changes the behavioral category.",
      "",
      "Behavior labels:",
      "- answer: answers the user question directly.",
      "- ask_follow_up: asks for missing context or a clarifying detail before answering specifically.",
      "- defer_question: refuses or redirects an out-of-scope request instead of answering it.",
      "",
      "Expected behavior:",
      "{{expected_behavior}}",
      "",
      "Expected sample reply, for context:",
      "{{expected_sample_reply}}",
      "",
      "User input:",
      "{{input}}",
      "",
      "Actual answer:",
      "{{output}}",
    ].join("\n"),
    outputDefinition: {
      dataType: "NUMERIC",
      score: {
        description:
          "1 = behavior matches, 0.5 = mixed or ambiguous, 0 = wrong behavior.",
      },
      reasoning: {
        description:
          "Explain whether the response answered, asked for clarification, or deferred as expected.",
      },
    },
  },
];

function parseCsv(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function parseNumberCsv(value: string | undefined): number[] {
  return parseCsv(value)
    .map((part) => Number(part))
    .filter((value) => Number.isInteger(value) && value > 0);
}

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  let envFile: string | undefined;
  let datasetName = process.env.DATASET_NAME ?? DEFAULT_DATASET_NAME;
  let models = parseCsv(
    process.env.EXPERIMENT_MODELS ?? process.env.EXPERIMENT_MODEL,
  );
  let promptLabels = parseCsv(
    process.env.PROMPT_LABELS ?? process.env.PROMPT_LABEL,
  );
  let promptVersions = parseNumberCsv(
    process.env.PROMPT_VERSIONS ?? process.env.PROMPT_VERSION,
  );
  let runSeries = process.env.RUN_SERIES ?? DEFAULT_RUN_SERIES;
  let maxConcurrency = Number(
    process.env.EXPERIMENT_MAX_CONCURRENCY ?? DEFAULT_MAX_CONCURRENCY,
  );
  let mcpUrl = process.env.LANGFUSE_DOCS_MCP_URL ?? DEFAULT_MCP_URL;
  let setupProductEvaluators = process.env.SKIP_PRODUCT_EVALUATORS !== "true";
  let setupProductEvaluatorsOnly = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    if (arg === "--env-file") {
      envFile = next;
      index += 1;
    } else if (arg === "--dataset-name") {
      datasetName = next;
      index += 1;
    } else if (arg === "--models") {
      models = parseCsv(next);
      index += 1;
    } else if (arg === "--prompt-labels") {
      promptLabels = parseCsv(next);
      index += 1;
    } else if (arg === "--prompt-versions") {
      promptVersions = parseNumberCsv(next);
      index += 1;
    } else if (arg === "--run-series") {
      runSeries = next;
      index += 1;
    } else if (arg === "--max-concurrency") {
      maxConcurrency = Number(next);
      index += 1;
    } else if (arg === "--mcp-url") {
      mcpUrl = next;
      index += 1;
    } else if (arg === "--skip-product-evaluators") {
      setupProductEvaluators = false;
    } else if (arg === "--setup-product-evaluators-only") {
      setupProductEvaluators = true;
      setupProductEvaluatorsOnly = true;
    } else if (arg === "--") {
      continue;
    } else if (!arg.startsWith("--") && !envFile) {
      envFile = arg;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (models.length === 0) models = [DEFAULT_MODEL];
  if (promptLabels.length === 0 && promptVersions.length === 0)
    promptLabels = [DEFAULT_PROMPT_LABEL];
  if (!Number.isFinite(maxConcurrency) || maxConcurrency < 1)
    maxConcurrency = DEFAULT_MAX_CONCURRENCY;

  return {
    envFile,
    datasetName,
    models,
    promptLabels,
    promptVersions,
    runSeries,
    maxConcurrency,
    mcpUrl,
    setupProductEvaluators,
    setupProductEvaluatorsOnly,
  };
}

function readEnvFile(envFile: string | undefined) {
  if (!envFile) return;

  const fullPath = resolve(process.cwd(), envFile);
  if (!existsSync(fullPath)) {
    throw new Error(`Env file does not exist: ${fullPath}`);
  }

  const values = Object.fromEntries(
    readFileSync(fullPath, "utf8")
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

  for (const [key, value] of Object.entries(values)) {
    if (!process.env[key]) process.env[key] = value;
  }

  const baseUrl =
    values.LANGFUSE_BASE_URL ??
    values.NEXT_PUBLIC_EU_LANGFUSE_BASE_URL ??
    values.NEXT_PUBLIC_US_LANGFUSE_BASE_URL ??
    values.NEXT_PUBLIC_JP_LANGFUSE_BASE_URL;
  const publicKey =
    values.LANGFUSE_PUBLIC_KEY ??
    values.NEXT_PUBLIC_EU_LANGFUSE_PUBLIC_KEY ??
    values.NEXT_PUBLIC_US_LANGFUSE_PUBLIC_KEY ??
    values.NEXT_PUBLIC_JP_LANGFUSE_PUBLIC_KEY;
  const secretKey =
    values.LANGFUSE_SECRET_KEY ??
    values.EU_LANGFUSE_SECRET_KEY ??
    values.US_LANGFUSE_SECRET_KEY ??
    values.JP_LANGFUSE_SECRET_KEY;

  if (baseUrl) {
    process.env.LANGFUSE_BASE_URL = process.env.LANGFUSE_BASE_URL ?? baseUrl;
    process.env.LANGFUSE_HOST = process.env.LANGFUSE_HOST ?? baseUrl;
  }
  if (publicKey)
    process.env.LANGFUSE_PUBLIC_KEY =
      process.env.LANGFUSE_PUBLIC_KEY ?? publicKey;
  if (secretKey)
    process.env.LANGFUSE_SECRET_KEY =
      process.env.LANGFUSE_SECRET_KEY ?? secretKey;
}

function requireEnv(name: string) {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

async function mcpCall<T>(
  name: string,
  args: Record<string, unknown>,
): Promise<T> {
  const baseUrl = process.env.LANGFUSE_BASE_URL?.replace(/\/$/, "");
  const publicKey = process.env.LANGFUSE_PUBLIC_KEY;
  const secretKey = process.env.LANGFUSE_SECRET_KEY;

  if (!baseUrl || !publicKey || !secretKey) {
    throw new Error("Missing Langfuse credentials for MCP call.");
  }

  const response = await fetch(`${baseUrl}/api/public/mcp`, {
    method: "POST",
    headers: {
      authorization: `Basic ${Buffer.from(`${publicKey}:${secretKey}`).toString("base64")}`,
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

async function getDatasetId(datasetName: string) {
  const result = await mcpCall<{ data: Array<{ id: string; name: string }> }>(
    "listDatasets",
    {
      name: datasetName,
      page: 1,
      limit: 10,
    },
  );
  const dataset = result.data.find((entry) => entry.name === datasetName);
  if (!dataset) throw new Error(`Dataset not found: ${datasetName}`);
  return dataset.id;
}

function getProductJudgeModelConfig() {
  return {
    provider:
      process.env.PRODUCT_JUDGE_PROVIDER ?? DEFAULT_PRODUCT_JUDGE_PROVIDER,
    model: process.env.PRODUCT_JUDGE_MODEL ?? DEFAULT_PRODUCT_JUDGE_MODEL,
  };
}

async function ensureProductEvaluator(
  evaluator: (typeof PRODUCT_EVALUATORS)[number],
) {
  try {
    await mcpCall("upsertEvaluator", evaluator);
    console.log(`Created product evaluator: ${evaluator.name}`);
  } catch (error) {
    const message = String(error);
    if (
      !message.includes("No valid LLM model found") &&
      !message.includes("evaluator_preflight_failed")
    ) {
      throw error;
    }

    const modelConfig = getProductJudgeModelConfig();
    await mcpCall("upsertEvaluator", { ...evaluator, modelConfig });
    console.log(
      `Created product evaluator with explicit product model config: ${evaluator.name} (${modelConfig.provider}/${modelConfig.model})`,
    );
  }
}

async function ensureProductLlmJudgeEvaluators(datasetName: string) {
  const datasetId = await getDatasetId(datasetName);
  const evaluators = await mcpCall<{
    data: Array<{ id: string; name: string; type: string }>;
  }>("listEvaluators", { page: 1, limit: 100 });
  const existingEvaluatorNames = new Set(
    evaluators.data.map((evaluator) => evaluator.name),
  );

  for (const evaluator of PRODUCT_EVALUATORS) {
    if (existingEvaluatorNames.has(evaluator.name)) {
      console.log(`Product evaluator exists: ${evaluator.name}`);
      continue;
    }

    await ensureProductEvaluator(evaluator);
  }

  const rules = await mcpCall<{ data: Array<{ id: string; name: string }> }>(
    "listEvaluationRules",
    {
      page: 1,
      limit: 100,
    },
  );
  const existingRules = new Map(
    rules.data.map((rule) => [rule.name, rule.id] as const),
  );

  const ruleDefinitions = [
    {
      name: CORRECTNESS_RULE_NAME,
      evaluator: {
        name: CORRECTNESS_EVALUATOR_NAME,
        scope: "project",
        type: "llm_as_judge",
      },
      enabled: true,
      sampling: 1,
      target: "experiment",
      filter: [
        {
          column: "datasetId",
          operator: "any of",
          value: [datasetId],
          type: "stringOptions",
        },
      ],
      mapping: [
        { variable: "input", source: "input" },
        { variable: "output", source: "output" },
        {
          variable: "expected_sample_reply",
          source: "expected_output",
          jsonPath: "$.sample_reply",
        },
        {
          variable: "expected_behavior",
          source: "expected_output",
          jsonPath: "$.general_behavior",
        },
      ],
    },
    {
      name: BEHAVIOR_RULE_NAME,
      evaluator: {
        name: BEHAVIOR_EVALUATOR_NAME,
        scope: "project",
        type: "llm_as_judge",
      },
      enabled: true,
      sampling: 1,
      target: "experiment",
      filter: [
        {
          column: "datasetId",
          operator: "any of",
          value: [datasetId],
          type: "stringOptions",
        },
      ],
      mapping: [
        { variable: "input", source: "input" },
        { variable: "output", source: "output" },
        {
          variable: "expected_sample_reply",
          source: "expected_output",
          jsonPath: "$.sample_reply",
        },
        {
          variable: "expected_behavior",
          source: "expected_output",
          jsonPath: "$.general_behavior",
        },
      ],
    },
  ];

  for (const rule of ruleDefinitions) {
    const existingRuleId = existingRules.get(rule.name);
    if (existingRuleId) {
      await mcpCall("updateEvaluationRule", {
        evaluationRuleId: existingRuleId,
        ...rule,
        evaluator: { name: rule.evaluator.name, scope: rule.evaluator.scope },
      });
      console.log(`Updated product evaluation rule: ${rule.name}`);
    } else {
      await mcpCall("createEvaluationRule", rule);
      console.log(`Created product evaluation rule: ${rule.name}`);
    }
  }
}

function parseExpectedOutput(value: unknown): GeneralQaExpectedOutput {
  const output = value as Partial<GeneralQaExpectedOutput> | undefined;
  return {
    sample_reply: String(output?.sample_reply ?? ""),
    general_behavior: (output?.general_behavior ?? "answer") as GeneralBehavior,
    keyword_overlap: Array.isArray(output?.keyword_overlap)
      ? output.keyword_overlap.map(String)
      : [],
  };
}

function normalizeForKeywordMatching(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isReasoningModel(model: string) {
  return /^gpt-5|^o\d/.test(model);
}

const keywordOverlap: Evaluator<unknown, GeneralQaExpectedOutput> = async ({
  output,
  expectedOutput,
}) => {
  const expected = parseExpectedOutput(expectedOutput);
  if (expected.keyword_overlap.length === 0) return [];

  const normalizedOutput = normalizeForKeywordMatching(
    normalizeMessageContent(output),
  );
  const matched = expected.keyword_overlap.filter((keyword) =>
    normalizedOutput.includes(normalizeForKeywordMatching(keyword)),
  );
  const missing = expected.keyword_overlap.filter(
    (keyword) => !matched.includes(keyword),
  );

  return {
    name: "keyword-overlap",
    value: matched.length / expected.keyword_overlap.length,
    comment: `${matched.length}/${expected.keyword_overlap.length} keyword(s) present. Matched: ${
      matched.join(", ") || "none"
    }. Missing: ${missing.join(", ") || "none"}.`,
    metadata: { matched, missing, expected_keywords: expected.keyword_overlap },
  };
};

const averageScore =
  (scoreName: string): RunEvaluator =>
  async ({ itemResults }) => {
    const values = itemResults
      .flatMap((result) => result.evaluations)
      .filter((evaluation) => evaluation.name === scoreName)
      .map((evaluation) => Number(evaluation.value))
      .filter((value) => Number.isFinite(value));

    if (values.length === 0) return [];

    const average =
      values.reduce((sum, value) => sum + value, 0) / values.length;
    return {
      name: `avg-${scoreName}`,
      value: average,
      comment: `Average ${scoreName} over ${values.length} item(s): ${average.toFixed(3)}`,
    };
  };

function compileExperimentMessages(
  prompt: Awaited<ReturnType<LangfuseClient["prompt"]["get"]>>,
  input: unknown,
): Parameters<typeof generateText>[0]["messages"] {
  const chatHistory = getChatHistory(input);
  const fallbackUserMessage = getLastUserMessage(input);
  const datasetMessages =
    chatHistory.length > 0
      ? chatHistory
      : fallbackUserMessage
        ? [{ role: "user", content: fallbackUserMessage }]
        : [];
  const compiledWithVariables = prompt.compile({
    chat_history: datasetMessages,
  } as any);
  const compiledMessages: Array<{ role: string; content: string }> = [];
  let insertedPlaceholder = false;

  for (const message of compiledWithVariables as Array<{
    role?: string;
    content?: unknown;
    type?: string;
    name?: string;
  }>) {
    if (message.type === "placeholder" && message.name === "chat_history") {
      compiledMessages.push(...datasetMessages);
      insertedPlaceholder = true;
      continue;
    }

    if (message.role && message.content != null) {
      compiledMessages.push({
        role: message.role,
        content: normalizeMessageContent(message.content),
      });
    }
  }

  if (
    !insertedPlaceholder &&
    compiledMessages.every((message) => message.role === "system")
  ) {
    compiledMessages.push(...datasetMessages);
  }

  return compiledMessages as Parameters<typeof generateText>[0]["messages"];
}

async function runOneExperiment(
  args: Args,
  params: { model: string; promptLabel?: string; promptVersion?: number },
) {
  const langfuse = new LangfuseClient();
  const promptSelector = params.promptVersion
    ? `v${params.promptVersion}`
    : (params.promptLabel ?? DEFAULT_PROMPT_LABEL);
  const prompt = await langfuse.prompt.get(QA_CHATBOT_PROMPT_NAME, {
    type: "chat",
    ...(params.promptVersion
      ? { version: params.promptVersion }
      : { label: promptSelector }),
  });

  const promptConfig = prompt.config as Record<string, unknown>;
  const reasoningSummary = promptConfig.reasoningSummary as
    | "low"
    | "medium"
    | "high"
    | undefined;
  const textVerbosity = promptConfig.textVerbosity as
    | "low"
    | "medium"
    | "high"
    | undefined;
  const reasoningEffort = promptConfig.reasoningEffort as
    | "low"
    | "medium"
    | "high"
    | undefined;

  console.log(
    `Running dataset="${args.datasetName}" prompt=${QA_CHATBOT_PROMPT_NAME}@${promptSelector} resolvedVersion=${prompt.version} model=${params.model}`,
  );

  const dataset = await langfuse.dataset.get(args.datasetName);

  const task = async (item: { input: unknown }): Promise<string> => {
    const compiledMessages = compileExperimentMessages(prompt, item.input);

    const transport = new StreamableHTTPClientTransport(new URL(args.mcpUrl), {
      sessionId: `general-qa-chatbot-${crypto.randomUUID()}`,
    }) as unknown as Parameters<typeof createMCPClient>[0]["transport"];
    const mcpClient = await createMCPClient({
      transport,
    });

    try {
      const tools = await mcpClient.tools();
      const { text } = await generateText({
        abortSignal: AbortSignal.timeout(240_000),
        model: openai(params.model),
        ...(isReasoningModel(params.model)
          ? {
              providerOptions: {
                openai: {
                  reasoningSummary,
                  textVerbosity,
                  reasoningEffort,
                } satisfies OpenAIResponsesProviderOptions,
              },
            }
          : {}),
        messages: compiledMessages as Parameters<
          typeof generateText
        >[0]["messages"],
        tools: tools as Parameters<typeof generateText>[0]["tools"],
        stopWhen: stepCountIs(10),
        experimental_telemetry: makeExperimentTelemetry({
          langfusePrompt: JSON.stringify(prompt.toJSON() ?? {}),
          experiment_model: params.model,
          experiment_prompt_selector: promptSelector,
          experiment_dataset: args.datasetName,
        }),
      });

      return text;
    } finally {
      await mcpClient.close();
    }
  };

  const runName = [
    args.runSeries,
    `prompt-${promptSelector}`,
    `model-${params.model}`,
    new Date().toISOString().replace(/[:.]/g, "-"),
  ].join("-");

  const result = await dataset.runExperiment({
    name: `${args.runSeries}-${params.model}`,
    runName,
    description:
      "General QA chatbot experiment over the production-shaped dataset. Product LLM-as-a-judge rules score correctness and behavior; SDK scores keyword-overlap.",
    task,
    evaluators: [keywordOverlap],
    runEvaluators: [averageScore("keyword-overlap")],
    maxConcurrency: args.maxConcurrency,
    metadata: {
      model: params.model,
      prompt_name: QA_CHATBOT_PROMPT_NAME,
      prompt_label: params.promptVersion ? undefined : promptSelector,
      prompt_version: prompt.version,
      dataset_name: args.datasetName,
      run_series: args.runSeries,
      product_evaluators: [CORRECTNESS_EVALUATOR_NAME, BEHAVIOR_EVALUATOR_NAME],
      sdk_evaluators: ["keyword-overlap"],
    },
  });

  console.log(await result.format());
  await langfuse.flush();
}

async function main() {
  const args = parseArgs();
  readEnvFile(args.envFile);
  requireEnv("OPENAI_API_KEY");
  requireEnv("LANGFUSE_PUBLIC_KEY");
  requireEnv("LANGFUSE_SECRET_KEY");
  requireEnv("LANGFUSE_BASE_URL");

  if (args.setupProductEvaluators) {
    await ensureProductLlmJudgeEvaluators(args.datasetName);
  } else {
    console.log("Skipped product LLM-as-a-judge evaluator setup");
  }

  if (args.setupProductEvaluatorsOnly) return;

  requireEnv("OPENAI_API_KEY");

  const spanProcessor = new LangfuseSpanProcessor();
  const tracerProvider = new NodeTracerProvider({
    spanProcessors: [spanProcessor],
  });
  tracerProvider.register();

  try {
    const promptSelectors =
      args.promptVersions.length > 0
        ? args.promptVersions.map((promptVersion) => ({ promptVersion }))
        : args.promptLabels.map((promptLabel) => ({ promptLabel }));

    for (const selector of promptSelectors) {
      for (const model of args.models) {
        await runOneExperiment(args, { ...selector, model });
      }
    }
  } finally {
    await tracerProvider.shutdown();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
