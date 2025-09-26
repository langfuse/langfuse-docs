'use strict';

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const https = require('https');
const http = require('http');
const { URL } = require('url');

const readFileAsync = promisify(fs.readFile);

// Configuration options
const CONFIG = {
    // File processing concurrency
    maxFileConcurrency: 20,        // Number of files to process simultaneously
    fileBatchDelay: 10,            // Delay between file batches (ms)

    // Link checking concurrency  
    maxLinkConcurrency: 20,        // Number of links to check simultaneously per file
    linkBatchDelay: 10,            // Delay between link batches (ms)

    // Link checking timeouts
    linkTimeout: 10000,            // Timeout for individual link checks (ms)

    // Progress reporting
    progressInterval: 10,          // Report progress every N files
    debugLogging: false,           // Enable/disable per-file processing logs
};

// Simple, robust link checker with GET fallback
async function checkLink(url, timeout = CONFIG.linkTimeout) {
    // Try HEAD request first
    const headResult = await makeRequest(url, 'HEAD', timeout);

    // If HEAD fails with method-related errors, try GET
    if (headResult.statusCode === 405 || // Method Not Allowed
        headResult.statusCode === 501 || // Not Implemented
        headResult.statusCode === 400 || // Bad Request (some servers reject HEAD)
        (headResult.statusCode === 0 && headResult.error && headResult.error.includes('ECONNRESET'))) {

        return await makeRequest(url, 'GET', timeout);
    }

    return headResult;
}

// Make HTTP request with specified method
async function makeRequest(url, method, timeout) {
    return new Promise((resolve) => {
        try {
            const urlObj = new URL(url);
            const isHttps = urlObj.protocol === 'https:';
            const client = isHttps ? https : http;

            const options = {
                hostname: urlObj.hostname,
                port: urlObj.port || (isHttps ? 443 : 80),
                path: urlObj.pathname + urlObj.search,
                method: method,
                timeout: timeout,
                headers: {
                    'User-Agent': 'link-checker'
                }
            };

            const req = client.request(options, (res) => {
                // Consider 2xx and 3xx as successful
                const success = res.statusCode >= 200 && res.statusCode < 400;

                // For GET requests, we should consume the response to avoid hanging connections
                if (method === 'GET') {
                    res.resume(); // Consume response data
                }

                resolve({
                    url: url,
                    status: success ? 'alive' : 'dead',
                    statusCode: res.statusCode,
                    method: method
                });
            });

            req.on('error', (err) => {
                resolve({
                    url: url,
                    status: 'dead',
                    statusCode: 0,
                    error: err.message,
                    method: method
                });
            });

            req.on('timeout', () => {
                req.destroy();
                resolve({
                    url: url,
                    status: 'dead',
                    statusCode: 0,
                    error: 'Timeout',
                    method: method
                });
            });

            req.end();
        } catch (error) {
            resolve({
                url: url,
                status: 'dead',
                statusCode: 0,
                error: error.message,
                method: method
            });
        }
    });
}

// Extract markdown links
function extractMarkdownLinks(content) {
    const linkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
    const links = [];
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
        const url = match[2].trim();
        if (url && !url.startsWith('#')) { // Skip anchors
            links.push(url);
        }
    }

    return links;
}

// Extract href links from JSX
function extractHrefLinks(content) {
    const hrefRegex = /href=["']([^"']+)["']/g;
    const links = [];
    let match;

    while ((match = hrefRegex.exec(content)) !== null) {
        const href = match[1];
        if (href.startsWith('/')) {
            links.push(href);
        } else if (href.startsWith('https://langfuse.com')) {
            const relativePath = href.replace('https://langfuse.com', '') || '/';
            links.push(relativePath);
        }
    }

    return links;
}

// Process and normalize links
function processLinks(links) {
    const processedLinks = [];

    for (const link of links) {
        // Skip template literals and variables
        if (link.includes('${') || link.includes('{{') || link.includes('}}') ||
            link.includes('{') || link.includes('}') || link.includes('[') || link.includes(']')) {
            continue;
        }

        // Skip specific paths that redirect to external sites
        if (link === '/ph') {
            continue;
        }

        let processedLink = link;

        // Convert relative paths to localhost URLs
        if (link.startsWith('/')) {
            processedLink = `http://localhost:3333${link}`;
        } else if (link.startsWith('https://langfuse.com')) {
            processedLink = link.replace('https://langfuse.com', 'http://localhost:3333');
        } else if (!link.startsWith('http://') && !link.startsWith('https://')) {
            // Skip non-HTTP links (like mailto:, etc.)
            continue;
        } else if (!link.includes('localhost:3333') && !link.includes('langfuse.com')) {
            // Skip external links
            continue;
        }

        processedLinks.push(processedLink);
    }

    return [...new Set(processedLinks)]; // Remove duplicates
}

