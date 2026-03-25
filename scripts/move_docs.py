import json
import shutil
import os
import re

# Words that should stay lowercase in title case (unless first word)
_TITLE_CASE_MINOR_WORDS = {
    'a', 'an', 'the', 'and', 'but', 'or', 'nor', 'for', 'yet', 'so',
    'at', 'by', 'in', 'of', 'on', 'to', 'up', 'as', 'is', 'if', 'it',
    'with', 'from', 'into', 'via',
}

def smart_title_case(s):
    """Title-case a string, keeping minor words (prepositions, articles) lowercase."""
    words = s.split()
    result = []
    for i, word in enumerate(words):
        if i == 0 or word.lower() not in _TITLE_CASE_MINOR_WORDS:
            result.append(word.capitalize())
        else:
            result.append(word.lower())
    return ' '.join(result)


# Function to transform custom metadata, tabs, callouts, steps, and components
def transform_content_to_mdx(markdown_content, notebook_name=None):
    was_transformed_overall = False
    uses_mdx_components = False
    metadata_was_processed = False
    content_for_processing = markdown_content
    generated_yaml_frontmatter = "" 

    attribute_parser_regex = re.compile(r'(\w+):\s*"([^"]*)"')

    # Helper: quote a YAML value if it contains special characters
    def yaml_quote(value):
        """Quote a YAML value only when it contains characters that would
        break plain-scalar parsing (colons, hash signs, flow indicators, etc.).
        Commas, periods, and apostrophes are safe unquoted."""
        if any(c in value for c in ':{}[]&*?|>!%@`"#'):
            value = value.replace('"', '\\"')
            value = f'"{value}"'
        return value

    # --- Stage 1: Custom Notebook Metadata Comment to YAML Frontmatter ---
    # Search for NOTEBOOK_METADATA anywhere in the content (it may be preceded
    # by a raw-cell YAML frontmatter block from nbconvert).
    metadata_anywhere_pattern = re.compile(
        r"<!--\s*NOTEBOOK_METADATA\s*(.*?)\s*-->",
        re.DOTALL
    )
    metadata_match = metadata_anywhere_pattern.search(content_for_processing)
    if metadata_match:
        metadata_was_processed = True
        was_transformed_overall = True
        attributes_string = metadata_match.group(1).strip()
        # Remove the NOTEBOOK_METADATA comment from content
        content_for_processing = content_for_processing[:metadata_match.start()] + content_for_processing[metadata_match.end():]
        # Also strip any existing YAML frontmatter (e.g. from a raw cell) since
        # NOTEBOOK_METADATA is the authoritative source.
        content_for_processing = re.sub(
            r"^\s*---\s*\n.*?\n---\s*\n",
            "",
            content_for_processing,
            count=1,
            flags=re.DOTALL
        )
        content_for_processing = content_for_processing.lstrip("\n")
        yaml_lines = []
        for attr_match in attribute_parser_regex.finditer(attributes_string):
            key = attr_match.group(1)
            value = attr_match.group(2)
            # Strip leading markdown heading syntax from title values
            if key == "title":
                value = re.sub(r'^#+\s*', '', value)
            yaml_lines.append(f"{key}: {yaml_quote(value)}")
        if yaml_lines:
            generated_yaml_frontmatter = f"---\n" + "\n".join(yaml_lines) + "\n---\n\n"
    else:
        # No NOTEBOOK_METADATA found — check if the content already has YAML
        # frontmatter (e.g. from a raw cell in the notebook).
        existing_frontmatter_match = re.match(
            r"^\s*---\s*\n(.*?)\n---\s*\n(.*)",
            content_for_processing,
            re.DOTALL
        )
        if existing_frontmatter_match:
            # Content already has valid frontmatter — leave it as-is.
            # Verify it has a title field; if not, inject one.
            fm_block = existing_frontmatter_match.group(1)
            if not re.search(r"^title\s*:", fm_block, re.MULTILINE):
                # Prefer filename-derived title for sidebar (shorter/cleaner).
                if notebook_name:
                    title = smart_title_case(notebook_name.replace('.ipynb', '').replace('_', ' ').replace('-', ' '))
                else:
                    heading_match = re.search(r"^#\s+(.+)", existing_frontmatter_match.group(2), re.MULTILINE)
                    if heading_match:
                        title = heading_match.group(1).strip()
                    else:
                        title = "Untitled"
                title = yaml_quote(title)
                fm_block = f"title: {title}\n{fm_block}"
                content_for_processing = f"---\n{fm_block}\n---\n{existing_frontmatter_match.group(2)}"
        else:
            # No frontmatter at all — generate minimal frontmatter from content.
            # Fumadocs requires at least a `title` field in frontmatter.
            # Prefer filename-derived title for sidebar (shorter/cleaner).
            if notebook_name:
                title = smart_title_case(notebook_name.replace('.ipynb', '').replace('_', ' ').replace('-', ' '))
            else:
                heading_match = re.match(r"^\s*#\s+(.+)", content_for_processing, re.MULTILINE)
                if heading_match:
                    title = heading_match.group(1).strip()
                else:
                    title = "Untitled"
            title = yaml_quote(title)
            generated_yaml_frontmatter = f"---\ntitle: {title}\n---\n\n"
    
    # --- Stage 2: Tab Transformation --- 
    master_tabs_pattern = re.compile(
        r"<!--\s*TABS_START\s*items:\s*(\[.*?\])\s*-->(.*?)<!--\s*TABS_END\s*-->",
        re.DOTALL | re.MULTILINE
    )
    def replace_tabs_block_match(match_obj):
        nonlocal was_transformed_overall, uses_mdx_components
        was_transformed_overall = True
        uses_mdx_components = True
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
        nonlocal was_transformed_overall, uses_mdx_components
        was_transformed_overall = True
        uses_mdx_components = True
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

    # --- Stage 4: Steps Transformation (Simplified) ---
    # This pattern will find blocks starting with <!-- STEPS_START -->
    # and ending with <!-- STEPS_END -->, capturing the content in between.
    steps_simplified_pattern = re.compile(
        r"<!--\s*STEPS_START\s*-->(.*?)<!--\s*STEPS_END\s*-->",
        re.DOTALL | re.MULTILINE
    )
    def replace_steps_simplified_match(match_obj):
        nonlocal was_transformed_overall, uses_mdx_components
        was_transformed_overall = True
        uses_mdx_components = True
        # Group 1 is the content between STEPS_START and STEPS_END
        inner_content = match_obj.group(1).strip() 
        # The inner_content is directly placed inside <Steps>
        # If your <Steps> component in MDX expects child <Step> components,
        # you would need to ensure the Markdown content *within* the STEPS_START/END
        # is structured in a way that MDX can interpret as individual steps,
        # or that the <Steps> component itself handles raw Markdown children appropriately.
        # For this transformation, we are just wrapping the block.
        return f"<Steps>\n{inner_content}\n</Steps>"
        
    content_for_processing = steps_simplified_pattern.sub(replace_steps_simplified_match, content_for_processing)
    
    # --- Stage 5: Component Transformation ---
    component_comment_pattern = re.compile(
        r'<!--\s*(?:COMPONENT|MARKDOWN_COMPONENT)\s*(.*?)\s*-->',
        re.DOTALL | re.MULTILINE
    )
    imports_seen: set[str] = set()

    def replace_component_comment(match_obj):
        nonlocal was_transformed_overall, uses_mdx_components, imports_seen
        was_transformed_overall = True
        uses_mdx_components = True
        attr_string = match_obj.group(1)
        attrs = {k: v for k, v in attribute_parser_regex.findall(attr_string)}
        title = attrs.pop("title", "").strip() or attrs.pop("name", "").strip()
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
    
    return final_assembled_content, was_transformed_overall, metadata_was_processed, uses_mdx_components

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
    
    processed_content_final, was_transformed_final, metadata_found, needs_mdx = transform_content_to_mdx(original_md_content, notebook_filename)

    output_extension = ".mdx" if needs_mdx else ".md"
    
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
            dest_path_str = os.path.join("content", dir_path_from_docs_path, final_docs_path_filename_part)
        else:
             dest_path_str = os.path.join("content", name_without_ext + output_extension)
        destination_paths_to_write.append(dest_path_str)

    # Only add to guides/cookbook if the mapping is marked as a guide (default True)
    if mapping.get('isGuide', True):
        guide_dest_filename = filename_base_no_ext + output_extension
        guide_dest_path_str = os.path.join("content", "guides", "cookbook", guide_dest_filename)
        destination_paths_to_write.append(guide_dest_path_str)

    for full_destination_path in destination_paths_to_write:
        os.makedirs(os.path.dirname(full_destination_path), exist_ok=True)

        # Remove the opposite-extension file to avoid duplicate slugs
        # (e.g. if writing .md, remove any existing .mdx at the same path)
        opposite_ext = ".md" if output_extension == ".mdx" else ".mdx"
        opposite_path = full_destination_path.rsplit(output_extension, 1)[0] + opposite_ext
        if os.path.exists(opposite_path):
            os.remove(opposite_path)
            print(f"Removed stale file: {opposite_path}")

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