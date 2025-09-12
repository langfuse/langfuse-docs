#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const GITHUB_REPO_API_URL = "https://api.github.com/repos/langfuse/langfuse";
const STARS_FILE_PATH = path.join(__dirname, '..', 'src', 'github-stars.ts');

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second base delay
  maxDelay: 30000, // 30 seconds max delay
  backoffMultiplier: 2
};

// Sleep utility function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Retry wrapper with exponential backoff
async function withRetry(fn, description) {
  let lastError;

  for (let attempt = 1; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === RETRY_CONFIG.maxRetries) {
        console.error(`❌ ${description} failed after ${RETRY_CONFIG.maxRetries} attempts`);
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        RETRY_CONFIG.baseDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt - 1),
        RETRY_CONFIG.maxDelay
      );

      console.warn(`⚠️  ${description} failed (attempt ${attempt}/${RETRY_CONFIG.maxRetries}): ${error.message}`);
      console.warn(`🔄 Retrying in ${delay}ms...`);

      await sleep(delay);
    }
  }

  throw lastError;
}

async function updateGitHubStars() {
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

    const { starCount } = await withRetry(async () => {
      // Fetch repository information from GitHub API
      const response = await fetch(GITHUB_REPO_API_URL, { headers });

      if (!response.ok) {
        throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}`);
      }

      const repoData = await response.json();
      const starCount = repoData.stargazers_count;

      if (typeof starCount !== 'number') {
        throw new Error('Invalid star count received from GitHub API');
      }

      return { starCount };
    }, 'GitHub API fetch');

    console.log(`✅ Fetched ${starCount} GitHub stars`);

    // Update the TypeScript file
    const newContent = `export const GITHUB_STARS = ${starCount};`;

    fs.writeFileSync(STARS_FILE_PATH, newContent, 'utf8');
    console.log(`✅ Updated ${STARS_FILE_PATH} with ${starCount} stars`);

  } catch (error) {
    console.error('❌ Error updating GitHub stars:', error.message);
    process.exit(1); // Fail the build
  }
}

updateGitHubStars();