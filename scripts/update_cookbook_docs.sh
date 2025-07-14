#!/usr/bin/env bash

echo "Updating cookbook docs... (needs to be executed from the root directory)"

# Convert notebooks to markdown using uv with inline dependencies
uv run --with nbconvert --python 3.11 -- python -m nbconvert --to markdown cookbook/*.ipynb

# delete all files in pages/guides/cookbook/
echo "Deleting all files in pages/guides/cookbook/"
# Keep only index.mdx and meta.tsx files, remove all others
find ./pages/guides/cookbook/ -type f -not -name "index.mdx" -not -name "_meta.tsx" -delete

# script needs to be executed from the root directory
echo "Moving docs..."
uv run --python 3.11 -- python ./scripts/move_docs.py

# format all files
echo "Formatting all files..."
pnpm format

echo "Done!"
