import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { setTimeout as delay } from "node:timers/promises";
import test from "node:test";
import ts from "typescript";
import puppeteer from "puppeteer";

const compile = (path) =>
  ts.transpileModule(
    readFileSync(new URL("../" + path, import.meta.url), "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
      },
    },
  ).outputText;
const sources = {
  regions: compile("lib/cloud-regions.ts"),
  analytics: compile("lib/use-case-analytics.ts"),
  tracker: compile("components/analytics/UseCaseAnalytics.tsx"),
};
function load(source, require) {
  const module = { exports: {} };
  new Function("require", "module", "exports", source)(
    require,
    module,
    module.exports,
  );
  return module.exports;
}
const regions = load(sources.regions, () => {
  throw Error("Unexpected import");
});
const api = load(sources.analytics, () => regions);
const origin = "https://langfuse.com";
const attribution = {
  use_case: "coding_agents",
  section: "hero",
  action: "start_free",
  setup_path: "hooks",
};

test("conversion URLs preserve campaign parameters, region paths, fragments, and existing query values", () => {
  const href =
    "/cloud/auth/sign-up?utm_source=newsletter&utm_campaign=launch&next=hello#signup";
  const output = new URL(
    api.withUseCaseAttribution(href, origin, attribution),
    origin,
  );
  assert.equal(output.searchParams.get("utm_source"), "newsletter");
  assert.equal(output.searchParams.get("utm_campaign"), "launch");
  assert.equal(output.searchParams.get("next"), "hello");
  assert.equal(output.searchParams.get("lf_use_case"), "coding_agents");
  assert.equal(output.searchParams.get("lf_setup_path"), "hooks");
  assert.equal(output.hash, "#signup");
  for (const { url } of Object.values(regions.cloudRegions)) {
    const tagged = new URL(
      api.withUseCaseAttribution(
        url + "/auth/sign-up?utm_source=email#form",
        origin,
        attribution,
      ),
    );
    assert.equal(tagged.hostname, new URL(url).hostname);
    assert.equal(tagged.searchParams.get("lf_section"), "hero");
    assert.equal(tagged.hash, "#form");
  }
  assert.equal(
    api.withUseCaseAttribution(
      "/docs?utm_source=email#start",
      origin,
      attribution,
    ),
    "/docs?utm_source=email#start",
  );
  assert.equal(
    api.withUseCaseAttribution(
      "https://example.com/cloud",
      origin,
      attribution,
    ),
    "https://example.com/cloud",
  );
  assert.equal(
    api.destinationGroup(
      new URL("https://cloud.langfuse.com.evil.example"),
      origin,
    ),
    "other",
  );
});

test("attribution rejects malformed values and expires after 30 minutes", () => {
  assert.equal(
    api.attributionFromParams(
      new URLSearchParams(
        "lf_use_case=anything&lf_section=hero&lf_action=start_free",
      ),
    ),
    null,
  );
  assert.equal(
    api.attributionFromParams(
      new URLSearchParams(
        "lf_use_case=chat_agents&lf_section=email@example.com&lf_action=start_free",
      ),
    ),
    null,
  );
  const storage = new Map();
  globalThis.window = { location: { search: "" } };
  globalThis.sessionStorage = {
    getItem: (key) => storage.get(key),
    setItem: (key, value) => storage.set(key, value),
  };
  api.rememberUseCaseAttribution(attribution);
  assert.deepEqual(api.readUseCaseAttribution(), attribution);
  const key = [...storage.keys()][0];
  storage.set(
    key,
    JSON.stringify({ ...attribution, expires_at: Date.now() - 1 }),
  );
  assert.equal(api.readUseCaseAttribution(), null);
  globalThis.sessionStorage = {
    getItem() {
      throw Error("blocked");
    },
    setItem() {
      throw Error("blocked");
    },
  };
  assert.doesNotThrow(() => api.rememberUseCaseAttribution(attribution));
  assert.equal(api.readUseCaseAttribution(), null);
  delete globalThis.window;
  delete globalThis.sessionStorage;
});

