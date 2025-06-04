import json
import shutil
import os
import re

# Function to transform custom metadata, tabs, and callouts
def transform_content_to_mdx(markdown_content):
    was_transformed_overall = False
    content_for_processing = markdown_content # Start with the original content
    generated_yaml_frontmatter = "" # Will hold the YAML frontmatter if created

    # --- Stage 1: Custom Notebook Metadata Comment to YAML Frontmatter ---
    # Regex to match the metadata comment at the beginning of the string,
    # allowing for leading whitespace.
    # Group 1: The entire metadata comment itself.
    # Group 2: The attribute string within the comment.
    # Group 3: The rest of the content after the comment and any immediate trailing newline.
    metadata_at_start_pattern = re.compile(
        r"^\s*(<!--\s*NOTEBOOK_METADATA\s*(.*?)\s*-->)\s*\n?(.*)",
        re.DOTALL # DOTALL allows '.' to match newlines, important for group 3
    )

    # Attribute parsing regex (e.g., key: "value")
    attribute_parser_regex = re.compile(r'(\w+):\s*"([^"]*)"')

    match_at_start = metadata_at_start_pattern.match(content_for_processing)

    if match_at_start:
        # The comment was found at the effective beginning of the content.
        # entire_comment_matched = match_at_start.group(1) # Not directly needed for replacement now
        attributes_string = match_at_start.group(2).strip()
        content_after_comment = match_at_start.group(3) # This is the new content_for_processing

        yaml_lines = []
        for attr_match in attribute_parser_regex.finditer(attributes_string):
            key = attr_match.group(1)
            value = attr_match.group(2)
            yaml_lines.append(f"{key}: {value}")

        if yaml_lines:
            generated_yaml_frontmatter = f"---\n" + "\n".join(yaml_lines) + "\n---\n\n"
        
        # Even if no attributes were parsed (e.g., empty comment),
        # the fact that we matched and are removing the comment means a transformation occurred.
        was_transformed_overall = True
        content_for_processing = content_after_comment # Update content for subsequent stages
    
    # --- Stage 2: Tab Transformation (operates on content after potential metadata processing) --- 
    master_tabs_pattern = re.compile(
        r"<!--\s*TABS_START\s*items:\s*(\[.*?\])\s*-->(.*?)<!--\s*TABS_END\s*-->",
        re.DOTALL | re.MULTILINE
    )

    def replace_tabs_block_match(match_obj):
        nonlocal was_transformed_overall 
        was_transformed_overall = True 

        items_list_str_from_comment = match_obj.group(1)
        inner_content_of_tabs_block = match_obj.group(2)
        parsed_items_for_tabs_prop = []
        try:
            json_compatible_items_str = items_list_str_from_comment.replace("'", '"')
            parsed_items_for_tabs_prop = json.loads(json_compatible_items_str)
        except json.JSONDecodeError:
            print(f"Warning: Could not parse 'items' attribute from TABS_START comment: {items_list_str_from_comment}")
            return match_obj.group(0) 
        
        mdx_individual_tab_components = []
        tab_item_pattern = re.compile(
            r"<!--\s*TAB_ITEM_START\s+title:\s*\"(.*?)\"\s*-->(.*?)<!--\s*TAB_ITEM_END\s*-->",
            re.DOTALL | re.MULTILINE
        )
        found_tab_items = False
        for item_match in tab_item_pattern.finditer(inner_content_of_tabs_block):
            found_tab_items = True
            content_of_tab_item = item_match.group(2).strip()
            mdx_individual_tab_components.append(f"<Tab>\n{content_of_tab_item}\n</Tab>")
        
        if not found_tab_items:
            print(f"Warning: TABS_START/TABS_END block found but no TAB_ITEM_START/END children. Original content kept for this block.")
            return match_obj.group(0)

        items_prop_for_mdx = json.dumps(parsed_items_for_tabs_prop)
        return f"<Tabs items={{{items_prop_for_mdx}}}>\n" + "\n".join(mdx_individual_tab_components) + "\n</Tabs>"

    content_after_tabs = master_tabs_pattern.sub(replace_tabs_block_match, content_for_processing)
    content_for_processing = content_after_tabs

    # --- Stage 3: Callout Transformation (operates on content after tab processing) --- 
    callout_block_pattern = re.compile(
        r"<!--\s*CALLOUT_START\s*(.*?)\s*-->(.*?)<!--\s*CALLOUT_END\s*-->",
        re.DOTALL | re.MULTILINE
    )
    
    def replace_callout_block_match(match_obj):
        nonlocal was_transformed_overall
        was_transformed_overall = True
        attributes_string_from_comment = match_obj.group(1)
        content_of_callout = match_obj.group(2).strip()
        props_for_mdx_component = []
        for attr_match in attribute_parser_regex.finditer(attributes_string_from_comment): # Reusing attribute_parser_regex
            key = attr_match.group(1)
            value = attr_match.group(2)
            props_for_mdx_component.append(f'{key}="{value}"')
        props_string = " ".join(props_for_mdx_component)
        if props_string: props_string = " " + props_string
        return f"<Callout{props_string}>\n{content_of_callout}\n</Callout>"

    content_after_callouts = callout_block_pattern.sub(replace_callout_block_match, content_for_processing)
    content_for_processing = content_after_callouts
    
    # Prepend the generated YAML frontmatter (if any) to the processed content
    final_assembled_content = generated_yaml_frontmatter + content_for_processing
    
    return final_assembled_content, was_transformed_overall

