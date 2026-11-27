import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import { build } from "esbuild";

const bundle = await build({
  entryPoints: ["components/advent/analytics.ts"],
  bundle: true,
  platform: "node",
  format: "cjs",
  external: ["posthog-js"],
  write: false,
});

function fixture() {
  const events = [];
  const client = {
    __loaded: true,
    capture: (...args) => events.push(args),
  };
  const scene = {
    dataset: { mode: "winter", motion: "full", experience: "ready", slop: "0" },
  };
  const module = { exports: {} };
  vm.runInNewContext(bundle.outputFiles[0].text, {
    module,
    exports: module.exports,
    require: () => client,
    document: { querySelector: () => scene },
    location: { search: "" },
    URLSearchParams,
    process: { env: { NODE_ENV: "test" } },
    setTimeout,
    clearTimeout,
    performance,
    console,
  });
  return { ...module.exports, events, client, scene };
}

test("continuous input is bounded without losing counts or the original scene", () => {
  const { createAdventInteractionBatch, events, scene } = fixture();
  const batch = createAdventInteractionBatch();
  try {
    for (let value = 0; value < 100; value++)
      batch.record("slop_changed", { value });
    for (let count = 0; count < 20; count++)
      batch.record("snowball_thrown", {}, true);
    assert.equal(events.length, 0);
    scene.dataset.mode = "techno";
    batch.flush();
    assert.equal(events.length, 2);
    assert.equal(events[0][0], "advent:slop_changed");
    assert.equal(events[0][1].value, 99);
    assert.equal(events[1][1].count, 20);
    assert.equal(events[1][1].mode, "winter");
    batch.flush();
    assert.equal(events.length, 2);
  } finally {
    batch.flush();
  }
});

test("the existing client receives contextual events; missing or blocked analytics cannot break actions", () => {
  const { trackAdvent, events, client } = fixture();
  trackAdvent("door_selected", { day: 3, locked: false });
  assert.equal(events[0][0], "advent:door_selected");
  assert.equal(events[0][1].day, 3);
  assert.equal(events[0][1].motion, "full");
  assert.equal(events[0][1].environment, "test");
  client.__loaded = false;
  trackAdvent("started");
  assert.equal(events.length, 1);
  client.__loaded = true;
  client.capture = () => {
    throw new Error("blocked");
  };
  assert.doesNotThrow(() => trackAdvent("started"));
});
