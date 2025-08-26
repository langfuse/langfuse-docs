import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Only allow GET requests for this endpoint
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    // Check if required environment variables are set
    const METABASE_SITE_URL = "https://langfuse.metabaseapp.com";
    const METABASE_SECRET_KEY = process.env.METABASE_SECRET_KEY;

    if (!METABASE_SITE_URL || !METABASE_SECRET_KEY) {
      console.error(
        "Missing required environment variables: METABASE_SITE_URL or METABASE_SECRET_KEY"
      );
      return res.status(500).json({ message: "Server configuration error" });
    }

    // Get dashboard ID and theme from query params
    const dashboardId = req.query.dashboardId
      ? parseInt(req.query.dashboardId as string, 10)
      : 25;
    const theme = req.query.theme === "day" ? "day" : "night"; // default to night

    // Create JWT payload
    const payload = {
      resource: { dashboard: dashboardId },
      params: {},
      exp: Math.round(Date.now() / 1000) + 10 * 60, // 10 minute expiration
    };

    // Sign the token
    const token = jwt.sign(payload, METABASE_SECRET_KEY);

    // Generate the iframe URL with dynamic theme
    const iframeUrl = `${METABASE_SITE_URL}/embed/dashboard/${token}#theme=${theme}&bordered=false&titled=false`;

    return (
      res
        .status(200)
        .setHeader("Content-Type", "application/json")
        // Cache for 5 minutes to avoid regenerating tokens too frequently
        .setHeader("Cache-Control", "public, s-maxage=300, max-age=0")
        .json({
          iframeUrl,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        })
    );
  } catch (error) {
    console.error("Error generating Metabase embed URL:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
