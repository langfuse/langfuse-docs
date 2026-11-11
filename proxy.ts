import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import {
  classify,
  loadIpRanges,
  type Classification,
  type IpRanges,
} from "@mintlify/agent-traffic";

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
    "/((?!_next/|api/|md-src/|\\.well-known/|.*\\.(?:png|jpe?g|gif|svg|ico|webp|avif|css|js|mjs|map|woff2?|ttf|otf|eot|mp4|webm|mp3|zip|pdf|xml|txt|json|webmanifest|ipynb)$).*)",
  ],
};

// Agents seen on langfuse.com that the @mintlify/agent-traffic dataset does
// not cover yet. Checked only when the library finds no known agent.
const EXTRA_AGENTS: {
  pattern: RegExp;
  result: Omit<Classification, "verified" | "confidence" | "reasons">;
}[] = [
  {
    pattern: /\bDevin\/[\d.]+/i,
    result: {
      category: "agent",
      kind: "coding",
      id: "devin",
      name: "Devin",
      operator: "Cognition",
    },
  },
  {
    // Bare user agent without the version suffix the dataset expects.
    pattern: /^ChatGPT-User$/i,
    result: {
      category: "agent",
      kind: "assistant",
      id: "chatgpt-user",
      name: "ChatGPT-User",
      operator: "OpenAI",
    },
  },
];

function classifyRequest(
  headers: Headers,
  ip: string | undefined,
  ipRanges?: IpRanges,
): Classification {
  const result = classify({ headers, ip }, { ipRanges });
  if (result.category === "agent" || result.category === "ai-crawler") {
    return result;
  }
  const userAgent = headers.get("user-agent") ?? "";
  const extra = EXTRA_AGENTS.find((a) => a.pattern.test(userAgent));
  return extra
    ? {
        ...extra.result,
        verified: null,
        confidence: "medium",
        reasons: [`user agent matches ${extra.result.name}`],
      }
    : result;
}

// Operator-published IP ranges, used to verify crawlers and flag
// impersonators. Loaded lazily in the background (never on the response
// path), shared across requests, and refreshed daily.
const IP_RANGES_TTL_MS = 24 * 60 * 60 * 1000;
const IP_RANGES_RETRY_MS = 10 * 60 * 1000;
const IP_RANGES_FETCH_TIMEOUT_MS = 3000;
let ipRangesCache: { promise: Promise<IpRanges>; expiresAt: number } | null =
  null;

function getIpRanges(): Promise<IpRanges> {
  const now = Date.now();
  if (!ipRangesCache || ipRangesCache.expiresAt <= now) {
    const promise = loadIpRanges((input, init) =>
      fetch(input, {
        ...init,
        signal: AbortSignal.timeout(IP_RANGES_FETCH_TIMEOUT_MS),
      }),
    ).catch((): IpRanges => ({}));
    const cache = { promise, expiresAt: now + IP_RANGES_TTL_MS };
    ipRangesCache = cache;
    // If no operator file loaded, retry sooner than the normal refresh.
    void promise.then((ranges) => {
      if (Object.keys(ranges).length === 0) {
        cache.expiresAt = Date.now() + IP_RANGES_RETRY_MS;
      }
    });
  }
  return ipRangesCache.promise;
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
      kind !== "page" ||
      ["agent", "ai-crawler"].includes(classifyRequest(headers, ip).category);

    if (shouldTrack) {
      const send = async () => {
        // Re-classify with IP ranges to verify crawlers and catch
        // impersonators (category "bot", kind "impersonator").
        const traffic = classifyRequest(headers, ip, await getIpRanges());
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
