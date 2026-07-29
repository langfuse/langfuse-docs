import { NextRequest, NextResponse } from "next/server";

import type { DemoTraceFallbackKind } from "@/lib/demo-public-trace";
import {
  getDemoTraceFallbackUrl,
  getPublicDemoTraceUrl,
} from "@/lib/demo-public-trace";
import { rateLimit } from "@/lib/rateLimit";

const TRACE_ID_PATTERN = /^[0-9a-f]{32}$/i;
const OBSERVATION_ID_PATTERN = /^[0-9a-f]{16}$/i;

const redirectWithoutCaching = (url: string) => {
  const response = NextResponse.redirect(url, 307);
  response.headers.set("Cache-Control", "no-store");
  return response;
};

export async function GET(request: NextRequest) {
  const fallbackKind: DemoTraceFallbackKind =
    request.nextUrl.searchParams.get("fallback") === "image-generation"
      ? "image-generation"
      : "default";
  const fallbackUrl = getDemoTraceFallbackUrl(fallbackKind);
  const traceId = request.nextUrl.searchParams.get("traceId");
  const observationId = request.nextUrl.searchParams.get("observationId");

  if (
    !traceId ||
    !TRACE_ID_PATTERN.test(traceId) ||
    !observationId ||
    !OBSERVATION_ID_PATTERN.test(observationId)
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
