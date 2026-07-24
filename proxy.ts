import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();
const posthogHost =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.posthog.com";

// Verified AI crawlers, search-index bots, and user-triggered fetchers. These
// fetch regular HTML pages without executing JavaScript, so client-side
// analytics never see them. Deliberately conservative: documented AI agents
// only — classic search/SEO crawlers (Googlebot, Bingbot, Ahrefs) are
// excluded. Sources: openai.com/gptbot, docs.perplexity.ai/guides/bots,
// support.claude.com, developers.google.com/crawling, github.com/ai-robots-txt.
const AI_AGENT_UA =
  /GPTBot|OAI-SearchBot|ChatGPT-User|OAI-AdsBot|ClaudeBot|Claude-User|Claude-SearchBot|claude-code|PerplexityBot|Perplexity-User|Google-Extended|Google-CloudVertexBot|GoogleAgent|DuckAssistBot|Amazonbot|Applebot-Extended|Bytespider|CCBot|meta-externalagent|meta-externalfetcher|cohere-training-data-crawler|MistralAI-User|Kagibot|YouBot|AI2Bot|Diffbot|NotebookLM|Devin/i;

// Matched routes: the generated llms*.txt indexes plus all page routes
// (static assets and API routes excluded to limit middleware invocations).
// `.md` markdown mirrors are page-route lookalikes and covered by the broad
// pattern since `md` is not in the excluded-extension list.
export const config = {
  matcher: [
    "/llms.txt",
    "/llms-docs.txt",
    "/llms-integrations.txt",
    "/llms-self-hosting.txt",
    "/((?!_next/|api/|.*\\.(?:png|jpe?g|gif|svg|ico|webp|avif|css|js|mjs|map|woff2?|ttf|otf|eot|mp4|webm|mp3|zip|pdf|xml|txt|json|webmanifest|ipynb)$).*)",
  ],
};

function contentKind(pathname: string, accept: string | null): string {
  if (pathname.startsWith("/llms") && pathname.endsWith(".txt")) {
    return "llms_txt";
  }
  if (pathname.endsWith(".md")) {
    return "markdown_file";
  }
  if (accept?.includes("text/markdown")) {
    return "markdown_negotiation";
  }
  return "page";
}

export function proxy(
  request: NextRequest,
  event: NextFetchEvent,
): NextResponse {
  if (posthogKey && process.env.DISABLE_AGENT_FETCH_TRACKING !== "true") {
    const userAgent = request.headers.get("user-agent") ?? "";
    const pathname = request.nextUrl.pathname;
    const accept = request.headers.get("accept");
    const kind = contentKind(pathname, accept);

    // Agent-facing content endpoints (markdown mirrors, llms*.txt) are
    // tracked for every caller; regular page routes only when the user agent
    // is a known AI agent — never for human traffic (posthog-js covers that).
    const shouldTrack = kind !== "page" || AI_AGENT_UA.test(userAgent);

    if (shouldTrack) {
      const payload = {
        api_key: posthogKey,
        event: "agent_content_fetch",
        distinct_id: userAgent || "unknown-agent",
        timestamp: new Date().toISOString(),
        properties: {
          $process_person_profile: false,
          $lib: "docs-proxy",
          // PostHog computes its $virt_* traffic classification (traffic
          // type, bot name, bot operator) from $raw_user_agent and $ip at
          // query time.
          $raw_user_agent: userAgent,
          $ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
          $current_url: request.nextUrl.href,
          $host: request.nextUrl.host,
          $pathname: pathname,
          $referrer: request.headers.get("referer") ?? undefined,
          content_kind: kind,
          method: request.method,
          accept: accept ?? undefined,
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
  }

  return NextResponse.next();
}
