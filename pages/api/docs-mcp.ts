import { NextApiRequest, NextApiResponse } from 'next';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

interface DocsPage {
  path: string;
  title: string;
  description?: string;
  section: string;
}

// Parse frontmatter from markdown content
function parseFrontmatter(content: string): { frontmatter: any; content: string } {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { frontmatter: {}, content };
  }

  const frontmatterText = match[1];
  const bodyContent = match[2];
  
  // Simple YAML parsing (basic key-value pairs)
  const frontmatter: any = {};
  frontmatterText.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
      frontmatter[key] = value;
    }
  });

  return { frontmatter, content: bodyContent };
}

// Get page content from local file system (same logic as MainContentWrapper)
async function getPageContent(pathname: string): Promise<string> {
  let basePath = pathname;
  if (basePath.startsWith("/")) basePath = basePath.substring(1);
  if (basePath.endsWith("/")) basePath = basePath.slice(0, -1);
  if (!basePath) basePath = "index";

  const potentialPaths = [
    `pages/${basePath}.mdx`,
    `pages/${basePath}.md`,
    `pages/${basePath}/index.mdx`,
    `pages/${basePath}/index.md`,
  ];

  for (const filePath of potentialPaths) {
    try {
      const fullPath = path.join(process.cwd(), filePath);
      const content = await fs.readFile(fullPath, 'utf-8');
      return content;
    } catch (error) {
      // Try next path
      continue;
    }
  }
  
  throw new Error(`No markdown file found for path: ${pathname}`);
}

// Recursively find all documentation files
async function findAllDocsFiles(): Promise<DocsPage[]> {
  const pagesDir = path.join(process.cwd(), 'pages');
  const pages: DocsPage[] = [];

  async function scanDirectory(dir: string, relativePath: string = ''): Promise<void> {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const entryRelativePath = path.join(relativePath, entry.name);
        
        if (entry.isDirectory()) {
          // Skip certain directories
          if (!['api', 'node_modules', '.next'].includes(entry.name)) {
            await scanDirectory(fullPath, entryRelativePath);
          }
        } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
          try {
            const content = await fs.readFile(fullPath, 'utf-8');
            const { frontmatter } = parseFrontmatter(content);
            
            // Convert file path to URL path
            let urlPath = entryRelativePath
              .replace(/\.(md|mdx)$/, '')
              .replace(/\/index$/, '')
              .replace(/\\/g, '/'); // normalize Windows paths
            
            if (urlPath === 'index') urlPath = '';
            
            const section = entryRelativePath.split(path.sep)[0] || 'root';
            
            pages.push({
              path: urlPath || '/',
              title: frontmatter.title || path.basename(entry.name, path.extname(entry.name)),
              description: frontmatter.description,
              section: section
            });
          } catch (error) {
            console.warn(`Failed to process ${fullPath}:`, error);
          }
        }
      }
    } catch (error) {
      console.warn(`Failed to scan directory ${dir}:`, error);
    }
  }

  await scanDirectory(pagesDir);
  return pages;
}

// Search pages by query
async function searchPages(query: string, section?: string): Promise<DocsPage[]> {
  const allPages = await findAllDocsFiles();
  const lowerQuery = query.toLowerCase();
  
  const results: Array<DocsPage & { score: number }> = [];
  
  for (const page of allPages) {
    const matchesSection = !section || page.section === section;
    if (!matchesSection) continue;
    
    let score = 0;
    
    // Title match (highest weight)
    if (page.title.toLowerCase().includes(lowerQuery)) {
      score += 10;
    }
    
    // Description match (medium weight)
    if (page.description?.toLowerCase().includes(lowerQuery)) {
      score += 5;
    }
    
    // Try to read content for full-text search (lower weight)
    try {
      const content = await getPageContent(page.path);
      if (content.toLowerCase().includes(lowerQuery)) {
        score += 1;
      }
    } catch (error) {
      // Skip content search if file can't be read
    }
    
    if (score > 0) {
      results.push({ ...page, score });
    }
  }
  
  // Sort by score (descending)
  return results
    .sort((a, b) => b.score - a.score)
    .map(({ score, ...page }) => page);
}

