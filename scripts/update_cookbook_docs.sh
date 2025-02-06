echo "Updating cookbook docs... (needs to be executed from the root directory)"

jupyter nbconvert --to markdown cookbook/*.ipynb

# delete all files in pages/guides/cookbook/
echo "Deleting all files in pages/guides/cookbook/"
rm -rf ./pages/guides/cookbook/*

# script needs to be executed from the root directory
echo "Moving docs..."
python ./scripts/move_docs.py

echo "Done!"
