/**
 * SDK integration docs-grounding experiment runner.
 *
 * Runs the reference-free `SDK integration docs grounding` dataset through the
 * real QA chatbot path: managed product prompt + Langfuse docs MCP tools.
 * Scoring is handled by Langfuse in-app experiment evaluators attached to this
 * dataset.
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { createMCPClient } from "@ai-sdk/mcp";
import { openai, type OpenAIResponsesProviderOptions } from "@ai-sdk/openai";
import { generateText, stepCountIs } from "ai";
import { LangfuseClient } from "@langfuse/client";
import { LangfuseSpanProcessor } from "@langfuse/otel";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

import {
  getChatHistory,
  getLastUserMessage,
  normalizeMessageContent,
  QA_CHATBOT_PROMPT_NAME,
} from "../shared/flow_config";

type Args = {
  envFile?: string;
  datasetName: string;
  models: string[];
  promptLabels: string[];
  promptVersions: number[];
  runSeries: string;
  maxConcurrency: number;
  mcpUrl: string;
};

const DEFAULT_DATASET_NAME = "SDK integration docs grounding";
const DEFAULT_RUN_SERIES = "sdk-integration-grounding";
const DEFAULT_MODEL = "gpt-5";
const DEFAULT_PROMPT_LABEL = "production";
const DEFAULT_MAX_CONCURRENCY = 3;
const DEFAULT_MCP_URL = "https://langfuse.com/api/mcp";

const IN_APP_EVALUATORS = [
  "sdk-integration-questions-groundedness",
  "sdk-integration-questions-completeness",
];

type ExperimentTelemetry = Parameters<
  typeof generateText
>[0]["experimental_telemetry"];
type ExperimentTelemetryMetadata = Record<string, string | number | boolean>;
type ExperimentMessages = Parameters<typeof generateText>[0]["messages"];

type CompiledExperimentPrompt = {
  instructions?: string;
  messages: ExperimentMessages;
};

function makeExperimentTelemetry(
  metadata: ExperimentTelemetryMetadata,
): ExperimentTelemetry {
  return {
    isEnabled: true,
    metadata,
  } as ExperimentTelemetry;
}

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
    } else if (arg === "--") {
      continue;
    } else if (!arg.startsWith("--") && !envFile) {
      envFile = arg;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (models.length === 0) models = [DEFAULT_MODEL];
  if (promptLabels.length === 0 && promptVersions.length === 0) {
    promptLabels = [DEFAULT_PROMPT_LABEL];
  }
  if (!Number.isFinite(maxConcurrency) || maxConcurrency < 1) {
    maxConcurrency = DEFAULT_MAX_CONCURRENCY;
  }

  return {
    envFile,
    datasetName,
    models,
    promptLabels,
    promptVersions,
    runSeries,
    maxConcurrency,
    mcpUrl,
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
  if (publicKey) {
    process.env.LANGFUSE_PUBLIC_KEY =
      process.env.LANGFUSE_PUBLIC_KEY ?? publicKey;
  }
  if (secretKey) {
    process.env.LANGFUSE_SECRET_KEY =
      process.env.LANGFUSE_SECRET_KEY ?? secretKey;
  }
}

function requireEnv(name: string) {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

function isReasoningModel(model: string) {
  return /^gpt-5|^o\d/.test(model);
}

function compileExperimentMessages(
  prompt: Awaited<ReturnType<LangfuseClient["prompt"]["get"]>>,
  input: unknown,
): CompiledExperimentPrompt {
  const chatHistory = getChatHistory(input);
  const fallbackUserMessage = getLastUserMessage(input);
  const datasetMessages: Array<{ role: string; content: string }> =
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

  const instructions = compiledMessages
    .filter((message) => message.role === "system")
    .map((message) => message.content)
    .join("\n\n");
  const modelMessages = compiledMessages.filter(
    (message) => message.role !== "system",
  );

  return {
    instructions: instructions || undefined,
    messages: modelMessages as ExperimentMessages,
  };
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
    const compiledPrompt = compileExperimentMessages(prompt, item.input);
    const transport = new StreamableHTTPClientTransport(new URL(args.mcpUrl), {
      sessionId: `sdk-integration-grounding-${crypto.randomUUID()}`,
    }) as unknown as Parameters<typeof createMCPClient>[0]["transport"];
    const mcpClient = await createMCPClient({ transport });

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
        instructions: compiledPrompt.instructions,
        messages: compiledPrompt.messages,
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
      "SDK integration docs-grounding experiment using the product QA chatbot prompt and Langfuse docs MCP. Langfuse in-app evaluators score groundedness and completeness.",
    task,
    maxConcurrency: args.maxConcurrency,
    metadata: {
      model: params.model,
      prompt_name: QA_CHATBOT_PROMPT_NAME,
      prompt_label: params.promptVersion ? undefined : promptSelector,
      prompt_version: prompt.version,
      dataset_name: args.datasetName,
      run_series: args.runSeries,
      in_app_evaluators: IN_APP_EVALUATORS,
      reference_style: "reference_free",
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
