const fs = require("fs");
const xml2js = require("xml2js");
const path = require("path");

// Resolve paths from the repo root so the script is CWD-independent
// (matches scripts/generate-sitemap-excludes.js).
const repoRoot = path.join(__dirname, "..");
const SITEMAP_PATH = path.join(repoRoot, "public", "sitemap-0.xml");
// Per-page metadata produced by scripts/generate-sitemap-excludes.js.
const ALL_PAGES_PATH = path.join(repoRoot, ".sitemap-all-pages.json");
const TITLE = "Langfuse";
const INTRO_DESCRIPTION =
  "Langfuse is an **open-source AI engineering platform** ([GitHub](https://github.com/langfuse/langfuse)) that helps teams collaboratively debug, analyze, and iterate on their LLM applications. All platform features are natively integrated to accelerate the development workflow.";
const MAIN_SECTIONS = ["docs", "integrations"];
const OPTIONAL_SECTIONS = ["self-hosting"];

// Map section keys to sub-file names and display names
const SECTION_CONFIG = {
  docs: {
    file: "llms-docs.txt",
    heading: "Docs",
    subFileHeading: "Langfuse Docs",
  },
  integrations: {
    file: "llms-integrations.txt",
    heading: "Integrations",
    subFileHeading: "Langfuse Integrations",
  },
  "self-hosting": {
    file: "llms-self-hosting.txt",
    heading: "Optional: Self-Hosting",
    subFileHeading: "Langfuse Self-Hosting",
  },
};

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
    const urlsBySection = {
      other: [],
      optional: [],
    };
    MAIN_SECTIONS.forEach((section) => {
      urlsBySection[section] = [];
    });

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
        url,
      };

      if (MAIN_SECTIONS.includes(urlPath)) {
        urlsBySection[urlPath].push(entry);
      } else if (OPTIONAL_SECTIONS.includes(urlPath)) {
        urlsBySection.optional.push(entry);
      } else {
        urlsBySection.other.push(entry);
      }
    });

    const publicDir = path.join(repoRoot, "public");

    // Write sub-files for each section
    const sectionEntries = {
      docs: urlsBySection.docs || [],
      integrations: urlsBySection.integrations || [],
      "self-hosting": urlsBySection.optional || [],
    };

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

    // MCP server section (unchanged)
    markdownContent += `## Langfuse Docs MCP Server\n\n`;
    markdownContent += `Connect to the Langfuse Docs MCP server to access documentation directly in your AI editor:\n\n`;
    markdownContent += `- **Endpoint**: \`https://langfuse.com/api/mcp\`\n`;
    markdownContent += `- **Transport**: \`streamableHttp\`\n`;
    markdownContent += `- **Documentation**: [Langfuse Docs MCP Server](https://langfuse.com/docs/docs-mcp)\n\n`;
    markdownContent += `The MCP server provides tools to search Langfuse documentation, GitHub issues, and discussions. See the [installation guide](https://langfuse.com/docs/docs-mcp) for setup instructions in Cursor, VS Code, Claude Desktop, and other MCP clients.\n\n`;

    // Langfuse Skill section
    markdownContent += `## Langfuse Skill for AI Coding Agents\n\n`;
    markdownContent += `Install the Langfuse skill before implementing anything with Langfuse. The skill provides up-to-date documentation, best-practice workflows for instrumentation, prompt management, and programmatic API access via the Langfuse CLI.\n\n`;
    markdownContent += `Install from: [github.com/langfuse/skills](https://github.com/langfuse/skills/tree/main/skills/langfuse)\n\n`;

    // Tracing best practices section
    markdownContent += `## Tracing Best Practices\n\n`;
    markdownContent += `Before instrumenting an application with Langfuse, read [What does a good trace look like?](https://langfuse.com/docs/observability/best-practices.md) — it covers trace scope, observation naming, meaningful input/output, and the attributes (metadata, tags, users, sessions) that evaluators, dashboards, and experiments rely on.\n\n`;

    // Section-specific intro sentences that mention the Langfuse skill
    const sectionIntros = {
      docs: `For the best results, install the [Langfuse skill](https://github.com/langfuse/skills/tree/main/skills/langfuse) before using these docs.`,
      integrations: `For the best results, install the [Langfuse skill](https://github.com/langfuse/skills/tree/main/skills/langfuse) before implementing any integration.`,
    };

    // Add each section with sub-file link and comma-separated titles
    for (const [sectionKey, entries] of Object.entries(sectionEntries)) {
      if (entries.length > 0) {
        const config = SECTION_CONFIG[sectionKey];
        const titles = entries.map((e) => e.title).join(", ");

        markdownContent += `## ${config.heading}\n\n`;
        if (sectionIntros[sectionKey]) {
          markdownContent += `${sectionIntros[sectionKey]}\n\n`;
        }
        markdownContent += `For the full list with links to each page, see: https://langfuse.com/${config.file}\n\n`;
        markdownContent += `Pages: ${titles}\n\n`;
      }
    }

    fs.writeFileSync(path.join(publicDir, "llms.txt"), markdownContent);

    console.log("Successfully generated llms.txt and sub-files");
  } catch (error) {
    console.error("Error generating llms.txt:", error);
  }
}

generateLLMsList();
