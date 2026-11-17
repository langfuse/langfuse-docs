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

function marketoModuleLoader({
  captured,
  adConversions,
  remembered,
  attributionValue = attribution,
}) {
  return (name) => {
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
        capture: (event, props) => captured.push({ event, props }),
      };
    if (name === "@/lib/ad-conversions")
      return {
        reportTalkToUsConversion: () => {
          if (adConversions) adConversions.value += 1;
        },
      };
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

test("sales completion is emitted only after Marketo success and is deduplicated", () => {
  const captured = [];
  const remembered = [];
  const adConversions = { value: 0 };
  let onSuccess;
  globalThis.window = {
    location: { pathname: "/talk-to-us" },
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
  const requiredAsterisk = {
    display: null,
    priority: null,
    closest: (selector) =>
      selector === ".mktoRequiredField" ? { required: true } : null,
    style: {
      setProperty(name, value, priority) {
        if (name === "display") {
          requiredAsterisk.display = value;
          requiredAsterisk.priority = priority;
        }
      },
    },
  };
  const optionalAsterisk = {
    display: null,
    priority: null,
    closest: () => null,
    style: {
      setProperty(name, value, priority) {
        if (name === "display") {
          optionalAsterisk.display = value;
          optionalAsterisk.priority = priority;
        }
      },
    },
  };
  globalThis.document = {
    getElementById: () => ({
      replaceChildren() {},
      querySelectorAll(selector) {
        assert.equal(selector, ".mktoAsterix");
        return [requiredAsterisk, optionalAsterisk];
      },
    }),
  };
  const form = load(
    compile("components/MarketoContactForm.tsx"),
    marketoModuleLoader({ captured, adConversions, remembered }),
  );
  try {
    form.MarketoContactForm();
    assert.equal(requiredAsterisk.display, "inline");
    assert.equal(requiredAsterisk.priority, "important");
    assert.equal(optionalAsterisk.display, "none");
    assert.equal(optionalAsterisk.priority, "important");
    assert.equal(captured.length, 0, "Loading a form is not a conversion");
    assert.equal(remembered.length, 0, "Mount must not write attribution");
    assert.equal(onSuccess({ Email: "test@example.invalid" }, ""), false);
    assert.equal(onSuccess({}, ""), false);
    assert.deepEqual(captured, [
      {
        event: "sales:inquiry_completed",
        props: {
          form_id: 1645,
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

test("sales completion still registers when the form stub has no querySelectorAll", () => {
  const captured = [];
  let onSuccess;
  globalThis.window = {
    location: { pathname: "/talk-to-us" },
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
  const form = load(
    compile("components/MarketoContactForm.tsx"),
    marketoModuleLoader({ captured }),
  );
  try {
    assert.doesNotThrow(() => form.MarketoContactForm());
    assert.equal(typeof onSuccess, "function");
    assert.equal(onSuccess({}, ""), false);
    assert.equal(captured[0]?.event, "sales:inquiry_completed");
    assert.equal(captured[0]?.props.page_path, "/talk-to-us");
  } finally {
    delete globalThis.window;
    delete globalThis.document;
  }
});

test("compact Marketo form collapses deferred rows and remembers use-case only on success", () => {
  const captured = [];
  const remembered = [];
  let onSuccess;
  let onValidate;
  const deferredRow = {
    querySelector: (selector) =>
      selector === ".mktoHtmlText" ? { text: "extra" } : null,
    querySelectorAll: () => [],
  };
  const firstNameInput = { name: "FirstName", type: "text" };
  const lastNameInput = { name: "LastName", type: "text" };
  const emailInput = { name: "Email", type: "email" };
  const phoneInput = { name: "Phone", type: "tel" };
  const firstNameRow = {
    parentElement: {
      insertBefore(nameRow, before) {
        this.inserted = { nameRow, before };
      },
    },
    querySelectorAll: () => [firstNameInput],
    querySelector: () => null,
  };
  const lastNameRow = {
    parentElement: firstNameRow.parentElement,
    querySelectorAll: () => [lastNameInput],
    querySelector: () => null,
  };
  const emailRow = {
    querySelectorAll: () => [emailInput],
    querySelector: () => null,
  };
  const phoneRow = {
    querySelectorAll: () => [phoneInput],
    querySelector: () => null,
  };
  const buttonRow = { parentElement: { insertBefore() {} } };
  const formElement = {
    replaceChildren() {},
    querySelectorAll(selector) {
      if (selector === ".mktoAsterix") return [];
      if (selector === ".mktoFormRow") {
        return [firstNameRow, lastNameRow, emailRow, phoneRow, deferredRow];
      }
      return [];
    },
    querySelector(selector) {
      if (selector === 'input[name="FirstName"]') {
        return { closest: () => firstNameRow };
      }
      if (selector === 'input[name="LastName"]') {
        return { closest: () => lastNameRow };
      }
      if (selector === ".mktoButtonRow") return buttonRow;
      return null;
    },
    appendChild() {},
  };
  globalThis.HTMLElement = function HTMLElement() {};
  Object.setPrototypeOf(formElement, globalThis.HTMLElement.prototype);
  globalThis.window = {
    location: { pathname: "/financial-services" },
    MktoForms2: {
      loadForm(_base, _id, _form, callback) {
        callback({
          getFormElem: () => formElement,
          onValidate: (fn) => {
            onValidate = fn;
          },
          onSuccess: (fn) => {
            onSuccess = fn;
          },
        });
      },
    },
  };
  globalThis.document = {
    getElementById: () => formElement,
    createElement: (tag) => {
      const node = {
        tag,
        className: "",
        textContent: "",
        children: [],
        appendChild(child) {
          this.children.push(child);
        },
      };
      return node;
    },
  };
  const form = load(
    compile("components/MarketoContactForm.tsx"),
    marketoModuleLoader({
      captured,
      remembered,
      attributionValue: null,
    }),
  );
  try {
    form.MarketoContactForm({
      compact: true,
      useCase: "financial_services",
      section: "hero",
    });
    assert.equal(remembered.length, 0, "Mount must not write attribution");
    assert.equal(typeof onValidate, "function");
    assert.ok(
      firstNameRow.parentElement.inserted?.nameRow,
      "First/last name rows are grouped",
    );
    assert.equal(onSuccess({}, ""), false);
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
    delete globalThis.HTMLElement;
  }
});
