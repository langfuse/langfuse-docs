import { gunzipSync } from "node:zlib";
import { parseConsultantSkill, parseSkillFile } from "./parse-skill.mjs";

function field(block, start, length) {
  const bytes = block.subarray(start, start + length);
  const end = bytes.indexOf(0);
  return bytes.subarray(0, end === -1 ? length : end).toString("utf8");
}

function paxPath(data) {
  for (const record of data.toString("utf8").split("\n")) {
    const match = record.match(/^\d+ path=(.*)$/);
    if (match) return match[1];
  }
  return "";
}

/** Read regular files from a .tar.gz buffer, keyed by path. */
export function readTarGz(buffer) {
  const tar = gunzipSync(buffer);
  const files = new Map();
  let offset = 0;
  let nextPath = "";
  while (offset + 512 <= tar.length) {
    const header = tar.subarray(offset, offset + 512);
    if (header.every((byte) => byte === 0)) break;
    const size = parseInt(field(header, 124, 12).trim() || "0", 8);
    const type = field(header, 156, 1) || "0";
    const prefix = field(header, 345, 155);
    const name = field(header, 0, 100);
    const data = tar.subarray(offset + 512, offset + 512 + size);
    offset += 512 + Math.ceil(size / 512) * 512;

    if (type === "x") {
      nextPath = paxPath(data);
      continue;
    }
    if (type === "g") continue;
    const path = nextPath || (prefix ? `${prefix}/${name}` : name);
    nextPath = "";
    if (type === "0") files.set(path, Buffer.from(data).toString("utf8"));
  }
  return files;
}

/**
 * Collect every skill under `<root>/<skill>/SKILL.md` with its Markdown
 * references. Paths are relative to the repository root, without the
 * tarball's top-level folder.
 */
export function collectSkills(files, { root, consultantPath, consultantName }) {
  const relative = new Map();
  for (const [path, content] of files) {
    relative.set(path.replace(/^[^/]+\//, ""), content);
  }

  const consultantMarkdown = relative.get(consultantPath);
  if (consultantMarkdown === undefined) {
    throw new Error(`${consultantPath} is missing from the skills commit`);
  }
  const consultant = parseConsultantSkill(consultantMarkdown, consultantName);

  const skills = [];
  const prefix = `${root}/`;
  for (const [path, content] of relative) {
    const match = path.startsWith(prefix)
      ? path.slice(prefix.length).match(/^([^/]+)\/SKILL\.md$/)
      : null;
    if (!match) continue;
    const dir = `${prefix}${match[1]}/`;
    const skill = parseSkillFile(content, `${dir}SKILL.md`);
    const references = {};
    for (const [refPath, refContent] of relative) {
      const ref = refPath.startsWith(`${dir}references/`)
        ? refPath.slice(`${dir}references/`.length)
        : "";
      if (ref.endsWith(".md")) references[ref] = refContent;
    }
    skills.push({
      ...skill,
      references: Object.fromEntries(
        Object.entries(references).sort(([a], [b]) => a.localeCompare(b)),
      ),
    });
  }
  if (skills.length === 0) {
    throw new Error(`No skills found under ${root}/`);
  }
  skills.sort((a, b) => a.name.localeCompare(b.name));
  const names = new Set([consultant.name]);
  for (const skill of skills) {
    if (names.has(skill.name)) {
      throw new Error(`Skill name "${skill.name}" is used twice`);
    }
    names.add(skill.name);
  }
  return { consultant, skills };
}
