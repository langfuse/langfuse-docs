import { openai } from "@ai-sdk/openai";
import { experimental_generateImage as generateImage } from "ai";
import {
  observe,
  updateActiveTrace,
  getActiveTraceId,
} from "@langfuse/tracing";
import { after } from "next/server";
import { flush } from "@/src/instrumentation";
import { rateLimit } from "@/lib/rateLimit";

const handler = async (req: Request) => {
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

  const result = await generateImage({
    model: openai.image("gpt-image-1"),
    prompt,
    size: "1024x1024",
    providerOptions: {
      openai: { quality: "low" },
    },
  });

  const image = result.image;

  updateActiveTrace({
    output: {
      mediaType: image.mediaType,
      size: "1024x1024",
      model: "gpt-image-1",
    },
  });

  after(async () => await flush());

  return new Response(
    JSON.stringify({
      image: { base64: image.base64, mediaType: image.mediaType },
      traceId,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};

export const POST = observe(handler, {
  name: "image-generator",
});

export const maxDuration = 60;
