import fs from "node:fs";
import path from "node:path";
import { createOpenAPI } from "fumadocs-openapi/server";
import openapiSchema from "../lib/openapi-schema.js";

const { OPENAPI_SOURCE_OPTIONS, loadOpenAPIDocument, humanizeName } =
  openapiSchema;

const API_REFERENCE_URL = "https://langfuse.com/docs/api";

function routeFromVirtualPath(filePath) {
  return `/docs/${filePath.replace(/\.mdx$/, "")}`;
}

function getByJsonPointer(document, ref) {
  if (!ref.startsWith("#/")) return undefined;
  return ref
    .slice(2)
    .split("/")
    .map((part) => part.replace(/~1/g, "/").replace(/~0/g, "~"))
    .reduce((value, part) => value?.[part], document);
}

function collectSchemaReferences(
  value,
  document,
  references,
  seen = new Set(),
) {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    for (const item of value) {
      collectSchemaReferences(item, document, references, seen);
    }
    return;
  }

  if (typeof value.$ref === "string" && value.$ref.startsWith("#/")) {
    if (!seen.has(value.$ref)) {
      seen.add(value.$ref);
      const resolved = getByJsonPointer(document, value.$ref);
      if (resolved) {
        references.set(value.$ref, resolved);
        collectSchemaReferences(resolved, document, references, seen);
      }
    }
  }

  for (const nested of Object.values(value)) {
    collectSchemaReferences(nested, document, references, seen);
  }
}

function codeBlock(value) {
  return `\`\`\`json\n${JSON.stringify(value ?? {}, null, 2)}\n\`\`\``;
}

function schemaType(schema) {
  if (!schema) return "any";
  if (schema.$ref) return schema.$ref.split("/").at(-1);
  if (Array.isArray(schema.type)) return schema.type.join(" | ");
  if (schema.type === "array") return `array<${schemaType(schema.items)}>`;
  if (schema.type) return schema.type;
  if (schema.oneOf) return schema.oneOf.map(schemaType).join(" | ");
  if (schema.anyOf) return schema.anyOf.map(schemaType).join(" | ");
  return "any";
}

function addParameters(lines, parameters, references, document) {
  if (!parameters?.length) return;
  lines.push("## Parameters", "");

  for (const parameter of parameters) {
    if (parameter.$ref) {
      lines.push(`- \`${parameter.$ref}\``, "");
      collectSchemaReferences(parameter, document, references);
      continue;
    }

    lines.push(
      `### \`${parameter.name}\` (${parameter.in})`,
      "",
      `- Type: \`${schemaType(parameter.schema)}\``,
      `- Required: ${parameter.required ? "yes" : "no"}`,
    );
    if (parameter.description) lines.push("", parameter.description);
    if (parameter.schema) {
      collectSchemaReferences(parameter.schema, document, references);
    }
    lines.push("");
  }
}

function addRequestBody(lines, requestBody, references, document) {
  if (!requestBody) return;
  lines.push("## Request body", "");

  if (requestBody.$ref) {
    lines.push(`Schema: \`${requestBody.$ref}\``, "");
    collectSchemaReferences(requestBody, document, references);
    return;
  }

  lines.push(`Required: ${requestBody.required ? "yes" : "no"}`, "");
  if (requestBody.description) lines.push(requestBody.description, "");

  for (const [contentType, mediaType] of Object.entries(
    requestBody.content ?? {},
  )) {
    lines.push(`### ${contentType}`, "", codeBlock(mediaType.schema), "");
    collectSchemaReferences(mediaType.schema, document, references);
  }
}

function addResponses(lines, responses, references, document) {
  if (!responses) return;
  lines.push("## Responses", "");

  for (const [status, response] of Object.entries(responses)) {
    lines.push(`### ${status}`, "");
    if (response.$ref) {
      lines.push(`Schema: \`${response.$ref}\``, "");
      collectSchemaReferences(response, document, references);
      continue;
    }
    if (response.description) lines.push(response.description, "");

    for (const [contentType, mediaType] of Object.entries(
      response.content ?? {},
    )) {
      lines.push(`#### ${contentType}`, "", codeBlock(mediaType.schema), "");
      collectSchemaReferences(mediaType.schema, document, references);
    }
  }
}

