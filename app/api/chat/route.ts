import { download } from "@/lib/ai/download";
import { ProvideLinksToolSchema } from "@/lib/ai/inkeep-qa-schema";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { convertToModelMessages, streamText, validateUIMessages } from "ai";
import type { InkeepUIMessage } from "@/lib/ai/inkeep-qa-schema";
import { NextResponse } from "next/server";
import { z } from "zod";

export const maxDuration = 60;

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
  apiKey: process.env.INKEEP_BACKEND_API_KEY,
  baseURL: "https://api.inkeep.com/v1",
});

export async function POST(req: Request) {
  if (!process.env.INKEEP_BACKEND_API_KEY) {
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

  let modelMessages: Awaited<ReturnType<typeof convertToModelMessages>>;
  try {
    const messages = await validateUIMessages<InkeepUIMessage>({
      messages: parsed.data.messages,
      dataSchemas: { client: z.object({ location: z.string() }) },
      tools: { provideLinks: { inputSchema: ProvideLinksToolSchema } },
    });
    modelMessages = await convertToModelMessages(messages, {
      ignoreIncompleteToolCalls: true,
      convertDataPart(part) {
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
      experimental_download: download,
      model: inkeep("inkeep-qa-expert"),
      tools: {
        provideLinks: {
          inputSchema: ProvideLinksToolSchema,
        },
      },
      messages: modelMessages,
      toolChoice: "auto",
      // AI SDK 7 emits telemetry by default once an integration is registered;
      // keep the Inkeep proxy untraced as before.
      telemetry: { isEnabled: false },
    });

    return result.toUIMessageStreamResponse({ redactToolErrors: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to start the assistant." },
      { status: 502 },
    );
  }
}
