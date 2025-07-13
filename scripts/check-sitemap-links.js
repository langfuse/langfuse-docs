'use strict';

const https = require('https');
const http = require('http');
const { promisify } = require('util');
const xml2js = require('xml2js');

// Configuration
const SITEMAP_URL = 'http://langfuse.com/sitemap-0.xml';
const LOCAL_SERVER_BASE = 'http://localhost:3333';
const LANGFUSE_DOMAIN = 'langfuse.com';
const REQUEST_TIMEOUT = 10000; // 10 seconds
const MAX_CONCURRENT_REQUESTS = 10;
const MAX_REDIRECTS = 5;

/**
 * Fetch content from a URL with timeout and redirect following
 */
function fetchUrl(url, redirectCount = 0, redirectChain = [], collectData = false) {
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
                'User-Agent': 'Langfuse-Sitemap-Checker/1.0'
            }
        }, (response) => {
            // Handle redirects
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                const redirectUrl = response.headers.location;
                // Resolve relative redirects
                const resolvedUrl = redirectUrl.startsWith('http') ? redirectUrl : new URL(redirectUrl, url).href;

                // Add to redirect chain
                const newChain = [...redirectChain, { from: url, to: resolvedUrl, status: response.statusCode }];

                fetchUrl(resolvedUrl, redirectCount + 1, newChain, collectData).then(resolve).catch(reject);
                return;
            }

            // If we have a redirect chain, log it (thread-safe by using a local variable)
            let redirectInfo = null;
            if (redirectChain.length > 0) {
                redirectInfo = {
                    originalUrl: redirectChain[0].from,
                    finalUrl: url,
                    chain: redirectChain,
                    finalStatus: response.statusCode
                };
            }

            if (collectData) {
                let data = '';
                response.on('data', chunk => data += chunk);
                response.on('end', () => {
                    resolve({
                        statusCode: response.statusCode,
                        data: data,
                        url: url,
                        redirectChain: redirectChain,
                        redirectInfo: redirectInfo
                    });
                });
            } else {
                // Just consume the response to prevent memory leaks
                response.resume();
                resolve({
                    statusCode: response.statusCode,
                    data: null,
                    url: url,
                    redirectChain: redirectChain,
                    redirectInfo: redirectInfo
                });
            }
        });

        request.on('error', reject);
        request.on('timeout', () => {
            request.destroy();
            reject(new Error(`Request timeout for ${url}`));
        });
    });
}

/**
 * Parse sitemap XML and extract URLs
 */
async function parseSitemap(xmlContent) {
    const parser = new xml2js.Parser();
    const parseString = promisify(parser.parseString);

    try {
        const result = await parseString(xmlContent);
        const urls = [];

        if (result.urlset && result.urlset.url) {
            for (const urlEntry of result.urlset.url) {
                if (urlEntry.loc && urlEntry.loc[0]) {
                    urls.push(urlEntry.loc[0]);
                }
            }
        }

        return urls;
    } catch (error) {
        throw new Error(`Failed to parse sitemap XML: ${error.message}`);
    }
}

/**
 * Filter URLs to only include Langfuse.com URLs and convert to local server URLs
 */
function filterAndConvertUrls(urls) {
    return urls
        .filter(url => url.includes(LANGFUSE_DOMAIN))
        .map(url => url.replace(`https://${LANGFUSE_DOMAIN}`, LOCAL_SERVER_BASE))
        .map(url => url.replace(`http://${LANGFUSE_DOMAIN}`, LOCAL_SERVER_BASE));
}

/**
 * Check a single URL
 */
async function checkUrl(url) {
    try {
        const response = await fetchUrl(url);
        // Fail if final response is not 2xx
        const isSuccess = response.statusCode >= 200 && response.statusCode < 300;

        return {
            url: url,
            statusCode: response.statusCode,
            success: isSuccess,
            error: isSuccess ? null : `HTTP ${response.statusCode}`,
            redirectChain: response.redirectChain,
            redirectInfo: response.redirectInfo
        };
    } catch (error) {
        return {
            url: url,
            statusCode: null,
            success: false,
            error: error.message,
            redirectChain: [],
            redirectInfo: null
        };
    }
}

/**
 * Check URLs in batches to avoid overwhelming the server
 */
async function checkUrlsBatch(urls, batchSize = MAX_CONCURRENT_REQUESTS) {
    const results = [];

    for (let i = 0; i < urls.length; i += batchSize) {
        const batch = urls.slice(i, i + batchSize);
        console.log(`Checking batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(urls.length / batchSize)} (${batch.length} URLs)...`);

        const batchResults = await Promise.all(batch.map(url => checkUrl(url)));
        results.push(...batchResults);
    }

    return results;
}

async function main() {
    try {
        console.log(`Fetching sitemap from: ${SITEMAP_URL}`);

        // Fetch sitemap
        const sitemapResponse = await fetchUrl(SITEMAP_URL, 0, [], true);
        if (sitemapResponse.statusCode !== 200) {
            throw new Error(`Failed to fetch sitemap: HTTP ${sitemapResponse.statusCode}`);
        }

        // Parse sitemap
        console.log('Parsing sitemap XML...');
        const urls = await parseSitemap(sitemapResponse.data);
        console.log(`Found ${urls.length} URLs in sitemap`);

        // Filter and convert URLs
        const localUrls = filterAndConvertUrls(urls);
        console.log(`Filtered to ${localUrls.length} Langfuse.com URLs to check against local server`);

        if (localUrls.length === 0) {
            console.log('No Langfuse.com URLs found in sitemap');
            return;
        }

        // Check URLs
        console.log(`\nChecking ${localUrls.length} URLs against local server...`);
        const results = await checkUrlsBatch(localUrls);

        // Report results
        const failures = results.filter(result => !result.success);
        const successes = results.filter(result => result.success);

        console.log(`\n=== Results ===`);
        console.log(`✅ Successful: ${successes.length}`);
        console.log(`❌ Failed: ${failures.length}`);

        // Log redirected links
        const redirectsFound = results.filter(result => result.redirectInfo).map(result => result.redirectInfo);
        if (redirectsFound.length > 0) {
            console.log(`\n=== Redirected Links ===`);
            redirectsFound.forEach(redirect => {
                const chainStr = redirect.chain.map(step => `${step.from} → ${step.to} (${step.status})`).join(' → ');
                console.log(`🔗 ${chainStr} (final: ${redirect.finalStatus})`);
            });
        }

        if (failures.length > 0) {
            console.log('\n=== Failed URLs ===');
            failures.forEach(failure => {
                console.log(`❌ ${failure.url} - ${failure.error}`);
            });

            console.log(`\n❌ Sitemap check failed: ${failures.length} URLs are broken`);
            process.exit(1);
        } else {
            console.log('\n✅ All sitemap URLs are working correctly!');
        }

    } catch (error) {
        console.error('Error during sitemap check:', error.message);
        process.exit(1);
    }
}

main();