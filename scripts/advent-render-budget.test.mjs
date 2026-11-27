import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import { build } from "esbuild";

const bundle = await build({
  entryPoints: ["components/advent/render-budget.ts"],
  bundle: true,
  platform: "node",
  format: "cjs",
  write: false,
});
function fixture(device) {
  const module = { exports: {} };
  vm.runInNewContext(bundle.outputFiles[0].text, {
    module,
    exports: module.exports,
    navigator: device,
    devicePixelRatio: 2,
  });
  return module.exports;
}

test("constrained devices start with a smaller canvas, including large retina viewports", () => {
  for (const device of [
    { hardwareConcurrency: 2 },
    { hardwareConcurrency: 12, deviceMemory: 4 },
  ]) {
    const { canvasScale } = fixture(device);
    const scale = canvasScale(1920, 1080, 650_000);
    assert(Math.abs(1920 * 1080 * scale * scale - 360_000) < 1);
  }
  const { renderPixels } = fixture({
    hardwareConcurrency: 14,
    deviceMemory: 16,
  });
  assert.equal(renderPixels(650_000), 650_000);
});

test("intermittent sustained slowness lowers quality, a single capture stall does not", () => {
  const { frameMonitor } = fixture({});
  const monitor = frameMonitor();
  let time = 1;
  monitor.frame(time);
  for (const gap of [250, ...Array(11).fill(33)])
    assert.equal(monitor.frame((time += gap)), false);
  let reduced = false;
  for (const gap of [66, 66, 33, 66, 66, 33, 66, 66, 33, 66, 66, 33])
    reduced ||= monitor.frame((time += gap));
  assert.equal(reduced, true);
});