# --- Main script execution logic (remains the same) ---
# Load the JSON route mappings
try:
    with open('./cookbook/_routes.json', 'r', encoding='utf-8') as file:
        mappings = json.load(file)
except FileNotFoundError:
    print("Error: './cookbook/_routes.json' not found. Exiting.")
    exit(1)
except json.JSONDecodeError:
    print("Error: Could not decode JSON from './cookbook/_routes.json'. Exiting.")
    exit(1)

# Iterate over the mappings
for mapping in mappings:
    notebook_filename = mapping.get('notebook')
    if not notebook_filename:
        print(f"Warning: Skipping mapping due to missing 'notebook' field: {mapping}")
        continue

    md_source_filename = notebook_filename.replace('.ipynb', '.md')
    source_path = os.path.join('cookbook', md_source_filename)

    if not os.path.exists(source_path):
        print(f"Warning: Source file {source_path} not found. Skipping.")
        continue

    try:
        with open(source_path, 'r', encoding='utf-8') as f:
            original_md_content = f.read()
    except Exception as e:
        print(f"Error reading source file {source_path}: {e}. Skipping.")
        continue
    
    processed_content_final, was_transformed_final = transform_content_to_mdx(original_md_content)
    output_extension = ".md" # Always output .md files
    filename_base_no_ext = notebook_filename.replace('.ipynb', '')

    destination_paths_to_write = []
    docs_path_value = mapping.get('docsPath')
    if docs_path_value is not None:
        dest_path_str = os.path.join("pages", docs_path_value + output_extension) 
        destination_paths_to_write.append(dest_path_str)
    
    guide_dest_filename = filename_base_no_ext + output_extension 
    guide_dest_path_str = os.path.join("pages", "guides", "cookbook", guide_dest_filename)
    destination_paths_to_write.append(guide_dest_path_str)

    for full_destination_path in destination_paths_to_write:
        print(f"Processing: {notebook_filename} -> {full_destination_path} (Transformed: {was_transformed_final})")
        try:
            os.makedirs(os.path.dirname(full_destination_path), exist_ok=True)
            with open(full_destination_path, 'w', encoding='utf-8') as f_out:
                f_out.write(processed_content_final)
        except Exception as e:
            print(f"Error writing to destination file {full_destination_path}: {e}")

    try:
        os.remove(source_path)
    except Exception as e:
        print(f"Error removing source file {source_path}: {e}")

print("\nDone processing cookbook files!")