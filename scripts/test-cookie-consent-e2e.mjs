import assert from "node:assert/strict";
import fs from "node:fs";
import net from "node:net";
import zlib from "node:zlib";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const POSTHOG_KEY = "phc_test_cookie_consent";
const POSTHOG_HOST = "https://eu.posthog.com";
const POSTHOG_COOKIE_NAME = `ph_${POSTHOG_KEY}_posthog`;
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
    cookieless: ev.properties?.$cookieless_mode === true,
    session_id: ev.properties?.$session_id ?? null,
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

async function assertCookielessOnlyNoStorage(page, capturedEvents, label) {
  const gotPageview = await waitForCondition(
    () => capturedEvents.some((ev) => ev.event === "$pageview"),
    10_000,
  );
  assert.ok(
    gotPageview,
    `Expected cookieless $pageview on ${label}, got: ${JSON.stringify(capturedEvents)}`,
  );
  // Click a real button to verify autocapture stays disabled while unconsented.
  await clickAutocaptureTarget(page);
  await page.waitForTimeout(1000);

  const nonPageviews = capturedEvents.filter((ev) => ev.event !== "$pageview");
  assert.deepEqual(
    nonPageviews,
    [],
    `Expected only $pageview events on ${label}, got: ${JSON.stringify(capturedEvents)}`,
  );
  assert.ok(
    capturedEvents.every(
      (ev) =>
        ev.cookieless === true && ev.distinct_id === "$posthog_cookieless",
    ),
    `Expected every event on ${label} to have $cookieless_mode: true, got: ${JSON.stringify(capturedEvents)}`,
  );

  const storage = await inspectStorage(page);
  assert.deepEqual(
    storage.cookies.filter((c) => c.startsWith("ph_")),
    [],
    `Expected no ph_* cookies on ${label}, got: ${JSON.stringify(storage.cookies)}`,
  );
  assert.deepEqual(
    storage.cookieWrites.filter(
      (w) =>
        w.startsWith("ph_") ||
        w.startsWith("__ph_cookie_support_") ||
        w.startsWith("dmn_chk_"),
    ),
    [],
    `Expected no PostHog cookie writes (including __ph_cookie_support_*) on ${label}, got: ${JSON.stringify(storage.cookieWrites)}`,
  );
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
}

