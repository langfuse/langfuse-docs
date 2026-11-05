import assert from "node:assert/strict";
import test from "node:test";
import { consultantLangfuseProject } from "./langfuse-project.mjs";

const project = {
  CONSULTANT_LANGFUSE_PUBLIC_KEY: "pk-lf-consultant",
  CONSULTANT_LANGFUSE_SECRET_KEY: "sk-lf-consultant",
  CONSULTANT_LANGFUSE_BASE_URL: "https://cloud.langfuse.com/",
};

test("consultant tracing reads only its own project", () => {
  assert.deepEqual(consultantLangfuseProject(project), {
    ok: true,
    publicKey: "pk-lf-consultant",
    secretKey: "sk-lf-consultant",
    baseUrl: "https://cloud.langfuse.com",
  });
});

test("generic and demo Langfuse keys are not used for the consultant", () => {
  assert.equal(
    consultantLangfuseProject({
      LANGFUSE_PUBLIC_KEY: "pk-lf-demo",
      LANGFUSE_SECRET_KEY: "sk-lf-demo",
      LANGFUSE_BASE_URL: "https://cloud.langfuse.com",
      NEXT_PUBLIC_EU_LANGFUSE_PUBLIC_KEY: "pk-lf-eu",
      EU_LANGFUSE_SECRET_KEY: "sk-lf-eu",
    }).reason,
    "missing",
  );
});

test("consultant keys that match a demo project are refused", () => {
  assert.equal(
    consultantLangfuseProject({
      ...project,
      NEXT_PUBLIC_EU_LANGFUSE_PUBLIC_KEY:
        project.CONSULTANT_LANGFUSE_PUBLIC_KEY,
    }).reason,
    "demo",
  );
  assert.equal(
    consultantLangfuseProject({
      ...project,
      EU_LANGFUSE_SECRET_KEY: project.CONSULTANT_LANGFUSE_SECRET_KEY,
    }).reason,
    "demo",
  );
});
