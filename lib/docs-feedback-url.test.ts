import assert from "node:assert/strict";
import test from "node:test";
import { getDocsFeedbackIssueUrl } from "./docs-feedback-url";

test("puts the full page URL in the GitHub issue title and leaves the body empty", () => {
  const href = getDocsFeedbackIssueUrl("/docs/observability/get-started");
  const url = new URL(href);

  assert.equal(
    url.origin + url.pathname,
    "https://github.com/langfuse/langfuse-docs/issues/new",
  );
  assert.equal(
    url.searchParams.get("title"),
    "Feedback for https://langfuse.com/docs/observability/get-started",
  );
  assert.equal(url.searchParams.get("labels"), "feedback");
  assert.equal(url.searchParams.get("body"), null);
});
