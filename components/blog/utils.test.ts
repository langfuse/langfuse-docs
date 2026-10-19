import assert from "node:assert/strict";
import test from "node:test";
import { formatAbsoluteDate, parseCalendarDate } from "./utils";

test("parseCalendarDate treats YYYY/MM/DD as a UTC calendar day", () => {
  const parsed = parseCalendarDate("2026/04/24");
  assert.ok(parsed);
  assert.equal(parsed.toISOString(), "2026-04-24T00:00:00.000Z");
});

test("parseCalendarDate treats YYYY-MM-DD as a UTC calendar day", () => {
  const parsed = parseCalendarDate("2026-04-24");
  assert.ok(parsed);
  assert.equal(parsed.toISOString(), "2026-04-24T00:00:00.000Z");
});

test("formatAbsoluteDate does not shift a day when formatted in UTC", () => {
  assert.equal(formatAbsoluteDate("2026/04/24"), "Apr 24, 2026");
  assert.equal(formatAbsoluteDate("2026-07-22"), "Jul 22, 2026");
});

test("parseCalendarDate rejects impossible calendar dates", () => {
  assert.equal(parseCalendarDate("2026/02/31"), null);
  assert.equal(formatAbsoluteDate("2026/02/31"), "");
});
