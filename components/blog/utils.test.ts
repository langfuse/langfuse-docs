import assert from "node:assert/strict";
import test from "node:test";
import {
  formatAbsoluteDate,
  formatDate,
  formatShortRelativeDate,
  parseCalendarDate,
} from "./utils";

const localTime = (y: number, m: number, d: number, h: number) =>
  new Date(y, m - 1, d, h);

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

test("formatDate labels a post from today as Today at any time of day", () => {
  assert.equal(formatDate("2026-11-11", localTime(2026, 11, 11, 0)), "Today");
  assert.equal(formatDate("2026-11-11", localTime(2026, 11, 11, 15)), "Today");
  assert.equal(formatDate("2026-11-11", localTime(2026, 11, 11, 23)), "Today");
});

test("formatDate counts calendar days, not elapsed 24h periods", () => {
  assert.equal(
    formatDate("2026-11-10", localTime(2026, 11, 11, 1)),
    "1 Day Ago",
  );
  assert.equal(
    formatDate("2026-11-10", localTime(2026, 11, 11, 23)),
    "1 Day Ago",
  );
  assert.equal(
    formatDate("2026/11/08", localTime(2026, 11, 11, 15)),
    "3 Days Ago",
  );
});

test("formatDate treats a date ahead of the viewer's calendar as Today", () => {
  assert.equal(formatDate("2026-11-12", localTime(2026, 11, 11, 20)), "Today");
});

test("formatShortRelativeDate uses the same calendar-day count", () => {
  const now = localTime(2026, 11, 11, 15);
  assert.equal(formatShortRelativeDate("2026-11-11", now), "today");
  assert.equal(formatShortRelativeDate("2026-11-10", now), "1 day ago");
  assert.equal(formatShortRelativeDate("2026-11-08", now), "3 days ago");
});

test("timestamps are counted from the viewer's local day", () => {
  const releasedAt = localTime(2026, 11, 10, 22).toISOString();
  assert.equal(
    formatShortRelativeDate(releasedAt, localTime(2026, 11, 10, 23)),
    "today",
  );
  assert.equal(
    formatShortRelativeDate(releasedAt, localTime(2026, 11, 11, 9)),
    "1 day ago",
  );
});

test("static exports render absolute dates instead of relative labels", () => {
  const previous = process.env.STATIC_EXPORT;
  process.env.STATIC_EXPORT = "true";
  try {
    const now = localTime(2026, 11, 11, 15);
    assert.equal(formatDate("2026-11-11", now), "Nov 11, 2026");
    assert.equal(formatShortRelativeDate("2026-11-10", now), "Nov 10, 2026");
  } finally {
    if (previous === undefined) delete process.env.STATIC_EXPORT;
    else process.env.STATIC_EXPORT = previous;
  }
});
