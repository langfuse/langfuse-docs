import assert from "node:assert/strict";
import fs from "node:fs";
import net from "node:net";
import zlib from "node:zlib";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const POSTHOG_KEY = "phc_test_cookie_consent";
const POSTHOG_HOST = "https://eu.posthog.com";
const POSTHOG_COOKIE_NAME = `ph_${POSTHOG_KEY}_posthog`;
const POSTHOG_OPTOUT_KEY = `__ph_opt_in_out_${POSTHOG_KEY}`;
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

async function startLocalServer() {
  const port = await getFreePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const env = {
    ...process.env,
    NEXT_PUBLIC_POSTHOG_KEY: POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: POSTHOG_HOST,
    NEXT_TELEMETRY_DISABLED: "1",
  };

  // Next.js can exit on first run after printing an upgrade notice; retry once.
  for (let attempt = 0; attempt < 2; attempt++) {
    let logs = "";
    const proc = spawn(
      process.platform === "win32" ? "pnpm.cmd" : "pnpm",
      ["exec", "next", "dev", "-p", String(port), "-H", "127.0.0.1"],
      {
        env,
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
      if (attempt === 1) {
        throw new Error(
          `Failed to start Next.js dev server: ${err.message}\n${logs.slice(-2000)}`,
        );
      }
    }
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
  return batch.map((ev) => ({
    event: ev.event,
    distinct_id: ev.properties?.distinct_id ?? ev.distinct_id ?? null,
    cookieless: Boolean(ev.properties?.$cookieless_mode),
    pathname: ev.properties?.$pathname ?? null,
  }));
}

function isPostHogStorageKey(key) {
  return (
    key.startsWith("ph_") ||
    key.startsWith("__ph_") ||
    key.includes(POSTHOG_KEY)
  );
}

async function createIsolatedContext(browser, baseUrl, options = {}) {
  const { cookieyesCookie, initialConsent } = options;
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
    // posthog-js treats navigator.webdriver === true as a bot and drops events;
    // override only inside this E2E context so real PostHog capture runs without
    // weakening production bot filtering.
    Object.defineProperty(navigator, "webdriver", { get: () => false });
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
    if (consent) {
      window.getCkyConsent = () => consent;
    }
  }, initialConsent ?? null);

  const capturedEvents = [];

  await context.route("**/*", async (route) => {
    const request = route.request();
    const url = request.url();

    if (url.startsWith(baseUrl)) {
      await route.continue();
      return;
    }

    const parsed = new URL(url);
    if (
      parsed.hostname === "eu.posthog.com" ||
      parsed.hostname.endsWith(".posthog.com")
    ) {
      const corsHeaders = {
        "access-control-allow-origin": baseUrl,
        "access-control-allow-credentials": "true",
        "access-control-allow-headers": "*",
      };

      if (request.method() === "OPTIONS") {
        await route.fulfill({ status: 204, headers: corsHeaders });
        return;
      }

      if (parsed.pathname.includes("/config.js")) {
        await route.fulfill({
          status: 200,
          headers: corsHeaders,
          contentType: "application/javascript",
          body: `window._POSTHOG_REMOTE_CONFIG = window._POSTHOG_REMOTE_CONFIG || {}; window._POSTHOG_REMOTE_CONFIG[${JSON.stringify(POSTHOG_KEY)}] = { config: { heatmaps: false, captureDeadClicks: false, autocaptureExceptions: false, sessionRecording: false, surveys: false } };`,
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

    // Stub all non-local third-party scripts/requests (GTM, CookieYes, etc.)
    // so tests are deterministic and never reach external services.
    await route.fulfill({
      status: 200,
      contentType: "text/plain",
      body: "",
    });
  });

  const page = await context.newPage();
  return { context, page, capturedEvents };
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
    cookieWrites: window.__cookieWrites ?? [],
    cookies: document.cookie
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => s.split("=")[0]),
    localStorageKeys: Object.keys(localStorage),
    sessionStorageKeys: Object.keys(sessionStorage),
  }));
}

