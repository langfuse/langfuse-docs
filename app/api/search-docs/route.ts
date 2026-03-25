import { NextRequest, NextResponse } from "next/server";
import { searchLangfuseDocsWithInkeep, isNonEmptyString } from "@/lib/inkeep-search";

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
