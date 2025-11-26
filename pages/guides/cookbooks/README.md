# Guides Cookbook Notebooks

This directory, located at `pages/guides/cookbooks`, contains cookbook-style Jupyter notebooks that back the content under `pages/guides/cookbook`.

## Regenerate the docs

Run the conversion script from the repository root to update the published markdown/MDX files:

```bash
./scripts/update_cookbook_docs.sh
```

## Local environment (optional)

We use Poetry to manage Python dependencies and Deno for TypeScript-based cookbooks.

```bash
poetry install
```

To work with the Deno notebooks, install Deno and the Deno Jupyter kernel:

```bash
brew install deno
poetry shell
deno jupyter --install
```

You can then start Jupyter with:

```bash
poetry run jupyter notebook
```

