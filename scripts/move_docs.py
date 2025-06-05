import json
import shutil
import os
import re

# Function to transform custom metadata, tabs, callouts, steps, and components
def transform_content_to_mdx(markdown_content):
    was_transformed_overall = False
    metadata_was_processed = False 
    content_for_processing = markdown_content 
    generated_yaml_frontmatter = "" 

    attribute_parser_regex = re.compile(r'(\w+):\s*"([^"]*)"')

    # --- Stage 1: Custom Notebook Metadata Comment to YAML Frontmatter ---
    metadata_at_start_pattern = re.compile(
        r"^\s*(<!--\s*NOTEBOOK_METADATA\s*(.*?)\s*-->)\s*\n?(.*)",
        re.DOTALL
    )
    match_at_start = metadata_at_start_pattern.match(content_for_processing)
    if match_at_start:
        metadata_was_processed = True 
        was_transformed_overall = True 
        attributes_string = match_at_start.group(2).strip()
        content_after_comment = match_at_start.group(3)
        yaml_lines = []
        for attr_match in attribute_parser_regex.finditer(attributes_string):
            key = attr_match.group(1)
            value = attr_match.group(2)
            yaml_lines.append(f"{key}: {value}")
        if yaml_lines: 
            generated_yaml_frontmatter = f"---\n" + "\n".join(yaml_lines) + "\n---\n\n"
        content_for_processing = content_after_comment
    
    # --- Stage 2: Tab Transformation --- 
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
            print(f"Warning: TABS_START/TABS_END block found but no TAB_ITEM_START/END children. Original content kept.")
            return match_obj.group(0)
        items_prop_for_mdx = json.dumps(parsed_items_for_tabs_prop)
        return f"<Tabs items={{{items_prop_for_mdx}}}>\n" + "\n".join(mdx_individual_tab_components) + "\n</Tabs>"
    content_for_processing = master_tabs_pattern.sub(replace_tabs_block_match, content_for_processing)

    # --- Stage 3: Callout Transformation --- 
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
        for attr_match in attribute_parser_regex.finditer(attributes_string_from_comment):
            key = attr_match.group(1)
            value = attr_match.group(2)
            props_for_mdx_component.append(f'{key}="{value}"')
        props_string = " ".join(props_for_mdx_component)
        if props_string: props_string = " " + props_string
        return f"<Callout{props_string}>\n{content_of_callout}\n</Callout>"
    content_for_processing = callout_block_pattern.sub(replace_callout_block_match, content_for_processing)

    # --- Stage 4: Steps Transformation ---
    steps_main_pattern = re.compile(
        r"<!--\s*STEPS_START\s*-->(.*?)<!--\s*STEPS_END\s*-->",
        re.DOTALL | re.MULTILINE
    )
    step_item_pattern = re.compile(
        r"<!--\s*STEP\s*-->(.*?)<!--\s*/STEP\s*-->",
        re.DOTALL | re.MULTILINE
    )
    def replace_steps_block_match(main_match_obj):
        nonlocal was_transformed_overall
        # The STEPS_START/END block itself means a transformation is intended.
        was_transformed_overall = True 
        inner_content = main_match_obj.group(1)
        step_mdx_parts = []
        
        # Search for individual STEP blocks within the STEPS_START/END block
        last_pos = 0
        has_inner_steps = False
        for step_match in step_item_pattern.finditer(inner_content):
            has_inner_steps = True
            # Add any non-step content before this step (should ideally be minimal/whitespace)
            # This part might be removed if structure is strict (only steps inside steps)
            # pre_step_content = inner_content[last_pos:step_match.start()].strip()
            # if pre_step_content: # If there's significant non-step content, it might be an issue
            #     print(f"Warning: Non-STEP content found inside STEPS block: '{pre_step_content[:50]}...'")
                # For now, we'll ignore it unless it becomes a problem.
            
            step_content = step_match.group(1).strip()
            step_mdx_parts.append(f"  <Step>\n    {step_content}\n  </Step>")
            last_pos = step_match.end()

        # Optional: Handle content after the last step but before STEPS_END
        # post_step_content = inner_content[last_pos:].strip()
        # if post_step_content:
        #     print(f"Warning: Content found after last STEP inside STEPS block: '{post_step_content[:50]}...'")

        if not has_inner_steps:
            print("Warning: STEPS_START/STEPS_END block found but no STEP/.../STEP children. Generating empty <Steps>.")
            return "<Steps>\n</Steps>" # Or just "" if preferred for empty steps

        return f"<Steps>\n" + "\n".join(step_mdx_parts) + "\n</Steps>"
    content_for_processing = steps_main_pattern.sub(replace_steps_block_match, content_for_processing)
    
    # --- Stage 5: Component Transformation ---
    component_comment_pattern = re.compile(
        r'<!--\s*COMPONENT\s*(.*?)\s*-->',
        re.DOTALL | re.MULTILINE
    )
    imports_seen: set[str] = set()

    def replace_component_comment(match_obj):
        nonlocal was_transformed_overall, imports_seen
        was_transformed_overall = True
        attr_string = match_obj.group(1)
        attrs = {k: v for k, v in attribute_parser_regex.findall(attr_string)}
        title = attrs.pop("title", "").strip()
        path  = attrs.pop("path", "").strip()
        other_props = " ".join(f'{k}="{v}"' for k, v in attrs.items())
        import_stmt = ""
        if title and path and title not in imports_seen:
            imports_seen.add(title)
            import_stmt = f'import {title} from "{path}";\n\n'
        props_str = f" {other_props}" if other_props else ""
        component_usage = f"<{title}{props_str} />" 
        if import_stmt:
            return f'{import_stmt}{component_usage}'
        else:
            return component_usage
    content_for_processing = component_comment_pattern.sub(replace_component_comment, content_for_processing)

    final_assembled_content = generated_yaml_frontmatter + content_for_processing
    
    return final_assembled_content, was_transformed_overall, metadata_was_processed

