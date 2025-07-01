#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const PATHS = {
    authors: path.join(__dirname, '../../data/authors.json'),
    contributors: path.join(__dirname, '../../data/generated/contributors.json'),
    docs: path.join(__dirname, '../../pages/docs')
};

const GITHUB_CONFIG = {
    repo: 'langfuse/langfuse-docs',
    apiBase: 'https://api.github.com',
    batchSize: 10,
    batchDelay: 100
};

// Single cache for all GitHub API responses
const cache = new Map();
// Cache for email to GitHub username mapping
const emailToUsernameCache = new Map();

// GitHub API helper
async function fetchFromGitHub(endpoint) {
    if (cache.has(endpoint)) return cache.get(endpoint);

    const headers = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'langfuse-docs-contributor-generator'
    };

    if (process.env.GITHUB_ACCESS_TOKEN) {
        headers['Authorization'] = `token ${process.env.GITHUB_ACCESS_TOKEN}`;
    }

    try {
        const response = await fetch(`${GITHUB_CONFIG.apiBase}${endpoint}`, { headers });

        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error(`GitHub API: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        cache.set(endpoint, data);
        return data;
    } catch (error) {
        console.warn(`GitHub API failed for ${endpoint}:`, error.message);
        return null;
    }
}

// Contributor resolution helpers
const extractGitHubUsernameFromEmail = (email) => {
    const match = email.match(/^\d+\+([^@]+)@users\.noreply\.github\.com$/);
    return match ? match[1] : null;
};

const resolveContributor = async (email, commitSha) => {
    // Try GitHub noreply email pattern first (fast)
    const usernameFromEmail = extractGitHubUsernameFromEmail(email);
    if (usernameFromEmail) {
        return usernameFromEmail;
    }

    // Check if we have cached the GitHub username for this email
    if (emailToUsernameCache.has(email)) {
        const cachedUsername = emailToUsernameCache.get(email);
        if (cachedUsername) {
            return cachedUsername;
        }
    }

    // Use GitHub API to get the actual GitHub username
    const commitData = await fetchFromGitHub(`/repos/${GITHUB_CONFIG.repo}/commits/${commitSha}`);
    const githubUsername = commitData?.author?.login || null;

    // Cache the result for this email
    emailToUsernameCache.set(email, githubUsername);

    if (githubUsername) return githubUsername;

    return null;
};

// Batch processing helper
async function processBatch(items, processor) {
    const results = [];
    for (let i = 0; i < items.length; i += GITHUB_CONFIG.batchSize) {
        const batch = items.slice(i, i + GITHUB_CONFIG.batchSize);
        const batchResults = await Promise.all(batch.map(processor));
        results.push(...batchResults.filter(Boolean));

        if (i + GITHUB_CONFIG.batchSize < items.length) {
            await new Promise(resolve => setTimeout(resolve, GITHUB_CONFIG.batchDelay));
        }
    }
    return results;
}

// Main contributor analysis
async function analyzeContributors() {
    console.log('🔍 Analyzing contributors...');
    const startTime = Date.now();

    const authors = JSON.parse(fs.readFileSync(PATHS.authors, 'utf8'));

    // Get git history
    const gitOutput = execSync(
        `git log --pretty=format:"%H|%ae|%ad" --date=iso --no-merges --name-only -- pages/docs/`,
        { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }
    );

    if (!gitOutput.trim()) return {};

    // Parse git output
    const commits = [];
    const emailsNeedingAPI = new Set();
    let currentCommit = null;

    for (const line of gitOutput.trim().split('\n')) {
        if (line.includes('|')) {
            const [hash, email, dateStr] = line.split('|');
            currentCommit = { hash: hash.trim(), email: email.trim(), date: new Date(dateStr.trim()) };

            // Check if we need GitHub API for this email
            const usernameFromEmail = extractGitHubUsernameFromEmail(currentCommit.email);

            if (!usernameFromEmail && !emailToUsernameCache.has(currentCommit.email)) {
                emailsNeedingAPI.add(currentCommit.email);
            }
        } else if (line.trim() && currentCommit && line.startsWith('pages/docs/') && !line.includes('_meta.')) {
            commits.push({
                ...currentCommit,
                filePath: line.trim()
            });
        }
    }

    console.log(`📊 Processing ${commits.length} file-commit pairs from ${new Set(commits.map(c => c.hash)).size} commits`);

    // Batch fetch GitHub data for unique emails that need it
    if (emailsNeedingAPI.size > 0) {
        console.log(`🚀 Fetching GitHub data for ${emailsNeedingAPI.size} unique emails...`);
        const fetchStart = Date.now();

        // Get a sample commit SHA for each email to make the API call
        const emailToCommitSha = new Map();
        for (const commit of commits) {
            if (emailsNeedingAPI.has(commit.email) && !emailToCommitSha.has(commit.email)) {
                emailToCommitSha.set(commit.email, commit.hash);
            }
        }

        await processBatch(Array.from(emailsNeedingAPI), async (email) => {
            const commitSha = emailToCommitSha.get(email);
            if (commitSha) {
                const commitData = await fetchFromGitHub(`/repos/${GITHUB_CONFIG.repo}/commits/${commitSha}`);
                const githubUsername = commitData?.author?.login || null;
                emailToUsernameCache.set(email, githubUsername);
            }
        });

        console.log(`✅ GitHub API completed in ${((Date.now() - fetchStart) / 1000).toFixed(2)}s`);
        console.log(`📦 Cached ${emailToUsernameCache.size} email-to-username mappings`);
    }

    // Process all commits
    const fileContributors = {};

    for (const commit of commits) {
        const urlPath = `/docs/${commit.filePath.replace('pages/docs/', '').replace(/\.(mdx?|tsx?)$/, '')}`;
        const contributor = await resolveContributor(commit.email, commit.hash, authors);

        if (contributor) {
            if (!fileContributors[urlPath]) fileContributors[urlPath] = {};

            // Keep most recent contribution date
            if (!fileContributors[urlPath][contributor] || commit.date > fileContributors[urlPath][contributor]) {
                fileContributors[urlPath][contributor] = commit.date;
            }
        }
    }

    // Convert to sorted arrays and filter current pages
    const currentPages = new Set();

    const findPages = (dir, basePath = '') => {
        const items = fs.readdirSync(dir, { withFileTypes: true });
        for (const item of items) {
            if (item.isDirectory() && !item.name.startsWith('.')) {
                findPages(path.join(dir, item.name), path.join(basePath, item.name));
            } else if (item.isFile() && /\.(mdx?|md)$/.test(item.name) && !item.name.includes('_meta.')) {
                const urlPath = `/docs/${path.join(basePath, item.name).replace(/\.(mdx?|md)$/, '').replace(/\\/g, '/')}`;
                currentPages.add(urlPath);
            }
        }
    };

    findPages(PATHS.docs);

    const result = {};
    for (const [urlPath, contributorDates] of Object.entries(fileContributors)) {
        if (currentPages.has(urlPath)) {
            result[urlPath] = Object.keys(contributorDates)
                .sort((a, b) => contributorDates[b] - contributorDates[a]);
        }
    }

    console.log(`🔍 Generated ${Object.keys(result).length} pages with ${[...new Set(Object.values(result).flat())].length} unique contributors`);
    console.log(`⚡ Completed in ${((Date.now() - startTime) / 1000).toFixed(2)}s`);

    return result;
}

// Main execution
async function main() {
    try {
        const contributors = await analyzeContributors();

        // Sort and write output
        const sorted = Object.keys(contributors)
            .sort()
            .reduce((acc, key) => ({ ...acc, [key]: contributors[key] }), {});

        fs.writeFileSync(PATHS.contributors, JSON.stringify(sorted, null, 2));
        console.log('✅ Generated contributors.json');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { analyzeContributors }; 