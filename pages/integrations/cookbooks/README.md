# Integration Cookbook Notebooks

This directory, located at `pages/integrations/cookbooks`, contains integration-focused Jupyter notebooks that generate documentation under `pages/integrations/**` and selected guides.

## Regenerate the docs

From the repository root, run:

```bash
./scripts/update_cookbook_docs.sh
```

The script converts all notebooks with `nbconvert` and places the rendered markdown/MDX files based on `_routes.json`.

## Notes

- Update `_routes.json` whenever a notebook needs new output destinations.
- Converted markdown files are cleaned up automatically after `update_cookbook_docs.sh` finishes.

