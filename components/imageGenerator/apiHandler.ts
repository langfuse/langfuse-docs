import OpenAI from "openai";
import {
  observe,
  propagateAttributes,
  updateActiveObservation,
  updateActiveTrace,
  getActiveTraceId,
} from "@langfuse/tracing";
import { LangfuseMedia } from "@langfuse/core";
import { after } from "next/server";
import { flush } from "@/src/instrumentation";
import { rateLimit } from "@/lib/rateLimit";

const openai = new OpenAI();

const handler = async (req: Request) => {
  return propagateAttributes({ tags: ["image-generator"] }, async () => {
    const { success } = rateLimit(req, { limit: 3, windowMs: 60_000 });
    if (!success) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded. Image generation is limited to 3 per minute. Please try again later.",
        }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    const { prompt, userId }: { prompt: string; userId: string } =
      await req.json();

    if (!prompt || prompt.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Prompt is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const traceId = getActiveTraceId();

    updateActiveTrace({
      name: "Image-Generator",
      userId,
      input: prompt,
    });

    try {
      const result = await openai.images.generate({
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
        | { input_tokens?: number; output_tokens?: number; total_tokens?: number }
        | undefined;

      updateActiveObservation(
        {
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
        },
        { asType: "generation" }
      );

      after(async () => await flush());

      return new Response(
        JSON.stringify({
          image: { base64: imageData, mediaType: "image/png" },
          traceId,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (err) {
      after(async () => await flush());

      return new Response(
        JSON.stringify({
          error: err instanceof Error ? err.message : "Failed to generate image",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  });
};

export const POST = observe(handler, {
  name: "image-generator",
  asType: "generation",
  captureOutput: false,
});

export const maxDuration = 60;
