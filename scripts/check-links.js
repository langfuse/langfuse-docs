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

// Configuration for the link checker (for external links only)
const config = {
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
    timeout: '10s',
    retryOn429: true,
    retryCount: 5,
    fallbackRetryDelay: '30s'
};

/**
 * Check a single URL with custom redirect handling
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
    let processedUrl = url;

    for (const pattern of config.replacementPatterns) {
        const regex = new RegExp(pattern.pattern);
        if (regex.test(processedUrl)) {
            processedUrl = processedUrl.replace(regex, pattern.replacement);
            break;
        }
    }

    return processedUrl;
}

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
        return { hasErrors: false, redirects: [] };
    }

    let hasErrors = false;
    const redirectsFound = [];

    // Check each link individually with custom redirect handling
    for (const link of links) {
        // Skip obviously invalid URLs
        if (link.includes('{') || link.includes('}') ||
            link.includes('${') || link.includes('}}')) {
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
                const relativePath = path.relative(process.cwd(), filePath);
                console.error(`[${result.statusCode}] Dead href link in ${relativePath}: ${link}`);
            }
        } catch (error) {
            hasErrors = true;
            const relativePath = path.relative(process.cwd(), filePath);
            console.error(`[ERROR] Dead href link in ${relativePath}: ${link}`);
            console.error(`  Error: ${error.message}`);
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
            const markdownLinkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
            const internalLinks = [];
            let match;

            while ((match = markdownLinkRegex.exec(content)) !== null) {
                const link = match[2];
                if (isInternalUrl(link)) {
                    internalLinks.push(link);
                }
            }

            // Check internal links with custom redirect handling
            if (internalLinks.length > 0) {
                for (const link of internalLinks) {
                    // Skip obviously invalid URLs
                    if (link.includes('{') || link.includes('}') ||
                        link.includes('${') || link.includes('}}')) {
                        continue;
                    }

                    try {
                        const processedUrl = applyReplacements(link);
                        const result = await checkUrlWithRedirects(processedUrl);

                        if (result.redirectInfo) {
                            allRedirects.push(result.redirectInfo);
                        }

                        if (!result.success) {
                            hasErrors = true;
                            const relativePath = path.relative(process.cwd(), filePath);
                            console.error(`[${result.statusCode}] Dead link in ${relativePath}: ${link}`);
                        }
                    } catch (error) {
                        hasErrors = true;
                        const relativePath = path.relative(process.cwd(), filePath);
                        console.error(`[ERROR] Dead link in ${relativePath}: ${link}`);
                        console.error(`  Error: ${error.message}`);
                    }
                }
            }

            // For external links, still use the original library with ignore patterns
            const results = await markdownLinkCheckAsync(content, config);
            results.forEach(result => {
                if (result.status === 'dead') {
                    // Skip if this was an internal link (already checked above)
                    if (!isInternalUrl(result.link)) {
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