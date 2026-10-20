#!/usr/bin/env bash

set -euo pipefail

echo "Updating cookbook docs... (needs to be executed from the root directory)"

# Validate all notebooks BEFORE touching any generated docs. A single invalid
# notebook makes `nbconvert cookbook/*.ipynb` abort mid-batch, leaving every
# notebook after it (alphabetically) unconverted. Because the next step deletes
# all generated docs and regenerates only from successfully converted notebooks,
# that silently wipes the downstream docs. Fail loudly here instead, before any
# deletion happens.
echo "Validating notebooks..."
uv run --with nbformat --python 3.12 -- python -c "
import glob, sys, nbformat
invalid = []
for path in sorted(glob.glob('cookbook/*.ipynb')):
    try:
        nbformat.validate(nbformat.read(path, as_version=4))
    except Exception as e:
        invalid.append((path, str(e).splitlines()[0]))
if invalid:
    print('ERROR: invalid notebook(s) found — aborting before any docs are deleted:')
    for path, msg in invalid:
        print(f'  - {path}: {msg}')
    print('Fix the notebook (e.g. re-save it, or run nbformat normalize) and retry.')
    sys.exit(1)
print('All notebooks valid.')
"

# Convert notebooks to markdown using uv with inline dependencies
uv run --with nbconvert --python 3.12 -- python -m nbconvert --to markdown cookbook/*.ipynb

# delete all files in content/guides/cookbook/ (except index.mdx and meta.json)
# meta.json is the hand-maintained Fumadocs navigation order and is NOT generated
# by move_docs.py, so it must be preserved across runs.
echo "Deleting all files in content/guides/cookbook/ (keeping index.mdx and meta.json)"
find ./content/guides/cookbook/ -type f -not -name "index.mdx" -not -name "meta.json" -delete

# script needs to be executed from the root directory
echo "Moving docs..."
uv run --python 3.12 -- python ./scripts/move_docs.py

echo "Done!"
