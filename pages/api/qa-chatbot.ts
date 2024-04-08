import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";
import { createClient } from "@supabase/supabase-js";
import GPT3Tokenizer from "gpt3-tokenizer";
import { Langfuse } from "langfuse";

export const config = {
  runtime: "edge",
};

const openAIconfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(openAIconfig);
const supabaseClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    db: { schema: "docs" },
    auth: {
      persistSession: false,
    },
  }
);

const langfuse = new Langfuse({
  publicKey: process.env.NEXT_PUBLIC_LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.LANGFUSE_SECRET_KEY,
  baseUrl: process.env.NEXT_PUBLIC_LANGFUSE_BASE_URL ?? undefined,
});
// langfuse.debug();

export default async function handler(req: Request, res: Response) {
  const body = await req.json();

  const trace = langfuse.trace({
    name: "qa",
    sessionId: "lf.docs.conversation." + body.conversationId,
    userId: body.userId,
    metadata: {
      pathname: new URL(req.headers.get("Referer")).pathname,
    },
  });

  const messages = body.messages;

  // Exclude additional fields from being sent to OpenAI
  const openAiMessageHistory = messages.map(({ content, role }) => ({
    content,
    role: role,
  }));

  // get last message
  const sanitizedQuery = messages[messages.length - 1].content.trim();

  trace.update({
    input: sanitizedQuery,
  });

  const retrievalSpan = trace.span({
    name: "retrieval",
    input: sanitizedQuery,
  });

  const embeddingSpan = retrievalSpan.generation({
    name: "prompt-embedding",
    level: "DEBUG",
    input: sanitizedQuery.replaceAll("\n", " "),
    model: "text-embedding-ada-002",
  });

  const embeddingResponse = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: sanitizedQuery.replaceAll("\n", " "),
  });
  if (embeddingResponse.status !== 200) {
    embeddingSpan.update({
      level: "ERROR",
      statusMessage: "Failed to create embedding for question",
    });
    console.error("Failed to create embedding for question", embeddingResponse);
    throw new Error("Failed to create embedding for question");
  }
  const [{ embedding }] = (await embeddingResponse.json()).data;
  embeddingSpan.end();

  const vectorStoreSpan = retrievalSpan.span({
    name: "vector-store",
    input: embedding,
    metadata: {
      match_threshold: 0.78,
      match_count: 10,
      min_content_length: 50,
    },
  });

  const { error: matchError, data: pageSections } = await supabaseClient.rpc(
    "match_page_sections",
    {
      embedding,
      match_threshold: 0.78,
      match_count: 10,
      min_content_length: 50,
    }
  );

  if (matchError) {
    vectorStoreSpan.update({
      level: "ERROR",
      statusMessage: "Failed to match page sections",
    });
    console.error("Failed to match page sections", matchError);
    throw new Error("Failed to match page sections");
  }

  vectorStoreSpan.end({
    output: pageSections,
  });

  const contextEncodingSpan = retrievalSpan.span({
    name: "context-encoding",
    input: pageSections,
  });

  const tokenizer = new GPT3Tokenizer({ type: "gpt3" });
  let tokenCount = 0;
  let contextText = "";

  for (const pageSection of pageSections) {
    const content = pageSection.content;
    const encoded = tokenizer.encode(content);
    tokenCount += encoded.text.length;

    if (tokenCount >= 1500) {
      break;
    }

    contextText += `${content.trim()}\n---\n`;
  }

  contextEncodingSpan.end({
    output: {
      text: contextText,
    },
  });
  retrievalSpan.end({
    output: {
      text: contextText,
    },
    ...(contextText === ""
      ? { level: "WARNING", statusMessage: "No context found" }
      : {}),
  });

  const promptName =
    contextText !== ""
      ? "qa-answer-with-context-chat"
      : "qa-answer-no-context-chat";

  const promptSpan = trace.span({
    name: "fetch-prompt-from-langfuse",
    input: {
      promptName,
    },
  });
  const langfusePrompt = await langfuse.getPrompt(promptName, undefined, {
    type: "chat",
  });
  const compiledLangfuseMessages = langfusePrompt.compile({
    context: contextText,
  });
  promptSpan.end({
    output: { compiledLangfuseMessages, version: langfusePrompt.version },
  });

  const assembledMessages = [
    ...compiledLangfuseMessages,
    ...openAiMessageHistory,
  ];

  const generation = trace.generation({
    name: "generation",
    input: assembledMessages as any,
    model: "gpt-3.5-turbo",
    prompt: langfusePrompt,
  });

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: assembledMessages,
  });
  const stream = OpenAIStream(response, {
    onStart: () => {
      generation.update({
        completionStartTime: new Date(),
      });
    },
    onCompletion: async (completion) => {
      generation.end({
        output: completion,
        level: completion.includes("I don't know how to help with that")
          ? "WARNING"
          : "DEFAULT",
        statusMessage: completion.includes("I don't know how to help with that")
          ? "Refused to answer"
          : undefined,
      });
      trace.update({
        output: completion,
        tags: contextText !== "" ? ["with-context"] : ["no-context"],
      });
      await langfuse.shutdownAsync();
    },
  });
  return new StreamingTextResponse(stream, {
    headers: {
      "X-Trace-Id": trace.id,
    },
  });
}
