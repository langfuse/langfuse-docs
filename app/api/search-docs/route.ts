import { NextRequest, NextResponse } from "next/server";
import { searchLangfuseDocsWithInkeep, isNonEmptyString } from "@/lib/inkeep-search-backend";
import { PostHog } from "posthog-node";
import { waitUntil } from "@vercel/functions";

const posthog = process.env.NEXT_PUBLIC_POSTHOG_KEY
  ? new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.posthog.com",
      flushAt: 1,
      flushInterval: 0,
    })
  : undefined;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query");

  if (!isNonEmptyString(query)) {
    return NextResponse.json(
      { error: "Missing or invalid 'query' parameter" },
      { status: 400, headers: corsHeaders }
    );
  }

  // Fire PostHog event immediately so it has time to flush
  waitUntil(
    (async () => {
      try {
        posthog?.capture({
          distinctId: "docs-search-api",
          event: "docs_search:query",
          properties: {
            query,
            $process_person_profile: false,
          },
        });
        await posthog?.flush();
      } catch (error) {
        console.error("Error tracking PostHog event:", error);
      }
    })()
  );

  try {
    const inkeepResult = await searchLangfuseDocsWithInkeep(query);
    return NextResponse.json(
      { query, answer: inkeepResult.answer, metadata: inkeepResult.metadata },
      { headers: corsHeaders }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error searching documentation",
        message: error instanceof Error ? error.message : "Unknown error",
        query,
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
