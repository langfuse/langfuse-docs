type GitHubLatestRelease = {
  published_at?: string;
};

const GITHUB_LATEST_RELEASE_API_URL =
  "https://api.github.com/repos/langfuse/langfuse/releases/latest";

export async function getLatestGitHubReleaseDate(): Promise<string | null> {
  try {
    const response = await fetch(GITHUB_LATEST_RELEASE_API_URL, {
      headers: {
        Accept: "application/vnd.github+json",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch latest GitHub release: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const release = (await response.json()) as GitHubLatestRelease;
    return release.published_at ?? null;
  } catch (error) {
    console.error("Failed to fetch latest GitHub release", error);
    return null;
  }
}
