import OpenAI from "openai";
import { observeOpenAI } from "@langfuse/openai";
import {
  observe,
  propagateAttributes,
  updateActiveObservation,
  updateActiveTrace,
  getActiveTraceId,
} from "@langfuse/tracing";
import { after } from "next/server";
import { flush } from "@/src/instrumentation";
import { rateLimit } from "@/lib/rateLimit";

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
      // observeOpenAI automatically creates a child generation span that
      // captures: model, input (prompt), and usage tokens with granular
      // breakdown (input_text_tokens, input_image_tokens, output_tokens).
      const openai = observeOpenAI(new OpenAI(), {
        generationName: "gpt-image-1",
      });

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

      const mediaType = "image/png";

      // The observeOpenAI generation span has ended at this point, so
      // updateActiveObservation targets the parent span from observe().
      // The Langfuse SDK automatically detects data URIs, uploads them
      // to object storage, and displays them in the trace UI.
      updateActiveObservation({
        output: `data:${mediaType};base64,${imageData}`,
      });

      after(async () => await flush());

      return new Response(
        JSON.stringify({
          image: { base64: imageData, mediaType },
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
  captureOutput: false,
});

export const maxDuration = 60;
