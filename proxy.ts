import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();
const posthogHost =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.posthog.com";

// Only agent-facing content endpoints are matched: markdown mirrors of all
// pages (via `.md` suffix or `Accept: text/markdown` content negotiation, see
// rewrites in next.config.mjs) and the generated llms*.txt indexes. These are
// fetched by AI crawlers/assistants that never execute client-side analytics.
export const config = {
  matcher: [
    "/llms.txt",
    "/llms-docs.txt",
    "/llms-integrations.txt",
    "/llms-self-hosting.txt",
    "/:path(.*\\.md)",
    {
      source: "/:path*",
      has: [{ type: "header", key: "accept", value: "(.*text/markdown.*)" }],
    },
  ],
};

function contentKind(pathname: string): string {
  if (pathname.startsWith("/llms") && pathname.endsWith(".txt")) {
    return "llms_txt";
  }
  if (pathname.endsWith(".md")) {
    return "markdown_file";
  }
  return "markdown_negotiation";
}

export function proxy(
  request: NextRequest,
  event: NextFetchEvent,
): NextResponse {
  if (posthogKey && process.env.DISABLE_AGENT_FETCH_TRACKING !== "true") {
    const userAgent = request.headers.get("user-agent") ?? "";
    const pathname = request.nextUrl.pathname;
    const payload = {
      api_key: posthogKey,
      event: "agent_content_fetch",
      distinct_id: userAgent || "unknown-agent",
      timestamp: new Date().toISOString(),
      properties: {
        $process_person_profile: false,
        $lib: "docs-proxy",
        // PostHog computes its $virt_* traffic classification (traffic type,
        // bot name, bot operator) from $raw_user_agent and $ip at query time.
        $raw_user_agent: userAgent,
        $ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
        $current_url: request.nextUrl.href,
        $host: request.nextUrl.host,
        $pathname: pathname,
        $referrer: request.headers.get("referer") ?? undefined,
        content_kind: contentKind(pathname),
        method: request.method,
        accept: request.headers.get("accept") ?? undefined,
      },
    };

    event.waitUntil(
      fetch(`${posthogHost}/i/v0/e/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {
        // Analytics must never affect content delivery.
      }),
    );
  }

  return NextResponse.next();
}
