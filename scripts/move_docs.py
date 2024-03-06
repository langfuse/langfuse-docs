import json
import shutil
import os

# Load the JSON from the file
with open('./cookbook/_routes.json', 'r') as file:
    mappings = json.load(file)

# Iterate over the mappings and copy the file to all destinations, then delete the source
for mapping in mappings:
    filename = mapping['notebook']
    md_filename = filename.replace('.ipynb', '.md')
    source = 'cookbook/' + md_filename

    destinations = []
    if mapping['docsPath'] is not None:
        destinations.append(mapping['docsPath'] + ".md")
    # also publish all md files to pages/cookbook/
    destinations.append('guides/cookbook/' + md_filename)

    for destination in destinations:
        full_destination = "pages/" + destination
        print(f"cp {source} {full_destination}")
        shutil.copy(source, full_destination)
    os.remove(source)