async function run() {
  const externalBaseUrl = process.env.COOKIE_CONSENT_E2E_URL;
  const started = externalBaseUrl ? null : await startLocalServer();
  const baseUrl = externalBaseUrl ?? started.baseUrl;
  const browser = await launchChromium();

  try {
    // 1. No answer (CookieYes loaded, visitor has not chosen yet):
    // cookieless $pageview only, zero PostHog cookies/localStorage/sessionStorage.
    {
      const { context, page, capturedEvents } = await createIsolatedContext(
        browser,
        baseUrl,
        {
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
        },
      );
      try {
        await page.goto(`${baseUrl}/docs`, { waitUntil: "networkidle" });
        await assertCookielessOnlyNoStorage(page, capturedEvents, "no answer");
        console.log("PASS: no answer");
      } finally {
        await context.close();
      }
    }

    // 2. CookieYes blocked (no cookie, no window.getCkyConsent):
    // identical to no answer — cookieless $pageview only, zero PostHog storage.
    {
      const { context, page, capturedEvents } = await createIsolatedContext(
        browser,
        baseUrl,
      );
      try {
        await page.goto(`${baseUrl}/docs`, { waitUntil: "networkidle" });
        await assertCookielessOnlyNoStorage(
          page,
          capturedEvents,
          "CookieYes blocked",
        );
        console.log("PASS: CookieYes blocked");
      } finally {
        await context.close();
      }
    }

    // 3. Rejected (denied):
    // identical to no answer — cookieless $pageview only, zero PostHog storage
    // (including no __ph_opt_in_out_* flag and no __ph_cookie_support_* cookie).
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
        await assertCookielessOnlyNoStorage(page, capturedEvents, "rejected");
        console.log("PASS: rejected");
      } finally {
        await context.close();
      }
    }

    // 4. Granted:
    // non-cookieless $pageview + autocapture on click, and ph_<key>_posthog cookie is set.
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
                ev.distinct_id !== "$posthog_cookieless" &&
                ev.session_id,
            ),
          10_000,
        );
        assert.ok(
          gotPageview,
          `Expected non-cookieless $pageview with session_id on granted consent, got: ${JSON.stringify(capturedEvents)}`,
        );

        await clickAutocaptureTarget(page);
        const gotAutocapture = await waitForCondition(
          () =>
            capturedEvents.some(
              (ev) => ev.event === "$autocapture" && !ev.cookieless,
            ),
          10_000,
        );
        assert.ok(
          gotAutocapture,
          `Expected non-pageview ($autocapture) event on granted consent, got: ${JSON.stringify(capturedEvents)}`,
        );

        const storage = await inspectStorage(page);
        assert.ok(
          storage.cookies.includes(POSTHOG_COOKIE_NAME),
          `Expected ${POSTHOG_COOKIE_NAME} cookie on granted consent, got: ${JSON.stringify(storage.cookies)}`,
        );
        console.log("PASS: granted");
      } finally {
        await context.close();
      }
    }

    // 5. Transitions without reload:
    // - unknown -> granted on the same page: one consented $pageview, cookie set,
    //   session_id initialized, and non-pageview events enabled.
    // - granted -> denied: cookie removed, zero PostHog storage (including no
    //   __ph_opt_in_out_*), and back to cookieless $pageview only on navigation.
    {
      const { context, page, capturedEvents } = await createIsolatedContext(
        browser,
        baseUrl,
      );
      try {
        await page.goto(`${baseUrl}/docs`, { waitUntil: "networkidle" });
        await assertCookielessOnlyNoStorage(
          page,
          capturedEvents,
          "initial unknown before grant",
        );

        // unknown -> granted on the same page
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
                  ev.distinct_id &&
                  ev.distinct_id !== "$posthog_cookieless" &&
                  ev.session_id,
              ),
          10_000,
        );
        assert.ok(
          gotGrantedPageview,
          `Expected consented $pageview with session_id after unknown -> granted, got: ${JSON.stringify(capturedEvents.slice(beforeGrant))}`,
        );
        await page.waitForTimeout(800);
        const consentedPageviews = capturedEvents
          .slice(beforeGrant)
          .filter((ev) => ev.event === "$pageview" && !ev.cookieless);
        assert.equal(
          consentedPageviews.length,
          1,
          `Expected exactly one consented $pageview on unknown -> granted, got: ${JSON.stringify(consentedPageviews)}`,
        );

        await clickAutocaptureTarget(page);
        const gotAutocaptureAfterGrant = await waitForCondition(
          () =>
            capturedEvents
              .slice(beforeGrant)
              .some((ev) => ev.event === "$autocapture" && !ev.cookieless),
          10_000,
        );
        assert.ok(
          gotAutocaptureAfterGrant,
          `Expected $autocapture after unknown -> granted, got: ${JSON.stringify(capturedEvents.slice(beforeGrant))}`,
        );

        let storage = await inspectStorage(page);
        assert.ok(storage.cookies.includes(POSTHOG_COOKIE_NAME));

        // granted -> denied: cookie removed, zero PostHog storage, back to cookieless pageviews
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
        assert.deepEqual(
          storage.localStorageKeys.filter(isPostHogStorageKey),
          [],
          "Expected no PostHog localStorage keys (including __ph_opt_in_out_*) on granted -> denied",
        );
        assert.deepEqual(
          storage.sessionStorageKeys.filter(isPostHogStorageKey),
          [],
          "Expected no PostHog sessionStorage keys on granted -> denied",
        );

        // Navigate SPA to another page while denied and verify cookieless $pageview resumes
        const beforeNav = capturedEvents.length;
        await page.evaluate(() => {
          const link = Array.from(document.querySelectorAll("a[href]")).find(
            (a) => {
              const href = a.getAttribute("href") || "";
              return href.startsWith("/docs/") && href !== "/docs";
            },
          );
          if (link) link.click();
        });
        const gotCookielessAfterRevoke = await waitForCondition(
          () =>
            capturedEvents
              .slice(beforeNav)
              .some(
                (ev) =>
                  ev.event === "$pageview" &&
                  ev.cookieless === true &&
                  ev.distinct_id === "$posthog_cookieless",
              ),
          10_000,
        );
        assert.ok(
          gotCookielessAfterRevoke,
          `Expected cookieless $pageview after navigation post-revoke, got: ${JSON.stringify(capturedEvents.slice(beforeNav))}`,
        );
        await page.waitForTimeout(800);
        const nonPageviewsAfterRevoke = capturedEvents
          .slice(beforeNav)
          .filter((ev) => ev.event !== "$pageview");
        assert.deepEqual(
          nonPageviewsAfterRevoke,
          [],
          `Expected only $pageview events after revoke, got: ${JSON.stringify(capturedEvents.slice(beforeNav))}`,
        );
        storage = await inspectStorage(page);
        assert.deepEqual(
          storage.cookies.filter((c) => c.startsWith("ph_")),
          [],
        );
        assert.deepEqual(
          storage.localStorageKeys.filter(isPostHogStorageKey),
          [],
        );
        assert.deepEqual(
          storage.sessionStorageKeys.filter(isPostHogStorageKey),
          [],
        );
        console.log(
          "PASS: transitions (unknown -> granted, granted -> denied)",
        );
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
