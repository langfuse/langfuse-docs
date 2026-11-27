import assert from "node:assert/strict";
import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import zlib from "node:zlib";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const POSTHOG_KEY = "phc_test_cookie_consent";
const POSTHOG_HOST = "https://eu.posthog.com";
const POSTHOG_COOKIE_NAME = `ph_${POSTHOG_KEY}_posthog`;
const COOKIEYES_SCRIPT_URL =
  "https://cdn-cookieyes.com/client_data/40247147630c6589ad01a874/script.js";
const GOOGLE_ADS_ID = "AW-10855791654";
const GOOGLE_ADS_TAG_URL = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;
const EXPECTED_CONSENT_DEFAULT = [
  "consent",
  "default",
  {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "denied",
    personalization_storage: "denied",
    security_storage: "granted",
    wait_for_update: 2000,
  },
];
const DESKTOP_CHROME_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";

function getFreePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.unref();
    srv.on("error", reject);
    srv.listen(0, "127.0.0.1", () => {
      const address = srv.address();
      const port = typeof address === "object" && address ? address.port : 3399;
      srv.close(() => resolve(port));
    });
  });
}

async function waitForServer(url, proc, timeoutMs = 90_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (proc.exitCode !== null) {
      throw new Error(`Next.js server exited early with code ${proc.exitCode}`);
    }
    try {
      const res = await fetch(url, { redirect: "manual" });
      if (res.status < 500) return;
    } catch {
      // still starting
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function stopProcessTree(proc) {
  if (!proc || !proc.pid) return;
  try {
    if (process.platform === "win32") {
      proc.kill("SIGTERM");
    } else {
      process.kill(-proc.pid, "SIGTERM");
    }
  } catch {
    // already exited
  }
}

function runBuild(env) {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      process.platform === "win32" ? "pnpm.cmd" : "pnpm",
      ["build"],
      {
        env,
        stdio: "inherit",
      },
    );
    proc.on("error", reject);
    proc.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`pnpm build exited with code ${code}`));
    });
  });
}

