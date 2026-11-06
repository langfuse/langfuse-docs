import assert from "node:assert/strict";
import test from "node:test";
import {
  MAX_MONTHLY_UNITS,
  calculatePricingBreakdown,
  formatEventsInput,
  parseMonthlyUnits,
  usageCost,
} from "./pricing-calculator-math.ts";

const costFor = (units: number) => usageCost(calculatePricingBreakdown(units));

test("prices the published graduated tiers", () => {
  assert.equal(costFor(0), 0);
  assert.equal(costFor(100_000), 0);
  assert.equal(costFor(200_000), 8);
  assert.equal(costFor(1_000_000), 72);
  assert.equal(costFor(10_000_000), 702);
  assert.equal(costFor(50_000_000), 3302);
  assert.equal(costFor(100_000_000), 6302);
});

test("formats ordinary unit counts with thousands separators", () => {
  assert.equal(formatEventsInput("200000"), "200,000");
  assert.equal(formatEventsInput("200,000"), "200,000");
  assert.equal(formatEventsInput("12ab34"), "1,234");
  assert.equal(formatEventsInput(""), "");
  assert.equal(formatEventsInput("000200000"), "200,000");
  assert.equal(parseMonthlyUnits("200,000"), 200_000);
  assert.equal(parseMonthlyUnits(""), 0);
});

test("clamps a pasted unsafe integer instead of pricing a rounded float", () => {
  const pasted = "22,302,026,819,699,682,131,202,637,410,520,374";
  const formatted = formatEventsInput(pasted);

  assert.equal(formatted, "9,007,199,254,740,991");
  assert.equal(parseMonthlyUnits(formatted), MAX_MONTHLY_UNITS);
  assert.equal(Number.isSafeInteger(Number(pasted.replace(/,/g, ""))), false);

  const cost = costFor(parseMonthlyUnits(pasted));
  assert.equal(cost, costFor(MAX_MONTHLY_UNITS));
  assert.equal(Number.isFinite(cost), true);
  // Lower tiers plus $6/100k on the remainder. The unclamped paste used to
  // price as ~$1.3 undecillion because the integer no longer fit in a float.
  assert.equal(cost, 540431955586.46);
});

test("clamps the first integer above the safe range and keeps the max", () => {
  assert.equal(formatEventsInput("9007199254740991"), "9,007,199,254,740,991");
  assert.equal(formatEventsInput("9007199254740992"), "9,007,199,254,740,991");
  assert.equal(formatEventsInput("9".repeat(400)), "9,007,199,254,740,991");
  assert.equal(parseMonthlyUnits("9".repeat(400)), MAX_MONTHLY_UNITS);
});

test("non-finite unit counts do not produce a non-finite price", () => {
  for (const units of [NaN, Infinity, -Infinity, -50, 0]) {
    const cost = costFor(units);
    assert.equal(Number.isFinite(cost), true);
    assert.equal(cost, 0);
  }
  assert.equal(Number.isFinite(costFor(MAX_MONTHLY_UNITS)), true);
});
