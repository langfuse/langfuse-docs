import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { CONSULTANT_PLAN_SECTIONS } from "./parse-skill.mjs";
import { collectSkills, readTarGz } from "./skill-bundle.mjs";

const playbook = `---
name: langfuse-consultant
description: Help the user decide on their next step.
---

# Consultant

${CONSULTANT_PLAN_SECTIONS.map((section, index) => `${index + 1}. **${section}:** text.`).join("\n")}
`;

const mainSkill = `---
name: langfuse
description: >-
  Interact with Langfuse
  and its docs.
allowed-tools:
  - WebFetch(domain:langfuse.com)
---

# Langfuse

See references/instrumentation.md.
`;

const options = {
  root: "skills",
  consultantPath: "skills/langfuse/references/consultant.md",
  consultantName: "langfuse-consultant",
};

function files(entries) {
  return new Map(
    Object.entries(entries).map(([file, content]) => [
      `skills-abc/${file}`,
      content,
    ]),
  );
}

test("collectSkills reads every skill with its references", () => {
  const { consultant, skills } = collectSkills(
    files({
      "README.md": "# Skills",
      "skills/langfuse/SKILL.md": mainSkill,
      "skills/langfuse/references/consultant.md": playbook,
      "skills/langfuse/references/instrumentation.md": "# Instrumentation",
      "skills/langfuse/scripts/run.sh": "echo hi",
      "skills/migrate-to-langfuse/SKILL.md": mainSkill.replace(
        "name: langfuse",
        "name: migrate-to-langfuse",
      ),
      ".cursor/skills/skill-creator/SKILL.md": mainSkill.replace(
        "name: langfuse",
        "name: skill-creator",
      ),
    }),
    options,
  );
  assert.equal(consultant.name, "langfuse-consultant");
  assert.deepEqual(
    skills.map((skill) => skill.name),
    ["langfuse", "migrate-to-langfuse"],
  );
  assert.equal(skills[0].description, "Interact with Langfuse and its docs.");
  assert.deepEqual(Object.keys(skills[0].references), [
    "consultant.md",
    "instrumentation.md",
  ]);
  assert.deepEqual(skills[1].references, {});
});

test("collectSkills fails without the playbook or with a bad skill", () => {
  assert.throws(() =>
    collectSkills(files({ "skills/langfuse/SKILL.md": mainSkill }), options),
  );
  assert.throws(() =>
    collectSkills(
      files({
        "skills/langfuse/SKILL.md": "# No frontmatter",
        "skills/langfuse/references/consultant.md": playbook,
      }),
      options,
    ),
  );
});

test("readTarGz reads files from a GitHub-style tarball", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "consultant-skills-"));
  const top = path.join(dir, "skills-abc", "skills", "langfuse", "references");
  fs.mkdirSync(top, { recursive: true });
  fs.writeFileSync(path.join(top, "consultant.md"), playbook);
  const archive = path.join(dir, "skills.tgz");
  execFileSync("tar", ["-czf", archive, "-C", dir, "skills-abc"]);
  const entries = readTarGz(fs.readFileSync(archive));
  assert.equal(
    entries.get("skills-abc/skills/langfuse/references/consultant.md"),
    playbook,
  );
  fs.rmSync(dir, { recursive: true, force: true });
});
