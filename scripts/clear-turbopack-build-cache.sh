#!/usr/bin/env bash
# Delete the Turbopack build cache left behind by earlier builds.
#
# next.config.mjs sets turbopackFileSystemCacheForBuild: false because a warm
# cache does not make this site compile faster, but it adds ~1 GB to the Vercel
# build cache. Turning the option off only stops Next.js from using the
# directory; it does not remove one that already exists.
#
# Vercel restores .next/cache from the previous deployment and uploads it again
# after the build, so a stale .next/cache/turbopack would be downloaded and
# re-uploaded on every build even though nothing reads it.

set -euo pipefail

rm -rf .next/cache/turbopack
