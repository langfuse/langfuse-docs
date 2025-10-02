import type { NextApiRequest, NextApiResponse } from "next";
import { marked } from "marked";

// Allowed hostnames for markdown sourcing. Only fetch markdown from trusted hosts.
const ALLOWED_HOSTNAMES = [
  "langfuse.com",
  "raw.githubusercontent.com",
  "github.com",
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Get the markdown URL from query parameters
    const { url, disposition } = req.query;

    if (!url || typeof url !== "string") {
      return res.status(400).json({
        error: "Missing or invalid 'url' query parameter",
      });
    }

    // Validate URL
    let markdownUrl: URL;
    try {
      markdownUrl = new URL(url);
    } catch (error) {
      return res.status(400).json({
        error: "Invalid URL format",
      });
    }

    // Check hostname against allow-list to prevent SSRF in production
    // Skip in dev to allow for tests against devserver
    if (
      process.env.NODE_ENV !== "development" &&
      !ALLOWED_HOSTNAMES.includes(markdownUrl.hostname)
    ) {
      return res.status(400).json({
        error: `Fetching from ${markdownUrl.hostname} is not permitted.`,
        allowed: ALLOWED_HOSTNAMES,
      });
    }

    // Fetch the markdown content
    const response = await fetch(markdownUrl.toString());

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Failed to fetch markdown: ${response.statusText}`,
      });
    }

    let markdownContent = await response.text();

    // Strip frontmatter (YAML between --- delimiters)
    markdownContent = markdownContent.replace(
      /^---\r?\n[\s\S]*?\r?\n---\r?\n/,
      ""
    );

    // Convert markdown to HTML
    const htmlContent = await marked.parse(markdownContent);

    // Create a complete HTML document with styling
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1, h2, h3, h4, h5, h6 {
              margin-top: 24px;
              margin-bottom: 16px;
              font-weight: 600;
              line-height: 1.25;
            }
            h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
            h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
            h3 { font-size: 1.25em; }
            h4 { font-size: 1em; }
            h5 { font-size: 0.875em; }
            h6 { font-size: 0.85em; color: #6a737d; }
            p { margin-bottom: 16px; }
            a { color: #0366d6; text-decoration: none; }
            a:hover { text-decoration: underline; }
            code {
              background-color: rgba(27, 31, 35, 0.05);
              border-radius: 3px;
              padding: 0.2em 0.4em;
              font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
              font-size: 85%;
            }
            pre {
              background-color: #f6f8fa;
              border-radius: 3px;
              padding: 16px;
              overflow: auto;
              line-height: 1.45;
            }
            pre code {
              background-color: transparent;
              padding: 0;
            }
            blockquote {
              border-left: 4px solid #dfe2e5;
              padding-left: 16px;
              color: #6a737d;
              margin-left: 0;
            }
            ul, ol {
              margin-bottom: 16px;
              padding-left: 2em;
            }
            li {
              margin-bottom: 4px;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              margin-bottom: 16px;
            }
            table th, table td {
              border: 1px solid #dfe2e5;
              padding: 6px 13px;
            }
            table th {
              background-color: #f6f8fa;
              font-weight: 600;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            hr {
              border: 0;
              border-top: 1px solid #eaecef;
              margin: 24px 0;
            }
            .source-url {
              color: #6a737d;
              font-size: 0.875em;
              padding: 12px 0;
              margin-bottom: 24px;
              border-bottom: 2px solid #eaecef;
              word-break: break-all;
            }
            .source-url strong {
              color: #24292e;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="source-url">
            <strong>Source:</strong> ${markdownUrl.toString()}<br/>
            <strong>PDF created at:</strong> ${new Date().toISOString()}
          </div>
          ${htmlContent}
        </body>
      </html>
    `;

    // Launch Puppeteer and generate PDF
    // Use local Chrome for development, serverless Chromium for production
    const isDev = process.env.NODE_ENV === "development";

    let browser;
    if (isDev) {
      // Use puppeteer with bundled Chromium for local development
      const puppeteer = await import("puppeteer");
      browser = await puppeteer.default.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    } else {
      // Use puppeteer-core with serverless Chromium for production
      const puppeteerCore = await import("puppeteer-core");
      const chromium = await import("@sparticuz/chromium");
      browser = await puppeteerCore.default.launch({
        args: chromium.default.args,
        executablePath: await chromium.default.executablePath(),
        headless: true,
      });
    }

    const page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "1cm",
        right: "1cm",
        bottom: "1cm",
        left: "1cm",
      },
    });

    await browser.close();

    // Extract filename from URL
    const pathname = markdownUrl.pathname;
    const filename = pathname.split("/").pop() || "document.md";
    const pdfFilename = filename.replace(/\.mdx?$/i, ".pdf");

    // Determine content disposition (default to inline)
    const contentDisposition =
      disposition === "download" ? "attachment" : "inline";

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `${contentDisposition}; filename="${pdfFilename}"`
    );
    res.setHeader("Content-Length", pdf.length);
    // Cache for 60 seconds on CDN, serve stale while revalidating for 24 hours
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=86400"
    );

    // Send the PDF as a buffer
    res.status(200).end(pdf);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({
      error: "Internal server error while generating PDF",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
