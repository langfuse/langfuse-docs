export interface GitHubStarsData {
  stargazers_count: number;
  fetched_at: string;
  repo: string;
}

/**
 * Get GitHub stars count from the static data file generated at build time
 * @returns The star count as a number
 */
export function getGitHubStars(): number {
  try {
    // Dynamic import to handle cases where the file might not exist during development
    const githubStarsData = require('../src/github-stars.json');
    return githubStarsData.stargazers_count;
  } catch (error) {
    // Fallback for development when the file doesn't exist yet
    console.warn('GitHub stars data file not found, using fallback value');
    return 12500; // Fallback value
  }
}

/**
 * Get full GitHub stars data from the static file
 * @returns The complete GitHub stars data object
 */
export function getGitHubStarsData(): GitHubStarsData {
  try {
    const githubStarsData = require('../src/github-stars.json');
    return githubStarsData as GitHubStarsData;
  } catch (error) {
    // Fallback for development
    console.warn('GitHub stars data file not found, using fallback data');
    return {
      stargazers_count: 12500,
      fetched_at: new Date().toISOString(),
      repo: 'langfuse/langfuse'
    };
  }
}