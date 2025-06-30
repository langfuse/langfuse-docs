#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const authorsPath = path.join(__dirname, '../components/Authors.tsx');
const contributorsPath = path.join(__dirname, '../data/contributors.json');
const docsPath = path.join(__dirname, '../pages/docs');

// Helper function to read and parse the current authors file
function getCurrentAuthors() {
    const authorsContent = fs.readFileSync(authorsPath, 'utf8');
    const allAuthorsMatch = authorsContent.match(/export const allAuthors = ({[\s\S]*?}) as const;/);

    if (!allAuthorsMatch) {
        throw new Error('Could not find allAuthors object in Authors.tsx');
    }

    const allAuthorsString = allAuthorsMatch[1];
    return eval(`(${allAuthorsString})`);
}

// Function to find author by email
function findAuthorByEmail(email, allAuthors) {
    for (const [authorKey, authorData] of Object.entries(allAuthors)) {
        if (authorData.githubEmail === email) {
            return authorKey;
        }

        if (authorData.githubEmailAlt && Array.isArray(authorData.githubEmailAlt)) {
            if (authorData.githubEmailAlt.includes(email)) {
                return authorKey;
            }
        }
    }
    return null;
}

// Get all contributors for all files in a single git command
function getAllFileContributors(allAuthors) {
    try {
        console.log('🔍 Running single git log command for all files...');
        const gitCommand = `git log --pretty=format:"%H|%ae|%ad" --date=iso --no-merges --name-only -- pages/docs/`;
        const output = execSync(gitCommand, {
            encoding: 'utf8',
            stdio: ['pipe', 'pipe', 'ignore']
        });

        if (!output.trim()) {
            return {};
        }

        const lines = output.trim().split('\n');
        const fileContributors = {};

        let currentCommit = null;

        for (const line of lines) {
            if (line.includes('|')) {
                // This is a commit line: hash|email|date
                const [hash, email, dateStr] = line.split('|');
                currentCommit = {
                    hash: hash.trim(),
                    email: email.trim(),
                    date: new Date(dateStr.trim())
                };
            } else if (line.trim() && currentCommit && line.startsWith('pages/docs/')) {
                // This is a file path
                const filePath = line.trim();

                // Convert to URL path format
                const urlPath = `/docs/${filePath.replace('pages/docs/', '').replace(/\.(mdx?|tsx?)$/, '')}`;

                // Skip meta files
                if (filePath.includes('_meta.')) {
                    continue;
                }

                const authorKey = findAuthorByEmail(currentCommit.email, allAuthors);
                if (authorKey) {
                    if (!fileContributors[urlPath]) {
                        fileContributors[urlPath] = {};
                    }

                    // Track the most recent commit date for each author per file
                    if (!fileContributors[urlPath][authorKey] || currentCommit.date > fileContributors[urlPath][authorKey]) {
                        fileContributors[urlPath][authorKey] = currentCommit.date;
                    }
                }
            }
        }

        // Convert to sorted contributor arrays
        const result = {};
        for (const [urlPath, authorDates] of Object.entries(fileContributors)) {
            // Sort authors by most recent contribution (descending)
            result[urlPath] = Object.keys(authorDates)
                .sort((a, b) => authorDates[b] - authorDates[a]);
        }

        return result;
    } catch (error) {
        console.error('Error getting all contributors:', error.message);
        return {};
    }
}

// Recursively find all .mdx and .md files in docs directory
function findDocFiles(dir, basePath = '') {
    const files = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const relativePath = path.join(basePath, item);

        if (fs.statSync(fullPath).isDirectory()) {
            // Skip certain directories
            if (item.startsWith('.') || item === 'node_modules') {
                continue;
            }
            files.push(...findDocFiles(fullPath, relativePath));
        } else if (item.endsWith('.mdx') || item.endsWith('.md')) {
            // Skip meta files
            if (item === '_meta.tsx' || item === '_meta.ts') {
                continue;
            }
            files.push({
                filePath: fullPath,
                relativePath: relativePath,
                urlPath: relativePath.replace(/\.(mdx?|tsx?)$/, '').replace(/\\/g, '/')
            });
        }
    }

    return files;
}

// Main function to generate contributors.json
function generateContributors() {
    console.log('🔍 Generating contributors.json...');
    const startTime = Date.now();

    const allAuthors = getCurrentAuthors();

    // Get current documentation files to filter against
    const docFiles = findDocFiles(docsPath);
    const validUrlPaths = new Set(docFiles.map(file => `/docs/${file.urlPath}`));

    console.log(`📁 Found ${docFiles.length} current documentation files`);

    // Get all contributors in a single git command (much faster!)
    const allContributors = getAllFileContributors(allAuthors);

    // Filter to only include pages that currently exist
    const contributors = {};
    for (const [urlPath, fileContributors] of Object.entries(allContributors)) {
        if (validUrlPaths.has(urlPath)) {
            contributors[urlPath] = fileContributors;
        }
    }

    console.log(`🔍 Filtered ${Object.keys(allContributors).length} historical pages to ${Object.keys(contributors).length} current pages`);

    // Log the results
    for (const [urlPath, fileContributors] of Object.entries(contributors)) {
        console.log(`   ${urlPath}: ${fileContributors.join(', ')}`);
    }

    // Sort contributors by path for stable git output
    const sortedContributors = Object.keys(contributors)
        .sort()
        .reduce((sorted, key) => {
            sorted[key] = contributors[key];
            return sorted;
        }, {});

    // Write contributors.json
    fs.writeFileSync(contributorsPath, JSON.stringify(sortedContributors, null, 2));

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    console.log(`✅ Generated contributors.json with ${Object.keys(contributors).length} pages`);
    console.log(`📊 Total unique contributors: ${[...new Set(Object.values(contributors).flat())].length}`);
    console.log(`⚡ Completed in ${duration.toFixed(2)}s`);
}

// CLI interface
if (require.main === module) {
    generateContributors();
}

module.exports = { generateContributors }; 