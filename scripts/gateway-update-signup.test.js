const test = require("node:test");
const assert = require("node:assert/strict");
const { hasGatewaySignupFooter } = require("../lib/gateway-update-signup.js");

test("adds the footer to gateway docs pages, including future pages", () => {
  for (const pathname of [
    "/docs/gateway/concepts",
    "/docs/gateway/features/api-keys",
    "/docs/gateway/get-started/first-request/",
    "/docs/gateway/a-future-page",
  ]) {
    assert.equal(hasGatewaySignupFooter(pathname), true, pathname);
  }
});

test("skips the overview, which embeds the signup inline, and other paths", () => {
  for (const pathname of [
    "/docs/gateway/overview",
    "/docs/gateway/overview/",
    "/docs/gateway",
    "/docs/gateway-other/page",
    "/docs/observability/overview",
    "/blog/introducing-gateway",
  ]) {
    assert.equal(hasGatewaySignupFooter(pathname), false, pathname);
  }
});
