echo "Updating cookbook docs... (needs to be executed from the root directory)"

jupyter nbconvert --to markdown cookbook/*.ipynb

# delete all files in pages/guides/cookbook/
echo "Deleting all files in pages/guides/cookbook/"
# Keep only index.mdx and meta.tsx files, remove all others
find ./pages/guides/cookbook/ -type f -not -name "index.mdx" -not -name "_meta.tsx" -delete

# script needs to be executed from the root directory
echo "Moving docs..."
python ./scripts/move_docs.py

echo "Done!"