# --- Main script execution logic (remains the same) ---
try:
    with open('./cookbook/_routes.json', 'r', encoding='utf-8') as file:
        mappings = json.load(file)
except FileNotFoundError:
    print("Error: './cookbook/_routes.json' not found. Exiting.")
    exit(1)
except json.JSONDecodeError:
    print("Error: Could not decode JSON from './cookbook/_routes.json'. Exiting.")
    exit(1)

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
    
    processed_content_final, was_transformed_final, metadata_found = transform_content_to_mdx(original_md_content)
    
    output_extension = ".mdx" if metadata_found else ".md"
    
    filename_base_no_ext = notebook_filename.replace('.ipynb', '')

    destination_paths_to_write = []
    docs_path_value = mapping.get('docsPath')
    if docs_path_value is not None:
        path_parts = docs_path_value.split('/')
        base_filename_from_docs_path = path_parts[-1]
        if '.' in base_filename_from_docs_path:
            name_without_ext = base_filename_from_docs_path.rsplit('.', 1)[0]
        else:
            name_without_ext = base_filename_from_docs_path
        if len(path_parts) > 1:
            dir_path_from_docs_path = os.path.join(*path_parts[:-1])
            final_docs_path_filename_part = name_without_ext + output_extension
            dest_path_str = os.path.join("pages", dir_path_from_docs_path, final_docs_path_filename_part)
        else:
             dest_path_str = os.path.join("pages", name_without_ext + output_extension)
        destination_paths_to_write.append(dest_path_str)
    
    guide_dest_filename = filename_base_no_ext + output_extension 
    guide_dest_path_str = os.path.join("pages", "guides", "cookbook", guide_dest_filename)
    destination_paths_to_write.append(guide_dest_path_str)

    for full_destination_path in destination_paths_to_write:
        os.makedirs(os.path.dirname(full_destination_path), exist_ok=True)
        
        print(f"Processing: {notebook_filename} -> {full_destination_path} (Overall Transformed: {was_transformed_final}, Metadata Found: {metadata_found})")
        try:
            with open(full_destination_path, 'w', encoding='utf-8') as f_out:
                f_out.write(processed_content_final)
        except Exception as e:
            print(f"Error writing to destination file {full_destination_path}: {e}")

    try:
        os.remove(source_path)
    except Exception as e:
        print(f"Error removing source file {source_path}: {e}")

print("\nDone processing cookbook files!")