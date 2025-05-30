# Repo guidelines for Codex

This repository hosts the documentation for Langfuse. Refer to the main README for development instructions and additional context.

## Documentation rules
- Do **not** edit `.md` files under `pages/` directly. They are generated from Jupyter notebooks in the `cookbook/` directory. Modify the notebooks and run `bash scripts/update_cookbook_docs.sh` to regenerate docs.
- Regular docs are authored in `.mdx` files.
- Follow the style guides located in `.cursor/rules`. Codex should fetch these rule files dynamically.
- Store images in `public/images` and reference them with absolute paths like `/images/...`.

## Commit conventions
- Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages and PR titles.

## Checks before committing
Run the following commands at repo root and ensure they succeed:

```bash
pnpm install
pnpm build
```

These match the CI workflow.