async function startLocalServer() {
  const buildEnv = {
    ...process.env,
    NEXT_PUBLIC_POSTHOG_KEY: POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: POSTHOG_HOST,
    NEXT_TELEMETRY_DISABLED: "1",
  };

  const skipBuild =
    process.env.COOKIE_CONSENT_E2E_SKIP_BUILD === "1" &&
    fs.existsSync(path.join(process.cwd(), ".next", "BUILD_ID"));

  if (!skipBuild) {
    await runBuild(buildEnv);
  }

  const port = await getFreePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const startEnv = {
    ...process.env,
    NODE_ENV: "production",
    NEXT_TELEMETRY_DISABLED: "1",
  };

  let logs = "";
  const proc = spawn(
    process.platform === "win32" ? "pnpm.cmd" : "pnpm",
    ["exec", "next", "start", "-p", String(port), "-H", "127.0.0.1"],
    {
      env: startEnv,
      detached: process.platform !== "win32",
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  proc.stdout.on("data", (chunk) => {
    logs += chunk.toString();
  });
  proc.stderr.on("data", (chunk) => {
    logs += chunk.toString();
  });

  try {
    await waitForServer(`${baseUrl}/docs`, proc);
    return { baseUrl, proc };
  } catch (err) {
    stopProcessTree(proc);
    throw new Error(
      `Failed to start Next.js production server: ${err.message}\n${logs.slice(-2000)}`,
    );
  }
}

async function launchChromium() {
  try {
    return await chromium.launch({ headless: true });
  } catch (err) {
    const candidates = [
      "/usr/local/bin/google-chrome",
      "/usr/bin/google-chrome",
      "/usr/bin/chromium",
      "/usr/bin/chromium-browser",
    ];
    for (const executablePath of candidates) {
      if (fs.existsSync(executablePath)) {
        return await chromium.launch({ headless: true, executablePath });
      }
    }
    throw err;
  }
}

function decodePostHogEvents(request) {
  const url = request.url();
  const raw = request.postDataBuffer();
  if (!raw || raw.length === 0) return [];

  let text;
  const headers = request.headers();
  const isGzip =
    (raw.length >= 2 && raw[0] === 0x1f && raw[1] === 0x8b) ||
    url.includes("compression=gzip-js") ||
    headers["content-encoding"] === "gzip";
  if (isGzip) {
    text = zlib.gunzipSync(raw).toString("utf8");
  } else {
    text = raw.toString("utf8");
  }

  if (text.startsWith("data=")) {
    text = Buffer.from(decodeURIComponent(text.slice(5)), "base64").toString(
      "utf8",
    );
  } else if (url.includes("compression=base64")) {
    const params = new URLSearchParams(text);
    const data = params.get("data");
    if (data) text = Buffer.from(data, "base64").toString("utf8");
  }

  const parsed = JSON.parse(text);
  const batch = Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed.batch)
      ? parsed.batch
      : [parsed];
  const receivedAt = Date.now();
  const resourceType = request.resourceType();
  return batch.map((ev) => ({
    event: ev.event,
    distinct_id: ev.properties?.distinct_id ?? ev.distinct_id ?? null,
    cookieless: ev.properties?.$cookieless_mode === true,
    session_id: ev.properties?.$session_id ?? null,
    current_url: ev.properties?.$current_url ?? null,
    pathname: ev.properties?.$pathname ?? null,
    host: ev.properties?.$host ?? null,
    referrer: ev.properties?.$referrer ?? null,
    title: ev.properties?.title ?? null,
    timestamp: ev.timestamp ?? null,
    receivedAt,
    resourceType,
  }));
}

function isPostHogStorageKey(key) {
  return (
    key.startsWith("ph_") ||
    key.startsWith("__ph_") ||
    key.includes(POSTHOG_KEY)
  );
}

const allGtmRequests = [];

function parseUrl(raw) {
  try {
    return new URL(raw);
  } catch {
    return null;
  }
}

function isHostOrSubdomain(raw, domain) {
  const parsed = parseUrl(raw);
  if (!parsed) return false;
  return parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`);
}

function isGtmUrl(raw) {
  const parsed = parseUrl(raw);
  if (!parsed) return false;
  if (
    isHostOrSubdomain(raw, "googletagmanager.com") &&
    parsed.pathname.startsWith("/gtm.js")
  ) {
    return true;
  }
  return parsed.searchParams.get("id")?.startsWith("GTM-") ?? false;
}

async function createIsolatedContext(browser, baseUrl, options = {}) {
  const {
    cookieyesCookie,
    initialConsent,
    cookieyesScriptBody,
    blockCookieYes = false,
  } = options;
  const context = await browser.newContext({
    locale: "de-DE",
    userAgent: DESKTOP_CHROME_UA,
  });

  if (cookieyesCookie) {
    await context.addCookies([
      {
        name: "cookieyes-consent",
        value: cookieyesCookie,
        url: baseUrl,
      },
    ]);
  }

  await context.addInitScript((consent) => {
    // posthog-js treats navigator.webdriver === true and "HeadlessChrome" in
    // navigator.userAgentData.brands (present in Playwright's headless shell)
    // as bots and drops events; override only inside this E2E context so real
    // PostHog capture runs without weakening production bot filtering.
    Object.defineProperty(navigator, "webdriver", { get: () => false });
    Object.defineProperty(navigator, "userAgentData", {
      get: () => ({
        brands: [
          { brand: "Chromium", version: "130" },
          { brand: "Google Chrome", version: "130" },
        ],
        mobile: false,
        platform: "macOS",
      }),
      configurable: true,
    });
    window.__cookieWrites = [];
    const desc = Object.getOwnPropertyDescriptor(Document.prototype, "cookie");
    Object.defineProperty(document, "cookie", {
      get() {
        return desc.get.call(this);
      },
      set(v) {
        window.__cookieWrites.push(String(v).split(";")[0]);
        return desc.set.call(this, v);
      },
      configurable: true,
    });
    window.__beaconUrls = [];
    if (typeof navigator.sendBeacon === "function") {
      const origSendBeacon = navigator.sendBeacon.bind(navigator);
      navigator.sendBeacon = function (url, data) {
        window.__beaconUrls.push(String(url));
        return origSendBeacon(url, data);
      };
    }
    if (consent) {
      window.getCkyConsent = () => consent;
    }
  }, initialConsent ?? null);

  const capturedEvents = [];
  const requestedUrls = [];

  await context.route("**/*", async (route) => {
    const request = route.request();
    const url = request.url();

    if (url.startsWith(baseUrl)) {
      await route.continue();
      return;
    }

    requestedUrls.push(url);
    if (isGtmUrl(url)) {
      allGtmRequests.push(url);
    }
    const parsed = new URL(url);
    const corsHeaders = {
      "access-control-allow-origin": baseUrl,
      "access-control-allow-credentials": "true",
      "access-control-allow-headers": "*",
    };

    if (
      parsed.hostname === "eu.posthog.com" ||
      parsed.hostname.endsWith(".posthog.com")
    ) {
      if (request.method() === "OPTIONS") {
        await route.fulfill({ status: 204, headers: corsHeaders });
        return;
      }

      if (parsed.pathname.includes("/config.js")) {
        await route.fulfill({
          status: 200,
          headers: corsHeaders,
          contentType: "application/javascript",
          body: `window._POSTHOG_REMOTE_CONFIG = window._POSTHOG_REMOTE_CONFIG || {}; window._POSTHOG_REMOTE_CONFIG[${JSON.stringify(POSTHOG_KEY)}] = { config: { autocapture_opt_out: false, heatmaps: false, captureDeadClicks: false, autocaptureExceptions: false, sessionRecording: false, surveys: false } };`,
        });
        return;
      }

      if (
        parsed.pathname.startsWith("/e") ||
        parsed.pathname.startsWith("/batch") ||
        parsed.pathname.startsWith("/capture")
      ) {
        try {
          capturedEvents.push(...decodePostHogEvents(request));
        } catch (err) {
          throw new Error(
            `Failed to decode intercepted PostHog event payload from ${url}: ${err.message}`,
          );
        }
        await route.fulfill({
          status: 200,
          headers: corsHeaders,
          contentType: "application/json",
          body: JSON.stringify({ status: 1 }),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        headers: corsHeaders,
        contentType: parsed.pathname.endsWith(".js")
          ? "application/javascript"
          : "application/json",
        body: parsed.pathname.endsWith(".js") ? "" : "{}",
      });
      return;
    }

    if (
      parsed.hostname === "cdn-cookieyes.com" ||
      parsed.hostname.endsWith(".cookieyes.com")
    ) {
      if (blockCookieYes) {
        await route.abort("blockedbyclient");
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: "application/javascript",
        body: cookieyesScriptBody ?? "",
      });
      return;
    }

    // Cloud region sign-in probes from ConversionTracker: respond signed-out.
    if (
      (parsed.hostname === "cloud.langfuse.com" ||
        parsed.hostname.endsWith(".cloud.langfuse.com")) &&
      parsed.pathname === "/api/auth/session"
    ) {
      await route.fulfill({
        status: 200,
        headers: corsHeaders,
        contentType: "application/json",
        body: "{}",
      });
      return;
    }

    // Stub all remaining non-local third-party requests so tests are
    // deterministic and never reach external services.
    const isScript =
      parsed.pathname.endsWith(".js") || parsed.pathname.includes("/gtag/js");
    await route.fulfill({
      status: 200,
      contentType: isScript ? "application/javascript" : "text/plain",
      body: "",
    });
  });

  const page = await context.newPage();
  return { context, page, capturedEvents, requestedUrls };
}

function assertNoGtm(requestedUrls, label) {
  const gtmRequests = requestedUrls.filter(isGtmUrl);
  assert.deepEqual(
    gtmRequests,
    [],
    `Expected no GTM requests on ${label}, got: ${JSON.stringify(gtmRequests)}`,
  );
}

async function clickLaunchAppCta(page) {
  await page.evaluate(() => {
    let btn = document.getElementById("e2e-launch-app-cta");
    if (!btn) {
      btn = document.createElement("button");
      btn.id = "e2e-launch-app-cta";
      btn.type = "button";
      btn.setAttribute("data-launch-app-cta", "true");
      btn.textContent = "Launch app";
      document.body.appendChild(btn);
    }
  });
  await page.locator("#e2e-launch-app-cta").click();
}

async function readDataLayerEntries(page) {
  return page.evaluate(() =>
    Array.isArray(window.dataLayer)
      ? window.dataLayer.map((entry) =>
          Array.isArray(entry) ||
          (entry && typeof entry === "object" && "length" in entry)
            ? Array.from(entry)
            : entry,
        )
      : [],
  );
}

async function waitForCondition(predicate, timeoutMs = 10_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await predicate()) return true;
    await new Promise((r) => setTimeout(r, 150));
  }
  return false;
}

async function inspectStorage(page) {
  return page.evaluate(() => ({
    cookieWrites: [...(window.__cookieWrites ?? [])],
    beaconUrls: [...(window.__beaconUrls ?? [])],
    cookies: document.cookie
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => s.split("=")[0]),
    localStorageKeys: Object.keys(localStorage),
    sessionStorageKeys: Object.keys(sessionStorage),
  }));
}

async function clickAutocaptureTarget(page) {
  await page.evaluate(() => {
    let btn = document.getElementById("e2e-posthog-click-target");
    if (!btn) {
      btn = document.createElement("button");
      btn.id = "e2e-posthog-click-target";
      btn.type = "button";
      btn.textContent = "E2E click target";
      document.body.appendChild(btn);
    }
  });
  await page.locator("#e2e-posthog-click-target").click();
}

async function assertNoPostHogStorage(
  page,
  label,
  { checkWrites = true } = {},
) {
  const storage = await inspectStorage(page);
  assert.deepEqual(
    storage.cookies.filter((c) => c.startsWith("ph_")),
    [],
    `Expected no ph_* cookies on ${label}, got: ${JSON.stringify(storage.cookies)}`,
  );
  if (checkWrites) {
    assert.deepEqual(
      storage.cookieWrites.filter(
        (w) =>
          w.startsWith("ph_") ||
          w.startsWith("__ph_cookie_support_") ||
          w.startsWith("dmn_chk_"),
      ),
      [],
      `Expected no PostHog cookie writes on ${label}, got: ${JSON.stringify(storage.cookieWrites)}`,
    );
  }
  assert.deepEqual(
    storage.localStorageKeys.filter(isPostHogStorageKey),
    [],
    `Expected no PostHog localStorage keys (including __ph_opt_in_out_*) on ${label}, got: ${JSON.stringify(storage.localStorageKeys)}`,
  );
  assert.deepEqual(
    storage.sessionStorageKeys.filter(isPostHogStorageKey),
    [],
    `Expected no PostHog sessionStorage keys on ${label}, got: ${JSON.stringify(storage.sessionStorageKeys)}`,
  );
  return storage;
}

async function navigateDocsLink(page) {
  const targetPathname = await page.evaluate(() => {
    const link = Array.from(document.querySelectorAll("a[href]")).find((a) => {
      const href = a.getAttribute("href") || "";
      return (
        href.startsWith("/docs/") &&
        href !== "/docs" &&
        !href.includes("#") &&
        !href.includes("?")
      );
    });
    if (!link) throw new Error("No internal /docs/* link found to click");
    const href = link.getAttribute("href");
    link.click();
    return href;
  });
  await page.waitForURL((u) => new URL(u).pathname === targetPathname, {
    timeout: 20_000,
  });
  return targetPathname;
}

async function dispatchConsentUpdate(page, { analytics }) {
  await page.evaluate((granted) => {
    window.getCkyConsent = () => ({
      activeLaw: "gdpr",
      categories: {
        necessary: true,
        functional: granted,
        analytics: granted,
        advertisement: granted,
      },
      isUserActionCompleted: true,
    });
    document.dispatchEvent(new Event("cookieyes_consent_update"));
  }, analytics);
}

const UNDECIDED_CONTEXT = {
  cookieyesCookie:
    "consentid:test,consent:no,action:no,necessary:yes,functional:no,analytics:no,advertisement:no",
  initialConsent: {
    activeLaw: "gdpr",
    categories: {
      necessary: true,
      functional: false,
      analytics: false,
      advertisement: false,
    },
    isUserActionCompleted: false,
  },
};

const GRANTED_CONTEXT = {
  cookieyesCookie:
    "consentid:test,consent:yes,action:yes,necessary:yes,functional:yes,analytics:yes,advertisement:yes",
  initialConsent: {
    activeLaw: "gdpr",
    categories: {
      necessary: true,
      functional: true,
      analytics: true,
      advertisement: true,
    },
    isUserActionCompleted: true,
  },
};

const DENIED_CONTEXT = {
  cookieyesCookie:
    "consentid:test,consent:no,action:yes,necessary:yes,functional:no,analytics:no,advertisement:no",
  initialConsent: {
    activeLaw: "gdpr",
    categories: {
      necessary: true,
      functional: false,
      analytics: false,
      advertisement: false,
    },
    isUserActionCompleted: true,
  },
};

async function run() {
  const externalBaseUrl = process.env.COOKIE_CONSENT_E2E_URL;
  const started = externalBaseUrl ? null : await startLocalServer();
  const baseUrl = externalBaseUrl ?? started.baseUrl;
  const browser = await launchChromium();

  try {
    // 0a. Production HTML has no GTM; Consent Mode defaults run before CookieYes in <head>,
    // no Google requests fire before consent, and pre-consent CTA clicks do not push conversions.
    {
      const htmlRes = await fetch(`${baseUrl}/docs`);
      assert.equal(htmlRes.status, 200);
      const html = await htmlRes.text();
      assert.equal(
        html.includes("GTM-NGLK4TZX"),
        false,
        "Production HTML must not contain GTM-NGLK4TZX",
      );
      assert.equal(
        html.includes("googletagmanager.com/gtm.js"),
        false,
        "Production HTML must not reference googletagmanager.com/gtm.js",
      );
      const headCloseIdx = html.indexOf("</head>");
      const consentDefaultsHtmlIdx = html.indexOf('id="consent-defaults"');
      const cookieYesHtmlIdx = html.indexOf('id="cookieyes"');
      assert.ok(
        consentDefaultsHtmlIdx !== -1 && consentDefaultsHtmlIdx < headCloseIdx,
        "Expected #consent-defaults inside SSR <head>",
      );
      assert.ok(
        cookieYesHtmlIdx !== -1 && cookieYesHtmlIdx < headCloseIdx,
        "Expected #cookieyes inside SSR <head>",
      );
      assert.ok(
        consentDefaultsHtmlIdx < cookieYesHtmlIdx,
        `Expected #consent-defaults before #cookieyes in SSR <head> (${consentDefaultsHtmlIdx} vs ${cookieYesHtmlIdx})`,
      );

      const { context, page, requestedUrls } = await createIsolatedContext(
        browser,
        baseUrl,
        {
          ...UNDECIDED_CONTEXT,
          cookieyesScriptBody:
            "window.__dataLayerAtCookieYesRun = Array.isArray(window.dataLayer) ? window.dataLayer.map((e) => Array.from(e)) : null;",
        },
      );
      try {
        await page.goto(`${baseUrl}/docs`, { waitUntil: "load" });
        const cookieYesRan = await waitForCondition(
          () =>
            page.evaluate(() => window.__dataLayerAtCookieYesRun !== undefined),
          6_000,
        );
        assert.ok(cookieYesRan, "Expected CookieYes script to execute");

        const headOrder = await page.evaluate(() => {
          const headScripts = Array.from(
            document.head.querySelectorAll("script"),
          ).map((el) => ({ id: el.id || null, src: el.src || null }));
          const allScripts = Array.from(
            document.querySelectorAll("script"),
          ).map((el) => ({ id: el.id || null, src: el.src || null }));
          return {
            headScripts,
            allScripts,
            dataLayerAtCookieYesRun: window.__dataLayerAtCookieYesRun,
          };
        });

        const defaultsIdx = headOrder.headScripts.findIndex(
          (s) => s.id === "consent-defaults",
        );
        const cookieYesIdx = headOrder.headScripts.findIndex(
          (s) => s.id === "cookieyes",
        );
        assert.ok(
          defaultsIdx !== -1,
          `Expected #consent-defaults in <head>, got: ${JSON.stringify(headOrder.headScripts)}`,
        );
        assert.equal(
          cookieYesIdx,
          defaultsIdx + 1,
          `Expected #cookieyes directly after #consent-defaults in <head>, got: ${JSON.stringify(headOrder.headScripts)}`,
        );
        assert.equal(
          headOrder.headScripts[cookieYesIdx].src,
          COOKIEYES_SCRIPT_URL,
        );
        assert.equal(
          headOrder.allScripts.some((s) => Boolean(s.src && isGtmUrl(s.src))),
          false,
          `Expected no GTM script tags in DOM, got: ${JSON.stringify(headOrder.allScripts)}`,
        );

        assert.deepEqual(
          headOrder.dataLayerAtCookieYesRun[0],
          EXPECTED_CONSENT_DEFAULT,
          `Expected first dataLayer entry before CookieYes runs to be Consent Mode default, got: ${JSON.stringify(headOrder.dataLayerAtCookieYesRun)}`,
        );
        assert.deepEqual(headOrder.dataLayerAtCookieYesRun[1], [
          "set",
          "url_passthrough",
          true,
        ]);

        // Wait for sign-in probes to settle, then click a launch-app CTA pre-consent.
        await page.waitForTimeout(500);
        await clickLaunchAppCta(page);
        await page.waitForTimeout(300);
        const entriesPreConsent = await readDataLayerEntries(page);
        assert.equal(
          entriesPreConsent.some(
            (e) =>
              Array.isArray(e) && e[0] === "event" && e[1] === "conversion",
          ),
          false,
          `Expected no pre-consent Google Ads conversion in dataLayer, got: ${JSON.stringify(entriesPreConsent)}`,
        );

        assertNoGtm(requestedUrls, "undecided consent defaults");
        assert.deepEqual(
          requestedUrls.filter((u) =>
            isHostOrSubdomain(u, "googletagmanager.com"),
          ),
          [],
          `Expected zero Google requests before consent, got: ${JSON.stringify(requestedUrls)}`,
        );
        console.log(
          "PASS: Consent Mode defaults set before CookieYes in <head> and no GTM/Google pre-consent",
        );
      } finally {
        await context.close();
      }
    }

    // 0b. Reject keeps Google unrequested; Accept loads gtag.js after defaults and fires launchApp conversion.
    {
      const { context, page, requestedUrls } = await createIsolatedContext(
        browser,
        baseUrl,
        UNDECIDED_CONTEXT,
      );
      try {
        await page.goto(`${baseUrl}/docs`, { waitUntil: "load" });
        await dispatchConsentUpdate(page, { analytics: false });
        await page.waitForTimeout(500);
        await clickLaunchAppCta(page);
        await page.waitForTimeout(300);

        assertNoGtm(requestedUrls, "reject Google Ads check");
        assert.deepEqual(
          requestedUrls.filter((u) =>
            isHostOrSubdomain(u, "googletagmanager.com"),
          ),
          [],
          `Expected zero Google requests after Reject, got: ${JSON.stringify(requestedUrls)}`,
        );
        const entries = await readDataLayerEntries(page);
        assert.equal(
          entries.some(
            (e) =>
              Array.isArray(e) && e[0] === "event" && e[1] === "conversion",
          ),
          false,
          `Expected no conversion event after Reject, got: ${JSON.stringify(entries)}`,
        );
      } finally {
        await context.close();
      }
    }

    {
      const { context, page, requestedUrls } = await createIsolatedContext(
        browser,
        baseUrl,
        UNDECIDED_CONTEXT,
      );
      try {
        await page.goto(`${baseUrl}/docs`, { waitUntil: "load" });
        const probed = await waitForCondition(
          () =>
            requestedUrls.some(
              (u) =>
                isHostOrSubdomain(u, "cloud.langfuse.com") &&
                parseUrl(u)?.pathname === "/api/auth/session",
            ),
          4_000,
        );
        assert.ok(probed, "Expected cloud region sign-in probe to run");

        await dispatchConsentUpdate(page, { analytics: true });
        const gtagLoaded = await waitForCondition(
          () => requestedUrls.includes(GOOGLE_ADS_TAG_URL),
          6_000,
        );
        assert.ok(
          gtagLoaded,
          `Expected ${GOOGLE_ADS_TAG_URL} after Accept, got: ${JSON.stringify(requestedUrls)}`,
        );
        assertNoGtm(requestedUrls, "accept Google Ads check");

        const configured = await waitForCondition(async () => {
          const entries = await readDataLayerEntries(page);
          return entries.some(
            (e) =>
              Array.isArray(e) && e[0] === "config" && e[1] === GOOGLE_ADS_ID,
          );
        }, 6_000);
        assert.ok(configured, "Expected gtag config call after Accept");

        await clickLaunchAppCta(page);
        const entries = await readDataLayerEntries(page);
        assert.deepEqual(entries[0], EXPECTED_CONSENT_DEFAULT);
        const configIdx = entries.findIndex(
          (e) =>
            Array.isArray(e) && e[0] === "config" && e[1] === GOOGLE_ADS_ID,
        );
        assert.ok(
          configIdx > 0,
          `Expected gtag config after consent default, got: ${JSON.stringify(entries)}`,
        );
        const conversionEntry = entries.find(
          (e) =>
            Array.isArray(e) &&
            e[0] === "event" &&
            e[1] === "conversion" &&
            e[2]?.send_to === `${GOOGLE_ADS_ID}/Lb8RCKvkmqkcEKb4uLgo`,
        );
        assert.deepEqual(conversionEntry, [
          "event",
          "conversion",
          {
            send_to: `${GOOGLE_ADS_ID}/Lb8RCKvkmqkcEKb4uLgo`,
            transport_type: "beacon",
            value: 1,
            currency: "USD",
          },
        ]);
        console.log(
          "PASS: Google Ads tag and launchApp conversion gated on advertisement consent",
        );
      } finally {
        await context.close();
      }
    }

    // 1. Returning visitor with stored consent: identified pageview immediately, no delay.
    {
      const { context, page, capturedEvents, requestedUrls } =
        await createIsolatedContext(browser, baseUrl, GRANTED_CONTEXT);
      try {
        const startAt = Date.now();
        await page.goto(`${baseUrl}/docs`, { waitUntil: "load" });
        const loadedAt = Date.now();
        const gotPageview = await waitForCondition(
          () => capturedEvents.some((ev) => ev.event === "$pageview"),
          4_000,
        );
        assert.ok(
          gotPageview,
          `Expected immediate identified $pageview for returning granted visitor, got: ${JSON.stringify(capturedEvents)}`,
        );
        await page.waitForTimeout(500);

        const pageviews = capturedEvents.filter(
          (ev) => ev.event === "$pageview",
        );
        assert.equal(pageviews.length, 1);
        assert.equal(pageviews[0].cookieless, false);
        assert.notEqual(pageviews[0].distinct_id, "$posthog_cookieless");
        assert.ok(pageviews[0].session_id);
        assert.equal(pageviews[0].current_url, `${baseUrl}/docs`);
        assert.equal(pageviews[0].pathname, "/docs");
        assert.ok(
          pageviews[0].receivedAt - loadedAt < 4_000,
          `Expected immediate send (no 10s wait), took ${pageviews[0].receivedAt - loadedAt}ms`,
        );
        const ts = Date.parse(pageviews[0].timestamp);
        assert.ok(
          ts >= startAt - 1_000 && ts <= pageviews[0].receivedAt + 1_000,
        );

        await clickAutocaptureTarget(page);
        const gotAutocapture = await waitForCondition(
          () =>
            capturedEvents.some(
              (ev) => ev.event === "$autocapture" && !ev.cookieless,
            ),
          6_000,
        );
        assert.ok(gotAutocapture, "Expected $autocapture on granted consent");

        const storage = await inspectStorage(page);
        assert.ok(storage.cookies.includes(POSTHOG_COOKIE_NAME));

        // Pre-warm the first internal /docs/* link and confirm no GTM request.
        await navigateDocsLink(page);
        assertNoGtm(requestedUrls, "returning visitor with stored consent");
        console.log("PASS: returning visitor with stored consent");
      } finally {
        await context.close();
      }
    }

    // 2. Returning visitor who rejected earlier: cookieless pageview immediately, no delay.
    {
      const { context, page, capturedEvents } = await createIsolatedContext(
        browser,
        baseUrl,
        DENIED_CONTEXT,
      );
      try {
        const startAt = Date.now();
        await page.goto(`${baseUrl}/docs`, { waitUntil: "load" });
        const loadedAt = Date.now();
        const gotPageview = await waitForCondition(
          () => capturedEvents.some((ev) => ev.event === "$pageview"),
          4_000,
        );
        assert.ok(
          gotPageview,
          `Expected immediate cookieless $pageview for returning denied visitor, got: ${JSON.stringify(capturedEvents)}`,
        );
        await clickAutocaptureTarget(page);
        await page.waitForTimeout(800);

        assert.equal(capturedEvents.length, 1);
        assert.equal(capturedEvents[0].event, "$pageview");
        assert.equal(capturedEvents[0].cookieless, true);
        assert.equal(capturedEvents[0].distinct_id, "$posthog_cookieless");
        assert.equal(capturedEvents[0].current_url, `${baseUrl}/docs`);
        assert.equal(capturedEvents[0].pathname, "/docs");
        assert.ok(capturedEvents[0].receivedAt - loadedAt < 4_000);
        const ts = Date.parse(capturedEvents[0].timestamp);
        assert.ok(
          ts >= startAt - 1_000 && ts <= capturedEvents[0].receivedAt + 1_000,
        );
        await assertNoPostHogStorage(page, "returning denied visitor");
        console.log("PASS: returning visitor who rejected earlier");
      } finally {
        await context.close();
      }
    }

    // 3. Accept within 10s: exactly one identified $pageview with original load timestamp and URL; no cookieless pageview.
    {
      const { context, page, capturedEvents } = await createIsolatedContext(
        browser,
        baseUrl,
        UNDECIDED_CONTEXT,
      );
      try {
        const loadStart = Date.now();
        await page.goto(`${baseUrl}/docs`, { waitUntil: "load" });
        const loadEnd = Date.now();
        await page.waitForTimeout(1_500);
        assert.deepEqual(
          capturedEvents,
          [],
          "Expected zero events while waiting for consent choice",
        );
        await assertNoPostHogStorage(page, "undecided before accept");

        const acceptAt = Date.now();
        await dispatchConsentUpdate(page, { analytics: true });
        const gotPageview = await waitForCondition(
          () => capturedEvents.some((ev) => ev.event === "$pageview"),
          6_000,
        );
        assert.ok(gotPageview, "Expected identified $pageview after accept");
        await page.waitForTimeout(800);

        const pageviews = capturedEvents.filter(
          (ev) => ev.event === "$pageview",
        );
        assert.equal(
          pageviews.length,
          1,
          `Expected exactly one $pageview on accept within 10s, got: ${JSON.stringify(pageviews)}`,
        );
        assert.equal(pageviews[0].cookieless, false);
        assert.notEqual(pageviews[0].distinct_id, "$posthog_cookieless");
        assert.ok(pageviews[0].session_id);
        assert.equal(pageviews[0].current_url, `${baseUrl}/docs`);
        assert.equal(pageviews[0].pathname, "/docs");
        const ts = Date.parse(pageviews[0].timestamp);
        assert.ok(
          ts >= loadStart - 500 &&
            ts <= loadEnd + 500 &&
            ts <= acceptAt - 1_000,
          `Expected original load timestamp (${loadStart}..${loadEnd}, well before accept ${acceptAt}), got ${ts}`,
        );

        const storage = await inspectStorage(page);
        assert.ok(storage.cookies.includes(POSTHOG_COOKIE_NAME));
        console.log("PASS: accept within 10s");
      } finally {
        await context.close();
      }
    }

    // 4. Reject within 10s: exactly one cookieless $pageview with original timestamp and URL.
    {
      const { context, page, capturedEvents } = await createIsolatedContext(
        browser,
        baseUrl,
        UNDECIDED_CONTEXT,
      );
      try {
        const loadStart = Date.now();
        await page.goto(`${baseUrl}/docs`, { waitUntil: "load" });
        const loadEnd = Date.now();
        await page.waitForTimeout(1_500);
        assert.deepEqual(capturedEvents, []);

        const rejectAt = Date.now();
        await dispatchConsentUpdate(page, { analytics: false });
        const gotPageview = await waitForCondition(
          () => capturedEvents.some((ev) => ev.event === "$pageview"),
          6_000,
        );
        assert.ok(gotPageview, "Expected cookieless $pageview after reject");
        await clickAutocaptureTarget(page);
        await page.waitForTimeout(800);

        assert.equal(capturedEvents.length, 1);
        assert.equal(capturedEvents[0].event, "$pageview");
        assert.equal(capturedEvents[0].cookieless, true);
        assert.equal(capturedEvents[0].distinct_id, "$posthog_cookieless");
        assert.equal(capturedEvents[0].current_url, `${baseUrl}/docs`);
        assert.equal(capturedEvents[0].pathname, "/docs");
        const ts = Date.parse(capturedEvents[0].timestamp);
        assert.ok(
          ts >= loadStart - 500 &&
            ts <= loadEnd + 500 &&
            ts <= rejectAt - 1_000,
          `Expected original load timestamp before reject, got ${ts} vs reject ${rejectAt}`,
        );
        await assertNoPostHogStorage(page, "reject within 10s");
        console.log("PASS: reject within 10s");
      } finally {
        await context.close();
      }
    }

    // 5. Page hidden (visibilitychange) or left (pagehide) before 10s: one cookieless $pageview via beacon.
    for (const exitKind of ["visibilitychange", "pagehide"]) {
      const { context, page, capturedEvents } = await createIsolatedContext(
        browser,
        baseUrl,
        UNDECIDED_CONTEXT,
      );
      try {
        const loadStart = Date.now();
        await page.goto(`${baseUrl}/docs`, { waitUntil: "load" });
        const loadEnd = Date.now();
        await page.waitForTimeout(1_200);
        assert.deepEqual(capturedEvents, []);

        const exitAt = Date.now();
        await page.evaluate((kind) => {
          if (kind === "visibilitychange") {
            Object.defineProperty(document, "visibilityState", {
              configurable: true,
              get: () => "hidden",
            });
            document.dispatchEvent(new Event("visibilitychange"));
          } else {
            window.dispatchEvent(new PageTransitionEvent("pagehide"));
          }
        }, exitKind);

        const gotBeacon = await waitForCondition(
          () => capturedEvents.some((ev) => ev.event === "$pageview"),
          6_000,
        );
        assert.ok(
          gotBeacon,
          `Expected cookieless $pageview via beacon on ${exitKind}`,
        );
        await page.waitForTimeout(500);

        assert.equal(capturedEvents.length, 1);
        assert.equal(capturedEvents[0].event, "$pageview");
        assert.equal(capturedEvents[0].cookieless, true);
        assert.equal(capturedEvents[0].distinct_id, "$posthog_cookieless");
        assert.equal(capturedEvents[0].current_url, `${baseUrl}/docs`);
        assert.equal(capturedEvents[0].pathname, "/docs");
        const ts = Date.parse(capturedEvents[0].timestamp);
        assert.ok(
          ts >= loadStart - 500 && ts <= loadEnd + 500 && ts <= exitAt - 800,
          `Expected original load timestamp on ${exitKind}, got ${ts} vs exit ${exitAt}`,
        );

        const storage = await assertNoPostHogStorage(page, exitKind);
        assert.ok(
          storage.beaconUrls.some((u) => isHostOrSubdomain(u, "posthog.com")),
          `Expected navigator.sendBeacon call to PostHog on ${exitKind}, got: ${JSON.stringify(storage.beaconUrls)}`,
        );
        console.log(`PASS: page exit before 10s (${exitKind})`);
      } finally {
        await context.close();
      }
    }

    // 6. Client-side navigation during the wait, then accept: two identified pageviews with own URLs and timestamps in order.
    {
      const { context, page, capturedEvents } = await createIsolatedContext(
        browser,
        baseUrl,
        UNDECIDED_CONTEXT,
      );
      try {
        const loadStart = Date.now();
        await page.goto(`${baseUrl}/docs`, { waitUntil: "load" });
        const loadEnd = Date.now();
        const firstTitle = await page.title();
        await page.waitForTimeout(1_000);
        assert.deepEqual(capturedEvents, []);

        const navStart = Date.now();
        const secondPathname = await navigateDocsLink(page);
        const navEnd = Date.now();
        await waitForCondition(
          async () => (await page.title()) !== firstTitle,
          5_000,
        );
        const secondTitle = await page.title();
        assert.notEqual(
          secondTitle,
          firstTitle,
          `Expected distinct page titles across SPA navigation, both were ${JSON.stringify(firstTitle)}`,
        );
        await page.waitForTimeout(1_000);
        assert.deepEqual(
          capturedEvents,
          [],
          "Expected both pageviews queued while consent is still unknown",
        );

        const acceptAt = Date.now();
        await dispatchConsentUpdate(page, { analytics: true });
        const gotBoth = await waitForCondition(
          () =>
            capturedEvents.filter((ev) => ev.event === "$pageview").length >= 2,
          6_000,
        );
        assert.ok(
          gotBoth,
          `Expected 2 identified $pageviews after SPA nav + accept, got: ${JSON.stringify(capturedEvents)}`,
        );
        await page.waitForTimeout(800);

        const pageviews = capturedEvents.filter(
          (ev) => ev.event === "$pageview",
        );
        assert.equal(pageviews.length, 2);
        assert.equal(pageviews[0].cookieless, false);
        assert.equal(pageviews[0].pathname, "/docs");
        assert.equal(pageviews[0].current_url, `${baseUrl}/docs`);
        assert.equal(
          pageviews[0].title,
          firstTitle,
          `Expected first queued $pageview to keep its original title ${JSON.stringify(firstTitle)}, got ${JSON.stringify(pageviews[0].title)}`,
        );
        assert.ok(pageviews[0].session_id);

        assert.equal(pageviews[1].cookieless, false);
        assert.equal(pageviews[1].pathname, secondPathname);
        assert.equal(pageviews[1].current_url, `${baseUrl}${secondPathname}`);
        assert.equal(
          pageviews[1].title,
          secondTitle,
          `Expected second queued $pageview to keep its original title ${JSON.stringify(secondTitle)}, got ${JSON.stringify(pageviews[1].title)}`,
        );
        assert.ok(pageviews[1].session_id);

        const ts0 = Date.parse(pageviews[0].timestamp);
        const ts1 = Date.parse(pageviews[1].timestamp);
        assert.ok(
          ts0 >= loadStart - 500 && ts0 <= loadEnd + 500,
          `Expected first pageview timestamp near load (${loadStart}..${loadEnd}), got ${ts0}`,
        );
        assert.ok(
          ts1 > ts0 &&
            ts1 >= navStart - 500 &&
            ts1 <= navEnd + 1_000 &&
            ts1 <= acceptAt - 500,
          `Expected second pageview timestamp (${ts1}) after first (${ts0}) and before accept (${acceptAt})`,
        );

        const storage = await inspectStorage(page);
        assert.ok(storage.cookies.includes(POSTHOG_COOKIE_NAME));
        console.log("PASS: client-side navigation during wait then accept");
      } finally {
        await context.close();
      }
    }

    // 7. Revoke after granting: cookie removed, no resend for current page, next navigation is cookieless.
    {
      const { context, page, capturedEvents } = await createIsolatedContext(
        browser,
        baseUrl,
        GRANTED_CONTEXT,
      );
      try {
        await page.goto(`${baseUrl}/docs`, { waitUntil: "load" });
        const gotInitial = await waitForCondition(
          () =>
            capturedEvents.some(
              (ev) => ev.event === "$pageview" && !ev.cookieless,
            ),
          6_000,
        );
        assert.ok(gotInitial);
        let storage = await inspectStorage(page);
        assert.ok(storage.cookies.includes(POSTHOG_COOKIE_NAME));

        const countBeforeRevoke = capturedEvents.filter(
          (ev) => ev.event === "$pageview",
        ).length;
        await dispatchConsentUpdate(page, { analytics: false });
        await page.waitForTimeout(800);

        assert.equal(
          capturedEvents.filter((ev) => ev.event === "$pageview").length,
          countBeforeRevoke,
          "Expected no resend on revoke",
        );
        await assertNoPostHogStorage(page, "after revoke", {
          checkWrites: false,
        });

        const beforeNav = capturedEvents.length;
        const nextPathname = await navigateDocsLink(page);
        const gotCookieless = await waitForCondition(
          () =>
            capturedEvents
              .slice(beforeNav)
              .some((ev) => ev.event === "$pageview"),
          6_000,
        );
        assert.ok(gotCookieless, "Expected cookieless $pageview after revoke");
        await clickAutocaptureTarget(page);
        await page.waitForTimeout(800);

        const postRevoke = capturedEvents.slice(beforeNav);
        assert.equal(postRevoke.length, 1);
        assert.equal(postRevoke[0].event, "$pageview");
        assert.equal(postRevoke[0].cookieless, true);
        assert.equal(postRevoke[0].distinct_id, "$posthog_cookieless");
        assert.equal(postRevoke[0].pathname, nextPathname);
        assert.equal(postRevoke[0].current_url, `${baseUrl}${nextPathname}`);
        await assertNoPostHogStorage(page, "navigation after revoke", {
          checkWrites: false,
        });
        console.log("PASS: revoke after granting");
      } finally {
        await context.close();
      }
    }

    // 8-10. Timeout scenarios (run concurrently in isolated contexts so total wait is ~10s):
    // - No answer (~10s cookieless)
    // - CookieYes blocked (~10s cookieless)
    // - Accept after timeout (no resend for current page; next navigation is identified)
    await Promise.all([
      (async () => {
        const { context, page, capturedEvents } = await createIsolatedContext(
          browser,
          baseUrl,
          UNDECIDED_CONTEXT,
        );
        try {
          const loadStart = Date.now();
          await page.goto(`${baseUrl}/docs`, { waitUntil: "load" });
          const loadEnd = Date.now();
          await page.waitForTimeout(5_000);
          assert.deepEqual(
            capturedEvents,
            [],
            "Expected no events at 5s while no answer",
          );

          const gotTimeout = await waitForCondition(
            () => capturedEvents.some((ev) => ev.event === "$pageview"),
            10_000,
          );
          assert.ok(gotTimeout, "Expected cookieless $pageview at ~10s");
          await clickAutocaptureTarget(page);
          await page.waitForTimeout(800);

          assert.equal(capturedEvents.length, 1);
          assert.equal(capturedEvents[0].event, "$pageview");
          assert.equal(capturedEvents[0].cookieless, true);
          assert.equal(capturedEvents[0].distinct_id, "$posthog_cookieless");
          assert.equal(capturedEvents[0].current_url, `${baseUrl}/docs`);
          assert.equal(capturedEvents[0].pathname, "/docs");
          const elapsed = capturedEvents[0].receivedAt - loadStart;
          assert.ok(
            elapsed >= 9_000 && elapsed <= 15_000,
            `Expected ~10s flush on no answer, got ${elapsed}ms`,
          );
          const ts = Date.parse(capturedEvents[0].timestamp);
          assert.ok(
            ts >= loadStart - 500 && ts <= loadEnd + 500,
            `Expected original load timestamp on no answer, got ${ts}`,
          );
          await assertNoPostHogStorage(page, "no answer timeout");
          console.log("PASS: no answer (10s timeout)");
        } finally {
          await context.close();
        }
      })(),
      (async () => {
        const { context, page, capturedEvents, requestedUrls } =
          await createIsolatedContext(browser, baseUrl, {
            blockCookieYes: true,
          });
        try {
          const loadStart = Date.now();
          await page.goto(`${baseUrl}/docs`, { waitUntil: "load" });
          const loadEnd = Date.now();
          await page.waitForTimeout(5_000);
          assert.deepEqual(
            capturedEvents,
            [],
            "Expected no events at 5s when CookieYes is blocked",
          );

          const gotTimeout = await waitForCondition(
            () => capturedEvents.some((ev) => ev.event === "$pageview"),
            10_000,
          );
          assert.ok(
            gotTimeout,
            "Expected cookieless $pageview at ~10s when CookieYes is blocked",
          );
          await clickAutocaptureTarget(page);
          await page.waitForTimeout(800);

          assert.equal(capturedEvents.length, 1);
          assert.equal(capturedEvents[0].event, "$pageview");
          assert.equal(capturedEvents[0].cookieless, true);
          assert.equal(capturedEvents[0].distinct_id, "$posthog_cookieless");
          assert.equal(capturedEvents[0].current_url, `${baseUrl}/docs`);
          assert.equal(capturedEvents[0].pathname, "/docs");
          const elapsed = capturedEvents[0].receivedAt - loadStart;
          assert.ok(
            elapsed >= 9_000 && elapsed <= 15_000,
            `Expected ~10s flush when CookieYes is blocked, got ${elapsed}ms`,
          );
          const ts = Date.parse(capturedEvents[0].timestamp);
          assert.ok(
            ts >= loadStart - 500 && ts <= loadEnd + 500,
            `Expected original load timestamp when CookieYes is blocked, got ${ts}`,
          );
          await assertNoPostHogStorage(page, "CookieYes blocked timeout");
          assertNoGtm(requestedUrls, "CookieYes blocked timeout");
          console.log("PASS: CookieYes blocked (10s timeout)");
        } finally {
          await context.close();
        }
      })(),
      (async () => {
        const { context, page, capturedEvents } = await createIsolatedContext(
          browser,
          baseUrl,
          UNDECIDED_CONTEXT,
        );
        try {
          await page.goto(`${baseUrl}/docs`, { waitUntil: "load" });
          const gotTimeout = await waitForCondition(
            () =>
              capturedEvents.some(
                (ev) => ev.event === "$pageview" && ev.cookieless === true,
              ),
            15_000,
          );
          assert.ok(gotTimeout, "Expected timeout cookieless $pageview first");

          // Accept after timeout: no second $pageview for /docs
          await dispatchConsentUpdate(page, { analytics: true });
          await page.waitForTimeout(1_000);
          assert.equal(
            capturedEvents.filter((ev) => ev.event === "$pageview").length,
            1,
            `Expected no duplicate $pageview after late accept, got: ${JSON.stringify(capturedEvents)}`,
          );
          const storage = await inspectStorage(page);
          assert.ok(storage.cookies.includes(POSTHOG_COOKIE_NAME));

          // Next navigation sends identified $pageview
          const beforeNav = capturedEvents.length;
          const nextPathname = await navigateDocsLink(page);
          const gotNext = await waitForCondition(
            () =>
              capturedEvents
                .slice(beforeNav)
                .some(
                  (ev) =>
                    ev.event === "$pageview" &&
                    ev.cookieless === false &&
                    ev.pathname === nextPathname,
                ),
            6_000,
          );
          assert.ok(
            gotNext,
            `Expected identified $pageview on next nav after late accept, got: ${JSON.stringify(capturedEvents.slice(beforeNav))}`,
          );
          const nextPageview = capturedEvents
            .slice(beforeNav)
            .find((ev) => ev.event === "$pageview");
          assert.equal(nextPageview.current_url, `${baseUrl}${nextPathname}`);
          assert.notEqual(nextPageview.distinct_id, "$posthog_cookieless");
          assert.ok(nextPageview.session_id);
          console.log("PASS: accept after timeout");
        } finally {
          await context.close();
        }
      })(),
    ]);

    assert.deepEqual(
      allGtmRequests,
      [],
      `Expected zero GTM requests across all scenarios, got: ${JSON.stringify(allGtmRequests)}`,
    );
  } finally {
    await browser.close();
    stopProcessTree(started?.proc);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
