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
    // File processing concurrency - much higher for local dev server
    maxFileConcurrency: 50,        // Number of files to process simultaneously
    fileBatchDelay: 0,             // Delay between file batches (ms) - no delay needed locally

    // Link checking concurrency - much higher for local dev server
    maxLinkConcurrency: 100,       // Number of links to check simultaneously per file
    linkBatchDelay: 0,             // Delay between link batches (ms) - no delay needed locally

    // Link checking timeouts - much lower for local requests
    linkTimeout: 2000,             // Timeout for individual link checks (ms) - 2s is plenty for local

    // Progress reporting
    progressInterval: 20,          // Report progress every N files
    debugLogging: false,           // Enable/disable per-file processing logs
};

// Optimized link checker for local dev server
async function checkLink(url, timeout = CONFIG.linkTimeout) {
    // For localhost, HEAD requests usually work fine, but if they fail, fallback to GET
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
                    'User-Agent': 'link-checker',
                    'Connection': 'keep-alive' // Reuse connections for better performance
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

// Extract markdown links: [text](url)
function extractMarkdownLinks(content) {
    const links = [];

    // Standard markdown links: [text](url)
    const markdownRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
    let match;

    while ((match = markdownRegex.exec(content)) !== null) {
        const url = match[2].trim();
        if (url && !url.startsWith('#')) { // Skip anchors
            links.push(url);
        }
    }

    return links;
}

// Extract href links from HTML/JSX attributes
function extractHrefLinks(content) {
    const links = [];

    // Match various href patterns:
    // href="url", href='url', href={`url`}, href={"url"}
    const patterns = [
        // Standard href with quotes
        /href=["']([^"']+)["']/g,
        // Template literals in JSX: href={`/path`}
        /href=\{`([^`]+)`\}/g,
        // String literals in JSX: href={"/path"}
        /href=\{"([^"]+)"\}/g,
        /href=\{'([^']+)'\}/g,
        // Without braces but with template literals (less common)
        /href=`([^`]+)`/g
    ];

    for (const regex of patterns) {
        let match;
        regex.lastIndex = 0; // Reset regex state
        while ((match = regex.exec(content)) !== null) {
            const href = match[1].trim();
            if (href && !href.startsWith('#') && !href.includes('${')) {
                links.push(href);
            }
        }
    }

    return links;
}

// Extract Next.js Link component hrefs
function extractNextJsLinks(content) {
    const links = [];

    // Match Next.js Link components: <Link href="...">
    const patterns = [
        // <Link href="/path">
        /<Link\s+href=["']([^"']+)["'][^>]*>/g,
        // <Link href={"/path"}>
        /<Link\s+href=\{"([^"]+)"\}[^>]*>/g,
        /<Link\s+href=\{'([^']+)'\}[^>]*>/g,
        // <Link href={`/path`}>
        /<Link\s+href=\{`([^`]+)`\}[^>]*>/g
    ];

    for (const regex of patterns) {
        let match;
        regex.lastIndex = 0; // Reset regex state
        while ((match = regex.exec(content)) !== null) {
            const href = match[1].trim();
            if (href && !href.startsWith('#') && !href.includes('${')) {
                links.push(href);
            }
        }
    }

    return links;
}

// Extract all types of links from content
function extractAllLinks(content, filePath) {
    let allLinks = [];

    // Always extract markdown links (works in .md, .mdx, and even in JSX comments)
    allLinks = allLinks.concat(extractMarkdownLinks(content));

    // Extract href attributes for HTML/JSX files
    if (filePath.endsWith('.mdx') || filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        allLinks = allLinks.concat(extractHrefLinks(content));
        allLinks = allLinks.concat(extractNextJsLinks(content));
    }

    return allLinks;
}

// Process and normalize links
function processLinks(links) {
    const processedLinks = [];

    for (const link of links) {
        // Skip empty or invalid links
        if (!link || typeof link !== 'string') {
            continue;
        }

        const trimmedLink = link.trim();
        if (!trimmedLink) {
            continue;
        }

        // Skip template literals, variables, and dynamic content
        if (trimmedLink.includes('${') ||
            trimmedLink.includes('{{') ||
            trimmedLink.includes('}}') ||
            trimmedLink.includes('{') ||
            trimmedLink.includes('}') ||
            trimmedLink.includes('[') ||
            trimmedLink.includes(']') ||
            trimmedLink.includes('<%') ||
            trimmedLink.includes('%>')) {
            continue;
        }

        // Skip obvious non-URL patterns
        if (trimmedLink.match(/^[a-zA-Z0-9_-]+$/) || // Just a word/identifier
            trimmedLink.startsWith('javascript:') ||
            trimmedLink.startsWith('mailto:') ||
            trimmedLink.startsWith('tel:') ||
            trimmedLink.startsWith('data:') ||
            trimmedLink.startsWith('blob:') ||
            trimmedLink.startsWith('file:')) {
            continue;
        }

        // Skip specific paths that redirect to external sites
        if (trimmedLink === '/ph') {
            continue;
        }

        let processedLink = trimmedLink;

        // Convert relative paths to localhost URLs
        if (trimmedLink.startsWith('/')) {
            processedLink = `http://localhost:3333${trimmedLink}`;
        } else if (trimmedLink.startsWith('https://langfuse.com')) {
            processedLink = trimmedLink.replace('https://langfuse.com', 'http://localhost:3333');
        } else if (trimmedLink.startsWith('http://langfuse.com')) {
            processedLink = trimmedLink.replace('http://langfuse.com', 'http://localhost:3333');
        } else if (!trimmedLink.startsWith('http://') && !trimmedLink.startsWith('https://')) {
            // Skip non-HTTP links that aren't relative paths
            continue;
        } else if (!trimmedLink.includes('localhost:3333') && !trimmedLink.includes('langfuse.com')) {
            // Skip external links (not langfuse.com or localhost)
            continue;
        }

        // Final validation - make sure it's a valid URL format
        try {
            new URL(processedLink);
            processedLinks.push(processedLink);
        } catch (error) {
            // Skip invalid URLs
            continue;
        }
    }

    return [...new Set(processedLinks)]; // Remove duplicates
}

async function checkFileLinks(filePath) {
    try {
        const content = await readFileAsync(filePath, 'utf8');

        // Extract all types of links using the unified function
        const allLinks = extractAllLinks(content, filePath);
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

            // Skip delay for local dev server (CONFIG.linkBatchDelay = 0)
            if (CONFIG.linkBatchDelay > 0 && i + maxConcurrent < processedLinks.length) {
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
                } else if (file.endsWith('.md') || file.endsWith('.mdx') || file.endsWith('.tsx') || file.endsWith('.ts')) {
                    results.push(filePath);
                }
            }

            return results;
        };

        const files = findFiles(pagesDir);
        console.log(`Found ${files.length} files to check (.md, .mdx, .tsx, .ts)\n`);

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

            // Skip delay for local dev server (CONFIG.fileBatchDelay = 0)
            if (CONFIG.fileBatchDelay > 0 && i + maxConcurrent < files.length) {
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