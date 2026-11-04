#!/usr/bin/env bash
# Deepen a shallow clone to full commit history without downloading file
# contents, so the git-based lastmod dates (sitemap, fumadocs lastModified,
# contributors) stay accurate on Vercel's default shallow clone.
#
# A blobless history fetch takes about a second, while a full clone
# (VERCEL_DEEP_CLONE) downloads ~1 GB of image history on every build.
#
# Fails the build if the fetch fails. In a shallow clone, git reports the
# boundary commit as adding every file, so a deployment would silently give
# every page that commit's date.
#
# Only runs on Vercel and CI: it rewrites .git/config (diff.renames, promisor
# remote), which is fine for throwaway build checkouts but not for a
# developer's clone.

set -uo pipefail

if [[ -z "${VERCEL:-}" && -z "${CI:-}" ]]; then
  exit 0
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "[ensure-git-history] Not a git checkout; skipping."
  exit 0
fi

if [[ "$(git rev-parse --is-shallow-repository)" != "true" ]]; then
  exit 0
fi

public_url="https://github.com/${VERCEL_GIT_REPO_OWNER:-langfuse}/${VERCEL_GIT_REPO_SLUG:-langfuse-docs}.git"

# Blob-less history cannot run rename detection without lazily fetching blobs
# one by one, which turns every `git log --name-only` into thousands of requests.
git config diff.renames false

fetch_history() {
  local remote="$1"
  # A filtered fetch requires the remote to be marked as a promisor.
  git config "remote.${remote}.promisor" true
  git config "remote.${remote}.partialclonefilter" blob:none
  git fetch --quiet --filter=blob:none --unshallow "$remote" "$commit"
}

commit="$(git rev-parse HEAD)"

start=$(date +%s%N)
if git remote get-url origin >/dev/null 2>&1 && fetch_history origin; then
  source="origin"
elif { git remote add history "$public_url" 2>/dev/null || git remote set-url history "$public_url"; } && fetch_history history; then
  source="$public_url"
else
  echo "[ensure-git-history] ERROR: could not fetch git history from origin or ${public_url}." >&2
  exit 1
fi
echo "[ensure-git-history] Fetched full commit history (blobless) from ${source} in $((($(date +%s%N) - start) / 1000000))ms."
exit 0
