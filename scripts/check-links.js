'use strict';

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const markdownLinkCheck = require('markdown-link-check');
const https = require('https');
const http = require('http');
const readFileAsync = promisify(fs.readFile);
const markdownLinkCheckAsync = promisify(markdownLinkCheck);

// Track redirects globally
const redirectedUrls = [];

/**
 * Custom HTTP client that tracks redirects
 */
function fetchUrlWithRedirectTracking(url, redirectChain = []) {
    return new Promise((resolve, reject) => {
        const isHttps = url.startsWith('https://');
        const client = isHttps ? https : http;

        const request = client.get(url, {
            timeout: 20000,
            headers: {
                'User-Agent': 'Langfuse-Link-Checker/1.0'
            }
        }, (response) => {
            // Handle redirects
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                const redirectUrl = response.headers.location;
                const resolvedUrl = redirectUrl.startsWith('http') ? redirectUrl : new URL(redirectUrl, url).href;

                const newRedirectChain = [...redirectChain, { from: url, to: resolvedUrl, statusCode: response.statusCode }];

                if (newRedirectChain.length > 10) {
                    reject(new Error(`Too many redirects for ${url}`));
                    return;
                }

                fetchUrlWithRedirectTracking(resolvedUrl, newRedirectChain).then(resolve).catch(reject);
                return;
            }

            let data = '';
            response.on('data', chunk => data += chunk);
            response.on('end', () => {
                resolve({
                    statusCode: response.statusCode,
                    finalUrl: url,
                    redirectChain: redirectChain
                });
            });
        });

        request.on('error', reject);
        request.on('timeout', () => {
            request.destroy();
            reject(new Error(`Request timeout for ${url}`));
        });
    });
}

// Configuration for the link checker
const config = {
    // Custom HTTP client that tracks redirects
    httpCustom: async (url, opts, callback) => {
        try {
            const result = await fetchUrlWithRedirectTracking(url);

            // Track redirects for final reporting
            if (result.redirectChain.length > 0) {
                redirectedUrls.push({
                    originalUrl: url,
                    finalUrl: result.finalUrl,
                    redirectChain: result.redirectChain
                });
            }

            // Only fail for 4xx status codes
            const isError = result.statusCode >= 400 && result.statusCode < 500;

            callback(null, {
                statusCode: result.statusCode,
                status: isError ? 'dead' : 'alive'
            });
        } catch (error) {
            callback(null, {
                statusCode: null,
                status: 'dead',
                err: error.message
            });
        }
    },
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
        // Include internal links (starting with / or https://langfuse.com)
        if (href.startsWith('/')) {
            links.push(href);
        } else if (href.startsWith('https://langfuse.com')) {
            // Extract the relative path from langfuse.com URLs
            const relativePath = href.replace('https://langfuse.com', '') || '/';
            links.push(relativePath);
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

        let hasErrors = false;

        // Check markdown links using the existing library (only for .md and .mdx files)
        if (filePath.endsWith('.md') || filePath.endsWith('.mdx')) {
            const results = await markdownLinkCheckAsync(content, config);

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
        }

        // Check href links in JSX components (for .mdx and .tsx files)
        if (filePath.endsWith('.mdx') || filePath.endsWith('.tsx')) {
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
        // Recursively find all .md, .mdx, and .tsx files
        const findFiles = (dir) => {
            let results = [];
            const files = fs.readdirSync(dir);

            for (const file of files) {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);

                if (stat.isDirectory()) {
                    results = results.concat(findFiles(filePath));
                } else if (file.endsWith('.md') || file.endsWith('.mdx') || file.endsWith('.tsx')) {
                    results.push(filePath);
                }
            }

            return results;
        };

        const files = findFiles(pagesDir);
        console.log(`Found ${files.length} files to check (.md, .mdx, .tsx)\n`);

        // Process files in parallel with a limit of 10 concurrent checks
        const batchSize = 10;
        for (let i = 0; i < files.length; i += batchSize) {
            const batch = files.slice(i, i + batchSize);
            const results = await Promise.all(batch.map(file => checkFile(file)));
            hasErrors = hasErrors || results.some(result => result);
        }

        // Report redirects
        if (redirectedUrls.length > 0) {
            console.log(`\n=== Redirected URLs (${redirectedUrls.length}) ===`);
            redirectedUrls.forEach(redirect => {
                console.log(`🔄 ${redirect.originalUrl}`);
                redirect.redirectChain.forEach((step, index) => {
                    console.log(`   ${index + 1}. [${step.statusCode}] ${step.from} → ${step.to}`);
                });
                console.log(`   Final: ${redirect.finalUrl}`);
                console.log('');
            });
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