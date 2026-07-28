import OpenAI from "openai";
import { propagateAttributes, startActiveObservation } from "@langfuse/tracing";
import { LangfuseMedia } from "@langfuse/core";
import { flush } from "@/src/instrumentation";
import { rateLimit } from "@/lib/rateLimit";
import {
  createPublicDemoTraceLink,
  makeDemoTracePublic,
  publishPublicDemoTraceLink,
} from "@/lib/demo-project-trace";

let _openai: OpenAI | null = null;
const getOpenAI = () => (_openai ??= new OpenAI());

const handler = async (req: Request) => {
  const { success } = rateLimit(req, { limit: 3, windowMs: 60_000 });
  if (!success) {
    return new Response(
      JSON.stringify({
        error:
          "Rate limit exceeded. Image generation is limited to 3 per minute. Please try again later.",
      }),
      { status: 429, headers: { "Content-Type": "application/json" } },
    );
  }

  const { prompt, userId }: { prompt: string; userId: string } =
    await req.json();

  if (!prompt || prompt.trim().length === 0) {
    return new Response(JSON.stringify({ error: "Prompt is required." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return startActiveObservation(
    "image-generator",
    async (rootObservation) => {
      try {
        return await propagateAttributes(
          {
            traceName: "Image-Generator",
            tags: ["image-generator"],
            userId,
          },
          async () => {
            rootObservation.update({ input: prompt });
            makeDemoTracePublic(rootObservation);
            await createPublicDemoTraceLink({
              traceId: rootObservation.traceId,
            });

            const result = await getOpenAI().images.generate({
              model: "gpt-image-1",
              prompt,
              size: "1024x1024",
              quality: "low",
            });

            const imageData = result.data?.[0]?.b64_json;
            if (!imageData) {
              throw new Error("No image data returned");
            }

            const imageMedia = new LangfuseMedia({
              contentBytes: Buffer.from(imageData, "base64"),
              contentType: "image/png",
              source: "bytes",
            });

            const usage = (result as any).usage as
              | {
                  input_tokens?: number;
                  output_tokens?: number;
                  total_tokens?: number;
                }
              | undefined;

            rootObservation.update({
              input: prompt,
              output: imageMedia,
              model: "gpt-image-1",
              modelParameters: {
                size: "1024x1024",
                quality: "low",
              },
              ...(usage && {
                usageDetails: {
                  input_tokens: usage.input_tokens ?? 0,
                  output_tokens: usage.output_tokens ?? 0,
                  total: usage.total_tokens ?? 0,
                },
              }),
            });
            makeDemoTracePublic(rootObservation);
            rootObservation.end();

            let traceUrl: string | undefined;
            try {
              await flush();
              const publishedTraceLink = await publishPublicDemoTraceLink({
                traceId: rootObservation.traceId,
              });
              traceUrl = publishedTraceLink.traceUrl;
            } catch (err) {
              console.warn("Failed to flush public Langfuse trace", err);
            }

            return new Response(
              JSON.stringify({
                image: { base64: imageData, mediaType: "image/png" },
                traceId: rootObservation.traceId,
                traceUrl,
              }),
              { status: 200, headers: { "Content-Type": "application/json" } },
            );
          },
        );
      } catch (err) {
        rootObservation.update({
          level: "ERROR",
          statusMessage: err instanceof Error ? err.message : String(err),
        });
        rootObservation.end();

        try {
          await flush();
        } catch (flushErr) {
          console.warn("Failed to flush errored Langfuse trace", flushErr);
        }

        return new Response(
          JSON.stringify({
            error:
              err instanceof Error ? err.message : "Failed to generate image",
          }),
          { status: 500, headers: { "Content-Type": "application/json" } },
        );
      }
    },
    {
      asType: "generation",
      endOnExit: false,
    },
  );
};

export const POST = handler;

export const maxDuration = 60;