async function run() {
  const externalBaseUrl = process.env.COOKIE_CONSENT_E2E_URL;
  const started = externalBaseUrl ? null : await startLocalServer();
  const baseUrl = externalBaseUrl ?? started.baseUrl;
  const browser = await launchChromium();

  try {
    // 1. Unknown (no choice / CookieYes not loaded):
    // zero PostHog event requests, no ph_* or __ph_cookie_support_* cookies,
    // no PostHog localStorage or sessionStorage keys.
    {
      const { context, page, capturedEvents } = await createIsolatedContext(
        browser,
        baseUrl,
      );
      try {
        await page.goto(`${baseUrl}/docs`, { waitUntil: "networkidle" });
        await page.waitForTimeout(2500);

        const storage = await inspectStorage(page);
        assert.deepEqual(
          capturedEvents,
          [],
          `Expected zero PostHog events on unknown consent, got: ${JSON.stringify(capturedEvents)}`,
        );
        assert.deepEqual(
          storage.cookies.filter((c) => c.startsWith("ph_")),
          [],
          `Expected no ph_* cookies on unknown consent, got: ${JSON.stringify(storage.cookies)}`,
        );
        assert.deepEqual(
          storage.cookieWrites.filter(
            (w) =>
              w.startsWith("ph_") ||
              w.startsWith("__ph_cookie_support_") ||
              w.startsWith("dmn_chk_"),
          ),
          [],
          `Expected no PostHog cookie writes on unknown consent, got: ${JSON.stringify(storage.cookieWrites)}`,
        );
        assert.deepEqual(
          storage.localStorageKeys.filter(isPostHogStorageKey),
          [],
          `Expected no PostHog localStorage keys on unknown consent, got: ${JSON.stringify(storage.localStorageKeys)}`,
        );
        assert.deepEqual(
          storage.sessionStorageKeys.filter(isPostHogStorageKey),
          [],
          `Expected no PostHog sessionStorage keys on unknown consent, got: ${JSON.stringify(storage.sessionStorageKeys)}`,
        );
        console.log("PASS: unknown consent");
      } finally {
        await context.close();
      }
    }

    // 2. Denied (rejected):
    // at least one cookieless $pageview and no other event names,
    // no ph_* or __ph_cookie_support_* cookies,
    // only PostHog's opt-out flag in localStorage, no PostHog sessionStorage keys.
    {
      const { context, page, capturedEvents } = await createIsolatedContext(
        browser,
        baseUrl,
        {
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
        },
      );
      try {
        await page.goto(`${baseUrl}/docs`, { waitUntil: "networkidle" });
        const gotPageview = await waitForCondition(
          () => capturedEvents.some((ev) => ev.event === "$pageview"),
          10_000,
        );
        assert.ok(
          gotPageview,
          `Expected cookieless $pageview on denied consent, got: ${JSON.stringify(capturedEvents)}`,
        );
        await page.waitForTimeout(1000);

        const nonPageviews = capturedEvents.filter(
          (ev) => ev.event !== "$pageview",
        );
        assert.deepEqual(
          nonPageviews,
          [],
          `Expected only $pageview events on denied consent, got: ${JSON.stringify(capturedEvents)}`,
        );
        assert.ok(
          capturedEvents.every(
            (ev) => ev.cookieless && ev.distinct_id === "$posthog_cookieless",
          ),
          `Expected cookieless events on denied consent, got: ${JSON.stringify(capturedEvents)}`,
        );

        const storage = await inspectStorage(page);
        assert.deepEqual(
          storage.cookies.filter((c) => c.startsWith("ph_")),
          [],
          `Expected no ph_* cookies on denied consent, got: ${JSON.stringify(storage.cookies)}`,
        );
        assert.deepEqual(
          storage.cookieWrites.filter(
            (w) =>
              w.startsWith("ph_") ||
              w.startsWith("__ph_cookie_support_") ||
              w.startsWith("dmn_chk_"),
          ),
          [],
          `Expected no PostHog cookie writes on denied consent, got: ${JSON.stringify(storage.cookieWrites)}`,
        );
        assert.deepEqual(
          storage.localStorageKeys.filter(isPostHogStorageKey),
          [POSTHOG_OPTOUT_KEY],
          `Expected only PostHog opt-out flag in localStorage on denied consent, got: ${JSON.stringify(storage.localStorageKeys)}`,
        );
        assert.deepEqual(
          storage.sessionStorageKeys.filter(isPostHogStorageKey),
          [],
          `Expected no PostHog sessionStorage keys on denied consent, got: ${JSON.stringify(storage.sessionStorageKeys)}`,
        );
        console.log("PASS: denied consent");
      } finally {
        await context.close();
      }
    }

    // 3. Granted:
    // events including non-cookieless $pageview, and ph_<key>_posthog cookie is set.
    {
      const { context, page, capturedEvents } = await createIsolatedContext(
        browser,
        baseUrl,
        {
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
        },
      );
      try {
        await page.goto(`${baseUrl}/docs`, { waitUntil: "networkidle" });
        const gotPageview = await waitForCondition(
          () =>
            capturedEvents.some(
              (ev) =>
                ev.event === "$pageview" &&
                !ev.cookieless &&
                ev.distinct_id &&
                ev.distinct_id !== "$posthog_cookieless",
            ),
          10_000,
        );
        assert.ok(
          gotPageview,
          `Expected non-cookieless $pageview on granted consent, got: ${JSON.stringify(capturedEvents)}`,
        );

        const storage = await inspectStorage(page);
        assert.ok(
          storage.cookies.includes(POSTHOG_COOKIE_NAME),
          `Expected ${POSTHOG_COOKIE_NAME} cookie on granted consent, got: ${JSON.stringify(storage.cookies)}`,
        );
        console.log("PASS: granted consent");
      } finally {
        await context.close();
      }
    }

    // 4. In-session transitions without reload:
    // unknown -> denied -> granted -> denied, plus granted -> unknown.
    {
      const { context, page, capturedEvents } = await createIsolatedContext(
        browser,
        baseUrl,
      );
      try {
        await page.goto(`${baseUrl}/docs`, { waitUntil: "networkidle" });
        await page.waitForTimeout(1500);
        assert.deepEqual(capturedEvents, []);

        // unknown -> denied
        await page.evaluate(() => {
          window.getCkyConsent = () => ({
            activeLaw: "gdpr",
            categories: {
              necessary: true,
              functional: false,
              analytics: false,
              advertisement: false,
            },
            isUserActionCompleted: true,
          });
          document.dispatchEvent(new Event("cookieyes_consent_update"));
        });
        const gotDeniedPageview = await waitForCondition(
          () =>
            capturedEvents.some(
              (ev) => ev.event === "$pageview" && ev.cookieless,
            ),
          10_000,
        );
        assert.ok(
          gotDeniedPageview,
          `Expected cookieless $pageview after unknown -> denied transition, got: ${JSON.stringify(capturedEvents)}`,
        );
        let storage = await inspectStorage(page);
        assert.deepEqual(
          storage.cookies.filter((c) => c.startsWith("ph_")),
          [],
        );
        assert.deepEqual(
          storage.cookieWrites.filter(
            (w) =>
              w.startsWith("ph_") ||
              w.startsWith("__ph_cookie_support_") ||
              w.startsWith("dmn_chk_"),
          ),
          [],
        );
        assert.deepEqual(storage.localStorageKeys.filter(isPostHogStorageKey), [
          POSTHOG_OPTOUT_KEY,
        ]);

        // denied -> granted
        const beforeGrant = capturedEvents.length;
        await page.evaluate(() => {
          window.getCkyConsent = () => ({
            activeLaw: "gdpr",
            categories: {
              necessary: true,
              functional: true,
              analytics: true,
              advertisement: true,
            },
            isUserActionCompleted: true,
          });
          document.dispatchEvent(new Event("cookieyes_consent_update"));
        });
        const gotGrantedPageview = await waitForCondition(
          () =>
            capturedEvents
              .slice(beforeGrant)
              .some(
                (ev) =>
                  ev.event === "$pageview" &&
                  !ev.cookieless &&
                  ev.distinct_id !== "$posthog_cookieless",
              ),
          10_000,
        );
        assert.ok(
          gotGrantedPageview,
          `Expected consented $pageview after denied -> granted transition, got: ${JSON.stringify(capturedEvents.slice(beforeGrant))}`,
        );
        storage = await inspectStorage(page);
        assert.ok(storage.cookies.includes(POSTHOG_COOKIE_NAME));

        // granted -> denied
        await page.evaluate(() => {
          window.getCkyConsent = () => ({
            activeLaw: "gdpr",
            categories: {
              necessary: true,
              functional: false,
              analytics: false,
              advertisement: false,
            },
            isUserActionCompleted: true,
          });
          document.dispatchEvent(new Event("cookieyes_consent_update"));
        });
        await page.waitForTimeout(500);
        storage = await inspectStorage(page);
        assert.deepEqual(
          storage.cookies.filter((c) => c.startsWith("ph_")),
          [],
          "Expected ph_* cookie removed on granted -> denied",
        );
        assert.deepEqual(storage.localStorageKeys.filter(isPostHogStorageKey), [
          POSTHOG_OPTOUT_KEY,
        ]);
        assert.deepEqual(
          storage.sessionStorageKeys.filter(isPostHogStorageKey),
          [],
        );

        // denied -> granted -> unknown
        await page.evaluate(() => {
          window.getCkyConsent = () => ({
            activeLaw: "gdpr",
            categories: {
              necessary: true,
              functional: true,
              analytics: true,
              advertisement: true,
            },
            isUserActionCompleted: true,
          });
          document.dispatchEvent(new Event("cookieyes_consent_update"));
        });
        await page.waitForTimeout(500);
        storage = await inspectStorage(page);
        assert.ok(storage.cookies.includes(POSTHOG_COOKIE_NAME));

        await page.evaluate(() => {
          delete window.getCkyConsent;
          document.dispatchEvent(new Event("cookieyes_consent_update"));
        });
        await page.waitForTimeout(500);
        storage = await inspectStorage(page);
        assert.deepEqual(
          storage.cookies.filter((c) => c.startsWith("ph_")),
          [],
          "Expected ph_* cookie removed on granted -> unknown",
        );
        assert.deepEqual(
          storage.localStorageKeys.filter(isPostHogStorageKey),
          [],
          "Expected no opt-out flag left on granted -> unknown",
        );
        assert.deepEqual(
          storage.sessionStorageKeys.filter(isPostHogStorageKey),
          [],
        );
        console.log("PASS: in-session transitions without reload");
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
    stopProcessTree(started?.proc);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