function installBrowserTracker(sources) {
  window.captures = [];
  window.cleanups = [];
  const modules = {};
  const load = (source) => {
    const module = { exports: {} };
    new Function("require", "module", "exports", source)(
      (name) => {
        if (name === "./cloud-regions") return modules.regions;
        if (name === "@/lib/use-case-analytics") return modules.analytics;
        if (name === "react")
          return {
            useRef: () => ({ current: null }),
            useEffect: (run) => window.cleanups.push(run()),
          };
        if (name === "next/navigation")
          return { usePathname: () => window.location.pathname };
        if (name === "posthog-js/react")
          return {
            usePostHog: () => ({
              capture: (event, props) => window.captures.push({ event, props }),
            }),
          };
        throw Error(name);
      },
      module,
      module.exports,
    );
    return module.exports;
  };
  modules.regions = load(sources.regions);
  modules.analytics = load(sources.analytics);
  const tracker = load(sources.tracker);
  tracker.UseCaseAnalytics({ ready: true });
  window.interact = modules.analytics.dispatchUseCaseInteraction;
}

test("browser: exposure, hidden panels, fast clicks, modifier clicks, path switches, and cleanup", async () => {
  const fixture = `<!doctype html><style>body{margin:0}a{display:block;width:220px;height:45px;margin:4px}section{margin:8px}.invisible{visibility:hidden}</style>
    <nav><a id="nav" href="/cloud?utm_source=email#form">Start free</a></nav>
    <main data-use-case="coding_agents" data-use-case-page="/coding-agents">
      <div id="dial" data-use-case-path="gateway">
        <section data-use-case-section="hero">
          <a id="hero" href="/cloud">Start free</a>
          <a id="sales" href="/talk-to-us">Talk to sales</a>
          <a id="quick" href="/docs/observability/get-started" data-use-case-action="quickstart">Quickstart</a>
        </section>
        <section data-use-case-section="benefits">
          <div hidden><a id="hidden" href="/docs" data-use-case-item="hidden">Hidden</a></div>
          <div class="invisible" aria-hidden="true"><a id="sizing" href="/docs" data-use-case-item="sizing">Sizing copy</a></div>
          <a id="fast" href="/docs" data-use-case-item="fast">Details</a>
        </section>
        <section data-use-case-section="customer_stories" style="margin-top:1200px"><a id="story" href="/users/sumup"><span>Customer story</span></a></section>
      </div>
    </main>
    <footer><a id="footer" href="/cloud">Start free</a></footer>`;
  const server = createServer((_, res) => {
    res.setHeader("Content-Type", "text/html");
    res.end(fixture);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1000, height: 800 });
    await page.goto(
      "http://127.0.0.1:" + server.address().port + "/coding-agents",
    );
    await page.evaluate(installBrowserTracker, sources);
    await page.evaluate(() => {
      // Suppress only the fixture's navigations; the tracker runs in capture phase.
      document.addEventListener("click", (event) => event.preventDefault());
      document.addEventListener("auxclick", (event) => event.preventDefault());
      document.querySelector("#fast").dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          ctrlKey: true,
        }),
      );
    });
    await page.waitForFunction(
      () =>
        window.captures.filter((x) => x.event === "use_case:action_viewed")
          .length >= 4,
    );
    let captures = await page.evaluate(() => window.captures);
    assert.equal(
      captures.filter((x) => x.event === "use_case:page_viewed").length,
      1,
    );
    assert.equal(
      captures.find(
        (x) => x.event === "use_case:action_clicked" && x.props.item === "fast",
      ).props.was_exposed,
      false,
    );
    assert.ok(
      !captures.some((x) =>
        ["hidden", "sizing", "/users/sumup"].includes(x.props.item),
      ),
    );
    assert.ok(
      captures.some(
        (x) =>
          x.props.section === "navigation" &&
          x.event === "use_case:action_viewed",
      ),
    );
    assert.ok(captures.some((x) => x.props.action === "quickstart"));

    const tags = await page.$eval("#nav", (a) => a.href);
    assert.equal(new URL(tags).searchParams.get("utm_source"), "email");
    assert.equal(new URL(tags).searchParams.get("lf_section"), "navigation");
    assert.equal(new URL(tags).hash, "#form");

    await page.evaluate(() => {
      document.querySelector("#quick").dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          ctrlKey: true,
        }),
      );
      document.querySelector("#quick").dispatchEvent(
        new MouseEvent("auxclick", {
          bubbles: true,
          cancelable: true,
          button: 1,
        }),
      );
      const url = new URL(window.location.href);
      url.searchParams.set("path", "hooks");
      history.replaceState(null, "", url);
      document.querySelector("#dial").dataset.useCasePath = "hooks";
      window.interact(
        document.querySelector("#dial"),
        "path_selected",
        "hooks",
      );
      window.interact(
        document.querySelector("#dial"),
        "benefit_opened",
        "cost",
      );
    });
    await page.waitForFunction(() =>
      window.captures.some(
        (x) =>
          x.event === "use_case:action_viewed" &&
          x.props.setup_path === "hooks",
      ),
    );
    captures = await page.evaluate(() => window.captures);
    const quickClicks = captures.filter(
      (x) =>
        x.event === "use_case:action_clicked" &&
        x.props.action === "quickstart",
    );
    assert.equal(quickClicks.length, 2);
    assert.ok(quickClicks.every((x) => x.props.was_exposed));
    assert.equal(
      captures.filter((x) => x.event === "use_case:path_selected").length,
      1,
    );
    assert.equal(
      captures.find((x) => x.event === "use_case:benefit_opened").props.item,
      "cost",
    );
    assert.equal(
      captures.filter((x) => x.event === "use_case:page_viewed").length,
      1,
    );
    assert.equal(
      new URL(await page.$eval("#hero", (a) => a.href)).searchParams.get(
        "lf_setup_path",
      ),
      "hooks",
    );

    await page.$eval("#story", (a) => a.scrollIntoView({ block: "center" }));
    await page.waitForFunction(() =>
      window.captures.some(
        (x) =>
          x.event === "use_case:action_viewed" &&
          x.props.item === "/users/sumup",
      ),
    );
    await page.click("#story span");
    captures = await page.evaluate(() => window.captures);
    assert.equal(
      captures.filter(
        (x) =>
          x.event === "use_case:action_clicked" &&
          x.props.destination_group === "stories",
      ).length,
      1,
    );
    await page.evaluate(() => window.scrollTo(0, 0));
    await delay(1200);
    captures = await page.evaluate(() => window.captures);
    const viewed = captures.filter((x) => x.event === "use_case:action_viewed");
    assert.equal(
      new Set(viewed.map((x) => x.props.placement_id)).size,
      viewed.length,
    );
    await page.evaluate(() => {
      document.querySelector("#nav").dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          ctrlKey: true,
        }),
      );
      // Simulate React reusing a link node with a new route's destination.
      document.querySelector("#hero").setAttribute("href", "/next-route");
      window.cleanups.forEach((cleanup) => cleanup());
    });
    assert.equal(
      await page.$eval("#nav", (a) => a.getAttribute("href")),
      "/cloud?utm_source=email#form",
    );
    assert.equal(
      await page.$eval("#hero", (a) => a.getAttribute("href")),
      "/next-route",
    );
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
});

