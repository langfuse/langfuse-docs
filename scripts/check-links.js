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

function extractHrefLinks(content) {
    // Extract href attributes from JSX components
    const hrefRegex = /href=["']([^"']+)["']/g;
    const links = [];
    let match;
    
    while ((match = hrefRegex.exec(content)) !== null) {
        const href = match[1];
        // Only include internal links (starting with /)
        if (href.startsWith('/')) {
            links.push(href);
        }
    }
    
    return links;
}

async function checkHrefLinks(links, filePath) {
    if (links.length === 0) {
        return false;
    }
    
    // Create a fake markdown content with just the href links to reuse existing functionality
    const fakeMarkdown = links.map(link => `[link](${link})`).join('\n');
    
    const results = await markdownLinkCheckAsync(fakeMarkdown, config);
    
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
            console.error(`[${result.statusCode}] Dead href link in ${relativePath}: ${result.link}`);
            if (result.err) {
                console.error(`  Error: ${result.err}`);
            }
        }
    });
    
    return hasErrors;
}

async function checkFile(filePath) {
    try {
        const content = await readFileAsync(filePath, 'utf8');

        // Check markdown links using the existing library
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

        // Check href links in JSX components (for .mdx files)
        if (filePath.endsWith('.mdx')) {
            const hrefLinks = extractHrefLinks(content);
            if (hrefLinks.length > 0) {
                const hrefErrors = await checkHrefLinks(hrefLinks, filePath);
                hasErrors = hasErrors || hrefErrors;
            }
        }

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