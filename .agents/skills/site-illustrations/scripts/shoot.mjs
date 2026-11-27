#!/usr/bin/env node
// Screenshot a page or a local HTML file with headless Chrome over the DevTools protocol.
// No dependencies: Node 22 or newer, and Chrome.
//
//   node shoot.mjs URL_OR_FILE OUT.png [--width 1440] [--height N] [--scale 2] [--dark] [--selector CSS] [--wait 300]
//
//   --width     viewport width in CSS px. Below 500 the page is laid out as a phone of that width.
//   --height    viewport height. Left out, the picture covers the whole page.
//   --scale     device scale factor. The tilted drawings show at 0.6, so 1.6667 gives one plane unit
//               per pixel: the scale of the original exports, which measure.py expects.
//   --dark      prefers-color-scheme: dark. Stops with an error on a page that forces light mode
//               (the homepage and the marketing pages), instead of saving a light picture.
//   --selector  cut the picture to the first element that matches. It is scrolled into view first.
//   --wait      milliseconds to wait after the fonts have loaded.
//
// The Next.js dev badge is hidden. Set CHROME=/path/to/chrome when Chrome is not found.
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const args = process.argv.slice(2);
const flags = {
  width: 1440,
  height: 0,
  scale: 2,
  wait: 300,
  dark: false,
  selector: "",
};
const positional = [];
for (let i = 0; i < args.length; i++) {
  const name = args[i].startsWith("--") ? args[i].slice(2) : null;
  if (name === null) positional.push(args[i]);
  else if (!(name in flags)) fail(`unknown option --${name}`);
  else if (name === "dark") flags.dark = true;
  else if (name === "selector") flags.selector = args[++i];
  else flags[name] = Number(args[++i]);
}
if (
  positional.length !== 2 ||
  [flags.width, flags.height, flags.scale, flags.wait].some(Number.isNaN)
) {
  fail(
    "usage: shoot.mjs URL_OR_FILE OUT.png [--width N] [--height N] [--scale N] [--dark] [--selector CSS] [--wait MS]",
  );
}
const [target, out] = positional;

function fail(message) {
  console.error(message);
  process.exit(1);
}

function targetUrl(value) {
  if (/^(https?|file):/.test(value)) return value;
  const cut = value.indexOf("?");
  const path = cut < 0 ? value : value.slice(0, cut);
  if (!existsSync(path)) fail(`${path}: no such file`);
  return pathToFileURL(resolve(path)).href + (cut < 0 ? "" : value.slice(cut));
}

function findChrome() {
  const candidates = [
    process.env.CHROME,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "google-chrome",
    "chromium",
    "chromium-browser",
  ];
  for (const c of candidates) {
    if (!c) continue;
    if (c.includes("/") ? existsSync(c) : spawnSync("which", [c]).status === 0)
      return c;
  }
  fail("Chrome not found; set CHROME=/path/to/chrome");
}

function within(promise, ms, what) {
  let timer;
  const late = new Promise(
    (_, no) =>
      (timer = setTimeout(
        () => no(new Error(`${what}: no answer in ${ms / 1000} s`)),
        ms,
      )),
  );
  return Promise.race([promise, late]).finally(() => clearTimeout(timer));
}

const url = targetUrl(target);
const profile = mkdtempSync(join(tmpdir(), "shoot-"));
const chrome = spawn(
  findChrome(),
  [
    "--headless=new",
    "--remote-debugging-port=0",
    `--user-data-dir=${profile}`,
    "--no-first-run",
    "--disable-gpu",
    "--hide-scrollbars",
    "about:blank",
  ],
  { stdio: ["ignore", "ignore", "pipe"] },
);