test("browser: signup clicks and keyboard activation have one attributed navigation", async () => {
  const fixture = `<!doctype html>
    <nav><a id="signup" href="/cloud?utm_source=email#form">Start free</a></nav>
    <main data-use-case="coding_agents" data-use-case-page="/coding-agents">
      <div data-use-case-path="hooks"></div>
    </main>`;
  const server = createServer((_, res) => {
    res.setHeader("Content-Type", "text/html");
    res.end(fixture);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const browser = await puppeteer.launch({ headless: true });
  try {
    for (const activation of ["click", "keyboard"]) {
      const page = await browser.newPage();
      await page.goto(
        "http://127.0.0.1:" +
          server.address().port +
          "/coding-agents?path=hooks",
      );
      await page.evaluate(installBrowserTracker, sources);
      await page.evaluate(() => {
        // Model a custom button's unconditional client-side navigation to its
        // original href, even after a capture listener prevents the default.
        document.querySelector("#signup").addEventListener("click", (event) => {
          event.preventDefault();
          sessionStorage.setItem("competing_navigation", "true");
          history.pushState(null, "", "/cloud");
        });
        // Other document-level capture listeners (e.g. ad conversions) must
        // still receive the click when the tracker owns the navigation.
        document.addEventListener(
          "click",
          () => {
            sessionStorage.setItem("captures", JSON.stringify(window.captures));
          },
          true,
        );
      });
      const navigations = [];
      page.on("request", (request) => {
        if (
          request.isNavigationRequest() &&
          request.frame() === page.mainFrame()
        ) {
          navigations.push(request.url());
        }
      });
      const navigation = page.waitForNavigation();
      if (activation === "keyboard") {
        await page.focus("#signup");
        await page.keyboard.press("Enter");
      } else {
        await page.click("#signup");
      }
      await navigation;
      const result = await page.evaluate(() => ({
        competingNavigation: sessionStorage.getItem("competing_navigation"),
        captures: JSON.parse(sessionStorage.getItem("captures")),
      }));
      assert.equal(result.competingNavigation, null, activation);
      assert.equal(navigations.length, 1, activation);
      const destination = new URL(page.url());
      assert.equal(destination.pathname, "/cloud");
      assert.equal(destination.searchParams.get("utm_source"), "email");
      assert.equal(
        destination.searchParams.get("lf_use_case"),
        "coding_agents",
      );
      assert.equal(destination.searchParams.get("lf_section"), "navigation");
      assert.equal(destination.searchParams.get("lf_action"), "start_free");
      assert.equal(destination.searchParams.get("lf_setup_path"), "hooks");
      assert.equal(destination.hash, "#form");
      assert.equal(
        result.captures.filter(
          (event) => event.event === "use_case:action_clicked",
        ).length,
        1,
      );
      await page.close();
    }
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
});

test("sales completion is emitted only after Marketo success and is deduplicated", () => {
  const captured = [];
  let onSuccess;
  let adConversions = 0;
  globalThis.window = {
    MktoForms2: {
      loadForm(_base, _id, _form, callback) {
        callback({
          onSuccess: (fn) => {
            onSuccess = fn;
          },
        });
      },
    },
  };
  globalThis.document = { getElementById: () => ({ replaceChildren() {} }) };
  const form = load(compile("components/MarketoContactForm.tsx"), (name) => {
    if (name === "react")
      return {
        useState: (value) => [value, () => {}],
        useRef: (value) => ({ current: value }),
        useCallback: (fn) => fn,
        useEffect: (fn) => fn(),
      };
    if (name === "react/jsx-runtime")
      return {
        jsx: (type, props) => ({ type, props }),
        jsxs: (type, props) => ({ type, props }),
      };
    if (name === "lucide-react") return { Check: () => null };
    if (name === "posthog-js")
      return {
        default: { capture: (event, props) => captured.push({ event, props }) },
      };
    if (name === "@/lib/ad-conversions")
      return { reportTalkToUsConversion: () => adConversions++ };
    if (name === "@/lib/use-case-analytics")
      return { readUseCaseAttribution: () => attribution };
    throw Error(name);
  });
  try {
    form.MarketoContactForm();
    assert.equal(captured.length, 0, "Loading a form is not a conversion");
    assert.equal(onSuccess({ Email: "test@example.invalid" }, ""), false);
    assert.equal(onSuccess({}, ""), false);
    assert.deepEqual(captured, [
      {
        event: "sales:inquiry_completed",
        props: { form_id: 1645, ...attribution },
      },
    ]);
    assert.equal(adConversions, 1);
  } finally {
    delete globalThis.window;
    delete globalThis.document;
  }
});
