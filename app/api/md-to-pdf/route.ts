import { NextRequest, NextResponse } from "next/server";
import { marked } from "marked";
import { stripMdxForPlainMarkdown } from "@/lib/stripMdxForPlainMarkdown.js";

// Force Node.js runtime (required for Puppeteer/Chromium — not compatible with Edge runtime)
export const runtime = "nodejs";
// Allow up to 60 s for PDF generation (default 10 s is too short for Chromium startup)
export const maxDuration = 60;

const ALLOWED_HOSTNAMES = [
  "langfuse.com",
  "raw.githubusercontent.com",
  "github.com",
];

function removeAnchorTags(content: string): string {
  return content.replace(/\s*\[#[\w-]+\]/g, "");
}

function processCallouts(content: string): string {
  const calloutRegex =
    /<Callout\s+type=["'](\w+)["']\s*>([\s\S]*?)<\/Callout>/g;
  return content.replace(calloutRegex, (match, type, innerContent) => {
    return `<div class="callout callout-${type}">${innerContent}</div>`;
  });
}

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get("url");
    const disposition = request.nextUrl.searchParams.get("disposition");

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'url' query parameter" },
        { status: 400 }
      );
    }

    let markdownUrl: URL;
    try {
      markdownUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    if (
      process.env.NODE_ENV !== "development" &&
      !ALLOWED_HOSTNAMES.includes(markdownUrl.hostname)
    ) {
      return NextResponse.json(
        {
          error: `Fetching from ${markdownUrl.hostname} is not permitted.`,
          allowed: ALLOWED_HOSTNAMES,
        },
        { status: 400 }
      );
    }

    // For langfuse.com page URLs (not already ending in .md/.mdx), rewrite to
    // the raw-markdown endpoint: /path → /path.md (served from public/md-src/).
    const isLangfuseHost =
      markdownUrl.hostname === "langfuse.com" ||
      markdownUrl.hostname === "localhost" ||
      markdownUrl.hostname === "127.0.0.1";
    if (
      isLangfuseHost &&
      !markdownUrl.pathname.endsWith(".md") &&
      !markdownUrl.pathname.endsWith(".mdx")
    ) {
      markdownUrl = new URL(markdownUrl.toString());
      markdownUrl.pathname = markdownUrl.pathname.replace(/\/$/, "") + ".md";
    }

    // In development, rewrite langfuse.com URLs to localhost so we can test
    // against the local md-src files without hitting production.
    if (isLangfuseHost && markdownUrl.hostname === "langfuse.com") {
      const isDev = process.env.NODE_ENV === "development";
      if (isDev) {
        markdownUrl = new URL(markdownUrl.toString());
        markdownUrl.protocol = "http:";
        markdownUrl.hostname = "localhost";
        markdownUrl.port = "3333";
      }
    }

    const response = await fetch(markdownUrl.toString());
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch markdown: ${response.statusText}` },
        { status: response.status }
      );
    }

    let markdownContent = await response.text();
    markdownContent = markdownContent.replace(
      /^---\r?\n[\s\S]*?\r?\n---\r?\n/,
      ""
    );
    markdownContent = stripMdxForPlainMarkdown(markdownContent, {
      unwrapCalloutsForPlainMd: false,
    });
    markdownContent = removeAnchorTags(markdownContent);
    let htmlContent = await marked.parse(markdownContent);
    htmlContent = processCallouts(htmlContent);

    const pathname = markdownUrl.pathname;
    const filename = pathname.split("/").pop() || "document.md";
    const baseFilename = filename.replace(/\.mdx?$/i, "");
    const documentTitle = `Langfuse - ${baseFilename}`;

    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${documentTitle}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1, h2, h3, h4, h5, h6 { margin-top: 24px; margin-bottom: 16px; font-weight: 600; }
            h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
            h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
            code { background-color: rgba(27, 31, 35, 0.05); border-radius: 3px; padding: 0.2em 0.4em; font-size: 85%; }
            pre { background-color: #f6f8fa; border-radius: 3px; padding: 16px; overflow: auto; }
            .callout { padding: 16px; margin: 16px 0; border-radius: 6px; border-left: 4px solid; background-color: #f6f8fa; }
            .callout-info { border-left-color: #0969da; background-color: #ddf4ff; }
            .callout-warn, .callout-warning { border-left-color: #d4a72c; background-color: #fff8dc; }
            .callout-error, .callout-danger { border-left-color: #cf222e; background-color: #ffebe9; }
          </style>
        </head>
        <body>
          <div class="source-url"><strong>Source:</strong> ${markdownUrl.toString()}</div>
          ${htmlContent}
        </body>
      </html>
    `;

    const isDev = process.env.NODE_ENV === "development";
    let browser;

    if (isDev) {
      const puppeteer = await import("puppeteer");
      browser = await puppeteer.default.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    } else {
      const puppeteerCore = await import("puppeteer-core");
      const chromium = await import("@sparticuz/chromium");
      // Optional override: absolute path to the `bin` folder that holds *.br files
      // (same directory Sparticuz expects when packaging omits it from the trace).
      const brotliBinDir = process.env.SPARTICUZ_CHROMIUM_BIN_DIR?.trim();

      let executablePath: string;
      try {
        executablePath = await chromium.default.executablePath(
          brotliBinDir || undefined
        );
      } catch (resolveErr) {
        const err =
          resolveErr instanceof Error
            ? resolveErr
            : new Error(String(resolveErr));
        console.error("[md-to-pdf] chromium.executablePath failed", {
          message: err.message,
          sparticuzBinDirOverride: Boolean(brotliBinDir),
          vercel: Boolean(process.env.VERCEL),
        });
        throw err;
      }

      if (process.env.VERCEL) {
        console.log("[md-to-pdf] chromium binary resolved", {
          basename: executablePath.split(/[/\\]/).pop(),
        });
      }

      browser = await puppeteerCore.default.launch({
        args: chromium.default.args,
        executablePath,
        headless: true,
      });
    }

    try {
      const page = await browser.newPage();
      await page.setContent(fullHtml, { waitUntil: "networkidle0" });
      const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "1cm", right: "1cm", bottom: "1cm", left: "1cm" },
      });

      const pdfFilename = `${documentTitle}.pdf`;
      const contentDisposition =
        disposition === "download" ? "attachment" : "inline";

      return new NextResponse(pdf, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `${contentDisposition}; filename="${pdfFilename}"`,
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=86400",
        },
      });
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      {
        error: "Internal server error while generating PDF",
        message: "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
