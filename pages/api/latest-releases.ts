import { NextApiRequest, NextApiResponse } from "next";

const REPOS = [
  "langfuse/langfuse",
  "langfuse/langfuse-python",
  "langfuse/langfuse-js",
];

const GITHUB_REPO_API_URL_RELEASE = (repo: string) =>
  `https://api.github.com/repos/${repo}/releases`;

type ApiResponse = {
  repo: string;
  latestRelease?: string;
  publishedAt?: string;
  url?: string;
};

const getLatestReleases = async (): Promise<ApiResponse[]> => {
  const headers = {
    Accept: "application/vnd.github.v3+json",
  };

  if (process.env.GITHUB_ACCESS_TOKEN) {
    headers["Authorization"] = `token ${process.env.GITHUB_ACCESS_TOKEN}`;
  }

  const responses = await Promise.all(
    REPOS.map((repo) => fetch(GITHUB_REPO_API_URL_RELEASE(repo), { headers }))
  );

  if (responses.some((res) => !res.ok)) {
    throw new Error(`GitHub API responded with an error`);
  }

  const langfuseReleases = await Promise.all(
    responses.map(async (response, index) => {
      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error(`No releases found for ${REPOS[index]}`);
      }
      const latestRelease = data.find((release) => !release.prerelease);
      if (!latestRelease) {
        throw new Error(`No latest release found for ${REPOS[index]}`);
      }
      return {
        repo: REPOS[index],
        latestRelease: latestRelease ? latestRelease.tag_name : undefined,
        publishedAt: latestRelease ? latestRelease.published_at : undefined,
        url: latestRelease ? latestRelease.html_url : undefined,
      };
    })
  );

  return langfuseReleases;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Only allow GET requests for this endpoint
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    const langfuseReleases = await getLatestReleases();

    return (
      res
        .status(200)
        .setHeader("Content-Type", "application/json")
        // cache for 5 minutes in the CDN
        .setHeader("Cache-Control", "public, s-maxage=300, max-age=0")
        .json(langfuseReleases)
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
