#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const GITHUB_REPO_API_URL = "https://api.github.com/repos/langfuse/langfuse";
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'github-stars.json');

async function fetchGitHubStars() {
  try {
    console.log('Fetching GitHub stars...');
    
    // Prepare headers for the GitHub API request
    const headers = {
      Accept: "application/vnd.github.v3+json",
      'User-Agent': 'langfuse-docs'
    };

    // If a GitHub access token is provided in the environment variables, include it in the headers
    if (process.env.GITHUB_ACCESS_TOKEN) {
      headers["Authorization"] = `token ${process.env.GITHUB_ACCESS_TOKEN}`;
    } else {
      console.warn('Warning: GITHUB_ACCESS_TOKEN not set. API requests may be rate limited.');
    }

    // Fetch the repository information from GitHub API
    const response = await fetch(GITHUB_REPO_API_URL, { headers });

    // If the response is not successful, throw an error
    if (!response.ok) {
      throw new Error(`GitHub API responded with status: ${response.status} - ${response.statusText}`);
    }

    // Parse the response data
    const repoData = await response.json();
    const starCount = repoData.stargazers_count;

    console.log(`Fetched ${starCount} GitHub stars`);

    // Create the data object
    const githubData = {
      stargazers_count: starCount,
      fetched_at: new Date().toISOString(),
      repo: 'langfuse/langfuse'
    };

    // Ensure the directory exists
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write the data to the file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(githubData, null, 2));
    
    console.log(`GitHub stars data saved to ${OUTPUT_FILE}`);
    console.log('Build can continue...');

  } catch (error) {
    console.error('Failed to fetch GitHub stars:', error.message);
    
    // Fail the build if we can't fetch the star count
    process.exit(1);
  }
}

// Run the script
fetchGitHubStars();