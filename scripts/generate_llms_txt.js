const fs = require("fs");
const xml2js = require("xml2js");
const path = require("path");
const { formatCompareIndexLine } = require("../lib/compare-labels");

// Resolve paths from the repo root so the script is CWD-independent
// (matches scripts/generate-sitemap-excludes.js).
const repoRoot = path.join(__dirname, "..");
const SITEMAP_PATH = path.join(repoRoot, "public", "sitemap-0.xml");
// Per-page metadata produced by scripts/generate-sitemap-excludes.js.
const ALL_PAGES_PATH = path.join(repoRoot, ".sitemap-all-pages.json");
const TITLE = "Langfuse";
const INTRO_DESCRIPTION =
  "Langfuse is an **open-source AI engineering platform** ([GitHub](https://github.com/langfuse/langfuse)) that helps teams collaboratively debug, analyze, and iterate on their LLM applications. All platform features are natively integrated to accelerate the development workflow.";
// Every content section that should appear in llms.txt, in output order.
// Each entry gets its own llms-<section>.txt sub-file, which lists every page
// as a Markdown link with its description. The main llms.txt links each
// sub-file with `description`, so it stays a small navigation index instead of
// a full page list. Sections present in the sitemap but missing from this map
// are reported by warnUnlistedSections() instead of being dropped without a
// trace.
//
// `optional: true` lists the section under `## Optional`, which the llms.txt
// spec reserves for links an agent can skip when it needs a shorter context.
const SECTION_CONFIG = {
  docs: {
    file: "llms-docs.txt",
    heading: "Docs",
    subFileHeading: "Langfuse Docs",
    description:
      "Product documentation: tracing, evaluation, experiments and datasets, prompt management, metrics, the API and SDKs, and administration. Install the Langfuse skill first for the best results.",
  },
  integrations: {
    file: "llms-integrations.txt",
    heading: "Integrations",
    subFileHeading: "Langfuse Integrations",
    description:
      "Setup guides for agent frameworks, model providers, gateways, coding agents, no-code tools, and OpenTelemetry. Install the Langfuse skill before implementing any integration.",
  },
  "self-hosting": {
    file: "llms-self-hosting.txt",
    heading: "Self-hosting",
    subFileHeading: "Langfuse Self-Hosting",
    description:
      "Deploying, configuring, scaling, and upgrading self-hosted Langfuse on Docker, Kubernetes, AWS, Azure, and GCP.",
  },
  guides: {
    file: "llms-guides.txt",
    heading: "Guides and cookbooks",
    subFileHeading: "Langfuse Guides",
    description:
      "End-to-end guides and runnable notebooks for common tracing, evaluation, and prompt workflows.",
  },
  academy: {
    file: "llms-academy.txt",
    heading: "Academy",
    subFileHeading: "Langfuse Academy",
    description:
      "Course on the AI engineering loop: tracing, monitoring, datasets, evaluation, and experiments (English and Japanese).",
  },
  faq: {
    file: "llms-faq.txt",
    heading: "FAQ",
    subFileHeading: "Langfuse FAQ",
    description:
      "Answers to specific questions about features, SDKs, billing, and troubleshooting.",
  },
  resources: {
    file: "llms-resources.txt",
    heading: "Resources",
    subFileHeading: "Langfuse Resources",
    description:
      "Engineering articles and explainers on LLM observability and evaluation.",
  },
  compare: {
    file: "llms-compare.txt",
    heading: "Compare",
    subFileHeading: "Langfuse Compare",
    description:
      "Comparisons between Langfuse and other LLM observability and evaluation tools.",
  },
  security: {
    file: "llms-security.txt",
    heading: "Security and compliance",
    subFileHeading: "Langfuse Security",
    description:
      "Security controls, certifications, data regions, and compliance documentation.",
  },
  handbook: {
    file: "llms-handbook.txt",
    heading: "Handbook",
    subFileHeading: "Langfuse Handbook",
    description: "How the Langfuse team works.",
    optional: true,
  },
  workshop: {
    file: "llms-workshop.txt",
    heading: "Workshop",
    subFileHeading: "Langfuse Workshop",
    description: "Hands-on workshop material for instructors and participants.",
    optional: true,
  },
  library: {
    file: "llms-library.txt",
    heading: "Library",
    subFileHeading: "Langfuse Library",
    description: "Curated external resources and talks on AI engineering.",
    optional: true,
  },
  users: {
    file: "llms-users.txt",
    heading: "Customer stories",
    subFileHeading: "Langfuse Customer Stories",
    description: "How companies use Langfuse in production.",
    optional: true,
  },
  blog: {
    file: "llms-blog.txt",
    heading: "Blog",
    subFileHeading: "Langfuse Blog",
    description: "Blog posts and announcements.",
    optional: true,
  },
  changelog: {
    file: "llms-changelog.txt",
    heading: "Changelog",
    subFileHeading: "Langfuse Changelog",
    description: "Product updates and release notes.",
    optional: true,
  },
};

