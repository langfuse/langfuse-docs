const rateLimitStore = new Map<
  string,
  { count: number; resetAt: number }
>();

export function rateLimit(
  req: Request,
  opts: { limit: number; windowMs: number }
): { success: boolean; remaining: number } {
  // Clean up expired entries
  const now = Date.now();
  rateLimitStore.forEach((entry, key) => {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  });

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const url = new URL(req.url);
  const key = `${ip}:${url.pathname}`;

  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt < now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + opts.windowMs });
    return { success: true, remaining: opts.limit - 1 };
  }

  if (entry.count >= opts.limit) {
    return { success: false, remaining: 0 };
  }

  entry.count++;
  return { success: true, remaining: opts.limit - entry.count };
}
