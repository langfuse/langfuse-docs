'use strict';

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const markdownLinkCheck = require('markdown-link-check');
const readFileAsync = promisify(fs.readFile);
const markdownLinkCheckAsync = promisify(markdownLinkCheck);

// Configuration for the link checker
const config = {
    // Show progress bar
    // showProgressBar: true,
    // Replace patterns for internal and langfuse.com links
    replacementPatterns: [
        {
            pattern: '^/',
            replacement: 'http://localhost:3333/'
        },
        {
            pattern: '^https://langfuse.com',
            replacement: 'http://localhost:3333'
        },
    ],
    // Ignore patterns for external links and anchors
    ignorePatterns: [
        {
            pattern: '^https?://(?!localhost:3333|langfuse\\.com)'
        },
        {
            pattern: '^#'
        },
        // Ignore template literals and variables
        {
            pattern: '\\{\\{.*\\}\\}'
        },
        {
            pattern: '\\${.*}'
        },
        // Ignore obviously invalid URLs
        {
            pattern: '[{}\\[\\]]'
        }
    ],
    timeout: '20s',
    retryOn429: true,
    retryCount: 5,
    fallbackRetryDelay: '30s'
};

async function checkFile(filePath) {
    try {
        const content = await readFileAsync(filePath, 'utf8');

        const results = await markdownLinkCheckAsync(content, config);

        let hasErrors = false;
        results.forEach(result => {
            if (result.status === 'dead') {
                // Skip reporting errors for obviously invalid URLs
                if (result.link.includes('{') || result.link.includes('}') ||
                    result.link.includes('${') || result.link.includes('}}')) {
                    return;
                }
                hasErrors = true;
                const relativePath = path.relative(process.cwd(), filePath);
                console.error(`[${result.statusCode}] Dead link in ${relativePath}: ${result.link}`);
                if (result.err) {
                    console.error(`  Error: ${result.err}`);
                }
            }
        });

        return hasErrors;
    } catch (error) {
        if (error.code === 'ERR_INVALID_URL') {
            // Log invalid URL errors but don't fail the check
            const relativePath = path.relative(process.cwd(), filePath);
            console.warn(`Warning: Invalid URL in ${relativePath}: ${error.input}`);
            return false;
        }
        console.error(`Error processing ${filePath}:`, error);
        return true;
    }
}

async function main() {
    const pagesDir = path.join(process.cwd(), 'pages');
    let hasErrors = false;

    try {
        // Recursively find all .md and .mdx files
        const findFiles = (dir) => {
            let results = [];
            const files = fs.readdirSync(dir);

            for (const file of files) {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);

                if (stat.isDirectory()) {
                    results = results.concat(findFiles(filePath));
                } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
                    results.push(filePath);
                }
            }

            return results;
        };

        const files = findFiles(pagesDir);
        console.log(`Found ${files.length} markdown files to check\n`);

        // Process files in parallel with a limit of 10 concurrent checks
        const batchSize = 10;
        for (let i = 0; i < files.length; i += batchSize) {
            const batch = files.slice(i, i + batchSize);
            const results = await Promise.all(batch.map(file => checkFile(file)));
            hasErrors = hasErrors || results.some(result => result);
        }

        if (hasErrors) {
            console.error('\nLink check failed: Some links are dead or invalid');
            process.exit(1);
        } else {
            console.log('\nLink check passed: All valid links are working');
        }
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

main(); 