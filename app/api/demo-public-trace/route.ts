import { NextRequest, NextResponse } from "next/server";

import {
  DEMO_PUBLIC_TRACE_FALLBACK_URLS,
  getPublicDemoTraceUrl,
  type DemoTraceSource,
} from "@/lib/demo-public-trace";
import { rateLimit } from "@/lib/rateLimit";

const TRACE_ID_PATTERN = /^[0-9a-f]{32}$/i;
const OBSERVATION_ID_PATTERN = /^[0-9a-f]{16}$/i;

const redirectWithoutCaching = (url: string) => {
  const response = NextResponse.redirect(url, 307);
  response.headers.set("Cache-Control", "no-store");
  return response;
};

const isDemoTraceSource = (value: string | null): value is DemoTraceSource =>
  value !== null && value in DEMO_PUBLIC_TRACE_FALLBACK_URLS;

export async function GET(request: NextRequest) {
  const sourceParam = request.nextUrl.searchParams.get("source");
  const source: DemoTraceSource = isDemoTraceSource(sourceParam)
    ? sourceParam
    : "image_generator";
  const fallbackUrl = DEMO_PUBLIC_TRACE_FALLBACK_URLS[source];
  const traceId = request.nextUrl.searchParams.get("traceId");
  const observationId = request.nextUrl.searchParams.get("observationId");

  if (!traceId || !TRACE_ID_PATTERN.test(traceId)) {
    return redirectWithoutCaching(fallbackUrl);
  }
  // The image generator always pins an observation; the voice agent links to
  // the trace as a whole while the conversation is still running.
  if (
    (source === "image_generator" && !observationId) ||
    (observationId && !OBSERVATION_ID_PATTERN.test(observationId))
  ) {
    return redirectWithoutCaching(fallbackUrl);
  }

  const { success } = rateLimit(request, { limit: 30, windowMs: 60_000 });
  if (!success) {
    return redirectWithoutCaching(fallbackUrl);
  }

  const traceUrl = await getPublicDemoTraceUrl(
    traceId,
    fallbackUrl,
    observationId,
  );

  return redirectWithoutCaching(traceUrl);
}

export const dynamic = "force-dynamic";
export const maxDuration = 15;
