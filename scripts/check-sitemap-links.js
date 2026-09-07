"use strict";

const { promisify } = require("util");
const { URL } = require("url");
const xml2js = require("xml2js");
const { checkLink, fetchUrl, mapPool } = require("./lib/check-http");

const DEFAULT_SITEMAP_URL = "http://langfuse.com/sitemap-0.xml";
const DEFAULT_LOCAL_SERVER_BASE = "http://localhost:3333";
const LANGFUSE_DOMAIN = "langfuse.com";
const REQUEST_TIMEOUT = 10000;
const MAX_CONCURRENT_REQUESTS = 16;

function getSitemapUrl(sitemapUrl = process.env.SITEMAP_URL) {
  return sitemapUrl || DEFAULT_SITEMAP_URL;
}

function getLocalServerBase(baseUrl = process.env.SITEMAP_CHECK_BASE) {
  return (baseUrl || DEFAULT_LOCAL_SERVER_BASE).replace(/\/$/, "");
}

async function parseSitemap(xmlContent) {
  const parser = new xml2js.Parser();
  const parseString = promisify(parser.parseString.bind(parser));
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
}

function filterAndConvertUrls(urls, localServerBase = getLocalServerBase()) {
  return urls
    .filter((url) => url.includes(LANGFUSE_DOMAIN))
    .map((url) =>
      url
        .replace(`https://${LANGFUSE_DOMAIN}`, localServerBase)
        .replace(`http://${LANGFUSE_DOMAIN}`, localServerBase),
    );
}

function localHostnamesFromBase(baseUrl) {
  try {
    return new Set([new URL(baseUrl).hostname, "localhost", "127.0.0.1"]);
  } catch {
    return new Set(["localhost", "127.0.0.1"]);
  }
}

async function checkUrl(url, { localHostnames, checkLinkFn = checkLink } = {}) {
  const response = await checkLinkFn(url, REQUEST_TIMEOUT, {
    localHostnames,
    followRedirects: true,
  });
  const isError = response.status === "dead";

  return {
    url,
    statusCode: response.statusCode,
    success: !isError,
    error: isError ? response.error || `HTTP ${response.statusCode}` : null,
    method: response.method,
  };
}

async function runSitemapCheck(options = {}) {
  const sitemapUrl = options.sitemapUrl || getSitemapUrl();
  const localServerBase = getLocalServerBase(options.baseUrl);
  const fetchSitemap = options.fetchUrl || fetchUrl;
  const checkLinkFn = options.checkLink || checkLink;
  const localHostnames = localHostnamesFromBase(localServerBase);
  const silent = options.silent === true;

  if (!silent) {
    console.log(`Fetching sitemap from: ${sitemapUrl}`);
  }

  const sitemapResponse = await fetchSitemap(sitemapUrl, REQUEST_TIMEOUT);
  if (sitemapResponse.statusCode !== 200) {
    throw new Error(
      `Failed to fetch sitemap: HTTP ${sitemapResponse.statusCode}`,
    );
  }

  if (!silent) {
    console.log("Parsing sitemap XML...");
  }
  const urls = await parseSitemap(sitemapResponse.data);
  if (!silent) {
    console.log(`Found ${urls.length} URLs in sitemap`);
  }

  const localUrls = filterAndConvertUrls(urls, localServerBase);
  if (!silent) {
    console.log(
      `Filtered to ${localUrls.length} Langfuse.com URLs to check against local server`,
    );
  }

  if (localUrls.length === 0) {
    if (!silent) {
      console.log("No Langfuse.com URLs found in sitemap");
    }
    return {
      ok: true,
      failures: [],
      successes: [],
      urlsChecked: 0,
    };
  }

  if (!silent) {
    console.log(
      `\nChecking ${localUrls.length} URLs against local server ` +
        `(${MAX_CONCURRENT_REQUESTS} concurrent, HEAD with GET fallback)...`,
    );
  }

  const results = await mapPool(
    localUrls,
    MAX_CONCURRENT_REQUESTS,
    async (url, index) => {
      const result = await checkUrl(url, { localHostnames, checkLinkFn });
      if (
        !silent &&
        ((index + 1) % 100 === 0 || index + 1 === localUrls.length)
      ) {
        console.log(`Checked ${index + 1}/${localUrls.length} sitemap URLs`);
      }
      return result;
    },
  );

  const failures = results.filter((result) => !result.success);
  const successes = results.filter((result) => result.success);

  return {
    ok: failures.length === 0,
    failures,
    successes,
    urlsChecked: results.length,
  };
}

function reportSitemapResults(result) {
  console.log(`\n=== Results ===`);
  console.log(`✅ Successful: ${result.successes.length}`);
  console.log(`❌ Failed: ${result.failures.length}`);

  if (result.failures.length > 0) {
    console.log("\n=== Failed URLs ===");
    result.failures.forEach((failure) => {
      console.log(`❌ ${failure.url} - ${failure.error}`);
    });
    console.log(
      `\n❌ Sitemap check failed: ${result.failures.length} URLs are broken`,
    );
  } else {
    console.log("\n✅ All sitemap URLs are working correctly!");
  }
}

async function main() {
  try {
    const result = await runSitemapCheck();
    reportSitemapResults(result);
    if (!result.ok) {
      process.exit(1);
    }
  } catch (error) {
    console.error("Error during sitemap check:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  DEFAULT_SITEMAP_URL,
  MAX_CONCURRENT_REQUESTS,
  checkUrl,
  filterAndConvertUrls,
  getLocalServerBase,
  getSitemapUrl,
  parseSitemap,
  reportSitemapResults,
  runSitemapCheck,
};
