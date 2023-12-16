import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";
import { createClient } from "@supabase/supabase-js";
import GPT3Tokenizer from "gpt3-tokenizer";
import { codeBlock, oneLine } from "common-tags";
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
  const openAiMessages = messages.map(({ content, role }) => ({
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

  const embeddingSpan = retrievalSpan.span({
    name: "prompt-embedding",
    level: "DEBUG",
    input: sanitizedQuery.replaceAll("\n", " "),
    metadata: {
      model: "text-embedding-ada-002",
    },
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

  embeddingSpan.end({
    output: embedding,
  });

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

  const assembledMessages = [
    contextText !== ""
      ? {
          role: "system",
          content: codeBlock`
      ${oneLine`
      You are a very enthusiastic Langfuse representative who loves
      to help people! Langfuse is an open-source observability tool for developers of applications that use Large Language Models (LLMs).
      Given the following sections from the Langfuse documentation, answer the question using only that information,
      outputted in markdown format. Refer to the respective links of the documentation.`}
      
      Context START
      """
      ${contextText}
      """
      Context END
      
      Answer as markdown (including related code snippets if available), use highlights and paragraphs to structure the text.
      Use emojis in your answers. Do not mention that you are "enthusiastic", the user does not need to know, will feel it from the style of your answers.
      Only use information that is available in the context, do not make up any code that is not in the context. If you are unsure and the answer is not explicitly written in the documentation, say
      "Sorry, I don't know how to help with that." If the user is having problems using Langfuse, tell her to reach out to the founders directly.`,
        }
      : {
          role: "system",
          content: oneLine`
      You are a very enthusiastic Langfuse representative who loves
      to help people! Langfuse is an open-source observability tool for developers of applications that use Large Language Models (LLMs).
      As there are no documentation documents that explain to the user's latest message, answer only based on the information you provided earlier in the conversation. Try to ask the user to make their question more specific.
      Answer as markdown (including related code snippets if available), use highlights and paragraphs to structure the text.
      Use emojis in your answers. Do not mention that you are "enthusiastic", the user does not need to know, will feel it from the style of your answers.
      Answer with "Sorry, I don't know how to help with that." if the question is not related to Langfuse. If the user is having problems using Langfuse, tell her to reach out to the founders directly.`,
        },
    ...openAiMessages,
  ];

  const generation = trace.generation({
    name: "generation",
    prompt: assembledMessages as any,
    model: "gpt-3.5-turbo",
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
        completion,
        level: completion.includes("I don't know how to help with that")
          ? "WARNING"
          : "DEFAULT",
        statusMessage: completion.includes("I don't know how to help with that")
          ? "Refused to answer"
          : undefined,
      });
      trace.update({
        output: completion,
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
