import assert from "node:assert/strict";
import test from "node:test";
import { getDocsFeedbackIssueUrl } from "./docs-feedback-url";

test("pre-fills the GitHub issue body with the full page URL", () => {
  const href = getDocsFeedbackIssueUrl(
    "/docs/observability/get-started",
    "Get Started",
  );
  const url = new URL(href);

  assert.equal(
    url.origin + url.pathname,
    "https://github.com/langfuse/langfuse-docs/issues/new",
  );
  assert.equal(url.searchParams.get("title"), 'Feedback for "Get Started"');
  assert.equal(url.searchParams.get("labels"), "feedback");
  assert.equal(
    url.searchParams.get("body"),
    "**Page:** https://langfuse.com/docs/observability/get-started\n",
  );
});

test("falls back to a generic title when the page title is missing", () => {
  const href = getDocsFeedbackIssueUrl("/self-hosting");
  const url = new URL(href);

  assert.equal(url.searchParams.get("title"), 'Feedback for "this page"');
  assert.match(
    url.searchParams.get("body") ?? "",
    /https:\/\/langfuse\.com\/self-hosting/,
  );
});
