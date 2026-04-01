import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { marked } from "marked";

// Force Node.js runtime (required for Puppeteer/Chromium — not compatible with Edge runtime)
export const runtime = "nodejs";
// Allow up to 60 s for PDF generation (default 10 s is too short for Chromium startup)
export const maxDuration = 60;

const LEGACY_ALLOWED_URL_HOSTNAMES = new Set([
  "langfuse.com",
  "www.langfuse.com",
  "localhost",
  "127.0.0.1",
]);
const LOCAL_MARKDOWN_ROOT = path.resolve(process.cwd(), "public", "md-src");
const PDF_VIEWPORT = {
  width: 1280,
  height: 800,
  deviceScaleFactor: 1,
  isMobile: false,
  hasTouch: false,
  isLandscape: false,
} as const;

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

function normalizeMarkdownPath(requestedPath: string): string | null {
  const normalizedPath = decodeURIComponent(requestedPath)
    .replace(/\/+/g, "/")
    .replace(/^\/+|\/+$/g, "");
  const withoutExtension = normalizedPath.replace(/\.mdx?$/i, "");

  if (!withoutExtension) {
    return "index.md";
  }

  const segments = withoutExtension.split("/").filter(Boolean);
  if (segments.some((segment) => segment === "." || segment === "..")) {
    return null;
  }

  return `${segments.join("/")}.md`;
}

function getLocalMarkdownCandidates(normalizedMarkdownPath: string): string[] {
  const withoutExtension = normalizedMarkdownPath.replace(/\.mdx?$/i, "");
  const segments = withoutExtension.split("/").filter(Boolean);
  const candidates = [normalizedMarkdownPath];

  // Single-segment routes like /terms are exported under public/md-src/marketing.
  if (segments.length === 1) {
    candidates.push(`marketing/${segments[0]}.md`);
  }

  return candidates;
}

async function readLocalMarkdown(
  normalizedMarkdownPath: string
): Promise<string | null> {
  for (const relativeCandidate of getLocalMarkdownCandidates(
    normalizedMarkdownPath
  )) {
    const absoluteCandidate = path.resolve(
      LOCAL_MARKDOWN_ROOT,
      relativeCandidate
    );
    const isWithinMarkdownRoot =
      absoluteCandidate === LOCAL_MARKDOWN_ROOT ||
      absoluteCandidate.startsWith(`${LOCAL_MARKDOWN_ROOT}${path.sep}`);

    if (!isWithinMarkdownRoot) {
      continue;
    }

    try {
      return await fs.readFile(absoluteCandidate, "utf8");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
    }
  }

  return null;
}

async function launchBrowser() {
  if (process.env.NODE_ENV === "development") {
    const puppeteerModule = await import("puppeteer");
    const puppeteer =
      "default" in puppeteerModule ? puppeteerModule.default : puppeteerModule;

    return puppeteer.launch({
      headless: true,
      defaultViewport: PDF_VIEWPORT,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }

  const puppeteerCoreModule = await import("puppeteer-core");
  const chromiumModule = await import("@sparticuz/chromium");
  const puppeteer =
    "default" in puppeteerCoreModule
      ? puppeteerCoreModule.default
      : puppeteerCoreModule;
  const chromium =
    "default" in chromiumModule ? chromiumModule.default : chromiumModule;
  const headlessMode = "shell";

  return puppeteer.launch({
    args: puppeteer.defaultArgs({
      args: chromium.args,
      headless: headlessMode,
    }),
    defaultViewport: PDF_VIEWPORT,
    executablePath: await chromium.executablePath(),
    headless: headlessMode,
  });
}

function getRequestedMarkdownSource(request: NextRequest):
  | { normalizedPath: string; sourceLabel: string }
  | { errorResponse: NextResponse } {
  const pathParam = request.nextUrl.searchParams.get("path");
  if (pathParam && typeof pathParam === "string") {
    const normalizedPath = normalizeMarkdownPath(pathParam);
    if (!normalizedPath) {
      return {
        errorResponse: NextResponse.json(
          { error: "Invalid 'path' query parameter" },
          { status: 400 }
        ),
      };
    }

    return {
      normalizedPath,
      sourceLabel: `/${normalizedPath}`,
    };
  }

  const urlParam = request.nextUrl.searchParams.get("url");
  if (!urlParam || typeof urlParam !== "string") {
    return {
      errorResponse: NextResponse.json(
        { error: "Missing 'path' or legacy 'url' query parameter" },
        { status: 400 }
      ),
    };
  }

  let markdownUrl: URL;
  try {
    markdownUrl = new URL(urlParam);
  } catch {
    return {
      errorResponse: NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      ),
    };
  }

  const allowedLegacyHostnames = new Set(LEGACY_ALLOWED_URL_HOSTNAMES);
  allowedLegacyHostnames.add(request.nextUrl.hostname);

  if (!allowedLegacyHostnames.has(markdownUrl.hostname)) {
    return {
      errorResponse: NextResponse.json(
        {
          error: `Reading markdown from ${markdownUrl.hostname} is not permitted.`,
          allowed: Array.from(allowedLegacyHostnames),
        },
        { status: 400 }
      ),
    };
  }

  const normalizedPath = normalizeMarkdownPath(markdownUrl.pathname);
  if (!normalizedPath) {
    return {
      errorResponse: NextResponse.json(
        { error: "Invalid URL path" },
        { status: 400 }
      ),
    };
  }

  return {
    normalizedPath,
    sourceLabel: markdownUrl.toString(),
  };
}

export async function GET(request: NextRequest) {
  try {
    const disposition = request.nextUrl.searchParams.get("disposition");

    const requestedSource = getRequestedMarkdownSource(request);
    if ("errorResponse" in requestedSource) {
      return requestedSource.errorResponse;
    }

    let markdownContent = await readLocalMarkdown(requestedSource.normalizedPath);
    if (markdownContent === null) {
      return NextResponse.json(
        {
          error: `Markdown source not found for ${requestedSource.sourceLabel}`,
        },
        { status: 404 }
      );
    }

    markdownContent = markdownContent.replace(
      /^---\r?\n[\s\S]*?\r?\n---\r?\n/,
      ""
    );
    markdownContent = removeAnchorTags(markdownContent);
    let htmlContent = await marked.parse(markdownContent);
    htmlContent = processCallouts(htmlContent);

    const filename =
      requestedSource.normalizedPath.split("/").pop() || "document.md";
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
          <div class="source-url"><strong>Source:</strong> ${requestedSource.sourceLabel}</div>
          ${htmlContent}
        </body>
      </html>
    `;

    const browser = await launchBrowser();

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
