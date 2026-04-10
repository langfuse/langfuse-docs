const fs = require('fs');
const xml2js = require('xml2js');
const path = require('path');

const SITEMAP_PATH = 'public/sitemap-0.xml';
const TITLE = 'Langfuse';
const INTRO_DESCRIPTION = 'Langfuse is an **open-source LLM engineering platform** ([GitHub](https://github.com/langfuse/langfuse)) that helps teams collaboratively debug, analyze, and iterate on their LLM applications. All platform features are natively integrated to accelerate the development workflow.';
const MAIN_SECTIONS = [
    'docs',
    'integrations',
];
const OPTIONAL_SECTIONS = [
    'self-hosting'
];

// Map section keys to sub-file names and display names
const SECTION_CONFIG = {
    docs: { file: 'llms-docs.txt', heading: 'Docs', subFileHeading: 'Langfuse Docs' },
    integrations: { file: 'llms-integrations.txt', heading: 'Integrations', subFileHeading: 'Langfuse Integrations' },
    'self-hosting': { file: 'llms-self-hosting.txt', heading: 'Optional: Self-Hosting', subFileHeading: 'Langfuse Self-Hosting' },
};

function generateTitle(url) {
    return url.split('/').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function generateSubFile(entries, config) {
    let content = `# ${config.subFileHeading}\n\n`;
    entries.forEach(({ title, url }) => {
        const mdUrl = url.endsWith('.md') ? url : `${url}.md`;
        content += `- [${title}](${mdUrl})\n`;
    });
    return content;
}

async function generateLLMsList() {
    try {
        const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf-8');

        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(sitemapContent);

        // Create a map to store URLs by section
        const urlsBySection = {
            other: [],
            optional: []
        };
        MAIN_SECTIONS.forEach(section => {
            urlsBySection[section] = [];
        });

        // Sort URLs into sections
        const urls = result.urlset.url.map(url => url.loc[0]);
        urls.forEach(url => {
            const urlPath = new URL(url).pathname.split('/')[1]; // Get first part of path
            const entry = { title: generateTitle(url), url };

            if (MAIN_SECTIONS.includes(urlPath)) {
                urlsBySection[urlPath].push(entry);
            } else if (OPTIONAL_SECTIONS.includes(urlPath)) {
                urlsBySection.optional.push(entry);
            } else {
                urlsBySection.other.push(entry);
            }
        });

        const publicDir = path.join(process.cwd(), 'public');

        // Write sub-files for each section
        const sectionEntries = {
            docs: urlsBySection.docs || [],
            integrations: urlsBySection.integrations || [],
            'self-hosting': urlsBySection.optional || [],
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

        // Add each section with sub-file link and comma-separated titles
        for (const [sectionKey, entries] of Object.entries(sectionEntries)) {
            if (entries.length > 0) {
                const config = SECTION_CONFIG[sectionKey];
                const titles = entries.map(e => e.title).join(', ');

                markdownContent += `## ${config.heading}\n\n`;
                markdownContent += `For the full list with links to each page, see: https://langfuse.com/${config.file}\n\n`;
                markdownContent += `Pages: ${titles}\n\n`;
            }
        }

        fs.writeFileSync(path.join(publicDir, 'llms.txt'), markdownContent);

        console.log('Successfully generated llms.txt and sub-files');
    } catch (error) {
        console.error('Error generating llms.txt:', error);
    }
}

generateLLMsList();
