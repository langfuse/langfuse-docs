import { NextApiRequest, NextApiResponse } from 'next';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import xml2js from 'xml2js';
import { createClient } from '@supabase/supabase-js';
import { Configuration, OpenAIApi } from 'openai-edge';

// OpenAI client
const openAIconfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(openAIconfig);

// Supabase client
const supabaseClient = createClient(
  process.env.SUPABASE_URL ?? '',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  {
    db: { schema: "docs" },
    auth: {
      persistSession: false,
    },
  }
);

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

// Get page content from local file system
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

// Get sitemap URLs
async function getSitemapUrls(): Promise<string[]> {
  const baseUrl = process.env.NEXT_PUBLIC_LANGFUSE_BASE_URL;
  const sitemapUrl = new URL('/sitemap-0.xml', baseUrl).href;
  const response = await fetch(sitemapUrl);
  if (!response.ok) {
      throw new Error(`Failed to fetch sitemap.xml: ${response.statusText}`);
  }
  const sitemapContent = await response.text();

  const parser = new xml2js.Parser();
  const result = await parser.parseStringPromise(sitemapContent);

  const urls: string[] = [];
  if (result.urlset && result.urlset.url) {
      result.urlset.url.forEach((urlEntry: any) => {
          const url = urlEntry.loc[0];
          const urlPath = new URL(url).pathname;
          urls.push(urlPath);
      });
  }

  return urls;
}

// Find all documentation files by parsing llms.txt
async function findAllDocsFiles(): Promise<DocsPage[]> {
  const baseUrl = process.env.NEXT_PUBLIC_LANGFUSE_BASE_URL;

  if (!baseUrl) {
    throw new Error(
      "Cannot determine the application's base URL. " +
        "Please set the NEXT_PUBLIC_LANGFUSE_BASE_URL environment variable."
    );
  }

  const llmsTxtUrl = new URL('/llms.txt', baseUrl).href;
  const response = await fetch(llmsTxtUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch llms.txt: ${response.statusText}`);
  }
  const llmsTxtContent = await response.text();

  const pages: DocsPage[] = [];
  const linkRegex = /- \[(.*?)\]\((.*?)\)/g;
  let match;
  while ((match = linkRegex.exec(llmsTxtContent)) !== null) {
    const title = match[1];
    const url = match[2];
    const urlPath = new URL(url).pathname;
    const section = urlPath.split('/')[1] || 'root';

    pages.push({
      path: urlPath,
      title: title,
      description: '', // Description is not available in llms.txt
      section: section,
    });
  }

  return pages;
}

// Search pages by query
async function searchPages(query: string, section?: string): Promise<DocsPage[]> {
  const allPages = await findAllDocsFiles();
  const lowerQuery = query.toLowerCase();

  const results = allPages
    .filter(page => {
      const matchesSection = !section || page.section === section;
      if (!matchesSection) return false;

      // Only search by title, as it's the only reliable data from llms.txt
      return page.title.toLowerCase().includes(lowerQuery);
    });

  // The search logic is now simpler, no need for complex scoring.
  // The results are implicitly sorted by their order in llms.txt.
  return results;
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
      title: "Search Documentation (Vector Search)",
      description: "Performs semantic search over the full content of Langfuse documentation to find the most relevant pages.",
      inputSchema: {
        query: z.string().describe("Search query to find relevant documentation."),
      }
    },
    async ({ query }) => {
      try {
        // 1. Create embedding for the query
        const embeddingResponse = await openai.createEmbedding({
          model: "text-embedding-ada-002",
          input: query.replaceAll("\n", " "),
        });

        if (embeddingResponse.status !== 200) {
          const errorText = await embeddingResponse.text();
          throw new Error(`Failed to create embedding: ${errorText}`);
        }
        const [{ embedding }] = (await embeddingResponse.json()).data;

        // 2. Query Supabase for matching page sections
        const { error: matchError, data: pageSections } = await supabaseClient.rpc(
          "match_page_sections",
          {
            embedding,
            match_threshold: 0.78,
            match_count: 10,
            min_content_length: 50,
          }
        );

        if (matchError) {
          throw new Error(`Failed to match page sections: ${matchError.message}`);
        }
        
        if (!pageSections || pageSections.length === 0) {
          return {
            content: [{
              type: "text",
              text: `No documentation found for query: "${query}"`
            }]
          };
        }

        // 3. Format and return the results
        const formattedResults = pageSections.map(chunk => 
          `### [${chunk.heading}](${chunk.path})\n\n${chunk.content}\n\n---`
        ).join('\n\n');
        
        return {
          content: [{
            type: "text",
            text: `Found ${pageSections.length} relevant section(s) for "${query}":\n\n${formattedResults}`
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

  // Tool for getting integration sitemap
  server.registerTool(
    "get-integration-sitemap",
    {
      title: "Get Integration Documentation Sitemap",
      description: "Get all integration documentation URLs from the sitemap. Fast and simple - just returns the paths.",
      inputSchema: {}
    },
    async () => {
      try {
        const allUrls = await getSitemapUrls();
        const integrationUrls = allUrls.filter(url => url.startsWith("/docs/integrations"));
        
        return {
          content: [{
            type: "text",
            text: integrationUrls.join('\n')
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error fetching integration sitemap: ${error instanceof Error ? error.message : String(error)}`
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