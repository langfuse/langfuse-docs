import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import {
  classifyAgentTraffic,
  createIpRangesCache,
  isAgentOrAiCrawler,
} from "./lib/agent-traffic";

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();
const posthogHost =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.posthog.com";

// Matched routes: the generated llms*.txt indexes plus all page routes
// (static assets and API routes excluded to limit middleware invocations).
// `.md` markdown mirrors are page-route lookalikes and covered by the broad
// pattern since `md` is not in the excluded-extension list.
// The `md-src/`, `.well-known/`, `api/`, and extension exclusions mirror the
// markdown content-negotiation rewrite in next.config.mjs so a request is
// only ever labeled `markdown_negotiation` when that rewrite actually serves
// markdown — keep the two patterns in sync.
export const config = {
  matcher: [
    "/llms.txt",
    "/llms-docs.txt",
    "/llms-integrations.txt",
    "/llms-self-hosting.txt",
    "/((?!_next/|api/|md-src/|\\.well-known/|.*\\.(?:png|jpe?g|gif|svg|ico|webp|avif|css|js|mjs|map|woff2?|ttf|otf|eot|mp4|webm|mp3|zip|pdf|xml|txt|json|ya?ml|webmanifest|ipynb)$).*)",
  ],
};

// Crawler IP ranges, loaded in the background (never on the response path).
const getIpRanges = createIpRangesCache();

// Links copied from prose, chat answers, or broken Markdown often drag the
// next characters into the URL: `/pricing,`, `/docs/v4.`, `/docs)`,
// `/docs/halo](https:/langfuse.com/docs/halo`, `.../annotation%3E(1)`. No page
// path contains these characters, so cut the path at the first one (and drop
// trailing dots and colons) and redirect to what is left. Redirects in
// next.config.mjs then apply to the cleaned path as usual.
//
// /cloud is skipped: app/cloud/[[...path]] forwards any subpath to the
// Langfuse app, where resource names (prompts, datasets) may contain these
// characters.
const STRAY_PATH_SUFFIX =
  /(?:https?:\/|[)\]>"'`*,;!]|%21|%22|%27|%29|%2C|%3B|%3E|%5B|%5D|%60|%E2%80%8B|%EF%BC%89).*$/i;
const TRAILING_PUNCTUATION = /[.:]+$/;
const UNCLEANED_PATH = /^\/cloud(?:\/|$)/;

function strippedPathname(pathname: string): string | null {
  if (UNCLEANED_PATH.test(pathname)) return null;
  const cleaned =
    pathname.replace(STRAY_PATH_SUFFIX, "").replace(TRAILING_PUNCTUATION, "") ||
    "/";
  return cleaned === pathname ? null : cleaned;
}

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
  const stripped = strippedPathname(request.nextUrl.pathname);
  if (stripped) {
    const url = request.nextUrl.clone();
    url.pathname = stripped;
    return NextResponse.redirect(url, 307);
  }

  if (posthogKey && process.env.DISABLE_AGENT_FETCH_TRACKING !== "true") {
    const headers = request.headers;
    const userAgent = headers.get("user-agent") ?? "";
    const pathname = request.nextUrl.pathname;
    const accept = headers.get("accept");
    const ip = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const kind = contentKind(pathname, accept);

    // Agent-facing content endpoints (markdown mirrors, llms*.txt) are
    // tracked for every caller; regular page routes only when the request
    // comes from an AI agent or AI crawler — never for human traffic
    // (posthog-js covers that). This first pass is user-agent and header
    // based only, so it adds no latency.
    const shouldTrack =
      kind !== "page" || isAgentOrAiCrawler(classifyAgentTraffic(headers, ip));

    if (shouldTrack) {
      const send = async () => {
        // Re-classify with IP ranges to verify crawlers and catch
        // impersonators (category "bot", kind "impersonator").
        const traffic = classifyAgentTraffic(headers, ip, await getIpRanges());
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
            $ip: ip,
            $current_url: request.nextUrl.href,
            $host: request.nextUrl.host,
            $pathname: pathname,
            $referrer: headers.get("referer") ?? undefined,
            content_kind: kind,
            method: request.method,
            accept: accept ?? undefined,
            // @mintlify/agent-traffic classification.
            agent_category: traffic.category,
            agent_kind: traffic.kind,
            agent_name: traffic.name,
            agent_operator: traffic.operator,
            agent_version: traffic.version,
            agent_verified: traffic.verified,
            agent_confidence: traffic.confidence,
          },
        };

        await fetch(`${posthogHost}/i/v0/e/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      };

      event.waitUntil(
        send().catch(() => {
          // Analytics must never affect content delivery.
        }),
      );
    }
  }

  return NextResponse.next();
}