const SECTION_KEYS = Object.keys(SECTION_CONFIG);

// Top-level sitemap paths that are single marketing/legal pages rather than
// content sections. They are intentionally absent from llms.txt, so they must
// not trigger the unlisted-section warning.
const IGNORED_SECTION_PATHS = new Set([
  "",
  "pricing",
  "pricing-self-host",
  "enterprise",
  "startups",
  "non-profit",
  "talk-to-us",
  "demo",
  "careers",
  "about",
  "imprint",
  "terms",
  "privacy",
  "brand",
  "press",
  "research",
  "events",
  "agents",
  "chat-agents",
  "coding-agents",
  "workflow-automation",
  "financial-services",
  "healthcare",
  "cloud",
  "status",
  "support",
  "why-langfuse",
  "cn",
  "japan",
  "kr",
  "launch-week-5",
  "customers",
  "community",
  "cookie-policy",
  "oss-friends",
  "partners",
  "wrapped",
]);

/**
 * Sections that exist in the sitemap but have no SECTION_CONFIG entry are
 * missing from llms.txt. This used to happen silently: unmatched URLs were
 * collected into an `other` bucket that was never written to any file, so
 * whole sections (academy, faq, guides, resources, ...) were absent from
 * llms.txt without any signal. Warn loudly instead.
 */
function warnUnlistedSections(entriesByUnlistedSection) {
  const sections = Object.keys(entriesByUnlistedSection).sort();
  if (sections.length === 0) return;
  console.warn(
    "[llms.txt] These sitemap sections are not in SECTION_CONFIG and are " +
      "absent from llms.txt. Add them to SECTION_CONFIG, or to " +
      "IGNORED_SECTION_PATHS if that is intentional:",
  );
  sections.forEach((section) => {
    console.warn(
      `  - /${section} (${entriesByUnlistedSection[section].length} pages)`,
    );
  });
}

