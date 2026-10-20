#!/usr/bin/env bash

set -euo pipefail

if [[ ! -f "scripts/agents/sync-agent-shims.mjs" || ! -f ".agents/config.json" ]]; then
  echo "Skipping agent shim sync: shared agent files are not present in this install context."
  exit 0
fi

pnpm run agents:sync
pnpm run agents:check
