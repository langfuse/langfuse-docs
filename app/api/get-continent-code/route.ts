import { NextRequest } from "next/server";

export const runtime = "edge";

export function GET(request: NextRequest) {
  const continentCode = request.headers.get("x-vercel-ip-continent");

  return new Response(
    JSON.stringify({ continentCode: continentCode || undefined }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
