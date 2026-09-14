import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const DATASET_NAME = "SDK integration docs grounding";
const SCHEMA_VERSION = "sdk_integration_grounding_v1";
const DEFAULT_PRODUCT_JUDGE_PROVIDER = "openai";
const DEFAULT_PRODUCT_JUDGE_MODEL = "gpt-4o-mini";

type ProductEvaluator = {
  name: string;
  type: "llm_as_judge";
  prompt: string;
  outputDefinition: {
    dataType: "NUMERIC";
    score: { description: string };
    reasoning: { description: string };
  };
};

const commonPromptContext = [
  "You are evaluating a Langfuse documentation QA chatbot experiment item.",
  "This dataset is reference-free: there is no expected output or golden answer.",
  "Use the item metadata as the source-of-truth for which Langfuse docs pages the answer should be grounded in.",
  "Do not reward plausible generic SDK knowledge unless the answer anchors it to the provided Langfuse docs or clearly names current documented packages/versions.",
  "",
  "User input:",
  "{{input}}",
  "",
  "Actual answer:",
  "{{output}}",
  "",
  "Integration metadata:",
  "- integration: {{integration}}",
  "- integration type: {{integration_type}}",
  "- docs URLs: {{docs_urls}}",
  "- docs paths: {{docs_paths}}",
  "- expected focus: {{focus}}",
  "- requires version/package detail: {{requires_version_or_package}}",
].join("\n");

const PRODUCT_EVALUATORS: ProductEvaluator[] = [
  {
    name: "sdk-integration-docs-groundedness",
    type: "llm_as_judge",
    prompt: [
      commonPromptContext,
      "",
      "Score docs groundedness.",
      "A score of 1 means the answer is clearly grounded in the relevant Langfuse docs for the named integration and avoids unsupported or stale claims.",
      "A score of 0.5 means the answer is mostly relevant but mixes docs-grounded details with generic or weakly supported claims, or misses important caveats from the docs.",
      "A score of 0 means the answer is mostly generic, appears to rely on training data, cites the wrong integration path, fabricates docs behavior, or contradicts the provided Langfuse docs metadata.",
    ].join("\n"),
    outputDefinition: {
      dataType: "NUMERIC",
      score: {
        description:
          "0 = not docs-grounded, 0.5 = partially grounded, 1 = grounded in the relevant Langfuse docs.",
      },
      reasoning: {
        description:
          "Explain which parts are grounded, unsupported, stale, or contradicted by the docs metadata.",
      },
    },
  },
  {
    name: "sdk-integration-docs-citation-completeness",
    type: "llm_as_judge",
    prompt: [
      commonPromptContext,
      "",
      "Score docs citation completeness.",
      "A score of 1 means the answer cites or links the most relevant provided Langfuse docs page(s), and the citations match the integration being asked about.",
      "A score of 0.5 means the answer names Langfuse docs or cites only a partially relevant page, but misses a key page from the provided docs URLs or gives vague references.",
      "A score of 0 means the answer has no useful Langfuse docs reference, cites unrelated docs, or invents/uses stale URLs.",
    ].join("\n"),
    outputDefinition: {
      dataType: "NUMERIC",
      score: {
        description:
          "0 = no useful docs citation, 0.5 = partial or vague citation, 1 = cites the relevant provided Langfuse docs.",
      },
      reasoning: {
        description:
          "Explain whether cited docs are present, relevant, complete, missing, or incorrect.",
      },
    },
  },
  {
    name: "sdk-integration-package-version-completeness",
    type: "llm_as_judge",
    prompt: [
      commonPromptContext,
      "",
      "Score package and version completeness.",
      "A score of 1 means the answer includes the documented package names, SDK version families, compatibility notes, or upgrade-path details required for this integration when the metadata says version/package detail is required.",
      "A score of 0.5 means the answer includes some package or setup detail but misses an important package name, SDK version family, compatibility constraint, or migration caveat.",
      "A score of 0 means the answer omits package/version details, gives outdated package names, invents versions, or gives details for the wrong SDK/provider.",
      "If the item does not require version or package details, score whether the answer correctly avoids unnecessary invented version claims.",
    ].join("\n"),
    outputDefinition: {
      dataType: "NUMERIC",
      score: {
        description:
          "0 = missing/wrong package or version details, 0.5 = partial, 1 = complete documented package/version details.",
      },
      reasoning: {
        description:
          "Explain which package names, SDK version families, compatibility notes, or upgrade details are present, missing, or incorrect.",
      },
    },
  },
];

