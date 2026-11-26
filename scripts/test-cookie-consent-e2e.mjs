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
    // 1. Returning visitor with stored consent: identified pageview immediately, no delay.
    {
      const { context, page, capturedEvents } = await createIsolatedContext(
        browser,
        baseUrl,
        GRANTED_CONTEXT,
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

        // Pre-warm the first internal /docs/* link so later SPA navigation tests
        // do not pay a cold Next.js dev compile inside the 10s consent window.
        await navigateDocsLink(page);
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
          storage.beaconUrls.some((u) => u.includes("posthog.com")),
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
        const { context, page, capturedEvents } = await createIsolatedContext(
          browser,
          baseUrl,
        );
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
  } finally {
    await browser.close();
    stopProcessTree(started?.proc);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
