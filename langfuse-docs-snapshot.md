# Langfuse Documentation Repository Snapshot

## Repository Overview

This is the documentation repository for Langfuse, an open-source LLM engineering platform. The repository contains:

- **Documentation pages** (`pages/` directory) - NextJS-based documentation site
- **Jupyter notebooks** (`cookbook/` directory) - Example notebooks that are automatically converted to documentation
- **Components** (`components/` directory) - React components for the documentation site
- **Scripts** (`scripts/` directory) - Automation scripts for maintaining documentation
- **Public assets** (`public/` directory) - Images, fonts, and other static assets

## Key Directory Structure

```
langfuse-docs/
├── pages/                  # Main documentation pages
│   ├── docs/              # Core documentation
│   │   ├── integrations/  # Integration guides
│   │   ├── sdk/           # SDK documentation
│   │   ├── analytics/     # Analytics features
│   │   └── ...
│   ├── guides/            # Tutorial guides
│   │   └── cookbook/      # Auto-generated from notebooks
│   ├── blog/              # Blog posts
│   ├── changelog/         # Release notes
│   └── ...
├── cookbook/              # Jupyter notebooks
│   ├── *.ipynb           # Source notebooks
│   ├── _routes.json      # Mapping configuration
│   └── ...
├── components/            # React components
├── scripts/              # Automation scripts
└── public/               # Static assets
```

## Notebook Documentation System

The repository has an automated system for converting Jupyter notebooks to documentation pages:

### The "Check if notebook docs are up to date" Script

This is located in the CI workflow at `.github/workflows/ci.yml` (lines 53-68):

```yaml
- name: Check if notebook docs are up to date
  run: |
    # Create a backup of the current state
    cp -r pages/guides/cookbook pages/guides/cookbook.backup

    # Run the update script
    bash scripts/update_cookbook_docs.sh

    # Check if any files changed
    if ! git diff --quiet pages/guides/cookbook/; then
      echo "❌ Cookbook documentation is out of sync with notebooks!"
      echo "The following files have changes:"
      git diff --name-only pages/guides/cookbook/
      echo ""
      echo "Please run 'bash scripts/update_cookbook_docs.sh' locally and commit the changes."
      echo ""
      echo "Detailed diff:"
      git diff pages/guides/cookbook/
      exit 1
    else
      echo "✅ Cookbook documentation is up to date with notebooks"
    fi
```

### How the System Works

1. **Source**: Jupyter notebooks in the `cookbook/` directory
2. **Conversion**: `scripts/update_cookbook_docs.sh` converts `.ipynb` files to `.md` files
3. **Processing**: `scripts/move_docs.py` transforms the markdown and places it in the correct locations
4. **Mapping**: `cookbook/_routes.json` defines where each notebook should be published

### The Update Process

#### Step 1: `scripts/update_cookbook_docs.sh`
```bash
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

echo "Done!"
```

#### Step 2: `scripts/move_docs.py`
This script:
- Reads the `cookbook/_routes.json` mapping file
- Processes each notebook's markdown output
- Transforms special comments into MDX components:
  - `<!-- NOTEBOOK_METADATA -->` → YAML frontmatter
  - `<!-- TABS_START -->` → `<Tabs>` components
  - `<!-- CALLOUT_START -->` → `<Callout>` components
  - `<!-- STEPS_START -->` → `<Steps>` components
  - `<!-- COMPONENT -->` → Custom component imports and usage
- Places the processed files in two locations:
  - `pages/guides/cookbook/` (always)
  - The specific path defined in `docsPath` (if specified)

### Notebook to Documentation Mapping

The `cookbook/_routes.json` file defines where each notebook should be published:

```json
[
  {
    "notebook": "datasets.ipynb",
    "docsPath": "docs/datasets/python-cookbook"
  },
  {
    "notebook": "integration_langchain.ipynb",
    "docsPath": "docs/integrations/langchain/example-python"
  },
  // ... more mappings
]
```

- `notebook`: The source notebook filename
- `docsPath`: Where the processed documentation should be placed (optional)

If `docsPath` is provided, the notebook will be published to both:
1. `pages/guides/cookbook/{notebook-name}.mdx`
2. `pages/{docsPath}.mdx`

### Special Notebook Syntax

Notebooks can include special HTML comments that get transformed into MDX components:

#### Metadata
```html
<!-- NOTEBOOK_METADATA title: "My Title" description: "My Description" -->
```
Becomes YAML frontmatter:
```yaml
---
title: My Title
description: My Description
---
```

#### Tabs
```html
<!-- TABS_START items: ["Python", "JavaScript"] -->
<!-- TAB_ITEM_START title: "Python" -->
Python code here
<!-- TAB_ITEM_END -->
<!-- TAB_ITEM_START title: "JavaScript" -->
JavaScript code here
<!-- TAB_ITEM_END -->
<!-- TABS_END -->
```
Becomes:
```jsx
<Tabs items={["Python", "JavaScript"]}>
<Tab>
Python code here
</Tab>
<Tab>
JavaScript code here
</Tab>
</Tabs>
```

#### Callouts
```html
<!-- CALLOUT_START type: "info" title: "Note" -->
Important information here
<!-- CALLOUT_END -->
```
Becomes:
```jsx
<Callout type="info" title="Note">
Important information here
</Callout>
```

#### Steps
```html
<!-- STEPS_START -->
1. First step
2. Second step
3. Third step
<!-- STEPS_END -->
```
Becomes:
```jsx
<Steps>
1. First step
2. Second step
3. Third step
</Steps>
```

#### Components
```html
<!-- COMPONENT title: "MyComponent" path: "./components/MyComponent" prop1: "value1" -->
```
Becomes:
```jsx
import MyComponent from "./components/MyComponent";

<MyComponent prop1="value1" />
```

### CI/CD Integration

The system is integrated into the CI/CD pipeline:

1. **On PR**: The `check-notebook-docs-sync` job runs to ensure documentation is up to date
2. **If out of sync**: The job fails with a clear error message and diff
3. **To fix**: Developers must run `bash scripts/update_cookbook_docs.sh` locally and commit changes

### Other Related Scripts

- `scripts/check-h1-headings.js` - Validates H1 headings in documentation
- `scripts/check-links.js` - Validates internal links
- `scripts/check-sitemap-links.js` - Validates sitemap links
- `scripts/generate_llms_txt.js` - Generates LLMs.txt file
- `scripts/load_github_discussions.py` - Loads GitHub discussions
- `scripts/update-github-stars.js` - Updates GitHub star counts

## Documentation Architecture

The documentation uses:
- **NextJS** with **Nextra** for static site generation
- **MDX** for enhanced markdown with React components
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Jupyter notebooks** as source of truth for code examples

## Key Features

1. **Automated notebook conversion** - Jupyter notebooks automatically become documentation
2. **Dual publishing** - Notebooks can be published to multiple locations
3. **Rich components** - Support for tabs, callouts, steps, and custom components
4. **CI validation** - Ensures documentation stays in sync with notebooks
5. **Link validation** - Automated checking of internal and external links
6. **SEO optimization** - Proper meta tags and structured data

This system ensures that code examples in the documentation are always executable and up-to-date, as they come directly from tested Jupyter notebooks.