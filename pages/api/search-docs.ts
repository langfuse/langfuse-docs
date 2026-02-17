import type { NextApiRequest, NextApiResponse } from "next";
import { searchLangfuseDocsWithInkeep, isNonEmptyString } from "./inkeep-search";

// Public, unauthenticated GET endpoint that exposes the Inkeep docs search used by MCP.
// Usage: /api/search-docs?query=<url-encoded question>
// Returns JSON: { query, answer, metadata } where `metadata` is the raw Inkeep payload.
const setCorsHeaders = (res: NextApiResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res
      .status(405)
      .setHeader("Allow", "GET, OPTIONS")
      .json({ error: "Method Not Allowed" });
  }

  const queryParam = req.query.query;
  const query = Array.isArray(queryParam) ? queryParam[0] : queryParam;

  if (!isNonEmptyString(query)) {
    return res.status(400).json({
      error: "Missing or invalid 'query' parameter",
    });
  }

  try {
    const inkeepResult = await searchLangfuseDocsWithInkeep(query);

    return res.status(200).json({
      query,
      answer: inkeepResult.answer,
      metadata: inkeepResult.metadata,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error searching documentation",
      message: error instanceof Error ? error.message : "Unknown error",
      query,
    });
  }
}
