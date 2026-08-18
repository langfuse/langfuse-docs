import { appendFileSync } from "node:fs";

type DebugPayload = {
  hypothesisId?: unknown;
  location?: unknown;
  message?: unknown;
  data?: unknown;
  timestamp?: unknown;
};

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const payload = (await request.json()) as DebugPayload;
  const timestamp =
    typeof payload.timestamp === "number" ? payload.timestamp : Date.now();

  try {
    appendFileSync(
      "/opt/cursor/logs/debug.log",
      JSON.stringify({
        hypothesisId:
          typeof payload.hypothesisId === "string" ? payload.hypothesisId : "Z",
        location:
          typeof payload.location === "string"
            ? payload.location
            : "app/api/debug-url/route.ts:19",
        message:
          typeof payload.message === "string"
            ? payload.message
            : "Unknown debug payload",
        data:
          payload.data &&
          typeof payload.data === "object" &&
          !Array.isArray(payload.data)
            ? payload.data
            : {},
        timestamp,
      }) + "\n",
    );
  } catch {
    return new Response(null, { status: 204 });
  }

  return new Response(null, { status: 204 });
}
