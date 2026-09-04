"use strict";

const http = require("http");
const https = require("https");
const { URL } = require("url");

const DEFAULT_TIMEOUT_MS = 10000;

const httpAgent = new http.Agent({
  keepAlive: true,
  maxSockets: 32,
});
const httpsAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 32,
});

function shouldRetryWithGet(url, result, localHostnames) {
  if (
    result.statusCode === 405 ||
    result.statusCode === 501 ||
    result.statusCode === 400
  ) {
    return true;
  }

  if (result.statusCode !== 0 || !result.error) {
    return false;
  }

  let hostname;
  try {
    hostname = new URL(url).hostname;
  } catch {
    return false;
  }

  if (!localHostnames.has(hostname)) {
    return false;
  }

  return (
    result.error === "Timeout" ||
    result.error.includes("ECONNRESET") ||
    result.error.includes("socket hang up")
  );
}

function makeRequest(url, method, timeout, { collectBody = false } = {}) {
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(url);
      const isHttps = urlObj.protocol === "https:";
      const client = isHttps ? https : http;

      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || (isHttps ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method,
        timeout,
        agent: isHttps ? httpsAgent : httpAgent,
        headers: {
          "User-Agent": "link-checker",
          Connection: "keep-alive",
        },
      };

      const req = client.request(options, (res) => {
        const redirectLocation = res.headers.location;
        const chunks = [];

        res.on("data", (chunk) => {
          if (collectBody) {
            chunks.push(chunk);
          }
        });

        res.on("end", () => {
          const success = res.statusCode >= 200 && res.statusCode < 400;
          resolve({
            url,
            status: success ? "alive" : "dead",
            statusCode: res.statusCode,
            method,
            location: redirectLocation,
            data: collectBody ? Buffer.concat(chunks).toString("utf8") : "",
          });
        });
      });

      req.on("error", (err) => {
        resolve({
          url,
          status: "dead",
          statusCode: 0,
          error: err.message,
          method,
        });
      });

      req.on("timeout", () => {
        req.destroy();
        resolve({
          url,
          status: "dead",
          statusCode: 0,
          error: "Timeout",
          method,
        });
      });

      req.end();
    } catch (error) {
      resolve({
        url,
        status: "dead",
        statusCode: 0,
        error: error.message,
        method,
      });
    }
  });
}

async function checkLink(
  url,
  timeout = DEFAULT_TIMEOUT_MS,
  { localHostnames = new Set(["localhost", "127.0.0.1"]) } = {},
) {
  const headResult = await makeRequest(url, "HEAD", timeout);

  if (shouldRetryWithGet(url, headResult, localHostnames)) {
    return await makeRequest(url, "GET", timeout);
  }

  return headResult;
}

async function fetchUrl(
  url,
  timeout = DEFAULT_TIMEOUT_MS,
  { maxRedirects = 5 } = {},
) {
  let currentUrl = url;

  for (let i = 0; i <= maxRedirects; i += 1) {
    const result = await makeRequest(currentUrl, "GET", timeout, {
      collectBody: true,
    });

    if (
      result.statusCode >= 300 &&
      result.statusCode < 400 &&
      result.location
    ) {
      currentUrl = result.location.startsWith("http")
        ? result.location
        : new URL(result.location, currentUrl).href;
      continue;
    }

    if (result.status === "dead" && result.error) {
      throw new Error(result.error);
    }

    return {
      statusCode: result.statusCode,
      data: result.data,
      url: currentUrl,
    };
  }

  throw new Error(`Too many redirects for ${url}`);
}

async function mapPool(items, concurrency, worker) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function runWorker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await worker(items[index], index);
    }
  }

  const workerCount = Math.min(concurrency, items.length);
  await Promise.all(Array.from({ length: workerCount }, () => runWorker()));
  return results;
}

module.exports = {
  DEFAULT_TIMEOUT_MS,
  checkLink,
  fetchUrl,
  makeRequest,
  mapPool,
  shouldRetryWithGet,
};