// Create the MCP server instance
function createDocsServer(): McpServer {
  const server = new McpServer({
    name: "langfuse-docs-server",
    version: "1.0.0"
  });

  // Tool to get any docs page
  server.registerTool(
    "get-docs-page",
    {
      title: "Get Documentation Page",
      description: "Retrieve any documentation page by path",
      inputSchema: {
        path: z.string().describe("Page path like 'docs/get-started' or 'blog/announcing-our-seed-round'")
      }
    },
    async ({ path }) => {
      try {
        const content = await getPageContent(path);
        const { frontmatter, content: bodyContent } = parseFrontmatter(content);
        
        return {
          content: [{
            type: "text",
            text: `# ${frontmatter.title || 'Documentation Page'}\n\n${bodyContent}`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error fetching page: ${error instanceof Error ? error.message : String(error)}`
          }],
          isError: true
        };
      }
    }
  );

  // Tool for searching documentation
  server.registerTool(
    "search-docs",
    {
      title: "Search Documentation",
      description: "Search through Langfuse documentation pages",
      inputSchema: {
        query: z.string().describe("Search query to find relevant documentation"),
        section: z.string().optional().describe("Optional: Limit search to specific section (e.g., 'docs', 'blog', 'changelog')")
      }
    },
    async ({ query, section }) => {
      try {
        const results = await searchPages(query, section);
        
        if (results.length === 0) {
          return {
            content: [{
              type: "text",
              text: `No documentation found for query: "${query}"${section ? ` in section: ${section}` : ''}`
            }]
          };
        }
        
        const formattedResults = results.slice(0, 10).map(page => 
          `**${page.title}** (${page.path})\n${page.description || 'No description available'}\n`
        ).join('\n');
        
        return {
          content: [{
            type: "text",
            text: `Found ${results.length} results for "${query}":\n\n${formattedResults}`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error searching documentation: ${error instanceof Error ? error.message : String(error)}`
          }],
          isError: true
        };
      }
    }
  );

  // Tool for getting integration docs table of contents
  server.registerTool(
    "get-integration-docs-toc",
    {
      title: "Get Integration Documentation Table of Contents",
      description: "Get a complete table of contents for all integration documentation. This tool does not accept any parameters.",
      inputSchema: {}
    },
    async () => {
      try {
        const allPages = await findAllDocsFiles();
        const pages = allPages.filter(p => p.path.startsWith("docs/integrations"));
        
        // Group by section
        const tocBySection = pages.reduce((acc, page) => {
          const pathParts = page.path.split('/');
          const section = pathParts.length > 2 ? pathParts[2] : 'overview';

          if (!acc[section]) {
            acc[section] = [];
          }
          acc[section].push({
            title: page.title,
            path: page.path,
            description: page.description
          });
          return acc;
        }, {} as Record<string, any[]>);
        
        // Format as markdown
        let toc = "# Langfuse Integration Documentation Table of Contents\n\n";
        
        Object.keys(tocBySection).sort().forEach(section => {
          toc += `## ${section.charAt(0).toUpperCase() + section.slice(1)}\n\n`;
          tocBySection[section].forEach(page => {
            toc += `- [${page.title}](${page.path})\n`;
          });
          toc += '\n';
        });
        
        return {
          content: [{
            type: "text",
            text: toc
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error generating table of contents: ${error instanceof Error ? error.message : String(error)}`
          }],
          isError: true
        };
      }
    }
  );

  return server;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const server = createDocsServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // Stateless mode
    });
    
    // Clean up transport when response ends
    res.on('close', () => {
      transport.close();
      server.close();
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error('MCP Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }
} 