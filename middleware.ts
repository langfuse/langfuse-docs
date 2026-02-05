import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";

const TRACKING_API = "https://ai-docs-analytics-api.theisease.workers.dev/track";

function trackVisit(request: NextRequest): Promise<void> {
  return fetch(TRACKING_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      host: request.headers.get("host") || "unknown",
      path: request.nextUrl.pathname,
      user_agent: request.headers.get("user-agent") || "",
      accept_header: request.headers.get("accept") || "",
      country: request.headers.get("x-vercel-ip-country") || "unknown",
    }),
  }).then(() => {}).catch(() => {});
}

export function middleware(request: NextRequest, event: NextFetchEvent) {
  event.waitUntil(trackVisit(request));
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
