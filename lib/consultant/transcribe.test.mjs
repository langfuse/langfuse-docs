import assert from "node:assert/strict";
import test from "node:test";
import { MAX_AUDIO_BYTES, consultantAudio } from "./transcribe.mjs";

test("consultantAudio accepts a webm recording and ignores codec parameters", () => {
  const result = consultantAudio({
    size: 12_000,
    type: "audio/webm;codecs=opus",
  });
  assert.deepEqual(result, { mime: "audio/webm", ext: "webm" });
});

test("consultantAudio rejects an empty, huge, or unknown recording", () => {
  assert.equal(
    consultantAudio({ size: 0, type: "audio/webm" }).error,
    "No speech detected. Try again.",
  );
  assert.equal(
    consultantAudio({ size: MAX_AUDIO_BYTES + 1, type: "audio/webm" }).error,
    "That recording is too long. Try a shorter one.",
  );
  assert.equal(
    consultantAudio({ size: 100, type: "application/octet-stream" }).error,
    "This browser's recording format is not supported.",
  );
  assert.equal(
    consultantAudio(null).error,
    "Record a short message and try again.",
  );
});
