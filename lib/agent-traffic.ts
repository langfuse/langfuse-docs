// Agent traffic classification for proxy.ts, built on @mintlify/agent-traffic.
// Kept free of Next.js imports so it can be unit tested with `node --test`.
import {
  classify,
  loadIpRanges,
  type Classification,
  type IpRanges,
} from "@mintlify/agent-traffic";

// Agents seen on langfuse.com that the @mintlify/agent-traffic dataset does
// not cover yet. Checked whenever the library finds no known agent, including
// when it only infers an unidentified agent from the Accept header.
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

export function classifyAgentTraffic(
  headers: Headers,
  ip: string | undefined,
  ipRanges?: IpRanges,
): Classification {
  const result = classify({ headers, ip }, { ipRanges });
  // `id` is only set when the dataset matched a known agent or crawler.
  if (result.id) {
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

export function isAgentOrAiCrawler(traffic: Classification): boolean {
  return traffic.category === "agent" || traffic.category === "ai-crawler";
}

const IP_RANGES_TTL_MS = 24 * 60 * 60 * 1000;
const IP_RANGES_RETRY_MS = 10 * 60 * 1000;
const IP_RANGES_FETCH_TIMEOUT_MS = 3000;

function loadIpRangesWithTimeout(): Promise<IpRanges> {
  return loadIpRanges((input, init) =>
    fetch(input, {
      ...init,
      signal: AbortSignal.timeout(IP_RANGES_FETCH_TIMEOUT_MS),
    }),
  );
}

// Operator-published IP ranges, used to verify crawlers and flag
// impersonators. Loaded lazily, shared across requests and refreshed daily.
// A refresh keeps the last good copy of any operator file that fails to
// load, and is retried sooner when such a file is missing.
export function createIpRangesCache({
  load = loadIpRangesWithTimeout,
  now = Date.now,
}: { load?: () => Promise<IpRanges>; now?: () => number } = {}) {
  let lastGood: IpRanges = {};
  let current: { promise: Promise<IpRanges>; expiresAt: number } | null = null;

  return function getIpRanges(): Promise<IpRanges> {
    if (current && current.expiresAt > now()) {
      return current.promise;
    }
    const entry = {
      promise: Promise.resolve(lastGood),
      expiresAt: now() + IP_RANGES_TTL_MS,
    };
    entry.promise = load()
      .catch((): IpRanges => ({}))
      .then((fresh) => {
        const lostFiles = Object.keys(lastGood).some((url) => !(url in fresh));
        if (Object.keys(fresh).length === 0 || lostFiles) {
          entry.expiresAt = now() + IP_RANGES_RETRY_MS;
        }
        lastGood = { ...lastGood, ...fresh };
        return lastGood;
      });
    current = entry;
    return entry.promise;
  };
}