function addReferencedSchemas(lines, references) {
  if (references.size === 0) return;
  lines.push("## Referenced schemas", "");
  for (const [ref, schema] of references) {
    lines.push(`### ${ref.split("/").at(-1)}`, "", codeBlock(schema), "");
  }
}

function renderOperationMarkdown(page) {
  const {
    document,
    method,
    operation,
    operationPath,
    pathItem,
    route,
    title,
    description,
  } = page;
  const references = new Map();
  const lines = [
    "---",
    `title: ${JSON.stringify(title)}`,
    ...(description ? [`description: ${JSON.stringify(description)}`] : []),
    "---",
    "",
    `# ${title}`,
    "",
    `\`${method.toUpperCase()} ${operationPath}\``,
    "",
  ];

  if (description) lines.push(description, "");

  lines.push(
    `- [Open this endpoint in the interactive API reference](https://langfuse.com${route})`,
    `- [View the full API reference](${API_REFERENCE_URL})`,
    "",
  );

  const security = operation.security ?? document.security;
  if (security?.length) {
    lines.push(
      "## Authentication",
      "",
      "Authenticate with your Langfuse public key as the Basic Auth username and your secret key as the password.",
      "",
    );
  }

  addParameters(
    lines,
    [...(pathItem.parameters ?? []), ...(operation.parameters ?? [])],
    references,
    document,
  );
  addRequestBody(lines, operation.requestBody, references, document);
  addResponses(lines, operation.responses, references, document);
  addReferencedSchemas(lines, references);

  return `${lines.join("\n").trimEnd()}\n`;
}

export async function loadOpenAPIReferencePages() {
  const openapi = createOpenAPI({
    input: { langfuse: loadOpenAPIDocument },
    disableCache: true,
  });
  const source = await openapi.staticSource(OPENAPI_SOURCE_OPTIONS);
  const pages = [];

  for (const file of source.files) {
    if (file.type !== "page") continue;
    const props = file.data.getOpenAPIPageProps();
    const document = file.data.getSchema().bundled;
    const operationRef = props.operations?.[0];
    const webhookRef = props.webhooks?.[0];

    if (operationRef) {
      const pathItem = document.paths?.[operationRef.path];
      const operation = pathItem?.[operationRef.method];
      if (!operation) {
        throw new Error(
          `OpenAPI operation ${operationRef.method.toUpperCase()} ${operationRef.path} is missing from the bundled schema`,
        );
      }
      pages.push({
        virtualPath: file.path,
        route: routeFromVirtualPath(file.path),
        title: file.data.title,
        description: file.data.description,
        method: operationRef.method,
        operationPath: operationRef.path,
        operation,
        pathItem,
        document,
      });
    } else if (webhookRef) {
      const pathItem = document.webhooks?.[webhookRef.name];
      const operation = pathItem?.[webhookRef.method];
      if (!operation) {
        throw new Error(
          `OpenAPI webhook ${webhookRef.method.toUpperCase()} ${webhookRef.name} is missing from the bundled schema`,
        );
      }
      pages.push({
        virtualPath: file.path,
        route: routeFromVirtualPath(file.path),
        title: file.data.title,
        description: file.data.description,
        method: webhookRef.method,
        operationPath: webhookRef.name,
        operation,
        pathItem,
        document,
      });
    }
  }

  if (pages.length === 0) {
    throw new Error(
      "The live Langfuse OpenAPI schema generated no operation pages",
    );
  }

  return pages;
}

export async function generateOpenAPIMarkdown(outputRoot) {
  const pages = await loadOpenAPIReferencePages();

  for (const page of pages) {
    const relativePath = page.virtualPath.replace(/\.mdx$/, ".md");
    const destination = path.join(outputRoot, "docs", relativePath);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, renderOperationMarkdown(page), "utf8");
  }

  console.log(
    `Generated ${pages.length} OpenAPI markdown files in public/md-src/docs/api`,
  );
  return pages;
}

export const _test = {
  getByJsonPointer,
  renderOperationMarkdown,
  routeFromVirtualPath,
  schemaType,
  humanizeName,
};
