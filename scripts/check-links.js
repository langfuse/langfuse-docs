'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const { promisify } = require('util');
const markdownLinkCheck = require('markdown-link-check');
const readFileAsync = promisify(fs.readFile);
const markdownLinkCheckAsync = promisify(markdownLinkCheck);

const MAX_REDIRECTS = 5;
const REQUEST_TIMEOUT = 10000; // 10 seconds - consistent with sitemap checker
const LOCAL_SERVER_BASE = 'http://localhost:3333';

// Compiled regex patterns for better performance
const MARKDOWN_LINK_REGEX = /\[([^\]]*)\]\(([^)]+)\)/g;
const HREF_REGEX = /href=["']([^"']+)["']/g;

/**
 * Check if a URL contains template variables or invalid characters
 */
function isInvalidUrl(url) {
    return url.includes('{') || url.includes('}') ||
        url.includes('${') || url.includes('}}') ||
        url.includes('[') || url.includes(']');
}

/**
 * Log a link error with consistent formatting
 */
function logLinkError(filePath, link, statusCode, error) {
    const relativePath = path.relative(process.cwd(), filePath);
    if (statusCode) {
        console.error(`[${statusCode}] Dead link in ${relativePath}: ${link}`);
    } else {
        console.error(`[ERROR] Dead link in ${relativePath}: ${link}`);
    }
    if (error) {
        console.error(`  Error: ${error}`);
    }
}

// Compiled replacement patterns for better performance
const REPLACEMENT_PATTERNS = [
    {
        regex: /^\/(.*)$/,
        replacement: 'http://localhost:3333/$1'
    },
    {
        regex: /^https:\/\/langfuse\.com(.*)$/,
        replacement: 'http://localhost:3333$1'
    }
];

// Configuration for the link checker (for external links only)
const config = {
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
    timeout: '10s',
    retryOn429: true,
    retryCount: 5,
    fallbackRetryDelay: '30s'
};

/**
 * Check a single URL with custom redirect handling
 * @param {string} url - The URL to check
 * @param {number} redirectCount - Current redirect count (for recursion tracking)
 * @param {Array} redirectChain - Chain of redirects (for tracking)
 * @returns {Promise<Object>} Result object with success status and redirect info
 */
function checkUrlWithRedirects(url, redirectCount = 0, redirectChain = []) {
    return new Promise((resolve, reject) => {
        // Prevent infinite redirects
        if (redirectCount >= MAX_REDIRECTS) {
            reject(new Error(`Maximum redirects (${MAX_REDIRECTS}) exceeded for ${url}`));
            return;
        }

        const isHttps = url.startsWith('https://');
        const client = isHttps ? https : http;

        const request = client.get(url, {
            timeout: REQUEST_TIMEOUT,
            headers: {
                'User-Agent': 'Langfuse-Link-Checker/1.0'
            }
        }, (response) => {
            // Handle redirects
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                const redirectUrl = response.headers.location;
                // Resolve relative redirects
                const resolvedUrl = redirectUrl.startsWith('http') ? redirectUrl : new URL(redirectUrl, url).href;

                // Add to redirect chain
                const newChain = [...redirectChain, { from: url, to: resolvedUrl, status: response.statusCode }];

                checkUrlWithRedirects(resolvedUrl, redirectCount + 1, newChain).then(resolve).catch(reject);
                return;
            }

            // Create redirect info if we have a chain
            let redirectInfo = null;
            if (redirectChain.length > 0) {
                redirectInfo = {
                    originalUrl: redirectChain[0].from,
                    finalUrl: url,
                    chain: redirectChain,
                    finalStatus: response.statusCode
                };
            }

            // Consume response to prevent memory leaks
            response.resume();

            resolve({
                statusCode: response.statusCode,
                success: response.statusCode >= 200 && response.statusCode < 300,
                url: url,
                redirectChain: redirectChain,
                redirectInfo: redirectInfo
            });
        });

        request.on('error', (error) => {
            reject(error);
        });

        request.on('timeout', () => {
            request.destroy();
            reject(new Error(`Request timeout for ${url}`));
        });
    });
}

/**
 * Check if a URL is internal (localhost or langfuse.com)
 * @param {string} url - The URL to check
 * @returns {boolean} True if the URL is internal
 */
function isInternalUrl(url) {
    return url.startsWith('/') ||
        url.startsWith('http://localhost:3333') ||
        url.startsWith('https://langfuse.com');
}

/**
 * Apply replacement patterns to convert internal URLs to localhost
 */
function applyReplacements(url) {
    for (const pattern of REPLACEMENT_PATTERNS) {
        const match = url.match(pattern.regex);
        if (match) {
            return pattern.replacement;
        }
    }
    return url;
}

function extractHrefLinks(content) {
    // Extract href attributes from JSX components
    const links = [];
    let match;

    // Reset regex lastIndex to ensure consistent behavior
    HREF_REGEX.lastIndex = 0;

    while ((match = HREF_REGEX.exec(content)) !== null) {
        const href = match[1];

        // Skip invalid URLs
        if (isInvalidUrl(href)) {
            continue;
        }

        // Include internal links (starting with / or https://langfuse.com)
        if (isInternalUrl(href)) {
            if (href.startsWith('https://langfuse.com')) {
                // Extract the relative path from langfuse.com URLs
                const relativePath = href.replace('https://langfuse.com', '') || '/';
                links.push(relativePath);
            } else {
                links.push(href);
            }
        }
    }

    return links;
}

