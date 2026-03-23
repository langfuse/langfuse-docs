'use strict';

const http = require('http');
const https = require('https');
const { promisify } = require('util');
const xml2js = require('xml2js');

const LOCAL_SERVER_BASE = 'http://localhost:3333';
const SITEMAP_URL = `${LOCAL_SERVER_BASE}/sitemap-0.xml`;
const REQUEST_TIMEOUT = 10000;
const MAX_CONCURRENT_REQUESTS = 10;

function fetchUrl(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;

    const request = client.get(
      url,
      {
        timeout: REQUEST_TIMEOUT,
        headers: {
          'User-Agent': 'Langfuse-Sitemap-Markdown-Checker/1.0',
          ...headers,
        },
      },
      (response) => {
        if (
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          const redirectUrl = response.headers.location;
          const resolvedUrl = redirectUrl.startsWith('http')
            ? redirectUrl
            : new URL(redirectUrl, url).href;
          fetchUrl(resolvedUrl, headers).then(resolve).catch(reject);
          return;
        }

        let data = '';
        response.on('data', (chunk) => {
          data += chunk;
        });
        response.on('end', () => {
          resolve({
            statusCode: response.statusCode,
            data,
            headers: response.headers,
            url,
          });
        });
      }
    );

    request.on('error', reject);
    request.on('timeout', () => {
      request.destroy();
      reject(new Error(`Request timeout for ${url}`));
    });
  });
}

async function parseSitemap(xmlContent) {
  const parser = new xml2js.Parser();
  const parseString = promisify(parser.parseString);

  try {
    const result = await parseString(xmlContent);
    const urls = [];

    if (result.urlset && result.urlset.url) {
      for (const entry of result.urlset.url) {
        if (entry.loc && entry.loc[0]) {
          urls.push(entry.loc[0]);
        }
      }
    }

    return urls;
  } catch (error) {
    throw new Error(`Failed to parse sitemap XML: ${error.message}`);
  }
}

function toLocalMarkdownUrl(absoluteUrl) {
  const parsed = new URL(absoluteUrl);
  const pathname = parsed.pathname;
  const normalizedPathname =
    pathname === '/' ? '/index' : pathname.replace(/\/+$/, '');
  const mdPath = normalizedPathname.endsWith('.md')
    ? normalizedPathname
    : `${normalizedPathname}.md`;
  return `${LOCAL_SERVER_BASE}${mdPath}`;
}

async function checkMarkdownUrl(url) {
  try {
    const response = await fetchUrl(url, { Accept: 'text/markdown' });
    const statusOk = response.statusCode >= 200 && response.statusCode < 400;
    const contentType = String(response.headers['content-type'] || '');
    const hasMarkdownContentType = contentType.includes('text/markdown');

    return {
      url,
      statusCode: response.statusCode,
      success: statusOk && hasMarkdownContentType,
      error: !statusOk
        ? `HTTP ${response.statusCode}`
        : hasMarkdownContentType
          ? null
          : `Unexpected content-type: ${contentType || '(missing)'}`,
    };
  } catch (error) {
    return {
      url,
      statusCode: null,
      success: false,
      error: error.message,
    };
  }
}

async function checkUrlsBatch(urls, batchSize = MAX_CONCURRENT_REQUESTS) {
  const results = [];

  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    console.log(
      `Checking batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(urls.length / batchSize)} (${batch.length} URLs)...`
    );

    const batchResults = await Promise.all(batch.map((url) => checkMarkdownUrl(url)));
    results.push(...batchResults);

    if (i + batchSize < urls.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return results;
}

async function main() {
  try {
    console.log(`Fetching sitemap from: ${SITEMAP_URL}`);
    const sitemapResponse = await fetchUrl(SITEMAP_URL);

    if (sitemapResponse.statusCode !== 200) {
      throw new Error(`Failed to fetch sitemap: HTTP ${sitemapResponse.statusCode}`);
    }

    console.log('Parsing sitemap XML...');
    const sitemapUrls = await parseSitemap(sitemapResponse.data);
    console.log(`Found ${sitemapUrls.length} URLs in sitemap`);

    const markdownUrls = [...new Set(sitemapUrls.map((url) => toLocalMarkdownUrl(url)))];
    console.log(`Checking ${markdownUrls.length} markdown endpoint(s)...`);

    const results = await checkUrlsBatch(markdownUrls);
    const failures = results.filter((result) => !result.success);
    const successes = results.filter((result) => result.success);

    console.log('\n=== Results ===');
    console.log(`✅ Successful markdown endpoints: ${successes.length}`);
    console.log(`❌ Failed markdown endpoints: ${failures.length}`);

    if (failures.length > 0) {
      console.log('\n=== Failed markdown endpoints ===');
      failures.forEach((failure) => {
        console.log(`❌ ${failure.url} - ${failure.error}`);
      });
      process.exit(1);
    }

    console.log('\n✅ All sitemap URLs have a working markdown endpoint (.md).');
  } catch (error) {
    console.error('Error during sitemap markdown check:', error.message);
    process.exit(1);
  }
}

main();