const RULES = [
  {
    name: "sdk-integration-docs-groundedness-experiment",
    evaluatorName: "sdk-integration-docs-groundedness",
  },
  {
    name: "sdk-integration-docs-citation-completeness-experiment",
    evaluatorName: "sdk-integration-docs-citation-completeness",
  },
  {
    name: "sdk-integration-package-version-completeness-experiment",
    evaluatorName: "sdk-integration-package-version-completeness",
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

function readEnvFile(envFile: string) {
  const fullPath = resolve(process.cwd(), envFile);
  if (!existsSync(fullPath)) {
    throw new Error(`Env file does not exist: ${fullPath}`);
  }

  const values = parseEnv(readFileSync(fullPath, "utf8"));
  for (const [key, value] of Object.entries(values)) {
    if (!process.env[key]) process.env[key] = value;
  }

  const baseUrl = values.LANGFUSE_BASE_URL ?? values.LANGFUSE_HOST;
  if (baseUrl) {
    process.env.LANGFUSE_BASE_URL = process.env.LANGFUSE_BASE_URL ?? baseUrl;
    process.env.LANGFUSE_HOST = process.env.LANGFUSE_HOST ?? baseUrl;
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

async function getDatasetId() {
  const result = await mcpCall<{ data: Array<{ id: string; name: string }> }>(
    "listDatasets",
    {
      name: DATASET_NAME,
      page: 1,
      limit: 10,
    },
  );
  const dataset = result.data.find((entry) => entry.name === DATASET_NAME);
  if (!dataset) throw new Error(`Dataset not found: ${DATASET_NAME}`);
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
  evaluator: ProductEvaluator,
  existingEvaluatorNames: Set<string>,
) {
  if (existingEvaluatorNames.has(evaluator.name)) {
    console.log(`Product evaluator exists: ${evaluator.name}`);
    return "existing";
  }

  try {
    await mcpCall("upsertEvaluator", evaluator);
    console.log(
      `Created product evaluator using project default model: ${evaluator.name}`,
    );
    return "created-default-model";
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
      `Created product evaluator with explicit model config: ${evaluator.name} (${modelConfig.provider}/${modelConfig.model})`,
    );
    return "created-explicit-model";
  }
}

function makeRule(rule: (typeof RULES)[number], datasetId: string) {
  return {
    name: rule.name,
    evaluator: {
      name: rule.evaluatorName,
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
        variable: "docs_urls",
        source: "experiment_item_metadata",
        jsonPath: "$.docs_urls",
      },
      {
        variable: "docs_paths",
        source: "experiment_item_metadata",
        jsonPath: "$.docs_paths",
      },
      {
        variable: "integration",
        source: "experiment_item_metadata",
        jsonPath: "$.integration",
      },
      {
        variable: "integration_type",
        source: "experiment_item_metadata",
        jsonPath: "$.integration_type",
      },
      {
        variable: "focus",
        source: "experiment_item_metadata",
        jsonPath: "$.focus",
      },
      {
        variable: "requires_version_or_package",
        source: "experiment_item_metadata",
        jsonPath: "$.requires_version_or_package",
      },
    ],
  };
}

async function main() {
  const envFile = process.argv[2] ?? ".env_sample_project";
  readEnvFile(envFile);

  const datasetId = await getDatasetId();
  const evaluators = await mcpCall<{
    data: Array<{ id: string; name: string; type: string }>;
  }>("listEvaluators", {
    page: 1,
    limit: 100,
  });
  const existingEvaluatorNames = new Set(
    evaluators.data.map((evaluator) => evaluator.name),
  );
  const evaluatorResults: Record<string, string> = {};

  for (const evaluator of PRODUCT_EVALUATORS) {
    evaluatorResults[evaluator.name] = await ensureProductEvaluator(
      evaluator,
      existingEvaluatorNames,
    );
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
  const ruleResults: Record<string, string> = {};

  for (const ruleInfo of RULES) {
    const rule = makeRule(ruleInfo, datasetId);
    const existingRuleId = existingRules.get(rule.name);
    if (existingRuleId) {
      await mcpCall("updateEvaluationRule", {
        evaluationRuleId: existingRuleId,
        ...rule,
        evaluator: { name: rule.evaluator.name, scope: rule.evaluator.scope },
      });
      ruleResults[rule.name] = "updated";
      console.log(`Updated product evaluation rule: ${rule.name}`);
    } else {
      await mcpCall("createEvaluationRule", rule);
      ruleResults[rule.name] = "created";
      console.log(`Created product evaluation rule: ${rule.name}`);
    }
  }

  const readBackRules = await mcpCall<{
    data: Array<{
      id: string;
      name: string;
      enabled?: boolean;
      target?: string;
    }>;
  }>("listEvaluationRules", { page: 1, limit: 100 });
  const relevantRules = readBackRules.data.filter((rule) =>
    RULES.some((expected) => expected.name === rule.name),
  );

  console.log(
    JSON.stringify(
      {
        datasetName: DATASET_NAME,
        datasetId,
        schemaVersion: SCHEMA_VERSION,
        evaluatorResults,
        ruleResults,
        relevantRuleCount: relevantRules.length,
        relevantRules,
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