try {
  const endpoint = await within(
    new Promise((ok, no) => {
      let log = "";
      chrome.stderr.on("data", (chunk) => {
        log += chunk;
        const found = log.match(/DevTools listening on (ws:\/\/\S+)/);
        if (found) ok(found[1]);
      });
      chrome.on("exit", () =>
        no(new Error(`Chrome exited before it was ready:\n${log}`)),
      );
    }),
    20000,
    "starting Chrome",
  );

  const socket = new WebSocket(endpoint);
  await within(
    new Promise(
      (ok, no) => (
        (socket.onopen = ok),
        (socket.onerror = () => no(new Error("cannot reach Chrome")))
      ),
    ),
    10000,
    "connecting",
  );
  const pending = new Map();
  const events = new Map();
  let lastId = 0;
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    if (message.id) {
      const call = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) call.no(new Error(message.error.message));
      else call.ok(message.result);
    } else if (events.has(message.method)) {
      events.get(message.method)(message.params);
      events.delete(message.method);
    }
  };
  const send = (method, params = {}, sessionId) =>
    within(
      new Promise(
        (ok, no) => (
          pending.set(++lastId, { ok, no }),
          socket.send(JSON.stringify({ id: lastId, method, params, sessionId }))
        ),
      ),
      60000,
      method,
    );

  const { targetId } = await send("Target.createTarget", {
    url: "about:blank",
  });
  const { sessionId } = await send("Target.attachToTarget", {
    targetId,
    flatten: true,
  });
  const page = (method, params) => send(method, params, sessionId);
  const evaluate = async (expression) => {
    const answer = await page("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (answer.exceptionDetails)
      throw new Error(
        answer.exceptionDetails.exception?.description ||
          answer.exceptionDetails.text,
      );
    return answer.result.value;
  };

  await page("Page.enable");
  await page("Emulation.setDeviceMetricsOverride", {
    width: flags.width,
    height: flags.height || 900,
    deviceScaleFactor: flags.scale,
    mobile: flags.width < 500,
  });
  if (flags.dark)
    await page("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-color-scheme", value: "dark" }],
    });

  const loaded = new Promise((ok) => events.set("Page.loadEventFired", ok));
  const navigation = await page("Page.navigate", { url });
  if (navigation.errorText) throw new Error(`${url}: ${navigation.errorText}`);
  await within(loaded, 60000, `loading ${url}`);
  const settle = `document.fonts.ready.then(() => new Promise((done) => setTimeout(done, ${flags.wait})))`;
  await evaluate(settle);
  await evaluate(
    `document.head.insertAdjacentHTML("beforeend", "<style>nextjs-portal{display:none!important}</style>")`,
  );
  if (flags.dark) {
    const forcedLight = await evaluate(
      `(() => { const c = document.documentElement.classList; return c.contains("light") && !c.contains("dark"); })()`,
    );
    if (forcedLight)
      throw new Error(
        `${url} forces light mode, so there is no dark picture to take. Nothing was saved.`,
      );
  }

  let clip;
  if (flags.selector) {
    const find = `document.querySelector(${JSON.stringify(flags.selector)})`;
    if (!(await evaluate(`Boolean(${find})`)))
      throw new Error(`nothing on the page matches ${flags.selector}`);
    await evaluate(`${find}.scrollIntoView({ block: "center" })`);
    await evaluate(settle);
    const box = await evaluate(
      `(() => { const r = ${find}.getBoundingClientRect(); return { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height }; })()`,
    );
    clip = { ...box, scale: 1 };
  } else if (!flags.height) {
    const { cssContentSize } = await page("Page.getLayoutMetrics");
    clip = {
      x: 0,
      y: 0,
      width: flags.width,
      height: Math.ceil(cssContentSize.height),
      scale: 1,
    };
  }
  const shot = await page("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: Boolean(clip),
    ...(clip && { clip }),
  });
  const png = Buffer.from(shot.data, "base64");
  writeFileSync(out, png);
  console.log(
    `${out}: ${png.readUInt32BE(16)}x${png.readUInt32BE(20)} px, viewport ${flags.width} CSS px wide at ${flags.scale}x`,
  );
  await send("Browser.close").catch(() => {});
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  chrome.kill();
  rmSync(profile, {
    recursive: true,
    force: true,
    maxRetries: 10,
    retryDelay: 100,
  });
}
process.exit();
