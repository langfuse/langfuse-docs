import json
import shutil

# Load the JSON from the file
with open('./cookbook/_routes.json', 'r') as file:
    mappings = json.load(file)

# Iterate over the mappings and print the 'mv' commands
for mapping in mappings:
    source = mapping['source']
    destination = "pages" + mapping['destination']
    print(f"mv {source} {destination}")
    shutil.move(source, destination)
