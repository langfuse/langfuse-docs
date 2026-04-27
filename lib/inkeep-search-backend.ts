const INKEEP_CHAT_COMPLETIONS_URL = "https://api.inkeep.com/v1/chat/completions";
const INKEEP_MODEL = "inkeep-rag";

export type InkeepSearchResponse = {
  answer: string;
  metadata: unknown;
};

export const searchLangfuseDocsWithInkeep = async (
  query: string
): Promise<InkeepSearchResponse> => {
  if (!process.env.INKEEP_BACKEND_API_KEY) {
    throw new Error("Missing INKEEP_BACKEND_API_KEY environment variable");
  }

  const inkeepRes = await fetch(INKEEP_CHAT_COMPLETIONS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.INKEEP_BACKEND_API_KEY}`,
    },
    body: JSON.stringify({
      model: INKEEP_MODEL,
      messages: [{ role: "user", content: query }],
      response_format: { type: "json_object" },
    }),
  });

  if (!inkeepRes.ok) {
    throw new Error(`Inkeep API returned ${inkeepRes.status}`);
  }

  const result = await inkeepRes.json();

  return {
    answer: result?.choices?.[0]?.message?.content || "No results found",
    metadata: result,
  };
};

export const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;
