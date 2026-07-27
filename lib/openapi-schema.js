"use strict";

const YAML = require("yaml");

const OPENAPI_SCHEMA_URL =
  "https://cloud.langfuse.com/generated/api/openapi.yml";

const OPENAPI_SOURCE_OPTIONS = Object.freeze({
  baseDir: "api",
  per: "operation",
  groupBy: "tag",
  meta: true,
});

const HTTP_METHODS = new Set([
  "get",
  "put",
  "post",
  "delete",
  "options",
  "head",
  "patch",
  "trace",
]);

const DISPLAY_WORDS = new Map([
  ["Llm", "LLM"],
  ["Scim", "SCIM"],
  ["Opentelemetry", "OpenTelemetry"],
]);

function humanizeName(name) {
  return name
    .replace(/[_-]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      const titleCased = word[0].toUpperCase() + word.slice(1);
      return DISPLAY_WORDS.get(titleCased) ?? titleCased;
    })
    .join(" ");
}

function collectTagNames(document) {
  const names = [];
  const seen = new Set();

  function addFromPathItem(pathItem) {
    if (!pathItem || typeof pathItem !== "object") return;
    for (const [method, operation] of Object.entries(pathItem)) {
      if (!HTTP_METHODS.has(method) || !operation?.tags) continue;
      for (const tag of operation.tags) {
        if (typeof tag !== "string" || seen.has(tag)) continue;
        seen.add(tag);
        names.push(tag);
      }
    }
  }

  for (const pathItem of Object.values(document.paths ?? {})) {
    addFromPathItem(pathItem);
  }
  for (const pathItem of Object.values(document.webhooks ?? {})) {
    addFromPathItem(pathItem);
  }

  return names;
}

function normalizeDocument(document) {
  if (!document || typeof document !== "object") {
    throw new Error("the downloaded OpenAPI document is not an object");
  }
  if (!document.openapi && !document.swagger) {
    throw new Error("the downloaded document has no OpenAPI version");
  }
  if (!document.paths || typeof document.paths !== "object") {
    throw new Error("the downloaded OpenAPI document has no paths");
  }

  const existingTags = Array.isArray(document.tags) ? document.tags : [];
  const tagsByName = new Map(
    existingTags
      .filter((tag) => tag && typeof tag.name === "string")
      .map((tag) => [tag.name, tag]),
  );

  document.tags = collectTagNames(document).map((name) => ({
    ...(tagsByName.get(name) ?? { name }),
    "x-displayName":
      tagsByName.get(name)?.["x-displayName"] ?? humanizeName(name),
  }));

  function addDisplaySummary(pathItem) {
    if (!pathItem || typeof pathItem !== "object") return;
    for (const [method, operation] of Object.entries(pathItem)) {
      if (
        !HTTP_METHODS.has(method) ||
        !operation ||
        operation.summary ||
        !operation.operationId
      ) {
        continue;
      }
      const operationName = operation.operationId.split("_").at(-1);
      operation.summary = humanizeName(operationName);
    }
  }

  for (const pathItem of Object.values(document.paths)) {
    addDisplaySummary(pathItem);
  }
  for (const pathItem of Object.values(document.webhooks ?? {})) {
    addDisplaySummary(pathItem);
  }

  document.info = {
    ...document.info,
    title:
      document.info?.title && document.info.title !== "server"
        ? document.info.title
        : "Langfuse API",
  };

  document.servers = [
    {
      url: "https://cloud.langfuse.com",
      description: "Cloud EU",
    },
    {
      url: "https://us.cloud.langfuse.com",
      description: "Cloud US",
    },
    {
      url: "https://jp.cloud.langfuse.com",
      description: "Cloud Japan",
    },
    {
      url: "https://hipaa.cloud.langfuse.com",
      description: "HIPAA US",
    },
    {
      url: "{selfHostedUrl}",
      description: "Self-hosted",
      variables: {
        selfHostedUrl: {
          default: "http://localhost:3000",
          description: "Your Langfuse base URL",
        },
      },
    },
  ];

  return document;
}

async function loadOpenAPIDocument() {
  let response;
  try {
    response = await fetch(OPENAPI_SCHEMA_URL, {
      cache: "no-store",
      headers: {
        accept: "application/yaml, application/json;q=0.9, text/yaml;q=0.8",
      },
    });
  } catch (error) {
    throw new Error(
      `Failed to fetch the Langfuse OpenAPI schema from ${OPENAPI_SCHEMA_URL}: ${error.message}`,
      { cause: error },
    );
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch the Langfuse OpenAPI schema from ${OPENAPI_SCHEMA_URL}: HTTP ${response.status} ${response.statusText}`,
    );
  }

  const source = await response.text();
  if (!source.trim()) {
    throw new Error(
      `The Langfuse OpenAPI schema at ${OPENAPI_SCHEMA_URL} is empty`,
    );
  }

  try {
    // The trusted generated schema reuses response blocks with many YAML
    // aliases, exceeding yaml's conservative default alias-count limit.
    return normalizeDocument(
      YAML.parse(source, undefined, { maxAliasCount: -1 }),
    );
  } catch (error) {
    throw new Error(
      `Failed to parse the Langfuse OpenAPI schema from ${OPENAPI_SCHEMA_URL}: ${error.message}`,
      { cause: error },
    );
  }
}

module.exports = {
  OPENAPI_SCHEMA_URL,
  OPENAPI_SOURCE_OPTIONS,
  humanizeName,
  loadOpenAPIDocument,
  normalizeDocument,
};
