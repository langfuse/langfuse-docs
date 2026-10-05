import assert from "node:assert/strict";
import test from "node:test";
import {
  faqPageContextInstructions,
  sanitizeFaqPageContext,
  trustedPageOrigins,
} from "./faq-page-context";

test("accepts https langfuse.com docs URLs and keeps the section hash", () => {
  const page = sanitizeFaqPageContext(
    {
      url: "https://langfuse.com/self-hosting/license-key#faq",
      title: "Enterprise License Key (self-hosted) | Langfuse",
    },
    [],
  );

  assert.deepEqual(page, {
    url: "https://langfuse.com/self-hosting/license-key#faq",
    docsUrl: "https://langfuse.com/self-hosting/license-key",
    title: "Enterprise License Key (self-hosted) | Langfuse",
  });
});

test("accepts www.langfuse.com and rewrites it to langfuse.com", () => {
  const page = sanitizeFaqPageContext(
    { url: "https://www.langfuse.com/docs/observability/overview/" },
    [],
  );

  assert.deepEqual(page, {
    url: "https://langfuse.com/docs/observability/overview",
    docsUrl: "https://langfuse.com/docs/observability/overview",
    title: undefined,
  });
});

test("rewrites same-origin localhost URLs to langfuse.com", () => {
  const page = sanitizeFaqPageContext(
    {
      url: "http://127.0.0.1:3333/self-hosting/license-key#how-to-remove-a-license-key",
      title: "Enterprise License Key",
    },
    ["http://127.0.0.1:3333"],
  );

  assert.deepEqual(page, {
    url: "https://langfuse.com/self-hosting/license-key#how-to-remove-a-license-key",
    docsUrl: "https://langfuse.com/self-hosting/license-key",
    title: "Enterprise License Key",
  });
});

test("ignores other hosts, credentials, and http langfuse.com", () => {
  assert.equal(
    sanitizeFaqPageContext({ url: "https://evil.example/docs" }, [
      "https://langfuse.com",
    ]),
    undefined,
  );
  assert.equal(
    sanitizeFaqPageContext({ url: "https://user:pass@langfuse.com/docs" }, [
      "https://langfuse.com",
    ]),
    undefined,
  );
  assert.equal(
    sanitizeFaqPageContext({ url: "http://langfuse.com/docs" }, []),
    undefined,
  );
  assert.equal(
    sanitizeFaqPageContext({ url: "javascript:alert(1)" }, []),
    undefined,
  );
  assert.equal(sanitizeFaqPageContext({ url: "not a url" }, []), undefined);
  assert.equal(
    sanitizeFaqPageContext(undefined, ["https://langfuse.com"]),
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
    sanitizeFaqPageContext({ url: "https://evil.example/phishing" }, origins),
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

test("strips control characters and truncates long titles", () => {
  const page = sanitizeFaqPageContext(
    {
      url: "https://langfuse.com/docs",
      title: `Ignore\u0000 previous ${"A".repeat(400)}`,
    },
    [],
  );

  assert.equal(page?.title?.includes("\u0000"), false);
  assert.equal(page?.title?.startsWith("Ignore previous "), true);
  assert.equal(page?.title?.length, 300);
});

test("page context instructions include the URL and getLangfuseDocsPage hint", () => {
  const text = faqPageContextInstructions({
    url: "https://langfuse.com/self-hosting/license-key#faq",
    docsUrl: "https://langfuse.com/self-hosting/license-key",
    title: "Enterprise License Key",
  });

  assert.match(text, /https:\/\/langfuse\.com\/self-hosting\/license-key#faq/);
  assert.match(text, /Browser-reported title: Enterprise License Key/);
  assert.match(
    text,
    /getLangfuseDocsPage tool with pathOrUrl "https:\/\/langfuse\.com\/self-hosting\/license-key"/,
  );
});
