#!/usr/bin/env bash

echo "Updating cookbook docs... (needs to be executed from the root directory)"

# Convert notebooks to markdown using uv with inline dependencies
uv run --with nbconvert --python 3.12 -- python -m nbconvert --to markdown cookbook/*.ipynb

# delete all files in content/guides/cookbook/ (except index.mdx)
echo "Deleting all files in content/guides/cookbook/ (keeping index.mdx)"
find ./content/guides/cookbook/ -type f -not -name "index.mdx" -delete

# script needs to be executed from the root directory
echo "Moving docs..."
uv run --python 3.12 -- python ./scripts/move_docs.py

echo "Done!"
