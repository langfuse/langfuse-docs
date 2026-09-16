import assert from "node:assert/strict";
import test from "node:test";
import { isOptimizable, shouldZoomMdxImage } from "./image-utils";

test("isOptimizable allows local paths and known hosts", () => {
  assert.equal(isOptimizable("/images/docs/session.png"), true);
  assert.equal(
    isOptimizable("https://langfuse.com/images/docs/session.png"),
    true,
  );
  assert.equal(
    isOptimizable("https://static.langfuse.com/docs-videos/poster.png"),
    true,
  );
  assert.equal(
    isOptimizable(
      "https://raw.githubusercontent.com/langfuse/langfuse/main/img.png",
    ),
    true,
  );
});

test("isOptimizable rejects badge hosts", () => {
  assert.equal(
    isOptimizable("https://img.shields.io/npm/v/langfuse.svg"),
    false,
  );
});

test("shouldZoomMdxImage zooms docs screenshots", () => {
  assert.equal(
    shouldZoomMdxImage({
      src: "/images/docs/session.png",
      width: 1600,
      height: 900,
    }),
    true,
  );
  assert.equal(
    shouldZoomMdxImage({
      src: "https://langfuse.com/images/cookbook/example.png",
    }),
    true,
  );
});

test("shouldZoomMdxImage skips badges, logos, and tiny assets", () => {
  assert.equal(
    shouldZoomMdxImage({
      src: "https://img.shields.io/npm/v/langfuse.svg",
    }),
    false,
  );
  assert.equal(
    shouldZoomMdxImage({
      src: "/images/docs/session.png",
      className: "logo",
    }),
    false,
  );
  assert.equal(
    shouldZoomMdxImage({
      src: "/images/docs/wordmark.png",
    }),
    false,
  );
  assert.equal(
    shouldZoomMdxImage({
      src: "/images/icons/check.png",
      width: 16,
      height: 16,
    }),
    false,
  );
  assert.equal(
    shouldZoomMdxImage({
      src: "/images/docs/session.png",
      className: "no-zoom",
    }),
    false,
  );
});
