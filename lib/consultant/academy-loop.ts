import "server-only";
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import {
  ACADEMY_LOOP_URL,
  isAcademyLoopUrl,
} from "@/lib/consultant/academy-loop-url.mjs";

export { ACADEMY_LOOP_URL };

const LOOP_MARKDOWN_URL = `${ACADEMY_LOOP_URL}.md`;
const CACHE_TTL_MS = 60 * 60 * 1000;
const MAX_CHARS = 24_000;

let cached: { content: string; fetchedAt: number } | null = null;

async function readAcademyLoopPage(signal?: AbortSignal) {
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.content;
  }
  const response = await fetch(LOOP_MARKDOWN_URL, {
    headers: { Accept: "text/markdown, text/plain;q=0.9" },
    redirect: "error",
    signal,
  });
  if (!response.ok) {
    throw new Error(`Academy loop page returned ${response.status}`);
  }
  const content = (await response.text()).slice(0, MAX_CHARS).trim();
  if (!content) throw new Error("Academy loop page was empty");
  cached = { content, fetchedAt: Date.now() };
  return content;
}

/**
 * Reads the Academy AI Engineering Loop page and nothing else.
 * A different URL is refused before any request is made.
 */
export const webFetchTool = createTool({
  id: "web_fetch",
  description:
    "Read the Langfuse Academy AI Engineering Loop page at https://langfuse.com/academy/ai-engineering-loop. This is the only page available.",
  inputSchema: z.object({
    url: z
      .string()
      .optional()
      .describe(
        "Optional. Only https://langfuse.com/academy/ai-engineering-loop is accepted.",
      ),
  }),
  outputSchema: z.object({
    url: z.string(),
    content: z.string().optional(),
    error: z.string().optional(),
  }),
  execute: async ({ url }, context) => {
    if (url && !isAcademyLoopUrl(url)) {
      return {
        url: ACADEMY_LOOP_URL,
        error: "Only the AI Engineering Loop page can be read from this chat.",
      };
    }
    try {
      const content = await readAcademyLoopPage(context?.abortSignal);
      return { url: ACADEMY_LOOP_URL, content };
    } catch {
      return {
        url: ACADEMY_LOOP_URL,
        error:
          "The AI Engineering Loop page could not be loaded. Continue from the skill.",
      };
    }
  },
});
