import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { transformSync } from "esbuild";

// TypeScript 7 is the native Go checker and does not expose transpileModule.
const compile = (path) =>
  transformSync(readFileSync(new URL("../" + path, import.meta.url), "utf8"), {
    loader: path.endsWith(".tsx") ? "tsx" : "ts",
    format: "cjs",
    target: "es2022",
    jsx: "automatic",
  }).code;
const sources = {
  regions: compile("lib/cloud-regions.ts"),
  analytics: compile("lib/use-case-analytics.ts"),
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

const CONVERSION_ORIGIN = "https://forms.conversion.ai";
const CONVERSION_FORM_ID = "8fed9078-25ce-4f9e-ad32-dac3ae839148";

function contactFormModuleLoader({
  iframe,
  captured,
  adConversions,
  remembered,
  attributionValue = attribution,
  consent = { advertisement: "granted" },
}) {
  let refCalls = 0;
  return (name) => {
    if (name === "react")
      return {
        useState: (value) => [value, () => {}],
        // The first ref is the iframe; give it the stubbed frame window.
        useRef: (value) => ({
          current: refCalls++ === 0 ? iframe : value,
        }),
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
        capture: (event, props) => captured.push({ event, props }),
      };
    if (name === "@/lib/ad-conversions")
      return {
        reportTalkToUsConversion: () => {
          if (adConversions) adConversions.value += 1;
        },
      };
    if (name === "@/lib/cookie-consent")
      return { readAdvertisementConsent: () => consent.advertisement };
    if (name === "@/lib/use-case-analytics")
      return {
        readUseCaseAttribution: () => attributionValue,
        rememberUseCaseAttribution: (value) => {
          if (remembered) remembered.push(value);
        },
      };
    if (name === "@/lib/utils")
      return {
        cn: (...parts) => parts.filter(Boolean).join(" "),
      };
    throw Error(name);
  };
}

// Renders the form against stubbed browser globals and returns a function that
// delivers a postMessage event to the form's message listener.
function mountContactForm({ pathname, search = "", props, ...loaderOptions }) {
  const posted = [];
  const iframeWindow = {
    postMessage: (message, targetOrigin) =>
      posted.push({ message, targetOrigin }),
  };
  const listeners = {};
  const scripts = [];
  globalThis.window = {
    location: { pathname, search },
    addEventListener: (type, fn) => {
      listeners[type] = fn;
    },
    removeEventListener() {},
    setTimeout: () => 0,
    clearTimeout() {},
  };
  const documentListeners = {};
  globalThis.document = {
    addEventListener: (type, fn) => {
      documentListeners[type] = fn;
    },
    removeEventListener() {},
    querySelector: () => null,
    createElement: () => ({}),
    head: { appendChild: (script) => scripts.push(script) },
  };
  const iframe = { contentWindow: iframeWindow, style: {} };
  const loader = contactFormModuleLoader({ iframe, ...loaderOptions });
  const form = load(compile("components/ContactForm.tsx"), loader);
  form.ContactForm(props);
  const send = (data, overrides = {}) =>
    listeners.message({
      origin: CONVERSION_ORIGIN,
      source: iframeWindow,
      data,
      ...overrides,
    });
  return { send, posted, scripts, iframe, documentListeners };
}

const submitted = {
  type: "conversion-forms",
  data: { eventName: "submitted", formId: CONVERSION_FORM_ID },
};

test("sales completion is emitted only after the Conversion form submits and is deduplicated", () => {
  const captured = [];
  const remembered = [];
  const adConversions = { value: 0 };
  const { send, scripts, iframe } = mountContactForm({
    pathname: "/talk-to-us",
    captured,
    adConversions,
    remembered,
  });
  try {
    assert.equal(scripts[0]?.src, "https://forms.conversion.ai/script.js");
    send({ type: "conversion-forms-ping" });
    send({ type: "conversion-forms-height-adjustment", data: { height: 900 } });
    assert.equal(iframe.style.height, "900px");
    assert.equal(captured.length, 0, "Loading a form is not a conversion");
    assert.equal(remembered.length, 0, "Mount must not write attribution");
    send(submitted, { origin: "https://evil.example" });
    send(submitted, { source: {} });
    send({ ...submitted, data: { ...submitted.data, formId: "other" } });
    assert.equal(captured.length, 0, "Foreign messages are ignored");
    send(submitted);
    send(submitted);
    assert.deepEqual(captured, [
      {
        event: "sales:inquiry_completed",
        props: {
          form_id: CONVERSION_FORM_ID,
          page_path: "/talk-to-us",
          ...attribution,
        },
      },
    ]);
    assert.equal(adConversions.value, 1);
  } finally {
    delete globalThis.window;
    delete globalThis.document;
  }
});

test("campaign parameters are sent to the form's hidden fields when it pings", () => {
  const { send, posted } = mountContactForm({
    pathname: "/talk-to-us",
    search: "?utm_source=newsletter&gclid=abc&loc=de&other=ignored",
    captured: [],
  });
  try {
    send({ type: "conversion-forms-ping" });
    assert.deepEqual(posted, [
      {
        message: {
          type: "conversion-forms",
          data: {
            eventName: "set-values",
            fields: {
              "9a874dfc-ef18-4cfd-ab13-b9517e33a314": "newsletter",
              "749e8f3f-0fd5-4296-9e57-659f08ece1f5": "abc",
              "1a65d947-04f8-461b-8aef-5751631b37fe": "de",
            },
          },
        },
        targetOrigin: CONVERSION_ORIGIN,
      },
    ]);
  } finally {
    delete globalThis.window;
    delete globalThis.document;
  }
});

const SOURCE_FIELD = "9a874dfc-ef18-4cfd-ab13-b9517e33a314";
const GCLID_FIELD = "749e8f3f-0fd5-4296-9e57-659f08ece1f5";
const FBCLID_FIELD = "0bff871f-522a-4530-92d9-fd1e5dc28951";
const LOC_FIELD = "1a65d947-04f8-461b-8aef-5751631b37fe";

test("ad click ids are only sent with advertisement consent", () => {
  for (const advertisement of ["denied", "unknown"]) {
    const { send, posted } = mountContactForm({
      pathname: "/talk-to-us",
      search: "?utm_source=newsletter&gclid=abc&fbclid=def&loc=de",
      captured: [],
      consent: { advertisement },
    });
    try {
      send({ type: "conversion-forms-ping" });
      assert.deepEqual(posted[0]?.message.data.fields, {
        [SOURCE_FIELD]: "newsletter",
        [GCLID_FIELD]: "",
        [FBCLID_FIELD]: "",
        [LOC_FIELD]: "de",
      });
    } finally {
      delete globalThis.window;
      delete globalThis.document;
    }
  }
});

test("consent answered after the form is ready resends the click ids", () => {
  const consent = { advertisement: "unknown" };
  const { send, posted, documentListeners } = mountContactForm({
    pathname: "/talk-to-us",
    search: "?gclid=abc",
    captured: [],
    consent,
  });
  try {
    documentListeners.cookieyes_banner_load();
    assert.equal(posted.length, 0, "Nothing is sent before the form is ready");
    send({ type: "conversion-forms-ping" });
    assert.deepEqual(posted[0]?.message.data.fields, { [GCLID_FIELD]: "" });
    consent.advertisement = "granted";
    documentListeners.cookieyes_consent_update();
    assert.deepEqual(posted[1]?.message.data.fields, { [GCLID_FIELD]: "abc" });
    consent.advertisement = "denied";
    documentListeners.cookieyes_consent_update();
    assert.deepEqual(posted[2]?.message.data.fields, { [GCLID_FIELD]: "" });
  } finally {
    delete globalThis.window;
    delete globalThis.document;
  }
});

test("use-case forms remember attribution only on submission", () => {
  const captured = [];
  const remembered = [];
  const { send } = mountContactForm({
    pathname: "/financial-services",
    props: { useCase: "financial_services", section: "hero" },
    captured,
    remembered,
    attributionValue: null,
  });
  try {
    send({ type: "conversion-forms-ping" });
    assert.equal(remembered.length, 0, "Mount must not write attribution");
    send(submitted);
    assert.deepEqual(remembered, [
      {
        use_case: "financial_services",
        section: "hero",
        action: "form_submit",
      },
    ]);
    assert.equal(captured[0]?.event, "sales:inquiry_completed");
    assert.equal(captured[0]?.props.page_path, "/financial-services");
    assert.equal(captured[0]?.props.use_case, "financial_services");
    assert.equal(captured[0]?.props.action, "form_submit");
  } finally {
    delete globalThis.window;
    delete globalThis.document;
  }
});
