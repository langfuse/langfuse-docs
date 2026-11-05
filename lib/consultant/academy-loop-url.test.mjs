import assert from "node:assert/strict";
import test from "node:test";
import { isAcademyLoopUrl } from "./academy-loop-url.mjs";

test("academy loop fetch accepts only that page", () => {
  assert.equal(
    isAcademyLoopUrl("https://langfuse.com/academy/ai-engineering-loop"),
    true,
  );
  assert.equal(
    isAcademyLoopUrl("https://langfuse.com/academy/ai-engineering-loop.md"),
    true,
  );
  assert.equal(
    isAcademyLoopUrl("https://langfuse.com/academy/examples"),
    false,
  );
  assert.equal(
    isAcademyLoopUrl("https://example.com/academy/ai-engineering-loop"),
    false,
  );
  assert.equal(
    isAcademyLoopUrl("http://langfuse.com/academy/ai-engineering-loop"),
    false,
  );
  assert.equal(isAcademyLoopUrl("not a url"), false);
});
