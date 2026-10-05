import assert from "node:assert/strict";
import test from "node:test";
import {
  faqPageContextInstructions,
  sanitizeFaqPageUrl,
  trustedPageOrigins,
} from "./faq-page-context";

test("accepts https langfuse.com docs URLs and keeps the section hash", () => {
  assert.deepEqual(
    sanitizeFaqPageUrl("https://langfuse.com/self-hosting/license-key#faq", []),
    {
      url: "https://langfuse.com/self-hosting/license-key#faq",
      docsUrl: "https://langfuse.com/self-hosting/license-key",
    },
  );
});

test("accepts www.langfuse.com and rewrites it to langfuse.com", () => {
  assert.deepEqual(
    sanitizeFaqPageUrl(
      "https://www.langfuse.com/docs/observability/overview/",
      [],
    ),
    {
      url: "https://langfuse.com/docs/observability/overview",
      docsUrl: "https://langfuse.com/docs/observability/overview",
    },
  );
});

test("rewrites same-origin localhost URLs to langfuse.com", () => {
  assert.deepEqual(
    sanitizeFaqPageUrl(
      "http://127.0.0.1:3333/self-hosting/license-key#how-to-remove-a-license-key",
      ["http://127.0.0.1:3333"],
    ),
    {
      url: "https://langfuse.com/self-hosting/license-key#how-to-remove-a-license-key",
      docsUrl: "https://langfuse.com/self-hosting/license-key",
    },
  );
});

test("ignores other hosts, credentials, and http langfuse.com", () => {
  assert.equal(
    sanitizeFaqPageUrl("https://evil.example/docs", ["https://langfuse.com"]),
    undefined,
  );
  assert.equal(
    sanitizeFaqPageUrl("https://user:pass@langfuse.com/docs", [
      "https://langfuse.com",
    ]),
    undefined,
  );
  assert.equal(sanitizeFaqPageUrl("http://langfuse.com/docs", []), undefined);
  assert.equal(sanitizeFaqPageUrl("javascript:alert(1)", []), undefined);
  assert.equal(sanitizeFaqPageUrl("not a url", []), undefined);
  assert.equal(
    sanitizeFaqPageUrl(undefined, ["https://langfuse.com"]),
    undefined,
  );
});

test("trustedPageOrigins uses Host, not a cross-site Origin header", () => {
  const origins = trustedPageOrigins(
    new Request("https://langfuse.com/api/faq-bot", {
      headers: {
        origin: "https://evil.example",
        host: "langfuse.com",
      },
    }),
  );

  assert.equal(origins.has("https://langfuse.com"), true);
  assert.equal(origins.has("https://evil.example"), false);
  assert.equal(
    sanitizeFaqPageUrl("https://evil.example/phishing", origins),
    undefined,
  );
});

test("trustedPageOrigins includes localhost from Host", () => {
  const origins = trustedPageOrigins(
    new Request("http://127.0.0.1:3333/api/faq-bot", {
      headers: {
        host: "127.0.0.1:3333",
      },
    }),
  );

  assert.equal(origins.has("http://127.0.0.1:3333"), true);
  assert.equal(origins.has("https://langfuse.com"), true);
});

test("page context instructions include the URL and getLangfuseDocsPage hint", () => {
  const text = faqPageContextInstructions({
    url: "https://langfuse.com/self-hosting/license-key#faq",
    docsUrl: "https://langfuse.com/self-hosting/license-key",
  });

  assert.match(text, /https:\/\/langfuse\.com\/self-hosting\/license-key#faq/);
  assert.doesNotMatch(text, /title/i);
  assert.match(
    text,
    /getLangfuseDocsPage tool with pathOrUrl "https:\/\/langfuse\.com\/self-hosting\/license-key"/,
  );
});
