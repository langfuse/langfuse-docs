import assert from "node:assert/strict";
import test from "node:test";
import {
  externalRedirects,
  resolveExternalRedirect,
} from "./external-redirects";
import { nonPermanentRedirects, permanentRedirects } from "./redirects.js";

test("externalRedirects covers every http(s) destination in redirects.js", () => {
  const expected = (
    [...nonPermanentRedirects, ...permanentRedirects] as [string, string][]
  ).filter(([, dest]) => typeof dest === "string" && /^https?:\/\//.test(dest));

  assert.ok(
    expected.length >= 20,
    "expected a non-trivial set of off-site redirects",
  );
  for (const [source, dest] of expected) {
    assert.equal(
      externalRedirects[source],
      dest,
      `missing or mismatched external redirect for ${source}`,
    );
  }
  assert.equal(Object.keys(externalRedirects).length, expected.length);
});

test("resolveExternalRedirect rewrites known shortlinks", () => {
  assert.equal(
    resolveExternalRedirect("/discord"),
    "https://discord.gg/7NXusRtqYU",
  );
  assert.equal(
    resolveExternalRedirect("/terms"),
    "https://clickhouse.com/legal/clickhouse-general-terms-and-conditions",
  );
  assert.equal(
    resolveExternalRedirect("/issues"),
    "https://github.com/langfuse/langfuse/issues",
  );
  assert.equal(
    resolveExternalRedirect("/gh-support"),
    "https://github.com/orgs/langfuse/discussions/categories/support",
  );
  assert.equal(
    resolveExternalRedirect("/subprocessors"),
    "https://clickhouse.com/legal/agreements/langfuse-subprocessors",
  );
});

test("resolveExternalRedirect ignores internal paths and absolute URLs", () => {
  assert.equal(resolveExternalRedirect("/docs"), undefined);
  assert.equal(resolveExternalRedirect("/support"), undefined);
  assert.equal(
    resolveExternalRedirect("https://discord.gg/7NXusRtqYU"),
    undefined,
  );
  assert.equal(resolveExternalRedirect("#anchor"), undefined);
  assert.equal(resolveExternalRedirect(undefined), undefined);
});
