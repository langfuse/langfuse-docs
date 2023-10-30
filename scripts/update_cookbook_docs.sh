echo "Updating cookbook docs... (needs to be executed from the root directory)"

jupyter nbconvert --to markdown cookbook/*.ipynb

# script needs to be executed from the root directory
python ./scripts/move_docs.py