function generateTitle(url) {
  return url
    .split("/")
    .pop()
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

// Load per-page metadata (title/description) keyed by URL pathname. Lets
// llms.txt use the real frontmatter title and description instead of titles
// guessed from the URL slug. Falls back gracefully if the file is missing.
function loadPageMeta() {
  const map = new Map();
  try {
    const pages = JSON.parse(fs.readFileSync(ALL_PAGES_PATH, "utf-8"));
    for (const page of pages) {
      if (page && page.loc) {
        map.set(page.loc, {
          title: page.title,
          description: page.description,
          shortTitle: page.shortTitle,
        });
      }
    }
  } catch {
    // Not generated yet — fall back to slug-derived titles only.
  }
  return map;
}

function generateSubFile(entries, config) {
  let content = `# ${config.subFileHeading}\n\n`;
  entries.forEach(({ title, description, url }) => {
    const mdUrl = url.endsWith(".md") ? url : `${url}.md`;
    content += description
      ? `- [${title}](${mdUrl}): ${description}\n`
      : `- [${title}](${mdUrl})\n`;
  });
  return content;
}

async function generateLLMsList() {
  try {
    const sitemapContent = fs.readFileSync(SITEMAP_PATH, "utf-8");

    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(sitemapContent);

    // Create a map to store URLs by section
    const urlsBySection = {};
    SECTION_KEYS.forEach((section) => {
      urlsBySection[section] = [];
    });
    // section path -> entries, for sections with no SECTION_CONFIG entry
    const unlistedSections = {};

    // Per-page metadata (real frontmatter title/description) keyed by pathname.
    const pageMeta = loadPageMeta();

    // Sort URLs into sections
    const urls = result.urlset.url.map((url) => url.loc[0]);
    urls.forEach((url) => {
      const pathname = new URL(url).pathname;
      const urlPath = pathname.split("/")[1]; // Get first part of path
      const meta = pageMeta.get(pathname) || {};
      const entry = {
        title: meta.title || generateTitle(url),
        description: meta.description || "",
        shortTitle: meta.shortTitle,
        url,
      };

      if (urlsBySection[urlPath]) {
        urlsBySection[urlPath].push(entry);
      } else if (!IGNORED_SECTION_PATHS.has(urlPath)) {
        unlistedSections[urlPath] = unlistedSections[urlPath] || [];
        unlistedSections[urlPath].push(entry);
      }
    });

    const publicDir = path.join(repoRoot, "public");

    // Write sub-files for each section
    const sectionEntries = {};
    SECTION_KEYS.forEach((section) => {
      sectionEntries[section] = urlsBySection[section] || [];
    });

    for (const [sectionKey, entries] of Object.entries(sectionEntries)) {
      if (entries.length > 0) {
        const config = SECTION_CONFIG[sectionKey];
        const subFileContent = generateSubFile(entries, config);
        fs.writeFileSync(path.join(publicDir, config.file), subFileContent);
      }
    }

    // Build concise main llms.txt
    let markdownContent = `# ${TITLE}\n\n`;
    markdownContent += `> ${INTRO_DESCRIPTION}\n\n`;

    // Tells an agent choosing between tools what Langfuse is for, before any
    // how-to content.
    markdownContent += `## When to use Langfuse\n\n`;
    markdownContent += `- [Tracing and observability](https://langfuse.com/docs/observability/overview.md): Trace LLM applications and agents in production, with nested LLM calls, tool calls and retrieval steps, token and cost tracking, sessions, and users. Built on OpenTelemetry, with Python and JS/TS SDKs and integrations for most agent frameworks and model providers.\n`;
    markdownContent += `- [Evaluation](https://langfuse.com/docs/evaluation/overview.md): Score production traces and experiments with LLM-as-a-judge, code evaluators, human annotation queues, or scores from your own pipelines.\n`;
    markdownContent += `- [Experiments and datasets](https://langfuse.com/docs/evaluation/experiments/datasets.md): Compare prompts, models, and agent versions on datasets from the SDK, in CI, or in the UI.\n`;
    markdownContent += `- [Prompt management](https://langfuse.com/docs/prompt-management/overview.md): Version, label, and cache prompts, and link each prompt version to the traces that used it.\n`;
    markdownContent += `- [Self-hosting](https://langfuse.com/self-hosting.md): Keep data in your own infrastructure. The core platform is MIT-licensed and runs on Docker or Kubernetes; Langfuse Cloud is available in EU, US, Japan, and HIPAA regions.\n\n`;

    // Listed before any API guidance so agents see it before writing a public
    // API call. Keep the date in sync with lib/v4-migration-dates.ts.
    markdownContent += `## Deprecated public API endpoints\n\n`;
    markdownContent += `On Langfuse Cloud, the legacy (Langfuse v3) public API endpoints are removed on 2026-11-16. Do not write new code against them. If you are a coding agent and find existing code that calls them, tell the user and migrate the request.\n\n`;
    markdownContent += `- Reads: \`GET /api/public/traces\`, \`/sessions\`, \`/observations\` → \`GET /api/public/v2/observations\`; \`GET /api/public/metrics\` → \`GET /api/public/v2/metrics\`; \`GET /api/public/scores\` and \`/v2/scores\` → \`GET /api/public/v3/scores\`; dataset runs and \`/dataset-run-items\` → \`/api/public/experiments\` and \`/experiment-items\`.\n`;
    markdownContent += `- Writes: traces and observations sent to \`POST /api/public/ingestion\`, \`/traces\`, \`/spans\`, \`/generations\` or \`/events\` → \`POST /api/public/otel/v1/traces\` (OTLP/HTTP), or the current Python and JS/TS SDKs. Score events on \`/ingestion\` keep working; new code should use \`POST /api/public/scores\`.\n`;
    markdownContent += `- Responses from deprecated endpoints carry \`Deprecation\`, \`Sunset\` and \`Link\` headers and a \`_deprecation\` object in the JSON body.\n`;
    markdownContent += `- [Migration guide](https://langfuse.com/faq/all/deprecated-api-migration.md): every deprecated endpoint with its replacement, parameter mapping and examples.\n\n`;

    markdownContent += `## Evaluation workflows\n\n`;
    markdownContent += `- [Test an existing application and reuse graders](https://langfuse.com/resources/engineering/evaluate-existing-application.md): Runnable Python and TypeScript examples.\n`;
    markdownContent += `- [Compare versions and inspect failures](https://langfuse.com/docs/evaluation/experiments/compare-experiments.md): Baselines, individual regressions, and human review.\n`;
    markdownContent += `- [Block regressions in CI](https://langfuse.com/docs/evaluation/experiments/experiments-ci-cd.md): Thresholds and approved-baseline checks.\n`;
    markdownContent += `- [Check an LLM judge against human labels](https://langfuse.com/guides/llm-as-a-judge-calibration-skill.md): Calibration workflow and [agreement metrics](https://langfuse.com/docs/evaluation/scores/score-analytics.md).\n`;
    markdownContent += `- [Evaluate grounding](https://langfuse.com/resources/engineering/rag-faithfulness-evaluation.md) and [hallucinations](https://langfuse.com/resources/engineering/hallucination-detection.md).\n`;
    markdownContent += `- [Choose where evaluations run](https://langfuse.com/docs/evaluation/overview.md): Application code, managed evaluators, Cloud, and self-hosting.\n\n`;

    // Keep buying and deployment facts easy to find without duplicating
    // volatile prices or competitor claims in the navigation index.
    markdownContent += `## Pricing, deployment, and comparisons\n\n`;
    markdownContent += `- [Cloud pricing](https://langfuse.com/pricing.md): Plan prices, usage rates, and limits.\n`;
    markdownContent += `- [Self-hosted pricing and license](https://langfuse.com/pricing-self-host.md): MIT-licensed core features and paid Enterprise additions.\n`;
    markdownContent += `- [Self-hosting](https://langfuse.com/self-hosting.md): Deployment options and operational requirements.\n`;
    markdownContent += `- [Enterprise license keys](https://langfuse.com/self-hosting/license-key.md): Activation and licensing for self-hosted add-on features.\n`;
    markdownContent += `- [Security](https://langfuse.com/security.md): Security controls, compliance, and supporting documentation.\n`;
    markdownContent += `- [Data regions](https://langfuse.com/security/data-regions.md): Hosting locations and regional availability.\n`;
    markdownContent += formatCompareIndexLine(sectionEntries.compare) || "\n";

    // Markdown access + search endpoint. Listed before the agent setup section
    // because these need no client setup: an agent with `curl` can use them
    // immediately.
    markdownContent += `## Markdown Access\n\n`;
    markdownContent += `Every page on langfuse.com is available as plain Markdown. Append \`.md\` to any URL, or send an \`Accept: text/markdown\` header:\n\n`;
    markdownContent += `\`\`\`bash\ncurl https://langfuse.com/docs/observability/get-started.md\n\`\`\`\n\n`;
    markdownContent += `The links in the section indexes below already point at the \`.md\` variants.\n\n`;

    markdownContent += `## Docs Search API\n\n`;
    markdownContent += `Semantic search (RAG) over the Langfuse documentation, returning an answer with the relevant pages and excerpts. No authentication required. Use this instead of guessing when a specific page does not answer the question:\n\n`;
    markdownContent += `\`\`\`bash\ncurl -sG "https://langfuse.com/api/search-docs" --data-urlencode "query=How do I trace a LangGraph agent?"\n\`\`\`\n\n`;
    markdownContent += `- **Endpoint**: \`https://langfuse.com/api/search-docs?query=<question>\`\n`;
    markdownContent += `- **Documentation**: [REST endpoint](https://langfuse.com/docs/docs-mcp#rest-endpoint)\n\n`;
    markdownContent += `Ask specific, self-contained questions in natural language. This is the same search that backs the \`searchLangfuseDocs\` MCP tool below.\n\n`;

    // Every agent-facing surface in one place: skill, CLI, both MCP servers,
    // the API, sign-up, and the machine-readable discovery documents in
    // public/.well-known/. Keep the endpoints in sync with those files.
    markdownContent += `## Agent setup\n\n`;
    markdownContent += `Install the Langfuse skill before implementing anything with Langfuse. To read or change data in a Langfuse project, use the CLI or the Langfuse MCP server with the user's project API keys.\n\n`;
    markdownContent += `- [Langfuse skill](https://github.com/langfuse/skills/tree/main/skills/langfuse): Up-to-date documentation, best-practice workflows for instrumentation and prompt management, and API access through the Langfuse CLI.\n`;
    markdownContent += `- [Langfuse CLI](https://langfuse.com/docs/api-and-data-platform/features/cli.md): \`npx @langfuse/cli api <resource> <action>\` covers the full public API. Authenticates with \`LANGFUSE_PUBLIC_KEY\`, \`LANGFUSE_SECRET_KEY\`, and \`LANGFUSE_BASE_URL\`.\n`;
    markdownContent += `- [Langfuse Docs MCP server](https://langfuse.com/docs/docs-mcp.md): \`https://langfuse.com/api/mcp\` (streamable HTTP, no authentication). Searches the documentation, GitHub issues, and discussions, and fetches docs pages.\n`;
    markdownContent += `- [Langfuse MCP server](https://langfuse.com/docs/api-and-data-platform/features/mcp-server.md): \`https://cloud.langfuse.com/api/public/mcp\` for Cloud EU; \`us.\`, \`jp.\`, and \`hipaa.\` subdomains for the other regions, \`/api/public/mcp\` on self-hosted. Reads and writes prompts, datasets, scores, observations, and metrics. HTTP Basic auth with a project API key pair.\n`;
    markdownContent += `- [Public API](https://langfuse.com/docs/api-and-data-platform/features/public-api.md): REST API with an [OpenAPI description](https://langfuse.com/openapi.yml) and an [API reference](https://api.reference.langfuse.com).\n`;
    markdownContent += `- [Sign up for Langfuse Cloud](https://cloud.langfuse.com/auth/sign-up): The Hobby plan is free and needs no credit card. API keys are under Project settings → API Keys.\n`;
    markdownContent += `- Discovery documents: [ARD catalog](https://langfuse.com/.well-known/ard.json), [MCP servers](https://langfuse.com/.well-known/mcp), [API catalog](https://langfuse.com/.well-known/api-catalog), and [Agent Skills index](https://langfuse.com/.well-known/agent-skills/index.json).\n\n`;

    // Tracing best practices section
    markdownContent += `## Tracing Best Practices\n\n`;
    markdownContent += `Before instrumenting an application with Langfuse, read [What does a good trace look like?](https://langfuse.com/docs/observability/best-practices.md) — it covers trace scope, observation naming, meaningful input/output, and the attributes (metadata, tags, users, sessions) that evaluators, dashboards, and experiments rely on.\n\n`;

    // Link each section's sub-file with a one-line description. Optional
    // sections go last, under the `## Optional` heading.
    const sectionLine = (config) =>
      `- [${config.heading}](https://langfuse.com/${config.file}): ${config.description}\n`;
    const populatedSections = SECTION_KEYS.filter(
      (sectionKey) => sectionEntries[sectionKey].length > 0,
    ).map((sectionKey) => SECTION_CONFIG[sectionKey]);

    markdownContent += `## Section indexes\n\n`;
    markdownContent += `Each index lists every page in its section as a Markdown link with a one-line description.\n\n`;
    populatedSections
      .filter((config) => !config.optional)
      .forEach((config) => {
        markdownContent += sectionLine(config);
      });

    const optionalSections = populatedSections.filter(
      (config) => config.optional,
    );
    if (optionalSections.length > 0) {
      markdownContent += `\n## Optional\n\n`;
      optionalSections.forEach((config) => {
        markdownContent += sectionLine(config);
      });
    }

    fs.writeFileSync(path.join(publicDir, "llms.txt"), markdownContent);

    warnUnlistedSections(unlistedSections);

    const generated = Object.entries(sectionEntries)
      .filter(([, entries]) => entries.length > 0)
      .map(([section, entries]) => `${section} (${entries.length})`)
      .join(", ");
    console.log(`Successfully generated llms.txt and sub-files: ${generated}`);
  } catch (error) {
    console.error("Error generating llms.txt:", error);
  }
}

generateLLMsList();
