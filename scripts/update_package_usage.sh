#!/usr/bin/env bash
# Refreshes the GitHub dependents tables of the Python and JS SDKs, then the
# merged top list and container pulls on /adoption. Scrapes github.com, so runs take a while and
# back off on HTTP 429; run the two repos sequentially.
set -euo pipefail

cd "$(dirname "$0")/.."

for pair in "langfuse-python:python" "langfuse-js:js"; do
  repo="${pair%%:*}"
  file="./components-mdx/dependents/${pair##*:}.md"

  uv run --with github-dependents-info github-dependents-info --repo "langfuse/${repo}" --markdownfile "$file" --sort stars --mergepackages --verbose --minstars 10

  perl -pi -e 's/^# Dependents/### Dependents/; s/<img class="avatar mr-2" src="/![avatar](/g; s/" width="20" height="20" alt="">/)/g' "$file"
done

node scripts/generate-top-dependents.js
node scripts/update-container-pulls.js
pnpm exec prettier --write ./components-mdx/dependents/ ./components-mdx/adoption/
