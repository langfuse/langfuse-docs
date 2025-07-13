#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const GITHUB_REPO_API_URL = "https://api.github.com/repos/langfuse/langfuse";
const STARS_FILE_PATH = path.join(__dirname, "..", "src", "github-stars.ts");

async function updateGitHubStars() {
  try {
    console.log("Fetching GitHub stars...");

    // Prepare headers for the GitHub API request
    const headers = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "langfuse-docs",
    };

    // If a GitHub access token is provided in the environment variables, include it in the headers
    if (process.env.GITHUB_ACCESS_TOKEN) {
      headers["Authorization"] = `token ${process.env.GITHUB_ACCESS_TOKEN}`;
    } else {
      console.warn(
        "Warning: GITHUB_ACCESS_TOKEN not set. API requests may be rate limited."
      );
    }

    // Fetch repository information from GitHub API
    const response = await fetch(GITHUB_REPO_API_URL, { headers });

    if (!response.ok) {
      throw new Error(
        `GitHub API request failed: ${response.status} ${response.statusText}`
      );
    }

    const repoData = await response.json();
    const starCount = repoData.stargazers_count;

    if (typeof starCount !== "number") {
      throw new Error("Invalid star count received from GitHub API");
    }

    console.log(`✅ Fetched ${starCount} GitHub stars`);

    // Update the TypeScript file
    const newContent = `export const GITHUB_STARS = ${starCount};`;

    fs.writeFileSync(STARS_FILE_PATH, newContent, "utf8");
    console.log(`✅ Updated ${STARS_FILE_PATH} with ${starCount} stars`);
  } catch (error) {
    console.error("❌ Error updating GitHub stars:", error.message);
    process.exit(1); // Fail the build
  }
}

updateGitHubStars();
