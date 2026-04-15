import { ProvideLinksToolSchema } from "@/lib/ai/inkeep-qa-schema";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { convertToModelMessages, streamText, zodSchema } from "ai";
import type { UIMessage } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";

export const maxDuration = 60;

// Type assertions below work around pnpm resolving duplicate copies of
// @ai-sdk/provider and zod, which makes structurally identical types
// appear incompatible to TypeScript.

const ChatBodySchema = z.object({
  messages: z.array(z.any()).max(80),
});

const RATE_WINDOW_MS = 60_000;
const RATE_MAX_REQUESTS = 40;
type Bucket = { count: number; windowStart: number };
const rateBuckets = new Map<string, Bucket>();

function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

function allowRequest(ip: string): boolean {
  const now = Date.now();
  const b = rateBuckets.get(ip);
  if (!b || now - b.windowStart > RATE_WINDOW_MS) {
    rateBuckets.set(ip, { count: 1, windowStart: now });
    return true;
  }
  if (b.count >= RATE_MAX_REQUESTS) return false;
  b.count += 1;
  return true;
}

const inkeep = createOpenAICompatible({
  name: "inkeep",
  apiKey: process.env.INKEEP_API_KEY,
  baseURL: "https://api.inkeep.com/v1",
});

export async function POST(req: Request) {
  if (!process.env.INKEEP_API_KEY) {
    return NextResponse.json(
      { error: "Chat is not configured." },
      { status: 503 },
    );
  }

  const ip = clientIp(req);
  if (!allowRequest(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Try again in a minute." },
      { status: 429 },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = ChatBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const messages = parsed.data.messages as UIMessage[];

  let modelMessages: Awaited<ReturnType<typeof convertToModelMessages>>;
  try {
    modelMessages = await (convertToModelMessages as Function)(messages, {
      ignoreIncompleteToolCalls: true,
      convertDataPart(part: { type: string; data: unknown }) {
        if (part.type === "data-client")
          return {
            type: "text" as const,
            text: `[Client Context: ${JSON.stringify(part.data)}]`,
          };
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Could not read message history." },
      { status: 400 },
    );
  }

  try {
    const result = streamText({
      model: inkeep("inkeep-qa-sonnet-4") as unknown as Parameters<
        typeof streamText
      >[0]["model"],
      tools: {
        provideLinks: {
          inputSchema: zodSchema(ProvideLinksToolSchema as any),
        },
      },
      messages: modelMessages,
      toolChoice: "auto",
    });

    return result.toUIMessageStreamResponse();
  } catch {
    return NextResponse.json(
      { error: "Failed to start the assistant." },
      { status: 502 },
    );
  }
}
