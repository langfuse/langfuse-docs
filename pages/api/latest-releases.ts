import { NextApiRequest, NextApiResponse } from "next";

const REPOS = [
  "langfuse/langfuse",
  "langfuse/langfuse-python",
  "langfuse/langfuse-js",
];

const GITHUB_REPO_API_URL_RELEASE = (repo: string) =>
  `https://api.github.com/repos/${repo}/releases`;

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
    const responses = await Promise.all(
      REPOS.map((repo) => fetch(GITHUB_REPO_API_URL_RELEASE(repo), { headers }))
    );

    // If the response is not successful, throw an error
    if (responses.some((res) => !res.ok)) {
      throw new Error(`GitHub API responded with an error`);
    }

    // Parse the response data and extract the latest release tag
    const langfuseReleases = await Promise.all(
      responses.map(async (response, index) => {
        const data = await response.json();
        const latestRelease = data[0]; // Assuming the latest release is the first in the array
        return {
          repo: REPOS[index],
          latestRelease: latestRelease ? latestRelease.tag_name : "No releases",
        };
      })
    );

    return (
      res
        .status(200)
        .setHeader("Content-Type", "application/json")
        // Only CDN should cache the response for 1 minute
        .setHeader("Cache-Control", "public, s-maxage=60")
        .json(langfuseReleases)
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