async function checkFileLinks(filePath) {
    try {
        const content = await readFileAsync(filePath, 'utf8');
        let allLinks = [];

        // Extract markdown links (for .md and .mdx files)
        if (filePath.endsWith('.md') || filePath.endsWith('.mdx')) {
            const markdownLinks = extractMarkdownLinks(content);
            allLinks = allLinks.concat(markdownLinks);
        }

        // Extract href links (for .mdx and .tsx files)
        if (filePath.endsWith('.mdx') || filePath.endsWith('.tsx')) {
            const hrefLinks = extractHrefLinks(content);
            allLinks = allLinks.concat(hrefLinks);
        }

        const processedLinks = processLinks(allLinks);

        if (processedLinks.length === 0) {
            return { hasErrors: false, results: [] };
        }

        // Check all links with configured concurrency
        const results = [];
        const maxConcurrent = CONFIG.maxLinkConcurrency;

        for (let i = 0; i < processedLinks.length; i += maxConcurrent) {
            const batch = processedLinks.slice(i, i + maxConcurrent);
            const batchResults = await Promise.all(
                batch.map(link => checkLink(link))
            );
            results.push(...batchResults);

            // Configured delay between batches
            if (i + maxConcurrent < processedLinks.length) {
                await new Promise(resolve => setTimeout(resolve, CONFIG.linkBatchDelay));
            }
        }

        const hasErrors = results.some(result => result.status === 'dead');

        // Don't print errors here - they will be collected and reported at the end
        return { hasErrors, results };
    } catch (error) {
        const relativePath = path.relative(process.cwd(), filePath);
        console.warn(`Warning: Error processing ${relativePath}: ${error.message}`);
        return { hasErrors: false, results: [] };
    }
}

async function main() {
    const pagesDir = path.join(process.cwd(), 'pages');
    let hasErrors = false;
    const allBrokenLinks = []; // Collect all broken links for final report

    try {
        // Find all files to check
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

        // Process files with configured concurrency
        const maxConcurrent = CONFIG.maxFileConcurrency;
        let completed = 0;

        for (let i = 0; i < files.length; i += maxConcurrent) {
            const batch = files.slice(i, i + maxConcurrent);

            const batchPromises = batch.map(async (file) => {
                if (CONFIG.debugLogging) {
                    console.log(`Processing ${file}`);
                }
                try {
                    const result = await checkFileLinks(file);
                    if (result.hasErrors && result.results) {
                        // Collect broken links for final report
                        const relativePath = path.relative(process.cwd(), file);
                        const brokenLinks = result.results.filter(r => r.status === 'dead');
                        brokenLinks.forEach(link => {
                            allBrokenLinks.push({
                                file: relativePath,
                                url: link.url,
                                statusCode: link.statusCode,
                                error: link.error,
                                method: link.method
                            });
                        });
                    }
                    return result.hasErrors;
                } catch (error) {
                    console.warn(`Warning: Error processing ${file}: ${error.message}`);
                    return false;
                }
            });

            const batchResults = await Promise.all(batchPromises);
            hasErrors = hasErrors || batchResults.some(result => result);

            completed += batch.length;
            if (completed % CONFIG.progressInterval === 0 || completed === files.length) {
                console.log(`Processed ${completed}/${files.length} files`);
            }

            // Configured delay between batches
            if (i + maxConcurrent < files.length) {
                await new Promise(resolve => setTimeout(resolve, CONFIG.fileBatchDelay));
            }
        }

        if (hasErrors) {
            console.error('\n=== LINK CHECK FAILED ===');
            console.error(`Found ${allBrokenLinks.length} broken link(s):\n`);

            // Group broken links by file for better readability
            const linksByFile = {};
            allBrokenLinks.forEach(link => {
                if (!linksByFile[link.file]) {
                    linksByFile[link.file] = [];
                }
                linksByFile[link.file].push(link);
            });

            // Report broken links grouped by file
            Object.keys(linksByFile).forEach(file => {
                console.error(`📄 ${file}:`);
                linksByFile[file].forEach(link => {
                    const methodInfo = link.method ? ` (${link.method})` : '';
                    console.error(`  ❌ [${link.statusCode}] ${link.url}${methodInfo}`);
                    if (link.error) {
                        console.error(`     Error: ${link.error}`);
                    }
                });
                console.error('');
            });

            process.exit(1);
        } else {
            console.log('\n✅ Link check passed: All valid links are working');
        }
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

main(); 