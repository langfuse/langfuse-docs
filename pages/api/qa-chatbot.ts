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
  flushAt: 1,
  flushInterval: 0,
});
// langfuse.debug();

export default async function handler(req: Request, res: Response) {
  const body = await req.json();
  console.log(body);

  const trace = langfuse.trace({
    name: "qa",
    id: "lf.docs.conversation." + body.conversationId,
    metadata: {
      pathname: new URL(req.headers.get("Referer")).pathname,
    },
  });

  const messages = body.messages;

  const messageSpan = trace.span({
    name: "user-interaction",
    input: messages,
  });

  // Exclude additional fields from being sent to OpenAI
  const openAiMessages = messages.map(({ content, role }) => ({
    content,
    role: role,
  }));

  // get last message
  const sanitizedQuery = messages[messages.length - 1].content.trim();
  // const sanitizedQuery = messages
  //   .filter(({ role }) => role === "user")
  //   .map(({ content }) => content.trim())
  //   .join("\n");

  const retrievalSpan = messageSpan.span({
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
  });

  const assembledMessages = [
    {
      role: "system",
      content: codeBlock`
      ${oneLine`
      You are a very enthusiastic Langfuse representative who loves
      to help people! Given the following sections from the Langfuse
      documentation, answer the question using only that information,
      outputted in markdown format. Refer to the respective links of the documentation.`}
      s
      Context START
      """
      ${contextText}
      """
      Context END
      
      Answer as markdown (including related code snippets if available), use highlights and paragraphs to structure the text.
      Use emojis in your answers.
      Only use information that is available in the context. If you are unsure and the answer is not explicitly written in the documentation, say
      "Sorry, I don't know how to help with that."`,
    },
    ...openAiMessages,
  ];

  const generation = messageSpan.generation({
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
      });
      messageSpan.end({
        output: {
          text: completion,
        },
        level: completion.includes("I don't know how to help with that")
          ? "WARNING"
          : "DEFAULT",
        statusMessage: completion.includes("I don't know how to help with that")
          ? "Refused to answer"
          : undefined,
      });
      await langfuse.shutdownAsync();
    },
  });
  return new StreamingTextResponse(stream, {
    headers: {
      "X-Message-Id": messageSpan.id,
    },
  });
}
