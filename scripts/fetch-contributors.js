#!/usr/bin/env node
// NOTE: Generates 2025 contributor data across langfuse/langfuse and langfuse/langfuse-docs.
// Filters commits since 2025-01-01, counts author/committer logins, and writes oss-contributors-2025.json.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repos = [
  { owner: "langfuse", repo: "langfuse" },
  { owner: "langfuse", repo: "langfuse-docs" },
];

const SINCE = "2025-01-01T00:00:00Z";
const OUTPUT = path.join(
  __dirname,
  "..",
  "components",
  "wrapped",
  "data",
  "oss-contributors-2025.json"
);

const token = process.env.GITHUB_TOKEN;

async function fetchCommits(owner, repo) {
  const perPage = 100;
  let page = 1;
  const commits = [];

  while (true) {
    const url = `https://api.github.com/repos/${owner}/${repo}/commits?since=${encodeURIComponent(
      SINCE
    )}&per_page=${perPage}&page=${page}`;

    const res = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "User-Agent": "langfuse-docs-contrib-fetch",
      },
    });

    if (!res.ok) {
      throw new Error(`GitHub API error ${res.status} ${res.statusText} for ${url}`);
    }

    const data = await res.json();
    commits.push(...data);

    if (data.length < perPage) break;
    page += 1;
  }

  return commits;
}

async function main() {
  const contributors = new Map();

  for (const { owner, repo } of repos) {
    const commits = await fetchCommits(owner, repo);

    for (const commit of commits) {
      const actor = commit.author ?? commit.committer;
      if (!actor || !actor.login) continue; // skip anonymous
      const login = actor.login;
      const current = contributors.get(login) || {
        login,
        url: actor.html_url,
        avatarUrl: actor.avatar_url,
        contributions: 0,
      };
      current.contributions += 1;
      contributors.set(login, current);
    }
  }

  const list = Array.from(contributors.values())
    .sort((a, b) => b.contributions - a.contributions)
    .map(({ login, url, avatarUrl, contributions }) => ({
      login,
      url,
      avatarUrl,
      contributions,
    }));

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(list, null, 2));

  console.log(`Saved ${list.length} contributors to ${OUTPUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
