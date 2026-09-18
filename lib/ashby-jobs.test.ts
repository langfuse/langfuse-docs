import assert from "node:assert/strict";
import test from "node:test";
import { ROLES } from "../components/role-finder/role-finder-data";
import {
  FALLBACK_LANGFUSE_JOBS,
  collectLangfuseJobs,
  findJobForRole,
  isLangfuseJobTitle,
  jobMatchesRole,
  type AshbyJob,
} from "./ashby-jobs";

const job = (
  overrides: Partial<AshbyJob> & Pick<AshbyJob, "id" | "title">,
): AshbyJob => ({
  jobUrl: `https://jobs.ashbyhq.com/clickhouse/${overrides.id}`,
  isListed: true,
  ...overrides,
});

const LIVE_JOBS: AshbyJob[] = [
  job({
    id: "sa",
    title: "Solutions Architect - Langfuse ",
  }),
  job({
    id: "devrel",
    title: "Langfuse - DevRel Engineer, Events & Community (EMEA)",
  }),
  job({
    id: "backend",
    title: "Langfuse - Senior Backend Engineer",
  }),
  job({
    id: "cloud",
    title: "Langfuse - Senior Cloud Infra Engineer",
  }),
  job({
    id: "pmm",
    title: "Langfuse - Product Marketing Manager",
  }),
  job({
    id: "product",
    title: "Langfuse - Senior Product Engineer",
  }),
];

test("isLangfuseJobTitle matches titles that mention langfuse", () => {
  assert.equal(isLangfuseJobTitle("Langfuse - Senior Product Engineer"), true);
  assert.equal(isLangfuseJobTitle("Solutions Architect - Langfuse "), true);
  assert.equal(isLangfuseJobTitle("Senior Product Engineer"), false);
  assert.equal(isLangfuseJobTitle(undefined), false);
});

test("collectLangfuseJobs keeps ClickHouse jobs with langfuse in the name", () => {
  const clickhouse = [
    ...LIVE_JOBS,
    job({
      id: "other",
      title: "Senior Software Engineer - Cloud Infrastructure",
    }),
    job({
      id: "unlisted",
      title: "Langfuse - Hidden Role",
      isListed: false,
    }),
  ];

  const collected = collectLangfuseJobs(clickhouse, []);
  assert.ok(collected);
  assert.deepEqual(collected.map((item) => item.id).sort(), [
    "backend",
    "cloud",
    "devrel",
    "pmm",
    "product",
    "sa",
  ]);
});

test("collectLangfuseJobs includes every listed job from the Langfuse board", () => {
  const collected = collectLangfuseJobs(
    [],
    [
      job({ id: "legacy", title: "Senior Product Engineer" }),
      job({
        id: "closed",
        title: "DevRel Engineer",
        isListed: false,
      }),
    ],
  );
  assert.ok(collected);
  assert.equal(collected.length, 1);
  assert.equal(collected[0].id, "legacy");
});

test("collectLangfuseJobs returns null when availability is unknown", () => {
  assert.equal(collectLangfuseJobs(null, null), null);
  assert.equal(collectLangfuseJobs(null, []), null);
  assert.equal(
    collectLangfuseJobs(null, [
      job({ id: "closed", title: "Role", isListed: false }),
    ]),
    null,
  );
});

test("collectLangfuseJobs treats an empty ClickHouse Langfuse set as closed, not unknown", () => {
  const collected = collectLangfuseJobs(
    [job({ id: "other", title: "Account Executive" })],
    [],
  );
  assert.deepEqual(collected, []);
});

test("jobMatchesRole matches product engineer and not product marketing", () => {
  const match = {
    anyOf: ["product engineer"],
    exclude: ["growth", "integration", "marketing"],
  };
  assert.equal(jobMatchesRole(LIVE_JOBS[5], match), true);
  assert.equal(jobMatchesRole(LIVE_JOBS[4], match), false);
});

test("findJobForRole maps current ClickHouse Langfuse titles to quiz roles", () => {
  assert.equal(
    findJobForRole(LIVE_JOBS, {
      anyOf: ["product engineer"],
      exclude: ["growth", "integration", "marketing"],
    })?.id,
    "product",
  );
  assert.equal(
    findJobForRole(LIVE_JOBS, { anyOf: ["devrel", "developer relations"] })?.id,
    "devrel",
  );
  assert.equal(
    findJobForRole(LIVE_JOBS, {
      anyOf: ["cloud"],
    })?.id,
    "cloud",
  );
  assert.equal(
    findJobForRole(LIVE_JOBS, {
      anyOf: ["data infrastructure", "backend"],
      exclude: ["iam", "billing", "cloud"],
    })?.id,
    "backend",
  );
  assert.equal(
    findJobForRole(LIVE_JOBS, {
      anyOf: ["iam", "billing", "backend"],
      exclude: ["data infrastructure", "cloud"],
    })?.id,
    "backend",
  );
  assert.equal(findJobForRole(LIVE_JOBS, { anyOf: ["growth"] }), undefined);
  assert.equal(
    findJobForRole(LIVE_JOBS, { anyOf: ["integration"] }),
    undefined,
  );
  assert.equal(findJobForRole(LIVE_JOBS, { anyOf: ["sdk"] }), undefined);
});

test("findJobForRole prefers an exact Ashby posting id when present", () => {
  const matched = findJobForRole(LIVE_JOBS, { anyOf: ["backend"] }, "product");
  assert.equal(matched?.id, "product");
});

test("fallback jobs deep-link to ClickHouse postings, not a board search", () => {
  for (const job of FALLBACK_LANGFUSE_JOBS) {
    assert.match(
      job.jobUrl,
      /^https:\/\/jobs\.ashbyhq\.com\/clickhouse\/[0-9a-f-]{36}$/i,
    );
    assert.equal(job.jobUrl.includes("search="), false);
  }

  const product = findJobForRole(
    FALLBACK_LANGFUSE_JOBS,
    ROLES.product.titleMatch,
    ROLES.product.ashbyId,
  );
  assert.equal(product?.id, ROLES.product.ashbyId);
  assert.equal(product?.jobUrl, ROLES.product.url);
});

test("quiz roles match the current ClickHouse Langfuse postings", () => {
  const expected: Record<string, string | undefined> = {
    product: "product",
    growth: undefined,
    integrations: undefined,
    sdk: undefined,
    data_infra: "backend",
    iam_billing: "backend",
    cloud: "cloud",
    devrel: "devrel",
  };

  for (const [key, role] of Object.entries(ROLES)) {
    assert.equal(
      findJobForRole(LIVE_JOBS, role.titleMatch, role.ashbyId)?.id,
      expected[key],
      key,
    );
  }
});
