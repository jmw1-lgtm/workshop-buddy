import assert from "node:assert/strict";
import test from "node:test";

import { getActivityDate } from "../src/lib/activity-date.ts";
import { isEmailInAdminAllowlist } from "../src/lib/admin-permissions.ts";
import {
  getMetricPercentage,
  getReturnedStatus,
  isActivatedDuringTrial,
} from "../src/lib/admin-analytics.ts";

test("activation requires the first job to be created within the trial window", () => {
  const trialStartedAt = new Date("2026-10-01T09:00:00Z");
  const trialEndsAt = new Date("2026-10-15T09:00:00Z");

  assert.equal(isActivatedDuringTrial({ firstJobCreatedAt: new Date("2026-10-02T12:00:00Z"), trialStartedAt, trialEndsAt }), true);
  assert.equal(isActivatedDuringTrial({ firstJobCreatedAt: new Date("2026-10-16T12:00:00Z"), trialStartedAt, trialEndsAt }), false);
  assert.equal(isActivatedDuringTrial({ firstJobCreatedAt: null, trialStartedAt, trialEndsAt }), false);
});

test("returned status distinguishes unknown history, one day, and two distinct days", () => {
  assert.equal(getReturnedStatus(null), null);
  assert.equal(getReturnedStatus(0), false);
  assert.equal(getReturnedStatus(1), false);
  assert.equal(getReturnedStatus(2), true);
});

test("summary percentages use the full trial cohort and handle an empty cohort", () => {
  assert.equal(getMetricPercentage(7, 15).toFixed(1), "46.7");
  assert.equal(getMetricPercentage(0, 0), 0);
});

test("activity dates follow Europe/London calendar days across midnight and DST", () => {
  assert.equal(getActivityDate(new Date("2026-07-01T22:59:59Z")).toISOString(), "2026-07-01T00:00:00.000Z");
  assert.equal(getActivityDate(new Date("2026-07-01T23:00:00Z")).toISOString(), "2026-07-02T00:00:00.000Z");
  assert.equal(getActivityDate(new Date("2026-12-01T00:00:00Z")).toISOString(), "2026-12-01T00:00:00.000Z");
});

test("admin access is deny-by-default and matches configured email case-insensitively", () => {
  const allowlist = ["owner@workshopbuddy.co.uk"];

  assert.equal(isEmailInAdminAllowlist(null, allowlist), false);
  assert.equal(isEmailInAdminAllowlist("garage@example.com", allowlist), false);
  assert.equal(isEmailInAdminAllowlist("OWNER@workshopbuddy.co.uk", allowlist), true);
});
