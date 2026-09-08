const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { validateContributors } = require("./validate-contributors");

function writeFixture(t, contents) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "contributors-"));
  const filePath = path.join(directory, "contributors.json");
  fs.writeFileSync(filePath, contents);
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  return filePath;
}

test("accepts a valid contributor snapshot", (t) => {
  const filePath = writeFixture(
    t,
    JSON.stringify({ "/docs/example": ["contributor"] }),
  );

  assert.deepEqual(validateContributors(filePath), {
    "/docs/example": ["contributor"],
  });
});

test("rejects invalid contributor snapshot JSON", (t) => {
  const filePath = writeFixture(t, "{");
  assert.throws(() => validateContributors(filePath), /not valid JSON/);
});

test("rejects invalid contributor snapshot structure", (t) => {
  const filePath = writeFixture(
    t,
    JSON.stringify({ "/docs/example": "contributor" }),
  );
  assert.throws(() => validateContributors(filePath), /must be an array/);
});

test("rejects a missing contributor snapshot", () => {
  assert.throws(
    () => validateContributors("/missing/contributors.json"),
    /is missing/,
  );
});
