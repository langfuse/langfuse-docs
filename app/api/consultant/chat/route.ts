import { createUIMessageStream, createUIMessageStreamResponse } from "ai";
import { toAISdkStream } from "@mastra/ai-sdk";
import { after } from "next/server";
import {
  CONSULTANT_ALL_SKILLS,
  flushConsultantTraces,
  getConsultantAgent,
} from "@/lib/consultant/agent";
import { consultantSkillPin } from "@/lib/consultant/skill.generated";
import { consultantTranscript } from "@/lib/consultant/messages.mjs";
import { rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const unavailable =
  "The consultant is unavailable right now. Try again in a moment.";

// Reading other skills and references needs room for a few more tool calls.
const MAX_STEPS = CONSULTANT_ALL_SKILLS ? 6 : 4;

type StepWithTools = {
  toolCalls?: Array<{ toolName?: string }>;
};

export async function POST(req: Request) {
  const { success } = rateLimit(req, { limit: 8, windowMs: 60_000 });
  if (!success) {
    return Response.json(
      { error: "Too many messages. Wait a minute and try again." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json(
      { error: "Describe your AI app to get a plan." },
      { status: 400 },
    );
  }

  const transcript = consultantTranscript(body);
  if ("error" in transcript) {
    return Response.json({ error: transcript.error }, { status: 400 });
  }
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: unavailable }, { status: 503 });
  }

  const sessionId = transcript.sessionId ?? crypto.randomUUID();
  const abortSignal = AbortSignal.any([
    req.signal,
    AbortSignal.timeout(55_000),
  ]);

  let finished = false;
  let resolveFinished!: () => void;
  const completion = new Promise<void>((resolve) => {
    resolveFinished = resolve;
  });
  after(async () => {
    await completion;
    await flushConsultantTraces();
  });
  function finish() {
    if (finished) return;
    finished = true;
    resolveFinished();
  }

  try {
    const result = await getConsultantAgent().stream(transcript.messages, {
      maxSteps: MAX_STEPS,
      abortSignal,
      modelSettings: {
        maxOutputTokens: 4_000,
        temperature: 0.3,
        maxRetries: 1,
      },
      providerOptions: {
        openai: { reasoningEffort: "low" },
      },
      prepareStep: ({ steps }) => {
        const activated = (steps as StepWithTools[]).some((step) =>
          step.toolCalls?.some((call) => call.toolName === "skill"),
        );
        if (!activated) {
          return { toolChoice: { type: "tool" as const, toolName: "skill" } };
        }
        if (steps.length >= MAX_STEPS - 1) {
          return { toolChoice: "none" as const };
        }
        return {};
      },
      tracingOptions: {
        rootSpanName: "consultant-chat",
        tags: ["consultant"],
        metadata: {
          sessionId,
          traceName: "consultant-chat",
          feature: "consultant",
          skillSha: consultantSkillPin.sha,
          skillName: "langfuse-consultant",
          skillMode: CONSULTANT_ALL_SKILLS ? "all" : "consultant",
        },
      },
      onFinish: () => finish(),
      onError: () => finish(),
      onAbort: () => finish(),
    });

    const stream = createUIMessageStream({
      execute: async ({ writer }) => {
        try {
          for await (const part of toAISdkStream(result, {
            from: "agent",
            version: "v7",
            sendReasoning: false,
            sendSources: false,
          })) {
            // Mastra vendors its own AI SDK v7 types. They match the wire
            // format this app's `ai` package expects, but TypeScript treats
            // the two copies as different types.
            await writer.write(part as never);
          }
        } finally {
          finish();
        }
      },
      onError: () => unavailable,
    });

    return createUIMessageStreamResponse({ stream });
  } catch (error) {
    finish();
    console.warn(
      "consultant: request failed",
      error instanceof Error ? error.name : "UnknownError",
    );
    return Response.json({ error: unavailable }, { status: 502 });
  }
}
