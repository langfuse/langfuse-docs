import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { CONSULTANT_SKILL_PIN } from "./pin.mjs";
import {
  CONSULTANT_PLAN_SECTIONS,
  parseConsultantSkill,
} from "./parse-skill.mjs";

const playbook = `---
name: langfuse-consultant
description: Help the user decide on their next step.
---

# Consultant

1. **Status quo:** gaps.
2. **Your plan:** steps.
3. **Where you are in the loop:** entry point.
4. **What to instrument or evaluate:** items.
5. **Start this week:** one action.
6. **Docs:** links.
7. **Prompt for your coding agent:** a prompt.
`;

test("parseConsultantSkill reads frontmatter and instructions", () => {
  const skill = parseConsultantSkill(playbook, "langfuse-consultant");
  assert.equal(skill.name, "langfuse-consultant");
  assert.match(skill.description, /next step/);
  assert.match(skill.instructions, /^# Consultant/);
});

test("parseConsultantSkill rejects a missing or wrong playbook", () => {
  assert.throws(() =>
    parseConsultantSkill("no frontmatter", "langfuse-consultant"),
  );
  assert.throws(() =>
    parseConsultantSkill(
      playbook.replace("name: langfuse-consultant", "name: other-skill"),
      "langfuse-consultant",
    ),
  );
  assert.throws(() =>
    parseConsultantSkill(
      playbook.replace("**Status quo:**", "**Current state:**"),
      "langfuse-consultant",
    ),
  );
  assert.throws(() => parseConsultantSkill("", "langfuse-consultant"));
});

test("baked consultant skill matches the pin", () => {
  const source = fs.readFileSync(
    new URL("./skill.generated.ts", import.meta.url),
    "utf8",
  );
  assert.match(source, new RegExp(CONSULTANT_SKILL_PIN.sha));
  assert.match(source, new RegExp(CONSULTANT_SKILL_PIN.name));
  assert.match(source, new RegExp(CONSULTANT_SKILL_PIN.branch));
  for (const section of CONSULTANT_PLAN_SECTIONS) {
    assert.match(
      source,
      new RegExp(section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    );
  }
  assert.match(source, /export const consultantAllSkillSources/);
  assert.match(source, /"name": "langfuse"|name: "langfuse"/);
  assert.match(source, /"consultant\.md":/);
});