async function checkHrefLinks(links, filePath) {
    if (links.length === 0) {
        return { hasErrors: false, redirects: [] };
    }

    let hasErrors = false;
    const redirectsFound = [];

    // Check each link individually with custom redirect handling
    for (const link of links) {
        // Skip invalid URLs
        if (isInvalidUrl(link)) {
            continue;
        }

        try {
            const processedUrl = applyReplacements(link);
            const result = await checkUrlWithRedirects(processedUrl);

            if (result.redirectInfo) {
                redirectsFound.push(result.redirectInfo);
            }

            if (!result.success) {
                hasErrors = true;
                logLinkError(filePath, link, result.statusCode);
            }
        } catch (error) {
            hasErrors = true;
            logLinkError(filePath, link, null, error.message);
        }
    }

    return { hasErrors, redirects: redirectsFound };
}

async function checkFile(filePath) {
    try {
        const content = await readFileAsync(filePath, 'utf8');

        let hasErrors = false;
        const allRedirects = [];

        // Check markdown links using the existing library (only for .md and .mdx files)
        if (filePath.endsWith('.md') || filePath.endsWith('.mdx')) {
            // Extract internal links manually for custom checking
            const internalLinks = [];
            let match;

            // Reset regex lastIndex to ensure consistent behavior
            MARKDOWN_LINK_REGEX.lastIndex = 0;

            while ((match = MARKDOWN_LINK_REGEX.exec(content)) !== null) {
                const link = match[2];
                if (isInternalUrl(link) && !isInvalidUrl(link)) {
                    internalLinks.push(link);
                }
            }

            // Check internal links with custom redirect handling
            if (internalLinks.length > 0) {
                for (const link of internalLinks) {

                    try {
                        const processedUrl = applyReplacements(link);
                        const result = await checkUrlWithRedirects(processedUrl);

                        if (result.redirectInfo) {
                            allRedirects.push(result.redirectInfo);
                        }

                        if (!result.success) {
                            hasErrors = true;
                            logLinkError(filePath, link, result.statusCode);
                        }
                    } catch (error) {
                        hasErrors = true;
                        logLinkError(filePath, link, null, error.message);
                    }
                }
            }

            // For external links, still use the original library with ignore patterns
            const results = await markdownLinkCheckAsync(content, config);
            results.forEach(result => {
                if (result.status === 'dead') {
                    // Skip if this was an internal link (already checked above) or invalid URL
                    if (!isInternalUrl(result.link) && !isInvalidUrl(result.link)) {
                        hasErrors = true;
                        logLinkError(filePath, result.link, result.statusCode, result.err);
                    }
                }
            });
        }

        // Check href links in JSX components (for .mdx and .tsx files)
        if (filePath.endsWith('.mdx') || filePath.endsWith('.tsx')) {
            const hrefLinks = extractHrefLinks(content);
            const { hasErrors: hrefHasErrors, redirects: hrefRedirects } = await checkHrefLinks(hrefLinks, filePath);
            hasErrors = hasErrors || hrefHasErrors;
            allRedirects.push(...hrefRedirects);
        }

        return { hasErrors, redirects: allRedirects };
    } catch (error) {
        if (error.code === 'ERR_INVALID_URL') {
            // Log invalid URL errors but don't fail the check
            const relativePath = path.relative(process.cwd(), filePath);
            console.warn(`Warning: Invalid URL in ${relativePath}: ${error.input}`);
            return { hasErrors: false, redirects: [] };
        }
        console.error(`Error processing ${filePath}:`, error);
        return { hasErrors: true, redirects: [] };
    }
}

async function main() {
    const pagesDir = path.join(process.cwd(), 'pages');
    let hasErrors = false;
    const allRedirects = [];

    try {
        // Recursively find all .md, .mdx, and .tsx files
        const findFiles = (dir) => {
            let results = [];

            try {
                const files = fs.readdirSync(dir);

                for (const file of files) {
                    const filePath = path.join(dir, file);

                    try {
                        const stat = fs.statSync(filePath);

                        if (stat.isDirectory()) {
                            // Skip common directories that shouldn't contain docs
                            if (!file.startsWith('.') && file !== 'node_modules') {
                                results = results.concat(findFiles(filePath));
                            }
                        } else if (file.endsWith('.md') || file.endsWith('.mdx') || file.endsWith('.tsx')) {
                            // Warn about large files (>1MB) that might cause memory issues
                            if (stat.size > 1024 * 1024) {
                                console.warn(`Warning: Large file detected (${(stat.size / 1024 / 1024).toFixed(1)}MB): ${filePath}`);
                            }
                            results.push(filePath);
                        }
                    } catch (statError) {
                        console.warn(`Warning: Could not stat file ${filePath}: ${statError.message}`);
                    }
                }
            } catch (readError) {
                console.warn(`Warning: Could not read directory ${dir}: ${readError.message}`);
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
            hasErrors = hasErrors || results.some(result => result.hasErrors);

            // Collect redirects from this batch
            results.forEach(result => {
                allRedirects.push(...result.redirects);
            });
        }

        // Log redirected links
        if (allRedirects.length > 0) {
            console.log('\n=== Redirected Links ===');
            allRedirects.forEach(redirect => {
                const chainStr = redirect.chain.map(step => `${step.from} → ${step.to} (${step.status})`).join(' → ');
                console.log(`🔗 ${chainStr} (final: ${redirect.finalStatus})`);
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