import { NextResponse } from "next/server";

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

async function getLatestReleases(): Promise<ApiResponse[]> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };

  if (process.env.GITHUB_ACCESS_TOKEN) {
    (headers as Record<string, string>)["Authorization"] =
      `token ${process.env.GITHUB_ACCESS_TOKEN}`;
  }

  const responses = await Promise.all(
    REPOS.map((repo) => fetch(GITHUB_REPO_API_URL_RELEASE(repo), { headers }))
  );

  if (responses.some((res) => !res.ok)) {
    throw new Error("GitHub API responded with an error");
  }

  const langfuseReleases = await Promise.all(
    responses.map(async (response, index) => {
      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error(`No releases found for ${REPOS[index]}`);
      }
      const latestRelease = data.find((r: { prerelease?: boolean }) => !r.prerelease);
      if (!latestRelease) {
        throw new Error(`No latest release found for ${REPOS[index]}`);
      }
      return {
        repo: REPOS[index],
        latestRelease: latestRelease.tag_name,
        publishedAt: latestRelease.published_at,
        url: latestRelease.html_url,
      };
    })
  );

  return langfuseReleases;
}

export async function GET() {
  try {
    const langfuseReleases = await getLatestReleases();
    return NextResponse.json(langfuseReleases, {
      headers: {
        "Cache-Control":
          "public, s-maxage=3600, max-age=3600, stale-if-error=604800",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
