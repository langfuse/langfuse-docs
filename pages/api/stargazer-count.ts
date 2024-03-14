import { NextApiRequest, NextApiResponse } from "next";

const GITHUB_REPO_API_URL = "https://api.github.com/repos/langfuse/langfuse";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Only allow GET requests for this endpoint
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    // Prepare headers for the GitHub API request
    const headers = {
      Accept: "application/vnd.github.v3+json",
    };

    // If a GitHub access token is provided in the environment variables, include it in the headers
    if (process.env.GITHUB_ACCESS_TOKEN) {
      headers["Authorization"] = `token ${process.env.GITHUB_ACCESS_TOKEN}`;
    }

    // Fetch the repository information from GitHub API
    const response = await fetch(GITHUB_REPO_API_URL, { headers });

    // If the response is not successful, throw an error
    if (!response.ok) {
      throw new Error(`GitHub API responded with status: ${response.status}`);
    }

    // Parse the response data
    const repoData = await response.json();

    return (
      res
        .status(200)
        .setHeader("Content-Type", "application/json")
        // Cache the response for 3 hours, also CDNs as public
        .setHeader("Cache-Control", "public, max-age=10800")
        .json({ stargazers_count: repoData.stargazers_count })
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
